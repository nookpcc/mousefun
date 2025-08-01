import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProps } from '../../../types';
import { HouseItem, HOUSE_EXPLORER_STAR_LEVELS } from './types';
import { HOUSE_ITEMS, HOVER_CONFIG, ITEM_CONFIG, GAME_AREA } from './constants';
import { SimpleGameUI } from '../../shared/GameUI';
import { ParticleSystem } from '../../shared/ParticleSystem';
import { useSimpleGameLogic } from '../../shared/useSimpleGameLogic';
import { createStarBurst } from '../../shared/effects';
import { generateId, calculateDistance } from '../../shared/gameUtils';

const HouseExplorerGame: React.FC<GameProps> = ({ 
  onStarEarned, 
  onGameComplete,
  gameKey 
}) => {
  const [items, setItems] = useState<HouseItem[]>([]);
  const [, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentHovered, setCurrentHovered] = useState<string | null>(null);
  const [hoverStartTime, setHoverStartTime] = useState(0);

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
    starLevels: HOUSE_EXPLORER_STAR_LEVELS,
    onStarEarned,
    onGameComplete
  });

  // Generate items when game starts
  const generateItems = useCallback(() => {
    if (!gameState.isStarted) return;
    
    const currentLevel = HOUSE_EXPLORER_STAR_LEVELS[gameState.currentStar - 1];
    const itemCount = currentLevel ? currentLevel.target : 5;
    const newItems: HouseItem[] = [];
    
    for (let i = 0; i < itemCount; i++) {
      const houseItem = HOUSE_ITEMS[Math.floor(Math.random() * HOUSE_ITEMS.length)];
      let position: { x: number; y: number };
      let attempts = 0;
      
      do {
        position = {
          x: Math.random() * (GAME_AREA.width - ITEM_CONFIG.MAX_SIZE - ITEM_CONFIG.SPAWN_PADDING) + ITEM_CONFIG.SPAWN_PADDING,
          y: Math.random() * (GAME_AREA.height - ITEM_CONFIG.MAX_SIZE - ITEM_CONFIG.SPAWN_PADDING - 120) + ITEM_CONFIG.SPAWN_PADDING + 80
        };
        attempts++;
      } while (
        attempts < 20 && 
        newItems.some(item => 
          calculateDistance(position, item.position) < ITEM_CONFIG.MIN_DISTANCE
        )
      );
      
      const size = ITEM_CONFIG.MIN_SIZE + Math.random() * (ITEM_CONFIG.MAX_SIZE - ITEM_CONFIG.MIN_SIZE);
      
      newItems.push({
        id: generateId(),
        type: 'item',
        position,
        size,
        name: houseItem.name,
        emoji: houseItem.emoji,
        discovered: false,
        hoverTime: 0,
        requiredHoverTime: HOVER_CONFIG.REQUIRED_HOVER_TIME,
        isActive: true
      });
    }
    
    setItems(newItems);
  }, [gameState.isStarted, gameState.currentStar]);

  // Handle mouse movement
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!gameState.isStarted || gameState.isCompleted) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const mousePos = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    
    setMousePosition(mousePos);
    
    // Check if hovering over any item
    let hoveredItem: HouseItem | null = null;
    
    for (const item of items) {
      if (item.discovered) continue;
      
      const distance = calculateDistance(mousePos, {
        x: item.position.x + (item.size || 40) / 2,
        y: item.position.y + (item.size || 40) / 2
      });
      
      if (distance <= (item.size || 40) / 2 + 20) {
        hoveredItem = item;
        break;
      }
    }
    
    if (hoveredItem) {
      if (currentHovered !== hoveredItem.id) {
        setCurrentHovered(hoveredItem.id);
        setHoverStartTime(Date.now());
      }
    } else {
      setCurrentHovered(null);
    }
  }, [gameState.isStarted, gameState.isCompleted, items, currentHovered]);

  // Update hover progress
  useEffect(() => {
    if (!currentHovered || !gameState.isStarted) return;
    
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - hoverStartTime;
      const hoveredItem = items.find(item => item.id === currentHovered);
      
      if (hoveredItem && !hoveredItem.discovered && elapsed >= HOVER_CONFIG.REQUIRED_HOVER_TIME) {
        // Discover item
        setItems(prev => 
          prev.map(item => 
            item.id === currentHovered 
              ? { ...item, discovered: true }
              : item
          )
        );
        
        addScore(1);
        const burstParticles = createStarBurst(hoveredItem.position);
        addParticles(burstParticles);
        setCurrentHovered(null);
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [currentHovered, hoverStartTime, items, gameState.isStarted, addScore, addParticles]);

  // Initialize items when starting
  useEffect(() => {
    generateItems();
  }, [generateItems]);

  // Reset on game key change
  useEffect(() => {
    setItems([]);
    setCurrentHovered(null);
    setParticles([]);
  }, [gameKey, setParticles]);

  const handleStartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const handleRestartGame = useCallback(() => {
    setCurrentHovered(null);
    restartGame();
  }, [restartGame]);

  const getHoverProgress = () => {
    if (!currentHovered) return 0;
    const elapsed = Date.now() - hoverStartTime;
    return Math.min(elapsed / HOVER_CONFIG.REQUIRED_HOVER_TIME, 1);
  };

  return (
    <SimpleGameUI
      gameTitle="เกมค้นหาของในบ้าน"
      gameEmoji="🏠"
      score={gameState.score}
      currentStar={gameState.currentStar}
      starsEarned={gameState.starsEarned}
      gameStarted={gameState.isStarted}
      gameCompleted={gameState.isCompleted}
      starLevels={HOUSE_EXPLORER_STAR_LEVELS}
      onStartGame={handleStartGame}
      onRestartGame={handleRestartGame}
      onNextGame={() => onGameComplete?.(true)}
      starEarnedEffect={starEarnedEffect}
    >
      <div 
        className="w-full h-full relative bg-gradient-to-br from-amber-100 to-orange-200 overflow-hidden cursor-pointer"
        onMouseMove={handleMouseMove}
      >
        {/* House background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <pattern id="house-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <text x="20" y="40" fontSize="30">🏠</text>
            </pattern>
            <rect width="100%" height="100%" fill="url(#house-pattern)" />
          </svg>
        </div>

        {/* Items */}
        <AnimatePresence>
          {items.map((item) => {
            const isHovered = currentHovered === item.id;
            const hoverProgress = isHovered ? getHoverProgress() : 0;
            
            return (
              <motion.div
                key={item.id}
                className="absolute select-none pointer-events-none"
                style={{
                  left: item.position.x,
                  top: item.position.y,
                  width: item.size,
                  height: item.size,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: item.discovered ? 0 : (isHovered ? 1.2 : 1),
                  opacity: item.discovered ? 0 : (isHovered ? 1 : 0.7),
                  filter: `brightness(${item.discovered ? 2 : (isHovered ? 1.3 : 1)})`
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Item */}
                <div
                  className="w-full h-full flex items-center justify-center text-2xl bg-white rounded-full shadow-lg border-2 border-gray-200"
                  style={{
                    transform: `rotate(${isHovered ? Math.sin(Date.now() * 0.01) * 5 : 0}deg)`,
                  }}
                >
                  {item.emoji}
                </div>
                
                {/* Hover progress ring */}
                {isHovered && (
                  <div className="absolute inset-0 rounded-full">
                    <svg className="w-full h-full -rotate-90" style={{ overflow: 'visible' }}>
                      <circle
                        cx="50%"
                        cy="50%"
                        r="50%"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="3"
                        strokeDasharray={`${hoverProgress * Math.PI * (item.size || 40)} ${Math.PI * (item.size || 40)}`}
                        className="transition-all duration-100"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                )}
                
                {/* Item name tooltip */}
                {isHovered && (
                  <motion.div
                    className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-sm whitespace-nowrap"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {item.name}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Particle effects */}
        <ParticleSystem particles={particles} onParticlesUpdate={setParticles} />
      </div>
    </SimpleGameUI>
  );
};

export default HouseExplorerGame;
