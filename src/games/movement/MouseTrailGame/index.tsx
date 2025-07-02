import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProps } from '../../../types';
import { useFontClasses } from '../../../hooks/useFontClasses';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Star, MouseTrailGameState } from './types';
import { MOUSE_TRAIL_STAR_LEVELS, TRAIL_LENGTH } from './constants';
import { generateAllStars, checkStarCollection, updateTrail } from './utils';

interface MouseTrailGameProps extends GameProps {}

const MouseTrailGame: React.FC<MouseTrailGameProps> = ({ 
  onStarEarned, 
  onGameComplete, 
  currentStars = 0,
  gameKey = 0
}) => {
  const fonts = useFontClasses();
  const { t } = useLanguage();
  
  const [gameState, setGameState] = useState<MouseTrailGameState>({
    stars: [],
    currentStar: 1,
    starsCollected: 0,
    gameStarted: false,
    starCompleted: false,
    gameCompleted: false,
    earnedStars: 0,
    timeRemaining: 0,
    mousePosition: { x: 0, y: 0 },
    trail: []
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
    const level = MOUSE_TRAIL_STAR_LEVELS[0];
    setGameState({
      stars: [],
      currentStar: 1,
      starsCollected: 0,
      gameStarted: false,
      starCompleted: false,
      gameCompleted: false,
      earnedStars: 0,
      timeRemaining: level.timeLimit,
      mousePosition: { x: 364, y: 200 }, // Center
      trail: []
    });
  };

  const getCurrentLevel = () => MOUSE_TRAIL_STAR_LEVELS[gameState.currentStar - 1];

  const startGame = () => {
    const level = getCurrentLevel();
    const stars = generateAllStars(level);
    
    setGameState(prev => ({
      ...prev,
      gameStarted: true,
      stars,
      starsCollected: 0,
      starCompleted: false,
      timeRemaining: level.timeLimit
    }));
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameState.gameStarted || gameState.starCompleted || gameState.gameCompleted) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const mousePos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    setGameState(prev => {
      // Update mouse position and trail
      const newTrail = updateTrail(prev.trail, mousePos, TRAIL_LENGTH);
      
      // Check for star collection
      let collectedCount = 0;
      const updatedStars = prev.stars.map(star => {
        if (!star.collected && checkStarCollection(mousePos, star)) {
          collectedCount++;
          return { ...star, collected: true };
        }
        return star;
      });
      
      const newStarsCollected = prev.starsCollected + collectedCount;
      const level = getCurrentLevel();
      
      let updates: Partial<MouseTrailGameState> = {
        mousePosition: mousePos,
        trail: newTrail,
        stars: updatedStars,
        starsCollected: newStarsCollected
      };
      
      // Check if star level completed
      if (newStarsCollected >= level.target && !prev.starCompleted) {
        const newStarCount = prev.earnedStars + 1;
        updates = {
          ...updates,
          starCompleted: true,
          earnedStars: newStarCount
        };
        
        // Effects will be handled in useEffect
        
        // Trigger star earned effect immediately
        setStarEarnedEffect(true);
        setTimeout(() => setStarEarnedEffect(false), 2000);
        
        // Set pending callbacks to be handled in useEffect
        setPendingStarEarned(newStarCount);
        
        // Check if we earned all 5 stars (should only complete when we have 5 stars)
        if (newStarCount === 5) {
          updates.gameCompleted = true;
          setPendingGameComplete(true);
        } else {
          // Set the next star number immediately in the current update
          const nextStarNumber = prev.currentStar + 1;
          if (nextStarNumber <= 5 && nextStarNumber <= MOUSE_TRAIL_STAR_LEVELS.length) {
            const nextLevel = MOUSE_TRAIL_STAR_LEVELS[nextStarNumber - 1];
            const newStars = generateAllStars(nextLevel);
            
            // Auto advance to next star after delay
            setTimeout(() => {
              setGameState(currentState => ({
                ...currentState,
                currentStar: nextStarNumber,
                stars: newStars,
                starsCollected: 0,
                starCompleted: false,
                timeRemaining: nextLevel.timeLimit,
                trail: []
              }));
            }, 2000);
          }
        }
      }
      
      return { ...prev, ...updates };
    });
  }, [gameState.gameStarted, gameState.starCompleted, gameState.gameCompleted, gameState.currentStar, onStarEarned, onGameComplete]);

  const nextStar = () => {
    if (gameState.currentStar < 5) {
      const nextLevel = MOUSE_TRAIL_STAR_LEVELS[gameState.currentStar];
      const stars = generateAllStars(nextLevel);
      
      setGameState(prev => ({
        ...prev,
        currentStar: prev.currentStar + 1,
        stars,
        starsCollected: 0,
        starCompleted: false,
        timeRemaining: nextLevel.timeLimit,
        trail: []
      }));
    }
  };

  // Handle pending callbacks to avoid setState during render\n  useEffect(() => {\n    if (pendingStarEarned !== null) {\n      onStarEarned?.(pendingStarEarned);\n      setPendingStarEarned(null);\n    }\n  }, [pendingStarEarned, onStarEarned]);\n\n  useEffect(() => {\n    if (pendingGameComplete) {\n      onGameComplete?.(true);\n      setPendingGameComplete(false);\n    }\n  }, [pendingGameComplete, onGameComplete]);\n\n  // No timer for Mouse Trail Magic - removed countdown effect"

  if (!gameState.gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
        <div className="text-6xl mb-4">💎</div>
        <h2 className={`text-2xl ${fonts.kid} text-gray-800 mb-4`}>{t('title', 'mouse-trail')}</h2>
        <p className={`text-gray-600 mb-6 text-center max-w-md ${fonts.body} text-lg`}>
          {t('description', 'mouse-trail')}
        </p>
        
        <button
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
          onClick={startGame}
        >
          🎮 {t('startGame')}
        </button>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg overflow-hidden cursor-none"
      onMouseMove={handleMouseMove}
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
            💎 {t('title', 'mouse-trail')}
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
            💎 {gameState.starsCollected}/{getCurrentLevel().target} {t('gems')}
          </span>
        </div>
      </div>

      {/* Enhanced Mouse Trail */}
      {gameState.trail.map((point, index) => (
        <motion.div
          key={index}
          className="absolute pointer-events-none"
          style={{
            left: point.x - 8,
            top: point.y - 8,
            width: 16,
            height: 16
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ 
            scale: point.opacity,
            opacity: point.opacity * 0.8
          }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <div 
            className="w-full h-full rounded-full"
            style={{
              background: `radial-gradient(circle, 
                rgba(255, 215, 0, ${point.opacity}) 0%, 
                rgba(255, 140, 0, ${point.opacity * 0.8}) 50%, 
                rgba(255, 69, 0, ${point.opacity * 0.5}) 100%)
              `,
              boxShadow: `0 0 ${8 * point.opacity}px rgba(255, 215, 0, ${point.opacity * 0.8})`
            }}
          />
        </motion.div>
      ))}

      {/* Stars */}
      <AnimatePresence>
        {gameState.stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute pointer-events-none"
            style={{
              left: star.position.x - star.size! / 2,
              top: star.position.y - star.size! / 2,
              width: star.size,
              height: star.size,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: star.collected ? 0 : 1, 
              opacity: star.collected ? 0 : 1,
              rotate: star.collected ? 360 : 0
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-full h-full flex items-center justify-center text-yellow-400"
              style={{ fontSize: star.size! * 0.8 }}
              animate={{ 
                scale: [1, 1.2, 1],
                filter: `brightness(${star.glowIntensity})`
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5,
                ease: "easeInOut"
              }}
            >
              💎
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Custom cursor */}
      <motion.div
        className="absolute w-6 h-6 pointer-events-none z-20"
        style={{
          left: gameState.mousePosition.x - 12,
          top: gameState.mousePosition.y - 12
        }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        <div className="w-full h-full bg-yellow-400 rounded-full border-2 border-yellow-600 shadow-lg" />
      </motion.div>

      {/* Star Earned Effect - No Modal */}
      {starEarnedEffect && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none cursor-default"
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
              คุณเล่น {t('title', 'mouse-trail')} เก่งมาก! 💎
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
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
                onClick={resetGame}
              >
                🔄 {t('playAgain')}
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
                onClick={() => {
                  // Navigate to next game logic - will be handled by parent
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

export default MouseTrailGame;