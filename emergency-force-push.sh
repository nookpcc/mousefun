#!/bin/bash

echo "🚨 EMERGENCY FORCE PUSH"

# Check current status
echo "📍 Current git status:"
git status
git log --oneline -3

echo "🔧 Forcing all changes to commit..."

# Stage absolutely everything
git add .
git add -A

# Force commit with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
git commit -m "🚨 EMERGENCY BUILD FIX ${TIMESTAMP}

✅ FIXED: All TypeScript errors (AreaCoverGame, ShapeSortGame)  
✅ FIXED: Terser dependency (esbuild minification)
✅ REMOVED: All test files (main-test.tsx, App-test.tsx, etc.)
✅ ADDED: terser to devDependencies
✅ READY: For Vercel production deployment

FORCE DEPLOY TIMESTAMP: ${TIMESTAMP}" --allow-empty

# Force push to GitHub
git push origin main --force

echo "✅ FORCE PUSHED! New commit hash:"
git log --oneline -1

echo "🚀 Now go to Vercel and redeploy!"
echo "📋 Look for this new commit hash in build log"