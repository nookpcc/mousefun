import { useState, useCallback } from 'react';
import { ParticleEffect } from './types';

interface StarLevel {
  star: number;
  target: number;
  description: string;
}

interface SimpleGameState {
  isStarted: boolean;
  isCompleted: boolean;
  currentStar: number;
  score: number;
  starsEarned: number;
  starCompleted: boolean;
}

interface UseSimpleGameLogicProps {
  starLevels: StarLevel[];
  onStarEarned?: (stars: number) => void;
  onGameComplete?: (completed: boolean) => void;
}

export const useSimpleGameLogic = ({ starLevels, onStarEarned, onGameComplete }: UseSimpleGameLogicProps) => {
  const [gameState, setGameState] = useState<SimpleGameState>({
    isStarted: false,
    isCompleted: false,
    currentStar: 1,
    score: 0,
    starsEarned: 0,
    starCompleted: false
  });

  const [particles, setParticles] = useState<ParticleEffect[]>([]);
  const [starEarnedEffect, setStarEarnedEffect] = useState(false);

  // Start game
  const startGame = useCallback(() => {
    setGameState({
      isStarted: true,
      isCompleted: false,
      currentStar: 1,
      score: 0,
      starsEarned: 0,
      starCompleted: false
    });
  }, []);

  // Restart game
  const restartGame = useCallback(() => {
    setParticles([]);
    setStarEarnedEffect(false);
    startGame();
  }, [startGame]);

  // Add score and check for star completion
  const addScore = useCallback((points: number) => {
    setGameState(prev => {
      const newScore = prev.score + points;
      const currentLevel = starLevels[prev.currentStar - 1];
      
      let updates: Partial<SimpleGameState> = {
        score: newScore
      };

      // Check if reached target for current star
      if (currentLevel && newScore >= currentLevel.target && !prev.starCompleted) {
        const newStarsEarned = prev.starsEarned + 1;
        
        updates = {
          ...updates,
          starsEarned: newStarsEarned,
          starCompleted: true
        };

        // Trigger star effect
        setStarEarnedEffect(true);
        setTimeout(() => setStarEarnedEffect(false), 2000);

        // Callback
        onStarEarned?.(newStarsEarned);

        // Check if completed all stars
        if (newStarsEarned >= 5) {
          updates.isCompleted = true;
          setTimeout(() => onGameComplete?.(true), 1000);
        } else {
          // Auto advance to next star after delay
          setTimeout(() => {
            setGameState(currentState => ({
              ...currentState,
              currentStar: prev.currentStar + 1,
              score: 0,
              starCompleted: false
            }));
          }, 2000);
        }
      }

      return { ...prev, ...updates };
    });
  }, [starLevels, onStarEarned, onGameComplete]);

  // Add particles
  const addParticles = useCallback((newParticles: ParticleEffect[]) => {
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  return {
    gameState,
    particles,
    starEarnedEffect,
    startGame,
    restartGame,
    addScore,
    addParticles,
    setParticles
  };
};