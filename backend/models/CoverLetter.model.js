import mongoose from 'mongoose';

const coverLetterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  hiringManager: String,
  jobDescription: {
    type: String,
    required: true
  },
  tone: {
    type: String,
    enum: ['professional', 'enthusiastic', 'formal', 'creative'],
    default: 'professional'
  },
  generatedLetter: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('CoverLetter', coverLetterSchema);
