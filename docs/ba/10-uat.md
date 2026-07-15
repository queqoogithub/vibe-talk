# 🧪 UAT Test Scenario / UAT Test Case

| ฟิลด์ | รายละเอียด |
|---|---|
| **ชื่อโปรเจกต์** | Vibe Talk — แอปฝึกสนทนาภาษาอังกฤษด้วย AI |
| **เวอร์ชัน** | 1.0 |
| **วันที่จัดทำ** | 12 กุมภาพันธ์ 2568 |
| **ผู้จัดทำ** | ทีม Business Analyst |
| **ระยะเวลาทดสอบ** | 1-14 มีนาคม 2568 |
| **ผู้ทดสอบ** | กลุ่มผู้ใช้จริง 5-10 คน (End Users) |

---

## ภาพรวม UAT

| รายการ | รายละเอียด |
|---|---|
| **วัตถุประสงค์** | ตรวจสอบว่าระบบทำงานได้ตรงตาม Requirement และผู้ใช้สามารถใช้งานได้จริง |
| **ขอบเขต** | ฟีเจอร์ทั้งหมดในเวอร์ชัน 1.0 |
| **สภาพแวดล้อม** | Production Build บนอุปกรณ์จริง (iOS Safari, Android Chrome, Desktop Chrome) |
| **เกณฑ์ผ่าน** | ≥ 90% ของ Test Cases ต้องผ่าน, ไม่มี Critical Bug |

---

## UAT Test Scenarios

### TS-01: การฝึกสนทนากับ AI (Chat + Grammar)

**คำอธิบาย**: ทดสอบการสนทนากับ AI ในทุกสถานการณ์ พร้อมการตรวจแกรมม่า

#### Test Cases

| TC ID | Scenario | Test Steps | Expected Result | สถานะ |
|---|---|---|---|---|
| **UAT-01** | เลือกสถานการณ์ | 1. เปิดแอป<br>2. กดเลือกสถานการณ์ "สั่งอาหาร"<br>3. ดูข้อความตอบกลับแรก | AI ทักทายในบทบาทพนักงานเสิร์ฟ<br>ข้อความเป็นภาษาอังกฤษ | ⬜ Pass / Fail |
| **UAT-02** | ส่งข้อความ-รับตอบ | 1. อยู่ในแชท<br>2. พิมพ์ "I want to order a pizza"<br>3. กด Send<br>4. รอ AI ตอบ | - ข้อความผู้ใช้แสดงในฟองแชทขวา<br>- แสดง Typing Indicator ระหว่างรอ<br>- AI ตอบกลับในฟองแชทซ้าย | ⬜ Pass / Fail |
| **UAT-03** | สนทนาต่อเนื่อง | 1. หลังจาก AI ตอบ<br>2. พิมพ์ต่อ "With extra cheese please"<br>3. ดูว่า AI ตอบโดยรู้ว่าสั่ง pizza อยู่ | AI ตอบโดยอ้างอิงบริบท pizza และ toppings | ⬜ Pass / Fail |
| **UAT-04** | ตรวจแกรมม่า | 1. พิมพ์ "I go to school yesterday"<br>2. ส่งข้อความ<br>3. ดูการ์ด Grammar Correction | แสดงการ์ด: "go" → "went"<br>ประเภท: Tense (กาล)<br>คำอธิบาย: ภาษาไทย | ⬜ Pass / Fail |
| **UAT-04a** | ไม่มีข้อผิดพลาด | 1. พิมพ์ "I went to school yesterday"<br>2. ส่งข้อความ<br>3. ดูว่ามีการ์ดแก้ไขหรือไม่ | ไม่มีการ์ด Grammar Correction ปรากฏ | ⬜ Pass / Fail |
| **UAT-04b** | หลายข้อผิดพลาด | 1. พิมพ์ข้อความที่มี ≥ 2 จุดผิด<br>2. ส่งข้อความ<br>3. ดูการ์ดแก้ไข | แสดงการ์ดแก้ไขทุกจุดที่พบ | ⬜ Pass / Fail |

