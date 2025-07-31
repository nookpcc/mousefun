export interface HouseRoom {
  id: string;
  name: string;
  emoji: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  discovered: boolean;
  hovered: boolean;
  revealDelay?: number;
}

export interface HouseExplorerStarLevel {
  star: number;
  target: number; // Number of rooms to discover
  roomCount: number;
  timeLimit: number; // 0 = no time limit
  description: string;
  rooms: Omit<HouseRoom, 'discovered' | 'hovered'>[];
}

export interface HouseExplorerGameState {
  rooms: HouseRoom[];
  currentStar: number;
  roomsDiscovered: number;
  gameStarted: boolean;
  starCompleted: boolean;
  gameCompleted: boolean;
  earnedStars: number;
  timeRemaining: number;
  mousePosition: { x: number; y: number };
  currentHoveredRoom: string | null;
}