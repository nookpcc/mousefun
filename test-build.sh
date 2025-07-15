#!/bin/bash
echo "🔧 Testing MouseFun Build Process..."

# Check if we can build successfully
echo "📦 Installing dependencies..."
npm install

echo "🔍 Running TypeScript check..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
    echo "✅ TypeScript check passed!"
    
    echo "🏗️ Building project..."
    npm run build
    
    if [ $? -eq 0 ]; then
        echo "🎉 BUILD SUCCESSFUL! Ready for Vercel deployment!"
        echo "📁 Build output in: ./dist"
        echo "🚀 Next steps:"
        echo "   1. git add ."
        echo "   2. git commit -m 'Fix TypeScript errors for Vercel deployment'"
        echo "   3. git push origin main"
    else
        echo "❌ Build failed - check errors above"
    fi
else
    echo "❌ TypeScript check failed - check errors above"
fi