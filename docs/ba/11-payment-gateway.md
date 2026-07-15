# 💳 Payment Gateway Integration — Sequence, State & Edge Cases

| ฟิลด์ | รายละเอียด |
|---|---|
| **ชื่อโปรเจกต์** | Vibe Talk — แอปฝึกสนทนาภาษาอังกฤษด้วย AI |
| **เวอร์ชัน** | 2.0 (Payment Integration) |
| **วันที่จัดทำ** | 15 กรกฎาคม 2569 |
| **ผู้จัดทำ** | ทีม Business Analyst |
| **สถานะ** | Draft — รอ Review |

---

## 1. Business Context: ทำไมต้องมี Payment?

ปัจจุบัน Vibe Talk ให้ผู้ใช้ **นำ API Key ของตัวเองมาใช้** (Bring Your Own Key) ซึ่งมี Pain Points:
- ผู้ใช้ต้องสมัคร DeepSeek ด้วยตัวเอง (แรงเสียดทานสูง)
- ผู้ใช้ต้องจัดการบัตรเครดิต/เติมเงินกับ DeepSeek โดยตรง
- ไม่มี Revenue Stream สำหรับ Vibe Talk

**Payment Gateway จะเปลี่ยนโมเดลเป็น:**
- Vibe Talk จัดการ API Key ฝั่ง Server (ผู้ใช้ไม่ต้องมี Key เอง)
- ผู้ใช้เลือก **แพ็กเกจ** (ตามจำนวนข้อความ/โทเค็น) หรือ **Subscription รายเดือน**
- Vibe Talk เป็นตัวกลาง รับเงิน → จ่ายค่า API ให้ DeepSeek

### Pricing Model (Proposed)

| แพ็กเกจ | ราคา | จำนวนข้อความ | เหมาะสำหรับ |
|---|---|---|---|
| Free | 0 บาท | 50 ข้อความ/เดือน | ทดลองใช้งาน |
| Basic | 99 บาท/เดือน | 500 ข้อความ/เดือน | ผู้ใช้ทั่วไป |
| Pro | 199 บาท/เดือน | 2,000 ข้อความ/เดือน | ใช้งานหนัก |
| One-time Boost | 49 บาท | 200 ข้อความ (ไม่มีวันหมดอายุ) | ใช้งานชั่วคราว |

---

## 2. Architecture Change: Client-Only → Client + Backend

### Before (v1.0 — No Payment)

```
Browser (PWA) ──────> DeepSeek API (ตรง)
         │
         └── IndexedDB (local)
```

### After (v2.0 — With Payment)

```
                          ┌─────────────────────────┐
                          │    Payment Gateway       │
                          │  Omise / 2C2P / Stripe  │
                          └──────────┬──────────────┘
                                     │ Webhook
┌──────────────┐    HTTP     ┌───────▼────────┐    API Key    ┌──────────────┐
│  Browser     │ ──────────> │  Vibe Talk     │ ────────────> │  DeepSeek    │
│  (PWA)       │ <────────── │  Backend       │ <──────────── │  API         │
│              │             │  (Next.js API) │               │              │
│  IndexedDB   │             │                │               └──────────────┘
│  (local)     │             │  PostgreSQL /  │
└──────────────┘             │  Supabase      │
                             └────────────────┘
```

**สิ่งที่เพิ่มเข้ามา:**
- **Next.js API Routes** (หรือแยก Backend Service)
- **Database** (PostgreSQL/Supabase) สำหรับ: User, Payment Transactions, Token Balance, Subscription
- **Auth System** (Simple JWT หรือ NextAuth) — จำเป็นเพราะต้องระบุตัวตนก่อนจ่ายเงิน
- **Payment Gateway** (Omise แนะนำสำหรับตลาดไทย)

---

## 3. Sequence Diagram: การซื้อแพ็กเกจ (Happy Path)

