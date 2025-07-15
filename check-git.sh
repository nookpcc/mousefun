#!/bin/bash

echo "🔍 Checking Git Status..."

# Check current branch
echo "📍 Current branch:"
git branch

# Check latest commit
echo "📝 Latest commit:"
git log --oneline -1

# Check remote status
echo "🌐 Remote status:"
git status

# Check if we're ahead of origin
echo "📊 Commits comparison:"
git log --oneline origin/main..HEAD

echo "🎯 If you see commits above, they need to be pushed!"