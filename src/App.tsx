import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GameContainer from './components/GameContainer';
import LanguageSwitcher from './components/LanguageSwitcher';
import AdSpace from './components/AdSpace';
import { useGameData } from './utils/gameData';
import { useLanguage } from './contexts/LanguageContext';
import { useFontClasses } from './hooks/useFontClasses';

function App() {
  const { t } = useLanguage();
  const gameData = useGameData();
  const fonts = useFontClasses();
  
  // Add state for game selection
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [gameKey, setGameKey] = useState(0);

  const handleSelectGame = (index: number) => {
    setCurrentGameIndex(index);
    setGameKey(prev => prev + 1);
  };

  const handleNextGame = () => {
    setCurrentGameIndex((prev) => (prev + 1) % gameData.length);
    setGameKey(prev => prev + 1);
  };

  const handlePrevGame = () => {
    setCurrentGameIndex((prev) => (prev - 1 + gameData.length) % gameData.length);
    setGameKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Language Switcher - Top Right */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      {/* Header */}
      <motion.header
        className="text-center py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className={`text-5xl ${fonts.heading} text-gray-800 mb-2`}>
          🖱️ {t('title')}
        </h1>
        <p className={`text-lg text-gray-600 ${fonts.body}`}>
          {t('subtitle')}
        </p>
      </motion.header>

      {/* Top Banner Ad - Keep as is */}
      <motion.div
        className="w-full py-2 bg-white shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container mx-auto px-4 flex justify-center">
          <AdSpace size="banner" />
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4">
        {/* Game Container with Square Ads */}
        <div className="flex justify-center items-start gap-4">
          {/* Left Square Ads */}
          <motion.div
            className="hidden lg:flex lg:flex-col gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AdSpace size="square" />
            <AdSpace size="square" />
          </motion.div>

          {/* Game Area Only */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GameContainer 
              games={gameData} 
              currentGameIndex={currentGameIndex}
              gameKey={gameKey}
              onSelectGame={handleSelectGame}
              onNextGame={handleNextGame}
              onPrevGame={handlePrevGame}
            />
          </motion.div>

          {/* Right Square Ads */}
          <motion.div
            className="hidden lg:flex lg:flex-col gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <AdSpace size="square" />
            <AdSpace size="square" />
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        className="bg-white shadow-lg mt-8 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <div className="container mx-auto px-4 text-center">
          <p className={`text-gray-600 ${fonts.body} text-sm`}>
            {t('footer')}
          </p>
          <p className={`text-gray-500 ${fonts.body} text-xs mt-1`}>
            {t('footerDesc')}
          </p>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;
