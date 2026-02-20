import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Index for faster queries
  },
  fileName: {
    type: String,
    required: true,
    maxlength: 255
  },
  fileUrl: {
    type: String,
    required: true,
    maxlength: 1000
  },
  fileType: {
    type: String,
    enum: ['pdf', 'doc', 'docx'],
    required: true
  },
  fileSize: {
    type: Number,
    required: true,
    max: 10485760 // 10MB max
  },
  cloudinaryPublicId: {
    type: String, // Store Cloudinary public ID for deletion
    maxlength: 255
  },
  parsedData: {
    fullName: {
      type: String,
      maxlength: 200
    },
    email: {
      type: String,
      maxlength: 255
    },
    phone: {
      type: String,
      maxlength: 50
    },
    location: {
      type: String,
      maxlength: 200
    },
    summary: {
      type: String,
      maxlength: 5000
    },
    experience: [{
      title: {
        type: String,
        maxlength: 200
      },
      company: {
        type: String,
        maxlength: 200
      },
      location: {
        type: String,
        maxlength: 200
      },
      dates: {
        type: String,
        maxlength: 100
      },
      description: {
        type: String,
        maxlength: 5000
      }
    }],
    education: [{
      degree: {
        type: String,
        maxlength: 200
      },
      school: {
        type: String,
        maxlength: 200
      },
      location: {
        type: String,
        maxlength: 200
      },
      dates: {
        type: String,
        maxlength: 100
      }
    }],
    skills: [{
      type: String,
      maxlength: 100
    }],
    rawText: {
      type: String,
      maxlength: 50000 // Limit raw text size
    }
  },
  analysisResults: {
    type: [{
      jobDescription: {
        type: String,
        maxlength: 10000
      },
      overallScore: {
        type: Number,
        min: 0,
        max: 100
      },
      contentScore: {
        type: Number,
        min: 0,
        max: 100
      },
      keywordScore: {
        type: Number,
        min: 0,
        max: 100
      },
      formatScore: {
        type: Number,
        min: 0,
        max: 100
      },
      atsScore: {
        type: Number,
        min: 0,
        max: 100
      },
      keywordMatches: [{
        keyword: String,
        status: String,
        count: Number
      }],
      missingSkills: [String],
      suggestions: [String],
      analyzedAt: {
        type: Date,
        default: Date.now
      }
    }],
    validate: {
      validator: function(arr) {
        return arr.length <= 50; // Max 50 analysis results per resume
      },
      message: 'Maximum 50 analysis results allowed per resume'
    }
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
resumeSchema.index({ userId: 1, createdAt: -1 });

// Index for email search in parsed data
resumeSchema.index({ 'parsedData.email': 1 });

export default mongoose.model('Resume', resumeSchema);
