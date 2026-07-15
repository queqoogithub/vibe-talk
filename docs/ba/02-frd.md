# 📐 FRD: Functional Requirements Document

| ฟิลด์ | รายละเอียด |
|---|---|
| **ชื่อโปรเจกต์** | Vibe Talk — แอปฝึกสนทนาภาษาอังกฤษด้วย AI |
| **เวอร์ชัน** | 1.0 |
| **วันที่จัดทำ** | 20 มกราคม 2568 |
| **ผู้จัดทำ** | ทีม Business Analyst |
| **สถานะ** | Approved ✅ |

---

## 1. ภาพรวมระบบ (System Overview)

Vibe Talk เป็น PWA แบบ Client-side ทั้งหมด (ไม่มีการรับ-ส่งข้อมูลไปยัง Backend Server ยกเว้นการเรียก DeepSeek API) ข้อมูลทั้งหมดเก็บใน IndexedDB บน Browser ของผู้ใช้

### 1.1 สถาปัตยกรรมระดับสูง

```
┌──────────────────────────────────────────────┐
│                PWA (Browser)                  │
│                                               │
│  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │  Chat    │  │Dashboard │  │ Vocabulary │  │
│  │  Module  │  │  Module  │  │   Module   │  │
│  └────┬─────┘  └────┬─────┘  └─────┬──────┘  │
│       │              │              │          │
│  ┌────┴──────────────┴──────────────┴──────┐  │
│  │            IndexedDB                     │  │
│  │  ┌──────────┐ ┌──────────┐ ┌─────────┐ │  │
│  │  │conversat-│ │errorDash-│ │userVocab│ │  │
│  │  │ions      │ │board     │ │         │ │  │
│  │  └──────────┘ └──────────┘ └─────────┘ │  │
│  └─────────────────────────────────────────┘  │
│       │                                        │
│       │ HTTPS                                  │
│       ▼                                        │
│  ┌─────────────────────┐                      │
│  │   DeepSeek API      │ (External)            │
│  │   api.deepseek.com  │                      │
│  └─────────────────────┘                      │
└──────────────────────────────────────────────┘
```

### 1.2 Technology Stack (Planned)

| ชั้น | เทคโนโลยี |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| AI Integration | DeepSeek API (ผ่าน OpenAI SDK) |
| Storage | IndexedDB (ผ่าน `idb` library) |
| PWA | `next-pwa` |

---

## 2. Functional Requirements

### FR-M01: Scenario-Based AI Chat

#### FR-M01-01: เลือกสถานการณ์สนทนา
- **คำอธิบาย**: ระบบต้องมีสถานการณ์สนทนาให้เลือกอย่างน้อย 8 สถานการณ์
- **สถานการณ์**:
  1. สั่งอาหาร (Ordering Food)
  2. สัมภาษณ์งาน (Job Interview)
  3. เช็คอินโรงแรม (Hotel Check-in)
  4. Small Talk
  5. ช้อปปิ้ง (Shopping)
  6. ถามทาง (Travel Directions)
  7. ไปหาหมอ (Doctor Visit)
  8. คุยอิสระ (Free Talk)
- **UI**: แสดงเป็นปุ่มเลือกสถานการณ์ พร้อม Emoji และชื่อภาษาไทย
- **Behavior**: เมื่อเลือกสถานการณ์ AI จะเปลี่ยน System Prompt ให้สวมบทบาทตามสถานการณ์นั้น

#### FR-M01-02: ส่งข้อความและรับการตอบกลับจาก AI
- **คำอธิบาย**: ผู้ใช้พิมพ์ข้อความภาษาอังกฤษและส่ง AI จะตอบกลับเป็นภาษาอังกฤษ
- **Input**: ข้อความภาษาอังกฤษผ่านกล่องข้อความ
- **Output**: ข้อความตอบกลับภาษาอังกฤษจาก AI พร้อมบทบาทสมมติ
- **Loading**: แสดงสถานะกำลังพิมพ์ (Typing Indicator) ระหว่างรอ AI ตอบ
- **Error**: แสดงข้อความแจ้งเตือนเมื่อ API Error (เช่น Network Error, Invalid API Key)

