import React from 'react';
import { motion } from 'framer-motion';
import { GameData } from '../types';
import { useGameStore } from '../store/gameStore';

interface GameNavigationBannerProps {
  games: GameData[];
  currentGameIndex: number;
  onSelectGame: (index: number) => void;
  onNextGame: () => void;
  onPrevGame: () => void;
}

const GameNavigationBanner: React.FC<GameNavigationBannerProps> = ({
  games,
  currentGameIndex,
  onSelectGame,
  onNextGame,
  onPrevGame
}) => {
  const { gameProgress } = useGameStore();

  return (
    <motion.div
      className="flex items-center justify-center py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg px-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-4">
        {/* Previous Button */}
        <motion.button
          className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onPrevGame}
        >
          ←
        </motion.button>

        {/* Game Selection Buttons */}
        <div className="flex gap-1.5">
          {games.map((game, index) => {
            const progress = gameProgress[game.id];
            const isActive = index === currentGameIndex;
            const isCompleted = progress?.completed || false;
            
            return (
              <motion.button
                key={game.id}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold shadow-md transition-all duration-200 ${
                  isActive
                    ? 'bg-green-500 border-green-600 text-white transform scale-110'
                    : isCompleted
                    ? 'bg-yellow-400 border-yellow-500 text-white'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-green-400 hover:bg-green-50'
                }`}
                whileHover={{ scale: isActive ? 1.1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectGame(index)}
                title={`${game.title} ${isCompleted ? '(จบแล้ว)' : ''}`}
              >
                {isCompleted ? '✓' : index + 1}
              </motion.button>
            );
          })}
        </div>

        {/* Next Button */}
        <motion.button
          className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onNextGame}
        >
          →
        </motion.button>
      </div>
    </motion.div>
  );
};

export default GameNavigationBanner;