```mermaid
sequenceDiagram
    actor User as 👤 ผู้ใช้
    participant App as PWA (Browser)
    participant Backend as Vibe Talk Backend
    participant DB as Database
    participant PG as Payment Gateway<br/>(Omise)
    participant AI as DeepSeek API

    Note over User,AI: 🟢 HAPPY PATH — ซื้อแพ็กเกจ Basic 99 บาท/เดือน

    User->>App: เลือกแพ็กเกจ "Basic 99 บาท/เดือน"
    App->>Backend: POST /api/payment/create<br/>{plan: "basic_monthly"}

    Backend->>DB: INSERT INTO payments<br/>(user_id, plan, amount, status='pending')
    DB-->>Backend: payment_id = "pay_abc123"

    Backend->>PG: Create Charge / Payment Intent<br>amount: 9900 (satang), currency: THB
    PG-->>Backend: charge_id = "chrg_xyz", authorize_uri

    Backend-->>App: { payment_url, payment_id }

    App->>PG: Redirect ผู้ใช้ไปหน้า Payment Gateway
    Note over PG: ผู้ใช้กรอกบัตรเครดิต / สแกน QR PromptPay

    PG->>User: แสดงหน้าจ่ายเงิน
    User->>PG: ยืนยันการจ่ายเงิน

    PG->>PG: ประมวลผลการชำระเงิน
    PG->>Backend: Webhook: POST /api/payment/webhook<br/>{charge_id: "chrg_xyz", status: "successful"}

    Backend->>Backend: ตรวจสอบ Signature (HMAC)
    
    alt Signature ถูกต้อง
        Backend->>DB: UPDATE payments SET status='paid'<br>WHERE charge_id = 'chrg_xyz'
        Backend->>DB: INSERT/UPDATE subscription<br/>(user_id, plan, tokens_remaining=500, expires_at=30days)
        Backend-->>PG: HTTP 200 OK
    else Signature ไม่ถูกต้อง
        Backend-->>PG: HTTP 403 Forbidden
    end

    PG->>App: Redirect กลับมาที่แอป (Return URL)
    App->>Backend: GET /api/payment/status/pay_abc123
    Backend-->>App: { status: "paid", tokens: 500 }

    App->>User: 🎉 แสดงข้อความ "ชำระเงินสำเร็จ! คุณมี 500 ข้อความ"
    
    Note over User,AI: ผู้ใช้เริ่มสนทนา — ระบบหัก Token
    User->>App: พิมพ์ข้อความ + ส่ง
    App->>Backend: POST /api/chat/send<br/>{message: "Hello", conversation_id: "..."}
    
    Backend->>DB: SELECT tokens_remaining FROM subscriptions<br/>WHERE user_id = ?
    DB-->>Backend: tokens_remaining = 500
    
    alt tokens > 0
        Backend->>Backend: หัก 1 token
        Backend->>DB: UPDATE subscriptions SET tokens_remaining = 499
        Backend->>AI: เรียก DeepSeek API (ใช้ API Key ของระบบ)
        AI-->>Backend: AI Response + Corrections
        Backend-->>App: { reply: "...", corrections: [...], tokens_left: 499 }
    else tokens = 0
        Backend-->>App: { error: "TOKENS_EXHAUSTED", message: "ข้อความของคุณหมดแล้ว" }
    end
```

---

## 4. Sequence Diagram: Edge Cases ทั้งหมด

### 4a. ผู้ใช้ยกเลิกก่อนจ่ายเงิน (Payment Abandoned)