#### FR-M01-03: AI Conversation Flow
- **คำอธิบาย**: AI ต้องรักษาบริบทบทสนทนาต่อเนื่องภายในเซสชัน
- **Context**: ส่งประวัติข้อความย้อนหลังทั้งหมดในเซสชันให้ AI ทุกครั้ง
- **Token Management**: ระวังไม่ให้ประวัติยาวเกิน Token Limit ของ AI

---

### FR-M02: Grammar Correction

#### FR-M02-01: ตรวจจับและแก้ไขข้อผิดพลาด
- **คำอธิบาย**: AI ต้องวิเคราะห์ข้อความผู้ใช้และแจ้งข้อผิดพลาดด้านแกรมม่า
- **Error Types**:
  1. Tense (กาล)
  2. Preposition (คำบุพบท)
  3. Article (a/an/the)
  4. Word Order (ลำดับคำ)
  5. Word Choice (การเลือกคำ)
  6. S-V Agreement
  7. Plural (พหูพจน์)
  8. Spelling (การสะกด)
  9. Other (อื่นๆ)
- **Response Format**: AI ส่งผลลัพธ์ในรูปแบบ JSON array ภายใน `<correction>` tag
- **Display**: แสดงการ์ดแก้ไขแยกจากข้อความสนทนา พร้อม: ข้อความเดิม, ข้อความที่แก้ไข, ประเภทข้อผิดพลาด, คำอธิบายภาษาไทย

#### FR-M02-02: เมื่อไม่มีข้อผิดพลาด
- **คำอธิบาย**: หากข้อความผู้ใช้ไม่มีข้อผิดพลาด ให้แสดง empty array (`[]`)
- **Display**: ไม่ต้องแสดงการ์ดแก้ไขใดๆ

---

### FR-M03: Conversation Management

#### FR-M03-01: บันทึกประวัติบทสนทนา
- **คำอธิบาย**: ระบบต้องบันทึกทุกข้อความในบทสนทนาลง IndexedDB
- **ข้อมูลที่เก็บ**: ข้อความทั้งหมด, สถานการณ์, เวลาสร้าง, เวลาอัปเดตล่าสุด, Handoff Context
- **Trigger**: บันทึกอัตโนมัติหลังจากทุกข้อความ

#### FR-M03-02: รายการบทสนทนาย้อนหลัง
- **คำอธิบาย**: ผู้ใช้สามารถดูประวัติบทสนทนาทั้งหมด เรียงตามเวลาใช้งานล่าสุด
- **Display**: รายการแสดงชื่อสถานการณ์ + วันที่
- **Action**: 
  - แตะเพื่อเปิดบทสนทนาเดิมและสนทนาต่อได้
  - ปัด/แตะไอคอนเพื่อลบบทสนทนา

#### FR-M03-03: Handoff Context
- **คำอธิบาย**: เมื่อกลับมาสนทนาต่อในบทสนทนาเดิม ระบบต้องส่งสรุปบริบทให้ AI ทราบ
- **Implementation**: สรุปข้อความล่าสุด 6 ข้อความเป็น Handoff Context ส่งไปกับ System Prompt

#### FR-M03-04: เริ่มบทสนทนาใหม่
- **คำอธิบาย**: ผู้ใช้สามารถเริ่มบทสนทนาใหม่ได้ทุกเมื่อ
- **Action**: กลับไปหน้าเลือกสถานการณ์เพื่อเริ่มใหม่

---

### FR-M04: Error Dashboard

#### FR-M04-01: แสดงสถิติข้อผิดพลาด
- **คำอธิบาย**: แสดงสถิติรวมของข้อผิดพลาดทั้งหมดที่ AI ตรวจพบ
- **Metrics**:
  - จำนวนครั้งที่ฝึก (Total Conversations)
  - จำนวนข้อผิดพลาดทั้งหมด (Total Errors)
  - Breakdown แยกตามประเภทข้อผิดพลาด (Error Type Distribution)
- **Visualization**: Progress Bar เรียงลำดับจากมากไปน้อย, แสดงจำนวนและชื่อประเภท
- **Real-time Update**: อัปเดตอัตโนมัติหลังจบบทสนทนา

