const questions = [
  [["เพิ่งเข้าเกมใหม่ คุณทำอะไรก่อน?", "You boot up a new game. What comes first?"], ["ชวนเพื่อนเข้าปาร์ตี้","Invite friends to party up"], ["ลองเล่นคนเดียวให้คุ้นมือ","Get comfortable playing solo"]],
  [["หลงทางในแผนที่ใหม่ คุณจะ…", "You get lost on a new map. You…"], ["เปิดแผนที่แล้วตามจุดสังเกต","Open the map and follow landmarks"], ["เดินไปทางแปลก ๆ เผื่อเจอที่ลับ","Take the odd path and look for secrets"]],
  [["เพื่อนอยากใช้ตัวละครที่ไม่เข้าทีม คุณจะ…", "A friend wants a character who clashes with the lineup. You…"], ["ชวนเลือกตัวที่แก้จุดอ่อนของทีม","Suggest a pick that covers the team’s weaknesses"], ["ให้เขาเล่นตัวโปรดแล้วช่วยปรับแผน","Let them play their favorite and adapt together"]],
  [["ก่อนเข้าดันเจี้ยน คุณจะ…", "Before entering a dungeon, you…"], ["จัดของและตกลงแผนก่อน","Sort your gear and agree on a plan"], ["เข้าเลย ค่อยแก้ปัญหาหน้างาน","Jump in and improvise"]],
  [["คืนวันศุกร์ที่อยากเล่นเกม คุณเลือก…", "It’s Friday night. You’re in the mood for…"], ["ห้องเสียงกับแก๊ง","Voice chat with the crew"], ["เกมโปรดกับหูฟังคู่ใจ","A favorite game and your headphones"]],
  [["เกมอัปเดตแพตช์ใหญ่ อะไรดึงดูดคุณก่อน?", "A big patch lands. What catches your eye first?"], ["ตัวเลขที่เปลี่ยนและผลกับบิลด์เดิม","Changed stats and what they mean for your build"], ["คอมโบใหม่ที่อาจไม่มีใครลอง","New combos nobody may have tried"]],
  [["ต้องแจกไอเท็มหายากชิ้นเดียว คุณให้ใคร?", "There’s one rare drop. Who gets it?"], ["คนที่ใช้เพิ่มโอกาสชนะรอบต่อไป","Whoever can use it to improve the next run"], ["คนที่ตามหาไอเท็มนี้มานาน","The person who’s been chasing it for ages"]],
  [["อีเวนต์จะจบในสามวัน คุณจะ…", "An event ends in three days. You…"], ["วางลำดับเควสต์เพื่อเก็บรางวัลที่อยากได้","Prioritize quests for the rewards you want"], ["เข้าเล่นตามอารมณ์แล้วดูว่าได้อะไร","Play whatever feels fun and see what drops"]],
  [["จบรอบสุดมัน คุณอยาก…", "After a great match, you want to…"], ["คุยรีเพลย์กับคนในทีม","Talk through the replay with the team"], ["ดูไฮไลต์เองเงียบ ๆ","Watch your highlights in peace"]],
  [["เลือกบิลด์สำหรับบอสรอบหน้า คุณเชื่ออะไร?", "Picking a build for the next boss, you trust…"], ["บิลด์ที่เคยลองแล้วว่ารอด","A build that’s already worked for you"], ["ไอเดียใหม่ที่อาจพลิกไฟต์","A fresh idea that might turn the fight"]],
  [["ทีมแพ้ติดกัน คุณเริ่มจากอะไร?", "The team is on a losing streak. Where do you start?"], ["หาแพตเทิร์นที่พลาดแล้วเลือกจุดแก้","Find a recurring mistake and pick a fix"], ["เช็กใจเพื่อนก่อน แล้วค่อยชวนเล่นต่อ","Check in with the team before queuing again"]],
  [["มีเวลาเล่นแค่ชั่วโมงเดียว คุณเลือก…", "You have just one hour to play. You…"], ["ตั้งเป้าหมายหนึ่งอย่างแล้วเล่นให้จบ","Pick one goal and finish it"], ["เปิดเกมแล้วตามสิ่งที่สนุกตอนนั้น","Open a game and follow whatever looks fun"]]
];
const profiles = {
  ISTJ:["ผู้พิทักษ์ภารกิจ","Quest Keeper","เช็กของครบ เก็บเควสต์จบ ทีมฝากหลังได้","Gear checked, quests cleared, teammates covered."],
  ISFJ:["ฮีลเลอร์คู่ใจ","Quiet Guardian","จำได้ว่าใครต้องการอะไร ก่อนเจ้าตัวจะขอ","You spot what someone needs before they ask."],
  INFJ:["ผู้เฝ้าเรื่องราว","Lore Keeper","ต่อจิ๊กซอว์เนื้อเรื่อง แล้วพาทีมไปถึงฉากจบ","You piece together the lore and lead friends to the ending."],
  INTJ:["นักวางแผนบอส","Raid Architect","อ่านแพตเทิร์นแล้วเตรียมแผนสำรองไว้เสมอ","You read the boss and always keep a backup plan."],
  ISTP:["ช่างแกะระบบ","Mechanic","ขอลองกับมือ เดี๋ยวก็เจอท่าที่เวิร์ก","Give you the controls and you’ll find what works."],
  ISFP:["นักแต่งตัวละคร","Style Crafter","เจอมุมสวยเมื่อไร หยุดถ่ายรูปก่อนตีบอส","You’ll pause a boss run for the perfect screenshot."],
  INFP:["นักผจญเรื่องราว","Story Wanderer","เลือกทางที่อิน แล้วจำตัวละครไปอีกนาน","You follow the story that moves you and remember its characters."],
  INTP:["นักทดลองบิลด์","Build Alchemist","เห็นสกิลแปลกก็อยากรู้ว่าผสมอะไรได้บ้าง","A strange skill is an invitation to test a new combo."],
  ESTP:["สายเปิดไฟต์","First In","เห็นจังหวะแล้วเข้า คนอื่นค่อยตามมา","You see the opening and go before anyone calls it."],
  ESFP:["ดาวประจำล็อบบี้","Lobby Star","เล่นด้วยแล้วแพ้ก็ยังมีคลิปให้ขำ","Even a loss turns into a funny clip with you around."],
  ENFP:["นักล่าทางลับ","Side Quest Hero","ชวนเพื่อนแวะทางลับ แล้วได้เรื่องเล่ากลับมา","You lead friends down a detour and come back with a story."],
  ENTP:["นักพลิกเมต้า","Meta Breaker","ชวนทีมลองแผนแปลก แล้วดูว่าคู่แข่งตามทันไหม","You pitch an odd strategy and see if opponents can keep up."],
  ESTJ:["กัปตันภารกิจ","Mission Captain","จัดคิว จัดทีม แล้วพาทุกคนลงมือ","You set the lineup, make the calls, and get everyone moving."],
  ESFJ:["เจ้าบ้านล็อบบี้","Party Host","คอยชวนคนเงียบให้มีส่วนร่วมกับทีม","You make sure the quiet player has a place in the party."],
  ENFJ:["โค้ชประจำทีม","Team Coach","เห็นจุดเด่นของเพื่อน แล้วจัดแผนให้ได้ใช้","You see what friends do best and build the plan around it."],
  ENTJ:["ผู้บัญชาการเรด","Raid Commander","ตั้งเป้าชัด แล้วพาทีมเดินแผนให้ถึงชัยชนะ","You set a clear objective and rally the team around it."]
};
function score(answers) {
  return ["EI","SN","TF","JP"].map((pair, axis) => {
    const second = answers[axis] + answers[axis + 4] + answers[axis + 8];
    return pair[Number(second >= 2)];
  }).join("");
}