```mermaid
sequenceDiagram
    actor User as 👤 ผู้ใช้
    participant App as PWA
    participant PG as Payment Gateway
    participant Backend as Backend

    User->>App: เลือกแพ็กเกจ
    App->>Backend: POST /api/payment/create
    Backend-->>App: payment_url
    App->>PG: Redirect ไปหน้า Gateway
    User->>PG: ❌ กดปิด / ยกเลิก / Back
    
    PG->>App: Redirect กลับ (cancel URL)
    App->>Backend: GET /api/payment/status/pay_abc123
    Backend->>App: { status: "pending" }

    App->>User: แสดง "การชำระเงินยังไม่เสร็จสมบูรณ์"
    App->>User: เสนอปุ่ม "ลองอีกครั้ง" หรือ "เลือกแพ็กเกจอื่น"

    Note over Backend: Payment ยังค้างที่ status='pending'<br/>Scheduled Job จะ Expire หลัง 24 ชม.
```

### 4b. จ่ายเงินสำเร็จ แต่ Webhook มาช้า / ไม่มา (Webhook Latency / Missing)

```mermaid
sequenceDiagram
    actor User as 👤 ผู้ใช้
    participant App as PWA
    participant Backend as Backend
    participant PG as Payment Gateway

    User->>PG: จ่ายเงินสำเร็จที่หน้า Gateway
    PG->>App: Redirect กลับแอป (Return URL)
    
    App->>Backend: GET /api/payment/status/pay_abc123
    Backend->>DB: SELECT status FROM payments WHERE id = 'pay_abc123'
    DB-->>Backend: status = 'pending' (Webhook ยังไม่มา!)

    Note over Backend: 🔄 Fallback: Backend เรียก Payment Gateway โดยตรง<br/>GET /charges/chrg_xyz (Server-side Verify)

    Backend->>PG: GET /charges/chrg_xyz
    PG-->>Backend: { status: "successful", paid: true }

    Backend->>DB: UPDATE payments SET status='paid'
    Backend->>DB: INSERT subscription (tokens=500)
    Backend-->>App: { status: "paid", tokens: 500 }
    App->>User: ✅ "ชำระเงินสำเร็จ!"

    Note over Backend: ต่อมา Webhook ก็มาถึง (Delayed)<br/>Backend เช็ค Idempotency → ไม่ทำซ้ำ<br/>ตอบ 200 OK
```

### 4c. จ่ายเงินสำเร็จ แต่ Backend Error ตอนเติม Token (Partial Failure)

```mermaid
sequenceDiagram
    actor User as 👤 ผู้ใช้
    participant PG as Payment Gateway
    participant Backend as Backend
    participant DB as Database

    PG->>Backend: Webhook: charge_id = "chrg_xyz", status = "successful"
    Backend->>Backend: ✅ ตรวจสอบ Signature → Valid
    Backend->>DB: UPDATE payments SET status='paid' → ✅ สำเร็จ
    Backend->>DB: INSERT INTO subscriptions (...) → ❌ DATABASE ERROR!

    Note over Backend: ⚠️ จ่ายเงินแล้วแต่ยังไม่ได้ Token!<br/>Critical Bug — ต้องมี Compensation

    Backend->>Backend: Log Error + ส่ง Alert แจ้งทีม
    Backend-->>PG: ❌ HTTP 500 (เพื่อให้ Gateway Retry Webhook)

    Note over PG,Backend: Gateway จะ Retry Webhook ตาม schedule:<br/>1 นาที → 5 นาที → 15 นาที → 1 ชม. → 4 ชม. → 24 ชม.

    PG->>Backend: 🔄 Webhook Retry #2
    Backend->>DB: Re-attempt INSERT subscription → ✅ สำเร็จ
    Backend-->>PG: HTTP 200 OK

    Note over Backend: ผู้ใช้ได้รับ Token แล้ว (อาจ Delay เล็กน้อย)<br/>ควรมีหน้า "ประวัติการชำระเงิน" ให้ผู้ใช้เช็คสถานะเองได้
```

### 4d. จ่ายเงินไม่สำเร็จ — บัตรถูกปฏิเสธ (Payment Declined)

