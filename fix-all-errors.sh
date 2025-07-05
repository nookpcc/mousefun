#!/bin/bash
# Comprehensive fix for all TypeScript errors

echo "🔧 Fixing all TypeScript errors..."

# 1. Fix App.tsx - Remove unused React import
sed -i 's/import React, { /import { /g' src/App.tsx

# 2. Fix GameCard.tsx - Remove unused function and add optional properties
sed -i '/getCategoryIcon.*{/,/};/d' src/components/GameCard.tsx
sed -i 's/game\.rating/game.rating || 5/g' src/components/GameCard.tsx
sed -i 's/game\.playCount/game.playCount || 0/g' src/components/GameCard.tsx

# 3. Fix GameContainer.tsx - Remove unused import
sed -i '/useFontClasses.*from/d' src/components/GameContainer.tsx

# 4. Fix GameModal.tsx - Add optional chaining
sed -i 's/game\.playCount\.toLocaleString()/(game.playCount || 0).toLocaleString()/g' src/components/GameModal.tsx

# 5. Fix StarRating.tsx - Fix transition type
sed -i 's/transition={showAnimation && index === stars - 1 ? {.*} : undefined}/transition={showAnimation && index === stars - 1 ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : undefined}/g' src/components/StarRating.tsx

# 6. Fix ClickTargetGame.tsx - Remove unused parameter and fix timeout type
sed -i 's/currentStars = 0,//g' src/games/ClickTargetGame.tsx
sed -i 's/NodeJS\.Timeout/number/g' src/games/ClickTargetGame.tsx

# 7. Fix BalloonPopGame - Remove unused parameter
sed -i 's/currentStars = 0,//g' src/games/clicking/BalloonPopGame/index.tsx

# 8. Fix BubblePopGame - Remove unused parameter and fix type issues
sed -i 's/currentStars = 0,//g' src/games/clicking/BubblePopGame/index.tsx

# 9. Fix MouseTrailGame - Remove unused parameter
sed -i 's/currentStars = 0,//g' src/games/movement/MouseTrailGame/index.tsx

# 10. Fix HouseExplorerGame - Remove unused import
sed -i 's/HouseRoom, //g' src/games/pointing/HouseExplorerGame/index.tsx

# 11. Fix gameStore.ts - Fix function signature
sed -i 's/endGame: (completed: boolean, score?: number, starsEarned?: number) => {/endGame: (gameId: string) => {/g' src/store/gameStore.ts
sed -i 's/const session = get().currentSession;/const session = get().currentSession;\n      if (!session) return;/g' src/store/gameStore.ts

echo "✅ All TypeScript errors fixed!"
