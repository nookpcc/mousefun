import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { GameProps } from '../../../types';
import { MazeTileType } from './types';
import { MAZE_RUNNER_STAR_LEVELS, PLAYER_SIZE } from './constants';
import { createMaze, initializePlayer, isCollidingWithWall, hasReachedEnd, getMazeConfig } from './utils';
import { SimpleGameUI } from '../../shared/GameUI';
import { useSimpleGameLogic } from '../../shared/useSimpleGameLogic';

interface MazeRunnerGameProps extends GameProps {}

const MazeRunnerGame: React.FC<MazeRunnerGameProps> = ({
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
    starLevels: MAZE_RUNNER_STAR_LEVELS,
    onStarEarned,
    onGameComplete
  });

  // Maze-specific state
  const [maze, setMaze] = useState(() => createMaze(1));
  const [player, setPlayer] = useState(() => {
    const config = getMazeConfig(1);
    const initialMaze = createMaze(1);
    return initializePlayer(initialMaze, config.tileSize);
  });

  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Initialize maze and player when star level changes
  useEffect(() => {
    const config = getMazeConfig(gameState.currentStar);
    const newMaze = createMaze(gameState.currentStar);
    const newPlayer = initializePlayer(newMaze, config.tileSize);
    setMaze(newMaze);
    setPlayer(newPlayer);
  }, [gameState.currentStar]);

  // Reset game when gameKey changes
  useEffect(() => {
    if (gameKey > 0) {
      setParticles([]);
    }
  }, [gameKey, setParticles]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameState.isStarted || gameState.starCompleted || gameState.isCompleted) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const config = getMazeConfig(gameState.currentStar);
    const newPlayerX = mouseX - PLAYER_SIZE / 2;
    const newPlayerY = mouseY - PLAYER_SIZE / 2;

    // Check for collisions
    if (isCollidingWithWall(newPlayerX, newPlayerY, maze, config.tileSize)) {
      // If collision, reset player to start
      const startPlayer = initializePlayer(maze, config.tileSize);
      setPlayer(startPlayer);
      return;
    }

    // Update player position
    setPlayer({ x: newPlayerX, y: newPlayerY, size: PLAYER_SIZE });

    // Check if reached end
    if (hasReachedEnd(newPlayerX, newPlayerY, maze, config.tileSize) && !gameState.starCompleted) {
      addScore(1); // This will trigger star completion in useSimpleGameLogic
    }
  }, [gameState.isStarted, gameState.starCompleted, gameState.isCompleted, gameState.currentStar, maze, addScore]);


  const getTileColor = (type: MazeTileType) => {
    switch (type) {
      case 'wall': return 'bg-gray-700';
      case 'path': return 'bg-gray-300';
      case 'start': return 'bg-green-500';
      case 'end': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const config = getMazeConfig(gameState.currentStar);

  return (
    <SimpleGameUI
      gameTitle="เกมวิ่งในเขาวงกต"
      gameEmoji="🏃‍♂️"
      score={gameState.score}
      currentStar={gameState.currentStar}
      starsEarned={gameState.starsEarned}
      gameStarted={gameState.isStarted}
      gameCompleted={gameState.isCompleted}
      starLevels={MAZE_RUNNER_STAR_LEVELS}
      onStartGame={startGame}
      onRestartGame={restartGame}
      onNextGame={() => onGameComplete?.(true)}
      starEarnedEffect={starEarnedEffect}
    >
      <div
        ref={gameAreaRef}
        className="relative w-full h-full bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden"
        onMouseMove={handleMouseMove}
      >

        {/* Maze */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            width: maze.tiles[0].length * config.tileSize,
            height: maze.tiles.length * config.tileSize,
            border: '4px solid #333',
            boxShadow: '0 0 20px rgba(0,0,0,0.5)'
          }}
        >
          {maze.tiles.map((row, rIdx) => (
            <div key={rIdx} className="flex">
              {row.map((tile, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`flex items-center justify-center ${getTileColor(tile.type)}`}
                  style={{
                    width: config.tileSize,
                    height: config.tileSize,
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
            left: player.x,
            top: player.y,
            width: PLAYER_SIZE,
            height: PLAYER_SIZE,
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      </div>
    </SimpleGameUI>
  );
};

export default MazeRunnerGame;
