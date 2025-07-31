export type GameCategory = 'movement' | 'clicking' | 'dragging' | 'pointing' | 'scrolling';

export interface GameData {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: GameCategory;
  thumbnail: string;
  backgroundColor: string;
  component: React.ComponentType<GameProps>;
  rating?: number;
  playCount?: number;
  stars?: number;
}

export interface GameProps {
  onStarEarned?: (currentStarsCount: number) => void;
  onGameComplete?: (gameCompleted: boolean) => void;
  onGameEnd?: (score: number) => void;
  currentStars?: number;
  gameKey?: number;
}

export interface GameProgress {
  gameId: string;
  stars: number;
  bestScore: number;
  timesPlayed: number;
  completed: boolean;
}

export interface GameStats {
  gamesPlayed: number;
  totalTime: number;
  totalStars: number;
  favoriteGames: string[];
  achievements: Achievement[];
  gameProgress: { [gameId: string]: GameProgress };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface GameSession {
  gameId: string;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  score?: number;
  starsEarned?: number;
}
