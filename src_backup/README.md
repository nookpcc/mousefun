# MouseFun 🖱️

เกมฝึกทักษะเมาส์สำหรับเด็ก - สนุก ง่าย และปลอดภัย

## 🎮 เกี่ยวกับโปรเจค

MouseFun เป็นเว็บไซต์เกมสำหรับเด็กที่เริ่มต้นเรียนรู้การใช้เมาส์ โดยมีเกมที่หลากหลายเพื่อฝึกทักษะต่างๆ เช่น การเคลื่อนไหวเมาส์ การคลิก และการลาก

## ✨ Features

- 🎯 **9+ เกมที่หลากหลาย** - จับฟองสบู่, เก็บดวงดาว, เป้าหมายแสนสนุก และอื่นๆ
- 🎨 **UI ที่เป็นมิตรกับเด็ก** - สีสันสดใส ฟอนต์อ่านง่าย
- 📱 **Responsive Design** - เล่นได้ทั้งคอมพิวเตอร์และแท็บเล็ต
- ⚡ **โหลดเร็ว** - ใช้ Vite และ optimization ต่างๆ
- 🛡️ **ปลอดภัย** - ไม่มีการเก็บข้อมูลเด็ก COPPA compliant
- 💰 **พื้นที่โฆษณา** - สร้างรายได้ผ่านโฆษณา

## 🚀 เทคโนโลยี

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **State Management**: Zustand
- **Fonts**: Google Fonts (Fredoka One + Nunito)

## 📦 การติดตั้ง

```bash
# ติดตั้ง dependencies
npm install

# รัน development server
npm run dev

# Build สำหรับ production
npm run build

# Preview production build
npm run preview
```

## 🎯 เกมที่มี

### 🫧 จับฟองสบู่ (Bubble Pop)
- **ระดับ**: ง่าย
- **ทักษะ**: การคลิก
- **จุดประสงค์**: คลิกฟองสบู่ให้ได้มากที่สุดใน 30 วินาที

### ⭐ เก็บดวงดาว (Mouse Trail)
- **ระดับ**: ง่าย  
- **ทักษะ**: การเคลื่อนไหวเมาส์
- **จุดประสงค์**: เลื่อนเมาส์ไปเก็บดวงดาวทุกดวง

### 🎯 เป้าหมายแสนสนุก (Click Target)
- **ระดับ**: ปานกลาง
- **ทักษะ**: ความแม่นยำในการคลิก
- **จุดประสงค์**: คลิกเป้าหมายให้แม่นยำ

## 📁 โครงสร้างโปรเจค

```
src/
├── components/          # React components
│   ├── Header.tsx
│   ├── GameCard.tsx
│   ├── GameModal.tsx
│   ├── AdSpace.tsx
│   └── Footer.tsx
├── games/              # เกมต่างๆ
│   ├── BubblePopGame.tsx
│   ├── MouseTrailGame.tsx
│   └── ClickTargetGame.tsx
├── store/              # State management
│   └── gameStore.ts
├── types/              # TypeScript types
│   └── index.ts
├── utils/              # Utilities
│   └── gameData.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 🎨 Design System

### Colors
- **Primary**: เขียว (#22c55e)
- **Secondary**: ฟ้า (#0ea5e9)  
- **Accent**: เหลือง (#f59e0b)

### Typography
- **Headings**: Fredoka One (สนุกสนาน)
- **Body**: Nunito (อ่านง่าย)

## 🚀 การ Deploy

เว็บไซต์นี้สามารถ deploy ได้ง่ายบน:
- **Vercel** (แนะนำ)
- **Netlify** 
- **GitHub Pages**
- **Firebase Hosting**

```bash
# Build
npm run build

# Upload โฟลเดอร์ dist
```

## 🔮 แผนการพัฒนาต่อ

- [ ] เพิ่มเกมใหม่ (เขาวงกต, จับคู่สี, จิ๊กซอว์)
- [ ] ระบบ achievements และ badges
- [ ] Progressive Web App (PWA)
- [ ] ระบบ parent dashboard
- [ ] Multi-language support
- [ ] Sound effects
- [ ] การบันทึกสถิติ (local storage)

## 👨‍🏫 สำหรับครู

เกมเหล่านี้เหมาะสำหรับ:
- เด็กอายุ 3-8 ปี
- การเรียนรู้เทคโนโลジี
- พัฒนาสมาธิและการประสานงานมือกับตา
- ชั้นเรียนคอมพิวเตอร์

## 📄 License

MIT License - ใช้งานและแก้ไขได้อย่างอิสระ

## 🤝 การสนับสนุน

หากมีปัญหาหรือข้อเสนอแนะ สามารถสร้าง Issue หรือ Pull Request ได้เลย!

---

Made with ❤️ สำหรับเด็กๆ ทุกคน 🧒👧
