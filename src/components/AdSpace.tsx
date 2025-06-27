import React from 'react';
import { motion } from 'framer-motion';

interface AdSpaceProps {
  size: 'banner' | 'square' | 'skyscraper';
  className?: string;
}

const AdSpace: React.FC<AdSpaceProps> = ({ size, className = '' }) => {
  const getSizeClasses = (adSize: string) => {
    switch (adSize) {
      case 'banner':
        return 'w-full max-w-3xl h-24';
      case 'square':
        return 'w-80 h-64';
      case 'skyscraper':
        return 'w-40 h-[500px]';
      default:
        return 'w-80 h-64';
    }
  };

  const getContent = (adSize: string) => {
    switch (adSize) {
      case 'banner':
        return '728x90 Banner Ad';
      case 'square':
        return '300x250 Square Ad';
      case 'skyscraper':
        return '160x600 Skyscraper Ad';
      default:
        return 'Advertisement';
    }
  };

  return (
    <motion.div
      className={`${getSizeClasses(size)} bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center p-4">
        <div className="text-xs font-mono text-gray-400 mb-1">AD SPACE</div>
        <div className="text-xs text-gray-500 mb-2">{getContent(size)}</div>
        <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
          💰 Revenue
        </div>
      </div>
    </motion.div>
  );
};

export default AdSpace;
