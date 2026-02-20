# GitHub Setup Guide

## Quick Setup Commands

Run these commands in your project root directory:

```bash
# 1. Initialize Git repository (if not already done)
git init

# 2. Add all files (respecting .gitignore)
git add .

# 3. Create initial commit
git commit -m "Initial commit: AI Resume Analyzer with React, Node.js, MongoDB, and Gemini AI"

# 4. Add remote repository
git remote add origin https://github.com/aayushmishra321/AI-Resume-Analyzer.git

# 5. Push to GitHub
git branch -M main
git push -u origin main
```

## What Will Be Pushed

### ✅ Included Files:
- All source code (frontend & backend)
- Configuration files (package.json, vite.config.ts, etc.)
- README.md
- .env.example (template without secrets)
- .gitignore
- start-backend.bat
- start-frontend.bat

### ❌ Excluded Files (via .gitignore):
- node_modules/ (dependencies)
- .env (secrets and API keys)
- uploads/ (user uploaded files)
- .vscode/ (IDE settings)
- logs/ (log files)
- dist/ & build/ (build outputs)
- test files (test-functionalities.js, test-gemini.js)

## Troubleshooting

### If remote already exists:
```bash
git remote remove origin
git remote add origin https://github.com/aayushmishra321/AI-Resume-Analyzer.git
```

### If you need to force push:
```bash
git push -u origin main --force
```

### To check what will be committed:
```bash
git status
```

### To see ignored files:
```bash
git status --ignored
```

## After Pushing

1. Go to: https://github.com/aayushmishra321/AI-Resume-Analyzer
2. Verify all files are present
3. Check that .env is NOT visible (security)
4. Update repository description and topics
5. Add a license if needed

## Important Security Notes

⚠️ **NEVER commit these files:**
- .env (contains API keys and secrets)
- node_modules/ (too large, can be reinstalled)
- uploads/ (user data)
- Any file with sensitive information

✅ **Safe to commit:**
- .env.example (template without real values)
- All source code
- Configuration files
- Documentation

## Setting Up After Clone

When someone clones your repository, they should:

1. Clone the repository
2. Copy .env.example to .env
3. Fill in their own API keys and secrets
4. Run `npm install` in both frontend and backend
5. Start MongoDB
6. Run the application

```bash
# Clone
git clone https://github.com/aayushmishra321/AI-Resume-Analyzer.git
cd AI-Resume-Analyzer

# Setup environment
cp .env.example .env
# Edit .env with your values

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Start application
# Terminal 1: cd backend && npm start
# Terminal 2: cd frontend && npm run dev
```
