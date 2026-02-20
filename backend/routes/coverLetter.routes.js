import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import CoverLetter from '../models/CoverLetter.model.js';
import Resume from '../models/Resume.model.js';
import User from '../models/User.model.js';
import { generateCoverLetterWithAI } from '../utils/aiAnalyzer.js';

const router = express.Router();

// Generate cover letter
router.post('/generate', authenticate, async (req, res) => {
  try {
    const { jobTitle, companyName, hiringManager, jobDescription, tone, resumeId } = req.body;

    if (!jobTitle || !companyName || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'Job title, company name, and job description are required'
      });
    }

    // Get user's resume if provided
    let userResume = '';
    if (resumeId) {
      const resume = await Resume.findOne({
        _id: resumeId,
        userId: req.user._id
      });
      if (resume) {
        userResume = resume.parsedData.rawText || JSON.stringify(resume.parsedData);
      }
    }

    // Generate cover letter with AI
    const generatedLetter = await generateCoverLetterWithAI(
      jobTitle,
      companyName,
      hiringManager,
      jobDescription,
      tone || 'professional',
      userResume
    );

    // Save cover letter
    const coverLetter = await CoverLetter.create({
      userId: req.user._id,
      jobTitle,
      companyName,
      hiringManager,
      jobDescription,
      tone: tone || 'professional',
      generatedLetter
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.coverLettersGenerated': 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Cover letter generated successfully',
      data: {
        coverLetter
      }
    });
  } catch (error) {
    console.error('Cover letter generation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all cover letters
router.get('/list', authenticate, async (req, res) => {
  try {
    const coverLetters = await CoverLetter.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('-generatedLetter'); // Exclude letter content for list view

    res.json({
      success: true,
      data: {
        coverLetters,
        count: coverLetters.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single cover letter
router.get('/:id', authenticate, async (req, res) => {
  try {
    const coverLetter = await CoverLetter.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!coverLetter) {
      return res.status(404).json({
        success: false,
        message: 'Cover letter not found'
      });
    }

    res.json({
      success: true,
      data: {
        coverLetter
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete cover letter
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const coverLetter = await CoverLetter.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!coverLetter) {
      return res.status(404).json({
        success: false,
        message: 'Cover letter not found'
      });
    }

    res.json({
      success: true,
      message: 'Cover letter deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
