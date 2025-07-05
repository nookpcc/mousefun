import React from 'react';
import { motion } from 'framer-motion';
import { GameData } from '../types';

interface GameCardProps {
  game: GameData;
  onClick: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'movement': return '🏃‍♂️';
      case 'clicking': return '👆';
      case 'dragging': return '✋';
      default: return '🎮';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
        ⭐
      </span>
    ));
  };

  return (
    <motion.div
      className="game-card"
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Thumbnail */}
      <div className="h-40 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center relative">
        <div className="text-6xl">{game.thumbnail}</div>
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(game.difficulty)}`}>
          {game.difficulty === 'easy' ? '🟢' : game.difficulty === 'medium' ? '🟡' : '🔴'}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-kid text-gray-800 mb-2">
          {game.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 font-body">
          {game.description}
        </p>

        {/* Rating and Play Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {renderStars(game.rating)}
          </div>
          <div className="text-xs text-gray-500 font-body">
            ▶️ {game.playCount.toLocaleString()}
          </div>
        </div>

        {/* Play Button */}
        <motion.button
          className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ▶️
        </motion.button>
      </div>
    </motion.div>
  );
};

export default GameCard;
