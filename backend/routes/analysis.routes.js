import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import Resume from '../models/Resume.model.js';
import { analyzeResumeWithAI } from '../utils/aiAnalyzer.js';

const router = express.Router();

// Analyze resume
router.post('/:resumeId', authenticate, async (req, res) => {
  const requestId = `analysis-${Date.now()}`;
  console.log(`🔍 [${requestId}] ========== ANALYSIS REQUEST STARTED ==========`);
  console.log(`[${requestId}] Resume ID:`, req.params.resumeId);
  console.log(`[${requestId}] User:`, req.user.email);
  console.log(`[${requestId}] Has job description:`, !!req.body.jobDescription);
  
  try {
    const { jobDescription } = req.body;
    const { resumeId } = req.params;

    // Find resume
    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user._id
    });

    if (!resume) {
      console.log(`[${requestId}] ❌ Resume not found`);
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    console.log(`[${requestId}] 📄 Resume found, starting AI analysis...`);

    // Analyze with AI - wrapped in try/catch
    let analysis;
    try {
      analysis = await analyzeResumeWithAI(
        resume.parsedData.rawText || JSON.stringify(resume.parsedData),
        jobDescription || ''
      );
      console.log(`[${requestId}] ✅ AI analysis completed`);
    } catch (aiError) {
      console.error(`[${requestId}] ❌ AI analysis failed:`, aiError.message);
      console.error(`[${requestId}] Stack:`, aiError.stack);
      
      // Return error but don't crash server
      return res.status(500).json({
        success: false,
        message: 'AI analysis failed: ' + aiError.message,
        errorCode: 'AI_ANALYSIS_FAILED'
      });
    }

    console.log(`[${requestId}] Analysis received from AI:`, JSON.stringify(analysis, null, 2));

    // Deep clone to ensure Mongoose doesn't modify the data
    // Extra safety: Convert any objects in suggestions to strings
    let suggestions = [];
    if (Array.isArray(analysis.suggestions)) {
      suggestions = analysis.suggestions.map(item => {
        if (typeof item === 'string') {
          return item;
        } else if (typeof item === 'object' && item !== null) {
          // If AI returned object format, extract the message
          return item.message || item.text || JSON.stringify(item);
        }
        return String(item);
      });
    }

    const analysisData = JSON.parse(JSON.stringify({
      jobDescription: jobDescription || 'General Analysis',
      overallScore: Number(analysis.overallScore) || 75,
      contentScore: Number(analysis.contentScore) || 80,
      keywordScore: Number(analysis.keywordScore) || 70,
      formatScore: Number(analysis.formatScore) || 85,
      atsScore: Number(analysis.atsScore) || 75,
      keywordMatches: Array.isArray(analysis.keywordMatches) ? analysis.keywordMatches : [],
      missingSkills: Array.isArray(analysis.missingSkills) ? analysis.missingSkills : [],
      suggestions: suggestions
    }));

    console.log(`[${requestId}] Formatted analysis data:`, JSON.stringify(analysisData, null, 2));
    console.log(`[${requestId}] Type check - suggestions is array:`, Array.isArray(analysisData.suggestions));
    console.log(`[${requestId}] Type check - keywordMatches is array:`, Array.isArray(analysisData.keywordMatches));

    // Save analysis result - wrapped in try/catch
    try {
      resume.analysisResults.push(analysisData);
      await resume.save();
      console.log(`[${requestId}] ✅ Analysis saved to database`);
    } catch (saveError) {
      console.error(`[${requestId}] ❌ Failed to save analysis:`, saveError.message);
      // Continue anyway - we can still return the analysis
    }

    console.log(`[${requestId}] ✅ ========== ANALYSIS COMPLETE ==========`);

    res.json({
      success: true,
      message: 'Resume analyzed successfully',
      data: {
        analysis: {
          ...analysis,
          resumeId: resume._id,
          analyzedAt: new Date()
        }
      }
    });
  } catch (error) {
    console.error(`[${requestId}] ❌ ========== ANALYSIS ERROR ==========`);
    console.error(`[${requestId}] Error:`, error.message);
    console.error(`[${requestId}] Stack:`, error.stack);
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze resume',
      errorCode: 'ANALYSIS_ERROR'
    });
  }
});

// Get analysis history
router.get('/history/:resumeId', authenticate, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.resumeId,
      userId: req.user._id
    }).select('analysisResults fileName');

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    res.json({
      success: true,
      data: {
        fileName: resume.fileName,
        analyses: resume.analysisResults
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get dashboard statistics
router.get('/dashboard/stats', authenticate, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id });
    
    // Calculate average scores
    let totalScore = 0;
    let analysisCount = 0;
    let latestAnalysis = null;

    resumes.forEach(resume => {
      if (resume.analysisResults && resume.analysisResults.length > 0) {
        const latest = resume.analysisResults[resume.analysisResults.length - 1];
        totalScore += latest.overallScore;
        analysisCount++;
        
        if (!latestAnalysis || latest.analyzedAt > latestAnalysis.analyzedAt) {
          latestAnalysis = {
            ...latest.toObject(),
            resumeId: resume._id,
            fileName: resume.fileName
          };
        }
      }
    });

    const averageScore = analysisCount > 0 ? Math.round(totalScore / analysisCount) : 0;

    // Get recent activity
    const recentActivity = resumes
      .slice(0, 5)
      .map(resume => ({
        action: 'Resume analyzed',
        file: resume.fileName,
        time: getTimeAgo(resume.createdAt),
        status: 'complete'
      }));

    res.json({
      success: true,
      data: {
        stats: {
          averageScore,
          totalResumes: resumes.length,
          totalAnalyses: analysisCount,
          atsCompatibility: latestAnalysis ? getATSRating(latestAnalysis.atsScore) : 'N/A'
        },
        latestAnalysis,
        recentActivity,
        scoreBreakdown: latestAnalysis ? {
          content: latestAnalysis.contentScore,
          keywords: latestAnalysis.keywordScore,
          format: latestAnalysis.formatScore,
          ats: latestAnalysis.atsScore
        } : null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Helper functions
const getATSRating = (score) => {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Needs Improvement';
};

const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return date.toLocaleDateString();
};

export default router;
