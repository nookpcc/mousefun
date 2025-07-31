#!/bin/bash
echo "🔍 Checking local development issues..."

echo "📋 Current directory structure:"
ls -la

echo "📦 Package.json scripts:"
cat package.json | grep -A 10 "scripts"

echo "🔧 Checking dependencies:"
npm list --depth=0

echo "⚠️ Checking for errors:"
npm run dev 2>&1 | head -20
