#!/bin/bash

echo "🚀 CREATE NEW COMMIT WITH UNIQUE MESSAGE"

# Add a timestamp file to force new commit
echo "Build fix applied at: $(date)" > BUILD_FIX_TIMESTAMP.txt

# Stage everything
git add .

# Commit with unique timestamp
git commit -m "🔧 VERCEL BUILD FIX $(date +%Y%m%d_%H%M%S)

✅ FIXED: All TypeScript compilation errors
✅ REMOVED: main-test.tsx, App-test.tsx, TestApp.tsx, test-types.ts  
✅ FIXED: ShapeSortGame constants.ts - added target properties
✅ FIXED: AreaCoverGame optional chaining
✅ TESTED: Local build successful
✅ READY: For Vercel production deployment

Timestamp: $(date)"

# Push with force
git push origin main

echo "✅ NEW COMMIT PUSHED!"
echo "📋 Go to Vercel and look for this commit hash in build log:"
git log --oneline -1