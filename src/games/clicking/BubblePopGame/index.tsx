import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProps } from '../../../types';
import { Bubble } from './types';
import { BUBBLE_STAR_LEVELS } from './constants';
import { generateBubble, shouldSpawnBubble } from './utils';
import { SimpleGameUI } from '../../shared/GameUI';
import { ParticleSystem } from '../../shared/ParticleSystem';
import { useSimpleGameLogic } from '../../shared/useSimpleGameLogic';
import { createPopEffect } from '../../shared/effects';

const BubblePopGame: React.FC<GameProps> = ({ 
  onStarEarned, 
  onGameComplete,
  gameKey 
}) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const spawnTimerRef = useRef<number | null>(null);

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
    starLevels: BUBBLE_STAR_LEVELS,
    onStarEarned,
    onGameComplete
  });

  const getCurrentLevel = () => BUBBLE_STAR_LEVELS[gameState.currentStar - 1];

  const generateBubbleForCurrentLevel = useCallback((): Bubble => {
    return generateBubble(getCurrentLevel());
  }, [gameState.currentStar]);

  // Spawn bubbles
  const spawnBubble = useCallback(() => {
    if (!gameState.isStarted || gameState.isCompleted || gameState.starCompleted) {
      return;
    }

    const level = getCurrentLevel();
    setBubbles(prev => {
      if (shouldSpawnBubble(prev, level.bubbleCount)) {
        return [...prev, generateBubbleForCurrentLevel()];
      }
      return prev;
    });
  }, [gameState.isStarted, gameState.isCompleted, gameState.starCompleted, gameState.currentStar, generateBubbleForCurrentLevel]);

  // Handle bubble click
  const handleBubbleClick = useCallback((bubble: Bubble, event: React.MouseEvent) => {
    if (!gameState.isStarted || gameState.isCompleted) return;

    event.stopPropagation();
    
    // Remove bubble
    setBubbles(prev => prev.filter(b => b.id !== bubble.id));

    // Add score and effects
    addScore(1);
    const popParticles = createPopEffect(bubble.position);
    addParticles(popParticles);
  }, [gameState.isStarted, gameState.isCompleted, addScore, addParticles]);

  // Bubble spawning system
  useEffect(() => {
    if (!gameState.isStarted || gameState.isCompleted || gameState.starCompleted) {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
      return;
    }

    const level = getCurrentLevel();
    spawnTimerRef.current = window.setInterval(spawnBubble, level.spawnRate);

    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, [gameState.isStarted, gameState.isCompleted, gameState.starCompleted, spawnBubble]);

  // Reset game on key change
  useEffect(() => {
    setBubbles([]);
    setParticles([]);
  }, [gameKey, setParticles]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, []);

  return (
    <SimpleGameUI
      gameTitle="เกมจับฟองสบู่"
      gameEmoji="🫧"
      score={gameState.score}
      currentStar={gameState.currentStar}
      starsEarned={gameState.starsEarned}
      gameStarted={gameState.isStarted}
      gameCompleted={gameState.isCompleted}
      starLevels={BUBBLE_STAR_LEVELS}
      onStartGame={startGame}
      onRestartGame={restartGame}
      onNextGame={() => onGameComplete?.(true)}
      starEarnedEffect={starEarnedEffect}
    >
      <div className="w-full h-full relative bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
        {/* Background bubbles pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl text-blue-300"
              style={{
                left: `${10 + (i % 4) * 25}%`,
                top: `${20 + Math.floor(i / 4) * 30}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🫧
            </motion.div>
          ))}
        </div>

        {/* Bubbles */}
        <AnimatePresence>
          {bubbles.map((bubble) => (
            <motion.div
              key={bubble.id}
              className="absolute cursor-pointer select-none"
              style={{
                left: bubble.position.x,
                top: bubble.position.y,
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
                scale: { duration: 0.5 },
                y: { repeat: Infinity, duration: 2 }
              }}
              onClick={(e) => handleBubbleClick(bubble, e)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {/* Bubble body */}
              <div
                className="w-full h-full rounded-full shadow-lg border-2 border-white/30"
                style={{
                  background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(147,197,253,0.6), rgba(59,130,246,0.4))`
                }}
              />
              
              {/* Bubble highlight */}
              <div
                className="absolute rounded-full bg-white opacity-60"
                style={{
                  left: '25%',
                  top: '20%',
                  width: '30%',
                  height: '30%'
                }}
              />
              
              {/* Bubble sparkle */}
              <div
                className="absolute rounded-full bg-white opacity-80"
                style={{
                  right: '30%',
                  bottom: '25%',
                  width: '15%',
                  height: '15%'
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Particle effects */}
        <ParticleSystem particles={particles} onParticlesUpdate={setParticles} />
      </div>
    </SimpleGameUI>
  );
};

export default BubblePopGame;