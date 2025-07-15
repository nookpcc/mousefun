import { Shape, Target, ShapeType } from './types';
import { GamePosition } from '../../shared/types';

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

const SHAPE_COLORS: Record<ShapeType, string> = {
  circle: '#ff6b6b',
  square: '#4ecdc4',
  triangle: '#45b7d1',
  star: '#feca57'
};

export const createShape = (type: ShapeType, bounds: any): Shape => {
  return {
    id: generateId(),
    type,
    color: SHAPE_COLORS[type],
    position: {
      x: Math.random() * (bounds.width - 60),
      y: Math.random() * (bounds.height - 60)
    },
    size: 60,
    isDragging: false,
    isPlaced: false
  };
};

export const createTargets = (shapeTypes: ShapeType[], bounds: any): Target[] => {
  return shapeTypes.map((shapeType: ShapeType, index: number) => {
    const targetSize = 80;
    const spacing = bounds.width / (shapeTypes.length + 1);
    
    return {
      id: generateId(),
      type: shapeType,
      position: {
        x: spacing * (index + 1) - targetSize / 2,
        y: bounds.height - targetSize - 20
      },
      size: targetSize,
      isOccupied: false
    };
  });
};

export const isOverTarget = (
  shapePosition: GamePosition,
  targetPosition: GamePosition,
  tolerance: number = 40
): boolean => {
  const distance = Math.sqrt(
    Math.pow(shapePosition.x - targetPosition.x, 2) + 
    Math.pow(shapePosition.y - targetPosition.y, 2)
  );
  return distance < tolerance;
};
