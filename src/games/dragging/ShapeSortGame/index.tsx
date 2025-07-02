import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProps } from '../../../types';
import { useFontClasses } from '../../../hooks/useFontClasses';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Shape, Target, ShapeSortGameState, ShapeType } from './types';
import { SHAPE_SORT_STAR_LEVELS, TARGET_COLORS, SHAPE_COLORS } from './constants';
import { createShapesForLevel, createTargetsForLevel, isOverTarget } from './utils';

const ShapeComponent: React.FC<{ type: ShapeType; color: string; size: number }> = ({ type, color, size }) => {
  const style = { width: size, height: size };
  switch (type) {
    case 'circle':
      return <div className={`${color} rounded-full`} style={style}></div>;
    case 'square':
      return <div className={`${color} rounded-md`} style={style}></div>;
    case 'triangle':
      return <div className={color} style={{ ...style, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>;
    case 'star':
       return <div className={color} style={{ ...style, clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>;
    default:
      return null;
  }
};

const ShapeSortGame: React.FC<GameProps> = ({ onStarEarned, onGameComplete, gameKey = 0 }) => {
  const fonts = useFontClasses();
  const { t } = useLanguage();
  const [gameState, setGameState] = useState<ShapeSortGameState>(() => {
    const level = SHAPE_SORT_STAR_LEVELS[0];
    return {
      shapes: createShapesForLevel(level),
      targets: createTargetsForLevel(level),
      currentStar: 1,
      shapesSorted: 0,
      gameStarted: false,
      starCompleted: false,
      gameCompleted: false,
      earnedStars: 0,
    };
  });

  const [starEarnedEffect, setStarEarnedEffect] = useState(false);
  const [pendingStarEarned, setPendingStarEarned] = useState<number | null>(null);
  const [pendingGameComplete, setPendingGameComplete] = useState(false);
  const shapeRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const targetRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (gameKey > 0) resetGame();
  }, [gameKey]);

  // Auto-advance to next star
  useEffect(() => {
    if (gameState.starCompleted && !gameState.gameCompleted) {
      const timer = setTimeout(() => {
        const nextStarNumber = gameState.earnedStars + 1;
        if (nextStarNumber <= 5 && nextStarNumber <= SHAPE_SORT_STAR_LEVELS.length) {
          const nextLevel = SHAPE_SORT_STAR_LEVELS[nextStarNumber - 1];
          setGameState(currentState => ({
            ...currentState,
            shapes: createShapesForLevel(nextLevel),
            targets: createTargetsForLevel(nextLevel),
            currentStar: nextStarNumber,
            shapesSorted: 0,
            starCompleted: false,
          }));
        }
      }, 2000); // Wait 2 seconds before advancing
      return () => clearTimeout(timer);
    }
  }, [gameState.starCompleted, gameState.gameCompleted, gameState.earnedStars]);

  const resetGame = () => {
    const level = SHAPE_SORT_STAR_LEVELS[0];
    setGameState({
      shapes: createShapesForLevel(level),
      targets: createTargetsForLevel(level),
      currentStar: 1,
      shapesSorted: 0,
      gameStarted: false,
      starCompleted: false,
      gameCompleted: false,
      earnedStars: 0,
    });
    setPendingStarEarned(null);
    setPendingGameComplete(false);
  };

  const startGame = () => {
    setGameState(prev => ({ ...prev, gameStarted: true }));
  };

  const handleDragEnd = (shape: Shape) => {
    if (gameState.starCompleted || gameState.gameCompleted) return; // Prevent dragging after star is completed or game completed

    const shapeRect = shapeRefs.current[shape.id]?.getBoundingClientRect();
    if (!shapeRect) return;

    let matchFound = false;
    for (const target of gameState.targets) {
      const targetRect = targetRefs.current[target.id]?.getBoundingClientRect();
      if (targetRect && isOverTarget(shapeRect, targetRect)) {
        if (shape.type === target.type) {
          // Correct drop
          setGameState(prev => {
            const newShapesSorted = prev.shapesSorted + 1;
            const level = SHAPE_SORT_STAR_LEVELS[prev.currentStar - 1];
            let newEarnedStars = prev.earnedStars;

            let updates: Partial<ShapeSortGameState> = {
              shapes: prev.shapes.map(s => s.id === shape.id ? { ...s, isSorted: true } : s),
              shapesSorted: newShapesSorted,
            };

            if (newShapesSorted >= level.targetCount) {
              newEarnedStars = prev.earnedStars + 1;
              updates = {
                ...updates,
                starCompleted: true,
                earnedStars: newEarnedStars,
              };
              setStarEarnedEffect(true);
              setTimeout(() => setStarEarnedEffect(false), 2000);
              setPendingStarEarned(newEarnedStars);

              if (newEarnedStars === 5) {
                updates.gameCompleted = true;
                setPendingGameComplete(true);
              }
            }

            return { ...prev, ...updates };
          });
          matchFound = true;
          break;
        }
      }
    }
    // If no match, reset shape position (optional, but good for UX)
    if (!matchFound) {
      setGameState(prev => ({
        ...prev,
        shapes: prev.shapes.map(s => s.id === shape.id ? { ...s, initialPosition: s.initialPosition } : s) // Reset to initial position
      }));
    }
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
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg">
        <div className="text-6xl mb-4">🎨</div>
        <h2 className={`text-2xl ${fonts.kid} text-gray-800 mb-4`}>{t('title', 'shape-sort')}</h2>
        <p className={`text-gray-600 mb-6 text-center max-w-md ${fonts.body}`}>
          {t('description', 'shape-sort')}
        </p>
        <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-full" onClick={startGame}>
          🎮 {t('startGame')}
        </button>
      </div>
    );
  }

  const level = SHAPE_SORT_STAR_LEVELS[gameState.currentStar - 1];

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg overflow-hidden">
      {/* Game Title - Top left */}
      <div className="absolute top-4 left-4 z-10">
        <div 
          className="text-white font-bold text-xl"
          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
        >
          <span className={`${fonts.kid}`}>🎨 {t('title', 'shape-sort')}</span>
        </div>
      </div>

      {/* Stars Progress - Top right */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center">
          {Array.from({ length: 5 }, (_, index) => (
            <motion.span 
              key={index}
              className={`text-3xl mx-1 ${index < gameState.earnedStars ? 'text-yellow-300' : 'text-gray-300'}`}
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
              animate={starEarnedEffect && index === gameState.earnedStars - 1 ? { scale: [1, 1.5, 1], rotate: [0, 360] } : {}}
              transition={{ duration: 0.6 }}
            >
              {index < gameState.earnedStars ? '⭐' : '☆'}
            </motion.span>
          ))}
        </div>
        <div 
          className="text-white font-bold text-lg text-center mt-1"
          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
        >
          <span className={`${fonts.kid}`}>🔷 {gameState.shapesSorted}/{level.targetCount} {t('pieces')}</span>
        </div>
      </div>

      {/* Shapes to be sorted */}
      <AnimatePresence>
        {gameState.shapes.filter(s => !s.isSorted).map(shape => (
          <motion.div
            key={shape.id}
            ref={el => shapeRefs.current[shape.id] = el}
            drag
            dragMomentum={false}
            onDragEnd={() => handleDragEnd(shape)}
            initial={{ x: shape.initialPosition.x, y: shape.initialPosition.y + 120, scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute cursor-grab z-10"
            style={{ width: 60, height: 60 }}
          >
            <ShapeComponent type={shape.type} color={shape.color} size={60} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Target boxes */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center p-4 gap-4">
        {gameState.targets.map(target => (
          <div
            key={target.id}
            ref={el => targetRefs.current[target.id] = el}
            className={`rounded-2xl flex items-center justify-center ${TARGET_COLORS[target.type]} border-4 border-dashed`}
            style={{ width: target.size.width, height: target.size.height }}
          >
            <div style={{ transform: 'scale(0.8)', opacity: 0.3 }}>
              <ShapeComponent type={target.type} color={SHAPE_COLORS[target.type]} size={80} />
            </div>
          </div>
        ))}
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

      {/* Game Completed Modal */}
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
              {t('gameCompleteMessage', 'shape-sort')} 🔷
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
      )
      }
    </div>
  );
};

export default ShapeSortGame;