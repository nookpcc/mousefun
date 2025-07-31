# Claude Command: Commit

สร้าง git commit ที่มีมาตรฐานสำหรับโปรเจ็กต์ MouseFun

## การใช้งาน
```
/commit
```

หรือกับ options:
```
/commit --amend
/commit --no-verify
```

## สิ่งที่คำสั่งนี้ทำ

1. **Pre-commit Checks**
   ```bash
   npm run lint          # ESLint check
   npm run build         # TypeScript และ build check
   ```

2. **ตรวจสอบ Git Status**
   ```bash
   git status
   git diff --staged     # ดูการเปลี่ยนแปลงที่จะ commit
   ```

3. **สร้าง Commit Message**
   - วิเคราะห์การเปลี่ยนแปลง
   - ใช้ Conventional Commits format
   - เพิ่ม emoji ที่เหมาะสม

## Commit Types สำหรับ MouseFun

### 🎮 Game Features
```bash
✨ feat(games): add new bubble catching game
🎯 feat(games): improve star collection mechanics
🎨 feat(ui): add colorful game selection screen
```

### 🐛 Bug Fixes
```bash
🐛 fix(games): prevent mouse events outside game area
🐛 fix(animation): fix star disappearing animation
🐛 fix(mobile): improve touch responsiveness on tablets
```

### 🎨 UI/UX Improvements
```bash
💄 style(ui): improve button hover animations
🎨 style(games): update color scheme for better contrast
📱 style(mobile): optimize layout for small screens
```

### ⚡ Performance
```bash
⚡️ perf(games): optimize bubble animation performance
⚡️ perf(bundle): reduce initial bundle size
🚀 perf(loading): implement lazy loading for games
```

### 🧱 Code Quality
```bash
♻️ refactor(components): extract reusable game components
🏗️ refactor(store): simplify Zustand state management
🔧 chore(deps): update Framer Motion to latest version
```

### 📚 Documentation
```bash
📝 docs(readme): update game descriptions
📝 docs(games): add JSDoc comments to game components
📸 docs(screenshots): add game preview images
```

### 🧪 Testing
```bash
✅ test(games): add unit tests for game logic
🧪 test(components): test game component interactions
```

## MouseFun Specific Examples

### เพิ่มเกมใหม่
```bash
git add src/games/ColorMatch/
git commit -m "✨ feat(games): add color matching game for toddlers

- New ColorMatch component with simple drag mechanics
- Bright colors and large targets for easy interaction
- Sound effects for successful matches
- Responsive design for tablets and desktop"
```

### แก้ไข Bug
```bash
git add src/games/BubbleGame/BubbleGame.tsx
git commit -m "🐛 fix(games): prevent bubbles from spawning outside screen

- Add boundary checks for bubble positioning
- Fix mobile viewport issues
- Improve touch detection accuracy"
```

### ปรับปรุง Performance
```bash
git add src/components/ vite.config.ts
git commit -m "⚡️ perf: optimize game animations and bundle size

- Use React.memo for game components
- Implement code splitting for individual games
- Optimize Framer Motion variants
- Reduce bundle size from 450KB to 320KB"
```

## การตรวจสอบก่อน Commit

### ✅ Checklist
- [ ] เกมทำงานได้ปกติ (ทดสอบในเบราว์เซอร์)
- [ ] ไม่มี TypeScript errors
- [ ] ไม่มี ESLint warnings
- [ ] Build สำเร็จ (`npm run build`)
- [ ] UI เป็นมิตรกับเด็ก (สี, ขนาด, ฟอนต์)
- [ ] ทำงานได้บน mobile/tablet
- [ ] ไม่มี console errors ในเบราว์เซอร์

### การทดสอบก่อน Commit
```bash
# ทดสอบ development build
npm run dev

# ทดสอบ production build
npm run build && npm run preview

# ตรวจสอบเกมแต่ละอัน:
# - คลิกทำงานได้ถูกต้อง
# - Animations smooth
# - สีสันและ UI เหมาะสำหรับเด็ก
# - ไม่มี error ใน console
```

## Options

### `--amend`
แก้ไข commit ล่าสุด
```bash
/commit --amend
```

### `--no-verify`
ข้าม pre-commit hooks (ใช้เฉพาะเมื่อจำเป็น)
```bash
/commit --no-verify
```

## Best Practices สำหรับ MouseFun

1. **แต่ละ commit มีเกมที่ทำงานได้** - ไม่ commit เกมที่เสีย
2. **ทดสอบใน mobile view** - เด็กอาจใช้ tablet
3. **ตรวจสอบ accessibility** - ใช้สีที่ชัดเจน ฟอนต์ใหญ่
4. **Performance matters** - เด็กใช้อุปกรณ์ที่อาจไม่เร็ว
5. **Safe for kids** - ไม่มี external links หรือ inappropriate content

## การแก้ไขปัญหา

### Commit Failed (Pre-commit Hooks)
```bash
# แก้ไข linting errors
npm run lint
npx eslint . --ext ts,tsx --fix

# แก้ไข TypeScript errors
npx tsc --noEmit
# แก้ไข errors แล้วลองใหม่

# ทดสอบ build
npm run build
```

### Large Commit (หลายเกมพร้อมกัน)
แนะนำให้แยกเป็นหลาย commits:
```bash
# Commit แต่ละเกมแยกกัน
git add src/games/BubbleGame/
git commit -m "✨ feat(games): add bubble catching game"

git add src/games/StarGame/
git commit -m "✨ feat(games): add star collection game"
```

คำสั่งนี้จะช่วยให้การ commit มีมาตรฐานและเหมาะสำหรับโปรเจ็กต์เกมเด็กอย่าง MouseFun ครับ!
