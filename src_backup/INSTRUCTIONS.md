# MouseFun - วิธีการรันโปรเจค 🚀

## 📋 ขั้นตอนการเริ่มต้น

### 1. ติดตั้ง Node.js
ดาวน์โหลด Node.js เวอร์ชัน 18+ จาก https://nodejs.org

### 2. เปิด Terminal/Command Prompt
```bash
cd C:\Users\Snooker\Desktop\Projects\mousefun
```

### 3. ติดตั้ง Dependencies
```bash
npm install
```

### 4. รัน Development Server
```bash
npm run dev
```

เว็บไซต์จะเปิดที่ http://localhost:3000

## 🛠️ คำสั่งที่สำคัญ

```bash
# รัน development (โหลดเร็ว, hot reload)
npm run dev

# Build สำหรับ production
npm run build

# Preview production build
npm run preview

# ตรวจสอบ code quality
npm run lint
```

## 🎮 การทดสอบเกม

1. เปิดเว็บใน browser
2. คลิกที่เกมใดก็ได้
3. ทดสอบ:
   - **จับฟองสบู่**: คลิกฟองสบู่
   - **เก็บดวงดาว**: เลื่อนเมาส์ไปที่ดาว
   - **เป้าหมายแสนสนุก**: คลิกเป้าหมาย

## 🚀 การ Deploy

### Vercel (แนะนำ)
1. สร้างบัญชี https://vercel.com
2. Connect กับ GitHub repository
3. Deploy อัตโนมัติ

### Netlify
1. Run `npm run build`
2. Upload โฟลเดอร์ `dist` ไปที่ Netlify

## 🔧 ปัญหาที่อาจพบ

### Port ถูกใช้แล้ว
```bash
# เปลี่ยน port
npm run dev -- --port 3001
```

### Dependencies ไม่ครบ
```bash
# ลบ node_modules และติดตั้งใหม่
rm -rf node_modules
npm install
```

### Build error
```bash
# ตรวจสอบ TypeScript errors
npx tsc --noEmit
```

## 📱 การทดสอบบนมือถือ

1. ใน Terminal ดู Local Network Address
2. เปิด browser บนมือถือ
3. ไปที่ IP address ที่แสดง (เช่น 192.168.1.100:3000)

## 🎯 Performance Tips

- ใช้ `npm run build` เมื่อต้องการความเร็วสูงสุด
- ทดสอบบน Chrome DevTools (F12 > Mobile view)
- ตรวจสอบ Network tab สำหรับ loading time

## 🆘 ขอความช่วยเหลือ

หากมีปัญหา:
1. ตรวจสอบ Console errors (F12)
2. ดู README.md สำหรับข้อมูลเพิ่มเติม
3. ลอง `npm install` ใหม่

---

🎉 ขอให้สนุกกับการพัฒนา MouseFun! 🖱️
