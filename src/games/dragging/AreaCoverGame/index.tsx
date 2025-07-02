import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProps } from '../../../types';
import { useFontClasses } from '../../../hooks/useFontClasses';
import { useLanguage } from '../../../contexts/LanguageContext';
import { AreaCoverGameState } from './types';
import { AREA_COVER_STAR_LEVELS, GAME_AREA_WIDTH, GAME_AREA_HEIGHT } from './constants';
import { generateTargetArea, calculateCoverage } from './utils';

interface AreaCoverGameProps extends GameProps {}

const AreaCoverGame: React.FC<AreaCoverGameProps> = ({
  onStarEarned,
  onGameComplete,
  gameKey = 0
}) => {
  const fonts = useFontClasses();
  const { t } = useLanguage();
  
  const [gameState, setGameState] = useState<AreaCoverGameState>({
    targetAreas: [],
    currentStar: 1,
    areasCovered: 0,
    gameStarted: false,
    starCompleted: false,
    gameCompleted: false,
    earnedStars: 0,
    isDragging: false,
    dragStart: null,
    dragCurrent: null,
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
    const level = AREA_COVER_STAR_LEVELS[0];
    setGameState({
      targetAreas: [generateTargetArea(level)],
      currentStar: 1,
      areasCovered: 0,
      gameStarted: false,
      starCompleted: false,
      gameCompleted: false,
      earnedStars: 0,
      isDragging: false,
      dragStart: null,
      dragCurrent: null,
    });
  };

  const getCurrentLevel = () => AREA_COVER_STAR_LEVELS[gameState.currentStar - 1];

  const startGame = () => {
    const level = getCurrentLevel();
    setGameState(prev => ({
      ...prev,
      gameStarted: true,
      targetAreas: [generateTargetArea(level)],
      areasCovered: 0,
      starCompleted: false,
    }));
  };

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameState.gameStarted || gameState.starCompleted || gameState.gameCompleted) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setGameState(prev => ({
      ...prev,
      isDragging: true,
      dragStart: { x, y },
      dragCurrent: { x, y },
    }));
  }, [gameState.gameStarted, gameState.starCompleted, gameState.gameCompleted]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!gameState.isDragging || !gameAreaRef.current) return;

    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setGameState(prev => ({
      ...prev,
      dragCurrent: { x, y },
    }));
  }, [gameState.isDragging]);

  const handleMouseUp = useCallback(() => {
    if (!gameState.isDragging || !gameState.dragStart || !gameState.dragCurrent) return;

    setGameState(prev => {
      const selectionBox = {
        x: Math.min(prev.dragStart!.x, prev.dragCurrent!.x),
        y: Math.min(prev.dragStart!.y, prev.dragCurrent!.y),
        width: Math.abs(prev.dragStart!.x - prev.dragCurrent!.x),
        height: Math.abs(prev.dragStart!.y - prev.dragCurrent!.y),
      };

      const currentTarget = prev.targetAreas[0];
      let newAreasCovered = prev.areasCovered;
      let newTargetAreas = prev.targetAreas;

      if (currentTarget && !currentTarget.isCovered) {
        const coverage = calculateCoverage(selectionBox, currentTarget);
        const level = getCurrentLevel();

        if (coverage >= level.coverageThreshold) {
          newAreasCovered++;
          newTargetAreas = prev.targetAreas.map(area => 
            area.id === currentTarget.id ? { ...area, isCovered: true } : area
          );
        }
      }

      let updates: Partial<AreaCoverGameState> = {
        isDragging: false,
        dragStart: null,
        dragCurrent: null,
        areasCovered: newAreasCovered,
        targetAreas: newTargetAreas,
      };

      // Check if star level completed
      const level = getCurrentLevel();
      if (newAreasCovered >= level.target && !prev.starCompleted) {
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
          if (nextStarNumber <= 5 && nextStarNumber <= AREA_COVER_STAR_LEVELS.length) {
            setTimeout(() => {
              const nextLevel = AREA_COVER_STAR_LEVELS[nextStarNumber - 1];
              setGameState(currentState => ({
                ...currentState,
                currentStar: nextStarNumber,
                areasCovered: 0,
                starCompleted: false,
                targetAreas: [generateTargetArea(nextLevel)],
              }));
            }, 2000);
          }
        } 
      } else if (newAreasCovered < level.target && currentTarget && currentTarget.isCovered) {
        // If current target is covered but level not complete, generate new target
        setTimeout(() => {
          setGameState(currentState => ({
            ...currentState,
            targetAreas: [generateTargetArea(level)],
          }));
        }, 500); // Small delay before new target appears
      }

      return { ...prev, ...updates };
    });
  }, [gameState.isDragging, gameState.dragStart, gameState.dragCurrent, gameState.gameStarted, gameState.starCompleted, gameState.gameCompleted]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

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
        <div className="text-6xl mb-4">🔲</div>
        <h2 className={`text-2xl ${fonts.kid} text-gray-800 mb-4`}>{t('areaCoverTitle')}</h2>
        <p className={`text-gray-600 mb-6 text-center max-w-md ${fonts.body}`}>
          {t('areaCoverDescription')}
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

  const currentTarget = gameState.targetAreas[0];

  const selectionBox = gameState.isDragging && gameState.dragStart && gameState.dragCurrent ? {
    x: Math.min(gameState.dragStart.x, gameState.dragCurrent.x),
    y: Math.min(gameState.dragStart.y, gameState.dragCurrent.y),
    width: Math.abs(gameState.dragStart.x - gameState.dragCurrent.x),
    height: Math.abs(gameState.dragStart.y - gameState.dragCurrent.y),
  } : null;

  return (
    <div 
      ref={gameAreaRef}
      className="relative w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg overflow-hidden flex items-center justify-center"
      onMouseDown={handleMouseDown}
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
            🔲 {t('areaCoverTitle')}
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
            🎯 {gameState.areasCovered}/{getCurrentLevel().target} {t('areas')}
          </span>
        </div>
      </div>

      {/* Game Area - Centered */}
      <div 
        className="relative bg-white/20 rounded-lg border-2 border-dashed border-white p-4"
        style={{
          width: GAME_AREA_WIDTH,
          height: GAME_AREA_HEIGHT,
        }}
      >
        {/* Target Area */}
        <AnimatePresence>
          {currentTarget && !currentTarget.isCovered && (
            <motion.div
              key={currentTarget.id}
              className="absolute bg-red-500/50 border-2 border-red-700 rounded-md"
              style={{
                left: currentTarget.x,
                top: currentTarget.y,
                width: currentTarget.width,
                height: currentTarget.height,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>

        {/* Selection Box (Dragging) */}
        {selectionBox && (
          <motion.div
            className="absolute bg-blue-500/50 border-2 border-blue-700 rounded-md pointer-events-none"
            style={{
              left: selectionBox.x,
              top: selectionBox.y,
              width: selectionBox.width,
              height: selectionBox.height,
            }}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 0.1 }}
          />
        )}
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
              {t('gameCompleteMessage', 'area-cover')} 🔲
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

export default AreaCoverGame;