```mermaid
sequenceDiagram
    actor User as 👤 ผู้ใช้
    participant PG as Payment Gateway
    participant App as PWA
    participant Backend as Backend

    User->>PG: กรอกข้อมูลบัตรเครดิต → Submit
    PG->>PG: ตรวจสอบกับธนาคาร
    PG-->>User: ❌ การชำระเงินถูกปฏิเสธ<br/>เหตุผล: เงินไม่พอ / บัตรหมดอายุ / CVV ผิด

    PG->>App: Redirect กลับแอป (failure URL)
    App->>User: แสดงเหตุผลที่ชำระเงินไม่สำเร็จ
    App->>User: เสนอให้ลองใหม่ หรือเปลี่ยนวิธีชำระเงิน

    Note over Backend: Payment status ยังเป็น 'pending'<br/>ถ้าไม่ Retry → Expire หลัง 24 ชม.
```

### 4e. จ่ายเงินซ้ำซ้อน (Duplicate Payment / Double Click)

```mermaid
sequenceDiagram
    actor User as 👤 ผู้ใช้
    participant App as PWA
    participant Backend as Backend
    participant PG as Payment Gateway

    Note over User,PG: ผู้ใช้กด "จ่ายเงิน" 2 ครั้งเร็ว ๆ (Double Click)

    User->>App: กด "จ่ายเงิน" ครั้งที่ 1
    App->>Backend: POST /api/payment/create
    Backend->>DB: INSERT payment (idempotency_key = "order_456")
    Backend-->>App: payment_url_1

    User->>App: กด "จ่ายเงิน" ครั้งที่ 2 (Double Click!)
    App->>Backend: POST /api/payment/create<br/>(idempotency_key = "order_456" เหมือนเดิม)
    
    Backend->>DB: SELECT * FROM payments<br/>WHERE idempotency_key = 'order_456'
    DB-->>Backend: พบแล้ว! payment_id = "pay_abc123", status = 'pending'
    
    Backend-->>App: { payment_url: payment_url_1, payment_id: "pay_abc123" }
    Note over Backend: ✅ ไม่สร้าง Payment ซ้ำ!<br/>คืน payment_url เดิมให้ผู้ใช้

    Note over User,PG: ผู้ใช้จ่ายเงินผ่าน payment_url เดิม → สำเร็จ
    PG->>Backend: Webhook: charge success
    Backend->>DB: UPDATE payments SET status='paid'
    
    Note over Backend: ✅ Idempotency Key ป้องกันการจ่ายซ้ำ<br/>และการเติม Token ซ้ำ
```

### 4f. ผู้ใช้ขอ Refund / Chargeback

```mermaid
sequenceDiagram
    actor User as 👤 ผู้ใช้
    actor Admin as 👩‍💼 Admin
    participant Backend as Backend
    participant DB as Database
    participant PG as Payment Gateway

    Note over User,PG: 🟡 EDGE CASE — Refund

    User->>Admin: ขอ Refund (ผ่านอีเมล/แชท)
    Admin->>Backend: Dashboard: ค้นหา Payment ID = "pay_abc123"
    Backend->>DB: SELECT payments + subscriptions
    DB-->>Backend: status='paid', tokens_used=30/500

    Admin->>Admin: ตรวจสอบเงื่อนไข Refund:<br/>- ซื้อมา < 7 วัน? ✅<br/>- ใช้ไป < 10%? ✅ (30/500=6%)

    Admin->>Backend: POST /api/admin/refund<br/>{payment_id: "pay_abc123", reason: "ผู้ใช้ขอคืนเงิน"}

    Backend->>PG: Create Refund: POST /charges/chrg_xyz/refunds<br/>{amount: 9900} (เต็มจำนวน)

    alt Gateway อนุมัติ Refund
        PG-->>Backend: { status: "successful", refund_id: "rfnd_001" }
        Backend->>DB: UPDATE payments SET status='refunded'
        Backend->>DB: UPDATE subscriptions SET tokens_remaining=0, status='revoked'
        Backend-->>Admin: ✅ Refund สำเร็จ
        Backend->>User: ส่งอีเมล/แจ้งเตือน: "เงินคืนแล้ว 99 บาท"
    else Gateway ปฏิเสธ Refund (เกินเวลา)
        PG-->>Backend: { error: "refund_period_expired" }
        Backend-->>Admin: ❌ ไม่สามารถ Refund ได้ — เกินระยะเวลา
    end
```

