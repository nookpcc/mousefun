import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProps } from '../../../types';
import { Shape, Target } from './types';
import { SHAPE_SORT_STAR_LEVELS, GAME_AREA, SHAPE_COLORS, TARGET_COLORS } from './constants';
import { createShape, createTargets, isOverTarget } from './utils';
import { SimpleGameUI } from '../../shared/GameUI';
import { useSimpleGameLogic } from '../../shared/useSimpleGameLogic';
import { ParticleSystem } from '../../shared/ParticleSystem';
import { createCollectionEffect } from '../../shared/effects';

interface ShapeSortGameProps extends GameProps {}

const ShapeSortGame: React.FC<ShapeSortGameProps> = ({
  onStarEarned,
  onGameComplete,
  gameKey = 0
}) => {
  // Game state using standard pattern
  const {
    gameState,
    particles,
    starEarnedEffect,
    startGame,
    restartGame,
    addScore,
    addParticles,
    setParticles
  } = useSimpleGameLogic({
    starLevels: SHAPE_SORT_STAR_LEVELS,
    onStarEarned,
    onGameComplete
  });

  // Shape-specific state
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const [draggedShape, setDraggedShape] = useState<Shape | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  // Initialize shapes and targets when game starts or star level changes
  useEffect(() => {
    if (gameState.isStarted && !gameState.starCompleted && !gameState.isCompleted) {
      const currentLevel = SHAPE_SORT_STAR_LEVELS[gameState.currentStar - 1];
      const newTargets = createTargets(currentLevel.shapes, GAME_AREA);
      
      // Generate random shapes for the level
      const newShapes: Shape[] = [];
      for (let i = 0; i < currentLevel.target; i++) {
        const randomShapeType = currentLevel.shapes[Math.floor(Math.random() * currentLevel.shapes.length)];
        newShapes.push(createShape(randomShapeType, GAME_AREA));
      }

      setTargets(newTargets);
      setShapes(newShapes);
      setTimeRemaining(currentLevel.timeLimit);
    }
  }, [gameState.isStarted, gameState.currentStar, gameState.starCompleted, gameState.isCompleted]);

  // Timer countdown
  useEffect(() => {
    if (gameState.isStarted && !gameState.starCompleted && !gameState.isCompleted && timeRemaining > 0) {
      timerRef.current = window.setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameState.isStarted, gameState.starCompleted, gameState.isCompleted, timeRemaining]);

  // Reset game when gameKey changes
  useEffect(() => {
    if (gameKey > 0) {
      setShapes([]);
      setTargets([]);
      setDraggedShape(null);
      setTimeRemaining(0);
      setParticles([]);
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  }, [gameKey, setParticles]);

  // Handle shape drag start
  const handleShapeDragStart = useCallback((shape: Shape, event: React.MouseEvent) => {
    if (!gameState.isStarted || gameState.starCompleted || gameState.isCompleted || shape.isPlaced) return;
    
    event.preventDefault();
    setDraggedShape(shape);
    setShapes(prev => prev.map(s => 
      s.id === shape.id ? { ...s, isDragging: true } : s
    ));
  }, [gameState.isStarted, gameState.starCompleted, gameState.isCompleted]);

  // Handle mouse move during drag
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!draggedShape || !gameAreaRef.current) return;

    const rect = gameAreaRef.current.getBoundingClientRect();
    const newPosition = {
      x: event.clientX - rect.left - draggedShape.size / 2,
      y: event.clientY - rect.top - draggedShape.size / 2
    };

    setShapes(prev => prev.map(shape => 
      shape.id === draggedShape.id ? { ...shape, position: newPosition } : shape
    ));
  }, [draggedShape]);

  // Handle drag end
  const handleMouseUp = useCallback(() => {
    if (!draggedShape) return;

    // Check if shape is over correct target
    const matchingTarget = targets.find(target => 
      target.type === draggedShape.type && 
      !target.isOccupied &&
      isOverTarget(draggedShape.position, target.position)
    );

    if (matchingTarget) {
      // Successful placement
      setShapes(prev => prev.map(shape => 
        shape.id === draggedShape.id 
          ? { 
              ...shape, 
              isDragging: false, 
              isPlaced: true,
              position: matchingTarget.position 
            }
          : shape
      ));
      
      setTargets(prev => prev.map(target => 
        target.id === matchingTarget.id ? { ...target, isOccupied: true } : target
      ));

      // Add particles and score
      const placementParticles = createCollectionEffect(matchingTarget.position);
      addParticles(placementParticles);
      addScore(1);
    } else {
      // Return to original position or random position
      setShapes(prev => prev.map(shape => 
        shape.id === draggedShape.id 
          ? { 
              ...shape, 
              isDragging: false,
              position: createShape(shape.type, GAME_AREA).position
            }
          : shape
      ));
    }

    setDraggedShape(null);
  }, [draggedShape, targets, addParticles, addScore]);

  // Mouse event listeners
  useEffect(() => {
    if (draggedShape) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedShape, handleMouseMove, handleMouseUp]);

  // Render shape based on type
  const renderShape = (shape: Shape) => {
    const baseClasses = `${SHAPE_COLORS[shape.type]} border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-2xl select-none`;
    
    switch (shape.type) {
      case 'circle':
        return <div className={`${baseClasses} rounded-full`}>⭕</div>;
      case 'square':
        return <div className={`${baseClasses} rounded-lg`}>⬜</div>;
      case 'triangle':
        return <div className={`${baseClasses} rounded-lg transform rotate-0`}>🔺</div>;
      case 'star':
        return <div className={`${baseClasses} rounded-full`}>⭐</div>;
      default:
        return <div className={baseClasses}>?</div>;
    }
  };

  // Render target container
  const renderTarget = (target: Target) => {
    const baseClasses = `${TARGET_COLORS[target.type]} border-4 border-dashed rounded-lg flex items-center justify-center text-6xl opacity-70`;
    
    switch (target.type) {
      case 'circle':
        return <div className={`${baseClasses} rounded-full`}>⭕</div>;
      case 'square':
        return <div className={baseClasses}>⬜</div>;
      case 'triangle':
        return <div className={baseClasses}>🔺</div>;
      case 'star':
        return <div className={`${baseClasses} rounded-full`}>⭐</div>;
      default:
        return <div className={baseClasses}>?</div>;
    }
  };

  const currentLevel = SHAPE_SORT_STAR_LEVELS[gameState.currentStar - 1];
  const timeProgress = currentLevel ? ((currentLevel.timeLimit - timeRemaining) / currentLevel.timeLimit) * 100 : 0;

  return (
    <SimpleGameUI
      gameTitle="เกมจับคู่รูปทรง"
      gameEmoji="🔷"
      score={gameState.score}
      currentStar={gameState.currentStar}
      starsEarned={gameState.starsEarned}
      gameStarted={gameState.isStarted}
      gameCompleted={gameState.isCompleted}
      starLevels={SHAPE_SORT_STAR_LEVELS}
      onStartGame={startGame}
      onRestartGame={restartGame}
      onNextGame={() => onGameComplete?.(true)}
      starEarnedEffect={starEarnedEffect}
    >
      <div 
        ref={gameAreaRef}
        className="relative w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg overflow-hidden"
        style={{ width: GAME_AREA.width, height: GAME_AREA.height }}
      >
        {/* Timer Bar */}
        {gameState.isStarted && !gameState.isCompleted && (
          <div className="absolute top-4 left-4 right-4 z-20">
            <div className="bg-white/20 rounded-full h-4 backdrop-blur-sm">
              <motion.div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full"
                initial={{ width: '100%' }}
                animate={{ width: `${100 - timeProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="text-center text-white font-bold mt-2" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
              ⏰ {timeRemaining}s
            </div>
          </div>
        )}

        {/* Target containers */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end pb-4">
          {targets.map((target) => (
            <motion.div
              key={target.id}
              className="mx-2"
              style={{
                width: target.size,
                height: target.size,
              }}
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: targets.indexOf(target) * 0.1 }}
            >
              {renderTarget(target)}
            </motion.div>
          ))}
        </div>

        {/* Shapes */}
        <AnimatePresence>
          {shapes.map((shape) => (
            !shape.isPlaced && (
              <motion.div
                key={shape.id}
                className="absolute cursor-grab active:cursor-grabbing"
                style={{
                  left: shape.position.x,
                  top: shape.position.y,
                  width: shape.size,
                  height: shape.size,
                  zIndex: shape.isDragging ? 30 : 10
                }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: shape.isDragging ? 1.1 : 1,
                  rotate: 0
                }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.3 }}
                onMouseDown={(e) => handleShapeDragStart(shape, e)}
                whileHover={{ scale: 1.05 }}
                drag={false} // We handle drag manually
              >
                {renderShape(shape)}
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Placed shapes */}
        <AnimatePresence>
          {shapes.map((shape) => (
            shape.isPlaced && (
              <motion.div
                key={`placed-${shape.id}`}
                className="absolute pointer-events-none"
                style={{
                  left: shape.position.x,
                  top: shape.position.y,
                  width: shape.size,
                  height: shape.size,
                  zIndex: 15
                }}
                initial={{ scale: 1.5, rotate: 360 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5 }}
              >
                {renderShape(shape)}
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Particle effects */}
        <ParticleSystem particles={particles} onParticlesUpdate={setParticles} />

        {/* Time up overlay */}
        {timeRemaining === 0 && gameState.isStarted && !gameState.starCompleted && !gameState.isCompleted && (
          <motion.div
            className="absolute inset-0 bg-black/50 flex items-center justify-center z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-6xl mb-4">⏰</div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">หมดเวลา!</h3>
              <p className="text-gray-600 mb-6">ลองอีกครั้งนะ!</p>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
                onClick={restartGame}
              >
                🔄 เล่นใหม่
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </SimpleGameUI>
  );
};

export default ShapeSortGame;