# MouseFun Development Guide

## 🎮 โปรเจ็กต์นี้คืออะไร
MouseFun เป็นเว็บไซต์เกมสำหรับเด็กที่เริ่มต้นเรียนรู้การใช้เมาส์ มีเกมหลากหลายเพื่อฝึกทักษะการคลิก การลาก และการเคลื่อนไหวเมาส์

## Build, Test, และ Lint Commands
- **Development**: `npm run dev` - เริ่ม development server
- **Build**: `npm run build` - สร้าง production build  
- **Preview**: `npm run preview` - ดู production build locally
- **Lint**: `npm run lint` - ตรวจสอบ ESLint rules
- **Type Check**: `npx tsc --noEmit` - ตรวจสอบ TypeScript errors

## เทคโนโลจีที่ใช้
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Build Tool**: Vite
- **Linting**: ESLint + TypeScript ESLint

## Critical Requirements สำหรับ MouseFun

### 🔒 Safety First (ความปลอดภัยสำหรับเด็ก)
- **ไม่มี external links ใดๆ** ที่นำเด็กออกจากเกม
- **ไม่เก็บข้อมูลส่วนตัว** ของเด็ก (COPPA compliant)
- **เนื้อหาต้องเหมาะสมสำหรับเด็ก 100%**
- **ไม่มี ads ที่ไม่เหมาะสม** หรือ clickbait

### 🎯 Kid-Friendly UI Requirements  
- **ปุ่มและเป้าหมายขนาดใหญ่** อย่างน้อย 60px สำหรับเด็กเล็ก
- **สีสันสดใสและ contrast ดี** เพื่อการมองเห็นที่ชัดเจน
- **ฟอนต์ใหญ่และอ่านง่าย** ไม่ใช้ฟอนต์ที่ซับซ้อน
- **Navigation ง่าย** ปุ่ม Back และ Home ชัดเจน
- **Immediate feedback** มี visual/audio response ทันทีเมื่อโต้ตอบ

### 📱 Device Compatibility
- **Primary**: Desktop + Mouse (เป้าหมายหลัก)
- **Secondary**: Tablet + Touch (iPad, Android tablets)
- **Testing**: ต้องทดสอบบน device จริง ไม่ใช่แค่ browser dev tools

### ⚡ Performance Requirements
- **Loading time < 3 วินาที** บน connection ปกติ
- **Animation ไม่ต่ำกว่า 30fps** (เป้าหมาย 60fps)
- **Bundle size < 500KB** (gzipped)
- **ไม่มี memory leaks** ในเกมที่เล่นยาวๆ

## Code Style Guidelines

### TypeScript & React
- **ใช้ TypeScript เสมอ** - หลีกเลี่ยง `any` types
- **Functional Components** - ใช้ React hooks แทน class components
- **Props Interface** - ทุก component ต้องมี interface สำหรับ props
- **Custom Hooks** - แยก logic ออกเป็น custom hooks เมื่อเหมาะสม
- **Error Boundaries** - ใช้ error boundaries สำหรับ game components

### Game Development Patterns
- **Game Component Structure**:
  ```typescript
  interface GameProps {
    onGameEnd: (score: number) => void;
    difficulty?: 'easy' | 'medium' | 'hard';
  }
  
  const GameComponent: React.FC<GameProps> = ({ onGameEnd, difficulty = 'easy' }) => {
    // Game logic here
  };
  ```

### Animation Guidelines
- **ใช้ Framer Motion** สำหรับ animations
- **Optimize สำหรับ mobile** - ใช้ `transform` แทน `top/left`
- **Smooth animations** - ใช้ easing functions ที่เหมาะสม
- **Performance first** - avoid animating expensive properties

### Naming Conventions
- **Files**: PascalCase สำหรับ components (`BubbleGame.tsx`)
- **Folders**: lowercase สำหรับ game folders (`src/games/bubble/`)
- **Components**: PascalCase (`BubbleGame`, `GameButton`)
- **Functions**: camelCase (`handleBubbleClick`, `startNewGame`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_BUBBLES`, `GAME_TIMER`)
- **Game Events**: descriptive names (`onBubblePopped`, `onStarCollected`)

## โครงสร้างโปรเจ็กต์

```
src/
├── components/          # Shared components
│   ├── ui/             # Basic UI components (Button, Modal)
│   ├── layout/         # Layout components (Header, Footer)
│   └── game/           # Game-related shared components
├── games/              # Individual game implementations
│   ├── bubble/         # Bubble catching game
│   ├── star/           # Star collection game
│   ├── target/         # Target shooting game
│   └── shared/         # Shared game utilities
├── store/              # Zustand stores
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
└── styles/             # Global styles and Tailwind configs
```

## Game Development Workflow

### การสร้างเกมใหม่
1. **สร้างโฟลเดอร์เกม**: `src/games/[game-name]/`
2. **สร้าง component**: `[GameName].tsx`
3. **สร้าง types**: `types.ts` สำหรับ game-specific types
4. **เพิ่มใน navigation**: อัปเดต game selection screen
5. **ทดสอบบน devices**: desktop และ tablet

### Game Component Template
```typescript
// src/games/newgame/NewGame.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface NewGameProps {
  onGameEnd: (score: number) => void;
  onExit: () => void;
}

const NewGame: React.FC<NewGameProps> = ({ onGameEnd, onExit }) => {
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(true);

  // Game logic here

  return (
    <div className="game-container min-h-screen bg-gradient-to-b from-blue-400 to-blue-600">
      {/* Game UI here */}
    </div>
  );
};

