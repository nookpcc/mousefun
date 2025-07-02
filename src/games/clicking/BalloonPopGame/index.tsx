import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProps } from '../../../types';
import { useFontClasses } from '../../../hooks/useFontClasses';
import { useLanguage } from '../../../contexts/LanguageContext';
import { BalloonPopGameState } from './types';
import { BALLOON_POP_STAR_LEVELS } from './constants';
import { createBalloon } from './utils';

interface BalloonPopGameProps extends GameProps {}

const BalloonPopGame: React.FC<BalloonPopGameProps> = ({ 
  onStarEarned, 
  onGameComplete, 
  currentStars = 0,
  gameKey = 0
}) => {
  const fonts = useFontClasses();
  const { t } = useLanguage();
  
  const [gameState, setGameState] = useState<BalloonPopGameState>({
    balloons: [],
    currentStar: 1,
    balloonsPopped: 0,
    gameStarted: false,
    starCompleted: false,
    gameCompleted: false,
    earnedStars: 0,
    timeRemaining: 0,
    mousePosition: { x: 0, y: 0 },
    lastSpawn: 0
  });
  
  const [starEarnedEffect, setStarEarnedEffect] = useState(false);
  const [pendingStarEarned, setPendingStarEarned] = useState<number | null>(null);
  const [pendingGameComplete, setPendingGameComplete] = useState(false);

  // Reset game when gameKey changes
  useEffect(() => {
    if (gameKey > 0) {
      resetGame();
    }
  }, [gameKey]);

  const resetGame = () => {
    const level = BALLOON_POP_STAR_LEVELS[0];
    setGameState({
      balloons: [],
      currentStar: 1,
      balloonsPopped: 0,
      gameStarted: false,
      starCompleted: false,
      gameCompleted: false,
      earnedStars: 0,
      timeRemaining: level.timeLimit,
      mousePosition: { x: 364, y: 200 },
      lastSpawn: 0
    });
  };

  const getCurrentLevel = () => BALLOON_POP_STAR_LEVELS[gameState.currentStar - 1];

  const startGame = () => {
    const level = getCurrentLevel();
    const balloons = [createBalloon(level)];
    
    setGameState(prev => ({
      ...prev,
      gameStarted: true,
      balloons,
      balloonsPopped: 0,
      starCompleted: false,
      timeRemaining: level.timeLimit,
      lastSpawn: Date.now()
    }));
  };

  // Auto spawn balloons every few seconds
  useEffect(() => {
    if (!gameState.gameStarted || gameState.starCompleted || gameState.gameCompleted) return;

    const level = BALLOON_POP_STAR_LEVELS[gameState.currentStar - 1];
    
    const spawnInterval = setInterval(() => {
      setGameState(prev => {
        // Remove balloons that floated off screen or have been popped
        const now = Date.now();
        const activeBalloons = prev.balloons.filter(b => {
          if (b.popped) {
            return false; // Remove popped balloons immediately
          }
          // Remove balloons that have been floating for more than 7 seconds
          const age = now - b.created;
          return age < 7000;
        });
        
        // Don't spawn too many balloons at once
        if (activeBalloons.filter(b => !b.popped).length < 3) {
          const newBalloon = createBalloon(level);
          return {
            ...prev,
            balloons: [...activeBalloons, newBalloon],
            lastSpawn: Date.now()
          };
        }
        return {
          ...prev,
          balloons: activeBalloons
        };
      });
    }, level.spawnRate);

    return () => clearInterval(spawnInterval);
  }, [gameState.gameStarted, gameState.starCompleted, gameState.gameCompleted, gameState.currentStar]);

  const handleBalloonClick = useCallback((balloonId: string) => {
    if (gameState.starCompleted || gameState.gameCompleted) return;
    
    setGameState(prev => {
      const level = BALLOON_POP_STAR_LEVELS[prev.currentStar - 1];
      const updatedBalloons = prev.balloons.map(b => 
        b.id === balloonId ? { ...b, popped: true } : b
      );
      
      const newBalloonsPopped = prev.balloonsPopped + 1;
      
      let updates: Partial<BalloonPopGameState> = {
        balloons: updatedBalloons,
        balloonsPopped: newBalloonsPopped
      };
      
      // Check if star level completed
      if (newBalloonsPopped >= level.target && !prev.starCompleted) {
        const newStarCount = prev.earnedStars + 1;
        updates = {
          ...updates,
          starCompleted: true,
          earnedStars: newStarCount
        };
        
        // Trigger star earned effect
        setStarEarnedEffect(true);
        setTimeout(() => setStarEarnedEffect(false), 2000);
        
        // Set pending callbacks to be handled in useEffect
        setPendingStarEarned(newStarCount);
        
        // Check if we earned all 5 stars
        if (newStarCount === 5) {
          updates.gameCompleted = true;
          setPendingGameComplete(true);
        } else {
          // Auto advance to next star after delay
          setTimeout(() => {
            const nextStarNumber = newStarCount + 1;
            if (nextStarNumber <= 5 && nextStarNumber <= BALLOON_POP_STAR_LEVELS.length) {
              const nextLevel = BALLOON_POP_STAR_LEVELS[nextStarNumber - 1];
              const newBalloons = [createBalloon(nextLevel)];
              
              setGameState(currentState => ({
                ...currentState,
                currentStar: nextStarNumber,
                balloons: newBalloons,
                balloonsPopped: 0,
                starCompleted: false,
                timeRemaining: nextLevel.timeLimit,
                lastSpawn: Date.now()
              }));
            }
          }, 2000);
        }
      }
      
      return { ...prev, ...updates };
    });
  }, [gameState.starCompleted, gameState.gameCompleted]);

  const handleBalloonOffscreen = (balloonId: string) => {
    setGameState(prev => ({
      ...prev,
      balloons: prev.balloons.filter(b => b.id !== balloonId)
    }));
  };

  // Handle pending callbacks to avoid setState during render
  useEffect(() => {
    if (pendingStarEarned !== null) {
      onStarEarned?.(pendingStarEarned);
      setPendingStarEarned(null);
    }
  }, [pendingStarEarned, onStarEarned]);

  useEffect(() => {
    if (pendingGameComplete) {
      onGameComplete?.(true);
      setPendingGameComplete(false);
    }
  }, [pendingGameComplete, onGameComplete]);

  if (!gameState.gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-100 to-green-100 rounded-lg">
        <div className="text-6xl mb-4">🎈</div>
        <h2 className={`text-2xl ${fonts.kid} text-gray-800 mb-4`}>{t('title', 'balloon-pop')}</h2>
        <p className={`text-gray-600 mb-6 text-center max-w-md ${fonts.body} text-lg`}>
          {t('description', 'balloon-pop')}
        </p>
        
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
          onClick={startGame}
        >
          🎮 {t('startGame')}
        </button>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-full bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden"
    >
      {/* Game Title - Top left */}
      <div className="absolute top-4 left-4 z-10">
        <div 
          className="text-white font-bold text-xl"
          style={{
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
          }}
        >
          <span className={`${fonts.kid}`}>
            🎈 {t('title', 'balloon-pop')}
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
                index < gameState.earnedStars ? 'text-yellow-300' : 'text-gray-300'
              }`}
              style={{
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
              }}
              animate={starEarnedEffect && index === gameState.earnedStars - 1 ? {
                scale: [1, 1.5, 1],
                rotate: [0, 360]
              } : {}}
              transition={{ duration: 0.6 }}
            >
              {index < gameState.earnedStars ? '⭐' : '☆'}
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
            🎈 {gameState.balloonsPopped}/{getCurrentLevel().target} ลูกโป่ง
          </span>
        </div>
      </div>

      {/* Balloons */}
      <AnimatePresence>
        {gameState.balloons.map((balloon) => (
          <motion.div
            key={balloon.id}
            className="absolute cursor-pointer"
            style={{
              left: balloon.position.x,
              width: balloon.size,
              height: balloon.size,
            }}
            initial={{ scale: 0, opacity: 0, y: balloon.position.y }}
            animate={{ 
              scale: balloon.popped ? [1, 1.2, 0] : 1, 
              opacity: balloon.popped ? 0 : 1,
              y: balloon.popped ? balloon.position.y : balloon.position.y - 500
            }}
            exit={{ scale: 0, opacity: 0 }}
            onUpdate={(latest) => {
              if (typeof latest.y === 'number' && latest.y < -balloon.size) {
                handleBalloonOffscreen(balloon.id);
              }
            }}
            transition={{ 
              scale: { duration: balloon.popped ? 0.5 : 0.3 },
              opacity: { duration: balloon.popped ? 0.5 : 0.3 },
              y: { duration: balloon.popped ? 0 : 6, ease: "linear" }
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (!balloon.popped) {
                handleBalloonClick(balloon.id);
              }
            }}
          >
            <motion.div
              className="w-full h-full flex items-center justify-center"
              style={{ 
                fontSize: balloon.size * 0.8
              }}
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "easeInOut"
              }}
            >
              🎈
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>

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
      {gameState.gameCompleted && (
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
            <h3 className={`text-3xl ${fonts.kid} text-gray-800 mb-2`}>🎉 ยอดเยี่ยม! 🎉</h3>
            <p className={`text-gray-600 mb-4 ${fonts.body}`}>
              คุณเล่น {t('title', 'balloon-pop')} เก่งมาก! 🎈
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
                onClick={resetGame}
              >
                🔄 {t('playAgain')}
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('nextGame'));
                }}
              >
                ➡️ {t('nextGame')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default BalloonPopGame;