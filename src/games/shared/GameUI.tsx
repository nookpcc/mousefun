import React from 'react';
import { motion } from 'framer-motion';
import { useFontClasses } from '../../hooks/useFontClasses';

interface StarLevel {
  star: number;
  target: number;
  description: string;
}

interface SimpleGameUIProps {
  gameTitle: string;
  gameEmoji: string;
  score: number;
  currentStar: number;
  starsEarned: number;
  gameStarted: boolean;
  gameCompleted: boolean;
  starLevels: StarLevel[];
  onStartGame: () => void;
  onRestartGame: () => void;
  onNextGame?: () => void;
  children: React.ReactNode;
  starEarnedEffect?: boolean;
}

export const SimpleGameUI: React.FC<SimpleGameUIProps> = ({
  gameTitle,
  gameEmoji,
  score,
  currentStar,
  starsEarned,
  gameStarted,
  gameCompleted,
  starLevels,
  onStartGame,
  onRestartGame,
  onNextGame,
  children,
  starEarnedEffect = false
}) => {
  const fonts = useFontClasses();

  const getCurrentLevel = () => starLevels[currentStar - 1];

  // Start Screen
  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
        <div className="text-6xl mb-4">{gameEmoji}</div>
        <h2 className={`text-2xl ${fonts.kid} text-gray-800 mb-4`}>{gameTitle}</h2>
        <p className={`text-gray-600 mb-6 text-center max-w-md ${fonts.body}`}>
          {getCurrentLevel()?.description || 'เล่นให้สนุก!'}
        </p>
        
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
          onClick={onStartGame}
        >
          🎮 เริ่มเล่น!
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Game Area */}
      {children}

      {/* Game Title - Top left */}
      <div className="absolute top-4 left-4 z-10">
        <div 
          className="text-white font-bold text-xl"
          style={{
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
          }}
        >
          <span className={`${fonts.kid}`}>
            {gameEmoji} {gameTitle}
          </span>
        </div>
      </div>

      {/* Stars Progress - Top right */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center">
          {Array.from({ length: 5 }, (_, index) => (
            <motion.span 
              key={index}
              className={`text-3xl mx-1 ${
                index < starsEarned ? 'text-yellow-300' : 'text-gray-300'
              }`}
              style={{
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
              }}
              animate={starEarnedEffect && index === starsEarned - 1 ? {
                scale: [1, 1.5, 1],
                rotate: [0, 360]
              } : {}}
              transition={{ duration: 0.6 }}
            >
              {index < starsEarned ? '⭐' : '☆'}
            </motion.span>
          ))}
        </div>
        <div 
          className="text-white font-bold text-lg text-center mt-1"
          style={{
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
          }}
        >
          <span className={`${fonts.kid}`}>
            🎯 {score}/{getCurrentLevel()?.target || 0}
          </span>
        </div>
      </div>

      {/* Star Earned Effect */}
      {starEarnedEffect && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          <motion.div
            className="text-8xl"
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 360],
              y: [0, -50, 0]
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            ⭐
          </motion.div>
          {/* Sparkle effects */}
          {Array.from({ length: 6 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl"
              initial={{ 
                x: 0, 
                y: 0, 
                opacity: 1, 
                scale: 0 
              }}
              animate={{
                x: Math.cos(i * 60 * Math.PI / 180) * 150,
                y: Math.sin(i * 60 * Math.PI / 180) * 150,
                opacity: [1, 0],
                scale: [0, 1, 0]
              }}
              transition={{ 
                duration: 2,
                delay: 0.5,
                ease: "easeOut" 
              }}
            >
              ✨
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Game Completed */}
      {gameCompleted && (
        <motion.div
          className="absolute inset-0 bg-black/50 flex items-center justify-center z-30 cursor-default"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-6xl mb-4">🏆</div>
            <h3 className={`text-3xl ${fonts.kid} text-gray-800 mb-2`}>🎉 เยี่ยมมาก! 🎉</h3>
            <p className={`text-gray-600 mb-4 ${fonts.body}`}>
              คุณทำได้ดีมาก! {gameEmoji}
            </p>
            {/* Full Stars */}
            <div className="flex justify-center mb-6">
              {Array.from({ length: 5 }, (_, index) => (
                <motion.span
                  key={index}
                  className="text-4xl mx-1 text-yellow-400"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  ⭐
                </motion.span>
              ))}
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
                onClick={onRestartGame}
              >
                🔄 เล่นอีกครั้ง
              </button>
              {onNextGame && (
                <button
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
                  onClick={onNextGame}
                >
                  ➡️ เกมต่อไป
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};