import { TargetArea, AreaCoverLevel } from './types';
import { GAME_AREA_WIDTH, GAME_AREA_HEIGHT } from './constants';

export const generateTargetArea = (level: AreaCoverLevel): TargetArea => {
  const width = Math.floor(Math.random() * (level.maxTargetSize - level.minTargetSize + 1)) + level.minTargetSize;
  const height = Math.floor(Math.random() * (level.maxTargetSize - level.minTargetSize + 1)) + level.minTargetSize;
  const x = Math.random() * (GAME_AREA_WIDTH - width);
  const y = Math.random() * (GAME_AREA_HEIGHT - height);

  return {
    id: `target-${Date.now()}-${Math.random()}`,
    x,
    y,
    width,
    height,
    isCovered: false,
  };
};

export const calculateCoverage = (
  selectionBox: { x: number; y: number; width: number; height: number },
  targetArea: TargetArea
): number => {
  const intersectionX1 = Math.max(selectionBox.x, targetArea.x);
  const intersectionY1 = Math.max(selectionBox.y, targetArea.y);
  const intersectionX2 = Math.min(selectionBox.x + selectionBox.width, targetArea.x + targetArea.width);
  const intersectionY2 = Math.min(selectionBox.y + selectionBox.height, targetArea.y + targetArea.height);

  const intersectionWidth = Math.max(0, intersectionX2 - intersectionX1);
  const intersectionHeight = Math.max(0, intersectionY2 - intersectionY1);

  const intersectionArea = intersectionWidth * intersectionHeight;
  const targetAreaSize = targetArea.width * targetArea.height;

  return targetAreaSize > 0 ? intersectionArea / targetAreaSize : 0;
};