export default NewGame;
```

## Testing Guidelines

### Kid Testing Checklist
- [ ] **ปุ่มใหญ่พอ** - เด็กเล็กกดได้ง่าย
- [ ] **สีชัดเจน** - แยกแยะได้ง่าย
- [ ] **Feedback ชัดเจน** - รู้ทันทีว่าคลิกโดน
- [ ] **ไม่ frustrating** - เกมไม่ยากเกินไปสำหรับเด็ก
- [ ] **Easy restart** - เริ่มใหม่ได้ง่าย
- [ ] **Clear instructions** - เข้าใจได้โดยไม่ต้องอ่าน

### Performance Testing
```bash
# ทดสอบ performance
npm run build
npm run preview

# เปิด DevTools > Performance
# Record การเล่นเกม 30 วินาที
# ตรวจสอบ FPS และ memory usage
```

### Device Testing
```bash
# ทดสอบบน network devices
npm run dev -- --host

# เข้าจาก tablet/mobile: http://[YOUR_IP]:5173
# ทดสอบ touch interactions
```

## State Management (Zustand)

### Game Store Pattern
```typescript
// src/store/gameStore.ts
import { create } from 'zustand';

interface GameState {
  currentScore: number;
  highScore: number;
  gameActive: boolean;
  setScore: (score: number) => void;
  endGame: () => void;
}

const useGameStore = create<GameState>((set) => ({
  currentScore: 0,
  highScore: 0,
  gameActive: false,
  setScore: (score) => set({ currentScore: score }),
  endGame: () => set({ gameActive: false }),
}));
```

## Animation Best Practices

### Framer Motion สำหรับเกม
```typescript
// Good - Optimized animation
const bubbleVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { type: "spring", damping: 15 }
  },
  exit: { 
    scale: 1.2, 
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

// ใช้ในเกม
<motion.div
  variants={bubbleVariants}
  initial="hidden"
  animate="visible"
  exit="exit"
  className="bubble"
/>
```

## Accessibility for Kids

### WCAG Guidelines สำหรับเด็ก
- **Color Contrast**: อย่างน้อย 4.5:1 ratio
- **Font Size**: อย่างน้อย 18px สำหรับ body text
- **Touch Targets**: อย่างน้อย 44px x 44px
- **Focus Indicators**: ชัดเจนสำหรับ keyboard navigation
- **No Flashing**: หลีกเลี่ยง animation ที่กระพริบเร็ว

## Error Handling

### Game Error Boundaries
```typescript
// src/components/GameErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onError?: () => void;
}

class GameErrorBoundary extends Component<Props> {
  componentDidCatch(error: Error) {
    console.error('Game Error:', error);
    this.props.onError?.();
  }

  render() {
    // Friendly error message for kids
    return (
      <div className="error-screen">
        <h2>โอ๊ะโอ! เกมมีปัญหา</h2>
        <button onClick={() => window.location.reload()}>
          เริ่มใหม่
        </button>
      </div>
    );
  }
}
```

## Security & Privacy

### COPPA Compliance
- **ไม่เก็บ personal information** ของเด็กอายุต่ำกว่า 13 ปี
- **ไม่ใช้ cookies** สำหรับ tracking
- **ไม่มี third-party integrations** ที่อาจเก็บข้อมูล
- **Local storage เท่านั้น** สำหรับ high scores

### Content Safety
- **ไม่มี external links** ออกจากเว็บไซต์
- **ไม่มี user-generated content**
- **ไม่มี chat หรือ communication features**
- **เนื้อหาเหมาะสำหรับเด็กทุกอย่าง**

## Deployment Checklist

### ก่อน Deploy
- [ ] ทดสอบทุกเกมบน Chrome, Safari, Firefox
- [ ] ทดสอบบน iPad/Android tablet จริง
- [ ] ตรวจสอบ bundle size < 500KB
- [ ] Performance > 30fps ทุกเกม
- [ ] ไม่มี console errors
- [ ] Loading time < 3 วินาที
- [ ] ทดสอบกับเด็กจริง (ถ้าเป็นไปได้)

### Post-Deployment
- [ ] Monitor performance metrics
- [ ] ตรวจสอบ error logs
- [ ] รับ feedback จากผู้ปกครอง
- [ ] อัปเดต documentation

## Git Workflow สำหรับ MouseFun

### Branch Naming
- `feature/game-[name]` - เกมใหม่
- `feature/ui-[component]` - UI components
- `fix/game-[issue]` - แก้ไข bugs
- `perf/[optimization]` - performance improvements

### Commit Messages
- ใช้ conventional commits กับ emoji
- ตัวอย่าง: `✨ feat(games): add color matching game for toddlers`
- แต่ละ commit ต้องมีเกมที่ทำงานได้

## Performance Monitoring

### Key Metrics
- **First Contentful Paint**: < 2 วินาที
- **Time to Interactive**: < 3 วินาที  
- **FPS**: > 30fps (เป้าหมาย 60fps)
- **Bundle Size**: < 500KB gzipped
- **Memory Usage**: ไม่เพิ่มขึ้นเรื่อยๆ

---

**MouseFun เป็นโปรเจ็กต์ที่ออกแบยมาเพื่อเด็กโดยเฉพาะ ความปลอดภัยและประสบการณ์ที่ดีของเด็กคือสิ่งสำคัญที่สุด** 🎮👶✨
