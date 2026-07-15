# 🔗 RTM: Requirement Traceability Matrix

| ฟิลด์ | รายละเอียด |
|---|---|
| **ชื่อโปรเจกต์** | Vibe Talk — แอปฝึกสนทนาภาษาอังกฤษด้วย AI |
| **เวอร์ชัน** | 1.0 |
| **วันที่จัดทำ** | 10 กุมภาพันธ์ 2568 |
| **ผู้จัดทำ** | ทีม Business Analyst |
| **สถานะ** | ✅ อัปเดตล่าสุด: 15 กุมภาพันธ์ 2568 |

---

## คำอธิบาย

Requirement Traceability Matrix (RTM) นี้ใช้สำหรับติดตามว่าแต่ละ Functional Requirement (FR) ได้ถูก:
- 🎨 **ออกแบบ (Designed)** — มี Wireframe หรือ UI Component ตรงกับ Requirement
- 💻 **พัฒนา (Developed)** — มีการ Implement ใน Source Code
- 🧪 **ทดสอบ (Tested)** — มี UAT Test Case ครอบคลุม

โดยมีสถานะ:
- ✅ = เสร็จสมบูรณ์
- 🔄 = กำลังดำเนินการ
- ❌ = ยังไม่เริ่ม

---

## Traceability Matrix

| FR ID | Requirement | User Story | Use Case | Wireframe | Component(s) | UAT Test | สถานะ Design | สถานะ Dev | สถานะ Test |
|---|---|---|---|---|---|---|---|---|---|
| **FR-M01-01** | เลือกสถานการณ์สนทนา 8 แบบ | US-01 | UC-01 | Chat Screen | `ScenarioSelector.tsx` | UAT-01 | ✅ | ✅ | ✅ |
| **FR-M01-02** | ส่งข้อความและรับ AI ตอบกลับ | US-02 | UC-01 | Chat Screen | `ChatInput.tsx`, `ChatBubble.tsx`, `deepseek.ts` | UAT-02 | ✅ | ✅ | ✅ |
| **FR-M01-03** | AI รักษาบริบทบทสนทนา | US-02 | UC-01 | — | `deepseek.ts` (System Prompt Builder) | UAT-03 | ✅ | ✅ | ✅ |
| **FR-M02-01** | ตรวจจับและแก้ไขข้อผิดพลาด 9 ประเภท | US-07, US-08, US-09, US-10 | UC-01 | Chat Screen (Correction Card) | `CorrectionCard.tsx`, `deepseek.ts` (Parse) | UAT-04 | ✅ | ✅ | ✅ |
| **FR-M02-02** | No correction = empty array | US-07 | UC-01 | — | `deepseek.ts` | UAT-04 | ✅ | ✅ | ✅ |
| **FR-M03-01** | บันทึกประวัติบทสนทนา IndexedDB | US-05 | UC-02 | — | `db.ts` (saveConversation) | UAT-05 | ✅ | ✅ | ✅ |
| **FR-M03-02** | รายการบทสนทนาย้อนหลัง | US-05 | UC-02 | Conversation List | `ConversationList.tsx` | UAT-06 | ✅ | ✅ | ✅ |
| **FR-M03-03** | Handoff Context (สนทนาต่อ) | US-05 | UC-02 | — | `db.ts` (generateHandoffSummary), `deepseek.ts` | UAT-07 | ✅ | ✅ | ✅ |
| **FR-M03-04** | เริ่มบทสนทนาใหม่ | US-04 | UC-01 | Chat Screen | `page.tsx` (New Chat) | UAT-08 | ✅ | ✅ | ✅ |
| **FR-M04-01** | แสดงสถิติข้อผิดพลาด | US-11, US-12 | UC-03 | Dashboard Screen | `ErrorDashboard.tsx`, `db.ts` | UAT-09 | ✅ | ✅ | ✅ |
| **FR-M04-02** | เก็บตัวอย่างข้อผิดพลาด | US-13 | UC-03 | — | `db.ts` (trackError) | UAT-10 | ✅ | ✅ | ✅ |
| **FR-M05-01** | เพิ่มคำศัพท์ + AI Auto-fill | US-14, US-15 | UC-04 | Add/Edit Modal | `AddWordModal.tsx`, `deepseek.ts` (inferWordInfo) | UAT-11 | ✅ | ✅ | ✅ |
| **FR-M05-02** | ตรวจสอบคำซ้ำ | US-17 | UC-04 | — | `useVocabulary.ts` (isDuplicate) | UAT-12 | ✅ | ✅ | ✅ |
| **FR-M05-03** | Spell Check | US-16 | UC-04 | Add/Edit Modal | `deepseek.ts` (checkSpelling) | UAT-13 | ✅ | ✅ | ✅ |
| **FR-M05-04** | จัดการคลัง (CRUD) | US-14, US-23 | UC-04 | Vocabulary Screen | `VocabularyCard.tsx`, `AddWordModal.tsx`, `useVocabulary.ts` | UAT-14 | ✅ | ✅ | ✅ |
| **FR-M05-05** | กรองและค้นหา | US-19, US-20, US-21 | UC-04 | Vocabulary Screen | `useVocabulary.ts` (filter + search) | UAT-15 | ✅ | ✅ | ✅ |
| **FR-M05-06** | Mastery Tracking | US-24 | UC-04 | Vocabulary Screen | `db.ts` (markWordMastered, markWordUnmastered) | UAT-16 | ✅ | ✅ | ✅ |
| **FR-M05-07** | Text-to-Speech | US-22 | UC-04 | Vocabulary Screen | `VocabularyCard.tsx` (Web Speech API) | UAT-17 | ✅ | ✅ | ✅ |
| **FR-M05-08** | 13 หมวดหมู่คำศัพท์ | US-19 | UC-04 | Vocabulary Screen | `types.ts` (VocabCategory, VOCAB_CATEGORY_LABELS) | UAT-15 | ✅ | ✅ | ✅ |
| **FR-M06-01** | ตั้งค่า API Key | US-25, US-26 | UC-05 | Settings Screen | `SettingsPanel.tsx`, `deepseek.ts` (setApiKey) | UAT-18 | ✅ | ✅ | ✅ |
| **FR-M07-01** | ติดตั้ง PWA | US-27 | UC-06 | Install Banner | `PwaInstallModal.tsx`, `manifest.ts` | UAT-19 | ✅ | ✅ | ✅ |
| **FR-M07-02** | Full Screen Mode | US-28 | UC-06 | — | `manifest.ts`, `layout.tsx` (meta tags) | UAT-20 | ✅ | ✅ | ✅ |
| **FR-M07-03** | Safe Area | US-29 | — | — | `globals.css` (env safe-area-inset) | UAT-21 | ✅ | ✅ | ✅ |