---

### TS-02: การจัดการประวัติบทสนทนา

**คำอธิบาย**: ทดสอบการบันทึก ดูประวัติ และลบบทสนทนา

| TC ID | Scenario | Test Steps | Expected Result | สถานะ |
|---|---|---|---|---|
| **UAT-05** | บันทึกอัตโนมัติ | 1. สนทนากับ AI 3-4 ข้อความ<br>2. ปิดแอป<br>3. เปิดแอปใหม่<br>4. ดูประวัติ | บทสนทนาเดิมยังอยู่ครบทุกข้อความ | ⬜ Pass / Fail |
| **UAT-06** | ดูประวัติ | 1. กดปุ่ม Conversation List<br>2. ดูรายการ | - แสดงรายการเรียงตามเวลาใหม่สุด<br>- แสดงชื่อสถานการณ์ + วันที่<br>- แสดงตัวอย่างข้อความล่าสุด | ⬜ Pass / Fail |
| **UAT-07** | สนทนาต่อ | 1. แตะที่ประวัติบทสนทนา<br>2. พิมพ์ข้อความใหม่<br>3. ดูว่า AI มีบริบทเดิม | AI ตอบโดยอ้างอิงบทสนทนาก่อนหน้า | ⬜ Pass / Fail |
| **UAT-08** | เริ่มบทสนทนาใหม่ | 1. กำลังสนทนาอยู่<br>2. กดปุ่มเริ่มใหม่ / กลับไปเลือกสถานการณ์<br>3. เลือกสถานการณ์ใหม่ | เริ่มบทสนทนาใหม่ สะอาด<br>บทสนทนาเก่าถูกบันทึกในประวัติ | ⬜ Pass / Fail |

---

### TS-03: ดูสถิติข้อผิดพลาด (Dashboard)

**คำอธิบาย**: ทดสอบการแสดงและอัปเดต Dashboard

| TC ID | Scenario | Test Steps | Expected Result | สถานะ |
|---|---|---|---|---|
| **UAT-09** | ดูสถิติ | 1. หลังสนทนาหลายครั้ง<br>2. กด Tab Dashboard | - แสดงจำนวนครั้งที่ฝึก<br>- แสดงจำนวนข้อผิดพลาดรวม<br>- Progress Bar แยกตาม Error Type | ⬜ Pass / Fail |
| **UAT-09a** | ยังไม่มีข้อมูล | 1. ล้าง IndexedDB (หรือใช้ครั้งแรก)<br>2. เปิด Dashboard | แสดง "แชท 0 ครั้ง · ผิด 0 จุด" | ⬜ Pass / Fail |
| **UAT-09b** | อัปเดต Real-time | 1. ดู Dashboard (จำค่าปัจจุบัน)<br>2. ไปสนทนา 1 ครั้ง (จงใจพิมพ์ผิด)<br>3. กลับมาดู Dashboard | จำนวนครั้ง + 1, จำนวนข้อผิดพลาดเพิ่มขึ้น | ⬜ Pass / Fail |
| **UAT-10** | ตัวอย่างข้อผิดพลาด | 1. ดู Dashboard<br>2. ตรวจสอบว่ามีตัวอย่างข้อผิดพลาดถูกเก็บ | ระบบเก็บตัวอย่าง (สูงสุด 10) ต่อ Error Type<br>(Optional: แสดงเมื่อคลิกดูรายละเอียด) | ⬜ Pass / Fail |

---

### TS-04: จัดการคลังคำศัพท์ (Vocabulary)

**คำอธิบาย**: ทดสอบทุกฟังก์ชันของคลังคำศัพท์

