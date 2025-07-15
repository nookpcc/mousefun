#!/bin/bash

echo "🔍 Force Git to detect changes..."

# Check git status
git status

# Add files explicitly
git add package.json
git add vite.config.ts
git add .

# Check what's staged
git status

echo "📋 Files ready to commit:"
git diff --cached --name-only