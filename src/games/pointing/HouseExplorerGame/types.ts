import { GameEntity } from '../../shared/types';

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

export const HOUSE_EXPLORER_STAR_LEVELS = [
  {
    star: 1,
    target: 3,
    description: 'ค้นหา 3 สิ่งของในบ้าน'
  },
  {
    star: 2,
    target: 5,
    description: 'ค้นหา 5 สิ่งของในบ้าน'
  },
  {
    star: 3,
    target: 8,
    description: 'ค้นหา 8 สิ่งของในบ้าน'
  },
  {
    star: 4,
    target: 12,
    description: 'ค้นหา 12 สิ่งของในบ้าน'
  },
  {
    star: 5,
    target: 15,
    description: 'ค้นหา 15 สิ่งของในบ้าน'
  }
];