| TC ID | Scenario | Test Steps | Expected Result | สถานะ |
|---|---|---|---|---|
| **UAT-11** | เพิ่มคำศัพท์ด้วย AI | 1. กด Tab Vocabulary<br>2. กด [+] เปิด Modal<br>3. พิมพ์ "serendipity"<br>4. กด "ตรวจสอบ"<br>5. ดูข้อมูลที่ AI เติมให้<br>6. กด "บันทึก" | - Spell Check: สะกดถูก<br>- AI เติม: Phonetic, Thai Meaning, POS, Category, Examples<br>- บันทึกสำเร็จ<br>- Flashcard อัปเดต | ⬜ Pass / Fail |
| **UAT-11a** | แก้ไขข้อมูล AI | 1. เพิ่มคำศัพท์<br>2. AI เติมความหมาย "X"<br>3. แก้ไขความหมายเป็น "Y"<br>4. บันทึก | บันทึกความหมาย "Y" ตามที่แก้ไข | ⬜ Pass / Fail |
| **UAT-12** | ตรวจสอบคำซ้ำ | 1. เพิ่มคำว่า "happy"<br>2. ลองเพิ่ม "happy" หรือ "Happy" อีกครั้ง<br>3. ดูการแจ้งเตือน | ระบบแจ้ง: "คำนี้มีอยู่แล้วในคลัง" | ⬜ Pass / Fail |
| **UAT-13** | Spell Check — สะกดผิด | 1. เพิ่มคำศัพท์<br>2. พิมพ์ "hapiness"<br>3. กดตรวจสอบ<br>4. ดูคำแนะนำ | ระบบแจ้ง: "คำอาจสะกดผิด"<br>แนะนำ: "happiness" | ⬜ Pass / Fail |
| **UAT-13a** | Spell Check — เลือกคำแนะนำ | 1. สะกดผิด → แสดงคำแนะนำ<br>2. กดเลือก "happiness" | ช่องคำศัพท์เปลี่ยนเป็น "happiness" | ⬜ Pass / Fail |
| **UAT-14** | ดู Flashcard | 1. เปิดหน้า Vocabulary<br>2. ดู Flashcard<br>3. กด ◀ / ▶<br>4. กด 👁️ ซ่อน/แสดงความหมาย | - แสดงคำศัพท์ทีละคำ<br>- ข้อมูลครบ: Word, Phonetic, POS, Thai Meaning, Examples<br>- Toggle ความหมายได้<br>- นำทางก่อนหน้า/ถัดไปได้ | ⬜ Pass / Fail |
| **UAT-14a** | แก้ไขคำศัพท์ | 1. ดู Flashcard<br>2. กด ✏️<br>3. แก้ไขข้อมูล<br>4. บันทึก | Modal เปิดพร้อมข้อมูลเดิม<br>แก้ไขและบันทึกได้ | ⬜ Pass / Fail |
| **UAT-14b** | ลบคำศัพท์ | 1. ดู Flashcard<br>2. กด 🗑️ | คำศัพท์ถูกลบจาก IndexedDB<br>Flashcard เลื่อนไปคำถัดไป | ⬜ Pass / Fail |
| **UAT-15** | กรองและค้นหา | 1. เปิด Vocabulary<br>2. เลือกหมวดหมู่ "อาหาร"<br>3. เลือก Filter "ยังไม่รู้"<br>4. พิมพ์ค้นหา "pizza" | - แสดงเฉพาะคำในหมวดอาหาร<br>- แสดงเฉพาะคำที่ยังไม่รู้<br>- กรองเพิ่มด้วยคำค้นหา | ⬜ Pass / Fail |
| **UAT-16** | Mark รู้แล้ว | 1. ดู Flashcard<br>2. กด "✅ รู้แล้ว"<br>3. ดู Progress Bar<br>4. เปลี่ยน Filter เป็น "รู้แล้ว" | - สถานะเปลี่ยนเป็นรู้แล้ว<br>- Progress Bar อัปเดต<br>- คำนี้ปรากฏใน Filter "รู้แล้ว" | ⬜ Pass / Fail |
| **UAT-16a** | Unmark | 1. คำที่ Mark รู้แล้ว<br>2. กดอีกครั้ง (หรือปุ่ม ❌) | สถานะกลับเป็นยังไม่รู้ | ⬜ Pass / Fail |
| **UAT-17** | ฟังเสียง | 1. ดู Flashcard<br>2. กด 🔊 | Browser อ่านออกเสียงคำศัพท์เป็นภาษาอังกฤษ | ⬜ Pass / Fail |

