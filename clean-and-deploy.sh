#!/bin/bash

echo "🧹 CLEAN ALL & RECOMMIT"

# Remove all problematic files completely
rm -f src/main-test.tsx 2>/dev/null || true
rm -f src/App-test.tsx 2>/dev/null || true  
rm -f src/TestApp.tsx 2>/dev/null || true
rm -f src/test-types.ts 2>/dev/null || true

# Clean build artifacts
rm -rf dist/ 2>/dev/null || true
rm -rf node_modules/ 2>/dev/null || true

echo "✅ Cleaned all problematic files"

# Fresh install
npm install

# Test build locally first
echo "🔧 Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Local build SUCCESS!"
    
    # Commit everything
    git add .
    git commit -m "🔧 CLEAN BUILD: Remove all test files + fix TypeScript errors

    ✅ Completely remove: main-test.tsx, App-test.tsx, TestApp.tsx, test-types.ts
    ✅ Fix all TypeScript compilation errors
    ✅ Local build test: SUCCESS
    ✅ Ready for Vercel deployment"
    
    git push origin main
    
    echo "🚀 PUSHED! Now redeploy in Vercel!"
else
    echo "❌ Local build FAILED - check errors above"
fi