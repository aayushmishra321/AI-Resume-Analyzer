# Project Structure

## Clean & Organized Structure

```
ai-resume-analyzer/
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # UI Components
│   │   │   └── pages/       # Page Components
│   │   ├── services/        # API Services
│   │   └── store/           # State Management (Zustand)
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   └── node_modules/
│
├── backend/                  # Express Backend
│   ├── routes/              # API Routes
│   ├── models/              # MongoDB Models
│   ├── middleware/          # Auth, Validation, Rate Limiting
│   ├── utils/               # Helpers (AI, PDF, Logger)
│   ├── config/              # Configuration
│   ├── server.js            # Entry Point
│   ├── package.json
│   └── node_modules/
│
├── uploads/                  # Temporary File Storage
│   └── resumes/
│
├── .env                      # Environment Variables
├── README.md                 # Documentation
├── start-backend.bat         # Start Backend Script
└── start-frontend.bat        # Start Frontend Script
```

## Quick Start

### 1. Install Dependencies
```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

### 2. Start Services
```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Backend
start-backend.bat

# Terminal 3: Frontend
start-frontend.bat
```

### 3. Access Application
- Frontend: http://localhost:5173
- Backend: http://localhost:5001
- API Health: http://localhost:5001/api/health

## Environment Variables

All configuration in `.env` file at root level.

## Scripts

- `start-backend.bat` - Start Express server
- `start-frontend.bat` - Start Vite dev server