---

### TS-05: ตั้งค่า API Key

**คำอธิบาย**: ทดสอบการตั้งค่า DeepSeek API Key

| TC ID | Scenario | Test Steps | Expected Result | สถานะ |
|---|---|---|---|---|
| **UAT-18** | ตั้งค่า API Key | 1. กด Tab Settings<br>2. กรอก API Key (sk-xxx)<br>3. กด "บันทึก"<br>4. กลับไปหน้า Chat<br>5. ลองส่งข้อความ | - บันทึกสำเร็จ แสดงข้อความยืนยัน<br>- กลับไป Chat แล้วใช้ AI ได้ | ⬜ Pass / Fail |
| **UAT-18a** | ไม่มี API Key → สนทนาไม่ได้ | 1. ยังไม่ตั้ง API Key<br>2. ไปหน้า Chat<br>3. ลองส่งข้อความ | แสดงข้อความให้ไปตั้งค่า API Key | ⬜ Pass / Fail |
| **UAT-18b** | API Key ไม่ถูกต้อง | 1. ตั้ง API Key ปลอม (invalid key)<br>2. ไป Chat<br>3. ลองส่งข้อความ | แสดง Error จาก API (401 Unauthorized หรือ Error Message) | ⬜ Pass / Fail |

---

### TS-06: PWA Features

**คำอธิบาย**: ทดสอบการติดตั้งและการใช้งาน PWA

| TC ID | Scenario | Test Steps | Expected Result | สถานะ |
|---|---|---|---|---|
| **UAT-19** | ติดตั้ง PWA (Android Chrome) | 1. เปิดแอปใน Chrome<br>2. รอ Install Prompt<br>3. กด "ติดตั้ง"<br>4. ดู Home Screen | - แสดง Install Prompt<br>- ติดตั้งสำเร็จ<br>- มีไอคอนบน Home Screen | ⬜ Pass / Fail |
| **UAT-19a** | ติดตั้ง PWA (iOS Safari) | 1. เปิดแอปใน Safari<br>2. ดู Banner แนะนำ<br>3. กด Share → Add to Home Screen<br>4. ดู Home Screen | - แสดง Banner แนะนำ<br>- ติดตั้งสำเร็จ | ⬜ Pass / Fail |
| **UAT-20** | Full Screen Mode | 1. ติดตั้ง PWA แล้ว<br>2. เปิดจาก Home Screen | ไม่มี Address Bar<br>ใช้พื้นที่เต็มจอ | ⬜ Pass / Fail |
| **UAT-21** | Safe Area (iPhone) | 1. ใช้ iPhone ที่มี Notch<br>2. เปิดแอป (PWA Mode)<br>3. ตรวจสอบทุกหน้า | เนื้อหาไม่ถูก Notch หรือ Home Indicator บัง<br>Bottom Nav อยู่เหนือ Home Indicator | ⬜ Pass / Fail |

---

### TS-07: Cross-Cutting Concerns

**คำอธิบาย**: ทดสอบฟังก์ชันที่ครอบคลุมหลายฟีเจอร์

