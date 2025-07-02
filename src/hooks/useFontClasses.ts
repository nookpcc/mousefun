import { useLanguage } from '../contexts/LanguageContext';

export const useFontClasses = () => {
  const { language } = useLanguage();

  const getFontClass = (type: 'heading' | 'body' | 'kid') => {
    switch (language) {
      case 'th':
        return type === 'heading' || type === 'kid' ? 'font-heading-th' : 'font-body-th';
      case 'en':
        return type === 'heading' || type === 'kid' ? 'font-heading-en' : 'font-body-en';
      case 'ja':
        return type === 'heading' || type === 'kid' ? 'font-heading-ja' : 'font-body-ja';
      default:
        return type === 'heading' || type === 'kid' ? 'font-heading' : 'font-body';
    }
  };

  return {
    heading: getFontClass('heading'),
    body: getFontClass('body'),
    kid: getFontClass('kid'),
    // Convenience getters
    headingClass: getFontClass('heading'),
    bodyClass: getFontClass('body'),
    kidClass: getFontClass('kid'),
  };
};
