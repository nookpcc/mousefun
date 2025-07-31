import { HouseRoom, HouseExplorerStarLevel } from './types';
import { ROOM_COLORS } from './constants';

export const initializeRooms = (level: HouseExplorerStarLevel): HouseRoom[] => {
  return level.rooms.map((roomTemplate) => ({
    ...roomTemplate,
    discovered: false,
    hovered: false,
    revealDelay: Math.random() * 500 + 500 // 0.5-1 second delay
  }));
};

export const isMouseOverRoom = (
  mousePos: { x: number; y: number },
  room: HouseRoom
): boolean => {
  return (
    mousePos.x >= room.position.x &&
    mousePos.x <= room.position.x + room.size.width &&
    mousePos.y >= room.position.y &&
    mousePos.y <= room.position.y + room.size.height
  );
};

export const getRoomColor = (roomIndex: number): string => {
  return ROOM_COLORS[roomIndex % ROOM_COLORS.length];
};

export const getRoomStyle = (room: HouseRoom, roomIndex: number) => {
  const baseColor = getRoomColor(roomIndex);
  
  if (room.discovered) {
    return {
      backgroundColor: baseColor,
      border: '3px solid #10b981',
      boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)',
      transform: 'scale(1.05)'
    };
  }
  
  if (room.hovered) {
    return {
      backgroundColor: baseColor,
      border: '3px solid #3b82f6',
      boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)',
      transform: 'scale(1.02)'
    };
  }
  
  return {
    backgroundColor: baseColor,
    border: '2px solid #d1d5db',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  };
};

export const calculateProgress = (discovered: number, total: number): number => {
  return Math.round((discovered / total) * 100);
};