import { HouseExplorerStarLevel } from './types';

export const HOUSE_EXPLORER_STAR_LEVELS: HouseExplorerStarLevel[] = [
  {
    star: 1,
    target: 3,
    roomCount: 3,
    timeLimit: 0, // No time limit
    description: 'ชี้เมาส์ไปยังห้องต่างๆ 3 ห้อง',
    rooms: [
      {
        id: 'bedroom',
        name: 'ห้องนอน',
        emoji: '🛏️',
        position: { x: 100, y: 100 },
        size: { width: 120, height: 100 }
      },
      {
        id: 'kitchen',
        name: 'ห้องครัว',
        emoji: '🍳',
        position: { x: 300, y: 200 },
        size: { width: 120, height: 100 }
      },
      {
        id: 'bathroom',
        name: 'ห้องน้ำ',
        emoji: '🚿',
        position: { x: 500, y: 150 },
        size: { width: 100, height: 80 }
      }
    ]
  },
  {
    star: 2,
    target: 4,
    roomCount: 4,
    timeLimit: 0,
    description: 'สำรวจห้องต่างๆ 4 ห้อง',
    rooms: [
      {
        id: 'living',
        name: 'ห้องนั่งเล่น',
        emoji: '🛋️',
        position: { x: 80, y: 80 },
        size: { width: 140, height: 120 }
      },
      {
        id: 'kitchen',
        name: 'ห้องครัว',
        emoji: '🍳',
        position: { x: 280, y: 180 },
        size: { width: 120, height: 100 }
      },
      {
        id: 'bedroom',
        name: 'ห้องนอน',
        emoji: '🛏️',
        position: { x: 480, y: 100 },
        size: { width: 120, height: 100 }
      },
      {
        id: 'garden',
        name: 'สวน',
        emoji: '🌱',
        position: { x: 350, y: 300 },
        size: { width: 100, height: 80 }
      }
    ]
  },
  {
    star: 3,
    target: 5,
    roomCount: 5,
    timeLimit: 0,
    description: 'ค้นพบห้องทั้งหมด 5 ห้อง',
    rooms: [
      {
        id: 'living',
        name: 'ห้องนั่งเล่น',
        emoji: '🛋️',
        position: { x: 60, y: 80 },
        size: { width: 140, height: 120 }
      },
      {
        id: 'kitchen',
        name: 'ห้องครัว',
        emoji: '🍳',
        position: { x: 250, y: 160 },
        size: { width: 120, height: 100 }
      },
      {
        id: 'bedroom',
        name: 'ห้องนอน',
        emoji: '🛏️',
        position: { x: 450, y: 90 },
        size: { width: 120, height: 100 }
      },
      {
        id: 'bathroom',
        name: 'ห้องน้ำ',
        emoji: '🚿',
        position: { x: 500, y: 250 },
        size: { width: 100, height: 80 }
      },
      {
        id: 'garage',
        name: 'โรงรถ',
        emoji: '🚗',
        position: { x: 100, y: 280 },
        size: { width: 120, height: 90 }
      }
    ]
  },
  {
    star: 4,
    target: 6,
    roomCount: 6,
    timeLimit: 0,
    description: 'สำรวจทุกมุมของบ้าน 6 ห้อง',
    rooms: [
      {
        id: 'living',
        name: 'ห้องนั่งเล่น',
        emoji: '🛋️',
        position: { x: 50, y: 70 },
        size: { width: 130, height: 110 }
      },
      {
        id: 'kitchen',
        name: 'ห้องครัว',
        emoji: '🍳',
        position: { x: 220, y: 140 },
        size: { width: 110, height: 90 }
      },
      {
        id: 'bedroom',
        name: 'ห้องนอน',
        emoji: '🛏️',
        position: { x: 400, y: 80 },
        size: { width: 110, height: 90 }
      },
      {
        id: 'bathroom',
        name: 'ห้องน้ำ',
        emoji: '🚿',
        position: { x: 480, y: 220 },
        size: { width: 90, height: 70 }
      },
      {
        id: 'garage',
        name: 'โรงรถ',
        emoji: '🚗',
        position: { x: 80, y: 250 },
        size: { width: 110, height: 80 }
      },
      {
        id: 'study',
        name: 'ห้องอ่านหนังสือ',
        emoji: '📚',
        position: { x: 350, y: 280 },
        size: { width: 100, height: 80 }
      }
    ]
  },
  {
    star: 5,
    target: 7,
    roomCount: 7,
    timeLimit: 0,
    description: 'ผู้เชี่ยวชาญสำรวจบ้าน 7 ห้อง',
    rooms: [
      {
        id: 'living',
        name: 'ห้องนั่งเล่น',
        emoji: '🛋️',
        position: { x: 40, y: 60 },
        size: { width: 120, height: 100 }
      },
      {
        id: 'kitchen',
        name: 'ห้องครัว',
        emoji: '🍳',
        position: { x: 200, y: 120 },
        size: { width: 100, height: 80 }
      },
      {
        id: 'bedroom1',
        name: 'ห้องนอนใหญ่',
        emoji: '🛏️',
        position: { x: 380, y: 70 },
        size: { width: 100, height: 80 }
      },
      {
        id: 'bedroom2',
        name: 'ห้องนอนเล็ก',
        emoji: '🛌',
        position: { x: 520, y: 140 },
        size: { width: 80, height: 70 }
      },
      {
        id: 'bathroom',
        name: 'ห้องน้ำ',
        emoji: '🚿',
        position: { x: 460, y: 240 },
        size: { width: 80, height: 60 }
      },
      {
        id: 'garage',
        name: 'โรงรถ',
        emoji: '🚗',
        position: { x: 70, y: 240 },
        size: { width: 100, height: 70 }
      },
      {
        id: 'attic',
        name: 'ห้องใต้หลังคา',
        emoji: '📦',
        position: { x: 300, y: 280 },
        size: { width: 90, height: 70 }
      }
    ]
  }
];

export const ROOM_COLORS = [
  '#fef3c7', // Light yellow
  '#ddd6fe', // Light purple  
  '#fce7f3', // Light pink
  '#d1fae5', // Light green
  '#dbeafe', // Light blue
  '#fed7d7', // Light red
  '#f0fff4'  // Light mint
];

export const HOVER_DISTANCE = 0; // No distance needed, just hover
export const DISCOVERY_DELAY = 1000; // 1 second hover to discover