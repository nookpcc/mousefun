import { GAME_BOUNDS } from '../../shared/constants';

export const HOUSE_ITEMS = [
  { name: 'เตียง', emoji: '🛏️' },
  { name: 'โซฟา', emoji: '🛋️' },
  { name: 'โต๊ะ', emoji: '🪑' },
  { name: 'เก้าอี้', emoji: '🪑' },
  { name: 'โทรทัศน์', emoji: '📺' },
  { name: 'ตู้เย็น', emoji: '❄️' },
  { name: 'เตาไฟ', emoji: '🔥' },
  { name: 'หม้อ', emoji: '🍳' },
  { name: 'แก้วน้ำ', emoji: '🥤' },
  { name: 'หนังสือ', emoji: '📚' },
  { name: 'โคมไฟ', emoji: '💡' },
  { name: 'นาฬิกา', emoji: '⏰' },
  { name: 'รูปภาพ', emoji: '🖼️' },
  { name: 'ต้นไม้', emoji: '🌱' },
  { name: 'ถังขยะ', emoji: '🗑️' },
  { name: 'ฟองน้ำ', emoji: '🧽' },
  { name: 'ผ้าเช็ดตัว', emoji: '🏠' },
  { name: 'รองเท้า', emoji: '👟' },
  { name: 'กระเป๋า', emoji: '👜' },
  { name: 'ของเล่น', emoji: '🧸' }
];

export const HOVER_CONFIG = {
  REQUIRED_HOVER_TIME: 1500, // ms
  HOVER_TOLERANCE: 5, // pixels
  DISCOVERY_ANIMATION_DURATION: 500
};

export const ITEM_CONFIG = {
  MIN_SIZE: 30,
  MAX_SIZE: 50,
  SPAWN_PADDING: 60,
  MIN_DISTANCE: 80 // minimum distance between items
};

export const GAME_AREA = {
  width: GAME_BOUNDS.WIDTH,
  height: GAME_BOUNDS.HEIGHT
};