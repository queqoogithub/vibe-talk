# 🔄 BPMN / Process Flow

| ฟิลด์ | รายละเอียด |
|---|---|
| **ชื่อโปรเจกต์** | Vibe Talk — แอปฝึกสนทนาภาษาอังกฤษด้วย AI |
| **เวอร์ชัน** | 1.0 |
| **วันที่จัดทำ** | 3 กุมภาพันธ์ 2568 |
| **ผู้จัดทำ** | ทีม Business Analyst |

---

## 1. ภาพรวมกระบวนการทางธุรกิจ (High-Level Process)

```mermaid
flowchart LR
    A[👤 ผู้ใช้เปิดแอป] --> B{มี API Key?}
    B -->|ไม่มี| C[⚙️ ไปหน้า Settings<br>กรอก API Key]
    C --> A
    B -->|มี| D[🏠 หน้า Chat<br>เลือกสถานการณ์]
    D --> E[💬 สนทนากับ AI]
    E --> F[🔍 AI ตรวจแกรมม่า]
    F --> G[💾 บันทึกลง IndexedDB]
    G --> H{ทำอะไรต่อ?}
    H -->|สนทนาต่อ| E
    H -->|ดู Dashboard| I[📊 ดูสถิติ]
    H -->|จัดการคำศัพท์| J[📚 คลังคำศัพท์]
    H -->|เริ่มใหม่| D
    I --> H
    J --> H
```

---

## 2. Process Flow: การสนทนากับ AI (Chat Flow)

```mermaid
flowchart TD
    Start([เริ่มต้น]) --> SelectScenario[ผู้ใช้เลือกสถานการณ์]
    SelectScenario --> CreateSession[ระบบสร้าง Session ใหม่]
    CreateSession --> SendSystem[ส่ง System Prompt ให้ AI]
    SendSystem --> AIFirstMsg[AI ส่งข้อความทักทาย]
    AIFirstMsg --> DisplayMsg[แสดงข้อความในแชท]
    
    DisplayMsg --> UserType[ผู้ใช้พิมพ์ข้อความ]
    UserType --> CheckEmpty{ข้อความว่าง?}
    CheckEmpty -->|ใช่| UserType
    CheckEmpty -->|ไม่| ShowUserMsg[แสดงข้อความผู้ใช้]
    
    ShowUserMsg --> CallAPI[ส่งข้อความให้ DeepSeek API]
    CallAPI --> CheckNetwork{Network OK?}
    CheckNetwork -->|ไม่| ShowError[แสดง Error: ตรวจสอบเน็ต]
    ShowError --> UserType
    
    CheckNetwork -->|ใช่| AIResponse[AI ตอบกลับ]
    AIResponse --> ParseCorrection{มี Correction?}
    
    ParseCorrection -->|มี| SplitContent[แยกเนื้อหา + Correction JSON]
    SplitContent --> ShowAIMsg[แสดงข้อความ AI]
    SplitContent --> ShowCorrection[แสดงการ์ดแก้ไขแกรมม่า]
    ShowCorrection --> SaveToDB[บันทึกข้อความ + ข้อผิดพลาด]
    
    ParseCorrection -->|ไม่มี| ShowAIMsg2[แสดงข้อความ AI]
    ShowAIMsg2 --> SaveToDB2[บันทึกข้อความลง IndexedDB]
    
    SaveToDB --> UpdateDashboard[อัปเดต Error Dashboard]
    SaveToDB2 --> UpdateDashboard
    
    UpdateDashboard --> UserType
```

---

## 3. Process Flow: การเพิ่มคำศัพท์ (Add Vocabulary)

```mermaid
flowchart TD
    Start([ผู้ใช้กด +]) --> OpenModal[เปิด Modal เพิ่มคำศัพท์]
    OpenModal --> TypeWord[ผู้ใช้พิมพ์คำศัพท์]
    TypeWord --> SpellCheck[ตรวจสอบการสะกดด้วย AI]
    
    SpellCheck --> IsCorrect{สะกดถูก?}
    IsCorrect -->|ไม่| ShowSuggestions[แสดงคำแนะนำ]
    ShowSuggestions --> UserChoose{ผู้ใช้เลือก?}
    UserChoose -->|ใช้คำแนะนำ| TypeWord
    UserChoose -->|ยืนยันคำเดิม| DupCheck
    
    IsCorrect -->|ใช่| DupCheck[ตรวจสอบคำซ้ำ]
    DupCheck --> IsDup{มีในคลังแล้ว?}
    IsDup -->|ใช่| ShowDupAlert[แจ้ง: คำนี้มีอยู่แล้ว]
    ShowDupAlert --> TypeWord
    IsDup -->|ไม่| AIAutoFill[AI เติมข้อมูลอัตโนมัติ]
    
    AIAutoFill --> ShowPrefill[แสดงข้อมูล: Phonetic, Meaning, POS, Category, Examples]
    ShowPrefill --> UserEdit{ผู้ใช้แก้ไข?}
    UserEdit -->|แก้ไข| EditFields[ผู้ใช้แก้ไขข้อมูล]
    EditFields --> Save
    UserEdit -->|ไม่แก้| Save[กดบันทึก]
    
    Save --> SaveDB[บันทึกลง IndexedDB]
    SaveDB --> CloseModal[ปิด Modal]
    CloseModal --> RefreshList[รีเฟรช Flashcard List]
    RefreshList --> End([จบ])
```

