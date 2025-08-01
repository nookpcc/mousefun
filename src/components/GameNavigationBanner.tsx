import React from 'react';
import { motion } from 'framer-motion';
import { GameData } from '../types';
import { useFontClasses } from '../hooks/useFontClasses';

interface GameNavigationBannerProps {
  games: GameData[];
  currentGameIndex: number;
  onSelectGame: (index: number) => void;
  onPrevGame: () => void;
  onNextGame: () => void;
}

const GameNavigationBanner: React.FC<GameNavigationBannerProps> = ({
  games,
  currentGameIndex,
  onSelectGame,
  onPrevGame,
  onNextGame
}) => {
  const fonts = useFontClasses();

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg" style={{ width: '400px', height: '60px' }}>
      <div className="flex items-center justify-between h-full px-4">
        {/* Previous Button */}
        <motion.button
          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 text-sm"
          onClick={onPrevGame}
          disabled={currentGameIndex === 0}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ⬅️
        </motion.button>

        {/* Game Info */}
        <div className="flex-1 mx-3 text-center">
          <h2 className={`text-base ${fonts.heading} text-gray-800 truncate`}>
            {games[currentGameIndex]?.title}
          </h2>
          <p className={`text-xs text-gray-600 ${fonts.body}`}>
            {currentGameIndex + 1} / {games.length}
          </p>
        </div>

        {/* Game Dots */}
        <div className="flex gap-1 mx-2">
          {games.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentGameIndex 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => onSelectGame(index)}
            />
          ))}
        </div>

        {/* Next Button */}
        <motion.button
          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 text-sm"
          onClick={onNextGame}
          disabled={currentGameIndex === games.length - 1}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ➡️
        </motion.button>
      </div>
    </div>
  );
};

export default GameNavigationBanner;
