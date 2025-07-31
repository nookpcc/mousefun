import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProps } from '../../../types';
import { Gem, TrailPoint, MOUSE_TRAIL_STAR_LEVELS } from './types';
import { TRAIL_CONFIG, GEM_CONFIG } from './constants';
import { generateGems, checkGemCollection, updateMouseTrail } from './utils';
import { SimpleGameUI } from '../../shared/GameUI';
import { ParticleSystem } from '../../shared/ParticleSystem';
import { useSimpleGameLogic } from '../../shared/useSimpleGameLogic';
import { createCollectionEffect } from '../../shared/effects';

const MouseTrailGame: React.FC<GameProps> = ({ 
  onStarEarned, 
  onGameComplete,
  gameKey 
}) => {
  const [gems, setGems] = useState<Gem[]>([]);
  const [mouseTrail, setMouseTrail] = useState<TrailPoint[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

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
    starLevels: MOUSE_TRAIL_STAR_LEVELS,
    onStarEarned,
    onGameComplete
  });

  // Initialize gems when game starts
  const initializeGems = useCallback(() => {
    if (!gameState.isStarted) return;
    
    const currentLevel = MOUSE_TRAIL_STAR_LEVELS[gameState.currentStar - 1];
    const gemsCount = currentLevel ? currentLevel.target : 5;
    const newGems = generateGems(gemsCount);
    setGems(newGems);
  }, [gameState.isStarted, gameState.currentStar]);

  // Handle mouse movement
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!gameState.isStarted || gameState.isCompleted) return;
    
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mousePos = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    setMousePosition(mousePos);
    setMouseTrail(prev => updateMouseTrail(prev, mousePos));

    // Check for gem collection
    setGems(prevGems => {
      let scoreAdded = 0;
      const updatedGems = prevGems.map(gem => {
        if (!gem.collected && checkGemCollection(mousePos, gem)) {
          scoreAdded++;
          const collectParticles = createCollectionEffect(gem.position);
          addParticles(collectParticles);
          return { ...gem, collected: true };
        }
        return gem;
      });

      if (scoreAdded > 0) {
        addScore(scoreAdded);
      }

      return updatedGems;
    });
  }, [gameState.isStarted, gameState.isCompleted, addScore, addParticles]);

  // Animation loop for gem effects
  const animateGems = useCallback(() => {
    if (!gameState.isStarted || gameState.isCompleted) return;

    setGems(prevGems => 
      prevGems.map(gem => ({
        ...gem,
        glowIntensity: 0.5 + Math.sin(Date.now() * GEM_CONFIG.GLOW_ANIMATION_SPEED + gem.sparkleOffset) * 0.3,
        sparkleOffset: gem.sparkleOffset + 0.02
      }))
    );

    animationFrameRef.current = requestAnimationFrame(animateGems);
  }, [gameState.isStarted, gameState.isCompleted]);

  // Start animation loop
  useEffect(() => {
    if (gameState.isStarted && !gameState.isCompleted && !gameState.starCompleted) {
      animationFrameRef.current = requestAnimationFrame(animateGems);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState.isStarted, gameState.isCompleted, gameState.starCompleted, animateGems]);

  // Initialize gems when starting
  useEffect(() => {
    initializeGems();
  }, [initializeGems]);

  // Reset game on key change
  useEffect(() => {
    setGems([]);
    setMouseTrail([]);
    setParticles([]);
  }, [gameKey, setParticles]);

  // Handle game start
  const handleStartGame = useCallback(() => {
    startGame();
    setMouseTrail([]);
  }, [startGame]);

  // Handle restart
  const handleRestartGame = useCallback(() => {
    setMouseTrail([]);
    restartGame();
  }, [restartGame]);

  return (
    <SimpleGameUI
      gameTitle="เกมเก็บเพชร"  
      gameEmoji="🌟"
      score={gameState.score}
      currentStar={gameState.currentStar}
      starsEarned={gameState.starsEarned}
      gameStarted={gameState.isStarted}
      gameCompleted={gameState.isCompleted}
      starLevels={MOUSE_TRAIL_STAR_LEVELS}
      onStartGame={handleStartGame}
      onRestartGame={handleRestartGame}
      onNextGame={() => onGameComplete?.(true)}
      starEarnedEffect={starEarnedEffect}
    >
      <div 
        ref={gameAreaRef}
        className="w-full h-full relative bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900 overflow-hidden cursor-none"
        onMouseMove={handleMouseMove}
      >
        {/* Star field background */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 2}s`
              }}
            />
          ))}
        </div>

        {/* Mouse trail */}
        <svg className="absolute inset-0 pointer-events-none w-full h-full">
          {mouseTrail.length > 1 && (
            <motion.path
              d={`M ${mouseTrail.map(point => `${point.x},${point.y}`).join(' L ')}`}
              stroke="url(#trailGradient)"
              strokeWidth={TRAIL_CONFIG.TRAIL_WIDTH}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
          <defs>
            <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="1" />
              <stop offset="50%" stopColor="#FF6B6B" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#4ECDC4" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>

        {/* Gems */}
        <AnimatePresence>
          {gems.map((gem) => (
            !gem.collected && (
              <motion.div
                key={gem.id}
                className="absolute pointer-events-none select-none"
                style={{
                  left: gem.position.x,
                  top: gem.position.y,
                  width: gem.size,
                  height: gem.size,
                }}
                initial={{ scale: 0, rotate: 0 }}
                animate={{
                  scale: 1,
                  rotate: 360,
                  filter: `brightness(${1 + gem.glowIntensity * 0.5}) drop-shadow(0 0 ${gem.glowIntensity * 10}px ${gem.color})`
                }}
                exit={{ 
                  scale: 0, 
                  rotate: 720,
                  transition: { duration: 0.5 }
                }}
                transition={{
                  scale: { duration: 0.5 },
                  rotate: { 
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }
                }}
              >
                {/* Gem body */}
                <div
                  className="w-full h-full relative"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${gem.color}FF, ${gem.color}AA, ${gem.color}66)`,
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                  }}
                >
                  {/* Sparkles */}
                  {[...Array(GEM_CONFIG.SPARKLE_COUNT)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute bg-white rounded-full"
                      style={{
                        width: '3px',
                        height: '3px',
                        left: `${20 + i * 25}%`,
                        top: `${20 + i * 20}%`,
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Mouse cursor indicator */}
        {gameState.isStarted && !gameState.isCompleted && (
          <motion.div
            className="absolute pointer-events-none z-40"
            style={{
              left: mousePosition.x - 10,
              top: mousePosition.y - 10
            }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="w-5 h-5 bg-yellow-400 rounded-full shadow-lg border-2 border-white" />
          </motion.div>
        )}

        {/* Particle effects */}
        <ParticleSystem particles={particles} onParticlesUpdate={setParticles} />
      </div>
    </SimpleGameUI>
  );
};

export default MouseTrailGame;
