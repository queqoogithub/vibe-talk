# Vibe Talk 🎙️

แอปฝึกสนทนาภาษาอังกฤษกับ AI Agent ในสถานการณ์จำลอง พร้อมตรวจแกรมม่า จัดการคลังคำศัพท์ และติดตามพัฒนาการ

![Next.js](https://img.shields.io/badge/Next.js-15+-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
![PWA](https://img.shields.io/badge/PWA-ready-5a0fc8?logo=pwa)

---

## ✨ Features

### 💬 AI Chat
- สนทนากับ AI ผ่าน **DeepSeek API** ใน 8 สถานการณ์จำลอง:
  - สั่งอาหาร · สัมภาษณ์งาน · เช็คอินโรงแรม · Small Talk
  - ช้อปปิ้ง · ถามทาง · ไปหาหมอ · คุยอิสระ
- ตรวจจับและแก้ไขแกรมม่าแบบ real-time พร้อมคำอธิบายภาษาไทย
- รองรับ context ต่อเนื่องจากบทสนทนาก่อนหน้า

### 📊 Error Dashboard
- สถิติข้อผิดพลาดแยกตามประเภท (Tense, Preposition, Article, ฯลฯ)
- ตัวอย่างประโยคที่ผิด/ถูก

### 📚 Vocabulary (คลังคำศัพท์)
- บันทึกคำศัพท์พร้อมความหมาย, คำอ่าน, Part of Speech, หมวดหมู่, ตัวอย่างประโยค
- ✨ **AI Auto-fill** — ใส่แค่คำศัพท์ AI เติมที่เหลือให้อัตโนมัติ
- 🔍 **ค้นหา** ค้นหาจากคำศัพท์หรือความหมาย
- ✅ **Spell Check** — ตรวจสอบการสะกดก่อนบันทึก พร้อมแนะนำคำที่ถูกต้อง
- 🚫 **Duplicate Detection** — แจ้งเตือนเมื่อเพิ่มคำซ้ำ
- 📂 จัดหมวดหมู่ + กรองตามสถานะ (รู้แล้ว/ยังไม่รู้)
- 🔊 ฟังเสียงอ่าน (Text-to-Speech)

### 📱 PWA
- ติดตั้งลงหน้าจอมือถือได้ ใช้งานแบบ standalone
- รองรับ Safe Area บน iPhone รุ่นมีรอยบาก

---

## 🛠 Tech Stack

| ด้าน | เทคโนโลยี |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS (โทนกาแฟพาสเทล) |
| AI | DeepSeek API (OpenAI SDK) |
| Storage | IndexedDB (via `idb`) |
| PWA | `next-pwa` |
| Icons | Lucide React |

---

## 🚀 Getting Started

```bash
# ติดตั้ง dependencies
npm install

# รัน development server
npm run dev

# build สำหรับ production
npm run build
```

### การตั้งค่า API Key

1. เปิดแอป → ไปที่หน้า **Settings**
2. ใส่ DeepSeek API Key
3. API Key จะถูกเก็บใน `localStorage` (ฝั่ง browser เท่านั้น)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Chat หน้าแรก
│   ├── dashboard/page.tsx    # Error Dashboard
│   ├── vocabulary/page.tsx   # คลังคำศัพท์
│   ├── settings/page.tsx     # ตั้งค่า API Key
│   ├── layout.tsx            # Root Layout
│   ├── manifest.ts           # PWA Manifest
│   └── globals.css           # Global styles + animations
├── components/
│   ├── ChatBubble.tsx        # ฟองแชท
│   ├── ChatInput.tsx         # ช่องพิมพ์ข้อความ
│   ├── ConversationList.tsx  # รายการบทสนทนา
│   ├── VocabularyCard.tsx    # การ์ดคำศัพท์
│   ├── AddWordModal.tsx      # Modal เพิ่ม/แก้ไขคำศัพท์
│   ├── BottomNav.tsx         # แถบนำทางด้านล่าง
│   ├── PhoneFrame.tsx        # กรอบโทรศัพท์ (Desktop)
│   ├── ScenarioSelector.tsx  # เลือกสถานการณ์
│   ├── CorrectionCard.tsx    # แสดงคำแก้ไขแกรมม่า
│   ├── ErrorDashboard.tsx    # แสดงสถิติข้อผิดพลาด
│   └── SettingsPanel.tsx     # ตั้งค่า
├── hooks/
│   └── useVocabulary.ts      # จัดการคลังคำศัพท์
└── lib/
    ├── deepseek.ts           # DeepSeek API client
    ├── db.ts                 # IndexedDB operations
    ├── types.ts              # TypeScript types
    └── oxford3000.ts         # ข้อมูล Oxford 3000 (อ้างอิง)
```

---

## 📄 License

MIT
