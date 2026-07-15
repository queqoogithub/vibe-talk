# 📐 UML Diagrams

| ฟิลด์ | รายละเอียด |
|---|---|
| **ชื่อโปรเจกต์** | Vibe Talk — แอปฝึกสนทนาภาษาอังกฤษด้วย AI |
| **เวอร์ชัน** | 1.0 |
| **วันที่จัดทำ** | 7 กุมภาพันธ์ 2568 |
| **ผู้จัดทำ** | ทีม Business Analyst |

---

## 1. Use Case Diagram

```mermaid
graph TD
    User(("👤 ผู้ใช้"))

    subgraph VibeTalk["Vibe Talk System"]
        UC01["ฝึกสนทนากับ AI"]
        UC02["ดูประวัติสนทนา"]
        UC03["ดูสถิติข้อผิดพลาด"]
        UC04["จัดการคลังคำศัพท์"]
        UC05["ตั้งค่า API Key"]
        UC06["ติดตั้ง PWA"]

        UC04_1["เพิ่มคำศัพท์"]
        UC04_2["ดู Flashcard"]
        UC04_3["ค้นหา/กรองคำศัพท์"]
        UC04_4["Mark รู้แล้ว/ยังไม่รู้"]
        UC04_5["แก้ไข/ลบคำศัพท์"]
        UC04_6["ฟังเสียงคำศัพท์"]

        UC01_1["ตรวจแกรมม่า"]
        UC01_2["เริ่มบทสนทนาใหม่"]
    end

    subgraph External["External Systems"]
        AI["DeepSeek API"]
    end

    User --> UC01
    User --> UC02
    User --> UC03
    User --> UC04
    User --> UC05
    User --> UC06

    UC01 -.-> UC01_1
    UC01 -.-> UC01_2

    UC04 -.-> UC04_1
    UC04 -.-> UC04_2
    UC04 -.-> UC04_3
    UC04 -.-> UC04_4
    UC04 -.-> UC04_5
    UC04 -.-> UC04_6

    UC01 -.-> AI
    UC04_1 -.-> AI
```

---

## 2. Activity Diagram: Chat Flow

```mermaid
stateDiagram-v2
    [*] --> SelectScenario: เปิดแอป
    
    SelectScenario --> CheckAPIKey: เลือกสถานการณ์
    
    CheckAPIKey --> ShowSettings: ไม่มี API Key
    ShowSettings --> SelectScenario: ตั้งค่าแล้ว
    
    CheckAPIKey --> CreateSession: มี API Key
    
    CreateSession --> AIFirstMessage: AI ทักทาย
    AIFirstMessage --> WaitUserInput: แสดงข้อความ
    
    WaitUserInput --> SendMessage: ผู้ใช้พิมพ์ + ส่ง
    SendMessage --> CallDeepSeek: ส่ง Request
    
    CallDeepSeek --> ShowError: Network Error
    ShowError --> WaitUserInput
    
    CallDeepSeek --> ParseResponse: AI ตอบ
    ParseResponse --> ShowAIMessage: แสดงข้อความ AI
    
    ShowAIMessage --> CheckCorrection: ตรวจสอบ Correction
    CheckCorrection --> ShowCorrection: มีข้อผิดพลาด
    ShowCorrection --> SaveToDB: บันทึก
    
    CheckCorrection --> SaveToDB: ไม่มีข้อผิดพลาด
    SaveToDB --> UpdateDashboard: อัปเดตสถิติ
    UpdateDashboard --> WaitUserInput
    
    WaitUserInput --> SelectScenario: กดเริ่มใหม่
    SelectScenario --> [*]
```

---

## 3. Activity Diagram: Add Vocabulary

```mermaid
stateDiagram-v2
    [*] --> OpenModal: กด [+]
    
    OpenModal --> EnterWord: พิมพ์คำศัพท์
    EnterWord --> SpellCheck: กดตรวจสอบ
    
    SpellCheck --> ShowSuggestions: สะกดผิด
    ShowSuggestions --> AcceptSuggestion: เลือกคำแนะนำ
    AcceptSuggestion --> EnterWord
    
    SpellCheck --> DupCheck: สะกดถูก
    ShowSuggestions --> ForceContinue: ยืนยันคำเดิม
    ForceContinue --> DupCheck
    
    DupCheck --> ShowDupAlert: มีคำซ้ำ
    ShowDupAlert --> EnterWord
    
    DupCheck --> AIAutoFill: ไม่ซ้ำ
    AIAutoFill --> ShowPrefill: เติมข้อมูลเสร็จ
    
    ShowPrefill --> EditFields: ผู้ใช้แก้ไข
    EditFields --> Save
    
    ShowPrefill --> Save: ผู้ใช้ไม่แก้ไข
    Save --> CloseModal: บันทึกสำเร็จ
    CloseModal --> [*]
```

