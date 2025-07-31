export interface TargetZone {
  id: string;
  position: number; // Center position of the target
  size: number; // Size of the target zone
  isHit: boolean;
}

export interface ScrollChallengeGameState {
  targetZones: TargetZone[];
  playerSliderPosition: number; // Current position of the player's slider
  currentStar: number;
  targetsHit: number;
  gameStarted: boolean;
  starCompleted: boolean;
  gameCompleted: boolean;
  earnedStars: number;
}

export interface ScrollChallengeLevel {
  level: number;
  target: number; // Number of targets to hit
  minTargetPosition: number; // Min position for targets
  maxTargetPosition: number; // Max position for targets
  targetZoneSize: number; // Fixed size for target zones
  scrollSensitivity: number; // How much playerSliderPosition changes per scroll event
  description: string;
}