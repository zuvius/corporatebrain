# Changelog - April 17, 2026

## Fixed GitHub Actions CI Failures

### Problem
GitHub Actions CI was failing on both `Lint & Type Check` and `Unit Tests` jobs with:
```
Error: Dependencies lock file is not found
Supported file patterns: package-lock.json, npm-shrinkwrap.json, yarn.lock
```

### Root Cause
1. **`package-lock.json`** - Never generated/committed (npm install wasn't run with lock file creation)
2. **`uploads/` folder** - Not committed because empty folders aren't tracked by Git

### Changes Made

#### 1. Created uploads folder placeholder
- **File**: `c:\Users\seoho\Documents\Corporate Brain\uploads\.gitkeep` (created)
- **Purpose**: Empty placeholder file to ensure uploads folder is tracked by Git

#### 2. Updated .gitignore for uploads
- **File**: `c:\Users\seoho\Documents\Corporate Brain\.gitignore:73-75`
- **Change**: Added exception to allow `.gitkeep` in uploads folder
```gitignore
# uploads - ignore all contents but keep folder structure
/uploads/*
!/uploads/.gitkeep
```

### Next Steps
Run locally to generate `package-lock.json`:
```bash
npm install
```

Then commit both files:
```bash
git add package-lock.json uploads/.gitkeep .gitignore
git commit -m "chore: add lock file and uploads folder for CI"
git push
```

### Files Modified
- `c:\Users\seoho\Documents\Corporate Brain\uploads\.gitkeep` (created)
- `c:\Users\seoho\Documents\Corporate Brain\.gitignore:73-75`