---

## 4. Sequence Diagram: Chat with Grammar Correction

```mermaid
sequenceDiagram
    actor User as 👤 ผู้ใช้
    participant UI as Chat UI
    participant DB as IndexedDB
    participant AI as DeepSeek API

    User->>UI: เลือกสถานการณ์ "สั่งอาหาร"
    UI->>UI: สร้าง Session ID
    UI->>AI: System Prompt (พนักงานเสิร์ฟ)
    AI-->>UI: ข้อความทักทาย
    UI->>User: แสดง "How can I help you today?"

    User->>UI: พิมพ์ "I go to school yesterday"
    UI->>User: แสดงข้อความในฟองแชท

    UI->>AI: ส่ง Chat History + User Message
    Note over AI: ประมวลผลและตรวจแกรมม่า
    AI-->>UI: Response + <correction>JSON</correction>

    UI->>UI: Parse Correction JSON
    UI->>User: แสดงข้อความ AI
    UI->>User: แสดงการ์ด "go → went (Tense)"

    UI->>DB: saveConversation()
    UI->>DB: trackError("tense", "go")
    UI->>DB: incrementConversationCount()

    DB-->>UI: บันทึกสำเร็จ
```

---

## 5. Sequence Diagram: Add Vocabulary with AI Auto-fill

```mermaid
sequenceDiagram
    actor User as 👤 ผู้ใช้
    participant UI as Vocabulary UI
    participant DB as IndexedDB
    participant AI as DeepSeek API

    User->>UI: กด [+] เพิ่มคำศัพท์
    UI->>User: เปิด Modal

    User->>UI: พิมพ์ "serendipity"
    User->>UI: กดตรวจสอบ

    UI->>AI: Spell Check: "serendipity"
    AI-->>UI: {"isCorrect": true}

    UI->>DB: ตรวจสอบคำซ้ำ (getAllUserWords)
    DB-->>UI: ไม่พบคำซ้ำ

    UI->>AI: inferWordInfo("serendipity")
    AI-->>UI: {phonetic, thaiMeaning, partOfSpeech, category, examples}

    UI->>User: แสดงข้อมูลที่ AI เติมให้
    User->>UI: แก้ไข Thai Meaning (ถ้าต้องการ)
    User->>UI: กดบันทึก

    UI->>DB: addUserWord()
    DB-->>UI: บันทึกสำเร็จ
    UI->>User: ปิด Modal, รีเฟรช Flashcards
```

---

## 6. Sequence Diagram: Resume Conversation (Handoff)

```mermaid
sequenceDiagram
    actor User as 👤 ผู้ใช้
    participant UI as Chat UI
    participant DB as IndexedDB
    participant AI as DeepSeek API

    User->>UI: เปิดรายการประวัติ
    UI->>DB: getAllConversations()
    DB-->>UI: รายการบทสนทนา (เรียงตามเวลา)

    User->>UI: แตะบทสนทนา "สั่งอาหาร"
    UI->>DB: getConversation(id)
    DB-->>UI: Session + Messages + HandoffContext

    UI->>User: แสดงประวัติข้อความทั้งหมด

    User->>UI: พิมพ์ข้อความใหม่ "Can I have pepperoni?"
    UI->>AI: System Prompt + Handoff Context + Messages + New Message
    Note over AI: AI มีบริบทการสนทนาก่อนหน้า
    AI-->>UI: ตอบโดยรู้ว่าสั่ง pizza อยู่

    UI->>User: แสดงข้อความ AI
    UI->>DB: saveConversation() (อัปเดต)
```

---

## 7. Component Diagram (High-Level Architecture)

