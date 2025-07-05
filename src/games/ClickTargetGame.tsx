import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProps } from '../types';
import { useFontClasses } from '../hooks/useFontClasses';
import { useLanguage } from '../contexts/LanguageContext';

interface Target {
  id: string;
  x: number;
  y: number;
  size: number;
}

interface StarLevel {
  star: number;
  targetCount: number;
  targetSize: { min: number; max: number };
  targetLifetime: number;
  spawnDelay: number;
  description: string;
}

const STAR_LEVELS: StarLevel[] = [
  {
    star: 1,
    targetCount: 5,
    targetSize: { min: 80, max: 100 },
    targetLifetime: 3000,
    spawnDelay: 1000,
    description: 'เป้าใหญ่ ช้าๆ ง่ายมาก'
  },
  {
    star: 2,
    targetCount: 8,
    targetSize: { min: 70, max: 90 },
    targetLifetime: 2500,
    spawnDelay: 800,
    description: 'เป้าปานกลาง เร็วขึ้น'
  },
  {
    star: 3,
    targetCount: 12,
    targetSize: { min: 60, max: 80 },
    targetLifetime: 2000,
    spawnDelay: 600,
    description: 'เป้าเล็กลง เร็วขึ้น'
  },
  {
    star: 4,
    targetCount: 15,
    targetSize: { min: 50, max: 70 },
    targetLifetime: 1500,
    spawnDelay: 500,
    description: 'เป้าเล็ก เร็วมาก'
  },
  {
    star: 5,
    targetCount: 20,
    targetSize: { min: 40, max: 60 },
    targetLifetime: 1200,
    spawnDelay: 400,
    description: 'เป้าจิ๋ว เร็วสุดๆ!'
  }
];

interface ClickTargetGameProps extends GameProps {}

