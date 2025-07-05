import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameData } from '../types';
import GameNavigationBanner from './GameNavigationBanner';
import { useGameStore } from '../store/gameStore';
import { useFontClasses } from '../hooks/useFontClasses';

interface GameContainerProps {
  games: GameData[];
  currentGameIndex: number;
  gameKey: number;
  onSelectGame: (index: number) => void;
  onNextGame: () => void;
  onPrevGame: () => void;
}

const GameContainer: React.FC<GameContainerProps> = ({ games, currentGameIndex, gameKey, onSelectGame, onNextGame, onPrevGame }) => {
  const { gameProgress, updateGameProgress } = useGameStore();

  const currentGame = games[currentGameIndex];
  const currentProgress = gameProgress[currentGame.id] || {
    gameId: currentGame.id,
    stars: 0,
    bestScore: 0,
    timesPlayed: 0,
    completed: false
  };

  const handleStarEarned = React.useCallback((stars: number) => {
    updateGameProgress(currentGame.id, stars);
  }, [currentGame.id, updateGameProgress]);

  const handleGameComplete = React.useCallback((completed: boolean) => {
    if (completed && currentProgress.stars >= 5) {
      onNextGame();
    }
  }, [currentProgress.stars, onNextGame]);

  const GameComponent = currentGame.component;

  return (
    <div className="relative">
      {/* UI is now handled by individual games */}

      {/* Game Area */}
      <div 
        className="w-[728px] h-[500px] rounded-2xl overflow-hidden shadow-lg mx-auto relative"
        style={{ 
          background: currentGame.backgroundColor || 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)'
        }}
      >
        {/* Game Content Area */}
        <div className="w-full h-[400px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={gameKey}
              className="w-full h-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <GameComponent
                onStarEarned={handleStarEarned}
                onGameComplete={handleGameComplete}
                currentStars={currentProgress.stars}
                gameKey={gameKey}
              />
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Navigation Banner - Centered in bottom area */}
        <div className="absolute bottom-0 left-0 right-0 h-[100px] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GameNavigationBanner
              games={games}
              currentGameIndex={currentGameIndex}
              onSelectGame={onSelectGame}
              onNextGame={onNextGame}
              onPrevGame={onPrevGame}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GameContainer;
