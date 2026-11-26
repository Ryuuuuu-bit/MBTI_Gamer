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

window.AXES = {
  E: { th: "สายปาร์ตี้", en: "Squad" },   I: { th: "สายเดี่ยว", en: "Solo" },
  S: { th: "สายระบบ", en: "Mechanics" }, N: { th: "สายโลกเกม", en: "Worlds" },
  T: { th: "สายชนะ", en: "Win" },        F: { th: "สายอิน", en: "Feels" },
  J: { th: "สายแพลน", en: "Planner" },   P: { th: "สายด้นสด", en: "Freestyle" }
};

window.UI = {
  th: {
    badge: "ฟรี · ไม่ต้องสมัคร · แชร์ลง IG Story ได้",
    heroTitle: "คุณเป็น<em>เกมเมอร์สายไหน?</em>",
    heroSub: "ตอบ 20 ข้อ ใช้เวลาราว 3 นาที แล้วเจอตัวละครประจำตัวคุณจากเกมเมอร์ 16 สาย",
    start: "เริ่มทำแบบทดสอบ",
    seeAll: "ดูทั้ง 16 สาย",
    chips: ["20 คำถาม", "~3 นาที", "16 ตัวละคร", "การ์ด IG Story"],
    galleryTitle: "เกมเมอร์ 16 สาย",
    gallerySub: "แตะตัวละครเพื่อดูรายละเอียด",
    aboutTitle: "แบบทดสอบนี้ดูอะไรบ้าง",
    about: [
      ["4 สไตล์การเล่น", "ชอบเล่นกับเพื่อนหรือเล่นเดี่ยว · ชอบระบบหรือโลกในเกม · เล่นเพื่อชนะหรือเพื่ออิน · ชอบแพลนหรือด้นสด"],
      ["ไม่มีสายไหนเก่งกว่ากัน", "ผลบอกว่าคุณชอบเล่นแบบไหน ไม่ได้วัดว่าเล่นเก่งแค่ไหน"],
      ["ผลก้ำกึ่ง? ลองใหม่ได้", "ถ้าบางด้านคะแนนใกล้กันมาก ผลอาจเปลี่ยนเมื่อทำอีกครั้ง"]
    ],
    notAffiliated: "ทำขึ้นเพื่อความสนุก ไม่ใช่แบบประเมินทางจิตวิทยา · ไม่ได้เกี่ยวข้องกับ The Myers-Briggs Company",
    qOf: "ข้อ {n} / {t}",
    pickHint: "แตะข้อที่ใช่ หรือแตะวงกลมถ้าแค่ค่อนไปทางนั้น",
    scale: ["ใช่ฝั่งบนมาก", "ค่อนไปฝั่งบน", "ค่อนไปฝั่งล่าง", "ใช่ฝั่งล่างมาก"],
    back: "ย้อนกลับ",
    quit: "ออก",
    youAre: "เกมเมอร์สายของฉันคือ",
    axesTitle: "สไตล์การเล่นของคุณ",
    borderline: "ก้ำกึ่ง",
    borderlineNote: "ด้านที่คะแนนใกล้กันอาจเปลี่ยนได้ ลองทำอีกครั้งวันหลังแล้วเทียบผลดู",
    strengths: "จุดเด่น",
    genres: "แนวเกมที่ใช่",
    duo: "คู่หูในเกม",
    duoNote: "เล่นด้วยกันแล้วเติมเต็มกันพอดี",
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
    badge: "Free · No sign-up · Share to your IG Story",
    heroTitle: "What kind of <em>gamer are you?</em>",
    heroSub: "20 questions, about 3 minutes. Meet your character among the 16 gamer types.",
    start: "Start the quiz",
    seeAll: "See all 16 types",
    chips: ["20 questions", "~3 minutes", "16 characters", "IG Story card"],
    galleryTitle: "The 16 gamer types",
    gallerySub: "Tap a character for details.",
    aboutTitle: "How it works",
    about: [
      ["4 play styles", "Squad or solo · mechanics or worlds · play to win or to feel · plan ahead or freestyle"],
      ["No type is better", "It shows how you like to play, not how good you are."],
      ["Close call? Try again", "If some sides are nearly even, your result may change on a retake."]
    ],
    notAffiliated: "Made for fun, not a psychological assessment · Not affiliated with The Myers-Briggs Company",
    qOf: "Question {n} / {t}",
    pickHint: "Tap the answer that fits, or a circle if you only lean that way",
    scale: ["Strongly the top one", "Leaning top", "Leaning bottom", "Strongly the bottom one"],
    back: "Back",
    quit: "Quit",
    youAre: "My gamer type is",
    axesTitle: "Your play style",
    borderline: "Close call",
    borderlineNote: "Close calls can change. Try again another day and compare.",
    strengths: "Strengths",
    genres: "Your genres",
    duo: "Best duo",
    duoNote: "You fill each other's gaps in co-op",
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
  { axis: "EI", th: { q: "วันหยุดว่างทั้งวัน อยากเล่นเกมแบบไหน", a: "ชวนเพื่อนมาเล่นด้วยกัน", b: "เล่นคนเดียวเงียบๆ สบายใจ" }, en: { q: "A free day to play games. You'd rather...", a: "Get friends to play together", b: "Play alone, nice and quiet" } },
  { axis: "SN", th: { q: "เปิดเกมใหม่ครั้งแรก คุณจะ...", a: "กดเล่นเลย เดี๋ยวก็คล่องมือ", b: "เดินดูรอบๆ ว่าในเกมมีอะไรบ้าง" }, en: { q: "Opening a new game for the first time, you...", a: "Start playing and get the hang of it", b: "Look around to see what's in the game" } },
  { axis: "TF", th: { q: "เพื่อนเล่นพลาดจนทีมแพ้", a: "บอกตรงๆ ว่าพลาดตรงไหน รอบหน้าจะได้ดีขึ้น", b: "ปลอบก่อน “ไม่เป็นไร เอาใหม่”" }, en: { q: "A friend's mistake loses the game for your team", a: "Tell them what went wrong so next time's better", b: "Cheer them up: “It's fine, let's go again”" } },
  { axis: "JP", th: { q: "ก่อนเริ่มเกมที่ยังไม่เคยเล่น", a: "ดูคลิปหรือหาวิธีเล่นก่อน", b: "ลองเล่นเลย ผิดก็ค่อยเรียนรู้" }, en: { q: "Before a game you've never played", a: "Watch a video or look up how to play", b: "Just try it and learn as you go" } },
  { axis: "EI", th: { q: "เล่นเกมกับคนอื่น คุณมักจะ...", a: "คุยเล่น แซวกันตลอด", b: "ตั้งใจเล่น พูดเท่าที่จำเป็น" }, en: { q: "Playing with others, you usually...", a: "Chat and joke the whole time", b: "Focus on the game, talk only when needed" } },
  { axis: "SN", th: { q: "เกมที่ดีที่สุดคือเกมที่...", a: "เล่นง่าย ลื่นมือ กดแล้วตอบสนองดี", b: "มีโลกและเรื่องราวแปลกใหม่ไม่เหมือนใคร" }, en: { q: "The best games are...", a: "Easy to pick up and smooth to control", b: "Full of worlds and stories like no other" } },
  { axis: "TF", th: { q: "เลือกตัวละครที่จะเล่น", a: "ตัวที่เก่งที่สุด ชนะง่ายสุด", b: "ตัวที่ชอบที่สุด ถึงจะไม่เก่งก็ตาม" }, en: { q: "Picking a character to play", a: "The strongest one, easiest to win with", b: "My favorite, even if it isn't the best" } },
  { axis: "JP", th: { q: "ในเกมมีภารกิจเล็กๆ ให้ทำเต็มไปหมด", a: "ทำให้ครบทีละอัน ไม่ให้ค้าง", b: "ทำแค่อันที่น่าสนใจ ที่เหลือช่างมัน" }, en: { q: "The game is full of little tasks", a: "Finish them one by one, leave nothing", b: "Do the fun ones, skip the rest" } },
  { axis: "EI", th: { q: "เพิ่งเล่นชนะแบบสุดมันส์", a: "รีบเล่าให้เพื่อนฟัง หรือโพสต์อวด", b: "ดีใจอยู่คนเดียว แล้วเล่นต่อ" }, en: { q: "You just won in an amazing way", a: "Tell friends right away or post about it", b: "Enjoy it quietly and keep playing" } },
  { axis: "SN", th: { q: "เห็นโฆษณาเกมใหม่ สิ่งที่ทำให้อยากเล่นคือ...", a: "ได้เห็นว่าเล่นจริงเป็นยังไง", b: "เรื่องราวลึกลับที่ชวนให้อยากรู้" }, en: { q: "Seeing an ad for a new game, what hooks you is...", a: "Seeing how it actually plays", b: "A mysterious story you want to figure out" } },
  { axis: "TF", th: { q: "ช่วงในเกมที่คุณจำได้ไม่ลืม", a: "ตอนเอาชนะด่านยากๆ ได้ด้วยฝีมือ", b: "ตอนที่เรื่องราวทำให้ซึ้งจนน้ำตาซึม" }, en: { q: "The game moment you'll never forget", a: "Beating a really hard level by skill", b: "A story moment that brought you to tears" } },
  { axis: "JP", th: { q: "เกมในเครื่องของคุณ", a: "เล่นทีละเกมจนจบ ค่อยเริ่มเกมใหม่", b: "เปิดเล่นไว้หลายเกม ยังไม่จบสักเกม" }, en: { q: "The games on your phone or console", a: "One at a time, finished before the next", b: "Lots started, none finished" } },
  { axis: "EI", th: { q: "ไปงานเกมที่คนเยอะๆ", a: "สนุก อยากรู้จักคนใหม่ๆ", b: "ไปได้ แต่เหนื่อยเร็ว อยากกลับบ้าน" }, en: { q: "At a crowded gaming event", a: "Fun, I love meeting new people", b: "Okay, but it tires me out fast" } },
  { axis: "SN", th: { q: "เกมมีอัปเดตใหม่ คุณสนใจ...", a: "ของใหม่ที่ช่วยให้เล่นง่ายหรือเก่งขึ้น", b: "ตัวละครใหม่และเรื่องราวที่ต่อจากเดิม" }, en: { q: "A game gets an update. You care about...", a: "Changes that make it easier or help you win", b: "New characters and where the story goes" } },
  { axis: "TF", th: { q: "เพื่อนชวนเล่นเกมที่คุณไม่ค่อยชอบ", a: "บอกตรงๆ ว่าไม่ชอบเพราะอะไร", b: "เล่นด้วย เพราะอยากอยู่กับเพื่อน" }, en: { q: "A friend asks you to play a game you don't like", a: "Tell them honestly why you don't like it", b: "Play anyway, it's about hanging out" } },
  { axis: "JP", th: { q: "เวลาเล่นเกม", a: "กำหนดเวลาไว้ ครบแล้วเลิก", b: "เล่นไปเรื่อยๆ จนพอใจ" }, en: { q: "When you play", a: "Set a time limit and stop when it's up", b: "Keep going until it feels like enough" } },
  { axis: "EI", th: { q: "เกมที่อยากเล่นที่สุดตอนนี้คือ...", a: "เกมที่เล่นกับเพื่อนได้", b: "เกมที่เล่นคนเดียวก็สนุก" }, en: { q: "The game you most want right now is...", a: "One you can play with friends", b: "One that's great to play alone" } },
  { axis: "SN", th: { q: "หัดเล่นเกมใหม่ คุณเรียนรู้ด้วยการ...", a: "ลองกดเองซ้ำๆ จนจำได้", b: "เข้าใจภาพรวมก่อน แล้วค่อยลงรายละเอียด" }, en: { q: "Learning a new game, you...", a: "Try it over and over until it sticks", b: "Get the big picture first, then the details" } },
  { axis: "TF", th: { q: "ก่อนซื้อหรือโหลดเกม คุณดู...", a: "คะแนนรีวิว ข้อดีข้อเสีย", b: "คนที่เล่นแล้วบอกว่ารู้สึกยังไง" }, en: { q: "Before getting a game, you check...", a: "Review scores, pros and cons", b: "How people say it felt to play" } },
  { axis: "JP", th: { q: "ของที่เก็บมาในเกม", a: "จัดเป็นหมวดหมู่ หาง่าย", b: "เก็บไว้รวมๆ เดี๋ยวก็หาเจอ" }, en: { q: "Items you collect in a game", a: "Sorted neatly, easy to find", b: "All mixed together, I'll find it somehow" } }
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