let language = new URLSearchParams(location.search).get("lang") === "en" ? 1 : 0;
let phase = "intro";
let answers = [];
const screen = document.querySelector("#screen");
const status = document.querySelector("#status");
const lang = document.querySelector("#lang");
const label = (th, en) => language ? en : th;

function render(moveFocus = true) {
  document.documentElement.lang = label("th","en");
  lang.textContent = label("English","ภาษาไทย");
  lang.lang = label("en","th");
  status.textContent = "";
  if (phase === "intro") {
    screen.innerHTML = `<span class="tag">PLAYER PERSONALITY QUIZ</span><h1 tabindex="-1">${label("คุณเป็นเกมเมอร์สายไหน?", "What kind of gamer are you?")}</h1>
      <p>${label("12 สถานการณ์ในเกม • 16 สายเกมเมอร์ • การ์ดแชร์ลง Story", "12 gaming scenarios • 16 player types • A card for your Story")}</p>
      <div class="actions"><button class="primary" id="start">${label("เริ่มเล่น", "Play the quiz")}</button></div>
      <small>${label("ควิซสไตล์ MBTI เพื่อความบันเทิง", "An MBTI-style quiz for entertainment.")}</small>`;
    screen.querySelector("#start").onclick = () => { phase = "quiz"; render(); };
  } else if (phase === "quiz") {
    const index = answers.length;
    const [prompt, first, second] = questions[index];
    const counter = label("ข้อ", "Question") + " " + (index + 1) + " / " + questions.length;
    screen.innerHTML = `<span class="tag">${counter}</span><progress aria-label="${counter}" max="${questions.length}" value="${index + 1}"></progress>
      <h1 tabindex="-1">${prompt[language]}</h1>
      <div class="answers"><button data-answer="0">${first[language]}</button><button data-answer="1">${second[language]}</button></div>
      ${index ? `<div class="actions"><button id="back">${label("ย้อนข้อก่อน", "Previous question")}</button></div>` : ""}`;
    screen.querySelectorAll("[data-answer]").forEach(button => {
      button.onclick = () => {
        answers.push(Number(button.dataset.answer));
        if (answers.length === questions.length) phase = "result";
        render();
      };
    });
    screen.querySelector("#back")?.addEventListener("click", () => { answers.pop(); render(); });
  } else {
    const type = score(answers);
    const profile = profiles[type];
    screen.innerHTML = `<h1 tabindex="-1">${profile[language]}</h1><p>${type} · ${profile[2 + language]}</p>
      <canvas width="1080" height="1920" aria-label="${label("การ์ดสำหรับ IG Stories","Card for IG Stories")}"></canvas>
      <div class="actions"><button class="primary" id="save">${label("บันทึกการ์ด Story", "Save Story card")}</button>
      <button id="copy">${label("คัดลอกลิงก์ควิซ", "Copy quiz link")}</button>
      <button id="retry">${label("เล่นอีกครั้ง", "Play again")}</button></div>`;
    const canvas = screen.querySelector("canvas");
    drawCard(canvas, type, profile);
    screen.querySelector("#save").onclick = () => {
      const link = document.createElement("a");
      link.download = "player-type-" + type + ".png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    screen.querySelector("#copy").onclick = async () => {
      const url = new URL(location.href);
      if (!["http:","https:"].includes(url.protocol) || ["localhost","127.0.0.1","[::1]"].includes(url.hostname)) {
        status.textContent = label("เผยแพร่ควิซก่อนเพื่อให้เพื่อนเปิดลิงก์ได้", "Publish the quiz first so friends can open the link.");
        return;
      }
      url.search = "?lang=" + label("th","en");
      url.hash = "";
      try {
        await navigator.clipboard.writeText(url.href);
        status.textContent = label("คัดลอกแล้ว", "Link copied.");
      } catch {
        status.textContent = url.href;
      }
    };
    screen.querySelector("#retry").onclick = () => { answers = []; phase = "intro"; render(); };
  }
  if (moveFocus) screen.querySelector("h1").focus();
}

