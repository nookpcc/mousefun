import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProps } from '../../../types';
import { useFontClasses } from '../../../hooks/useFontClasses';
import { useLanguage } from '../../../contexts/LanguageContext';
import { HouseRoom, HouseExplorerGameState } from './types';
import { HOUSE_EXPLORER_STAR_LEVELS, DISCOVERY_DELAY } from './constants';
import { initializeRooms, isMouseOverRoom, getRoomStyle, calculateProgress } from './utils';

interface HouseExplorerGameProps extends GameProps {}

const HouseExplorerGame: React.FC<HouseExplorerGameProps> = ({ 
  onStarEarned, 
  onGameComplete, 
  currentStars = 0,
  gameKey = 0
}) => {
  const fonts = useFontClasses();
  const { t } = useLanguage();
  
  const [gameState, setGameState] = useState<HouseExplorerGameState>({
    rooms: [],
    currentStar: 1,
    roomsDiscovered: 0,
    gameStarted: false,
    starCompleted: false,
    gameCompleted: false,
    earnedStars: 0,
    timeRemaining: 0,
    mousePosition: { x: 0, y: 0 },
    currentHoveredRoom: null
  });
  
  const [starEarnedEffect, setStarEarnedEffect] = useState(false);
  const [pendingStarEarned, setPendingStarEarned] = useState<number | null>(null);
  const [pendingGameComplete, setPendingGameComplete] = useState(false);
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);
  const [callbacksProcessed, setCallbacksProcessed] = useState<Set<number>>(new Set());

  // Reset game when gameKey changes
  useEffect(() => {
    if (gameKey > 0) {
      resetGame();
    }
  }, [gameKey]);

  const resetGame = () => {
    const level = HOUSE_EXPLORER_STAR_LEVELS[0];
    setGameState({
      rooms: [],
      currentStar: 1,
      roomsDiscovered: 0,
      gameStarted: false,
      starCompleted: false,
      gameCompleted: false,
      earnedStars: 0,
      timeRemaining: level.timeLimit,
      mousePosition: { x: 364, y: 200 }, // Center
      currentHoveredRoom: null
    });
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
    setCallbacksProcessed(new Set());
    setPendingStarEarned(null);
    setPendingGameComplete(false);
  };

  const getCurrentLevel = () => HOUSE_EXPLORER_STAR_LEVELS[gameState.currentStar - 1];

  const startGame = () => {
    const level = getCurrentLevel();
    const rooms = initializeRooms(level);
    
    setGameState(prev => ({
      ...prev,
      gameStarted: true,
      rooms,
      roomsDiscovered: 0,
      starCompleted: false,
      timeRemaining: level.timeLimit
    }));
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameState.gameStarted || gameState.starCompleted || gameState.gameCompleted) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const mousePos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    setGameState(prev => {
      let updates: Partial<HouseExplorerGameState> = {
        mousePosition: mousePos
      };
      
      // Check which room is being hovered
      let hoveredRoom: string | null = null;
      const updatedRooms = prev.rooms.map(room => {
        const isHovered = isMouseOverRoom(mousePos, room);
        if (isHovered && !room.discovered) {
          hoveredRoom = room.id;
        }
        return {
          ...room,
          hovered: isHovered && !room.discovered
        };
      });
      
      updates.rooms = updatedRooms;
      updates.currentHoveredRoom = hoveredRoom;
      
      return { ...prev, ...updates };
    });
  }, [gameState.gameStarted, gameState.starCompleted, gameState.gameCompleted]);

  // Handle room discovery after hover delay
  useEffect(() => {
    if (gameState.currentHoveredRoom && !gameState.starCompleted && !gameState.gameCompleted) {
      // Clear existing timer
      if (hoverTimer) {
        clearTimeout(hoverTimer);
      }
      
      const timer = setTimeout(() => {
        setGameState(prev => {
          const roomIndex = prev.rooms.findIndex(r => r.id === prev.currentHoveredRoom);
          if (roomIndex === -1 || prev.rooms[roomIndex].discovered) return prev;
          
          const updatedRooms = [...prev.rooms];
          updatedRooms[roomIndex] = { ...updatedRooms[roomIndex], discovered: true, hovered: false };
          
          const newDiscoveredCount = prev.roomsDiscovered + 1;
          const level = HOUSE_EXPLORER_STAR_LEVELS[prev.currentStar - 1];
          
          let updates: Partial<HouseExplorerGameState> = {
            rooms: updatedRooms,
            roomsDiscovered: newDiscoveredCount,
            currentHoveredRoom: null
          };
          
          // Check if star level completed
          if (newDiscoveredCount >= level.target && !prev.starCompleted) {
            const newStarCount = prev.earnedStars + 1;
            updates = {
              ...updates,
              starCompleted: true,
              earnedStars: newStarCount
            };
            
            // Trigger star earned effect
            setStarEarnedEffect(true);
            setTimeout(() => setStarEarnedEffect(false), 2000);
            
            // Set pending after a small delay to ensure state is settled
            setTimeout(() => setPendingStarEarned(newStarCount), 10);
            
            // Check if we earned all 5 stars (game completed)
            if (newStarCount === 5) {
              updates.gameCompleted = true;
              setPendingGameComplete(true);
            } else {
              // Set the next star number immediately in the current update (like MouseTrail)
              const nextStarNumber = prev.currentStar + 1;
              if (nextStarNumber <= 5 && nextStarNumber <= HOUSE_EXPLORER_STAR_LEVELS.length) {
                const nextLevel = HOUSE_EXPLORER_STAR_LEVELS[nextStarNumber - 1];
                const newRooms = initializeRooms(nextLevel);
                
                // Auto advance to next star after delay
                setTimeout(() => {
                  setGameState(currentState => ({
                    ...currentState,
                    currentStar: nextStarNumber,
                    rooms: newRooms,
                    roomsDiscovered: 0,
                    starCompleted: false,
                    timeRemaining: nextLevel.timeLimit,
                    currentHoveredRoom: null
                  }));
                }, 2000);
              }
            }
          }
          
          return { ...prev, ...updates };
        });
      }, DISCOVERY_DELAY);
      
      setHoverTimer(timer);
    } else {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        setHoverTimer(null);
      }
    }
    
    // Cleanup function
    return () => {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
      }
    };
  }, [gameState.currentHoveredRoom, gameState.starCompleted, gameState.gameCompleted]); // Removed hoverTimer from deps

  // Handle pending callbacks to avoid setState during render
  useEffect(() => {
    if (pendingStarEarned !== null && !callbacksProcessed.has(pendingStarEarned)) {
      // Use setTimeout to avoid calling during render
      const timeoutId = setTimeout(() => {
        onStarEarned?.(pendingStarEarned);
        setCallbacksProcessed(prev => new Set([...prev, pendingStarEarned]));
        setPendingStarEarned(null);
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [pendingStarEarned, onStarEarned, callbacksProcessed]);

  useEffect(() => {
    if (pendingGameComplete) {
      // Use setTimeout to avoid calling during render
      const timeoutId = setTimeout(() => {
        onGameComplete?.(true);
        setPendingGameComplete(false);
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [pendingGameComplete, onGameComplete]);

  if (!gameState.gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-100 to-green-100 rounded-lg">
        <div className="text-6xl mb-4">🏠</div>
        <h2 className={`text-2xl ${fonts.kid} text-gray-800 mb-4`}>{t('title', 'house-explorer')}</h2>
        <p className={`text-gray-600 mb-6 text-center max-w-md ${fonts.body} text-lg`}>
          {t('description', 'house-explorer')}
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
      className="relative w-full h-full bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden"
      onMouseMove={handleMouseMove}
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
            🏠 {t('title', 'house-explorer')}
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
            🏠 {gameState.roomsDiscovered}/{getCurrentLevel().target} ห้อง
          </span>
        </div>
      </div>

      {/* House Background */}
      <div className="absolute inset-4 bg-gradient-to-b from-yellow-100 to-orange-100 rounded-xl border-4 border-yellow-600 shadow-lg">
        {/* House Outline */}
        <svg viewBox="0 0 728 400" className="w-full h-full absolute inset-0">
          {/* House Structure */}
          <path
            d="M50 350 L650 350 L650 150 L350 50 L50 150 Z"
            fill="none"
            stroke="#8b4513"
            strokeWidth="3"
            strokeDasharray="10,5"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* Rooms */}
      <AnimatePresence>
        {gameState.rooms.map((room, index) => (
          <motion.div
            key={room.id}
            className="absolute flex flex-col items-center justify-center text-center cursor-pointer rounded-xl transition-all duration-300"
            style={{
              left: room.position.x,
              top: room.position.y,
              width: room.size.width,
              height: room.size.height,
              ...getRoomStyle(room, index),
              zIndex: room.hovered ? 20 : 10
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <motion.div
              className="text-4xl mb-2"
              animate={room.discovered ? { 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              } : room.hovered ? {
                scale: [1, 1.1, 1]
              } : {}}
              transition={{ 
                duration: room.discovered ? 0.6 : 0.3,
                repeat: room.discovered ? 0 : Infinity,
                repeatType: room.hovered ? "reverse" : "loop"
              }}
            >
              {room.emoji}
            </motion.div>
            
            {room.discovered && (
              <motion.div
                className={`${fonts.kid} text-sm font-bold text-gray-800`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {room.name}
              </motion.div>
            )}
            
            {room.hovered && !room.discovered && (
              <motion.div
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-2 py-1 rounded text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ชี้ค้างไว้...
              </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>


      {/* Star Earned Effect - No Modal */}
      {starEarnedEffect && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none cursor-default"
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
            <h3 className={`text-3xl ${fonts.kid} text-gray-800 mb-2`}>🎉 ยอดเยี่ยม! 🎉</h3>
            <p className={`text-gray-600 mb-4 ${fonts.body}`}>
              คุณเล่น {t('title', 'house-explorer')} เก่งมาก! 🏠
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

export default HouseExplorerGame;