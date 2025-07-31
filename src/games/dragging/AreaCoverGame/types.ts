export interface TargetArea {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isCovered: boolean;
}

export interface AreaCoverConfig {
  level: number;
  minTargetSize: number;
  maxTargetSize: number;
  coverageThreshold: number; // Percentage of coverage required (0-1)
}