import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2">
      <button
        className={`px-3 py-1 rounded ${
          language === 'th' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        onClick={() => setLanguage('th')}
      >
        🇹🇭 ไทย
      </button>
      <button
        className={`px-3 py-1 rounded ${
          language === 'en' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        onClick={() => setLanguage('en')}
      >
        🇺🇸 EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
