import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-2xl">🐭</div>
              <span className="text-xl font-kid">MouseFun</span>
            </div>
            <p className="text-gray-300 text-sm font-body">
              เกมฝึกทักษะเมาส์สำหรับเด็ก<br />
              สนุก ง่าย และปลอดภัย
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-kid mb-4">เกมยอดนิยม</h3>
            <ul className="space-y-2 text-sm font-body">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">🫧 จับฟองสบู่</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">⭐ เก็บดวงดาว</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">🎯 เป้าหมายแสนสนุก</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">🎈 ปูดลูกโป่ง</a></li>
            </ul>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-kid mb-4">สำหรับครู</h3>
            <p className="text-gray-300 text-sm font-body mb-4">
              เกมเหล่านี้ช่วยเด็กฝึกทักษะการใช้เมาส์<br />
              เหมาะสำหรับการเรียนการสอน
            </p>
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="text-lg">👶</div>
                <div className="text-xs text-gray-400">ปลอดภัย</div>
              </div>
              <div className="text-center">
                <div className="text-lg">🎓</div>
                <div className="text-xs text-gray-400">การศึกษา</div>
              </div>
              <div className="text-center">
                <div className="text-lg">🆓</div>
                <div className="text-xs text-gray-400">ฟรี</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-gray-700 mt-8 pt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-gray-400 text-sm font-body">
            © 2025 MouseFun.com - เกมฝึกทักษะเมาส์สำหรับเด็ก 🐭✨
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
