import { GameEntity, StarLevel } from '../../shared/types';

export interface HouseItem extends GameEntity {
  type: 'item';
  name: string;
  emoji: string;
  discovered: boolean;
  hoverTime: number;
  requiredHoverTime: number;
}

export interface HouseExplorerGameState {
  items: HouseItem[];
  nextItemId: number;
  currentHoveredItem: string | null;
  hoverStartTime: number;
}

export const HOUSE_EXPLORER_STAR_LEVELS: StarLevel[] = [
  {
    star: 1,
    target: 3,
    timeLimit: 60,
    description: 'ค้นหา 3 สิ่งของในบ้าน ใน 60 วินาที'
  },
  {
    star: 2,
    target: 5,
    timeLimit: 75,
    description: 'ค้นหา 5 สิ่งของในบ้าน ใน 75 วินาที'
  },
  {
    star: 3,
    target: 8,
    timeLimit: 90,
    description: 'ค้นหา 8 สิ่งของในบ้าน ใน 90 วินาที'
  },
  {
    star: 4,
    target: 12,
    timeLimit: 105,
    description: 'ค้นหา 12 สิ่งของในบ้าน ใน 105 วินาที'
  },
  {
    star: 5,
    target: 15,
    timeLimit: 120,
    description: 'ค้นหา 15 สิ่งของในบ้าน ใน 120 วินาที'
  }
];