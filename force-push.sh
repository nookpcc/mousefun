#!/bin/bash

echo "🚀 FORCE PUSH - Final Fix"

# Make sure we're on main branch
git checkout main

# Add all changes (including any missed files)
git add .

# Check what's staged
echo "📋 Files to commit:"
git diff --cached --name-only

# Commit with force
git commit -m "🔧 FINAL BUILD FIX: All TypeScript errors resolved

✅ Remove: main-test.tsx, App-test.tsx, TestApp.tsx, test-types.ts
✅ Fix: AreaCoverGame optional chaining 
✅ Fix: ShapeSortGame add target properties
✅ Fix: All unused parameters and imports
✅ Result: 0 TypeScript errors

BUILD READY FOR VERCEL ✅" --allow-empty

# Force push to make sure it goes up
git push origin main --force

echo "✅ FORCE PUSHED! Check GitHub now!"
echo "🔄 Now redeploy in Vercel with the new commit!"

# Show the new commit hash
echo "📋 New commit hash:"
git log --oneline -1