```mermaid
graph TD
    subgraph PWA["PWA Application"]
        subgraph Pages["Pages"]
            ChatPg["Chat Page<br>(page.tsx)"]
            DashboardPg["Dashboard Page"]
            VocabPg["Vocabulary Page"]
            SettingsPg["Settings Page"]
        end

        subgraph Components["Components"]
            ScenarioSelector["ScenarioSelector"]
            ChatBubble["ChatBubble"]
            ChatInput["ChatInput"]
            CorrectionCard["CorrectionCard"]
            ConversationList["ConversationList"]
            ErrorDashboard["ErrorDashboard"]
            VocabularyCard["VocabularyCard"]
            AddWordModal["AddWordModal"]
            SettingsPanel["SettingsPanel"]
            BottomNav["BottomNav"]
            PhoneFrame["PhoneFrame"]
        end

        subgraph Hooks["Custom Hooks"]
            UseVocab["useVocabulary"]
        end

        subgraph Lib["Library"]
            DeepSeek["deepseek.ts<br>(API Client)"]
            DB["db.ts<br>(IndexedDB Ops)"]
            Types["types.ts"]
        end
    end

    subgraph External["External"]
        DeepSeekAPI["DeepSeek API<br>api.deepseek.com"]
    end

    ChatPg --> ScenarioSelector
    ChatPg --> ChatBubble
    ChatPg --> ChatInput
    ChatPg --> CorrectionCard
    ChatPg --> ConversationList
    ChatPg --> BottomNav

    DashboardPg --> ErrorDashboard
    DashboardPg --> BottomNav

    VocabPg --> VocabularyCard
    VocabPg --> AddWordModal
    VocabPg --> UseVocab
    VocabPg --> BottomNav

    SettingsPg --> SettingsPanel
    SettingsPg --> BottomNav

    DeepSeek --> DeepSeekAPI
    ChatPg --> DeepSeek
    AddWordModal --> DeepSeek

    DB --> Types
    DeepSeek --> Types
    UseVocab --> DB
    UseVocab --> Types
```

---

## 8. State Diagram: Vocabulary Card Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Browsing: เปิดหน้า Vocabulary
    
    state Browsing {
        [*] --> ShowingWord: แสดงคำแรก
        ShowingWord --> NextWord: กด ▶
        NextWord --> ShowingWord
        ShowingWord --> PrevWord: กด ◀
        PrevWord --> ShowingWord
    }
    
    Browsing --> Filtering: เลือกหมวดหมู่
    Filtering --> Browsing: รีเซ็ต Index
    
    Browsing --> Searching: พิมพ์ค้นหา
    Searching --> Browsing: ล้างคำค้นหา
    
    Browsing --> MeaningHidden: กด 👁️ (ซ่อน)
    MeaningHidden --> Browsing: กด 👁️ (แสดง)
    
    Browsing --> MarkedMastered: กด ✅ รู้แล้ว
    MarkedMastered --> Browsing
    
    MarkedMastered --> UnmarkedMastered: กด ❌
    UnmarkedMastered --> Browsing
    
    Browsing --> Editing: กด ✏️
    Editing --> Browsing: บันทึก/ยกเลิก
    
    Browsing --> Deleting: กด 🗑️
    Deleting --> Browsing: ยืนยันลบ
    
    Browsing --> AddingWord: กด [+]
    AddingWord --> Browsing: บันทึก/ยกเลิก
    
    Browsing --> [*]: ออกจากหน้า
```

---

## 9. Entity Relationship Diagram (IndexedDB)

```mermaid
erDiagram
    CONVERSATIONS {
        string id PK
        string scenario
        string title
        json messages
        number createdAt
        number updatedAt
        string handoffContext
    }

    ERROR_DASHBOARD {
        string id PK
        number totalErrors
        number totalConversations
        json errorBreakdown
        number lastUpdated
    }

    USER_VOCAB {
        string id PK
        string word
        string phonetic
        string thaiMeaning
        string partOfSpeech
        json examples
        string category
        number createdAt
    }

    VOCAB_PROGRESS {
        string word PK
        boolean mastered
        number lastReviewed
        number reviewCount
    }

    USER_VOCAB ||--o{ VOCAB_PROGRESS : "tracks progress for"
```

---

## เอกสารอ้างอิง

| เอกสาร | ลิงก์ |
|---|---|
| BRD | [01-brd.md](./01-brd.md) |
| FRD | [02-frd.md](./02-frd.md) |
| Use Case Spec | [05-use-case-spec.md](./05-use-case-spec.md) |
| BPMN / Process Flow | [06-bpmn.md](./06-bpmn.md) |
| Wireframe | [07-wireframe.md](./07-wireframe.md) |