#### FR-M04-02: ตัวอย่างข้อผิดพลาด
- **คำอธิบาย**: ระบบเก็บตัวอย่างข้อผิดพลาดสูงสุด 10 ตัวอย่างต่อประเภท
- **Display**: แสดงใน Dashboard (Optional — อาจแสดงเมื่อคลิกดูรายละเอียด)

---

### FR-M05: Vocabulary Management

#### FR-M05-01: เพิ่มคำศัพท์ใหม่
- **คำอธิบาย**: ผู้ใช้สามารถเพิ่มคำศัพท์ภาษาอังกฤษลงในคลังส่วนตัว
- **Input Form**: คำศัพท์ (English word)
- **AI Auto-fill**: เมื่อพิมพ์คำศัพท์ ระบบเรียก AI ให้เติมข้อมูลอัตโนมัติ:
  - คำอ่าน (Phonetic — IPA)
  - ความหมายภาษาไทย
  - Part of Speech (n., v., adj., adv., prep., conj.)
  - หมวดหมู่ (13 หมวดหมู่)
  - ตัวอย่างประโยค 2-3 ประโยค
- **Manual Override**: ผู้ใช้แก้ไขข้อมูลที่ AI เติมให้ได้

#### FR-M05-02: ตรวจสอบคำซ้ำ (Duplicate Detection)
- **คำอธิบาย**: ก่อนบันทึก ระบบต้องตรวจสอบว่าคำนี้มีอยู่แล้วในคลังหรือไม่
- **Case-insensitive**: การตรวจสอบไม่สนใจตัวพิมพ์เล็ก/ใหญ่
- **Feedback**: แสดง Alert/Toast แจ้งผู้ใช้ว่าคำนี้มีอยู่แล้ว

#### FR-M05-03: ตรวจสอบการสะกด (Spell Check)
- **คำอธิบาย**: ตรวจสอบว่าคำที่ผู้ใช้พิมพ์สะกดถูกต้องหรือไม่
- **Method**: เรียก AI เพื่อตรวจสอบ
- **Result**:
  - ถ้าสะกดถูก: ดำเนินการต่อ
  - ถ้าสะกดผิด: เสนอคำแนะนำ (Suggestions) สูงสุด 3 คำ
- **User Action**: ผู้ใช้เลือกใช้คำแนะนำหรือยืนยันคำเดิม

#### FR-M05-04: จัดการคลังคำศัพท์
- **CRUD Operations**: เพิ่ม, ลบ, แก้ไขคำศัพท์
- **Display**: แสดงในรูปแบบ Flashcards (ทีละคำ) พร้อมปุ่มนำทางก่อนหน้า/ถัดไป
- **Flip Animation**: ซ่อน/แสดงความหมาย (Toggle Meaning)

#### FR-M05-05: กรองและค้นหาคำศัพท์
- **Filter by Category**: 13 หมวดหมู่ + "ทั้งหมด"
- **Filter by Mastery**: ทั้งหมด, ยังไม่รู้, รู้แล้ว
- **Search**: ค้นหาจากคำศัพท์หรือความหมายภาษาไทย (case-insensitive)

#### FR-M05-06: ติดตามสถานะ (Mastery Tracking)
- **Mark as Mastered**: ผู้ใช้ทำเครื่องหมายว่าจำคำศัพท์ได้แล้ว
- **Mark as Unmastered**: ย้อนสถานะกลับเป็นยังไม่รู้
- **Progress Bar**: แสดงสัดส่วนคำที่รู้แล้ว / ทั้งหมดในหมวดที่กำลังดู
- **Data**: เก็บใน IndexedDB (word, mastered, lastReviewed, reviewCount)

#### FR-M05-07: ฟังเสียงคำศัพท์ (Text-to-Speech)
- **Trigger**: กดปุ่ม Speaker Icon ข้างคำศัพท์
- **Method**: ใช้ Web Speech API (Browser built-in)
- **Language**: English (`en-US`)

