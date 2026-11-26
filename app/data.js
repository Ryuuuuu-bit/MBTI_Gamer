// ===== Config: fill before launch =====
window.CONFIG = {
  siteUrl: "web-production-cbb68e04.up.railway.app",   // printed on the Story card
  igHandle: "",  // e.g. "@gamertypes"
  artPath: "art/chibi/", // GPT's chibi art: <CODE>.png originals, served as compressed <CODE>.webp
  artExt: ".webp",
  heroArt: "art/hero.webp",
  sponsor: null, // { th, en, url }
  gear: {}       // { INTJ: [{ label, url }] } affiliate links per type
};

window.GROUPS = {
  NT: { color: "#8B5CF6", th: "สายสมอง", en: "Mind Gamers" },
  NF: { color: "#10B981", th: "สายอิน", en: "Story Seekers" },
  SJ: { color: "#3B82F6", th: "สายทีม", en: "Team Keepers" },
  SP: { color: "#F97316", th: "สายแอ็กชัน", en: "Action Heroes" }
};
window.groupOf = (code) => (code[1] === "N" ? "N" + code[2] : "S" + (code[3] === "J" ? "J" : "P"));

// Jungian functions used by Myers' type dynamics (dominant -> auxiliary)
window.FUNCS = {
  Ni: { th: "สัญชาตญาณภายใน", en: "Introverted Intuition" },
  Ne: { th: "สัญชาตญาณภายนอก", en: "Extraverted Intuition" },
  Si: { th: "การรับรู้ภายใน", en: "Introverted Sensing" },
  Se: { th: "การรับรู้ภายนอก", en: "Extraverted Sensing" },
  Ti: { th: "ตรรกะภายใน", en: "Introverted Thinking" },
  Te: { th: "ตรรกะภายนอก", en: "Extraverted Thinking" },
  Fi: { th: "คุณค่าภายใน", en: "Introverted Feeling" },
  Fe: { th: "ความรู้สึกต่อผู้อื่น", en: "Extraverted Feeling" }
};
window.DYNAMICS = {
  ISTJ: ["Si", "Te"], ISFJ: ["Si", "Fe"], INFJ: ["Ni", "Fe"], INTJ: ["Ni", "Te"],
  ISTP: ["Ti", "Se"], ISFP: ["Fi", "Se"], INFP: ["Fi", "Ne"], INTP: ["Ti", "Ne"],
  ESTP: ["Se", "Ti"], ESFP: ["Se", "Fi"], ENFP: ["Ne", "Fi"], ENTP: ["Ne", "Ti"],
  ESTJ: ["Te", "Si"], ESFJ: ["Fe", "Si"], ENFJ: ["Fe", "Ni"], ENTJ: ["Te", "Ni"]
};

window.AXES = {
  E: { th: "สายปาร์ตี้", en: "Squad" },   I: { th: "สายเดี่ยว", en: "Solo" },
  S: { th: "สายระบบ", en: "Mechanics" }, N: { th: "สายโลกเกม", en: "Worlds" },
  T: { th: "สายชนะ", en: "Win" },        F: { th: "สายอิน", en: "Feels" },
  J: { th: "สายแพลน", en: "Planner" },   P: { th: "สายด้นสด", en: "Freestyle" }
};