const ClickTargetGame: React.FC<ClickTargetGameProps> = ({ 
  onStarEarned, 
  onGameComplete, 
  currentStars = 0,
  gameKey = 0
}) => {
  const fonts = useFontClasses();
  const { t } = useLanguage();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentStar, setCurrentStar] = useState(1);
  const [targetsHit, setTargetsHit] = useState(0);
  const [currentTarget, setCurrentTarget] = useState<Target | null>(null);
  const [starCompleted, setStarCompleted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [targetTimeout, setTargetTimeout] = useState<number | null>(null);

  // Reset game when gameKey changes
  useEffect(() => {
    if (gameKey > 0) {
      resetGame();
    }
  }, [gameKey]);

  const resetGame = () => {
    setCurrentStar(1);
    setTargetsHit(0);
    setGameStarted(false);
    setStarCompleted(false);
    setGameCompleted(false);
    setEarnedStars(0);
    setCurrentTarget(null);
    if (targetTimeout) {
      clearTimeout(targetTimeout);
      setTargetTimeout(null);
    }
  };

  const getCurrentLevel = () => STAR_LEVELS[currentStar - 1];

  const generateTarget = (): Target => {
    const level = getCurrentLevel();
    const size = Math.random() * (level.targetSize.max - level.targetSize.min) + level.targetSize.min;
    return {
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * (628 - size) + 50,
      y: Math.random() * (400 - size) + 80,
      size
    };
  };

  const startGame = () => {
    setGameStarted(true);
    setTargetsHit(0);
    setStarCompleted(false);
    spawnNextTarget();
  };

  const spawnNextTarget = () => {
    if (starCompleted || gameCompleted) return;
    
    const level = getCurrentLevel();
    setCurrentTarget(generateTarget());
    
    // Auto-remove target after lifetime
    const timeout = setTimeout(() => {
      setCurrentTarget(null);
      setTimeout(spawnNextTarget, level.spawnDelay);
    }, level.targetLifetime);
    
    setTargetTimeout(timeout);
  };

  const hitTarget = () => {
    if (targetTimeout) {
      clearTimeout(targetTimeout);
      setTargetTimeout(null);
    }
    
    setCurrentTarget(null);
    setTargetsHit(prev => {
      const newCount = prev + 1;
      const level = getCurrentLevel();
      
      // Check if current star level is completed
      if (newCount >= level.targetCount) {
        setStarCompleted(true);
        const newStarCount = earnedStars + 1;
        setEarnedStars(newStarCount);
        onStarEarned?.(newStarCount);
        
        // Check if game is completed (5 stars)
        if (currentStar >= 5) {
          setGameCompleted(true);
          onGameComplete?.(true);
        }
        
        return newCount;
      }
      
      // Spawn next target
      setTimeout(spawnNextTarget, getCurrentLevel().spawnDelay);
      return newCount;
    });
  };

  const missTarget = () => {
    // No penalty for missing, just continue the game
  };

  const nextStar = () => {
    if (currentStar < 5) {
      setCurrentStar(prev => prev + 1);
      setTargetsHit(0);
      setStarCompleted(false);
      setCurrentTarget(null);
      spawnNextTarget();
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (targetTimeout) {
        clearTimeout(targetTimeout);
      }
    };
  }, [targetTimeout]);

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-green-100 to-blue-100 rounded-lg">
        <div className="text-6xl mb-4">🎯</div>
        <h2 className={`text-2xl ${fonts.kid} text-gray-800 mb-4`}>{t('title', 'click-target')}</h2>
        <p className={`text-gray-600 mb-6 text-center max-w-md ${fonts.body}`}>
          {t('description', 'click-target')}
        </p>
        
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
          onClick={startGame}
        >
          🎮 {t('startGame')}
        </button>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-full bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden"
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        if (currentTarget) {
          const targetCenterX = currentTarget.x + currentTarget.size / 2;
          const targetCenterY = currentTarget.y + currentTarget.size / 2;
          const distance = Math.sqrt(
            Math.pow(clickX - targetCenterX, 2) + Math.pow(clickY - targetCenterY, 2)
          );
          
          if (distance <= currentTarget.size / 2) {
            hitTarget();
          } else {
            missTarget();
          }
        }
      }}
    >
      {/* Game UI */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2">
          <span className={`${fonts.kid} text-lg`}>
            🎯 {currentStar}/5 ({targetsHit}/{getCurrentLevel().targetCount})
          </span>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2">
          <span className={`${fonts.kid} text-sm`}>{getCurrentLevel().description}</span>
        </div>
      </div>

      {/* Stars Progress Top */}
      {/* Removed - using top right stars instead */}

      {/* Target */}
      <AnimatePresence mode="wait">
        {currentTarget && (
          <motion.div
            key={currentTarget.id}
            className="absolute cursor-pointer"
            style={{
              left: currentTarget.x,
              top: currentTarget.y,
              width: currentTarget.size,
              height: currentTarget.size,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Outer ring */}
            <div className="w-full h-full rounded-full bg-red-400 flex items-center justify-center">
              {/* Middle ring */}
              <div className="w-3/4 h-3/4 rounded-full bg-white flex items-center justify-center">
                {/* Inner ring */}
                <div className="w-1/2 h-1/2 rounded-full bg-red-600 flex items-center justify-center">
                  {/* Bull's eye */}
                  <div className="w-1/3 h-1/3 rounded-full bg-yellow-400" />
                </div>
              </div>
            </div>
            
            {/* Pulsing effect */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-red-300"
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className={`bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 text-sm text-gray-600 ${fonts.body}`}>
          คลิกที่เป้าหมาย! 🎯
        </div>
      </div>

      {/* Star Completed Modal */}
      {starCompleted && !gameCompleted && (
        <motion.div
          className="absolute inset-0 bg-black/50 flex items-center justify-center z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-6xl mb-4">⭐</div>
            <h3 className={`text-2xl ${fonts.kid} text-gray-800 mb-2`}>ได้ดาวแล้ว!</h3>
            <p className={`text-gray-600 mb-4 ${fonts.body}`}>
              ดาวที่ {currentStar} เสร็จแล้ว! 🎉
            </p>
            
            {/* Stars Progress */}
            <div className="flex justify-center mb-4">
              {Array.from({ length: 5 }, (_, index) => (
                <span 
                  key={index}
                  className={`text-3xl mx-1 ${
                    index < earnedStars ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  {index < earnedStars ? '⭐' : '☆'}
                </span>
              ))}
            </div>

            {currentStar < 5 ? (
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
                onClick={nextStar}
              >
                ➡️ ดาวถัดไป
              </button>
            ) : (
              <p className={`text-green-600 font-bold ${fonts.body}`}>
                🏆 ผ่านเกมแล้ว!
              </p>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Game Completed */}
      {gameCompleted && (
        <motion.div
          className="absolute inset-0 bg-black/50 flex items-center justify-center z-20"
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
            <h3 className={`text-3xl ${fonts.kid} text-gray-800 mb-2`}>ยอดเยี่ยม!</h3>
            <p className={`text-gray-600 mb-4 ${fonts.body}`}>
              คุณผ่านเกมเป้าหมายแสนสนุกแล้ว! 🎉
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
            
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
              onClick={resetGame}
            >
              🔄 {t('playAgain')}
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ClickTargetGame;