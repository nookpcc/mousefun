import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProps } from '../../../types';
import { useFontClasses } from '../../../hooks/useFontClasses';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ActionClickerGameState, ClickType } from './types';
import { ACTION_CLICKER_STAR_LEVELS, MISS_PENALTY } from './constants';
import { generateTarget, shouldSpawnTarget } from './utils';

interface ActionClickerGameProps extends GameProps {}

const ActionClickerGame: React.FC<ActionClickerGameProps> = ({
  onStarEarned,
  onGameComplete,
  gameKey = 0
}) => {
  const fonts = useFontClasses();
  const { t } = useLanguage();
  
  const [gameState, setGameState] = useState<ActionClickerGameState>({
    targets: [],
    currentStar: 1,
    targetsHit: 0,
    score: 0,
    gameStarted: false,
    starCompleted: false,
    gameCompleted: false,
    earnedStars: 0,
    missedClicks: 0
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
    const level = ACTION_CLICKER_STAR_LEVELS[0];
    setGameState({
      targets: [],
      currentStar: 1,
      targetsHit: 0,
      score: 0,
      gameStarted: false,
      starCompleted: false,
      gameCompleted: false,
      earnedStars: 0,
      missedClicks: 0
    });
  };

  const getCurrentLevel = () => ACTION_CLICKER_STAR_LEVELS[gameState.currentStar - 1];

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      gameStarted: true,
      targets: [],
      targetsHit: 0,
      score: 0,
      starCompleted: false,
      missedClicks: 0
    }));
  };

  const hitTarget = (targetId: string, clickType: ClickType) => {
    setGameState(prev => {
      const targetToHit = prev.targets.find(t => t.id === targetId);
      if (!targetToHit || targetToHit.isHit) return prev; // Already hit or not found

      let newScore = prev.score;
      let newTargetsHit = prev.targetsHit;
      let updatedTargets = prev.targets;

      if (targetToHit.clickType === clickType) {
        // Correct click
        newTargetsHit++;
        newScore += targetToHit.points;
        updatedTargets = prev.targets.map(target => 
          target.id === targetId 
            ? { ...target, isHit: true, isActive: false }
            : target
        );
      } else {
        // Incorrect click
        newScore = Math.max(0, newScore + MISS_PENALTY);
        // Optionally, make the target disappear or change color to indicate miss
        updatedTargets = prev.targets.map(target => 
          target.id === targetId 
            ? { ...target, isActive: false } // Make it disappear on wrong click
            : target
        );
      }
      
      const level = getCurrentLevel();
      
      let updates: Partial<ActionClickerGameState> = {
        targets: updatedTargets,
        targetsHit: newTargetsHit,
        score: newScore
      };
      
      // Check if star level completed
      if (newTargetsHit >= level.target && !prev.starCompleted) {
        const newStarCount = prev.earnedStars + 1;
        updates = {
          ...updates,
          starCompleted: true,
          earnedStars: newStarCount,
        };
        
        // Trigger star earned effect immediately
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
          const nextStarNumber = prev.currentStar + 1;
          if (nextStarNumber <= 5 && nextStarNumber <= ACTION_CLICKER_STAR_LEVELS.length) {
            setTimeout(() => {
              const nextLevel = ACTION_CLICKER_STAR_LEVELS[nextStarNumber - 1];
              setGameState(currentState => ({
                ...currentState,
                currentStar: nextStarNumber,
                targets: [],
                targetsHit: 0,
                starCompleted: false,
                timeRemaining: nextLevel.timeLimit,
                missedClicks: 0
              }));
            }, 2000);
          }
        }
      }
      
      return { ...prev, ...updates };
    });
  };

  const handleGameClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameState.gameStarted || gameState.starCompleted || gameState.gameCompleted) return;

    // Check if clicked on a target
    const targetElement = (e.target as HTMLElement).closest('[data-target-id]');
    if (targetElement) {
      const targetId = targetElement.getAttribute('data-target-id');
      const clickType: ClickType = e.button === 0 ? 'left' : 'right'; // 0 for left, 2 for right
      if (targetId) {
        hitTarget(targetId, clickType);
      }
    } else {
      // Clicked on empty space - count as a miss
      setGameState(prev => ({
        ...prev,
        missedClicks: prev.missedClicks + 1,
        score: Math.max(0, prev.score + MISS_PENALTY)
      }));
    }
  }, [gameState.gameStarted, gameState.starCompleted, gameState.gameCompleted, hitTarget]);

  // Target spawning system
  useEffect(() => {
    if (!gameState.gameStarted || gameState.starCompleted || gameState.gameCompleted) return;

    const level = getCurrentLevel();
    const spawnInterval = setInterval(() => {
      setGameState(prev => {
        if (shouldSpawnTarget(prev.targets, level.targetCount)) {
          return {
            ...prev,
            targets: [...prev.targets, generateTarget(level)]
          };
        }
        return prev;
      });
    }, level.spawnRate);

    return () => clearInterval(spawnInterval);
  }, [gameState.gameStarted, gameState.starCompleted, gameState.gameCompleted, gameState.currentStar]);

  // Target cleanup (remove hit/inactive targets)
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        targets: prev.targets.filter(target => target.isActive)
      }));
    }, 500); // Clean up every 0.5 seconds

    return () => clearInterval(cleanupInterval);
  }, []);

  

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
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
        <div className="text-6xl mb-4">🖱️</div>
        <h2 className={`text-2xl ${fonts.kid} text-gray-800 mb-4`}>{t('actionClickerTitle')}</h2>
        <p className={`text-gray-600 mb-6 text-center max-w-md ${fonts.body}`}>
          {t('actionClickerDescription')}
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
      className="relative w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg overflow-hidden"
      onMouseDown={handleGameClick} // Use onMouseDown to capture right-clicks
      onContextMenu={(e) => e.preventDefault()} // Prevent context menu on right-click
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
            🖱️ {t('actionClickerTitle')}
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
            🎯 {gameState.targetsHit}/{getCurrentLevel().target} {t('targets')}
          </span>
        </div>
      </div>

      

      {/* Targets */}
      <AnimatePresence>
        {gameState.targets.filter(t => t.isActive).map((target) => (
          <motion.div
            key={target.id}
            data-target-id={target.id} // Custom attribute to identify target on click
            className={`absolute rounded-full border-4 cursor-pointer shadow-lg`}
            style={{
              left: target.position.x,
              top: target.position.y,
              width: target.size,
              height: target.size,
              backgroundColor: target.clickType === 'left' ? '#4CAF50' : '#FFC107', // Green for left, Amber for right
              borderColor: target.clickType === 'left' ? '#388E3C' : '#FFA000',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              rotate: [0, 10, -10, 0] // Little wobble animation
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
              {target.clickType === 'left' ? 'L' : 'R'}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Miss indicator */}
      {gameState.missedClicks > 0 && (
        <div className="absolute bottom-4 left-4 bg-red-500/80 backdrop-blur-sm rounded-lg px-3 py-1">
          <span className={`${fonts.kid} text-white text-sm`}>
            ❌ พลาด: {gameState.missedClicks}
          </span>
        </div>
      )}

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
            <h3 className={`text-3xl ${fonts.kid} text-gray-800 mb-2`}>🎉 {t('excellent')}! 🎉</h3>
            <p className={`text-gray-600 mb-4 ${fonts.body}`}>
              <p className={`text-gray-600 mb-4 ${fonts.body}`}>
              {t('gameCompleteMessage', 'action-clicker')} 🖱️
            </p>
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

export default ActionClickerGame;