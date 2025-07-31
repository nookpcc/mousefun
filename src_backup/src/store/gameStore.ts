import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameStats, GameSession, GameProgress } from '../types';

interface GameStore {
  stats: GameStats;
  currentSession: GameSession | null;
  gameProgress: { [gameId: string]: GameProgress };
  
  // Actions
  startGame: (gameId: string) => void;
  endGame: (gameId: string) => void;
  updateGameProgress: (gameId: string, stars: number) => void;
  addToFavorites: (gameId: string) => void;
  removeFromFavorites: (gameId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  getTotalStars: () => number;
  getCompletedGames: () => number;
}

export const useGameStore = create<GameStore>()(persist(
  (set, get) => ({
    stats: {
      gamesPlayed: 0,
      totalTime: 0,
      totalStars: 0,
      favoriteGames: [],
      achievements: [],
      gameProgress: {}
    },
    currentSession: null,
    gameProgress: {},

    startGame: (gameId: string) => {
      set({
        currentSession: {
          gameId,
          startTime: new Date(),
          completed: false
        }
      });
    },

    endGame: (gameId: string) => {
      const session = get().currentSession;
      if (!session) return;

      const endTime = new Date();
      const duration = endTime.getTime() - session.startTime.getTime();

      set((state) => ({
        currentSession: null,
        stats: {
          ...state.stats,
          gamesPlayed: state.stats.gamesPlayed + 1,
          totalTime: state.stats.totalTime + duration,
          totalStars: get().getTotalStars()
        }
      }));
    },

    updateGameProgress: (gameId: string, stars: number) => {
      set((state) => {
        const currentProgress = state.gameProgress[gameId] || {
          gameId,
          stars: 0,
          bestScore: 0,
          timesPlayed: 0,
          completed: false,
        };

        const newProgress: GameProgress = {
          ...currentProgress,
          stars: Math.max(currentProgress.stars, stars),
          timesPlayed: currentProgress.timesPlayed + 1,
          completed: currentProgress.completed || stars >= 5,
        };

        const newGameProgress = {
          ...state.gameProgress,
          [gameId]: newProgress,
        };

        return {
          gameProgress: newGameProgress,
          stats: {
            ...state.stats,
            totalStars: Object.values(newGameProgress).reduce(
              (total, prog) => total + prog.stars,
              0
            ),
          },
        };
      });
    },

    addToFavorites: (gameId: string) => {
      set((state) => ({
        stats: {
          ...state.stats,
          favoriteGames: [...state.stats.favoriteGames, gameId]
        }
      }));
    },

    removeFromFavorites: (gameId: string) => {
      set((state) => ({
        stats: {
          ...state.stats,
          favoriteGames: state.stats.favoriteGames.filter(id => id !== gameId)
        }
      }));
    },

    unlockAchievement: (achievementId: string) => {
      set((state) => ({
        stats: {
          ...state.stats,
          achievements: state.stats.achievements.map(achievement =>
            achievement.id === achievementId
              ? { ...achievement, unlocked: true, unlockedAt: new Date() }
              : achievement
          )
        }
      }));
    },

    getTotalStars: () => {
      const { gameProgress } = get();
      return Object.values(gameProgress).reduce((total, progress) => total + progress.stars, 0);
    },

    getCompletedGames: () => {
      const { gameProgress } = get();
      return Object.values(gameProgress).filter(progress => progress.completed).length;
    }
  }),
  {
    name: 'mousefun-storage',
    version: 1
  }
));
