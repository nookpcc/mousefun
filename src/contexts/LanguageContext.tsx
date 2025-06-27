import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Language, translations } from '../utils/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, gameId?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('th');

  // Update HTML lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, gameId?: string): string => {
    try {
      const translation = translations[language];
      
      // Handle game-specific translations
      if (gameId && translation[gameId as keyof typeof translation]) {
        const gameTranslation = translation[gameId as keyof typeof translation] as any;
        if (gameTranslation[key]) {
          return gameTranslation[key];
        }
      }
      
      // Handle general translations
      if (translation[key as keyof typeof translation]) {
        return translation[key as keyof typeof translation] as string;
      }
      
      // Fallback to Thai if translation not found
      const fallback = translations.th[key as keyof typeof translations.th];
      return fallback as string || key;
    } catch (error) {
      return key; // Return key if all else fails
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