### 4g. Subscription Renewal ล้มเหลว (Recurring Payment Failed)

```mermaid
sequenceDiagram
    actor User as 👤 ผู้ใช้
    participant Backend as Backend
    participant DB as Database
    participant PG as Payment Gateway
    participant App as PWA

    Note over User,App: 🟡 EDGE CASE — ต่ออายุ Subscription อัตโนมัติล้มเหลว

    Note over Backend: Cron Job: 00:00 ทุกวัน<br/>SELECT subscriptions WHERE expires_at <= NOW() + 3days<br/>AND status = 'active'

    Backend->>PG: Create Charge (Recurring) → ต่ออายุ Basic 99 บาท
    PG-->>Backend: ❌ Declined: insufficient_funds / card_expired

    Backend->>DB: UPDATE subscriptions<br/>SET renewal_status='failed', failed_attempts = 1

    Backend->>App: Push Notification / Email:<br/>"❌ ต่ออายุไม่สำเร็จ — กรุณาอัปเดตวิธีชำระเงิน"

    loop Retry ทุก 1 วัน (สูงสุด 3 ครั้ง)
        Note over Backend: 24 ชม. ต่อมา...
        Backend->>PG: Retry Charge → ❌ ยังล้มเหลว
        Backend->>DB: failed_attempts = 2
        Backend->>App: แจ้งเตือนครั้งที่ 2
    end

    Note over Backend: failed_attempts = 3 → เกินจำนวน Retry
    
    Backend->>DB: UPDATE subscriptions<br/>SET status='expired', tokens_remaining=0
    
    Backend->>App: Push Notification:<br/>"⏰ Subscription ของคุณหมดอายุแล้ว<br/>สมัครใหม่เพื่อใช้งานต่อ"
    
    User->>App: เลือกแพ็กเกจใหม่ → ชำระเงิน → Re-activate
```

---

## 5. State Diagram: Payment Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Pending: ผู้ใช้คลิก "จ่ายเงิน"

    state Pending {
        [*] --> AwaitingPayment: รอผู้ใช้จ่ายที่ Gateway
        AwaitingPayment --> Expired: เกิน 24 ชม. ไม่จ่าย
        AwaitingPayment --> AwaitingConfirmation: ผู้ใช้จ่ายแล้วที่ Gateway
    }

    Pending --> Processing: Webhook ได้รับ<br/>(กำลังตรวจสอบ + เติม token)

    state Processing {
        [*] --> VerifyingPayment: ตรวจสอบ Signature
        VerifyingPayment --> GrantingTokens: เติม Token/Subscription
        VerifyingPayment --> SignatureInvalid: Signature ไม่ถูกต้อง
    }

    Processing --> Paid: เติม Token สำเร็จ

    state Paid {
        [*] --> Active: ผู้ใช้ใช้ Token ได้
        Active --> TokensExhausted: Token หมด
        Active --> Expired_Subscription: Subscription หมดอายุ
    }

    Pending --> Failed: Gateway ปฏิเสธ (Declined)
    Pending --> Cancelled: ผู้ใช้ยกเลิก

    Paid --> Refunded: Admin ทำ Refund
    Paid --> Chargeback: ผู้ใช้ Dispute กับธนาคาร

    Expired --> [*]
    Failed --> [*]
    Cancelled --> [*]
    Refunded --> [*]
    Chargeback --> [*]
    SignatureInvalid --> [*]

    note right of Paid
        Transition ไป Token หมด:
        - แจ้งผู้ใช้
        - เสนอแพ็กเกจใหม่
    end note

    note right of Chargeback
        Chargeback ต่างจาก Refund:
        - ธนาคารเป็นผู้ดำเนินการ
        - Vibe Talk เสียค่าธรรมเนียมเพิ่ม
        - อาจต้องระงับ User Account
    end note
