import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProps } from '../types';
import { useFontClasses } from '../hooks/useFontClasses';
import { useLanguage } from '../contexts/LanguageContext';

interface Bubble {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
}

interface StarLevel {
  star: number;
  bubbleCount: number;
  bubbleSpeed: number;
  bubbleSize: { min: number; max: number };
  spawnRate: number;
  description: string;
}

const STAR_LEVELS: StarLevel[] = [
  {
    star: 1,
    bubbleCount: 3,
    bubbleSpeed: 0.5,
    bubbleSize: { min: 50, max: 70 },
    spawnRate: 2000,
    description: 'ฟองใหญ่ ช้าๆ ง่ายมาก'
  },
  {
    star: 2,
    bubbleCount: 5,
    bubbleSpeed: 1,
    bubbleSize: { min: 40, max: 60 },
    spawnRate: 1800,
    description: 'ฟองปานกลาง เร็วขึ้นหน่อย'
  },
  {
    star: 3,
    bubbleCount: 7,
    bubbleSpeed: 1.5,
    bubbleSize: { min: 35, max: 55 },
    spawnRate: 1500,
    description: 'ฟองเล็กลง เร็วขึ้น'
  },
  {
    star: 4,
    bubbleCount: 10,
    bubbleSpeed: 2,
    bubbleSize: { min: 30, max: 50 },
    spawnRate: 1200,
    description: 'ฟองเล็ก เร็วมาก'
  },
  {
    star: 5,
    bubbleCount: 12,
    bubbleSpeed: 2.5,
    bubbleSize: { min: 25, max: 45 },
    spawnRate: 1000,
    description: 'ฟองจิ๋ว เร็วสุดๆ!'
  }
];

interface BubblePopGameProps extends GameProps {}

const BubblePopGame: React.FC<BubblePopGameProps> = ({ 
  onStarEarned, 
  onGameComplete, 
  gameKey = 0
}) => {
  const fonts = useFontClasses();
  const { t } = useLanguage();
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [currentStar, setCurrentStar] = useState(1);
  const [bubblesPopped, setBubblesPopped] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [starCompleted, setStarCompleted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);

  const colors = [
    'bg-red-300', 'bg-blue-300', 'bg-green-300', 
    'bg-yellow-300', 'bg-purple-300', 'bg-pink-300'
  ];

  // Reset game when gameKey changes
  useEffect(() => {
    if (gameKey > 0) {
      resetGame();
    }
  }, [gameKey]);

  const resetGame = () => {
    setCurrentStar(1);
    setBubblesPopped(0);
    setGameStarted(false);
    setStarCompleted(false);
    setGameCompleted(false);
    setEarnedStars(0);
    setBubbles([]);
  };

  const getCurrentLevel = () => STAR_LEVELS[currentStar - 1];

  const generateBubble = useCallback((): Bubble => {
    const level = getCurrentLevel();
    const size = Math.random() * (level.bubbleSize.max - level.bubbleSize.min) + level.bubbleSize.min;
    return {
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * (728 - size - 100) + 50,
      y: Math.random() * (500 - size - 200) + 100,
      size,
      speed: level.bubbleSpeed,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  }, [currentStar]);

  const startGame = () => {
    setGameStarted(true);
    setBubblesPopped(0);
    setStarCompleted(false);
  };

  const popBubble = (bubbleId: string) => {
    setBubbles(prev => prev.filter(bubble => bubble.id !== bubbleId));
    setBubblesPopped(prev => {
      const newCount = prev + 1;
      const level = getCurrentLevel();
      
      // Check if current star level is completed
      if (newCount >= level.bubbleCount) {
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
      
      return newCount;
    });
  };

  const nextStar = () => {
    if (currentStar < 5) {
      setCurrentStar(prev => prev + 1);
      setBubblesPopped(0);
      setStarCompleted(false);
      setBubbles([]);
    }
  };

  // Bubble spawning system
  useEffect(() => {
    if (!gameStarted || starCompleted || gameCompleted) return;

    const level = getCurrentLevel();
    const bubbleInterval = setInterval(() => {
      setBubbles(prev => {
        if (prev.length < level.bubbleCount) {
          return [...prev, generateBubble()];
        }
        return prev;
      });
    }, level.spawnRate);

    return () => clearInterval(bubbleInterval);
  }, [gameStarted, starCompleted, gameCompleted, currentStar, generateBubble]);

  // Bubble cleanup (remove old bubbles)
  useEffect(() => {
    const cleanup = setInterval(() => {
      setBubbles(prev => {
        const now = Date.now();
        return prev.filter(bubble => {
          return now - parseInt(bubble.id, 36) < 8000; // Remove after 8 seconds
        });
      });
    }, 1000);

    return () => clearInterval(cleanup);
  }, []);

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
        <div className="text-6xl mb-4">🫧</div>
        <h2 className={`text-2xl ${fonts.kid} text-gray-800 mb-4`}>{t('title', 'bubble-pop')}</h2>
        <p className={`text-gray-600 mb-6 text-center max-w-md ${fonts.body}`}>
          {t('description', 'bubble-pop')}
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
    <div className="relative w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg overflow-hidden">
      {/* Game UI */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2">
          <span className={`${fonts.kid} text-lg`}>
            ⭐ {currentStar}/5 ({bubblesPopped}/{getCurrentLevel().bubbleCount})
          </span>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2">
          <span className={`${fonts.kid} text-sm`}>{getCurrentLevel().description}</span>
        </div>
      </div>

      {/* Stars Progress Top */}
      {/* Removed - using top right stars instead */}

      {/* Bubbles */}
      <AnimatePresence>
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className={`absolute bubble ${bubble.color} border-2 border-white/50 shadow-lg cursor-pointer`}
            style={{
              left: bubble.x,
              top: bubble.y,
              width: bubble.size,
              height: bubble.size,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              y: [0, -10, 0],
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              duration: 0.3,
              y: { repeat: Infinity, duration: 2 / bubble.speed }
            }}
            onClick={() => popBubble(bubble.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-white/30 to-transparent" />
          </motion.div>
        ))}
      </AnimatePresence>

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
              คุณผ่านเกมจับฟองสบู่แล้ว! 🎉
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

export default BubblePopGame;