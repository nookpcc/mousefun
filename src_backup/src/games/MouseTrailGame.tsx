import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProps } from '../types';
import { useFontClasses } from '../hooks/useFontClasses';
import { useLanguage } from '../contexts/LanguageContext';

interface Star {
  id: string;
  x: number;
  y: number;
  collected: boolean;
  size: number;
}

interface StarLevel {
  star: number;
  starCount: number;
  starSize: number;
  moveSpeed: number;
  collectRadius: number;
  description: string;
}

const STAR_LEVELS: StarLevel[] = [
  {
    star: 1,
    starCount: 5,
    starSize: 40,
    moveSpeed: 1,
    collectRadius: 35,
    description: 'ดาวใหญ่ ง่ายมาก'
  },
  {
    star: 2,
    starCount: 8,
    starSize: 35,
    moveSpeed: 1.2,
    collectRadius: 30,
    description: 'ดาวปานกลาง'
  },
  {
    star: 3,
    starCount: 12,
    starSize: 30,
    moveSpeed: 1.5,
    collectRadius: 25,
    description: 'ดาวเล็กลง'
  },
  {
    star: 4,
    starCount: 15,
    starSize: 25,
    moveSpeed: 1.8,
    collectRadius: 20,
    description: 'ดาวเล็ก ต้องแม่นยำ'
  },
  {
    star: 5,
    starCount: 20,
    starSize: 20,
    moveSpeed: 2,
    collectRadius: 18,
    description: 'ดาวจิ๋ว ท้าทายสุดๆ!'
  }
];

interface MouseTrailGameProps extends GameProps {}

const MouseTrailGame: React.FC<MouseTrailGameProps> = ({ 
  onStarEarned, 
  onGameComplete, 
  gameKey = 0
}) => {
  const fonts = useFontClasses();
  const { t } = useLanguage();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentStar, setCurrentStar] = useState(1);
  const [starsCollected, setStarsCollected] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState<Star[]>([]);
  const [starCompleted, setStarCompleted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [mouseTrail, setMouseTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Reset game when gameKey changes
  useEffect(() => {
    if (gameKey > 0) {
      resetGame();
    }
  }, [gameKey]);

  const resetGame = () => {
    setCurrentStar(1);
    setStarsCollected(0);
    setGameStarted(false);
    setStarCompleted(false);
    setGameCompleted(false);
    setEarnedStars(0);
    setStars([]);
    setMouseTrail([]);
  };

  const getCurrentLevel = () => STAR_LEVELS[currentStar - 1];

  const generateStars = () => {
    const level = getCurrentLevel();
    const newStars: Star[] = [];
    for (let i = 0; i < level.starCount; i++) {
      newStars.push({
        id: `star-${currentStar}-${i}`,
        x: Math.random() * (628 - level.starSize) + 50,
        y: Math.random() * (400 - level.starSize) + 80,
        collected: false,
        size: level.starSize
      });
    }
    setStars(newStars);
  };

  const startGame = () => {
    setGameStarted(true);
    setStarsCollected(0);
    setStarCompleted(false);
    generateStars();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameAreaRef.current || !gameStarted || starCompleted || gameCompleted) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });

    // Add to mouse trail
    setMouseTrail(prev => {
      const newTrail = [{ x, y, id: Date.now() }, ...prev.slice(0, 10)];
      return newTrail;
    });

    const level = getCurrentLevel();

    // Check for star collection
    setStars(prevStars => {
      let newCollectedCount = starsCollected;
      const updatedStars = prevStars.map(star => {
        if (!star.collected) {
          const distance = Math.sqrt(
            Math.pow(x - (star.x + star.size / 2), 2) + 
            Math.pow(y - (star.y + star.size / 2), 2)
          );
          if (distance < level.collectRadius) {
            newCollectedCount++;
            return { ...star, collected: true };
          }
        }
        return star;
      });
      
      if (newCollectedCount !== starsCollected) {
        setStarsCollected(newCollectedCount);
        
        // Check if current star level is completed
        if (newCollectedCount >= level.starCount) {
          setStarCompleted(true);
          const newStarCount = earnedStars + 1;
          setEarnedStars(newStarCount);
          onStarEarned?.(newStarCount);
          
          // Check if game is completed (5 stars)
          if (currentStar >= 5) {
            setGameCompleted(true);
            onGameComplete?.(true);
          }
        }
      }
      
      return updatedStars;
    });
  };

  const nextStar = () => {
    if (currentStar < 5) {
      setCurrentStar(prev => prev + 1);
      setStarsCollected(0);
      setStarCompleted(false);
      generateStars();
    }
  };

  // Clean up mouse trail
  useEffect(() => {
    const interval = setInterval(() => {
      setMouseTrail(prev => prev.slice(0, 8));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
        <div className="text-6xl mb-4">⭐</div>
        <h2 className={`text-2xl ${fonts.kid} text-gray-800 mb-4`}>{t('title', 'mouse-trail')}</h2>
        <p className={`text-gray-600 mb-6 text-center max-w-md ${fonts.body}`}>
          {t('description', 'mouse-trail')}
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
      ref={gameAreaRef}
      className="relative w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg overflow-hidden cursor-none"
      onMouseMove={handleMouseMove}
    >
      {/* Game UI */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2">
          <span className={`${fonts.kid} text-lg`}>
            ⭐ {currentStar}/5 ({starsCollected}/{getCurrentLevel().starCount})
          </span>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2">
          <span className={`${fonts.kid} text-sm`}>{getCurrentLevel().description}</span>
        </div>
      </div>

      {/* Stars Progress Top */}
      {/* Removed - using top right stars instead */}

      {/* Stars */}
      <AnimatePresence>
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className={`absolute ${star.collected ? 'opacity-0' : 'opacity-100'}`}
            style={{ 
              left: star.x, 
              top: star.y,
              width: star.size,
              height: star.size
            }}
            animate={star.collected ? 
              { scale: 2, opacity: 0 } : 
              { scale: [1, 1.2, 1], rotate: [0, 360] }
            }
            transition={star.collected ? 
              { duration: 0.3 } : 
              { duration: 3, repeat: Infinity, ease: "linear" }
            }
          >
            <div className="text-3xl">⭐</div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Mouse trail */}
      {mouseTrail.map((point, index) => (
        <motion.div
          key={point.id}
          className="absolute w-2 h-2 bg-yellow-300 rounded-full pointer-events-none"
          style={{ 
            left: point.x - 4, 
            top: point.y - 4,
            opacity: 1 - (index * 0.1)
          }}
          initial={{ scale: 1 }}
          animate={{ scale: 0 }}
          transition={{ duration: 1 }}
        />
      ))}

      {/* Mouse cursor */}
      <motion.div
        className="absolute w-8 h-8 pointer-events-none z-20"
        style={{ left: mousePosition.x - 16, top: mousePosition.y - 16 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        <div className="w-full h-full bg-yellow-400 rounded-full border-2 border-yellow-600 shadow-lg">
          <div className="w-full h-full bg-gradient-to-tr from-yellow-300 to-transparent rounded-full" />
        </div>
      </motion.div>

      {/* Star Completed Modal */}
      {starCompleted && !gameCompleted && (
        <motion.div
          className="absolute inset-0 bg-black/50 flex items-center justify-center z-30"
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
          className="absolute inset-0 bg-black/50 flex items-center justify-center z-30"
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
              คุณผ่านเกมเก็บดวงดาวแล้ว! 🎉
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

export default MouseTrailGame;