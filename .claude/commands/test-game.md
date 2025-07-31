# Claude Command: Test Game

ทดสอบเกมใน MouseFun เพื่อให้แน่ใจว่าทำงานได้ถูกต้องและเหมาะสมสำหรับเด็ก

## การใช้งาน
```
/test-game
```

หรือทดสอบเกมเฉพาะ:
```
/test-game BubbleGame
/test-game StarGame
/test-game ColorMatch
```

## สิ่งที่คำสั่งนี้ทำ

1. **เริ่มต้น Development Server**
   ```bash
   npm run dev
   ```

2. **ทดสอบแต่ละเกม**
   - เปิดเกมแต่ละอัน
   - ทดสอบการโต้ตอบ
   - ตรวจสอบ animations
   - ตรวจสอบ responsive design

3. **ตรวจสอบ Kid-Friendly Features**
   - ขนาดปุ่มเหมาะสำหรับเด็ก (min 44px)
   - สีสันชัดเจนและสดใส
   - ไม่มี content ที่ไม่เหมาะสม
   - Easy exit/back navigation

## การทดสอบแต่ละเกม

### 🫧 Bubble Game Testing
```javascript
// ตรวจสอบ:
- ฟองลอยมาจากด้านล่าง ✓
- คลิกฟองแล้วแตก ✓
- Score เพิ่มขึ้นถูกต้อง ✓
- Animation smooth (60fps) ✓
- Mobile touch responsive ✓
- ฟองไม่ทะลุขอบจอ ✓
```

### ⭐ Star Game Testing
```javascript
// ตรวจสอบ:
- ดวงดาววิ่งแบบสุ่ม ✓
- เก็บดาวได้ด้วยการคลิก ✓
- Star effects สวยงาม ✓
- Difficulty เพิ่มขึ้นตามเวลา ✓
- Timer ทำงานถูกต้อง ✓
- Final score แสดงผล ✓
```

### 🎯 Target Game Testing
```javascript
// ตรวจสอบ:
- เป้าปรากฏตำแหน่งสุ่ม ✓
- เป้าขยายใหญ่พอสำหรับเด็ก ✓
- Hit detection แม่นยำ ✓
- Visual feedback เมื่อโดน ✓
- Sound effects (ถ้ามี) ✓
```

## Kid-Friendly Checklist

### 👶 Usability for Kids
- [ ] **Big Targets**: ปุ่มและเป้าหมายใหญ่พอ (min 60px สำหรับเด็กเล็ก)
- [ ] **Bright Colors**: สีสดใสและ contrast ดี
- [ ] **Simple Navigation**: ปุ่ม Back ชัดเจน ง่ายต่อการใช้
- [ ] **No Small Text**: ฟอนต์ใหญ่ อ่านง่าย
- [ ] **Forgiving UI**: คลิกผิดที่ไม่ทำให้เกมหยุด

### 📱 Device Compatibility
- [ ] **Desktop**: ทำงานได้ด้วย mouse
- [ ] **Tablet**: รองรับ touch screen
- [ ] **Mobile**: ใช้งานได้บนมือถือ (แม้ไม่ใช่ primary target)
- [ ] **Different Screen Sizes**: responsive ทุกขนาด

### 🎮 Game Mechanics
- [ ] **Clear Objectives**: เด็กเข้าใจได้ง่ายว่าต้องทำอะไร
- [ ] **Immediate Feedback**: มี visual/audio feedback ทันที
- [ ] **No Game Over**: เกมไม่จบกะทันหัน frustrating
- [ ] **Restart Easy**: เริ่มใหม่ได้ง่าย

### 🛡️ Safety Features
- [ ] **No External Links**: ไม่มีลิงก์ออกจากเกม
- [ ] **No Data Collection**: ไม่เก็บข้อมูลเด็ก
- [ ] **COPPA Compliant**: ปฏิบัติตามกฎหมายคุ้มครองเด็ก
- [ ] **Parent-Friendly**: ผู้ปกครองมั่นใจให้เด็กเล่น

## Performance Testing

### 🚀 Loading Speed
```bash
# ตรวจสอบ bundle size
npm run build
du -sh dist/

# ควรได้:
# - Initial load < 2 seconds
# - Bundle size < 500KB
# - Game assets < 1MB total
```

### ⚡ Runtime Performance
```javascript
// เปิด Dev Tools > Performance
// ตรวจสอบ:
- FPS ไม่ต่ำกว่า 30fps (เป้าหมาย 60fps)
- Memory usage ไม่เพิ่มขึ้นเรื่อยๆ (memory leaks)
- Animation ไม่กระตุก
- Touch/click response < 100ms
```

## Automated Testing Commands

### บน Desktop
```bash
# เริ่ม dev server
npm run dev

# เปิดเบราว์เซอร์ไปที่ localhost:5173
# ทดสอบแต่ละเกม:
# 1. กด F12 เปิด DevTools
# 2. ไปที่ Performance tab
# 3. Record การเล่นเกม 30 วินาที
# 4. ตรวจสอบ FPS และ memory usage
```

### บน Mobile (Device Testing)
```bash
# หา IP address ของเครื่อง
ipconfig  # Windows
ifconfig  # Mac/Linux

# เปิด dev server ให้เข้าถึงได้จากเครื่องอื่น
npm run dev -- --host

# เข้าจาก mobile browser: http://[YOUR_IP]:5173
# ทดสอบ touch interactions
```

## Bug Report Template

เมื่อพบปัญหา ให้บันทึกดังนี้:

```markdown
## 🐛 Bug Report: [Game Name]

### Device & Browser
- Device: [Desktop/Tablet/Mobile]
- Browser: [Chrome/Safari/Firefox]
- Screen Size: [1920x1080/iPad/iPhone]

### Steps to Reproduce
1. เปิดเกม [Game Name]
2. [Action ที่ทำ]
3. [ผลลัพธ์ที่เกิดขึ้น]

### Expected vs Actual
- Expected: [ควรเป็นอย่างไร]
- Actual: [เกิดอะไรขึ้นจริง]

### Screenshots/Videos
[แนบภาพหรือวิดีโอถ้ามี]

### Console Errors
[แนบ error messages จาค console]
```

## Final Checklist ก่อน Deploy

- [ ] ทุกเกมทำงานได้บน Chrome, Safari, Firefox
- [ ] ทดสอบบน tablet จริง (iPad หรือ Android tablet)
- [ ] Performance ดี (>30fps ทุกเกม)
- [ ] ไม่มี console errors
- [ ] UI เป็นมิตรกับเด็ก
- [ ] Loading time < 3 วินาที
- [ ] Responsive design ทำงานถูกต้อง

หลังจากผ่านทุกการทดสอบแล้ว เกมพร้อม deploy และปลอดภัยสำหรับเด็กแล้วครับ! 🎮✨
