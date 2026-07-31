# AI Resume Analyzer

A full-stack web application that leverages Google Gemini AI to analyze resumes, provide ATS compatibility scores, and generate professional cover letters. Built with React, Node.js, Express, MongoDB, and integrated with Cloudinary for file storage.

## 🚀 Features

### Resume Analysis
- **AI-Powered Analysis**: Uses Google Gemini 2.5 Flash for intelligent resume evaluation
- **ATS Compatibility Score**: Measures how well your resume performs with Applicant Tracking Systems
- **Keyword Matching**: Identifies found and missing keywords based on job descriptions
- **Detailed Scoring**: Provides scores for content, keywords, format, and overall quality
- **Actionable Suggestions**: Get specific recommendations to improve your resume

### Resume Builder
- **Interactive Form**: Step-by-step resume creation with live preview
- **PDF Generation**: Automatically generates professional PDF resumes
- **Multiple Sections**: Personal info, experience, education, and skills
- **Real-time Preview**: See your resume as you build it

### Cover Letter Generator
- **AI-Generated Content**: Creates personalized cover letters using Gemini AI
- **Multiple Tones**: Choose from professional, enthusiastic, formal, or creative tones
- **Job-Specific**: Tailored to job descriptions and company information
- **Resume Integration**: Optionally uses your resume data for better personalization

### File Management
- **Upload Support**: Accept PDF and DOCX resume files
- **Cloud Storage**: Integrated with Cloudinary for reliable file storage
- **File Parsing**: Extracts text from uploaded resumes for analysis
- **Resume Library**: View and manage all your uploaded resumes

### User Management
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **User Profiles**: Manage personal information and preferences
- **Dashboard**: Track resume statistics and analysis history
- **Session Management**: Secure token-based sessions

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern UI library with hooks
- **React Router**: Client-side routing
- **Zustand**: Lightweight state management
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: High-quality React components
- **Vite**: Fast build tool and dev server
- **Lucide React**: Beautiful icon library

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt**: Password hashing
- **Winston**: Structured logging
- **Helmet**: Security headers
- **Express Rate Limit**: API rate limiting
- **Express Validator**: Input validation
- **Express Mongo Sanitize**: NoSQL injection protection

### AI & External Services
- **Google Gemini AI**: Advanced language model for analysis and generation
- **Cloudinary**: Cloud-based file storage and management
- **PDF-Parse**: PDF text extraction
- **Mammoth**: DOCX text extraction
- **PDFKit**: PDF generation

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- Google Gemini API Key
- Cloudinary Account

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ai-resume-analyzer
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/resume-analyzer

# JWT Configuration
JWT_ACCESS_SECRET=your-secure-access-secret-key
JWT_REFRESH_SECRET=your-secure-refresh-secret-key
JWT_ACCESS_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Google Gemini AI Configuration
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
GEMINI_MAX_TOKENS=8192

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server Configuration
PORT=5001
NODE_ENV=development
BACKEND_URL=http://localhost:5001
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Configuration
MAX_FILE_SIZE=10485760

# Logging
LOG_LEVEL=debug
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows
mongod --dbpath C:\data\db

# macOS/Linux
mongod --dbpath /data/db
```

### 5. Run the Application

**Backend (Terminal 1):**
```bash
cd backend
npm start
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001

## 🧪 Testing

### Run Functionality Tests
```bash
node test-functionalities.js
```

### Run Gemini API Tests
```bash
node test-gemini.js
```

## 📁 Project Structure

```
ai-resume-analyzer/
├── backend/
│   ├── config/
│   │   └── cloudinary.config.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── validators.js
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Resume.model.js
│   │   └── CoverLetter.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── resume.routes.js
│   │   ├── analysis.routes.js
│   │   ├── coverLetter.routes.js
│   │   └── user.routes.js
│   ├── utils/
│   │   ├── aiAnalyzer.js
│   │   ├── fileParser.js
│   │   ├── pdfGenerator.js
│   │   └── logger.js
│   ├── uploads/
│   │   └── resumes/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── ui/
│   │   │   │   ├── templates/
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   └── Toast.jsx
│   │   │   ├── pages/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── SignupPage.jsx
│   │   │   │   ├── ResumeBuilder.jsx
│   │   │   │   ├── ResumeAnalysis.jsx
│   │   │   │   ├── CoverLetterGenerator.jsx
│   │   │   │   ├── MyResumes.jsx
│   │   │   │   ├── Settings.jsx
│   │   │   │   └── NotFound.jsx
│   │   │   ├── App.tsx
│   │   │   └── routes.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── store/
│   │   │   └── useAuthStore.js
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   ├── tailwind.css
│   │   │   ├── theme.css
│   │   │   └── fonts.css
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── .env
├── README.md
├── test-functionalities.js
└── test-gemini.js
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with salt rounds
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Express-validator for all inputs
- **NoSQL Injection Protection**: Express-mongo-sanitize
- **Security Headers**: Helmet middleware
- **CORS Configuration**: Restricted origins
- **Error Handling**: Graceful error handling without exposing sensitive data

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Resume Management
- `POST /api/resume/create` - Create resume from builder
- `POST /api/resume/upload` - Upload resume file
- `GET /api/resume/list` - Get all user resumes
- `GET /api/resume/:id` - Get single resume
- `GET /api/resume/download/:id` - Download resume
- `DELETE /api/resume/:id` - Delete resume

### Analysis
- `POST /api/analysis/:resumeId` - Analyze resume
- `GET /api/analysis/history/:resumeId` - Get analysis history
- `GET /api/analysis/dashboard/stats` - Get dashboard statistics

### Cover Letter
- `POST /api/cover-letter/generate` - Generate cover letter
- `GET /api/cover-letter/list` - Get all cover letters
- `GET /api/cover-letter/:id` - Get single cover letter
- `DELETE /api/cover-letter/:id` - Delete cover letter

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## 🚨 Error Handling

The application implements comprehensive error handling:

- **Global Error Handlers**: Catches uncaught exceptions and unhandled rejections
- **Request Tracing**: Unique request IDs for debugging
- **Structured Logging**: Winston logger with timestamps and context
- **Graceful Degradation**: Fallback mechanisms for external services
- **MongoDB Resilience**: Auto-reconnection on connection loss
- **Rate Limit Handling**: Proper 429 error responses

## 📊 Logging

Winston-based structured logging with:
- Timestamp on every log entry
- Service name identification
- Error stack traces
- Request/response duration tracking
- Different log levels (debug, info, warn, error)

## 🔄 Rate Limiting

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 login attempts per 15 minutes
- **AI Analysis**: 10 requests per 15 minutes

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- Google Gemini AI for powerful language model capabilities
- Cloudinary for reliable file storage
- Shadcn/ui for beautiful React components
- The open-source community for amazing tools and libraries