---

## 4. Process Flow: การทำเครื่องหมายรู้แล้ว/ยังไม่รู้ (Mastery Tracking)

```mermaid
flowchart TD
    Start([กำลังดู Flashcard]) --> ViewWord[แสดงคำศัพท์]
    ViewWord --> CheckState{สถานะปัจจุบัน?}
    
    CheckState -->|ยังไม่รู้| ShowMastered[แสดงปุ่ม ✅ รู้แล้ว]
    ShowMastered --> UserMark[ผู้ใช้กด ✅ รู้แล้ว]
    UserMark --> SaveMastered[บันทึก mastered=true<br>lastReviewed=now<br>reviewCount++]
    SaveMastered --> UpdateProgress[อัปเดต Progress Bar]
    UpdateProgress --> End([จบ])
    
    CheckState -->|รู้แล้ว| ShowUnmaster[แสดงปุ่ม ❌ ยังไม่รู้]
    ShowUnmaster --> UserUnmark[ผู้ใช้กด ❌]
    UserUnmark --> SaveUnmastered[บันทึก mastered=false<br>lastReviewed=now<br>reviewCount=0]
    SaveUnmastered --> UpdateProgress
```

---

## 5. Process Flow: ติดตั้ง PWA (Installation)

```mermaid
flowchart TD
    Start([ผู้ใช้เปิดแอปใน Browser]) --> CheckSupport{Browser รองรับ PWA?}
    
    CheckSupport -->|ไม่รองรับ| NormalUse[ใช้งานผ่าน Browser ปกติ]
    NormalUse --> End([จบ])
    
    CheckSupport -->|รองรับ| CheckPlatform{Platform?}
    CheckPlatform -->|iOS Safari| ShowBanner[แสดง Banner: แนะนำวิธีติดตั้ง<br>Share → Add to Home Screen]
    ShowBanner --> UserActionIos{ผู้ใช้ทำตาม?}
    UserActionIos -->|ใช่| Installed[แอปติดตั้ง, ใช้ Full Screen]
    UserActionIos -->|ไม่| NormalUse
    
    CheckPlatform -->|Android Chrome / Desktop Chrome| FireEvent[Browser เรียก beforeinstallprompt]
    FireEvent --> ShowInstallBtn[แสดงปุ่ม: ติดตั้งแอป]
    ShowInstallBtn --> UserClick{ผู้ใช้กดติดตั้ง?}
    UserClick -->|ใช่| SystemDialog[Browser แสดง Dialog ติดตั้ง]
    SystemDialog --> UserConfirm{ยืนยัน?}
    UserConfirm -->|ใช่| Installed
    UserConfirm -->|ไม่| ShowInstallBtn
    UserClick -->|ไม่| NormalUse
    
    Installed --> End
```

---

## 6. Cross-Functional Flow: Session Lifecycle

```mermaid
flowchart LR
    subgraph Frontend["Frontend (Browser)"]
        A[เลือก Scenario] --> B[สร้าง Session ID]
        B --> C[แสดง UI Chat]
        C --> D[ผู้ใช้พิมพ์ข้อความ]
        D --> E[แสดง Loading]
        E --> F[แสดง AI Response]
        F --> G[แสดง Corrections]
        G --> H[บันทึก IndexedDB]
    end
    
    subgraph AI["DeepSeek API"]
        E2[รับ Request] --> E3[ประมวลผล<br>System Prompt + History]
        E3 --> E4[Generate Response<br>+ Corrections]
        E4 --> E5[ส่ง Response กลับ]
    end
    
    E -->|HTTP POST| E2
    E5 -->|JSON Response| F
```

---

## 7. Data Flow: ข้อมูลใน IndexedDB

```mermaid
flowchart TD
    subgraph IndexedDB["IndexedDB: vibe-talk-db"]
        Conv[("🗂️ conversations<br>keyPath: id<br>index: updatedAt")]
        Dash[("📊 errorDashboard<br>keyPath: id")]
        Vocab[("📚 userVocab<br>keyPath: id")]
        Prog[("✅ vocabProgress<br>keyPath: word")]
    end
    
    ChatModule[Chat Module] -->|saveConversation<br>getConversation<br>getAllConversations<br>deleteConversation| Conv
    ChatModule -->|trackError<br>getErrorDashboard<br>incrementConversationCount| Dash
    VocabModule[Vocabulary Module] -->|addUserWord<br>updateUserWord<br>deleteUserWord<br>getAllUserWords| Vocab
    VocabModule -->|markWordMastered<br>markWordUnmastered<br>getAllVocabProgress| Prog
```

---

## เอกสารอ้างอิง

| เอกสาร | ลิงก์ |
|---|---|
| BRD | [01-brd.md](./01-brd.md) |
| FRD | [02-frd.md](./02-frd.md) |
| Use Case Spec | [05-use-case-spec.md](./05-use-case-spec.md) |
| UML Diagrams | [08-uml.md](./08-uml.md) |
