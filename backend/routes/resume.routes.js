import express from 'express';
import multer from 'multer';
import path from 'path';
import cloudinary from '../config/cloudinary.config.js';
import { authenticate } from '../middleware/auth.middleware.js';
import Resume from '../models/Resume.model.js';
import User from '../models/User.model.js';
import { parsePDF, parseDOCX, extractResumeData } from '../utils/fileParser.js';
import { generateResumePDF, ensureUploadsDirectory } from '../utils/pdfGenerator.js';

const router = express.Router();

// Test endpoint
router.get('/test', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Resume route is working',
    user: req.user.email
  });
});

// Create resume from builder (generate PDF)
router.post('/create', authenticate, async (req, res) => {
  console.log('📝 ========== CREATE RESUME REQUEST ==========');
  console.log('User:', req.user?.email);
  console.log('Form Data:', req.body);

  try {
    const resumeData = req.body;

    // Validate required fields
    if (!resumeData.fullName) {
      return res.status(400).json({
        success: false,
        message: 'Full name is required'
      });
    }

    // Ensure uploads directory exists
    ensureUploadsDirectory();

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `resume_${req.user._id}_${timestamp}.pdf`;
    const outputPath = path.join(process.cwd(), 'uploads', 'resumes', fileName);
    
    // Store FULL backend URL instead of relative path
    const backendURL = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5001}`;
    const fileUrl = `${backendURL}/uploads/resumes/${fileName}`;

    console.log('📄 Generating PDF:', fileName);
    console.log('📍 File URL:', fileUrl);

    // Generate PDF
    await generateResumePDF(resumeData, outputPath);

    console.log('✅ PDF generated successfully');

    // Get file size
    const fs = await import('fs');
    const stats = fs.statSync(outputPath);
    const fileSize = stats.size;

    // Parse skills into array
    let skillsArray = [];
    if (typeof resumeData.skills === 'string') {
      skillsArray = resumeData.skills.split(',').map(s => s.trim()).filter(Boolean);
    } else if (Array.isArray(resumeData.skills)) {
      skillsArray = resumeData.skills;
    }

    // Create resume record in database
    const resume = await Resume.create({
      userId: req.user._id,
      fileName: fileName,
      fileUrl: fileUrl,
      fileType: 'pdf',
      fileSize: fileSize,
      parsedData: {
        fullName: resumeData.fullName,
        email: resumeData.email,
        phone: resumeData.phone,
        location: resumeData.location,
        summary: resumeData.summary,
        experience: resumeData.experience || [],
        education: resumeData.education || [],
        skills: skillsArray
      }
    });

    console.log('✅ Resume saved to database with ID:', resume._id);

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.resumesAnalyzed': 1 }
    });

    console.log('✅ ========== CREATE RESUME COMPLETE ==========');

    res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      data: {
        resume: {
          _id: resume._id,
          fileName: resume.fileName,
          fileUrl: resume.fileUrl,
          createdAt: resume.createdAt
        }
      }
    });

  } catch (error) {
    console.error('❌ ========== CREATE RESUME ERROR ==========');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create resume'
    });
  }
});

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, and DOCX are allowed.'));
    }
  }
});

// Upload and parse resume
router.post('/upload', authenticate, upload.single('resume'), async (req, res) => {
  console.log('📤 ========== UPLOAD REQUEST STARTED ==========');
  console.log('User:', req.user?.email);
  console.log('File:', req.file ? 'Present' : 'Missing');
  
  try {
    if (!req.file) {
      console.log('❌ No file in request');
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    console.log('📄 File received:', req.file.originalname);
    console.log('📄 File size:', req.file.size, 'bytes');
    console.log('📄 File type:', req.file.mimetype);

    // Parse file based on type
    console.log('📝 Starting file parsing...');
    let extractedText = '';
    const fileType = req.file.mimetype;

    try {
      if (fileType === 'application/pdf') {
        console.log('📄 Parsing as PDF...');
        extractedText = await parsePDF(req.file.buffer);
        console.log('✅ PDF parsed successfully, text length:', extractedText.length);
      } else if (fileType.includes('word') || fileType.includes('document')) {
        console.log('📄 Parsing as DOCX...');
        extractedText = await parseDOCX(req.file.buffer);
        console.log('✅ DOCX parsed successfully, text length:', extractedText.length);
      } else {
        throw new Error('Unsupported file type: ' + fileType);
      }
    } catch (parseError) {
      console.error('❌ Parse error:', parseError.message);
      console.error('Stack:', parseError.stack);
      return res.status(500).json({
        success: false,
        message: 'Failed to parse file: ' + parseError.message
      });
    }

    // Extract structured data
    console.log('🔍 Extracting structured data...');
    const parsedData = extractResumeData(extractedText);
    console.log('✅ Data extracted successfully');

    // Upload to Cloudinary
    console.log('☁️ Uploading to Cloudinary...');
    let uploadResult;
    try {
      uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'resumes',
            resource_type: 'raw',
            public_id: `${req.user._id}_${Date.now()}`
          },
          (error, result) => {
            if (error) {
              console.error('❌ Cloudinary error:', error.message);
              reject(error);
            } else {
              console.log('✅ Cloudinary upload success');
              resolve(result);
            }
          }
        );
        uploadStream.end(req.file.buffer);
      });
    } catch (cloudinaryError) {
      console.error('❌ Cloudinary upload failed:', cloudinaryError.message);
      console.error('Stack:', cloudinaryError.stack);
      // Continue without Cloudinary URL - save with placeholder
      // This prevents the entire upload from failing if Cloudinary is down
      uploadResult = { 
        secure_url: 'local://file-not-uploaded',
        public_id: 'failed-upload'
      };
      console.log('⚠️  Continuing with local storage fallback');
    }

    // Create resume record
    console.log('💾 Saving to database...');
    const resume = await Resume.create({
      userId: req.user._id,
      fileName: req.file.originalname,
      fileUrl: uploadResult.secure_url,
      fileType: req.file.originalname.split('.').pop().toLowerCase(),
      fileSize: req.file.size,
      parsedData
    });
    console.log('✅ Resume saved with ID:', resume._id);

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.resumesAnalyzed': 1 }
    });

    console.log('✅ ========== UPLOAD COMPLETE ==========');
    res.status(201).json({
      success: true,
      message: 'Resume uploaded and parsed successfully',
      data: {
        resume
      }
    });
  } catch (error) {
    console.error('❌ ========== UPLOAD ERROR ==========');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload resume'
    });
  }
});

// Get all resumes for user
router.get('/list', authenticate, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('-parsedData.rawText'); // Exclude raw text for performance

    res.json({
      success: true,
      data: {
        resumes,
        count: resumes.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single resume
router.get('/:id', authenticate, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    res.json({
      success: true,
      data: {
        resume
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Download resume for preview/download
router.get('/download/:id', authenticate, async (req, res) => {
  const requestId = `download-${Date.now()}`;
  console.log(`[${requestId}] 📥 Download request for resume:`, req.params.id);
  
  try {
    // Find resume
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!resume) {
      console.log(`[${requestId}] ❌ Resume not found`);
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    console.log(`[${requestId}] 📄 Resume found:`, resume.fileName);
    console.log(`[${requestId}] 📍 File URL:`, resume.fileUrl);

    // Determine if this is a download or view request (based on query param)
    const isDownload = req.query.download === 'true';
    const disposition = isDownload ? 'attachment' : 'inline';
    
    console.log(`[${requestId}] 📋 Mode:`, isDownload ? 'Download' : 'View');

    // Handle cloud storage (Cloudinary) URLs
    if (resume.fileUrl && resume.fileUrl.startsWith('http')) {
      console.log(`[${requestId}] ☁️  Fetching from cloud storage...`);
      
      try {
        // Use native fetch (Node 18+)
        const fileResponse = await fetch(resume.fileUrl);
        
        if (!fileResponse.ok) {
          console.error(`[${requestId}] ❌ Cloud fetch failed:`, fileResponse.status, fileResponse.statusText);
          throw new Error(`Failed to fetch file from storage: ${fileResponse.statusText}`);
        }

        // Get the file as array buffer
        const arrayBuffer = await fileResponse.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);
        
        console.log(`[${requestId}] ✅ File fetched, size:`, fileBuffer.length, 'bytes');

        // Set appropriate headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `${disposition}; filename="${resume.fileName}"`);
        res.setHeader('Content-Length', fileBuffer.length);
        res.setHeader('Cache-Control', 'no-cache');
        
        console.log(`[${requestId}] ✅ Sending file to client`);
        return res.send(fileBuffer);
        
      } catch (fetchError) {
        console.error(`[${requestId}] ❌ Error fetching from cloud:`, fetchError.message);
        throw new Error('Failed to retrieve file from cloud storage');
      }
    }
    
    // Handle local file storage
    if (resume.fileUrl && resume.fileUrl.startsWith('/uploads')) {
      console.log(`[${requestId}] 💾 Serving from local storage...`);
      
      const fs = await import('fs');
      const filePath = path.join(process.cwd(), resume.fileUrl);
      
      console.log(`[${requestId}] 📂 File path:`, filePath);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.error(`[${requestId}] ❌ File not found on disk:`, filePath);
        return res.status(404).json({
          success: false,
          message: 'File not found on server'
        });
      }

      // Get file stats
      const stats = fs.statSync(filePath);
      console.log(`[${requestId}] 📊 File size:`, stats.size, 'bytes');

      // Set appropriate headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `${disposition}; filename="${resume.fileName}"`);
      res.setHeader('Content-Length', stats.size);
      res.setHeader('Cache-Control', 'no-cache');
      
      // Stream the file (memory efficient)
      const fileStream = fs.createReadStream(filePath);
      
      fileStream.on('error', (streamError) => {
        console.error(`[${requestId}] ❌ Stream error:`, streamError.message);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: 'Error reading file'
          });
        }
      });

      fileStream.on('end', () => {
        console.log(`[${requestId}] ✅ File streamed successfully`);
      });

      console.log(`[${requestId}] ✅ Streaming file to client`);
      return fileStream.pipe(res);
    }
    
    // Handle backend-generated PDFs (full URL)
    if (resume.fileUrl && resume.fileUrl.includes('localhost')) {
      console.log(`[${requestId}] 🔗 Backend-generated PDF URL detected`);
      
      // Extract the local path from the URL
      const urlPath = new URL(resume.fileUrl).pathname;
      const fs = await import('fs');
      const filePath = path.join(process.cwd(), urlPath);
      
      console.log(`[${requestId}] 📂 Extracted path:`, filePath);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.error(`[${requestId}] ❌ File not found:`, filePath);
        return res.status(404).json({
          success: false,
          message: 'File not found on server'
        });
      }

      // Get file stats
      const stats = fs.statSync(filePath);
      console.log(`[${requestId}] 📊 File size:`, stats.size, 'bytes');

      // Set appropriate headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `${disposition}; filename="${resume.fileName}"`);
      res.setHeader('Content-Length', stats.size);
      res.setHeader('Cache-Control', 'no-cache');
      
      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      
      fileStream.on('error', (streamError) => {
        console.error(`[${requestId}] ❌ Stream error:`, streamError.message);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: 'Error reading file'
          });
        }
      });

      fileStream.on('end', () => {
        console.log(`[${requestId}] ✅ File streamed successfully`);
      });

      console.log(`[${requestId}] ✅ Streaming file to client`);
      return fileStream.pipe(res);
    }
    
    // No valid file URL found
    console.error(`[${requestId}] ❌ Invalid file URL:`, resume.fileUrl);
    return res.status(404).json({
      success: false,
      message: 'File not available for preview'
    });
    
  } catch (error) {
    console.error(`[${requestId}] ❌ Download error:`, error.message);
    console.error(`[${requestId}] Stack:`, error.stack);
    
    // Only send error response if headers haven't been sent
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to download resume',
        errorCode: 'DOWNLOAD_ERROR'
      });
    }
  }
});

// Delete resume
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Delete from Cloudinary
    const publicId = resume.fileUrl.split('/').slice(-2).join('/').split('.')[0];
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });

    res.json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
