import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StarRatingProps {
  stars: number; // 0-5
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  showAnimation?: boolean;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  stars, 
  maxStars = 5, 
  size = 'md',
  showAnimation = true,
  className = ''
}) => {
  const [prevStars, setPrevStars] = useState(stars);
  const [newStarIndex, setNewStarIndex] = useState(-1);

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  // Detect when a new star is earned
  useEffect(() => {
    if (stars > prevStars) {
      setNewStarIndex(stars - 1); // Index of the new star
      setPrevStars(stars);
      
      // Clear the new star effect after animation
      const timeout = setTimeout(() => {
        setNewStarIndex(-1);
      }, 1500);
      
      return () => clearTimeout(timeout);
    }
  }, [stars, prevStars]);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: maxStars }, (_, index) => (
        <div key={index} className="relative">
          <motion.span
            className={`${sizeClasses[size]} ${
              index < stars ? 'text-yellow-400' : 'text-gray-300'
            }`}
            initial={showAnimation ? { scale: 0, rotate: -180 } : false}
            animate={showAnimation ? { scale: 1, rotate: 0 } : false}
            transition={showAnimation ? { 
              delay: index * 0.1,
              type: "spring",
              stiffness: 200
            } : false}
            whileHover={{ scale: 1.2 }}
          >
            {index < stars ? '⭐' : '☆'}
          </motion.span>
          
          {/* New Star Effect */}
          <AnimatePresence>
            {newStarIndex === index && (
              <>
                {/* Burst Effect */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 2, opacity: 1 }}
                  exit={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <div className={`${sizeClasses[size]} text-yellow-300`}>✨</div>
                </motion.div>
                
                {/* Sparkle particles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-yellow-400 rounded-full pointer-events-none"
                    style={{
                      left: '50%',
                      top: '50%',
                    }}
                    initial={{ 
                      scale: 0, 
                      x: 0, 
                      y: 0,
                      opacity: 1
                    }}
                    animate={{ 
                      scale: [0, 1, 0],
                      x: Math.cos(i * 60 * Math.PI / 180) * 30,
                      y: Math.sin(i * 60 * Math.PI / 180) * 30,
                      opacity: [1, 1, 0]
                    }}
                    transition={{ 
                      duration: 1,
                      delay: 0.2,
                      ease: "easeOut"
                    }}
                  />
                ))}
                
                {/* Pulsing glow */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0, 0.6, 0]
                  }}
                  transition={showAnimation && index === stars - 1 ? {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  } : undefined}
                >
                  <div className={`${sizeClasses[size]} text-yellow-200`}>⭐</div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      ))}
      <span className="ml-2 text-sm font-body text-gray-600">
        {stars}/{maxStars}
      </span>
    </div>
  );
};

export default StarRating;
