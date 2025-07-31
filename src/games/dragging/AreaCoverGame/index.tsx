import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProps } from '../../../types';
import { TargetArea } from './types';
import { AREA_COVER_STAR_LEVELS, GAME_AREA_WIDTH, GAME_AREA_HEIGHT } from './constants';
import { generateTargetArea, calculateCoverage, getAreaCoverConfig } from './utils';
import { SimpleGameUI } from '../../shared/GameUI';
import { useSimpleGameLogic } from '../../shared/useSimpleGameLogic';

interface AreaCoverGameProps extends GameProps {}

const AreaCoverGame: React.FC<AreaCoverGameProps> = ({
  onStarEarned,
  onGameComplete,
  gameKey = 0
}) => {
  
  // Game state using standard pattern
  const {
    gameState,
    starEarnedEffect,
    startGame,
    restartGame,
    addScore,
    setParticles
  } = useSimpleGameLogic({
    starLevels: AREA_COVER_STAR_LEVELS,
    onStarEarned,
    onGameComplete
  });

  // Area-specific state
  const [targetAreas, setTargetAreas] = useState<TargetArea[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null);

  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Initialize target areas when game starts or star level changes
  useEffect(() => {
    if (gameState.isStarted) {
      const newTargetArea = generateTargetArea(gameState.currentStar);
      setTargetAreas([newTargetArea]);
    }
  }, [gameState.isStarted, gameState.currentStar]);

  // Reset game when gameKey changes
  useEffect(() => {
    if (gameKey > 0) {
      setTargetAreas([]);
      setIsDragging(false);
      setDragStart(null);
      setDragCurrent(null);
      setParticles([]);
    }
  }, [gameKey, setParticles]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameState.isStarted || gameState.starCompleted || gameState.isCompleted) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDragging(true);
    setDragStart({ x, y });
    setDragCurrent({ x, y });
  }, [gameState.isStarted, gameState.starCompleted, gameState.isCompleted]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !gameAreaRef.current) return;

    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDragCurrent({ x, y });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging || !dragStart || !dragCurrent) return;

    const selectionBox = {
      x: Math.min(dragStart.x, dragCurrent.x),
      y: Math.min(dragStart.y, dragCurrent.y),
      width: Math.abs(dragStart.x - dragCurrent.x),
      height: Math.abs(dragStart.y - dragCurrent.y),
    };

    const currentTarget = targetAreas[0];
    if (currentTarget && !currentTarget.isCovered) {
      const coverage = calculateCoverage(selectionBox, currentTarget);
      const config = getAreaCoverConfig(gameState.currentStar);

      if (coverage >= config.coverageThreshold) {
        // Mark target as covered
        setTargetAreas(prev => 
          prev.map(area => 
            area.id === currentTarget.id ? { ...area, isCovered: true } : area
          )
        );

        // Add score (this will trigger star completion in useSimpleGameLogic)
        addScore(1);

        // Generate new target if level not complete
        const currentLevel = AREA_COVER_STAR_LEVELS[gameState.currentStar - 1];
        if (gameState.score + 1 < currentLevel.target) {
          setTimeout(() => {
            const newTargetArea = generateTargetArea(gameState.currentStar);
            setTargetAreas([newTargetArea]);
          }, 500);
        }
      }
    }

    // Reset drag state
    setIsDragging(false);
    setDragStart(null);
    setDragCurrent(null);
  }, [isDragging, dragStart, dragCurrent, targetAreas, gameState.currentStar, gameState.score, addScore]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);


  const currentTarget = targetAreas[0];

  const selectionBox = isDragging && dragStart && dragCurrent ? {
    x: Math.min(dragStart.x, dragCurrent.x),
    y: Math.min(dragStart.y, dragCurrent.y),
    width: Math.abs(dragStart.x - dragCurrent.x),
    height: Math.abs(dragStart.y - dragCurrent.y),
  } : null;

  return (
    <SimpleGameUI
      gameTitle="เกมครอบคลุมพื้นที่"
      gameEmoji="🔲"
      score={gameState.score}
      currentStar={gameState.currentStar}
      starsEarned={gameState.starsEarned}
      gameStarted={gameState.isStarted}
      gameCompleted={gameState.isCompleted}
      starLevels={AREA_COVER_STAR_LEVELS}
      onStartGame={startGame}
      onRestartGame={restartGame}
      onNextGame={() => onGameComplete?.(true)}
      starEarnedEffect={starEarnedEffect}
    >
      <div 
        ref={gameAreaRef}
        className="relative w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg overflow-hidden flex items-center justify-center"
        onMouseDown={handleMouseDown}
      >

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
      </div>
    </SimpleGameUI>
  );
};

export default AreaCoverGame;