import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  currentStars = 0,
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

  // Animation state
  const [isAnimatingStar, setIsAnimatingStar] = useState(false);
  const [starPositions, setStarPositions] = useState({ from: { x: 0, y: 0 }, to: { x: 0, y: 0 } });
  const modalRef = useRef<HTMLDivElement>(null);
  const starRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Reset game when gameKey changes
  useEffect(() => {
    if (gameKey > 0) {
      resetGame();
    }
  }, [gameKey]);

  // Effect to trigger star animation
  useEffect(() => {
    if (gameState.starCompleted && !isAnimatingStar) {
      console.log('[Animation Debug] Effect triggered. starCompleted:', gameState.starCompleted);

      const modalRect = modalRef.current?.getBoundingClientRect();
      const targetStarIndex = gameState.earnedStars - 1;
      const starRect = starRefs.current[targetStarIndex]?.getBoundingClientRect();

      console.log('[Animation Debug] modalRef.current:', modalRef.current);
      console.log('[Animation Debug] modalRect:', modalRect);
      console.log('[Animation Debug] targetStarIndex:', targetStarIndex);
      console.log('[Animation Debug] starRefs.current[targetStarIndex]:', starRefs.current[targetStarIndex]);
      console.log('[Animation Debug] starRect:', starRect);

      if (modalRect && starRect) {
        console.log('[Animation Debug] Both rects found. Calculating positions.');
        const fromPos = {
          x: modalRect.width / 2 - 30, // Center of modal (approx)
          y: modalRect.height / 2 - 60, // Center of modal (approx)
        };
        const toPos = {
          x: starRect.left - modalRect.left,
          y: starRect.top - modalRect.top,
        };
        console.log('[Animation Debug] Positions calculated:', { from: fromPos, to: toPos });
        setStarPositions({ from: fromPos, to: toPos });
        setIsAnimatingStar(true);
      } else {
        console.error('[Animation Debug] Failed to get modalRect or starRect.');
      }
    }
  }, [gameState.starCompleted, gameState.earnedStars, isAnimatingStar]);

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
    setIsAnimatingStar(false);
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
        x: bubble.position.x,
        y: bubble.position.y,
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
          bubbles: [] // Clear remaining bubbles
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

  const nextStar = () => {
    if (gameState.currentStar < 5) {
      setGameState(prev => ({
        ...prev,
        currentStar: prev.currentStar + 1,
        bubblesPopped: 0,
        starCompleted: false,
        bubbles: []
      }));
    }
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

  // Bubble cleanup (remove old bubbles)
  useEffect(() => {
    const cleanup = setInterval(() => {
      setGameState(prev => {
        const now = Date.now();
        const activeBubbles = prev.bubbles.filter(bubble => {
          return now - parseInt(bubble.id, 36) < 8000; // Remove after 8 seconds
        });
        return { ...prev, bubbles: activeBubbles };
      });
    }, 1000);

    return () => clearInterval(cleanup);
  }, []);

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
            className={`absolute bubble ${bubble.color} border-2 border-white/50 shadow-lg cursor-pointer`}
            style={{
              left: bubble.position.x,
              top: bubble.position.y,
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
              duration: 0.3,
              y: { repeat: Infinity, duration: 2 / bubble.speed }
            }}
            onClick={() => popBubble(bubble.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-white/30 to-transparent" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Star Completed Modal */}
      {gameState.starCompleted && !gameState.gameCompleted && (
        <motion.div
          className="absolute inset-0 bg-black/50 flex items-center justify-center z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            ref={modalRef}
            className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4 relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {isAnimatingStar && (
              <motion.span
                className="absolute text-6xl"
                initial={{ x: starPositions.from.x, y: starPositions.from.y, scale: 1.5 }}
                animate={{ x: starPositions.to.x, y: starPositions.to.y, scale: 0.3 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                onAnimationComplete={() => setIsAnimatingStar(false)}
              >
                ⭐
              </motion.span>
            )}

            {!isAnimatingStar && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-6xl mb-4"
              >
                ⭐
              </motion.div>
            )}
            
            <h3 className={`text-2xl ${fonts.kid} text-gray-800 mb-2`}>ได้ดาวแล้ว!</h3>
            <p className={`text-gray-600 mb-4 ${fonts.body}`}>
              ดาวที่ {gameState.currentStar} เสร็จแล้ว! 🎉
            </p>
            
            <div className="flex justify-center mb-4">
              {Array.from({ length: 5 }, (_, index) => (
                <span 
                  key={index}
                  ref={(el) => (starRefs.current[index] = el)}
                  className={`text-3xl mx-1 transition-opacity duration-300 ${
                    index < gameState.earnedStars ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  style={{
                    opacity: isAnimatingStar && index === gameState.earnedStars - 1 ? 0 : 1,
                  }}
                >
                  {index < gameState.earnedStars ? '⭐' : '☆'}
                </span>
              ))}
            </div>

            {gameState.currentStar < 5 ? (
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
                onClick={nextStar}
                disabled={isAnimatingStar}
              >
                ➡️ ดาวถัดไป
              </button>
            ) : (
              <p className={`text-green-600 font-bold ${fonts.body}`}>
                🏆 ผ่านเกมแล้ว!
              </p>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Game Completed */}
      {gameState.gameCompleted && (
        <motion.div
          className="absolute inset-0 bg-black/50 flex items-center justify-center z-20"
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
            <h3 className={`text-3xl ${fonts.kid} text-gray-800 mb-2`}>ยอดเยี่ยม!</h3>
            <p className={`text-gray-600 mb-4 ${fonts.body}`}>
              คุณผ่านเกมจับฟองสบู่แล้ว! 🎉
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
            
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
              onClick={resetGame}
            >
              🔄 {t('playAgain')}
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default BubblePopGame;