```

---

## 6. State Diagram: Subscription Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Inactive: ยังไม่เคยสมัคร

    Inactive --> Active: จ่ายเงินสำเร็จ (ครั้งแรก)

    state Active {
        [*] --> HasTokens: มี Token เหลือ
        HasTokens --> LowTokens: Token < 20% ของแพ็ก
        LowTokens --> TokenExhausted: Token = 0
        TokenExhausted --> HasTokens: ซื้อ Boost / รอ Renewal
    }

    Active --> GracePeriod: Subscription หมดอายุ<br/>แต่ยังไม่ Renew

    state GracePeriod {
        [*] --> Retrying: ระบบพยายามต่ออายุอัตโนมัติ
        Retrying --> Renewed: จ่ายสำเร็จ → กลับ Active
        Retrying --> RetryFailed: Retry 3 ครั้งล้มเหลว
    }

    GracePeriod --> Expired: Retry ทั้งหมดล้มเหลว

    Active --> Cancelled: ผู้ใช้ยกเลิก Subscription
    Cancelled --> Active: Re-subscribe

    Inactive --> Frozen: Admin ระงับ (Abuse)
    Active --> Frozen: Admin ระงับ (Abuse)
    Frozen --> Active: Admin ปลดระงับ

    Expired --> [*]
    Cancelled --> [*]
    Frozen --> [*]

    note left of Active
        Token ใช้ต่อข้อความ:
        - 1 request = 1 token
        - AI Auto-fill = 1 token
        - Spell Check = 0 token (ฟรี)
    end note
```

---

## 7. Happy Path & Edge Cases — สรุปตาราง

### 7.1 Happy Path

| # | Scenario | Trigger | Flow | Expected Outcome |
|---|---|---|---|---|
| HP-01 | ซื้อแพ็กเกจครั้งแรก | ผู้ใช้เลือกแพ็กเกจ + จ่ายเงินสำเร็จ | Create Payment → Redirect Gateway → Pay → Webhook → Grant Tokens | ผู้ใช้ได้ Token ตามแพ็กเกจ ใช้งาน AI ได้ทันที |
| HP-02 | ต่ออายุ Subscription อัตโนมัติ | Cron Job ตรวจ到期 | Charge Recurring → Success → Reset Token → Extend expires_at | ต่ออายุสำเร็จ ผู้ใช้ไม่ต้องทำอะไร |
| HP-03 | ซื้อ Boost เพิ่มระหว่างรอบ | ผู้ใช้กด "เติมข้อความ" | Create Boost Payment → Pay → Add Tokens to existing subscription | Token เพิ่มใน subscription ปัจจุบัน |
| HP-04 | ดูประวัติการจ่ายเงิน | ผู้ใช้เปิด Billing History | GET /api/payment/history | เห็นรายการ: วันที่, แพ็กเกจ, จำนวนเงิน, สถานะ |

### 7.2 Edge Cases

