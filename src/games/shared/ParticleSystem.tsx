import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticleEffect } from './types';
import { updateParticles } from './effects';

interface ParticleSystemProps {
  particles: ParticleEffect[];
  onParticlesUpdate?: (particles: ParticleEffect[]) => void;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  particles,
  onParticlesUpdate
}) => {
  const [currentParticles, setCurrentParticles] = useState<ParticleEffect[]>(particles);

  useEffect(() => {
    setCurrentParticles(particles);
  }, [particles]);

  useEffect(() => {
    if (currentParticles.length === 0) return;

    const interval = setInterval(() => {
      setCurrentParticles(prevParticles => {
        const updated = updateParticles(prevParticles);
        onParticlesUpdate?.(updated);
        return updated;
      });
    }, 16); // 60fps

    return () => clearInterval(interval);
  }, [currentParticles.length, onParticlesUpdate]);

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      <AnimatePresence>
        {currentParticles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: particle.position.x,
              top: particle.position.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
            }}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ 
              opacity: particle.life / particle.maxLife,
              scale: particle.life / particle.maxLife
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.1 }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};