# 📖 Use Case Specification

| ฟิลด์ | รายละเอียด |
|---|---|
| **ชื่อโปรเจกต์** | Vibe Talk — แอปฝึกสนทนาภาษาอังกฤษด้วย AI |
| **เวอร์ชัน** | 1.0 |
| **วันที่จัดทำ** | 1 กุมภาพันธ์ 2568 |
| **ผู้จัดทำ** | ทีม Business Analyst |

---

## Use Case Diagram

ดู UML Use Case Diagram ได้ที่ [08-uml.md#use-case-diagram](./08-uml.md#1-use-case-diagram)

---

## UC-01: Practice Conversation (ฝึกสนทนา)

| ฟิลด์ | รายละเอียด |
|---|---|
| **Use Case ID** | UC-01 |
| **Use Case Name** | ฝึกสนทนาภาษาอังกฤษกับ AI |
| **Actor** | ผู้ใช้ (User) |
| **Precondition** | - API Key ถูกตั้งค่าแล้วใน Settings<br>- มีการเชื่อมต่ออินเทอร์เน็ต |
| **Postcondition** | - บทสนทนาถูกบันทึกลง IndexedDB<br>- ข้อผิดพลาดด้านแกรมม่าถูกบันทึกใน Dashboard |
| **Priority** | 🔴 High |
| **Trigger** | ผู้ใช้กดเลือกสถานการณ์ หรือพิมพ์ข้อความและส่ง |

### Basic Flow

| Step | Actor | System |
|---|---|---|
| 1 | ผู้ใช้เปิดแอป | ระบบแสดงหน้าหลัก (Chat) พร้อมรายการสถานการณ์ 8 แบบ |
| 2 | ผู้ใช้เลือกสถานการณ์ เช่น "สั่งอาหาร" | ระบบโหลด System Prompt สำหรับสถานการณ์นั้น และสร้าง Conversation Session ใหม่ |
| 3 | — | AI (DeepSeek) ส่งข้อความทักทายแรกในบทบาทพนักงานเสิร์ฟ |
| 4 | ผู้ใช้พิมพ์ข้อความภาษาอังกฤษ เช่น "I want to order pizza" | ระบบแสดงข้อความในฟองแชทฝั่ง User |
| 5 | — | ระบบส่งข้อความทั้งหมด + System Prompt ไปยัง DeepSeek API |
| 6 | — | AI ตอบกลับเป็นภาษาอังกฤษในบทบาทพนักงานเสิร์ฟ |
| 7 | — | ระบบ Parse ข้อความตอบกลับ: แยกเนื้อหาสนทนากับ `<correction>` tag |
| 8 | — | ระบบแสดงการ์ด Grammar Correction (ถ้ามี) |
| 9 | — | ระบบบันทึกข้อความลง IndexedDB + อัปเดต Error Dashboard |
| 10 | กลับไป Step 4 | — |

### Alternative Flows

#### AF-01a: ไม่มี API Key

| Step | Actor | System |
|---|---|---|
| 2a | — | ระบบตรวจสอบ API Key → ไม่พบ |
| 2b | — | ระบบแสดงข้อความ "กรุณาตั้งค่า API Key ในหน้า Settings" |
| 2c | — | กลับไป Step 1 |

#### AF-01b: Network Error

| Step | Actor | System |
|---|---|---|
| 5a | — | เรียก API ไม่สำเร็จ (Network Error) |
| 5b | — | ระบบแสดงข้อความ "ไม่สามารถเชื่อมต่อได้ กรุณาตรวจสอบอินเทอร์เน็ต" |
| 5c | — | ข้อความผู้ใช้ยังคงแสดงในแชท (บันทึกลง IndexedDB) |

#### AF-01c: AI Response Parse Error

| Step | Actor | System |
|---|---|---|
| 7a | — | AI ตอบกลับไม่มี `<correction>` tag |
| 7b | — | ระบบแสดงเฉพาะข้อความสนทนา ไม่แสดงการ์ดแก้ไข |

#### AF-01d: ข้อความเปล่า

| Step | Actor | System |
|---|---|---|
| 4a | ผู้ใช้กด Send โดยไม่พิมพ์อะไร | ปุ่ม Send ถูก Disable (หรือระบบไม่ตอบสนอง) |

---

## UC-02: View Conversation History (ดูประวัติบทสนทนา)

| ฟิลด์ | รายละเอียด |
|---|---|
| **Use Case ID** | UC-02 |
| **Use Case Name** | ดูประวัติและสนทนาต่อ |
| **Actor** | ผู้ใช้ (User) |
| **Precondition** | มีบทสนทนาเก่าอยู่ใน IndexedDB |
| **Postcondition** | เปิดบทสนทนาเดิมและสามารถสนทนาต่อได้ |
| **Priority** | 🟡 Medium |
| **Trigger** | ผู้ใช้กดปุ่มแสดงรายการประวัติ |

### Basic Flow

| Step | Actor | System |
|---|---|---|
| 1 | ผู้ใช้กดปุ่ม Conversation List | ระบบดึงข้อมูลจาก IndexedDB (เรียงตาม updatedAt) |
| 2 | — | ระบบแสดงรายการบทสนทนา: Scenario, วันที่, ข้อความล่าสุด |
| 3 | ผู้ใช้แตะรายการที่ต้องการ | ระบบโหลด Conversation Session + Handoff Context |
| 4 | — | ระบบแสดงข้อความทั้งหมดของ Session นั้น |
| 5 | ผู้ใช้พิมพ์ข้อความใหม่ | ระบบส่งข้อความ + Handoff Context ให้ AI → AI ตอบโดยรู้บริบทเดิม |

### Alternative Flows

#### AF-02a: ลบบทสนทนา

| Step | Actor | System |
|---|---|---|
| 3a | ผู้ใช้กด Delete บนรายการ | ระบบลบ Session จาก IndexedDB |
| 3b | — | รายการหายไปจาก List |

#### AF-02b: ไม่มีประวัติ

| Step | Actor | System |
|---|---|---|
| 2a | — | IndexedDB ไม่มีข้อมูล |
| 2b | — | แสดงข้อความ "ยังไม่มีประวัติการสนทนา" |

---

## UC-03: View Error Dashboard (ดูสถิติข้อผิดพลาด)

| ฟิลด์ | รายละเอียด |
|---|---|
| **Use Case ID** | UC-03 |
| **Use Case Name** | ดูสถิติข้อผิดพลาดด้านแกรมม่า |
| **Actor** | ผู้ใช้ (User) |
| **Precondition** | มีการฝึกสนทนาอย่างน้อย 1 ครั้ง |
| **Postcondition** | — |
| **Priority** | 🟡 Medium |
| **Trigger** | ผู้ใช้กด Tab "Dashboard" ใน Bottom Navigation |

### Basic Flow

| Step | Actor | System |
|---|---|---|
| 1 | ผู้ใช้กด Tab Dashboard | ระบบดึง ErrorDashboard จาก IndexedDB |
| 2 | — | ระบบแสดง: จำนวนครั้งที่ฝึก, จำนวนข้อผิดพลาดรวม |
| 3 | — | ระบบแสดง Breakdown แยกตามประเภทข้อผิดพลาด (Progress Bar) |
| 4 | — | เรียงลำดับจากมากไปน้อย |

### Alternative Flow

#### AF-03a: ยังไม่เคยใช้งาน

| Step | Actor | System |
|---|---|---|
| 2a | — | Dashboard ยังไม่มีข้อมูล |
| 2b | — | แสดง "แชท 0 ครั้ง · ผิด 0 จุด" |

---

## UC-04: Manage Vocabulary (จัดการคลังคำศัพท์)

| ฟิลด์ | รายละเอียด |
|---|---|
| **Use Case ID** | UC-04 |
| **Use Case Name** | จัดการคลังคำศัพท์ส่วนตัว |
| **Actor** | ผู้ใช้ (User) |
| **Precondition** | — |
| **Postcondition** | คลังคำศัพท์ถูกอัปเดตใน IndexedDB |
| **Priority** | 🔴 High |
| **Trigger** | ผู้ใช้กด Tab "Vocabulary" ใน Bottom Navigation |

### Sub-Flows

#### SF-04a: Add Word (เพิ่มคำศัพท์)

| Step | Actor | System |
|---|---|---|
| 1 | ผู้ใช้กด [+] | ระบบเปิด Modal เพิ่มคำศัพท์ |
| 2 | ผู้ใช้พิมพ์คำศัพท์ภาษาอังกฤษ | — |
| 3 | — | ระบบตรวจสอบ Spell Check + Duplicate Detection (เรียก AI) |
| 4 | — | **Spell Check:** ถ้าสะกดผิด → แนะนำคำที่ถูก<br>**Duplicate:** ถ้าซ้ำ → แจ้งเตือน |
| 5 | ผู้ใช้ยืนยัน | ระบบเรียก AI Auto-fill (Phonetic, Thai Meaning, POS, Category, Examples) |
| 6 | ผู้ใช้ตรวจสอบ/แก้ไขข้อมูล | — |
| 7 | ผู้ใช้กดบันทึก | ระบบบันทึกลง IndexedDB, ปิด Modal |
| 8 | — | Flashcard อัปเดต, แสดงคำใหม่ |

#### SF-04b: Browse Flashcards (ดูคำศัพท์)

| Step | Actor | System |
|---|---|---|
| 1 | ผู้ใช้เปิดหน้า Vocabulary | ระบบแสดง Flashcard คำแรก |
| 2 | ผู้ใช้กด ◀ / ▶ | ระบบแสดงคำก่อนหน้า / ถัดไป |
| 3 | ผู้ใช้กด 👁️ (Toggle) | ระบบซ่อน/แสดงความหมาย |
| 4 | ผู้ใช้กด 🔊 | Browser ใช้ Web Speech API อ่านออกเสียง |

#### SF-04c: Filter & Search

| Step | Actor | System |
|---|---|---|
| 1 | ผู้ใช้เลือกหมวดหมู่จากรายการ | ระบบกรอง Flashcard เฉพาะหมวดที่เลือก |
| 2 | ผู้ใช้เลือก "รู้แล้ว" / "ยังไม่รู้" | ระบบกรองตามสถานะ Mastery |
| 3 | ผู้ใช้พิมพ์ในช่องค้นหา | ระบบค้นหาจาก word และ thaiMeaning |

#### SF-04d: Mark Mastery

| Step | Actor | System |
|---|---|---|
| 1 | ผู้ใช้ดู Flashcard | — |
| 2 | ผู้ใช้กด "✅ รู้แล้ว" | ระบบบันทึกสถานะ mastered = true |
| 3 | — | Progress Bar อัปเดต, Filter "รู้แล้ว" จะรวมคำนี้ |

#### SF-04e: Edit / Delete

| Step | Actor | System |
|---|---|---|
| 1 | ผู้ใช้กด ✏️ (Edit) | ระบบเปิด Modal พร้อมข้อมูลเดิม |
| 2 | ผู้ใช้แก้ไข → บันทึก | ระบบอัปเดต IndexedDB |
| 3 | ผู้ใช้กด 🗑️ (Delete) | ระบบลบจาก IndexedDB |

---

## UC-05: Configure API Key (ตั้งค่า API Key)

| ฟิลด์ | รายละเอียด |
|---|---|
| **Use Case ID** | UC-05 |
| **Use Case Name** | ตั้งค่า DeepSeek API Key |
| **Actor** | ผู้ใช้ (User) |
| **Precondition** | — |
| **Postcondition** | API Key ถูกบันทึกใน localStorage |
| **Priority** | 🔴 High |
| **Trigger** | ผู้ใช้กด Tab "Settings" ใน Bottom Navigation |

### Basic Flow

| Step | Actor | System |
|---|---|---|
| 1 | ผู้ใช้กด Tab Settings | ระบบแสดงหน้าตั้งค่า |
| 2 | — | ระบบแสดงคำแนะนำวิธีสมัคร API Key (ลิงก์ platform.deepseek.com) |
| 3 | ผู้ใช้กรอก API Key | Input field แสดงเป็น masked text |
| 4 | ผู้ใช้กด "บันทึก" | ระบบบันทึก API Key ลง localStorage |
| 5 | — | ระบบแสดงข้อความ "บันทึกสำเร็จ" |
| 6 | — | ผู้ใช้กลับไปหน้า Chat เพื่อเริ่มใช้งาน AI |

### Alternative Flow

#### AF-05a: API Key ว่างเปล่า

| Step | Actor | System |
|---|---|---|
| 4a | ผู้ใช้กดบันทึกโดยไม่กรอกอะไร | ระบบไม่บันทึก / แจ้งเตือนให้กรอก API Key |

---

## UC-06: Install PWA (ติดตั้งแอป)

| ฟิลด์ | รายละเอียด |
|---|---|
| **Use Case ID** | UC-06 |
| **Use Case Name** | ติดตั้ง PWA ลงหน้าจอมือถือ |
| **Actor** | ผู้ใช้ (User) |
| **Precondition** | เปิดแอปใน Browser ที่รองรับ PWA (Chrome/Safari) |
| **Postcondition** | แอปติดตั้งบน Home Screen |
| **Priority** | 🟡 Medium |
| **Trigger** | Browser แสดง Install Prompt หรือผู้ใช้กด "Add to Home Screen" |

### Basic Flow

| Step | Actor | System |
|---|---|---|
| 1 | ผู้ใช้เปิดแอปใน Browser | ระบบเช็ค PWA Capability |
| 2 | — | ระบบแสดง Install Prompt (Chrome) หรือ Banner แนะนำ (Safari) |
| 3 | ผู้ใช้กด "ติดตั้ง" / "เพิ่มลงหน้าจอหลัก" | Browser ลงทะเบียน Service Worker และสร้าง Shortcut |
| 4 | — | แอปเปิดแบบ Full Screen เมื่อเปิดจาก Home Screen |

---

## เอกสารอ้างอิง

| เอกสาร | ลิงก์ |
|---|---|
| FRD | [02-frd.md](./02-frd.md) |
| User Stories | [03-user-stories.md](./03-user-stories.md) |
| BPMN / Process Flow | [06-bpmn.md](./06-bpmn.md) |
| UML Diagrams | [08-uml.md](./08-uml.md) |