window.UI = {
  th: {
    badge: "ฟรี · TH/EN · แชร์ลง IG Story ได้",
    heroTitle: "คุณเป็น<em>เกมเมอร์สายไหน?</em>",
    heroSub: "ตอบ 20 ข้อ ใช้เวลาราว 3 นาที แล้วเจอตัวละครประจำตัวคุณจากเกมเมอร์ 16 สาย",
    start: "เริ่มทำแบบทดสอบ",
    seeAll: "ดูทั้ง 16 สาย",
    chips: ["20 คำถาม", "~3 นาที", "16 ตัวละคร", "การ์ด IG Story"],
    galleryTitle: "เกมเมอร์ 16 สาย",
    gallerySub: "แบ่งเป็น 4 กลุ่มสี แตะตัวละครเพื่อดูรายละเอียด",
    aboutTitle: "แบบทดสอบนี้วัดอะไร",
    about: [
      ["4 แกน", "ได้แรงบันดาลใจจากแนวคิดเรื่อง type ของ Jung และ Myers-Briggs: แหล่งพลังงาน (ปาร์ตี้/เดี่ยว), การรับข้อมูล (ระบบ/โลกเกม), การตัดสินใจ (ชนะ/อิน), และสไตล์การเล่น (แพลน/ด้นสด)"],
      ["วัดความชอบ ไม่ใช่ฝีมือ", "ผลบอกว่าคุณ \"ชอบ\" เล่นแบบไหน ไม่ได้บอกว่าเก่งหรือไม่เก่ง ทุกคนใช้ได้ทั้งสองฝั่ง"],
      ["บอกตรงๆ เมื่อก้ำกึ่ง", "แกนที่คะแนนใกล้ 50/50 จะติดป้าย \"ก้ำกึ่ง\" เพราะแกนแบบนี้มีโอกาสพลิกเมื่อทำซ้ำ"],
      ["เพื่อความบันเทิง", "ไม่ใช่แบบประเมินทางจิตวิทยา ห้ามใช้คัดเลือกคนเข้าทีมหรือเข้าทำงาน"]
    ],
    notAffiliated: "ไม่ได้เกี่ยวข้องกับ The Myers-Briggs Company หรือ 16Personalities · MBTI เป็นเครื่องหมายการค้าของเจ้าของ",
    qOf: "ข้อ {n} / {t}",
    pickHint: "แตะฝั่งที่ใช่กว่า หรือเลือกระดับตรงกลาง",
    scale: ["ใช่ฝั่งบนมาก", "ค่อนไปฝั่งบน", "ค่อนไปฝั่งล่าง", "ใช่ฝั่งล่างมาก"],
    back: "ย้อนกลับ",
    quit: "ออก",
    youAre: "เกมเมอร์สายของฉันคือ",
    axesTitle: "สเปกตรัมของคุณ",
    borderline: "ก้ำกึ่ง",
    borderlineNote: "แกนที่ก้ำกึ่งอาจพลิกได้เมื่อทำซ้ำ ลองทำอีกครั้งในวันอื่นแล้วเทียบผล",
    strengths: "จุดเด่น",
    genres: "แนวเกมที่ใช่",
    duo: "คู่หูในเกม",
    duoNote: "คู่หูที่เล่นด้วยกันแล้วเติมเต็มกัน (เพื่อความสนุก)",
    theory: "เบื้องหลังทางทฤษฎี",
    theoryText: "ในโมเดล type dynamics ของ Myers สาย {code} ใช้ <b>{dom}</b> ({domName}) เป็นฟังก์ชันหลัก และ <b>{aux}</b> ({auxName}) เป็นฟังก์ชันรอง",
    storyCard: "การ์ด IG Story",
    share: "แชร์ลง Story",
    save: "บันทึกรูป",
    copy: "คัดลอกลิงก์",
    copied: "คัดลอกแล้ว!",
    retry: "ทำใหม่อีกครั้ง",
    tagFriend: "แท็กเพื่อนที่เป็นสาย {duo} ให้มาเป็นคู่หูคุณ",
    longPress: "ในแอป IG/LINE ให้กดค้างที่รูปเพื่อบันทึก",
    friendGot: "เพื่อนของคุณได้สาย",
    playYourself: "มาดูว่าคุณเป็นสายไหน",
    tryIt: "คุณเป็นเกมเมอร์สายไหน?",
    shareText: "ฉันเป็นเกมเมอร์สาย {name} ({code}) แล้วคุณล่ะ?",
    gear: "ของแนะนำสำหรับสายนี้",
    close: "ปิด",
    group: "กลุ่ม"
  },
  en: {
    badge: "Free · TH/EN · Share to your IG Story",
    heroTitle: "What kind of <em>gamer are you?</em>",
    heroSub: "20 questions, about 3 minutes. Meet your character among the 16 gamer types.",
    start: "Start the quiz",
    seeAll: "See all 16 types",
    chips: ["20 questions", "~3 minutes", "16 characters", "IG Story card"],
    galleryTitle: "The 16 gamer types",
    gallerySub: "Four color groups. Tap a character for details.",
    aboutTitle: "What this quiz measures",
    about: [
      ["4 axes", "Inspired by Jung's and Myers-Briggs' ideas about type: energy (Squad/Solo), information (Mechanics/Worlds), decisions (Win/Feels), and play style (Planner/Freestyle)."],
      ["Preference, not skill", "Your result says how you like to play, not how good you are. Everyone uses both sides."],
      ["Honest about close calls", "Axes near 50/50 get a \"close call\" tag, because those are the ones most likely to flip on a retake."],
      ["Just for fun", "Not a psychological assessment. Never use it to pick team members or hire people."]
    ],
    notAffiliated: "Not affiliated with The Myers-Briggs Company or 16Personalities · MBTI is a trademark of its owner",
    qOf: "Question {n} / {t}",
    pickHint: "Tap the side that fits better, or pick a level in between",
    scale: ["Strongly the top one", "Leaning top", "Leaning bottom", "Strongly the bottom one"],
    back: "Back",
    quit: "Quit",
    youAre: "My gamer type is",
    axesTitle: "Your spectrum",
    borderline: "Close call",
    borderlineNote: "Close-call axes can flip on a retake. Try again another day and compare.",
    strengths: "Strengths",
    genres: "Your genres",
    duo: "Best duo",
    duoNote: "The partner who fills your gaps in co-op (just for fun)",
    theory: "The theory behind it",
    theoryText: "In Myers' type dynamics, {code} leads with <b>{dom}</b> ({domName}) and backs it up with <b>{aux}</b> ({auxName}).",
    storyCard: "IG Story card",
    share: "Share to Story",
    save: "Save image",
    copy: "Copy link",
    copied: "Copied!",
    retry: "Take it again",
    tagFriend: "Tag your {duo} friend as your duo",
    longPress: "In the IG/LINE app, long-press the image to save it",
    friendGot: "Your friend got",
    playYourself: "Find out your type",
    tryIt: "What kind of gamer are you?",
    shareText: "I'm a {name} ({code}) gamer. What are you?",
    gear: "Gear for your type",
    close: "Close",
    group: "Group"
  }
};

