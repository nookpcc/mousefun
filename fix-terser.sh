#!/bin/bash

echo "🔧 Fix terser dependency issue"

# Commit the fix
git add package.json vite.config.ts
git commit -m "🔧 Fix Vite build: Add terser dependency + use esbuild minification

✅ Add terser to devDependencies for Vite v5+ compatibility
✅ Change minification from terser to esbuild (faster + no dependency issues)
✅ Ready for Vercel production build

BUILD SHOULD NOW SUCCEED ✅"

git push origin main

echo "✅ Pushed terser fix!"
echo "🚀 Now redeploy in Vercel!"