import { useLanguage } from '../contexts/LanguageContext';

export const useFontClasses = () => {
  const { language } = useLanguage();
  
  return {
    heading: language === 'th' ? 'font-sriracha' : 'font-fredoka',
    kid: language === 'th' ? 'font-sriracha' : 'font-fredoka',
    body: language === 'th' ? 'font-nunito' : 'font-nunito'
  };
};
