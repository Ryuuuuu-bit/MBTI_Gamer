(() => {
  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const LETTERS = { EI: ["E", "I"], SN: ["S", "N"], TF: ["T", "F"], JP: ["J", "P"] };
  const W = 1080, H = 1920; // IG Story size

  let lang = params.get("lang") || localStorage.getItem("lang") ||
    ((navigator.language || "").toLowerCase().startsWith("th") ? "th" : "en");
  if (!UI[lang]) lang = "en";
  let answers = [];   // "a" | "b" per question
  let current = null; // { code, scores }

  // Hook for analytics later (GA4 / Plausible). No-op until one is loaded.
  const track = (event, data) => {
    if (window.gtag) window.gtag("event", event, data);
    if (window.plausible) window.plausible(event, { props: data });
  };

  const t = (key, vars = {}) =>
    UI[lang][key].replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

  function show(id) {
    ["intro", "quiz", "result"].forEach((s) => ($(s).hidden = s !== id));
    window.scrollTo(0, 0);
  }

  function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-t]").forEach((el) => (el.textContent = t(el.dataset.t)));
    document.querySelectorAll(".lang button").forEach((b) => b.classList.toggle("on", b.dataset.lang === lang));
    if (!$("quiz").hidden) renderQuestion();
    if (!$("result").hidden && current) renderResult();
    renderFriendBox();
  }

  // ----- Quiz -----
  function renderQuestion() {
    const i = answers.length;
    const q = QUESTIONS[i][lang];
    $("segments").innerHTML = QUESTIONS.map((_, k) => `<span class="${k < i ? "done" : ""}"></span>`).join("");
    $("qnum").textContent = `${t("question")} ${i + 1} / ${QUESTIONS.length}`;
    $("qText").textContent = q.q;
    $("optA").textContent = q.a;
    $("optB").textContent = q.b;
    $("backBtn").disabled = i === 0;
  }

  function answer(choice) {
    answers.push(choice);
    if (answers.length < QUESTIONS.length) return renderQuestion();
    current = score(answers);
    track("quiz_complete", { type: current.code, lang });
    history.replaceState(null, "", `?r=${current.code}&lang=${lang}`);
    renderResult();
    show("result");
  }

  function score(list) {
    const count = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    list.forEach((c, i) => {
      const [a, b] = LETTERS[QUESTIONS[i].axis];
      count[c === "a" ? a : b]++;
    });
    let code = "";
    const scores = {};
    for (const axis of ["EI", "SN", "TF", "JP"]) {
      const [a, b] = LETTERS[axis];
      const win = count[a] >= count[b] ? a : b;
      code += win;
      scores[axis] = { letter: win, pct: Math.round((count[win] / (count[a] + count[b])) * 100) };
    }
    return { code, scores };
  }

  // ----- Result -----
  async function renderResult() {
    const { code, scores } = current;
    const ty = TYPES[code], d = ty[lang], duo = TYPES[ty.duo];
    $("rDesc").textContent = d.desc;
    $("rStrengths").innerHTML = d.strengths.map((s) => `<li>${s}</li>`).join("");
    $("rGenres").innerHTML = d.genres.map((s) => `<li>${s}</li>`).join("");
    $("rDuo").innerHTML = `${duo.emoji} <b>${ty.duo}</b> · ${duo[lang].name}`;
    $("tagFriend").textContent = t("tagFriend", { duo: ty.duo });

    const gear = (CONFIG.gear || {})[code] || [];
    $("gearBox").hidden = gear.length === 0;
    $("gearList").innerHTML = gear.map((g) =>
      `<li><a href="${g.url}" target="_blank" rel="sponsored noopener">${g.label}</a></li>`).join("");
    const sp = CONFIG.sponsor;
    $("sponsorBox").hidden = !sp;
    if (sp) { $("sponsorBox").href = sp.url; $("sponsorBox").textContent = sp[lang]; }

    const canvas = await drawCard(code, scores);
    $("cardImg").src = canvas.toDataURL("image/png");
    $("cardImg").alt = `${code} ${d.name}`;
    current.canvas = canvas;
  }

  // ----- Story card (1080x1920). IG covers ~250px top and ~250px bottom, keep content inside. -----
  async function drawCard(code, scores) {
    try {
      await Promise.all([document.fonts.load('800 100px "Kanit"'), document.fonts.load('600 40px "Kanit"'), document.fonts.load('400 40px "Kanit"')]);
    } catch (_) { /* fall back to system font */ }
    const ty = TYPES[code], d = ty[lang];
    const F = (w, s) => `${w} ${s}px "Kanit", system-ui, Tahoma, sans-serif`;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const x = c.getContext("2d");

    const g = x.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, ty.color[0]); g.addColorStop(1, ty.color[1]);
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    // decorative glows
    x.globalAlpha = 0.12; x.fillStyle = "#fff";
    [[880, 360, 260], [150, 1500, 320], [960, 1700, 180]].forEach(([cx, cy, r]) => { x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.fill(); });
    x.globalAlpha = 1;

    x.textAlign = "center"; x.textBaseline = "alphabetic"; x.fillStyle = "#fff";
    x.font = F(600, 44); x.globalAlpha = 0.85;
    x.fillText(t("youAre"), W / 2, 300);
    x.globalAlpha = 1;
    x.font = `200px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
    x.fillText(ty.emoji, W / 2, 540);
    x.font = F(800, 210);
    x.fillText(code, W / 2, 780);
    x.font = F(800, 92);
    fitText(x, d.name, W / 2, 900, 960, 92, 800);
    x.font = F(400, 46); x.globalAlpha = 0.9;
    wrap(x, `“${d.tag}”`, W / 2, 985, 900, 58, 2);
    x.globalAlpha = 1;

    // axis bars
    let y = 1150;
    for (const axis of ["EI", "SN", "TF", "JP"]) {
      const { letter, pct } = scores[axis];
      const [a, b] = LETTERS[axis];
      const left = letter === a;
      const barX = 300, barW = 480, barH = 26;
      x.font = F(600, 36); x.textAlign = "right"; x.globalAlpha = left ? 1 : 0.55;
      x.fillText(AXES[a][lang], barX - 24, y + 22);
      x.textAlign = "left"; x.globalAlpha = left ? 0.55 : 1;
      x.fillText(AXES[b][lang], barX + barW + 24, y + 22);
      x.globalAlpha = 0.25; roundRect(x, barX, y, barW, barH, 13); x.fill();
      x.globalAlpha = 1;
      const fillW = barW * pct / 100;
      roundRect(x, left ? barX : barX + barW - fillW, y, fillW, barH, 13); x.fill();
      y += 78;
    }

    // genres + duo
    x.textAlign = "center";
    x.font = F(600, 34); x.globalAlpha = 0.75;
    x.fillText(t("genres"), W / 2, 1500);
    x.globalAlpha = 1; x.font = F(600, 42);
    fitText(x, d.genres.join("  •  "), W / 2, 1558, 960, 42, 600);
    const duo = TYPES[ty.duo];
    x.font = F(600, 34); x.globalAlpha = 0.75;
    x.fillText(t("duo"), W / 2, 1626);
    x.globalAlpha = 1; x.font = F(600, 42);
    fitText(x, `${duo.emoji} ${ty.duo} · ${duo[lang].name}`, W / 2, 1682, 960, 42, 600);

    // footer (just above IG's bottom UI)
    const foot = [CONFIG.igHandle, CONFIG.siteUrl].filter(Boolean).join("  ·  ") || t("tryIt");
    x.font = F(400, 32); x.globalAlpha = 0.8;
    x.fillText(foot, W / 2, 1752);
    x.globalAlpha = 1;
    return c;
  }

  function roundRect(x, rx, ry, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    x.beginPath();
    x.moveTo(rx + r, ry);
    x.arcTo(rx + w, ry, rx + w, ry + h, r);
    x.arcTo(rx + w, ry + h, rx, ry + h, r);
    x.arcTo(rx, ry + h, rx, ry, r);
    x.arcTo(rx, ry, rx + w, ry, r);
    x.closePath();
  }

  function fitText(x, text, cx, cy, maxW, size, weight) {
    let s = size;
    x.font = `${weight} ${s}px "Kanit", system-ui, Tahoma, sans-serif`;
    while (x.measureText(text).width > maxW && s > 20) {
      s -= 2;
      x.font = `${weight} ${s}px "Kanit", system-ui, Tahoma, sans-serif`;
    }
    x.fillText(text, cx, cy);
  }

  // Wraps by word; Thai has no spaces, so segment with Intl.Segmenter when available.
  function wrap(x, text, cx, cy, maxW, lineH, maxLines) {
    let parts;
    if (window.Intl && Intl.Segmenter) {
      parts = [...new Intl.Segmenter(lang, { granularity: "word" }).segment(text)].map((s) => s.segment);
    } else {
      parts = lang === "th" ? [...text] : text.split(/(\s+)/);
    }
    const lines = [];
    let line = "";
    for (const p of parts) {
      if (x.measureText(line + p).width > maxW && line) { lines.push(line.trim()); line = p; }
      else line += p;
    }
    if (line.trim()) lines.push(line.trim());
    lines.slice(0, maxLines).forEach((l, i) => x.fillText(l, cx, cy + i * lineH));
  }

  // ----- Share / save / copy -----
  function shareUrl() {
    return `${location.origin}${location.pathname}?r=${current.code}&lang=${lang}`;
  }

  function toBlob(canvas) {
    return new Promise((res) => canvas.toBlob(res, "image/png"));
  }

  async function share() {
    track("share_click", { type: current.code });
    const blob = await toBlob(current.canvas);
    const file = new File([blob], `gamer-type-${current.code}.png`, { type: "image/png" });
    const d = TYPES[current.code][lang];
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], text: t("shareText", { name: d.name, code: current.code }) });
        track("share_done", { type: current.code });
        return;
      } catch (e) {
        if (e.name === "AbortError") return;
      }
    }
    save(); // desktop / unsupported in-app browsers
  }

  function save() {
    track("save_click", { type: current.code });
    const a = document.createElement("a");
    a.href = $("cardImg").src;
    a.download = `gamer-type-${current.code}.png`;
    document.body.appendChild(a); a.click(); a.remove();
    $("hint").hidden = false; // in-app browsers (IG/FB/LINE) often block downloads: long-press works
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareUrl());
      $("copyBtn").textContent = t("copied");
      setTimeout(() => ($("copyBtn").textContent = t("copy")), 1500);
    } catch (_) {
      prompt("", shareUrl());
    }
  }

  // Someone opened a friend's shared link (?r=CODE): show it, invite them to play.
  function renderFriendBox() {
    const r = (params.get("r") || "").toUpperCase();
    const box = $("friendBox");
    if (!TYPES[r] || current) { box.hidden = true; return; }
    box.hidden = false;
    box.innerHTML = `${t("friendGot")}<br><b>${TYPES[r].emoji} ${r} · ${TYPES[r][lang].name}</b><br>${t("playYourself")} 👇`;
  }

  // ----- Wire up -----
  document.querySelectorAll(".lang button").forEach((b) => b.addEventListener("click", () => {
    lang = b.dataset.lang; localStorage.setItem("lang", lang);
    if (current) history.replaceState(null, "", `?r=${current.code}&lang=${lang}`);
    applyLang();
  }));
  $("startBtn").onclick = () => { answers = []; track("quiz_start", { lang }); show("quiz"); renderQuestion(); };
  $("optA").onclick = () => answer("a");
  $("optB").onclick = () => answer("b");
  $("backBtn").onclick = () => { answers.pop(); renderQuestion(); };
  $("shareBtn").onclick = share;
  $("saveBtn").onclick = save;
  $("copyBtn").onclick = copy;
  $("retryBtn").onclick = () => { answers = []; current = null; history.replaceState(null, "", `?lang=${lang}`); show("intro"); applyLang(); };

  applyLang();
  show("intro");
})();
