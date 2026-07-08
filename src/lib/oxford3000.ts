import type { VocabWord } from "./types";

// Subset of Oxford 3000 words organized by category
// Reference: Oxford 3000™ – the most important words to know in English

export const OXFORD_WORDS: VocabWord[] = [
  // ─── Daily Life ─────────────────────────────────────────
  {
    word: "arrange",
    phonetic: "/əˈreɪndʒ/",
    thaiMeaning: "จัด, จัดการ",
    partOfSpeech: "v.",
    examples: [
      "Can we arrange a meeting for tomorrow?",
      "She arranged the flowers in a vase.",
    ],
    category: "daily-life",
  },
  {
    word: "available",
    phonetic: "/əˈveɪləbl/",
    thaiMeaning: "ว่าง, มีอยู่, หาได้",
    partOfSpeech: "adj.",
    examples: [
      "Are you available this afternoon?",
      "The book is available online.",
    ],
    category: "daily-life",
  },
  {
    word: "borrow",
    phonetic: "/ˈbɒrəʊ/",
    thaiMeaning: "ยืม",
    partOfSpeech: "v.",
    examples: [
      "Can I borrow your pen?",
      "I borrowed a book from the library.",
    ],
    category: "daily-life",
  },
  {
    word: "convenient",
    phonetic: "/kənˈviːniənt/",
    thaiMeaning: "สะดวก",
    partOfSpeech: "adj.",
    examples: [
      "Is this a convenient time for you?",
      "The location is very convenient.",
    ],
    category: "daily-life",
  },
  {
    word: "decide",
    phonetic: "/dɪˈsaɪd/",
    thaiMeaning: "ตัดสินใจ",
    partOfSpeech: "v.",
    examples: [
      "I can't decide what to wear.",
      "We decided to stay home.",
    ],
    category: "daily-life",
  },
  {
    word: "depend",
    phonetic: "/dɪˈpend/",
    thaiMeaning: "ขึ้นอยู่กับ",
    partOfSpeech: "v.",
    examples: [
      "It depends on the weather.",
      "You can depend on me.",
    ],
    category: "daily-life",
  },
  {
    word: "expect",
    phonetic: "/ɪkˈspekt/",
    thaiMeaning: "คาดหวัง, คาดว่า",
    partOfSpeech: "v.",
    examples: [
      "I expect to arrive by noon.",
      "What do you expect from this job?",
    ],
    category: "daily-life",
  },
  {
    word: "manage",
    phonetic: "/ˈmænɪdʒ/",
    thaiMeaning: "จัดการ, ควบคุม",
    partOfSpeech: "v.",
    examples: [
      "How do you manage your time?",
      "I managed to finish on time.",
    ],
    category: "daily-life",
  },
  {
    word: "prepare",
    phonetic: "/prɪˈpeər/",
    thaiMeaning: "เตรียม",
    partOfSpeech: "v.",
    examples: [
      "I need to prepare for the exam.",
      "She prepared a delicious meal.",
    ],
    category: "daily-life",
  },
  {
    word: "suggest",
    phonetic: "/səˈdʒest/",
    thaiMeaning: "แนะนำ, เสนอแนะ",
    partOfSpeech: "v.",
    examples: [
      "What do you suggest?",
      "I suggest we leave early.",
    ],
    category: "daily-life",
  },

  // ─── Food & Drink ────────────────────────────────────────
  {
    word: "bitter",
    phonetic: "/ˈbɪtər/",
    thaiMeaning: "ขม",
    partOfSpeech: "adj.",
    examples: [
      "This coffee is too bitter.",
      "Dark chocolate has a bitter taste.",
    ],
    category: "food-drink",
  },
  {
    word: "delicious",
    phonetic: "/dɪˈlɪʃəs/",
    thaiMeaning: "อร่อย",
    partOfSpeech: "adj.",
    examples: ["This meal is delicious!", "The cake looks delicious."],
    category: "food-drink",
  },
  {
    word: "flavor",
    phonetic: "/ˈfleɪvər/",
    thaiMeaning: "รสชาติ",
    partOfSpeech: "n.",
    examples: [
      "What flavor would you like?",
      "This has a strong flavor.",
    ],
    category: "food-drink",
  },
  {
    word: "fresh",
    phonetic: "/freʃ/",
    thaiMeaning: "สด, ใหม่",
    partOfSpeech: "adj.",
    examples: [
      "I prefer fresh vegetables.",
      "The bread is still fresh.",
    ],
    category: "food-drink",
  },
  {
    word: "ingredient",
    phonetic: "/ɪnˈɡriːdiənt/",
    thaiMeaning: "ส่วนผสม",
    partOfSpeech: "n.",
    examples: [
      "What ingredients do we need?",
      "Fresh ingredients make a difference.",
    ],
    category: "food-drink",
  },
  {
    word: "spicy",
    phonetic: "/ˈspaɪsi/",
    thaiMeaning: "เผ็ด",
    partOfSpeech: "adj.",
    examples: [
      "Is this dish spicy?",
      "I love spicy food.",
    ],
    category: "food-drink",
  },
  {
    word: "starving",
    phonetic: "/ˈstɑːrvɪŋ/",
    thaiMeaning: "หิวมาก",
    partOfSpeech: "adj.",
    examples: [
      "I'm starving! Let's eat.",
      "She was starving after the hike.",
    ],
    category: "food-drink",
  },
  {
    word: "taste",
    phonetic: "/teɪst/",
    thaiMeaning: "รสชาติ, ชิม",
    partOfSpeech: "n./v.",
    examples: [
      "Would you like to taste it?",
      "It has a sweet taste.",
    ],
    category: "food-drink",
  },

  // ─── Travel ──────────────────────────────────────────────
  {
    word: "abroad",
    phonetic: "/əˈbrɔːd/",
    thaiMeaning: "ต่างประเทศ",
    partOfSpeech: "adv.",
    examples: [
      "Have you ever traveled abroad?",
      "I plan to study abroad.",
    ],
    category: "travel",
  },
  {
    word: "accommodation",
    phonetic: "/əˌkɒməˈdeɪʃn/",
    thaiMeaning: "ที่พัก",
    partOfSpeech: "n.",
    examples: [
      "Did you find accommodation?",
      "The accommodation was comfortable.",
    ],
    category: "travel",
  },
  {
    word: "arrival",
    phonetic: "/əˈraɪvl/",
    thaiMeaning: "การมาถึง",
    partOfSpeech: "n.",
    examples: [
      "What is your arrival time?",
      "We waited for his arrival.",
    ],
    category: "travel",
  },
  {
    word: "destination",
    phonetic: "/ˌdestɪˈneɪʃn/",
    thaiMeaning: "จุดหมายปลายทาง",
    partOfSpeech: "n.",
    examples: [
      "What's your final destination?",
      "Thailand is a popular destination.",
    ],
    category: "travel",
  },
  {
    word: "luggage",
    phonetic: "/ˈlʌɡɪdʒ/",
    thaiMeaning: "กระเป๋าเดินทาง",
    partOfSpeech: "n.",
    examples: [
      "How many pieces of luggage?",
      "I lost my luggage at the airport.",
    ],
    category: "travel",
  },
  {
    word: "passenger",
    phonetic: "/ˈpæsɪndʒər/",
    thaiMeaning: "ผู้โดยสาร",
    partOfSpeech: "n.",
    examples: [
      "All passengers must check in.",
      "The bus was full of passengers.",
    ],
    category: "travel",
  },
  {
    word: "reservation",
    phonetic: "/ˌrezərˈveɪʃn/",
    thaiMeaning: "การจอง",
    partOfSpeech: "n.",
    examples: [
      "I have a reservation.",
      "Can I make a reservation?",
    ],
    category: "travel",
  },
  {
    word: "sightseeing",
    phonetic: "/ˈsaɪtsiːɪŋ/",
    thaiMeaning: "การเที่ยวชม",
    partOfSpeech: "n.",
    examples: [
      "We went sightseeing all day.",
      "Do you enjoy sightseeing?",
    ],
    category: "travel",
  },

  // ─── Work & Business ─────────────────────────────────────
  {
    word: "achieve",
    phonetic: "/əˈtʃiːv/",
    thaiMeaning: "บรรลุ, ประสบความสำเร็จ",
    partOfSpeech: "v.",
    examples: [
      "I want to achieve my goals.",
      "She achieved great success.",
    ],
    category: "work-business",
  },
  {
    word: "application",
    phonetic: "/ˌæplɪˈkeɪʃn/",
    thaiMeaning: "ใบสมัคร, การสมัคร",
    partOfSpeech: "n.",
    examples: [
      "I submitted my application.",
      "Your application was approved.",
    ],
    category: "work-business",
  },
  {
    word: "colleague",
    phonetic: "/ˈkɒliːɡ/",
    thaiMeaning: "เพื่อนร่วมงาน",
    partOfSpeech: "n.",
    examples: [
      "My colleague helped me.",
      "I get along with my colleagues.",
    ],
    category: "work-business",
  },
  {
    word: "deadline",
    phonetic: "/ˈdedlaɪn/",
    thaiMeaning: "กำหนดส่ง",
    partOfSpeech: "n.",
    examples: [
      "The deadline is Friday.",
      "I need to meet the deadline.",
    ],
    category: "work-business",
  },
  {
    word: "opportunity",
    phonetic: "/ˌɒpəˈtjuːnəti/",
    thaiMeaning: "โอกาส",
    partOfSpeech: "n.",
    examples: [
      "This is a great opportunity.",
      "Don't miss this opportunity.",
    ],
    category: "work-business",
  },
  {
    word: "responsibility",
    phonetic: "/rɪˌspɒnsəˈbɪləti/",
    thaiMeaning: "ความรับผิดชอบ",
    partOfSpeech: "n.",
    examples: [
      "I have many responsibilities.",
      "It's my responsibility to help.",
    ],
    category: "work-business",
  },
  {
    word: "salary",
    phonetic: "/ˈsæləri/",
    thaiMeaning: "เงินเดือน",
    partOfSpeech: "n.",
    examples: [
      "What salary do you expect?",
      "My salary was increased.",
    ],
    category: "work-business",
  },
  {
    word: "schedule",
    phonetic: "/ˈʃedjuːl/",
    thaiMeaning: "ตารางเวลา",
    partOfSpeech: "n./v.",
    examples: [
      "Let me check my schedule.",
      "The meeting is scheduled for 2pm.",
    ],
    category: "work-business",
  },

  // ─── Health ──────────────────────────────────────────────
  {
    word: "appointment",
    phonetic: "/əˈpɔɪntmənt/",
    thaiMeaning: "การนัดหมาย",
    partOfSpeech: "n.",
    examples: [
      "I have a doctor's appointment.",
      "Can I book an appointment?",
    ],
    category: "health",
  },
  {
    word: "breath",
    phonetic: "/breθ/",
    thaiMeaning: "ลมหายใจ",
    partOfSpeech: "n.",
    examples: [
      "Take a deep breath.",
      "I was out of breath.",
    ],
    category: "health",
  },
  {
    word: "exhausted",
    phonetic: "/ɪɡˈzɔːstɪd/",
    thaiMeaning: "เหนื่อยล้ามาก",
    partOfSpeech: "adj.",
    examples: [
      "I feel exhausted today.",
      "She was exhausted after work.",
    ],
    category: "health",
  },
  {
    word: "medicine",
    phonetic: "/ˈmedɪsn/",
    thaiMeaning: "ยา",
    partOfSpeech: "n.",
    examples: [
      "I need to take my medicine.",
      "This medicine is very effective.",
    ],
    category: "health",
  },
  {
    word: "suffer",
    phonetic: "/ˈsʌfər/",
    thaiMeaning: "ทนทุกข์, ประสบ (ปัญหา)",
    partOfSpeech: "v.",
    examples: [
      "I suffer from allergies.",
      "He suffered a serious injury.",
    ],
    category: "health",
  },
  {
    word: "symptom",
    phonetic: "/ˈsɪmptəm/",
    thaiMeaning: "อาการ",
    partOfSpeech: "n.",
    examples: [
      "What are your symptoms?",
      "Fever is a common symptom.",
    ],
    category: "health",
  },
  {
    word: "treatment",
    phonetic: "/ˈtriːtmənt/",
    thaiMeaning: "การรักษา",
    partOfSpeech: "n.",
    examples: [
      "What treatment do you recommend?",
      "She is receiving treatment.",
    ],
    category: "health",
  },
  {
    word: "weigh",
    phonetic: "/weɪ/",
    thaiMeaning: "ชั่งน้ำหนัก, มีน้ำหนัก",
    partOfSpeech: "v.",
    examples: [
      "How much do you weigh?",
      "Can you weigh this for me?",
    ],
    category: "health",
  },

  // ─── Education ───────────────────────────────────────────
  {
    word: "attend",
    phonetic: "/əˈtend/",
    thaiMeaning: "เข้าร่วม",
    partOfSpeech: "v.",
    examples: [
      "I attend university.",
      "Will you attend the lecture?",
    ],
    category: "education",
  },
  {
    word: "concentrate",
    phonetic: "/ˈkɒnsntreɪt/",
    thaiMeaning: "มีสมาธิ, จดจ่อ",
    partOfSpeech: "v.",
    examples: [
      "I can't concentrate today.",
      "You need to concentrate more.",
    ],
    category: "education",
  },
  {
    word: "degree",
    phonetic: "/dɪˈɡriː/",
    thaiMeaning: "ปริญญา",
    partOfSpeech: "n.",
    examples: [
      "I have a degree in engineering.",
      "What degree are you pursuing?",
    ],
    category: "education",
  },
  {
    word: "improve",
    phonetic: "/ɪmˈpruːv/",
    thaiMeaning: "พัฒนา, ปรับปรุง",
    partOfSpeech: "v.",
    examples: [
      "I want to improve my English.",
      "Your writing has improved.",
    ],
    category: "education",
  },
  {
    word: "knowledge",
    phonetic: "/ˈnɒlɪdʒ/",
    thaiMeaning: "ความรู้",
    partOfSpeech: "n.",
    examples: [
      "Knowledge is power.",
      "I have basic knowledge of coding.",
    ],
    category: "education",
  },
  {
    word: "struggle",
    phonetic: "/ˈstrʌɡl/",
    thaiMeaning: "ดิ้นรน, พยายามอย่างหนัก",
    partOfSpeech: "v./n.",
    examples: [
      "I struggle with grammar.",
      "It was a real struggle.",
    ],
    category: "education",
  },

  // ─── Technology ──────────────────────────────────────────
  {
    word: "access",
    phonetic: "/ˈækses/",
    thaiMeaning: "การเข้าถึง",
    partOfSpeech: "n./v.",
    examples: [
      "How can I access the internet?",
      "You need access to the system.",
    ],
    category: "technology",
  },
  {
    word: "connect",
    phonetic: "/kəˈnekt/",
    thaiMeaning: "เชื่อมต่อ",
    partOfSpeech: "v.",
    examples: [
      "I can't connect to Wi-Fi.",
      "Let me connect you to support.",
    ],
    category: "technology",
  },
  {
    word: "device",
    phonetic: "/dɪˈvaɪs/",
    thaiMeaning: "อุปกรณ์",
    partOfSpeech: "n.",
    examples: [
      "This device is very useful.",
      "Turn off your electronic devices.",
    ],
    category: "technology",
  },
  {
    word: "download",
    phonetic: "/ˌdaʊnˈləʊd/",
    thaiMeaning: "ดาวน์โหลด",
    partOfSpeech: "v.",
    examples: [
      "Can I download this app?",
      "The file is downloading now.",
    ],
    category: "technology",
  },
  {
    word: "search",
    phonetic: "/sɜːrtʃ/",
    thaiMeaning: "ค้นหา",
    partOfSpeech: "v./n.",
    examples: [
      "Let me search for it online.",
      "I did a quick search.",
    ],
    category: "technology",
  },
  {
    word: "update",
    phonetic: "/ˌʌpˈdeɪt/",
    thaiMeaning: "อัปเดต",
    partOfSpeech: "v./n.",
    examples: [
      "I need to update my phone.",
      "Is there a new update?",
    ],
    category: "technology",
  },

  // ─── Emotions ────────────────────────────────────────────
  {
    word: "anxious",
    phonetic: "/ˈæŋkʃəs/",
    thaiMeaning: "กังวล",
    partOfSpeech: "adj.",
    examples: [
      "I feel anxious about the exam.",
      "She was anxious to leave.",
    ],
    category: "emotions",
  },
  {
    word: "confident",
    phonetic: "/ˈkɒnfɪdənt/",
    thaiMeaning: "มั่นใจ",
    partOfSpeech: "adj.",
    examples: [
      "I feel confident today.",
      "Are you confident about this?",
    ],
    category: "emotions",
  },
  {
    word: "disappointed",
    phonetic: "/ˌdɪsəˈpɔɪntɪd/",
    thaiMeaning: "ผิดหวัง",
    partOfSpeech: "adj.",
    examples: [
      "I'm disappointed with the result.",
      "Don't be disappointed.",
    ],
    category: "emotions",
  },
  {
    word: "embarrassed",
    phonetic: "/ɪmˈbærəst/",
    thaiMeaning: "อาย, เขิน",
    partOfSpeech: "adj.",
    examples: [
      "I felt embarrassed.",
      "That was an embarrassing moment.",
    ],
    category: "emotions",
  },
  {
    word: "grateful",
    phonetic: "/ˈɡreɪtfl/",
    thaiMeaning: "รู้สึกขอบคุณ",
    partOfSpeech: "adj.",
    examples: [
      "I'm so grateful for your help.",
      "She was grateful for the chance.",
    ],
    category: "emotions",
  },
  {
    word: "lonely",
    phonetic: "/ˈləʊnli/",
    thaiMeaning: "เหงา",
    partOfSpeech: "adj.",
    examples: [
      "I feel lonely sometimes.",
      "Living alone can be lonely.",
    ],
    category: "emotions",
  },
  {
    word: "relieved",
    phonetic: "/rɪˈliːvd/",
    thaiMeaning: "โล่งใจ",
    partOfSpeech: "adj.",
    examples: [
      "I'm relieved it's over.",
      "She looked relieved.",
    ],
    category: "emotions",
  },
  {
    word: "satisfied",
    phonetic: "/ˈsætɪsfaɪd/",
    thaiMeaning: "พอใจ",
    partOfSpeech: "adj.",
    examples: [
      "Are you satisfied with the result?",
      "I'm not fully satisfied yet.",
    ],
    category: "emotions",
  },

  // ─── Nature ──────────────────────────────────────────────
  {
    word: "climate",
    phonetic: "/ˈklaɪmət/",
    thaiMeaning: "สภาพอากาศ",
    partOfSpeech: "n.",
    examples: [
      "The climate is changing.",
      "What's the climate like there?",
    ],
    category: "nature",
  },
  {
    word: "environment",
    phonetic: "/ɪnˈvaɪrənmənt/",
    thaiMeaning: "สิ่งแวดล้อม",
    partOfSpeech: "n.",
    examples: [
      "We should protect the environment.",
      "The work environment is friendly.",
    ],
    category: "nature",
  },
  {
    word: "forecast",
    phonetic: "/ˈfɔːrkæst/",
    thaiMeaning: "พยากรณ์",
    partOfSpeech: "n./v.",
    examples: [
      "What's the weather forecast?",
      "They forecast rain tomorrow.",
    ],
    category: "nature",
  },
  {
    word: "scenery",
    phonetic: "/ˈsiːnəri/",
    thaiMeaning: "ทิวทัศน์",
    partOfSpeech: "n.",
    examples: [
      "The scenery is beautiful!",
      "I love the mountain scenery.",
    ],
    category: "nature",
  },
  {
    word: "temperature",
    phonetic: "/ˈtemprətʃər/",
    thaiMeaning: "อุณหภูมิ",
    partOfSpeech: "n.",
    examples: [
      "What's the temperature today?",
      "The temperature is rising.",
    ],
    category: "nature",
  },
  {
    word: "weather",
    phonetic: "/ˈweðər/",
    thaiMeaning: "สภาพอากาศ",
    partOfSpeech: "n.",
    examples: [
      "The weather is nice today.",
      "How's the weather there?",
    ],
    category: "nature",
  },

  // ─── Shopping ────────────────────────────────────────────
  {
    word: "afford",
    phonetic: "/əˈfɔːrd/",
    thaiMeaning: "สามารถจ่ายได้, มีเงินพอ",
    partOfSpeech: "v.",
    examples: [
      "I can't afford this.",
      "Can you afford a new car?",
    ],
    category: "shopping",
  },
  {
    word: "bargain",
    phonetic: "/ˈbɑːrɡən/",
    thaiMeaning: "ของถูก, ต่อรอง",
    partOfSpeech: "n./v.",
    examples: [
      "This was a real bargain!",
      "Can I bargain the price?",
    ],
    category: "shopping",
  },
  {
    word: "discount",
    phonetic: "/ˈdɪskaʊnt/",
    thaiMeaning: "ส่วนลด",
    partOfSpeech: "n.",
    examples: [
      "Is there any discount?",
      "I got a 20% discount.",
    ],
    category: "shopping",
  },
  {
    word: "exchange",
    phonetic: "/ɪksˈtʃeɪndʒ/",
    thaiMeaning: "เปลี่ยน, แลก",
    partOfSpeech: "v./n.",
    examples: [
      "Can I exchange this?",
      "What's the exchange rate?",
    ],
    category: "shopping",
  },
  {
    word: "refund",
    phonetic: "/ˈriːfʌnd/",
    thaiMeaning: "คืนเงิน",
    partOfSpeech: "n./v.",
    examples: [
      "Can I get a refund?",
      "They refunded my money.",
    ],
    category: "shopping",
  },
  {
    word: "receipt",
    phonetic: "/rɪˈsiːt/",
    thaiMeaning: "ใบเสร็จ",
    partOfSpeech: "n.",
    examples: [
      "Can I have a receipt?",
      "Keep your receipt.",
    ],
    category: "shopping",
  },

  // ─── People & Relationships ──────────────────────────────
  {
    word: "acquaintance",
    phonetic: "/əˈkweɪntəns/",
    thaiMeaning: "คนรู้จัก",
    partOfSpeech: "n.",
    examples: [
      "She is just an acquaintance.",
      "I met an old acquaintance.",
    ],
    category: "people",
  },
  {
    word: "couple",
    phonetic: "/ˈkʌpl/",
    thaiMeaning: "คู่, สองสาม",
    partOfSpeech: "n.",
    examples: [
      "They are a lovely couple.",
      "Wait a couple of minutes.",
    ],
    category: "people",
  },
  {
    word: "generous",
    phonetic: "/ˈdʒenərəs/",
    thaiMeaning: "ใจกว้าง, เอื้อเฟื้อ",
    partOfSpeech: "adj.",
    examples: [
      "That's very generous of you.",
      "He is generous with his time.",
    ],
    category: "people",
  },
  {
    word: "polite",
    phonetic: "/pəˈlaɪt/",
    thaiMeaning: "สุภาพ",
    partOfSpeech: "adj.",
    examples: [
      "She is always polite.",
      "It's polite to say thank you.",
    ],
    category: "people",
  },
  {
    word: "reliable",
    phonetic: "/rɪˈlaɪəbl/",
    thaiMeaning: "ไว้ใจได้, เชื่อถือได้",
    partOfSpeech: "adj.",
    examples: [
      "He is very reliable.",
      "I need a reliable car.",
    ],
    category: "people",
  },
  {
    word: "relationship",
    phonetic: "/rɪˈleɪʃnʃɪp/",
    thaiMeaning: "ความสัมพันธ์",
    partOfSpeech: "n.",
    examples: [
      "We have a good relationship.",
      "It's a professional relationship.",
    ],
    category: "people",
  },

  // ─── Time ────────────────────────────────────────────────
  {
    word: "afterwards",
    phonetic: "/ˈæftərwərdz/",
    thaiMeaning: "หลังจากนั้น",
    partOfSpeech: "adv.",
    examples: [
      "Let's grab coffee afterwards.",
      "What happened afterwards?",
    ],
    category: "time",
  },
  {
    word: "currently",
    phonetic: "/ˈkʌrəntli/",
    thaiMeaning: "ปัจจุบัน",
    partOfSpeech: "adv.",
    examples: [
      "I'm currently studying.",
      "What are you currently working on?",
    ],
    category: "time",
  },
  {
    word: "eventually",
    phonetic: "/ɪˈventʃuəli/",
    thaiMeaning: "ในที่สุด",
    partOfSpeech: "adv.",
    examples: [
      "Eventually, I found the way.",
      "Things will get better eventually.",
    ],
    category: "time",
  },
  {
    word: "frequently",
    phonetic: "/ˈfriːkwəntli/",
    thaiMeaning: "บ่อยๆ",
    partOfSpeech: "adv.",
    examples: [
      "I frequently visit this cafe.",
      "How frequently do you exercise?",
    ],
    category: "time",
  },
  {
    word: "immediately",
    phonetic: "/ɪˈmiːdiətli/",
    thaiMeaning: "ทันที",
    partOfSpeech: "adv.",
    examples: [
      "Please respond immediately.",
      "I recognized her immediately.",
    ],
    category: "time",
  },
  {
    word: "recently",
    phonetic: "/ˈriːsntli/",
    thaiMeaning: "เมื่อไม่นานนี้",
    partOfSpeech: "adv.",
    examples: [
      "I recently started learning English.",
      "Have you seen any good movies recently?",
    ],
    category: "time",
  },
];

export function getWordsByCategory(category: string): VocabWord[] {
  return OXFORD_WORDS.filter(
    (w) => w.category === category
  );
}

export function getAllCategories(): string[] {
  const cats = new Set(OXFORD_WORDS.map((w) => w.category));
  return Array.from(cats);
}
