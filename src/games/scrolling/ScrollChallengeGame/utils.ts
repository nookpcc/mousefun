import { TargetZone, ScrollChallengeLevel } from './types';
import { TRACK_WIDTH, SLIDER_SIZE } from './constants';

export const generateTargetZone = (level: ScrollChallengeLevel): TargetZone => {
  const position = Math.floor(Math.random() * (level.maxTargetPosition - level.minTargetPosition + 1)) + level.minTargetPosition;
  return {
    id: `target-${Date.now()}-${Math.random()}`,
    position,
    size: level.targetZoneSize,
    isHit: false,
  };
};

export const checkAlignment = (playerPos: number, target: TargetZone): boolean => {
  const playerCenter = playerPos + SLIDER_SIZE / 2;
  const targetLeft = target.position - target.size / 2;
  const targetRight = target.position + target.size / 2;

  // Check if player's center is within the target zone
  return playerCenter >= targetLeft && playerCenter <= targetRight;
};