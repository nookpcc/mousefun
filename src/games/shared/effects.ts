import { GamePosition, ParticleEffect } from './types';
import { generateId } from './gameUtils';
import { COLORS } from './constants';

// Particle effect utilities
export const createParticleEffect = (
  position: GamePosition,
  count: number = 6,
  colors: readonly string[] = COLORS.PRIMARY
): ParticleEffect[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: generateId(),
    position: { ...position },
    velocity: {
      x: Math.cos(i * 60 * Math.PI / 180) * (Math.random() * 50 + 25),
      y: Math.sin(i * 60 * Math.PI / 180) * (Math.random() * 50 + 25)
    },
    life: 0,
    maxLife: Math.random() * 0.5 + 0.5, // 0.5-1 seconds
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 4 + 2
  }));
};

// Star animation variants
export const starAnimations = {
  earn: {
    scale: [1, 1.5, 1],
    rotate: [0, 360],
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  burst: {
    scale: [0, 2, 3],
    opacity: [0, 1, 0],
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  },
  sparkle: {
    scale: [0, 1, 0],
    opacity: [1, 1, 0],
    transition: {
      duration: 1,
      ease: "easeOut"
    }
  }
};

// Game completion animations
export const gameCompleteAnimations = {
  container: {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0 },
    transition: { duration: 0.3 }
  },
  stars: {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0 },
    transition: { 
      type: "spring",
      stiffness: 200,
      delay: 0.2
    }
  },
  button: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { duration: 0.2 }
  }
};

// Entity spawn animations
export const entityAnimations = {
  spawn: {
    scale: [0, 1.2, 1],
    opacity: [0, 1],
    transition: { duration: 0.3 }
  },
  despawn: {
    scale: 0,
    opacity: 0,
    transition: { duration: 0.2 }
  },
  float: {
    y: [0, -10, 0],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: "easeInOut"
    }
  },
  bounce: {
    scale: [1, 1.1, 1],
    transition: { duration: 0.2 }
  }
};