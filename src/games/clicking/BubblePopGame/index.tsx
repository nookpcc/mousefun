import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProps } from '../../../types';
import { useFontClasses } from '../../../hooks/useFontClasses';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Bubble, BubbleGameState } from './types';
import { BUBBLE_STAR_LEVELS } from './constants';
import { generateBubble, shouldSpawnBubble } from './utils';

interface PopEffect {
  id: string;
  x: string;
  y: string;
  size: number;
}

interface BubblePopGameProps extends GameProps {}

const BubblePopGame: React.FC<BubblePopGameProps> = ({ 
  onStarEarned, 
  onGameComplete, 
  gameKey = 0
}) => {
  const fonts = useFontClasses();
  const { t } = useLanguage();
  
  const [gameState, setGameState] = useState<BubbleGameState>({
    bubbles: [],
    currentStar: 1,
    bubblesPopped: 0,
    gameStarted: false,
    starCompleted: false,
    gameCompleted: false,
    earnedStars: 0,
  });

  const [pops, setPops] = useState<PopEffect[]>([]);

  // Reset game when gameKey changes
  useEffect(() => {
    if (gameKey > 0) {
      resetGame();
    }
  }, [gameKey]);

  const resetGame = () => {
    setGameState({
      bubbles: [],
      currentStar: 1,
      bubblesPopped: 0,
      gameStarted: false,
      starCompleted: false,
      gameCompleted: false,
      earnedStars: 0,
    });
    setPops([]);
  };

  const getCurrentLevel = () => BUBBLE_STAR_LEVELS[gameState.currentStar - 1];

  const generateBubbleForCurrentLevel = useCallback((): Bubble => {
    return generateBubble(getCurrentLevel());
  }, [gameState.currentStar]);

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      gameStarted: true,
      bubblesPopped: 0,
      starCompleted: false
    }));
  };

  const popBubble = (bubbleId: string) => {
    const bubble = gameState.bubbles.find(b => b.id === bubbleId);
    if (bubble) {
      const newPop: PopEffect = {
        id: bubble.id,
        x: bubble.position.x.toString(),
        y: bubble.position.y.toString(),
        size: bubble.size,
      };
      setPops(currentPops => [...currentPops, newPop]);
    }

    setGameState(prev => {
      const newBubbles = prev.bubbles.filter(b => b.id !== bubbleId);
      const newBubblesPopped = prev.bubblesPopped + 1;
      const level = getCurrentLevel();
      
      let updates: Partial<BubbleGameState> = {
        bubbles: newBubbles,
        bubblesPopped: newBubblesPopped
      };
      
      if (newBubblesPopped >= level.target) {
        const newStarCount = prev.earnedStars + 1;
        updates = {
          ...updates,
          starCompleted: true,
          earnedStars: newStarCount,
          bubbles: []
        };
        
        onStarEarned?.(newStarCount);
        
        if (prev.currentStar >= 5) {
          updates.gameCompleted = true;
          onGameComplete?.(true);
        }
      }
      
      return { ...prev, ...updates };
    });
  };

  // Bubble spawning system
  useEffect(() => {
    if (!gameState.gameStarted || gameState.starCompleted || gameState.gameCompleted) return;

    const level = getCurrentLevel();
    const bubbleInterval = setInterval(() => {
      setGameState(prev => {
        if (shouldSpawnBubble(prev.bubbles, level.bubbleCount)) {
          return {
            ...prev,
            bubbles: [...prev.bubbles, generateBubbleForCurrentLevel()]
          };
        }
        return prev;
      });
    }, level.spawnRate);

    return () => clearInterval(bubbleInterval);
  }, [gameState.gameStarted, gameState.starCompleted, gameState.gameCompleted, gameState.currentStar, generateBubbleForCurrentLevel]);

  if (!gameState.gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
        <div className="text-6xl mb-4">🫧</div>
        <h2 className={`text-2xl ${fonts.kid} text-gray-800 mb-4`}>{t('title', 'bubble-pop')}</h2>
        <p className={`text-gray-600 mb-6 text-center max-w-md ${fonts.body}`}>
          {t('description', 'bubble-pop')}
        </p>
        
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
          onClick={startGame}
        >
          🎮 {t('startGame')}
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg overflow-hidden">
      {/* Game UI */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2">
          <span className={`${fonts.kid} text-lg`}>
            ⭐ {gameState.currentStar}/5 ({gameState.bubblesPopped}/{getCurrentLevel().target})
          </span>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2">
          <span className={`${fonts.kid} text-sm`}>{getCurrentLevel().description}</span>
        </div>
      </div>

      {/* Pop Effects */}
      <AnimatePresence>
        {pops.map(pop => (
          <motion.div
            key={pop.id}
            className="absolute rounded-full border-2 border-white/80"
            style={{
              left: pop.x,
              top: pop.y,
              width: pop.size,
              height: pop.size,
            }}
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onAnimationComplete={() => {
              setPops(currentPops => currentPops.filter(p => p.id !== pop.id));
            }}
          />
        ))}
      </AnimatePresence>

      {/* Bubbles */}
      <AnimatePresence>
        {gameState.bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className="absolute rounded-full border-2 border-white/50 shadow-lg cursor-pointer bg-gradient-to-br from-blue-400 to-purple-500"
            style={{
              left: bubble.position.x + 'px',
              top: bubble.position.y + 'px',
              width: bubble.size,
              height: bubble.size,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              y: [0, -10, 0],
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              duration: 0.5,
              y: { repeat: Infinity, duration: 2 }
            }}
            onClick={() => popBubble(bubble.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </AnimatePresence>

      {/* Star Completed */}
      {gameState.starCompleted && !gameState.gameCompleted && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/50 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-8 text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <div className="text-6xl mb-4">⭐</div>
            <h3 className={`text-2xl ${fonts.kid} text-gray-800 mb-4`}>
              {t('starEarned')} {gameState.currentStar}!
            </h3>
            {gameState.currentStar < 5 && (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full"
                onClick={() => {
                  setGameState(prev => ({
                    ...prev,
                    currentStar: prev.currentStar + 1,
                    bubblesPopped: 0,
                    starCompleted: false,
                    bubbles: []
                  }));
                }}
              >
                ➡️ {t('nextLevel')}
              </button>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Game Completed */}
      {gameState.gameCompleted && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/50 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-8 text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <div className="text-6xl mb-4">🏆</div>
            <h3 className={`text-3xl ${fonts.kid} text-gray-800 mb-4`}>
              {t('gameComplete')}!
            </h3>
            <div className="flex justify-center mb-4">
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index} className="text-4xl mx-1 text-yellow-400">
                  ⭐
                </span>
              ))}
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full"
                onClick={resetGame}
              >
                🔄 {t('playAgain')}
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full"
                onClick={() => onGameComplete?.(true)}
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

export default BubblePopGame;
