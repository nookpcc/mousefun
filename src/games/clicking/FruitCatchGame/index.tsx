import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProps } from '../../../types';
import { useFontClasses } from '../../../hooks/useFontClasses';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Fruit, FruitCatchGameState } from './types';
import { FRUIT_CATCH_STAR_LEVELS, FRUIT_FALL_INTERVAL, CATCHER_WIDTH, CATCHER_HEIGHT } from './constants';
import { generateFruit, shouldSpawnFruit, isFruitCaught, updateFruitPositions, isFruitOffScreen } from './utils';
import { GAME_BOUNDS } from '../../shared/constants';

interface FruitCatchGameProps extends GameProps {}

const FruitCatchGame: React.FC<FruitCatchGameProps> = ({
  onStarEarned,
  onGameComplete,
  gameKey = 0
}) => {
  const fonts = useFontClasses();
  const { t } = useLanguage();

  const [gameState, setGameState] = useState<FruitCatchGameState>({
    fruits: [],
    catcherPosition: { x: GAME_BOUNDS.WIDTH / 2 - CATCHER_WIDTH / 2, y: GAME_BOUNDS.HEIGHT - CATCHER_HEIGHT - 20 },
    currentStar: 1,
    fruitsCaught: 0,
    gameStarted: false,
    starCompleted: false,
    gameCompleted: false,
    earnedStars: 0,
  });

  const [starEarnedEffect, setStarEarnedEffect] = useState(false);
  const [pendingStarEarned, setPendingStarEarned] = useState<number | null>(null);
  const [pendingGameComplete, setPendingGameComplete] = useState(false);

  // Reset game when gameKey changes
  useEffect(() => {
    if (gameKey > 0) {
      resetGame();
    }
  }, [gameKey]);

  const resetGame = () => {
    setGameState({
      fruits: [],
      catcherPosition: { x: GAME_BOUNDS.WIDTH / 2 - CATCHER_WIDTH / 2, y: GAME_BOUNDS.HEIGHT - CATCHER_HEIGHT - 20 },
      currentStar: 1,
      fruitsCaught: 0,
      gameStarted: false,
      starCompleted: false,
      gameCompleted: false,
      earnedStars: 0,
    });
  };

  const getCurrentLevel = () => FRUIT_CATCH_STAR_LEVELS[gameState.currentStar - 1];

  const generateFruitForCurrentLevel = useCallback((): Fruit => {
    return generateFruit(getCurrentLevel());
  }, [gameState.currentStar]);

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      gameStarted: true,
      fruitsCaught: 0,
      starCompleted: false,
      fruits: []
    }));
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameState.gameStarted || gameState.starCompleted || gameState.gameCompleted) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    setGameState(prev => ({
      ...prev,
      catcherPosition: {
        ...prev.catcherPosition,
        x: Math.max(0, Math.min(mouseX - CATCHER_WIDTH / 2, GAME_BOUNDS.WIDTH - CATCHER_WIDTH))
      }
    }));
  }, [gameState.gameStarted, gameState.starCompleted, gameState.gameCompleted]);

  // Game loop
  useEffect(() => {
    if (!gameState.gameStarted || gameState.starCompleted || gameState.gameCompleted) return;

    const gameLoop = setInterval(() => {
      setGameState(prev => {
        const level = getCurrentLevel();
        let newFruits = updateFruitPositions(prev.fruits, level.fruitSpeed);
        let newFruitsCaught = prev.fruitsCaught;

        // Check for caught fruits
        newFruits = newFruits.filter(fruit => {
          if (isFruitCaught(fruit, prev.catcherPosition, CATCHER_WIDTH, CATCHER_HEIGHT)) {
            newFruitsCaught++;
            return false; // Remove caught fruit
          }
          return !isFruitOffScreen(fruit); // Remove off-screen fruits
        });

        // Spawn new fruits
        if (shouldSpawnFruit(newFruits, level.fruitCount)) {
          if (Math.random() < (level.spawnRate / 1000 * (FRUIT_FALL_INTERVAL / 1000))) { // Adjust spawn rate to interval
            newFruits.push(generateFruitForCurrentLevel());
          }
        }

        let updates: Partial<FruitCatchGameState> = {
          fruits: newFruits,
          fruitsCaught: newFruitsCaught
        };

        // Check if star level completed
        if (newFruitsCaught >= level.target && !prev.starCompleted) {
          const newStarCount = prev.earnedStars + 1;
          updates = {
            ...updates,
            starCompleted: true,
            earnedStars: newStarCount,
            fruits: [] // Clear remaining fruits
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
            if (nextStarNumber <= 5 && nextStarNumber <= FRUIT_CATCH_STAR_LEVELS.length) {
              setTimeout(() => {
                setGameState(currentState => ({
                  ...currentState,
                  currentStar: nextStarNumber,
                  fruitsCaught: 0,
                  starCompleted: false,
                  fruits: []
                }));
              }, 2000);
            }
          }
        }

        return { ...prev, ...updates };
      });
    }, FRUIT_FALL_INTERVAL);

    return () => clearInterval(gameLoop);
  }, [gameState.gameStarted, gameState.starCompleted, gameState.gameCompleted, gameState.currentStar, generateFruitForCurrentLevel]);

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

  if (!gameState.gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-green-100 to-red-100 rounded-lg">
        <div className="text-6xl mb-4">🍎</div>
        <h2 className={`text-2xl ${fonts.kid} text-gray-800 mb-4`}>{t('title', 'fruit-catch')}</h2>
        <p className={`text-gray-600 mb-6 text-center max-w-md ${fonts.body}`}>
          {t('description', 'fruit-catch')}
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
    <div
      className="relative w-full h-full bg-gradient-to-br from-green-100 to-red-100 rounded-lg overflow-hidden cursor-none"
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
            🍎 {t('title', 'fruit-catch')}
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
            🍎 {gameState.fruitsCaught}/{getCurrentLevel().target} {t('fruits')}
          </span>
        </div>
      </div>

      {/* Fruits */}
      <AnimatePresence>
        {gameState.fruits.map((fruit) => (
          <motion.div
            key={fruit.id}
            className="absolute pointer-events-none"
            style={{
              left: fruit.position.x,
              top: fruit.position.y,
              width: fruit.size,
              height: fruit.size,
              fontSize: fruit.size * 0.8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: fruit.position.y }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {fruit.type}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Catcher */}
      <motion.div
        className="absolute bg-blue-500 rounded-full shadow-lg border-4 border-blue-700"
        style={{
          left: gameState.catcherPosition.x,
          top: gameState.catcherPosition.y,
          width: CATCHER_WIDTH,
          height: CATCHER_HEIGHT,
        }}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />

      {/* Star Earned Effect */}
      {starEarnedEffect && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none cursor-default"
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
            <h3 className={`text-3xl ${fonts.kid} text-gray-800 mb-2`}>🎉 ยอดเยี่ยม! 🎉</h3>
            <p className={`text-gray-600 mb-4 ${fonts.body}`}>
              คุณเล่น {t('title', 'fruit-catch')} เก่งมาก! 🍎
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
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
                onClick={resetGame}
              >
                🔄 {t('playAgain')}
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
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

export default FruitCatchGame;