| TC ID | Scenario | Test Steps | Expected Result | สถานะ |
|---|---|---|---|---|
| **UAT-22** | Responsive Design | 1. เปิดแอปบนมือถือแนวตั้ง<br>2. หมุนเป็นแนวนอน<br>3. เปิดบน Tablet<br>4. เปิดบน Desktop | UI ปรับขนาดเหมาะสมทุกอุปกรณ์<br>Bottom Nav ยังใช้งานได้<br>บน Desktop: แสดง Phone Frame | ⬜ Pass / Fail |
| **UAT-23** | Offline Mode | 1. เปิดแอป<br>2. ปิดอินเทอร์เน็ต<br>3. ดูประวัติ<br>4. ดู Dashboard<br>5. ดู Vocabulary | - ประวัติ, Dashboard, Vocabulary อ่านได้ (จาก IndexedDB)<br>- Chat ไม่ทำงาน (แจ้ง Network Error) | ⬜ Pass / Fail |
| **UAT-24** | ข้อมูลคงอยู่ (Persistence) | 1. ใช้งานแอป: สนทนา, เพิ่มคำศัพท์<br>2. ปิด Browser (Quit App)<br>3. เปิดใหม่<br>4. ตรวจสอบข้อมูล | ข้อมูลทั้งหมดยังอยู่: ประวัติ, Dashboard, Vocabulary, API Key | ⬜ Pass / Fail |
| **UAT-25** | ประสิทธิภาพ (Performance) | 1. เปิดแอป<br>2. สังเกตเวลาโหลด<br>3. สนทนาหลายครั้ง (10+ ข้อความ)<br>4. ดูว่าแอปยังลื่นไหม | - FCP ≤ 1.5 วิ<br>- แชทยังลื่นเมื่อข้อความเยอะ | ⬜ Pass / Fail |
| **UAT-26** | UI ภาษาไทย | 1. ตรวจสอบทุกหน้า ทุกปุ่ม ทุกข้อความ | UI ทั้งหมดเป็นภาษาไทย (ยกเว้นข้อความภาษาอังกฤษที่ผู้ใช้พิมพ์) | ⬜ Pass / Fail |

---

## UAT Results Summary

| หมวด | Test Cases | Pass | Fail | Pass Rate |
|---|---|---|---|---|
| TS-01: Chat + Grammar | 6 | | | |
| TS-02: History | 4 | | | |
| TS-03: Dashboard | 3 | | | |
| TS-04: Vocabulary | 12 | | | |
| TS-05: Settings | 3 | | | |
| TS-06: PWA | 4 | | | |
| TS-07: Cross-Cutting | 5 | | | |
| **Total** | **37** | | | |

---

## Bug Severity Classification

| Severity | คำอธิบาย | ตัวอย่าง |
|---|---|---|
| **Critical** | ฟีเจอร์หลักใช้ไม่ได้, ข้อมูลสูญหาย | Chat ส่งข้อความไม่ได้เลย, IndexedDB พัง |
| **Major** | ฟีเจอร์รองใช้ไม่ได้ แต่มี Workaround | AI Auto-fill ไม่ทำงาน แต่เพิ่มคำศัพท์เองได้ |
| **Minor** | UI ไม่สวย, ข้อความสะกดผิด, Minor Visual Bug | สีปุ่มไม่ตรงตาม Design |
| **Enhancement** | ข้อเสนอแนะเพิ่มเติม | อยากให้มี Dark Mode |

---

## Sign-off

| รายการ | ชื่อ | ลายเซ็น | วันที่ |
|---|---|---|---|
| **ผู้ทดสอบ (UAT Tester)** | _____________ | _____________ | __/__/____ |
| **Product Owner** | _____________ | _____________ | __/__/____ |
| **Business Analyst** | _____________ | _____________ | __/__/____ |

---

## เอกสารอ้างอิง

| เอกสาร | ลิงก์ |
|---|---|
| BRD | [01-brd.md](./01-brd.md) |
| FRD | [02-frd.md](./02-frd.md) |
| User Stories | [03-user-stories.md](./03-user-stories.md) |
| Acceptance Criteria | [04-acceptance-criteria.md](./04-acceptance-criteria.md) |
| Use Case Spec | [05-use-case-spec.md](./05-use-case-spec.md) |
| RTM | [09-rtm.md](./09-rtm.md) |
