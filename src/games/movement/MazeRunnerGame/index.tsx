import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProps } from '../../../types';
import { useFontClasses } from '../../../hooks/useFontClasses';
import { useLanguage } from '../../../contexts/LanguageContext';
import { MazeRunnerGameState, MazeTileType } from './types';
import { MAZE_RUNNER_STAR_LEVELS, PLAYER_SIZE } from './constants';
import { createMaze, initializePlayer, isCollidingWithWall, hasReachedEnd } from './utils';
import { GAME_BOUNDS } from '../../shared/constants';

interface MazeRunnerGameProps extends GameProps {}

const MazeRunnerGame: React.FC<MazeRunnerGameProps> = ({
  onStarEarned,
  onGameComplete,
  gameKey = 0
}) => {
  const fonts = useFontClasses();
  const { t } = useLanguage();

  const [gameState, setGameState] = useState<MazeRunnerGameState>(() => {
    const level = MAZE_RUNNER_STAR_LEVELS[0];
    const maze = createMaze(level);
    const player = initializePlayer(maze, level.tileSize);
    return {
      maze,
      player,
      currentStar: 1,
      gameStarted: false,
      starCompleted: false,
      gameCompleted: false,
      earnedStars: 0,
      mousePosition: { x: player.x, y: player.y },
    };
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
    const level = MAZE_RUNNER_STAR_LEVELS[0];
    const maze = createMaze(level);
    const player = initializePlayer(maze, level.tileSize);
    setGameState({
      maze,
      player,
      currentStar: 1,
      gameStarted: false,
      starCompleted: false,
      gameCompleted: false,
      earnedStars: 0,
      mousePosition: { x: player.x, y: player.y },
    });
  };

  const getCurrentLevel = () => MAZE_RUNNER_STAR_LEVELS[gameState.currentStar - 1];

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      gameStarted: true,
      starCompleted: false,
    }));
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameState.gameStarted || gameState.starCompleted || gameState.gameCompleted) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setGameState(prev => {
      const level = getCurrentLevel();
      const newPlayerX = mouseX - PLAYER_SIZE / 2;
      const newPlayerY = mouseY - PLAYER_SIZE / 2;

      // Check for collisions
      if (isCollidingWithWall(newPlayerX, newPlayerY, prev.maze, level.tileSize)) {
        // If collision, reset player to start
        const startPlayer = initializePlayer(prev.maze, level.tileSize);
        return {
          ...prev,
          player: startPlayer,
          mousePosition: { x: startPlayer.x, y: startPlayer.y }
        };
      }

      let updates: Partial<MazeRunnerGameState> = {
        player: { ...prev.player, x: newPlayerX, y: newPlayerY },
        mousePosition: { x: newPlayerX, y: newPlayerY }
      };

      // Check if reached end
      if (hasReachedEnd(newPlayerX, newPlayerY, prev.maze, level.tileSize) && !prev.starCompleted) {
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
          if (nextStarNumber <= 5 && nextStarNumber <= MAZE_RUNNER_STAR_LEVELS.length) {
            setTimeout(() => {
              const nextLevel = MAZE_RUNNER_STAR_LEVELS[nextStarNumber - 1];
              const newMaze = createMaze(nextLevel);
              const newPlayer = initializePlayer(newMaze, nextLevel.tileSize);
              setGameState(currentState => ({
                ...currentState,
                currentStar: nextStarNumber,
                maze: newMaze,
                player: newPlayer,
                starCompleted: false,
                mousePosition: { x: newPlayer.x, y: newPlayer.y }
              }));
            }, 2000);
          }
        }
      }

      return { ...prev, ...updates };
    });
  }, [gameState.gameStarted, gameState.starCompleted, gameState.gameCompleted]);

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

  const getTileColor = (type: MazeTileType) => {
    switch (type) {
      case 'wall': return 'bg-gray-700';
      case 'path': return 'bg-gray-300';
      case 'start': return 'bg-green-500';
      case 'end': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  if (!gameState.gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-green-100 to-blue-100 rounded-lg">
        <div className="text-6xl mb-4">🏃‍♂️</div>
        <h2 className={`text-2xl ${fonts.kid} text-gray-800 mb-4`}>{t('title', 'maze-runner')}</h2>
        <p className={`text-gray-600 mb-6 text-center max-w-md ${fonts.body}`}>
          {t('description', 'maze-runner')}
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

  const level = getCurrentLevel();

  return (
    <div
      ref={gameAreaRef}
      className="relative w-full h-full bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden"
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
            🏃‍♂️ {t('title', 'maze-runner')}
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
            🏁 {t('level')} {gameState.currentStar}/5
          </span>
        </div>
      </div>

      {/* Maze */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          width: level.maze[0].length * level.tileSize,
          height: level.maze.length * level.tileSize,
          border: '4px solid #333',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)'
        }}
      >
        {gameState.maze.tiles.map((row, rIdx) => (
          <div key={rIdx} className="flex">
            {row.map((tile, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                className={`flex items-center justify-center ${getTileColor(tile.type)}`}
                style={{
                  width: level.tileSize,
                  height: level.tileSize,
                  border: '1px solid rgba(0,0,0,0.1)'
                }}
              >
                {tile.type === 'start' && <span className="text-2xl">🟢</span>}
                {tile.type === 'end' && <span className="text-2xl">🏁</span>}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Player */}
      <motion.div
        className="absolute bg-blue-600 rounded-full border-2 border-blue-800 shadow-lg pointer-events-none"
        style={{
          left: gameState.player.x,
          top: gameState.player.y,
          width: PLAYER_SIZE,
          height: PLAYER_SIZE,
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 1 }}
      />

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
              {t('gameCompleteMessage', 'maze-runner')} 🏃‍♂️
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

export default MazeRunnerGame;
