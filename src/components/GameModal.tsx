import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameData } from '../types';

interface GameModalProps {
  game: GameData | null;
  isOpen: boolean;
  onClose: () => void;
  onGameEnd?: (score: number) => void;
}

const GameModal: React.FC<GameModalProps> = ({ game, isOpen, onClose, onGameEnd }) => {
  if (!game) return null;

  const GameComponent = game.component;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{game.thumbnail}</div>
                  <div>
                    <h2 className="text-xl font-kid">{game.title}</h2>
                    <p className="text-sm text-blue-100 font-body">{game.description}</p>
                  </div>
                </div>
                <motion.button
                  className="text-white hover:text-gray-300 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                >
                  ✕
                </motion.button>
              </div>
            </div>

            {/* Game Content */}
            <div className="p-6">
              <GameComponent onGameEnd={onGameEnd} />
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-4 flex justify-between items-center">
              <div className="flex items-center space-x-4 text-sm text-gray-600 font-body">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  game.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  game.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {game.difficulty === 'easy' ? 'ง่าย' : 
                   game.difficulty === 'medium' ? 'ปานกลาง' : 'ยาก'}
                </span>
                <span>เล่น {game.playCount.toLocaleString()} ครั้ง</span>
              </div>
              <motion.button
                className="text-gray-500 hover:text-gray-700 font-body text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
              >
                🔙 กลับสู่หน้าหลัก
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameModal;
