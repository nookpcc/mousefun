import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, StarLevel, ParticleEffect } from './types';

interface UseGameLogicProps {
  starLevels: StarLevel[];
  onStarEarned?: (stars: number) => void;
  onGameComplete?: (completed: boolean) => void;
}

export const useGameLogic = ({ starLevels, onStarEarned, onGameComplete }: UseGameLogicProps) => {
  const [gameState, setGameState] = useState<GameState>({
    isStarted: false,
    isPaused: false,
    isCompleted: false,
    currentStar: 1,
    score: 0,
    timeRemaining: starLevels[0]?.timeLimit,
    starsEarned: 0
  });

  const [particles, setParticles] = useState<ParticleEffect[]>([]);
  const timerRef = useRef<number | null>(null);
  const gameLoopRef = useRef<number | null>(null);

  // Start game
  const startGame = useCallback(() => {
    const firstLevel = starLevels[0];
    setGameState({
      isStarted: true,
      isPaused: false,
      isCompleted: false,
      currentStar: 1,
      score: 0,
      timeRemaining: firstLevel?.timeLimit,
      starsEarned: 0
    });
  }, [starLevels]);

  // End game
  const endGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isCompleted: true, isStarted: false }));
    if (timerRef.current) clearTimeout(timerRef.current);
    if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
    onGameComplete?.(true);
  }, [onGameComplete]);

  // Restart game
  const restartGame = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
    setParticles([]);
    startGame();
  }, [startGame]);

  // Add score
  const addScore = useCallback((points: number) => {
    setGameState(prev => {
      const newScore = prev.score + points;
      const currentLevel = starLevels[prev.currentStar - 1];
      
      // Check if reached target for current star
      let newStarsEarned = prev.starsEarned;
      let newCurrentStar = prev.currentStar;

      if (currentLevel && newScore >= currentLevel.target && prev.starsEarned < prev.currentStar) {
        newStarsEarned = prev.currentStar;
        onStarEarned?.(newStarsEarned);
        
        // Move to next star level if not at max
        if (prev.currentStar < 5) {
          newCurrentStar = prev.currentStar + 1;
          const nextLevel = starLevels[newCurrentStar - 1];
          // Reset timer if next level has time limit
          if (nextLevel?.timeLimit) {
            // Timer will be handled by the timer effect
          }
        } else {
          // Completed all stars
          setTimeout(() => endGame(), 1000);
        }
      }

      return {
        ...prev,
        score: newScore,
        starsEarned: newStarsEarned,
        currentStar: newCurrentStar
      };
    });
  }, [starLevels, onStarEarned, endGame]);

  // Add particles
  const addParticles = useCallback((newParticles: ParticleEffect[]) => {
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  // Timer effect
  useEffect(() => {
    if (!gameState.isStarted || gameState.isPaused || gameState.isCompleted) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const currentLevel = starLevels[gameState.currentStar - 1];
    if (!currentLevel?.timeLimit) return; // No timer for this level

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      setGameState(prev => {
        const newTimeRemaining = (prev.timeRemaining || 0) - 0.1;
        if (newTimeRemaining <= 0) {
          setTimeout(() => endGame(), 100);
          return { ...prev, timeRemaining: 0 };
        }
        return { ...prev, timeRemaining: newTimeRemaining };
      });
    }, 100);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameState.isStarted, gameState.isPaused, gameState.isCompleted, gameState.currentStar, starLevels, endGame]);

  // Particle cleanup
  useEffect(() => {
    if (particles.length === 0) return;

    const cleanup = setTimeout(() => {
      setParticles([]);
    }, 3000);

    return () => clearTimeout(cleanup);
  }, [particles]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, []);

  return {
    gameState,
    particles,
    startGame,
    endGame,
    restartGame,
    addScore,
    addParticles,
    setParticles
  };
};