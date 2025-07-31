# Claude Command: Context Prime

โหลดข้อมูลและบริบทโปรเจ็กต์ MouseFun ให้ Claude เข้าใจ

## การใช้งาน
```
/context-prime
```

## สิ่งที่คำสั่งนี้ทำ

1. **อ่าน README.md** - เข้าใจภาพรวมโปรเจ็กต์
2. **ตรวจสอบ package.json** - ดู dependencies และ scripts
3. **ดูโครงสร้างโปรเจ็กต์** - เข้าใจการจัดระเบียบไฟล์
4. **โหลดไฟล์สำคัญ** - เช่น tsconfig.json, vite.config.ts
5. **ดูตัวอย่างเกม** - เข้าใจ game components

## ขั้นตอนการทำงาน

```bash
# 1. อ่านไฟล์หลัก
cat README.md
cat package.json

# 2. ดูโครงสร้างโปรเจ็กต์
find src -type f -name "*.tsx" -o -name "*.ts" | head -20

# 3. เข้าใจ game components
ls src/games/
ls src/components/

# 4. ตรวจสอบการตั้งค่า
cat tsconfig.json
cat vite.config.ts
cat tailwind.config.js
```

## บริบทโปรเจ็กต์ MouseFun

### เกี่ยวกับโปรเจ็กต์
- **ชื่อ**: MouseFun - เกมฝึกทักษะเมาส์สำหรับเด็ก
- **เป้าหมาย**: สร้างเกมที่ปลอดภัยและสนุกสำหรับเด็ก
- **เทคโนโลยี**: React 18 + TypeScript + Tailwind CSS + Framer Motion

### โครงสร้างเกม
- **หน้าหลัก**: เลือกเกมและนำทาง
- **เกมต่างๆ**: จับฟอง, เก็บดาว, เป้าหมาย ฯลฯ
- **UI**: เป็นมิตรกับเด็ก สีสันสดใส
- **การเก็บคะแนน**: ไม่เก็บข้อมูลส่วนตัว

### การพัฒนา
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Type Safety**: TypeScript

หลังจากรันคำสั่งนี้ Claude จะเข้าใจโปรเจ็กต์และพร้อมช่วยพัฒนาเกมต่อไป!