import { Shape, Target } from './types';
import { GAME_AREA, SHAPE_COLORS } from './constants';

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const createShapesForLevel = (level: ShapeSortStarLevel): Shape[] => {
  const shapes: Shape[] = [];
  const shapeSize = 60;
  const availableWidth = GAME_AREA.width - shapeSize;
  const gap = availableWidth / (level.targetCount - 1);

  for (let i = 0; i < level.targetCount; i++) {
    const shapeType = level.shapes[Math.floor(Math.random() * level.shapes.length)];
    shapes.push({
      id: generateId(),
      type: shapeType,
      color: SHAPE_COLORS[shapeType],
      initialPosition: {
        x: i * gap,
        y: 20, // Start near the top
      },
      isSorted: false,
    });
  }
  return shapes;
};

export const createTargetsForLevel = (level: ShapeSortStarLevel): Target[] => {
  const targets: Target[] = [];
  const targetWidth = 100;
  const targetHeight = 100;
  const availableWidth = GAME_AREA.width - (level.shapes.length * targetWidth);
  const gap = availableWidth / (level.shapes.length + 1);

  level.shapes.forEach((shapeType, index) => {
    targets.push({
      id: generateId(),
      type: shapeType,
      position: {
        x: gap * (index + 1) + index * targetWidth,
        y: GAME_AREA.height - targetHeight - 20, // Position at the bottom
      },
      size: { width: targetWidth, height: targetHeight },
    });
  });

  return targets;
};

export const isOverTarget = (
  shapeRect: DOMRect,
  targetRect: DOMRect
): boolean => {
  return !(
    shapeRect.right < targetRect.left ||
    shapeRect.left > targetRect.right ||
    shapeRect.bottom < targetRect.top ||
    shapeRect.top > targetRect.bottom
  );
};
