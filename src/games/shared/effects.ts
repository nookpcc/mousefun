import { GamePosition, ParticleEffect } from './types';

export const createParticleEffect = (
  position: GamePosition,
  color: string = '#FFD700',
  count: number = 8
): ParticleEffect[] => {
  const particles: ParticleEffect[] = [];
  
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const velocity = {
      x: Math.cos(angle) * (Math.random() * 100 + 50),
      y: Math.sin(angle) * (Math.random() * 100 + 50)
    };
    
    particles.push({
      id: Math.random().toString(36),
      position: { ...position },
      velocity,
      life: 1,
      maxLife: 1,
      color,
      size: Math.random() * 8 + 4
    });
  }
  
  return particles;
};

export const updateParticles = (particles: ParticleEffect[], deltaTime: number = 16): ParticleEffect[] => {
  return particles
    .map(particle => ({
      ...particle,
      position: {
        x: particle.position.x + particle.velocity.x * deltaTime / 1000,
        y: particle.position.y + particle.velocity.y * deltaTime / 1000
      },
      life: particle.life - deltaTime / 1000,
      velocity: {
        x: particle.velocity.x * 0.98, // Friction
        y: particle.velocity.y * 0.98 + 100 * deltaTime / 1000 // Gravity
      }
    }))
    .filter(particle => particle.life > 0);
};

export const createStarBurst = (position: GamePosition): ParticleEffect[] => {
  return createParticleEffect(position, '#FFD700', 12);
};

export const createPopEffect = (position: GamePosition): ParticleEffect[] => {
  return createParticleEffect(position, '#87CEEB', 6);
};

export const createCollectionEffect = (position: GamePosition): ParticleEffect[] => {
  return createParticleEffect(position, '#98FB98', 10);
};
