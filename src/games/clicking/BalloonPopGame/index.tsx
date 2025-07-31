import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProps } from '../../../types';
import { Balloon, BALLOON_STAR_LEVELS } from './types';
import { BALLOON_CONFIG } from './constants';
import { createBalloon, updateBalloons } from './utils';
import { GameUI } from '../../shared/GameUI';
import { ParticleSystem } from '../../shared/ParticleSystem';
import { useGameLogic } from '../../shared/useGameLogic';
import { createPopEffect } from '../../shared/effects';

const BalloonPopGame: React.FC<GameProps> = ({ 
  onStarEarned, 
  onGameComplete,
  gameKey 
}) => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const spawnTimerRef = useRef<number | null>(null);
  const updateTimerRef = useRef<number | null>(null);

  const {
    gameState,
    particles,
    startGame,
    restartGame,
    addScore,
    addParticles,
    setParticles
  } = useGameLogic({
    starLevels: BALLOON_STAR_LEVELS,
    onStarEarned,
    onGameComplete
  });

  // Spawn balloons
  const spawnBalloon = useCallback(() => {
    if (!gameState.isStarted || gameState.isCompleted || balloons.length >= BALLOON_CONFIG.MAX_BALLOONS) {
      return;
    }

    const difficultyMultiplier = 1 + (gameState.currentStar - 1) * 0.3;
    const newBalloon = createBalloon(difficultyMultiplier);
    setBalloons(prev => [...prev, newBalloon]);
  }, [gameState.isStarted, gameState.isCompleted, gameState.currentStar, balloons.length]);

  // Update balloons position
  const updateGameBalloons = useCallback(() => {
    if (!gameState.isStarted || gameState.isCompleted) return;

    setBalloons(prev => updateBalloons(prev));
  }, [gameState.isStarted, gameState.isCompleted]);

  // Handle balloon click
  const handleBalloonClick = useCallback((balloon: Balloon, event: React.MouseEvent) => {
    if (!gameState.isStarted || gameState.isCompleted || balloon.popped) return;

    event.stopPropagation();
    
    // Mark balloon as popped
    setBalloons(prev => 
      prev.map(b => 
        b.id === balloon.id 
          ? { ...b, popped: true, popTime: Date.now() }
          : b
      )
    );

    // Add score and effects
    addScore(1);
    const popParticles = createPopEffect(balloon.position);
    addParticles(popParticles);

    // Remove popped balloon after animation
    setTimeout(() => {
      setBalloons(prev => prev.filter(b => b.id !== balloon.id));
    }, BALLOON_CONFIG.POP_ANIMATION_DURATION);
  }, [gameState.isStarted, gameState.isCompleted, addScore, addParticles]);

  // Game loop effects
  useEffect(() => {
    if (!gameState.isStarted || gameState.isCompleted) {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
      if (updateTimerRef.current) clearInterval(updateTimerRef.current);
      return;
    }

    // Spawn balloons
    spawnTimerRef.current = window.setInterval(spawnBalloon, BALLOON_CONFIG.SPAWN_RATE);

    // Update balloon positions
    updateTimerRef.current = window.setInterval(updateGameBalloons, 50); // 20fps

    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
      if (updateTimerRef.current) clearInterval(updateTimerRef.current);
    };
  }, [gameState.isStarted, gameState.isCompleted, spawnBalloon, updateGameBalloons]);

  // Reset game on key change
  useEffect(() => {
    setBalloons([]);
    setParticles([]);
  }, [gameKey, setParticles]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
      if (updateTimerRef.current) clearInterval(updateTimerRef.current);
    };
  }, []);

  return (
    <GameUI
      score={gameState.score}
      timeRemaining={gameState.timeRemaining}
      currentStar={gameState.currentStar}
      starsEarned={gameState.starsEarned}
      gameStarted={gameState.isStarted}
      gameCompleted={gameState.isCompleted}
      starLevels={BALLOON_STAR_LEVELS}
      onStartGame={startGame}
      onRestartGame={restartGame}
    >
      <div 
        ref={gameAreaRef}
        className="w-full h-full relative bg-gradient-to-b from-sky-200 to-blue-300 overflow-hidden cursor-pointer"
      >
        {/* Background clouds */}
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white text-6xl opacity-20"
              style={{
                left: `${20 + i * 30}%`,
                top: `${10 + i * 15}%`,
              }}
              animate={{
                x: [0, 20, 0],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ☁️
            </motion.div>
          ))}
        </div>

        {/* Balloons */}
        <AnimatePresence>
          {balloons.map((balloon) => (
            <motion.div
              key={balloon.id}
              className="absolute cursor-pointer select-none"
              style={{
                left: balloon.position.x,
                top: balloon.position.y,
                width: balloon.size,
                height: balloon.size,
              }}
              initial={{ scale: 0, rotate: 0 }}
              animate={{
                scale: balloon.popped ? 0 : 1,
                rotate: balloon.popped ? 180 : [0, -5, 5, 0],
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                scale: { duration: balloon.popped ? 0.3 : 0.5 },
                rotate: { 
                  duration: balloon.popped ? 0.3 : 3,
                  repeat: balloon.popped ? 0 : Infinity,
                  ease: "easeInOut"
                }
              }}
              onClick={(e) => handleBalloonClick(balloon, e)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {/* Balloon body */}
              <div
                className="w-full h-full rounded-full shadow-lg"
                style={{
                  backgroundColor: balloon.color,
                  background: `radial-gradient(circle at 30% 30%, ${balloon.color}CC, ${balloon.color})`
                }}
              />
              
              {/* Balloon string */}
              <div 
                className="absolute bg-gray-800 opacity-50"
                style={{
                  left: '50%',
                  top: '100%',
                  width: '2px',
                  height: '30px',
                  transform: 'translateX(-50%)'
                }}
              />
              
              {/* Balloon highlight */}
              <div
                className="absolute rounded-full bg-white opacity-30"
                style={{
                  left: '25%',
                  top: '20%',
                  width: '30%',
                  height: '30%'
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Particle effects */}
        <ParticleSystem particles={particles} onParticlesUpdate={setParticles} />
      </div>
    </GameUI>
  );
};

export default BalloonPopGame;
