# 🚀 MouseFun - Deployment Guide

## 📋 การ Deploy บน Vercel

### ✅ ไฟล์ที่ได้เตรียมไว้:
- `package.json` - ย้าย vite ไป dependencies
- `vercel.json` - การตั้งค่า Vercel
- `vite.config.ts` - การตั้งค่า Vite
- `.gitignore` - ไฟล์ที่ไม่ต้อง commit

### 🔧 ขั้นตอนการ Deploy:

1. **Push โค้ดขึ้น GitHub**:
   ```bash
   git add .
   git commit -m "Fix deployment configuration"
   git push origin main
   ```

2. **ใน Vercel Dashboard**:
   - เลือก "New Project"
   - เชื่อมต่อกับ GitHub repository
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables** (ถ้าจำเป็น):
   ```
   NODE_VERSION=18
   ```

### 🛠️ หากยังมีปัญหา:

#### Option 1: ลองใช้ Node.js 18
ใน Vercel Settings > Environment Variables เพิ่ม:
- Key: `NODE_VERSION`
- Value: `18`

#### Option 2: แก้ไข Build Command
ใน Vercel Settings > Build & Development Settings:
- Build Command: `npm ci && npm run build`
- Output Directory: `dist`

#### Option 3: ใช้ npm ci แทน npm install
ใน `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci"
}
```

### 🌐 หลังจาก Deploy สำเร็จ:
- เว็บไซต์จะพร้อมใช้งานที่ URL ที่ Vercel ให้
- ทุกครั้งที่ push ไป GitHub จะ auto-deploy
- สามารถตั้งค่า custom domain ได้

### 🎮 โปรเจ็ค MouseFun พร้อม Deploy!
- ระบบเกม 5 ดาว
- เอฟเฟ็กต์สวยงาม
- เหมาะสำหรับเด็กๆ
- ไม่มีเวลาจำกัด

---
**Happy Deployment! 🚀✨**