function drawCard(canvas, type, profile) {
  const ctx = canvas.getContext("2d");
  const accent = {SJ:"#ffda75",SP:"#fda7ce",NF:"#baf5be",NT:"#c5b6ff"}[type[1] + (type[1] === "S" ? type[3] : type[2])];
  const gradient = ctx.createLinearGradient(0, 0, 1080, 1920);
  gradient.addColorStop(0, "#342040");
  gradient.addColorStop(1, "#120e1b");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 1920);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 4;
  ctx.strokeRect(70, 245, 940, 1380);
  ctx.textAlign = "center";
  ctx.fillStyle = accent;
  ctx.font = "bold 44px system-ui, Tahoma, sans-serif";
  ctx.fillText("PLAYER TYPE", 540, 365);
  ctx.beginPath();
  ctx.moveTo(540, 445); ctx.lineTo(780, 675); ctx.lineTo(540, 905); ctx.lineTo(300, 675); ctx.closePath();
  ctx.stroke();
  ctx.font = "900 135px system-ui, sans-serif";
  ctx.fillText(type, 540, 720, 440);
  ctx.fillStyle = "#faf5ed";
  ctx.font = "bold 92px system-ui, Tahoma, sans-serif";
  ctx.fillText(profile[language], 540, 1080, 845);
  ctx.font = "bold 42px system-ui, Tahoma, sans-serif";
  ctx.fillText(profile[1 - language], 540, 1170, 830);
  ctx.fillStyle = accent;
  ctx.font = "bold 48px system-ui, Tahoma, sans-serif";
  ctx.fillText(label("แล้วคุณสายไหน?", "What’s your player type?"), 540, 1495, 830);
}
lang.onclick = () => { language = 1 - language; render(false); };
render(false);
