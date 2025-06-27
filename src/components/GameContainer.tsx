import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameData, GameProps } from '../types';
import StarRating from './StarRating';
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
  const fonts = useFontClasses();
  
  const currentGame = games[currentGameIndex];
  const currentProgress = gameProgress[currentGame.id] || {
    gameId: currentGame.id,
    stars: 0,
    bestScore: 0,
    timesPlayed: 0,
    completed: false
  };

  const handleStarEarned = (stars: number) => {
    const newProgress = {
      ...currentProgress,
      stars: Math.max(currentProgress.stars, stars),
      timesPlayed: currentProgress.timesPlayed + 1,
      completed: stars >= 5
    };
    updateGameProgress(currentGame.id, newProgress);
  };

  const handleGameComplete = (completed: boolean) => {
    // Auto advance logic can be handled by parent component
    if (completed && currentProgress.stars >= 5) {
      // Could emit event to parent for auto-advance
    }
  };

  const GameComponent = currentGame.component;

  return (
    <div className="relative">
      {/* Stars Display - Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <StarRating 
            stars={currentProgress.stars} 
            size="md"
            showAnimation={true}
          />
        </motion.div>
      </div>

      {/* Game Title - Top Left */}
      <div className="absolute top-4 left-4 z-20">
        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className={`${fonts.kid} text-lg text-gray-800`}>
            {currentGame.title}
          </h2>
        </motion.div>
      </div>

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
