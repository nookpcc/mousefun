export interface GameData {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'movement' | 'clicking' | 'dragging';
  thumbnail: string;
  rating: number;
  playCount: number;
  stars: number; // 0-5 ดาว
  component: React.ComponentType<GameProps>;
  backgroundColor: string;
}

export interface GameProps {
  onStarEarned?: (currentStarsCount: number) => void;
  onGameComplete?: (gameCompleted: boolean) => void;
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
