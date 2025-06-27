import React from 'react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-6 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-4xl">🐭</div>
            <div>
              <h1 className="text-3xl md:text-4xl font-kid text-white">
                MouseFun
              </h1>
              <p className="text-sm md:text-base text-blue-100 font-body">
                เกมฝึกทักษะเมาส์สำหรับเด็ก
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="hidden md:flex items-center space-x-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-center">
              <div className="text-2xl">⭐</div>
              <div className="text-xs text-blue-100">สนุก</div>
            </div>
            <div className="text-center">
              <div className="text-2xl">🎯</div>
              <div className="text-xs text-blue-100">ง่าย</div>
            </div>
            <div className="text-center">
              <div className="text-2xl">🛡️</div>
              <div className="text-xs text-blue-100">ปลอดภัย</div>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;
