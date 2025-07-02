import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProps } from '../../../types';
import { useFontClasses } from '../../../hooks/useFontClasses';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ScrollChallengeGameState } from './types';
import { SCROLL_CHALLENGE_STAR_LEVELS, TRACK_WIDTH, SLIDER_SIZE } from './constants';
import { generateTargetZone, checkAlignment } from './utils';

interface ScrollChallengeGameProps extends GameProps {}

const ScrollChallengeGame: React.FC<ScrollChallengeGameProps> = ({
  onStarEarned,
  onGameComplete,
  gameKey = 0
}) => {
  const fonts = useFontClasses();
  const { t } = useLanguage();
  
  const [gameState, setGameState] = useState<ScrollChallengeGameState>({
    targetZones: [],
    playerSliderPosition: 0,
    currentStar: 1,
    targetsHit: 0,
    gameStarted: false,
    starCompleted: false,
    gameCompleted: false,
    earnedStars: 0,
  });

  const [starEarnedEffect, setStarEarnedEffect] = useState(false);
  const [pendingStarEarned, setPendingStarEarned] = useState<number | null>(null);
  const [pendingGameComplete, setPendingGameComplete] = useState(false);

  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Reset game when gameKey changes
  useEffect(() => {
    if (gameKey > 0) {
      resetGame();
    }
  }, [gameKey]);

  const resetGame = () => {
    const level = SCROLL_CHALLENGE_STAR_LEVELS[0];
    setGameState({
      targetZones: [generateTargetZone(level)],
      playerSliderPosition: TRACK_WIDTH / 2 - SLIDER_SIZE / 2,
      currentStar: 1,
      targetsHit: 0,
      gameStarted: false,
      starCompleted: false,
      gameCompleted: false,
      earnedStars: 0,
    });
  };

  const getCurrentLevel = () => SCROLL_CHALLENGE_STAR_LEVELS[gameState.currentStar - 1];

  const startGame = () => {
    const level = getCurrentLevel();
    setGameState(prev => ({
      ...prev,
      gameStarted: true,
      targetZones: [generateTargetZone(level)],
      playerSliderPosition: TRACK_WIDTH / 2 - SLIDER_SIZE / 2,
      targetsHit: 0,
      starCompleted: false,
    }));
  };

  const handleScroll = useCallback((e: WheelEvent) => {
    console.log('handleScroll called. gameStarted:', gameState.gameStarted);
    if (!gameState.gameStarted || gameState.starCompleted || gameState.gameCompleted) return;

    setGameState(prev => {
      const level = getCurrentLevel();
      let newPlayerPosition = prev.playerSliderPosition;

      if (e.deltaY > 0) { // Scroll down (move right on horizontal track)
        newPlayerPosition += level.scrollSensitivity;
      } else if (e.deltaY < 0) { // Scroll up (move left on horizontal track)
        newPlayerPosition -= level.scrollSensitivity;
      }

      // Clamp player position within track bounds
      newPlayerPosition = Math.max(0, Math.min(newPlayerPosition, TRACK_WIDTH - SLIDER_SIZE));

      let updates: Partial<ScrollChallengeGameState> = {
        playerSliderPosition: newPlayerPosition
      };

      const currentTarget = prev.targetZones[0]; // Always focus on the first target
      if (currentTarget && !currentTarget.isHit && checkAlignment(newPlayerPosition, currentTarget)) {
        const newTargetsHit = prev.targetsHit + 1;
        const updatedTargetZones = prev.targetZones.map(target => 
          target.id === currentTarget.id ? { ...target, isHit: true } : target
        );

        updates = {
          ...updates,
          targetsHit: newTargetsHit,
          targetZones: updatedTargetZones,
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
            if (nextStarNumber <= 5 && nextStarNumber <= SCROLL_CHALLENGE_STAR_LEVELS.length) {
              setTimeout(() => {
                const nextLevel = SCROLL_CHALLENGE_STAR_LEVELS[nextStarNumber - 1];
                setGameState(currentState => ({
                  ...currentState,
                  currentStar: nextStarNumber,
                  targetsHit: 0,
                  starCompleted: false,
                  targetZones: [generateTargetZone(nextLevel)], // Generate new target for next level
                  playerSliderPosition: TRACK_WIDTH / 2 - SLIDER_SIZE / 2, // Reset player position
                }));
              }, 2000);
            }
          }
        } else if (newTargetsHit < level.target) {
          // Generate next target if current level not completed yet
          setTimeout(() => {
            setGameState(currentState => ({
              ...currentState,
              targetZones: [generateTargetZone(level)],
              playerSliderPosition: TRACK_WIDTH / 2 - SLIDER_SIZE / 2, // Reset player position
            }));
          }, 500); // Small delay before new target appears
        }
      }

      return { ...prev, ...updates };
    });
  }, [gameState.gameStarted, gameState.starCompleted, gameState.gameCompleted]);

  useEffect(() => {
    const handleGlobalWheel = (e: WheelEvent) => {
      if (gameAreaRef.current && gameAreaRef.current.contains(e.target as Node)) {
        e.preventDefault();
        // Simulate React.WheelEvent for handleScroll
        handleScroll(e);
      }
    };

    document.addEventListener('wheel', handleGlobalWheel, { passive: false });

    return () => {
      document.removeEventListener('wheel', handleGlobalWheel);
    };
  }, [handleScroll]);

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
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
        <div className="text-6xl mb-4">📜</div>
        <h2 className={`text-2xl ${fonts.kid} text-gray-800 mb-4`}>{t('scrollChallengeTitle')}</h2>
        <p className={`text-gray-600 mb-6 text-center max-w-md ${fonts.body}`}>
          {t('scrollChallengeDescription')}
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

  const currentTarget = gameState.targetZones[0];

  return (
    <div 
      ref={gameAreaRef}
      className="relative w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg overflow-hidden flex flex-col items-center justify-center"
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
            📜 {t('scrollChallengeTitle')}
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

      {/* Game Area */}
      <div className="relative w-[800px] h-[100px] bg-gray-200 rounded-full flex items-center justify-center my-8">
        {/* Track */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-4 bg-gray-400 rounded-full" />
        </div>

        {/* Target Zone */}
        <AnimatePresence>
          {currentTarget && !currentTarget.isHit && (
            <motion.div
              key={currentTarget.id}
              className="absolute bg-green-500/50 border-2 border-green-700 flex items-center justify-center text-white font-bold text-xl"
              style={{
                left: currentTarget.position - currentTarget.size / 2,
                width: currentTarget.size,
                height: currentTarget.size,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              🎯
            </motion.div>
          )}
        </AnimatePresence>

        {/* Player Slider */}
        <motion.div
          className="absolute bg-blue-500 rounded-full border-4 border-blue-700 shadow-lg cursor-grab"
          style={{
            left: gameState.playerSliderPosition,
            width: SLIDER_SIZE,
            height: SLIDER_SIZE,
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-full h-full flex items-center justify-center text-white text-3xl">
            👆
          </div>
        </motion.div>
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
              {t('gameCompleteMessage', 'scroll-challenge')} 📜
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

export default ScrollChallengeGame;