| # | Scenario | Severity | Mitigation |
|---|---|---|---|
| EC-01 | **Webhook ไม่มา** (Network Issue ฝั่ง Gateway) | 🔴 Critical | **Server-side Verify**: หลัง Redirect กลับแอป Backend เรียก Gateway โดยตรง (`GET /charges/:id`) เพื่อยืนยันสถานะ |
| EC-02 | **จ่ายเงินแล้วแต่เติม Token ไม่ได้** (DB Error) | 🔴 Critical | **Webhook Retry**: ตอบ 500 ให้ Gateway Retry. มี Idempotency Key เพื่อป้องกันการเติมซ้ำ. ถ้ายังล้มเหลว → Manual Intervention |
| EC-03 | **Double Click จ่ายเงิน** | 🟡 Major | **Idempotency Key**: Backend ตรวจสอบ `idempotency_key` ก่อนสร้าง Payment ใหม่ → คืน payment_url เดิม |
| EC-04 | **Webhook มาหลังจาก Refund แล้ว** | 🟡 Major | ตรวจสอบ Payment Status ก่อนดำเนินการใด ๆ — ถ้า status='refunded' แล้ว → Ignore Webhook |
| EC-05 | **Subscription Renewal ล้มเหลว** (บัตรหมดอายุ) | 🟡 Major | Retry สูงสุด 3 ครั้ง ห่างกัน 24 ชม. + แจ้งเตือนผู้ใช้. หลัง Retry หมด → Expire Subscription |
| EC-06 | **Gateway Timeout** (ผู้ใช้รอนานแล้วไม่ตอบ) | 🟡 Major | แสดง Loading + "กำลังดำเนินการ" พร้อม Timeout 60 วิ → แจ้งให้ผู้ใช้เช็คอีเมลหรือประวัติการชำระเงินภายหลัง |
| EC-07 | **ผู้ใช้ Dispute / Chargeback** | 🔴 Critical | ตรวจสอบหลักฐาน + โต้แย้งกับธนาคาร. ระหว่าง Dispute → Freeze User Account. แยก Log สำหรับ Finance Team |
| EC-08 | **Token หมดกลางบทสนทนา** | 🟢 Minor | ตรวจสอบ Token **ก่อน**เรียก AI → ถ้าเหลือ 0: แจ้งผู้ใช้ + แสดงปุ่ม "เติมข้อความ" |
| EC-09 | **Token เกือบหมด** (Threshold < 20%) | 🟢 Minor | แสดง Banner เตือน: "คุณเหลือข้อความอีก 10 ข้อความ" + ปุ่มเติม |
| EC-10 | **ผู้ใช้ต้องการเปลี่ยนแพ็กเกจกลางรอบ** | 🟡 Major | Prorated Calculation: คำนวณส่วนต่าง + คืนเงิน/เรียกเก็บเพิ่ม → เปลี่ยนแพ็กเกจ |
| EC-11 | **VPN / Proxy จ่ายเงิน** (Fraud Risk) | 🟡 Major | Gateway มักมี Fraud Detection ในตัว. Backend เพิ่ม Rate Limiting: สร้าง Payment ได้ไม่เกิน 3 ครั้ง/วัน |
| EC-12 | **ผู้ใช้ลบ Browser Cache → Token หาย?** | 🟢 Minor | Token เก็บฝั่ง Server (Database) — ไม่ผูกกับ Browser. ผู้ใช้ Login ใหม่ก็เห็น Token เท่าเดิม |

---

## 8. Prorated Calculation: เปลี่ยนแพ็กเกจกลางรอบ

```
ตัวอย่าง: ผู้ใช้สมัคร Basic (99 บาท/เดือน) เมื่อ 1 ก.ค.
         15 ก.ค. ต้องการอัปเกรดเป็น Pro (199 บาท/เดือน)

Step 1: คำนวณมูลค่าคงเหลือของแพ็กเกจเดิม
  Basic 99 บาท / 30 วัน = 3.30 บาท/วัน
  ใช้ไปแล้ว 15 วัน → เหลือ 15 วัน
  มูลค่าคงเหลือ = 15 × 3.30 = 49.50 บาท

Step 2: คำนวณมูลค่าที่ต้องจ่ายสำหรับแพ็กเกจใหม่ (เต็มเดือน)
  Pro 199 บาท

Step 3: ส่วนต่างที่ต้องจ่ายเพิ่ม
  199 - 49.50 = 149.50 บาท

Step 4: สร้าง Payment 149.50 บาท
  → จ่ายเงิน → เปลี่ยนเป็น Pro → Reset 30 วันนับจากวันนี้ → Token = 2,000
```

---

## 9. Database Schema (Proposed)

