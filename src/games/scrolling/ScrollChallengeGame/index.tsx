import React from 'react';
import { GameProps } from '../../../types';

const ScrollChallengeGame: React.FC<GameProps> = ({ onStarEarned, onGameComplete }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="text-6xl mb-4">📜</div>
        <h2 className="text-2xl font-bold mb-4">Scroll Challenge Game</h2>
        <p className="text-gray-600 mb-4">Coming Soon!</p>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => onGameComplete?.(true)}
        >
          Complete
        </button>
      </div>
    </div>
  );
};

export default ScrollChallengeGame;
