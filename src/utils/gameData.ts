import { GameData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import BubblePopGame from '../games/BubblePopGame';
import MouseTrailGame from '../games/MouseTrailGame';
import ClickTargetGame from '../games/ClickTargetGame';

// Static game data with translation keys
export const gameDataStatic = [
  {
    id: 'bubble-pop',
    titleKey: 'title',
    descriptionKey: 'description',
    difficulty: 'easy' as const,
    category: 'clicking' as const,
    thumbnail: '🫧',
    rating: 5,
    playCount: 15420,
    stars: 0,
    backgroundColor: 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)',
    component: BubblePopGame
  },
  {
    id: 'mouse-trail',
    titleKey: 'title',
    descriptionKey: 'description',
    difficulty: 'easy' as const,
    category: 'movement' as const,
    thumbnail: '⭐',
    rating: 4,
    playCount: 12890,
    stars: 0,
    backgroundColor: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
    component: MouseTrailGame
  },
  {
    id: 'click-target',
    titleKey: 'title',
    descriptionKey: 'description',
    difficulty: 'medium' as const,
    category: 'clicking' as const,
    thumbnail: '🎯',
    rating: 4,
    playCount: 9560,
    stars: 0,
    backgroundColor: 'linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%)',
    component: ClickTargetGame
  },
  // Add more games with placeholder data
  {
    id: 'maze-runner',
    titleKey: 'title',
    descriptionKey: 'description',
    difficulty: 'medium' as const,
    category: 'movement' as const,
    thumbnail: '🏃‍♂️',
    rating: 4,
    playCount: 8320,
    stars: 0,
    backgroundColor: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
    component: BubblePopGame
  },
  {
    id: 'color-match',
    titleKey: 'title',
    descriptionKey: 'description',
    difficulty: 'easy' as const,
    category: 'dragging' as const,
    thumbnail: '🎨',
    rating: 5,
    playCount: 11240,
    stars: 0,
    backgroundColor: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
    component: BubblePopGame
  },
  {
    id: 'fruit-catch',
    titleKey: 'title',
    descriptionKey: 'description',
    difficulty: 'medium' as const,
    category: 'clicking' as const,
    thumbnail: '🍎',
    rating: 4,
    playCount: 7890,
    stars: 0,
    backgroundColor: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)',
    component: BubblePopGame
  },
  {
    id: 'shape-sort',
    titleKey: 'title',
    descriptionKey: 'description',
    difficulty: 'hard' as const,
    category: 'dragging' as const,
    thumbnail: '🔷',
    rating: 3,
    playCount: 5670,
    stars: 0,
    backgroundColor: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
    component: BubblePopGame
  },
  {
    id: 'balloon-pop',
    titleKey: 'title',
    descriptionKey: 'description',
    difficulty: 'easy' as const,
    category: 'clicking' as const,
    thumbnail: '🎈',
    rating: 5,
    playCount: 13450,
    stars: 0,
    backgroundColor: 'linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%)',
    component: BubblePopGame
  },
  {
    id: 'puzzle-pieces',
    titleKey: 'title',
    descriptionKey: 'description',
    difficulty: 'hard' as const,
    category: 'dragging' as const,
    thumbnail: '🧩',
    rating: 4,
    playCount: 4230,
    stars: 0,
    backgroundColor: 'linear-gradient(135deg, #fafafa 0%, #e0e0e0 100%)',
    component: BubblePopGame
  }
];

// Hook to get translated game data
export const useGameData = (): GameData[] => {
  const { t } = useLanguage();
  
  return gameDataStatic.map(game => ({
    ...game,
    title: t(game.titleKey, game.id),
    description: t(game.descriptionKey, game.id)
  }));
};

// For components that can't use hooks
export const gameData = gameDataStatic.map(game => ({
  ...game,
  title: game.id, // Will be replaced by translations
  description: game.id // Will be replaced by translations
}));

export const getGameById = (id: string): GameData | undefined => {
  return gameData.find(game => game.id === id);
};

export const getGamesByCategory = (category: string): GameData[] => {
  return gameData.filter(game => game.category === category);
};

export const getGamesByDifficulty = (difficulty: string): GameData[] => {
  return gameData.filter(game => game.difficulty === difficulty);
};