// 20 questions: 5 per axis, interleaved. "a" statement -> first letter of axis, "b" -> second.
window.QUESTIONS = [
  { axis: "EI", th: { q: "วันหยุดว่างทั้งวัน เปิดเกมแล้วคุณ...", a: "ทักเพื่อนเข้าดิสคอร์ดทันที", b: "ใส่หูฟัง ปิดแชท ลุยเดี่ยวยาวๆ" }, en: { q: "A free day, you boot up a game and...", a: "Ping the squad on Discord right away", b: "Headphones on, chat off, solo marathon" } },
  { axis: "SN", th: { q: "เข้าเกมใหม่ สิ่งแรกที่ทำคือ", a: "กดเล่นเลย จับฟีลการควบคุม", b: "สำรวจโลก หาว่ามีความลับอะไรซ่อนอยู่" }, en: { q: "New game. The first thing you do is", a: "Jump in and feel out the controls", b: "Explore the world and hunt for secrets" } },
  { axis: "TF", th: { q: "เพื่อนร่วมทีมเล่นพลาดจนแพ้", a: "บอกตรงๆ ว่าพลาดตรงไหน จะได้แก้", b: "ปลอบก่อน \"ไม่เป็นไร ตาหน้าเอาใหม่\"" }, en: { q: "A teammate's mistake costs you the match", a: "Tell them exactly what went wrong", b: "\"It's fine, we'll get the next one\"" } },
  { axis: "JP", th: { q: "ก่อนเริ่มเกม RPG ใหม่", a: "หาไกด์ วางบิลด์ไว้ล่วงหน้า", b: "ลุยเลย เดี๋ยวก็รู้เอง" }, en: { q: "Before starting a new RPG", a: "Read guides and plan the build", b: "Dive in and figure it out" } },
  { axis: "EI", th: { q: "เกมที่มีแชทเสียง คุณมักจะ...", a: "เปิดไมค์ คุยไม่หยุด", b: "ปิดไมค์ พิมพ์เมื่อจำเป็น" }, en: { q: "In a game with voice chat, you...", a: "Mic on, never stop talking", b: "Mic off, type only when needed" } },
  { axis: "SN", th: { q: "เกมที่ดีที่สุดคือเกมที่...", a: "ระบบแน่น ควบคุมลื่น ตอบสนองแม่น", b: "โลกกว้าง ไอเดียแปลกใหม่ ไม่เหมือนใคร" }, en: { q: "The best games have...", a: "Tight systems and buttery controls", b: "Huge worlds and wild new ideas" } },
  { axis: "TF", th: { q: "เลือกตัวละครหรือคลาส", a: "ตัวเมต้า ประสิทธิภาพสูงสุด", b: "ตัวที่รัก ถึงจะไม่เก่งก็ตาม" }, en: { q: "Picking a character or class", a: "The meta pick with the best numbers", b: "The one you love, even if it's weak" } },
  { axis: "JP", th: { q: "ภารกิจรองเต็มแผนที่", a: "เคลียร์ทีละอันให้หมดก่อนไปต่อ", b: "ทำอันที่น่าสนใจ ที่เหลือช่างมัน" }, en: { q: "The map is full of side quests", a: "Clear them one by one", b: "Do the fun ones, skip the rest" } },
  { axis: "EI", th: { q: "เพิ่งชนะแมตช์สุดมันส์", a: "ส่งคลิปให้เพื่อน ลงโซเชียลทันที", b: "ยิ้มคนเดียว แล้วกดเล่นต่อ" }, en: { q: "You just won an epic match", a: "Send the clip to everyone and post it", b: "Smile to yourself and queue again" } },
  { axis: "SN", th: { q: "ดูตัวอย่างเกมใหม่ คุณสนใจ...", a: "ฟุตเทจเกมเพลย์จริง ระบบ เฟรมเรต", b: "ทีเซอร์ลึกลับ และทฤษฎีของแฟนๆ" }, en: { q: "Watching a new trailer, you care about...", a: "Real gameplay, systems, frame rate", b: "Mysterious teasers and fan theories" } },
  { axis: "TF", th: { q: "ฉากที่คุณจำได้ไม่ลืม", a: "บอสโหดที่ต้องคิดกลยุทธ์ถึงจะผ่าน", b: "ฉากที่ทำให้น้ำตาไหล" }, en: { q: "The moment you'll never forget", a: "A brutal boss you had to out-think", b: "The scene that made you cry" } },
  { axis: "JP", th: { q: "Backlog เกมของคุณ", a: "มีลิสต์ เล่นจบทีละเกม", b: "เปิดค้างไว้ 5 เกม ยังไม่จบสักเกม" }, en: { q: "Your game backlog", a: "A neat list, finished one at a time", b: "Five games started, zero finished" } },
  { axis: "EI", th: { q: "ไปงานเกมหรืออีเวนต์ คุณ...", a: "ยิ่งคนเยอะยิ่งสนุก อยากรู้จักทุกคน", b: "เหนื่อยเร็ว อยากกลับไปเล่นที่บ้าน" }, en: { q: "At a gaming event, you...", a: "Love the crowd, want to meet everyone", b: "Get drained fast, rather play at home" } },
  { axis: "SN", th: { q: "อ่านแพตช์โน้ต คุณดู...", a: "ตัวเลขที่เปลี่ยน บัฟ/เนิร์ฟ", b: "คอนเทนต์ใหม่ที่ใบ้เนื้อเรื่องต่อ" }, en: { q: "Reading patch notes, you look for...", a: "The numbers: buffs and nerfs", b: "New content hinting at the story" } },
  { axis: "TF", th: { q: "เพื่อนชวนเล่นเกมที่คุณไม่ชอบ", a: "บอกตรงๆ ว่าเกมนี้ไม่สนุกเพราะอะไร", b: "เล่นด้วย เพราะอยากอยู่กับเพื่อน" }, en: { q: "A friend invites you to a game you dislike", a: "Explain honestly why it isn't fun", b: "Play anyway, it's about hanging out" } },
  { axis: "JP", th: { q: "เวลาเล่นเกมของคุณ", a: "ตั้งเวลาไว้ เล่นตามแผน", b: "เล่นจนพอใจ ไม่ได้ดูเวลา" }, en: { q: "Your play sessions", a: "Set a time and stick to it", b: "Play till it feels right, no clock" } },
  { axis: "EI", th: { q: "เกมใหม่ที่อยากเล่น ต้องมี...", a: "โหมดเล่นกับเพื่อน", b: "โหมดเนื้อเรื่องเล่นคนเดียว" }, en: { q: "A new game must have...", a: "A mode to play with friends", b: "A great solo campaign" } },
  { axis: "SN", th: { q: "เรียนรู้เกมใหม่ด้วยวิธี...", a: "ลองกดจริง ทำซ้ำจนคล่อง", b: "เข้าใจภาพรวมก่อน ค่อยลงรายละเอียด" }, en: { q: "You learn a new game by...", a: "Hands-on, repeating till it clicks", b: "Big picture first, details later" } },
  { axis: "TF", th: { q: "รีวิวเกมที่คุณเชื่อ", a: "วิเคราะห์ระบบ ให้คะแนนชัดเจน", b: "เล่าความรู้สึกตอนเล่นจริง" }, en: { q: "The game reviews you trust", a: "System breakdowns with clear scores", b: "How it actually felt to play" } },
  { axis: "JP", th: { q: "ไอเทมในกระเป๋าของคุณ", a: "จัดหมวดหมู่เรียบร้อย", b: "ยัดไว้ก่อน เดี๋ยวก็หาเจอ" }, en: { q: "Your inventory", a: "Neatly sorted by category", b: "Stuffed in, I'll find it somehow" } }
];