```mermaid
erDiagram
    USERS {
        uuid id PK
        string email
        string name
        timestamp created_at
        string provider "email|google|apple"
    }

    PAYMENTS {
        uuid id PK
        uuid user_id FK
        string plan "free|basic_monthly|pro_monthly|boost"
        int amount "ในหน่วยสตางค์"
        string currency "THB"
        string status "pending|paid|failed|expired|cancelled|refunded|chargeback"
        string charge_id "จาก Payment Gateway"
        string idempotency_key UK "กันซ้ำ"
        timestamp created_at
        timestamp paid_at
    }

    SUBSCRIPTIONS {
        uuid id PK
        uuid user_id FK
        string plan
        int tokens_total
        int tokens_used
        int tokens_remaining "computed: total - used"
        string status "active|grace_period|expired|cancelled|frozen"
        int failed_renewal_attempts
        timestamp current_period_start
        timestamp current_period_end
        timestamp created_at
    }

    TOKEN_TRANSACTIONS {
        uuid id PK
        uuid user_id FK
        uuid subscription_id FK
        int tokens_deducted
        string reason "chat_message|vocab_autofill|admin_grant|refund_reversal"
        timestamp created_at
    }

    USERS ||--o{ PAYMENTS : has
    USERS ||--o{ SUBSCRIPTIONS : has
    SUBSCRIPTIONS ||--o{ TOKEN_TRANSACTIONS : logs
    PAYMENTS ||--o| SUBSCRIPTIONS : activates
```

---

## 10. Security Considerations

| ด้าน | รายละเอียด |
|---|---|
| **API Key** | DeepSeek API Key เก็บฝั่ง Backend เท่านั้น (Environment Variable) — ไม่ expose ให้ Client |
| **Webhook Signature** | ตรวจสอบ HMAC Signature ทุก Webhook Request — ป้องกัน Fake Webhook |
| **PCI Compliance** | ไม่เก็บบัตรเครดิตเอง — ใช้ Payment Gateway Tokenization (Omise Token API) |
| **HTTPS** | ทุก Endpoint ใช้ HTTPS |
| **Idempotency** | Idempotency Key ทุก Payment Creation + Webhook Handling |
| **Rate Limiting** | จำกัดการสร้าง Payment 3 ครั้ง/วัน/User |
| **Auth** | ทุก API ต้องมี JWT Token — Middleware ตรวจสอบก่อน allow |

---

## 11. ไฟล์ที่ต้องอัปเดตเมื่อมี Payment

หากนำ Payment Gateway มาใช้จริง เอกสาร BA เดิมที่ต้องอัปเดต:

| เอกสาร | สิ่งที่ต้องเพิ่ม |
|---|---|
| `01-brd.md` | Business Model & Revenue Stream, Pricing Strategy |
| `02-frd.md` | FR-M08: Payment Module (7-8 Requirements ใหม่) |
| `03-user-stories.md` | Epic 7: Payment & Subscription (~6 User Stories) |
| `04-acceptance-criteria.md` | AC สำหรับ Payment, Subscription, Token Management |
| `05-use-case-spec.md` | UC-07: Purchase Plan, UC-08: Manage Subscription |
| `06-bpmn.md` | Payment Process Flow |
| `08-uml.md` | เพิ่ม Use Case Diagram, Component Diagram (Backend) |
| `09-rtm.md` | Trace Payment FR → Design → Dev → Test |
| `10-uat.md` | UAT Test Cases สำหรับ Payment Flow |

---

## เอกสารอ้างอิง

| เอกสาร | ลิงก์ |
|---|---|
| BRD | [01-brd.md](./01-brd.md) |
| FRD | [02-frd.md](./02-frd.md) |
| BPMN / Process Flow | [06-bpmn.md](./06-bpmn.md) |
| UML Diagrams | [08-uml.md](./08-uml.md) |
| RTM | [09-rtm.md](./09-rtm.md) |
| UAT Test Cases | [10-uat.md](./10-uat.md) |
