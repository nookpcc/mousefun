import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { LanguageProvider } from './contexts/LanguageContext';
import { useFontClasses } from './hooks/useFontClasses';
import { useLanguage } from './contexts/LanguageContext';

// Simple test games
const TestGame1 = () => (
  <div className="flex items-center justify-center h-96 bg-blue-100 rounded-lg">
    <div className="text-center">
      <div className="text-6xl mb-4">🎮</div>
      <h2 className="text-2xl font-bold mb-4">Test Game 1</h2>
      <p className="text-gray-600">This is a test game</p>
    </div>
  </div>
);

const TestGame2 = () => (
  <div className="flex items-center justify-center h-96 bg-green-100 rounded-lg">
    <div className="text-center">
      <div className="text-6xl mb-4">🌟</div>
      <h2 className="text-2xl font-bold mb-4">Test Game 2</h2>
      <p className="text-gray-600">This is another test game</p>
    </div>
  </div>
);

const TestGame3 = () => (
  <div className="flex items-center justify-center h-96 bg-purple-100 rounded-lg">
    <div className="text-center">
      <div className="text-6xl mb-4">🎈</div>
      <h2 className="text-2xl font-bold mb-4">Test Game 3</h2>
      <p className="text-gray-600">This is the third test game</p>
    </div>
  </div>
);

const testGames = [
  { id: 1, name: 'Test Game 1', component: TestGame1 },
  { id: 2, name: 'Test Game 2', component: TestGame2 },
  { id: 3, name: 'Test Game 3', component: TestGame3 },
];

function AppContent() {
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const fonts = useFontClasses();
  const { t } = useLanguage();

  const handleNextGame = useCallback(() => {
    setCurrentGameIndex((prev) => (prev + 1) % testGames.length);
  }, []);

  const handlePrevGame = useCallback(() => {
    setCurrentGameIndex((prev) => (prev - 1 + testGames.length) % testGames.length);
  }, []);

  const CurrentGameComponent = testGames[currentGameIndex].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <motion.header
        className="text-center py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className={`text-5xl ${fonts.heading} text-gray-800 mb-2`}>
          🖱️ MouseFun (Test Mode)
        </h1>
        <p className={`text-lg text-gray-600 ${fonts.body}`}>
          Testing basic functionality
        </p>
      </motion.header>

      {/* Game Area */}
      <main className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="flex justify-between items-center mb-6 bg-white rounded-lg p-4 shadow">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              onClick={handlePrevGame}
              disabled={currentGameIndex === 0}
            >
              ← Previous
            </button>
            
            <h2 className="text-xl font-bold">
              {testGames[currentGameIndex].name} ({currentGameIndex + 1}/3)
            </h2>
            
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              onClick={handleNextGame}
              disabled={currentGameIndex === testGames.length - 1}
            >
              Next →
            </button>
          </div>

          {/* Current Game */}
          <motion.div
            key={currentGameIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentGameComponent />
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