// ===== 16 gamer types =====
// color: [top, bottom] gradient. Groups: NT purple, NF green, SJ blue, SP orange
window.TYPES = {
  INTJ: { emoji: "♟️", color: ["#4b1d8f", "#12062b"], duo: "ENFP",
    th: { name: "นักวางแผน", tag: "ชนะตั้งแต่ก่อนกดเริ่มเกม", desc: "คุณมองเกมเป็นกระดานหมากรุก คิดล่วงหน้าหลายตา เกลียดการเล่นแบบไม่มีแผน และชอบชัยชนะที่มาจากสมอง", strengths: ["มองเกมขาด", "วางแผนยาว", "ใจเย็นกดดันไม่ได้"], genres: ["วางแผน (RTS/4X)", "การ์ดเกม", "ไขปริศนา"] },
    en: { name: "The Strategist", tag: "Wins before pressing start", desc: "You see every game as a chessboard. You think several moves ahead, hate playing without a plan, and love victories earned with your brain.", strengths: ["Reads the game", "Long-term planning", "Ice cold under pressure"], genres: ["Strategy (RTS/4X)", "Card games", "Puzzle"] } },
  INTP: { emoji: "🧪", color: ["#5b2a9e", "#1a0838"], duo: "ENTJ",
    th: { name: "นักแกะระบบ", tag: "รู้สูตรดาเมจก่อนผู้พัฒนา", desc: "คุณสนุกกับการแกะว่าระบบทำงานยังไง ทดลองบิลด์แปลกๆ เปิดสเปรดชีตคำนวณ และมักเจอคอมโบที่ไม่มีใครคิดถึง", strengths: ["วิเคราะห์ลึก", "หาคอมโบลับ", "ทดลองไม่หยุด"], genres: ["Roguelike", "Automation/สร้างโรงงาน", "Sandbox"] },
    en: { name: "The Theorycrafter", tag: "Knows the damage formula better than the devs", desc: "You love figuring out how systems really work. You test weird builds, open spreadsheets, and find combos nobody else thought of.", strengths: ["Deep analysis", "Finds hidden combos", "Endless experiments"], genres: ["Roguelike", "Automation", "Sandbox"] } },
  ENTJ: { emoji: "👑", color: ["#6a1fb0", "#1d0640"], duo: "INTP",
    th: { name: "กัปตันไต่แรงค์", tag: "แรงค์ต้องขึ้น ทีมต้องชนะ", desc: "คุณเกิดมาเพื่อนำทีมและไต่แรงค์ ตั้งเป้าชัด สั่งการเด็ดขาด และไม่ยอมแพ้จนกว่าจะถึงจุดสูงสุด", strengths: ["ผู้นำโดยธรรมชาติ", "มุ่งเป้าหมาย", "ตัดสินใจไว"], genres: ["MOBA", "FPS แข่งขัน", "Battle Royale แรงค์"] },
    en: { name: "The Esports Captain", tag: "Rank goes up. Team wins. Period.", desc: "You were born to lead and climb. Clear goals, decisive calls, and you don't stop until you reach the top.", strengths: ["Natural leader", "Goal-driven", "Fast decisions"], genres: ["MOBA", "Competitive FPS", "Ranked battle royale"] } },
  ENTP: { emoji: "🌀", color: ["#7b2cbf", "#240a46"], duo: "INFJ",
    th: { name: "ตัวป่วน", tag: "ถ้าเกมมีบัค ฉันจะหาเจอ", desc: "คุณชอบทำสิ่งที่เกมไม่ได้ตั้งใจให้ทำ ลองกลยุทธ์บ้าๆ หาบัค สปีดรัน และทำให้ทั้งทีมหัวเราะ (หรือปวดหัว)", strengths: ["ความคิดสร้างสรรค์", "พลิกเกมได้", "สนุกทุกตา"], genres: ["Sandbox ฟิสิกส์", "Party/Social deduction", "Immersive sim"] },
    en: { name: "The Chaos Agent", tag: "If there's a bug, I'll find it", desc: "You love doing things the game never intended. Crazy strategies, glitches, speedruns, and making the whole squad laugh (or groan).", strengths: ["Creative thinking", "Game-changing plays", "Every match is fun"], genres: ["Physics sandbox", "Social deduction", "Immersive sim"] } },
  INFJ: { emoji: "📜", color: ["#1b7a5a", "#06281d"], duo: "ENTP",
    th: { name: "ผู้เฝ้าตำนาน", tag: "อ่านทุกโน้ต ฟังทุกบทพูด", desc: "คุณเล่นเกมเพื่อเรื่องราวและความหมาย จำชื่อตัวละครรองได้หมด และมีทฤษฎีเนื้อเรื่องของตัวเองเสมอ", strengths: ["เข้าใจเรื่องลึก", "จับรายละเอียดเก่ง", "อินสุดใจ"], genres: ["Story RPG", "Narrative adventure", "Visual novel"] },
    en: { name: "The Lore Keeper", tag: "Reads every note, hears every line", desc: "You play for story and meaning. You remember every side character's name and always have your own lore theory.", strengths: ["Deep understanding", "Eye for detail", "Fully immersed"], genres: ["Story RPG", "Narrative adventure", "Visual novel"] } },
  INFP: { emoji: "🌙", color: ["#23906a", "#073022"], duo: "ENFJ",
    th: { name: "นักฝันสายอินดี้", tag: "เกมนี้ไม่ดังแต่ใจฉันพัง", desc: "คุณรักเกมที่มีหัวใจ ภาพสวย เพลงเพราะ เนื้อเรื่องแตะใจ และมักค้นพบเกมอินดี้ที่คนอื่นยังไม่รู้จัก", strengths: ["รสนิยมเฉพาะตัว", "อินกับอารมณ์", "ค้นพบของดี"], genres: ["Indie", "Exploration", "Cozy story"] },
    en: { name: "The Indie Dreamer", tag: "Nobody knows this game, but it broke me", desc: "You love games with heart: beautiful art, great music, stories that hit. You find indie gems before anyone else.", strengths: ["Unique taste", "Emotionally tuned in", "Finds hidden gems"], genres: ["Indie", "Exploration", "Cozy story"] } },
  ENFJ: { emoji: "🎙️", color: ["#2aa676", "#0a3a27"], duo: "INFP",
    th: { name: "สตรีมเมอร์ตัวจริง", tag: "เล่นเกมคือการพาทุกคนมาสนุกด้วยกัน", desc: "คุณทำให้ทุกเกมกลายเป็นงานปาร์ตี้ เป็นคนชวนเพื่อนเล่น สอนมือใหม่ และทำให้บรรยากาศในทีมดีเสมอ", strengths: ["สร้างบรรยากาศ", "ดูแลทีม", "สอนเก่ง"], genres: ["Co-op", "MMORPG", "Party game"] },
    en: { name: "The Streamer", tag: "Gaming is bringing everyone along", desc: "You turn every game into a party. You invite friends, teach newbies, and keep the squad's vibe positive.", strengths: ["Sets the vibe", "Looks after the team", "Great teacher"], genres: ["Co-op", "MMORPG", "Party games"] } },
  ENFP: { emoji: "🧭", color: ["#33b580", "#0c4430"], duo: "INTJ",
    th: { name: "นักผจญภัย", tag: "เส้นทางหลัก? เดี๋ยวค่อยไป", desc: "คุณหลงทางในโลกเกมอย่างมีความสุข ชอบลองทุกอย่างใหม่ๆ เปลี่ยนเกมบ่อย และตื่นเต้นกับทุกการค้นพบ", strengths: ["อยากรู้อยากเห็น", "กล้าลอง", "พลังบวกล้น"], genres: ["Open world", "Survival crafting", "Adventure"] },
    en: { name: "The Explorer", tag: "Main quest? Later.", desc: "You happily get lost in game worlds. You try everything new, hop between games, and get excited by every discovery.", strengths: ["Endless curiosity", "Tries anything", "Positive energy"], genres: ["Open world", "Survival crafting", "Adventure"] } },
  ISTJ: { emoji: "🏆", color: ["#1d4f9c", "#06173a"], duo: "ESFP",
    th: { name: "สายเก็บ 100%", tag: "ยังไม่ได้ทุกถ้วยรางวัล ยังไม่จบ", desc: "คุณเล่นทุกเกมให้จบอย่างสมบูรณ์ เก็บของครบ ทำทุกภารกิจ และรู้สึกฟินทุกครั้งที่เห็นตัวเลข 100%", strengths: ["อดทนสูง", "ละเอียดทุกจุด", "มีวินัย"], genres: ["Action RPG", "Metroidvania", "Collectathon"] },
    en: { name: "The Completionist", tag: "Not every trophy yet? Not finished.", desc: "You finish games properly. Every collectible, every quest, and nothing beats seeing that 100%.", strengths: ["Huge patience", "Thorough", "Disciplined"], genres: ["Action RPG", "Metroidvania", "Collectathon"] } },
  ISFJ: { emoji: "💚", color: ["#2563b8", "#081d45"], duo: "ESTP",
    th: { name: "ซัพพอร์ตใจดี", tag: "ทีมรอด เพราะฉันฮีลให้", desc: "คุณคือคนที่ทุกทีมอยากได้ คอยฮีล คอยดูแล ไม่ต้องการแสงไฟ แค่อยากเห็นเพื่อนชนะ", strengths: ["ใส่ใจทีม", "เชื่อถือได้", "อ่านสถานการณ์เก่ง"], genres: ["MOBA (ซัพพอร์ต)", "MMORPG ฮีลเลอร์", "Co-op"] },
    en: { name: "The Support Main", tag: "The team survives because I heal", desc: "You're the player every team wants. Healing, protecting, never needing the spotlight. You just want your friends to win.", strengths: ["Team-first", "Reliable", "Great awareness"], genres: ["MOBA (support)", "MMORPG healer", "Co-op"] } },
  ESTJ: { emoji: "🛡️", color: ["#2b6fd1", "#0a2352"], duo: "ISFP",
    th: { name: "หัวหน้าเรด", tag: "ทุกคนเข้าตำแหน่ง! นับถอยหลัง 3...", desc: "คุณจัดตารางเรด แบ่งหน้าที่ และทำให้ทีมเดินตามแผน ระเบียบคือกุญแจสู่ชัยชนะ", strengths: ["จัดการเก่ง", "สั่งการชัดเจน", "รับผิดชอบสูง"], genres: ["MMORPG เรด", "Tactical shooter", "Guild war"] },
    en: { name: "The Raid Leader", tag: "Everyone in position! 3...", desc: "You schedule raids, assign roles, and keep the team on plan. Order is the key to victory.", strengths: ["Organized", "Clear callouts", "Responsible"], genres: ["MMORPG raids", "Tactical shooter", "Guild wars"] } },
  ESFJ: { emoji: "🏡", color: ["#3a7fe0", "#0c2a5e"], duo: "ISTP",
    th: { name: "พ่อแม่กิลด์", tag: "กินข้าวยัง? เข้าเกมมา เดี๋ยวพาฟาร์ม", desc: "คุณคือหัวใจของกิลด์ จำวันเกิดเพื่อนในเกม จัดอีเวนต์ และทำให้ทุกคนรู้สึกเป็นส่วนหนึ่ง", strengths: ["สร้างชุมชน", "อบอุ่น", "ใจกว้าง"], genres: ["MMORPG", "Life sim", "Social game"] },
    en: { name: "The Guild Parent", tag: "Eaten yet? Hop on, I'll carry you", desc: "You're the heart of the guild. You remember everyone's birthday, run events, and make people feel they belong.", strengths: ["Community builder", "Warm", "Generous"], genres: ["MMORPG", "Life sim", "Social games"] } },
  ISTP: { emoji: "🎯", color: ["#c2410c", "#3d1203"], duo: "ESFJ",
    th: { name: "มือโปร", tag: "พูดน้อย ยิงหัว", desc: "คุณเชื่อในฝีมือล้วนๆ ฝึกเอม เรียนรู้แพทเทิร์นบอส และชอบความยากที่ต้องใช้มือกับสมาธิ", strengths: ["มือแม่น", "เรียนรู้ไว", "ใจนิ่ง"], genres: ["Soulslike", "FPS", "Fighting game"] },
    en: { name: "The Mechanic", tag: "Few words. Headshots.", desc: "You trust pure skill. You train your aim, learn boss patterns, and love challenges that demand hands and focus.", strengths: ["Precise hands", "Fast learner", "Calm nerves"], genres: ["Soulslike", "FPS", "Fighting games"] } },
  ISFP: { emoji: "🌸", color: ["#d9581a", "#451805"], duo: "ESTJ",
    th: { name: "สายชิลแต่งบ้าน", tag: "เกมนี้มีให้แต่งบ้านไหม?", desc: "คุณเล่นเกมเพื่อพักใจ ชอบสร้าง แต่งตัวละคร ตกแต่งบ้าน และใช้เวลาหลายชั่วโมงกับการทำให้ทุกอย่างสวย", strengths: ["ตาศิลปิน", "ใจเย็น", "สร้างสรรค์"], genres: ["Cozy/Farming", "Building", "Character customization"] },
    en: { name: "The Cozy Creator", tag: "Can I decorate a house in this game?", desc: "You game to relax. Building, dressing up characters, decorating, spending hours making everything look just right.", strengths: ["Artist's eye", "Calm", "Creative"], genres: ["Cozy/Farming", "Building", "Character customization"] } },
  ESTP: { emoji: "⚡", color: ["#ea6a12", "#4a1e04"], duo: "ISFJ",
    th: { name: "สายบวกก่อนคิด", tag: "แผนคืออะไร? ลุย!", desc: "คุณมีชีวิตอยู่เพื่อจังหวะคลัตช์ วิ่งเข้าหาไฟต์ก่อนใคร ตัดสินใจในเสี้ยววินาที และเล่นเพื่ออะดรีนาลีน", strengths: ["กล้าได้กล้าเสีย", "รีแอคไว", "พลิกเกมช่วงท้าย"], genres: ["Battle Royale", "Racing", "Action"] },
    en: { name: "The Clutch Player", tag: "Plan? What plan? GO!", desc: "You live for clutch moments. First into every fight, split-second decisions, pure adrenaline.", strengths: ["Fearless", "Fast reactions", "Late-game comebacks"], genres: ["Battle royale", "Racing", "Action"] } },
  ESFP: { emoji: "🎉", color: ["#f08a1c", "#4d2a05"], duo: "ISTJ",
    th: { name: "ตัวตึงปาร์ตี้เกม", tag: "แพ้ไม่เป็นไร ขอให้ฮา", desc: "คุณคือคนที่ทำให้ห้องเสียงดังที่สุด ชอบเกมเล่นกับเพื่อน เกมเต้น เกมปาร์ตี้ ความสนุกสำคัญกว่าผลแพ้ชนะ", strengths: ["ทำให้ทุกคนสนุก", "เข้ากับคนง่าย", "พลังล้น"], genres: ["Party game", "Rhythm/เต้น", "Couch co-op"] },
    en: { name: "The Party Starter", tag: "Losing is fine if it's funny", desc: "You're the loudest one in the room. Party games, rhythm games, couch co-op. Fun beats winning every time.", strengths: ["Makes it fun for all", "Easy to get along with", "Boundless energy"], genres: ["Party games", "Rhythm", "Couch co-op"] } }
};
