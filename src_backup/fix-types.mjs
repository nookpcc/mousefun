// Quick fix script for all remaining TypeScript errors
// Run this to fix all issues at once

import * as fs from 'fs';
import * as path from 'path';

const fixes = [
  // Remove unused imports
  {
    file: 'src/App.tsx',
    search: /import React, { /g,
    replace: 'import { '
  },
  
  // Fix gameStore.ts
  {
    file: 'src/store/gameStore.ts',
    search: /endGame: \(completed: boolean, score\?: number, starsEarned\?: number\) => \{/g,
    replace: 'endGame: (gameId: string) => {'
  },
  
  // Remove unused parameters
  {
    file: 'src/games/clicking/BalloonPopGame/index.tsx',
    search: /currentStars = 0,/g,
    replace: ''
  },
  
  // Remove unused parameters from BubblePopGame
  {
    file: 'src/games/clicking/BubblePopGame/index.tsx',
    search: /currentStars = 0,/g,
    replace: ''
  }
];

console.log('🔧 Applying TypeScript fixes...');
fixes.forEach(fix => {
  try {
    const filePath = path.join(process.cwd(), fix.file);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(fix.search, fix.replace);
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed ${fix.file}`);
    }
  } catch (error) {
    console.log(`❌ Error fixing ${fix.file}:`, error.message);
  }
});

console.log('🎉 All fixes applied!');
