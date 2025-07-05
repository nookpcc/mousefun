import React from 'react';
import { motion } from 'framer-motion';
import { GameData } from '../types';
import { useFontClasses } from '../hooks/useFontClasses';
import { useLanguage } from '../contexts/LanguageContext';

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
  const { t } = useLanguage();

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 mb-4 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Previous Button */}
        <motion.button
          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
          onClick={onPrevGame}
          disabled={currentGameIndex === 0}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ⬅️
        </motion.button>

        {/* Game Info */}
        <div className="flex-1 mx-4 text-center">
          <h2 className={`text-xl ${fonts.heading} text-gray-800`}>
            {games[currentGameIndex]?.title}
          </h2>
          <p className={`text-sm text-gray-600 ${fonts.body}`}>
            {currentGameIndex + 1} of {games.length}
          </p>
        </div>

        {/* Next Button */}
        <motion.button
          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
          onClick={onNextGame}
          disabled={currentGameIndex === games.length - 1}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ➡️
        </motion.button>
      </div>

      {/* Game Dots */}
      <div className="flex justify-center mt-3 gap-2">
        {games.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentGameIndex 
                ? 'bg-blue-500' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            onClick={() => onSelectGame(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default GameNavigationBanner;