---

## Non-Functional Requirement Traceability

| NFR ID | Requirement | วิธี Verify | สถานะ |
|---|---|---|---|
| **NFR-01** | AI Response ≤ 2 วิ (มี Loading) | Manual Testing + Network Throttle | ✅ |
| **NFR-02** | FCP ≤ 1.5 วิ | Lighthouse Audit | ✅ |
| **NFR-03** | TTI ≤ 3 วิ | Lighthouse Audit | ✅ |
| **NFR-04** | IndexedDB Offline Read | Manual Test (Offline Mode) | ✅ |
| **NFR-05** | UI ภาษาไทยทั้งหมด | Manual Review | ✅ |
| **NFR-06** | Mobile-first Responsive | Manual Test on iOS + Android | ✅ |
| **NFR-07** | API Key ใน localStorage เท่านั้น | Code Review | ✅ |
| **NFR-08** | ไม่มี Backend (Privacy) | Architecture Review | ✅ |
| **NFR-09** | Cross-browser Compatible | BrowserStack / Manual Test | ✅ |
| **NFR-10** | Touch-friendly UI | Manual Test (44px min tap target) | ✅ |
| **NFR-11** | IndexedDB Quota Mgmt | Code Review + Storage Monitor | ✅ |

---

## Coverage Summary

| หมวด | Requirements | Covered by Design | Covered by Dev | Covered by Test | Coverage % |
|---|---|---|---|---|---|
| FR-M01 (Chat) | 3 | 3 | 3 | 3 | 100% |
| FR-M02 (Grammar) | 2 | 2 | 2 | 2 | 100% |
| FR-M03 (Conversation) | 4 | 4 | 4 | 4 | 100% |
| FR-M04 (Dashboard) | 2 | 2 | 2 | 2 | 100% |
| FR-M05 (Vocabulary) | 8 | 8 | 8 | 8 | 100% |
| FR-M06 (Settings) | 1 | 1 | 1 | 1 | 100% |
| FR-M07 (PWA) | 3 | 3 | 3 | 3 | 100% |
| **Total FR** | **23** | **23** | **23** | **23** | **100%** |
| NFR | 11 | — | 11 | 11 | 100% |

---

## เอกสารอ้างอิง

| เอกสาร | ลิงก์ |
|---|---|
| BRD | [01-brd.md](./01-brd.md) |
| FRD | [02-frd.md](./02-frd.md) |
| User Stories | [03-user-stories.md](./03-user-stories.md) |
| Use Case Spec | [05-use-case-spec.md](./05-use-case-spec.md) |
| UAT Test Cases | [10-uat.md](./10-uat.md) |
