import React from 'react';
import { motion } from 'framer-motion';
import { StarLevel } from './types';

interface GameUIProps {
  score: number;
  timeRemaining?: number;
  currentStar: number;
  starsEarned: number;
  gameStarted: boolean;
  gameCompleted: boolean;
  starLevels: StarLevel[];
  onStartGame?: () => void;
  onRestartGame?: () => void;
  children?: React.ReactNode;
}

export const GameUI: React.FC<GameUIProps> = ({
  score,
  timeRemaining,
  currentStar,
  starsEarned,
  gameStarted,
  gameCompleted,
  starLevels,
  onStartGame,
  onRestartGame,
  children
}) => {
  const currentLevel = starLevels[currentStar - 1];
  const progress = currentLevel ? Math.min(score / currentLevel.target * 100, 100) : 0;

  return (
    <div className="w-full h-full relative">
      {/* Game Area */}
      <div className="w-full h-full relative">
        {children}
        
        {/* Overlay for start/complete states */}
        {(!gameStarted || gameCompleted) && (
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {!gameStarted ? (
                <>
                  <div className="text-6xl mb-4">🎮</div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">เริ่มเกม!</h2>
                  <p className="text-gray-600 mb-6">
                    เป้าหมาย: {currentLevel?.description || 'เล่นให้สนุก!'}
                  </p>
                  <motion.button
                    className="bg-green-500 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onStartGame}
                  >
                    เริ่มเล่น! 🚀
                  </motion.button>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">เยี่ยมมาก!</h2>
                  <div className="mb-4">
                    <div className="text-lg text-gray-600 mb-2">คะแนน: {score}</div>
                    <div className="flex justify-center gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.div
                          key={star}
                          className={`text-2xl ${star <= starsEarned ? 'text-yellow-400' : 'text-gray-300'}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: star * 0.1 }}
                        >
                          ⭐
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <motion.button
                    className="bg-blue-500 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onRestartGame}
                  >
                    เล่นอีกครั้ง! 🔄
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* HUD - Top overlay */}
      {gameStarted && !gameCompleted && (
        <motion.div
          className="absolute top-4 left-4 right-4 flex justify-between items-center z-40"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Score */}
          <div className="bg-white bg-opacity-90 rounded-full px-4 py-2 shadow-lg">
            <span className="text-lg font-bold text-gray-800">🎯 {score}</span>
          </div>

          {/* Timer */}
          {timeRemaining !== undefined && (
            <div className="bg-white bg-opacity-90 rounded-full px-4 py-2 shadow-lg">
              <span className={`text-lg font-bold ${timeRemaining <= 10 ? 'text-red-500' : 'text-gray-800'}`}>
                ⏰ {Math.ceil(timeRemaining)}
              </span>
            </div>
          )}

          {/* Stars Progress */}
          <div className="bg-white bg-opacity-90 rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
            <span className="text-sm font-bold text-gray-600">
              ⭐ {currentStar}/5
            </span>
            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-yellow-400"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};