#### FR-M05-08: หมวดหมู่คำศัพท์
- **จำนวนหมวด**: 13 หมวดหมู่
  1. ชีวิตประจำวัน (daily-life)
  2. อาหาร & เครื่องดื่ม (food-drink)
  3. ท่องเที่ยว (travel)
  4. งาน & ธุรกิจ (work-business)
  5. สุขภาพ (health)
  6. การศึกษา (education)
  7. เทคโนโลยี (technology)
  8. อารมณ์ & ความรู้สึก (emotions)
  9. ธรรมชาติ (nature)
  10. ช้อปปิ้ง (shopping)
  11. ผู้คน & ความสัมพันธ์ (people)
  12. เวลา (time)
  13. ทั่วไป (general)

---

### FR-M06: Settings

#### FR-M06-01: ตั้งค่า API Key
- **คำอธิบาย**: ผู้ใช้กรอก DeepSeek API Key เพื่อใช้งาน AI
- **Input**: Text field สำหรับ API Key (masked input)
- **Storage**: เก็บใน `localStorage` (Browser เท่านั้น)
- **Validation**: ตรวจสอบเบื้องต้นว่ามีการกรอกค่า
- **Instructions**: แสดงวิธีสมัคร API Key (ลิงก์ไป platform.deepseek.com)

---

### FR-M07: PWA Features

#### FR-M07-01: ติดตั้งลงหน้าจอมือถือ
- **คำอธิบาย**: รองรับการติดตั้งเป็น PWA บน iOS และ Android
- **Manifest**: กำหนด `manifest.json` พร้อมไอคอนและชื่อแอป
- **Install Prompt**: แสดงปุ่ม "เพิ่มลงหน้าจอหลัก" (Add to Home Screen)

#### FR-M07-02: Full Screen Mode (Standalone)
- **คำอธิบาย**: เมื่อติดตั้งแล้ว แอปทำงานแบบ Full Screen ไม่มี Address Bar
- **iOS**: รองรับ `apple-mobile-web-app-capable`

#### FR-M07-03: Safe Area
- **คำอธิบาย**: รองรับ Safe Area บน iPhone รุ่นมีรอยบาก (Notch) และ Dynamic Island
- **Implementation**: ใช้ CSS `env(safe-area-inset-*)`

---

## 3. Non-Functional Requirements

| ID | ประเภท | รายละเอียด |
|---|---|---|
| NFR-01 | **Performance** | ตอบสนองภายใน 2 วิ (AI Response อาจนานกว่านี้แต่ต้องมี Loading Indicator) |
| NFR-02 | **Performance** | First Contentful Paint (FCP) ≤ 1.5 วิ |
| NFR-03 | **Performance** | Time to Interactive (TTI) ≤ 3 วิ |
| NFR-04 | **Reliability** | IndexedDB ทำงาน Offline (อ่านประวัติได้แม้ไม่ต่อเน็ต) |
| NFR-05 | **Usability** | UI ต้องเป็นภาษาไทยทั้งหมด |
| NFR-06 | **Usability** | รองรับ Mobile-first Design (Responsive) |
| NFR-07 | **Security** | API Key เก็บใน localStorage เท่านั้น ไม่ส่งไป Server |
| NFR-08 | **Security** | ข้อมูลทั้งหมดอยู่ใน Browser ไม่มี Backend |
| NFR-09 | **Compatibility** | รองรับ iOS Safari 14+, Android Chrome 90+, Desktop Chrome/Firefox |
| NFR-10 | **Accessibility** | มี PWA Install Prompt, Touch-friendly UI |
| NFR-11 | **Storage** | จัดการ IndexedDB ให้มีประสิทธิภาพ (ไม่เกิน Browser Quota) |

---

## 4. เอกสารอ้างอิง

| เอกสาร | ลิงก์ |
|---|---|
| BRD (Business Requirements) | [01-brd.md](./01-brd.md) |
| User Stories | [03-user-stories.md](./03-user-stories.md) |
| Acceptance Criteria | [04-acceptance-criteria.md](./04-acceptance-criteria.md) |
| Use Case Specification | [05-use-case-spec.md](./05-use-case-spec.md) |
| Wireframe | [07-wireframe.md](./07-wireframe.md) |
