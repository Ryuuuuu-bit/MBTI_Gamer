(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const LETTERS = { EI: ["E", "I"], SN: ["S", "N"], TF: ["T", "F"], JP: ["J", "P"] };
  const AXIS_ORDER = ["EI", "SN", "TF", "JP"];
  const BORDERLINE = 60; // winning side at or below this % = close call
  const SCREENS = ["home", "create", "quiz", "result"];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let lang = params.get("lang") || localStorage.getItem("lang") ||
    ((navigator.language || "").toLowerCase().startsWith("th") ? "th" : "en");
  if (!UI[lang]) lang = "th";
  let gender = ["m", "f"].includes(params.get("g")) ? params.get("g") : (localStorage.getItem("gender") || "m");
  let answers = [];   // values +2/+1/-1/-2 (+ = statement a)
  let result = null;  // { code, axes, canvas }

  const track = (event, data = {}) => {
    if (window.gtag) window.gtag("event", event, data);
    if (window.plausible) window.plausible(event, { props: data });
  };
  const t = (key, vars = {}) => String(UI[lang][key]).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const colorOf = (code) => GROUPS[groupOf(code)].color;

  // ---------- Hero art: gendered hero -> original chibi -> emoji ----------
  function artSources(code, g = gender) {
    const list = (CONFIG.heroExts || [".webp", ".png"]).map((ext) => `${CONFIG.heroPath}${code}-${g}${ext}`);
    list.push(`${CONFIG.artPath}${code}${CONFIG.artExt || ".png"}`);
    return list;
  }
  window.__nextArt = (img) => {
    const rest = (img.dataset.alt || "").split("|").filter(Boolean);
    if (rest.length) { img.dataset.alt = rest.slice(1).join("|"); img.src = rest[0]; }
    else img.parentNode.classList.add("noart");
  };
  function chibi(code, g = gender) {
    const ty = TYPES[code], [first, ...rest] = artSources(code, g);
    return `<div class="chibi" style="--tc:${colorOf(code)}">` +
      `<img src="${first}" data-alt="${rest.join("|")}" alt="${code} ${esc(ty[lang].name)}" loading="lazy" decoding="async" onerror="__nextArt(this)">` +
      `<span class="emoji" aria-hidden="true">${ty.emoji}</span></div>`;
  }
  const imgCache = {};
  function loadImage(src) {
    if (!imgCache[src]) {
      imgCache[src] = new Promise((res) => {
        const img = new Image();
        img.onload = () => res(img);
        img.onerror = () => res(null);
        img.src = src;
      });
    }
    return imgCache[src];
  }
  async function loadFirst(srcs) {
    for (const s of srcs) { const img = await loadImage(s); if (img) return img; }
    return null;
  }

  // ---------- Screens ----------
  function show(id) {
    const swap = () => {
      SCREENS.forEach((s) => ($(s).hidden = s !== id));
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    if (document.startViewTransition && !reduceMotion) document.startViewTransition(swap); else swap();
  }
  function setColor(hex) { document.documentElement.style.setProperty("--c", hex); }

  function setGender(g) {
    gender = g;
    localStorage.setItem("gender", g);
    document.querySelectorAll("[data-gender]").forEach((b) => b.classList.toggle("on", b.dataset.gender === g));
    renderGallery();
    if (result && !$("result").hidden) {
      history.replaceState(null, "", `?r=${result.code}&g=${gender}&lang=${lang}`);
      renderResult(false);
    }
  }

  // ---------- Title screen ----------
  function renderHome() {
    $("heroChips").innerHTML = UI[lang].chips.map((c) => `<li>${c}</li>`).join("");
    // Title party: one hero per faction, mixed genders
    $("heroArt").innerHTML = `<div class="party">${[["INTJ", "m"], ["ENFP", "f"], ["ESTJ", "m"], ["ISFP", "f"]].map(([c, g]) => chibi(c, g)).join("")}</div>`;
    renderGallery();
    $("about").innerHTML = UI[lang].about.map(([h, p]) => `<div class="panel reveal"><b>${h}</b><p>${p}</p></div>`).join("");

    const r = (params.get("r") || "").toUpperCase();
    const fb = $("friendBox");
    if (TYPES[r] && !result) {
      fb.hidden = false;
      fb.style.setProperty("--c", colorOf(r));
      fb.innerHTML = `${chibi(r, params.get("g") === "f" ? "f" : "m")}<div>${t("friendGot")} <b>${r} · ${esc(TYPES[r][lang].name)}</b><br><span class="muted">${t("playYourself")} 👇</span></div>`;
    } else fb.hidden = true;
  }

  function renderGallery() {
    $("groups").innerHTML = Object.entries(GROUPS).map(([g, info]) => {
      const codes = Object.keys(TYPES).filter((c) => groupOf(c) === g);
      return `<div class="panel faction-panel reveal" style="--tc:${info.color}">
        <div class="faction-head"><span class="emblem"><span>${info.icon}</span></span><b>${info[lang]}</b></div>
        <div class="tiles">${codes.map((c) => `
          <button class="slot" data-code="${c}" style="--tc:${info.color}">
            ${chibi(c)}<span class="t-code">${c}</span><span class="t-name">${esc(TYPES[c][lang].name)}</span>
          </button>`).join("")}</div></div>`;
    }).join("");
  }

  // ---------- Hero detail dialog ----------
  function openType(code) {
    const ty = TYPES[code], d = ty[lang], col = colorOf(code);
    $("dlgBody").innerHTML = `
      <div class="dlg-head" style="--c:${col}">${chibi(code)}
        <div><div class="code">${code}</div><h2>${esc(d.name)}</h2><p>“${esc(d.tag)}”</p></div></div>
      <p>${esc(d.desc)}</p>
      <h3>${t("strengths")}</h3><ul class="chips" style="--c:${col}">${d.strengths.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
      <h3>${t("genres")}</h3><ul class="chips" style="--c:${col}">${d.genres.map((g) => `<li>${esc(g)}</li>`).join("")}</ul>
      <h3>${t("duo")}</h3><p>${TYPES[ty.duo].emoji} <b>${ty.duo}</b> · ${esc(TYPES[ty.duo][lang].name)}</p>`;
    $("typeDialog").showModal();
    track("type_view", { type: code, gender });
  }

  // ---------- Choose hero ----------
  function openCreate() {
    $("pickM").innerHTML = chibi("ESTP", "m");
    $("pickF").innerHTML = chibi("ENFP", "f");
    document.querySelectorAll(".pick").forEach((b) => b.classList.toggle("on", b.dataset.gender === gender));
    show("create");
  }

  // ---------- Quest ----------
  function startQuiz() {
    answers = [];
    result = null;
    setColor("#8B5CF6");
    track("quiz_start", { lang, gender });
    $("npcArt").innerHTML = chibi("ESFJ");
    show("quiz");
    renderQuestion();
  }

  function renderQuestion() {
    const i = answers.length, q = QUESTIONS[i][lang];
    $("qCount").textContent = t("qOf", { n: i + 1, t: QUESTIONS.length });
    $("progressBar").style.width = `${(i / QUESTIONS.length) * 100}%`;
    $("qText").textContent = q.q;
    $("stmtA").textContent = q.a;
    $("stmtB").textContent = q.b;
    document.querySelectorAll(".gem").forEach((d, k) => { d.classList.remove("sel"); d.setAttribute("aria-label", UI[lang].scale[k]); });
    document.querySelectorAll(".choice").forEach((s) => s.classList.remove("sel"));
    $("backBtn").disabled = i === 0;
  }

  let locked = false;
  function answer(v) {
    if (locked) return;
    locked = true;
    document.querySelector(`.gem[data-v="${v}"]`).classList.add("sel");
    if (Math.abs(v) === 2) $(v > 0 ? "stmtA" : "stmtB").classList.add("sel");
    setTimeout(() => {
      locked = false;
      answers.push(v);
      if (answers.length < QUESTIONS.length) {
        renderQuestion();
        const card = $("qCard");
        card.classList.remove("next"); void card.offsetWidth; card.classList.add("next");
      } else finish();
    }, 220);
  }

  function score(list) {
    const sums = { EI: 0, SN: 0, TF: 0, JP: 0 }, counts = { EI: 0, SN: 0, TF: 0, JP: 0 };
    list.forEach((v, i) => { const ax = QUESTIONS[i].axis; sums[ax] += v; counts[ax]++; });
    let code = "";
    const axes = {};
    for (const ax of AXIS_ORDER) {
      const [a, b] = LETTERS[ax];
      const s = sums[ax], max = counts[ax] * 2;
      const letter = s >= 0 ? a : b; // 5 odd values per axis -> sum is never 0
      const pct = Math.round(50 + (Math.abs(s) / max) * 50);
      code += letter;
      axes[ax] = { letter, pct, close: pct <= BORDERLINE };
    }
    return { code, axes };
  }

  function finish() {
    result = score(answers);
    track("quiz_complete", { type: result.code, lang, gender });
    history.replaceState(null, "", `?r=${result.code}&g=${gender}&lang=${lang}`);
    renderResult(true);
    show("result");
  }

  // ---------- Class reveal ----------
  async function renderResult(animate) {
    const { code, axes } = result, ty = TYPES[code], d = ty[lang], g = groupOf(code);
    setColor(colorOf(code));
    if (animate) { const u = $("unlockBanner").firstElementChild; u.style.animation = "none"; void u.offsetWidth; u.style.animation = ""; }
    $("rArt").innerHTML = chibi(code);
    $("rCode").textContent = code;
    $("rName").textContent = d.name;
    $("rTag").textContent = `“${d.tag}”`;
    $("rGroup").textContent = `${GROUPS[g].icon} ${GROUPS[g][lang]}`;

    $("rAxes").innerHTML = AXIS_ORDER.map((ax) => {
      const [a, b] = LETTERS[ax], { letter, pct, close } = axes[ax], left = letter === a;
      return `<div class="stat">
        <div class="stat-top">
          <span class="${left ? "" : "off"}">${AXES[a][lang]}${left ? ` <span class="pct">${pct}</span>` : ""}</span>
          <span>${close ? `<span class="tag-border">${t("borderline")}</span>` : ""}</span>
          <span class="${left ? "off" : ""}">${left ? "" : `<span class="pct">${pct}</span> `}${AXES[b][lang]}</span>
        </div>
        <div class="bar ${left ? "" : "right"}"><span data-w="${pct}"></span></div></div>`;
    }).join("");
    $("rBorderNote").hidden = !AXIS_ORDER.some((ax) => axes[ax].close);
    requestAnimationFrame(() => requestAnimationFrame(() =>
      document.querySelectorAll(".bar span").forEach((s) => (s.style.width = s.dataset.w + "%"))));

    $("rDesc").textContent = d.desc;
    $("rStrengths").innerHTML = d.strengths.map((s, i) => `<li><i><b>${["I", "II", "III"][i] || "◆"}</b></i>${esc(s)}</li>`).join("");
    $("rGenres").innerHTML = d.genres.map((s) => `<li>${esc(s)}</li>`).join("");
    const duo = TYPES[ty.duo];
    $("rDuo").innerHTML = `${chibi(ty.duo)}<div><b>${ty.duo}</b>${esc(duo[lang].name)}<p class="note">${t("duoNote")}</p></div>`;
    $("rDuo").onclick = () => openType(ty.duo);
    $("rTagFriend").textContent = t("tagFriend", { duo: ty.duo });
    document.querySelectorAll("[data-gender]").forEach((b) => b.classList.toggle("on", b.dataset.gender === gender));

    const gear = (CONFIG.gear || {})[code] || [];
    $("gearBox").hidden = !gear.length;
    $("gearList").innerHTML = gear.map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="sponsored noopener">${esc(x.label)}</a></li>`).join("");
    const sp = CONFIG.sponsor;
    $("sponsorBox").hidden = !sp;
    if (sp) { $("sponsorBox").href = sp.url; $("sponsorBox").textContent = sp[lang]; }

    const forCode = code, forGender = gender;
    let canvas = await drawCard(code, axes);
    let url;
    try { url = canvas.toDataURL("image/png"); }
    catch (_) { canvas = await drawCard(code, axes, true); url = canvas.toDataURL("image/png"); }
    if (!result || result.code !== forCode || gender !== forGender) return; // a newer render took over
    result.canvas = canvas;
    $("cardImg").src = url;
    $("cardImg").alt = `${code} ${d.name}`;
  }

  // ---------- IG Story card 1080x1920 (content kept out of IG's top/bottom ~220px) ----------
  async function drawCard(code, axes, noArt = false) {
    const W = 1080, H = 1920;
    const ty = TYPES[code], d = ty[lang], col = colorOf(code);
    const BODY = `"Anuphan", sans-serif`;
    const NAME = lang === "th" ? `"Chonburi", "Anuphan", serif` : `"Cinzel", serif`;
    try {
      await Promise.all([`900 100px "Cinzel"`, `700 40px "Cinzel"`, `400 60px "Chonburi"`, `600 40px "Anuphan"`].map((f) => document.fonts.load(f, "กขAa")));
    } catch (_) {}
    const art = noArt ? null : await loadFirst(artSources(code));
    const GOLD = "#f2c46d", GOLD2 = "#b98632";

    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const x = c.getContext("2d");
    const bg = x.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#0d0f20"); bg.addColorStop(1, "#050509");
    x.fillStyle = bg; x.fillRect(0, 0, W, H);
    const glow = (cx, cy, r, color, a) => {
      const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, color); g.addColorStop(1, "transparent");
      x.globalAlpha = a; x.fillStyle = g; x.fillRect(cx - r, cy - r, r * 2, r * 2); x.globalAlpha = 1;
    };
    glow(540, 650, 560, col, 0.85);
    glow(540, 1000, 300, GOLD, 0.25);
    // embers
    for (let i = 0; i < 60; i++) {
      const px = (i * 997) % W, py = 200 + ((i * 613) % 1500), r = 1 + (i % 3);
      x.globalAlpha = 0.15 + (i % 5) * 0.1; x.fillStyle = i % 4 ? GOLD : "#fff";
      x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.fill();
    }
    x.globalAlpha = 1;

    // ornate outer frame
    const frame = (fx, fy, fw, fh) => {
      x.strokeStyle = GOLD; x.lineWidth = 3; x.strokeRect(fx, fy, fw, fh);
      x.strokeStyle = "rgba(242,196,109,.35)"; x.lineWidth = 1; x.strokeRect(fx + 10, fy + 10, fw - 20, fh - 20);
      x.fillStyle = GOLD;
      [[fx, fy], [fx + fw, fy], [fx, fy + fh], [fx + fw, fy + fh]].forEach(([cx, cy]) => {
        x.save(); x.translate(cx, cy); x.rotate(Math.PI / 4); x.fillRect(-11, -11, 22, 22); x.restore();
      });
    };
    frame(50, 170, W - 100, 1600);

    // rune circle under the hero
    x.save(); x.translate(540, 985); x.scale(1, 0.28);
    x.strokeStyle = col; x.lineWidth = 6; x.setLineDash([18, 14]); x.shadowColor = col; x.shadowBlur = 30;
    x.beginPath(); x.arc(0, 0, 330, 0, Math.PI * 2); x.stroke();
    x.setLineDash([]); x.strokeStyle = GOLD; x.lineWidth = 3; x.shadowBlur = 0;
    x.beginPath(); x.arc(0, 0, 250, 0, Math.PI * 2); x.stroke();
    x.restore();

    // banner
    x.textAlign = "center";
    const bannerW = 560;
    x.fillStyle = (() => { const g = x.createLinearGradient(0, 215, 0, 285); g.addColorStop(0, "#ffe7ad"); g.addColorStop(0.5, GOLD); g.addColorStop(1, GOLD2); return g; })();
    x.beginPath(); x.moveTo(540 - bannerW / 2, 215); x.lineTo(540 + bannerW / 2, 215); x.lineTo(540 + bannerW / 2 - 26, 250);
    x.lineTo(540 + bannerW / 2, 285); x.lineTo(540 - bannerW / 2, 285); x.lineTo(540 - bannerW / 2 + 26, 250); x.closePath(); x.fill();
    x.fillStyle = "#1c1206"; fit(x, t("unlocked"), 540, 264, bannerW - 90, 38, lang === "th" ? 400 : 800, NAME);

    if (art) x.drawImage(art, (W - 700) / 2, 300, 700, 700);
    else { x.fillStyle = "#fff"; x.font = `300px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`; x.fillText(ty.emoji, W / 2, 820); }

    // code + name
    const cg = x.createLinearGradient(0, 1050, 0, 1200);
    cg.addColorStop(0, "#fff8e6"); cg.addColorStop(0.55, GOLD); cg.addColorStop(1, GOLD2);
    x.font = `900 170px "Cinzel", serif`; x.fillStyle = "#4a3110"; x.fillText(code, W / 2, 1196);
    x.fillStyle = cg; x.fillText(code, W / 2, 1190);
    x.fillStyle = "#fff3d6"; fit(x, d.name, W / 2, 1282, 880, 68, lang === "th" ? 400 : 800, NAME);
    x.fillStyle = "#cfc3a8"; fit(x, `“${d.tag}”`, W / 2, 1338, 860, 34, 400, BODY);

    // stat bars
    let y = 1392;
    for (const ax of AXIS_ORDER) {
      const [a, b] = LETTERS[ax], { letter, pct } = axes[ax], left = letter === a;
      const bx = 330, bw = 420, bh = 22;
      x.font = `600 31px ${BODY}`;
      x.textAlign = "right"; x.fillStyle = left ? "#fff3d6" : "#8d846f"; x.fillText(AXES[a][lang], bx - 22, y + 19);
      x.textAlign = "left"; x.fillStyle = left ? "#8d846f" : "#fff3d6"; x.fillText(AXES[b][lang], bx + bw + 22, y + 19);
      x.fillStyle = "rgba(0,0,0,.6)"; x.fillRect(bx, y, bw, bh);
      x.strokeStyle = "rgba(242,196,109,.5)"; x.lineWidth = 2; x.strokeRect(bx, y, bw, bh);
      const fw = (bw * pct) / 100;
      const bg2 = x.createLinearGradient(0, y, 0, y + bh); bg2.addColorStop(0, "#fff"); bg2.addColorStop(0.35, col); bg2.addColorStop(1, col);
      x.fillStyle = bg2; x.fillRect(left ? bx + 2 : bx + bw - fw + 2, y + 2, fw - 4, bh - 4);
      y += 56;
    }
    x.textAlign = "center";
    const duo = TYPES[ty.duo];
    x.fillStyle = GOLD; fit(x, `${t("duo")}: ${duo.emoji} ${ty.duo} · ${duo[lang].name}`, W / 2, 1660, 860, 32, 600, BODY);
    const foot = [CONFIG.igHandle, CONFIG.siteUrl].filter(Boolean).join("  ·  ") || `16 Gamer Heroes · ${t("tryIt")}`;
    x.fillStyle = "#a99d84"; x.font = `500 28px ${BODY}`; x.fillText(foot, W / 2, 1732);
    return c;
  }
  function fit(x, text, cx, cy, maxW, size, weight, fam) {
    let s = size;
    do { x.font = `${weight} ${s}px ${fam}`; s -= 2; } while (x.measureText(text).width > maxW && s > 16);
    x.fillText(text, cx, cy);
  }

  // ---------- Share / save / copy ----------
  const shareUrl = () => `${location.origin}${location.pathname}?r=${result.code}&g=${gender}&lang=${lang}`;
  async function share() {
    if (!result.canvas) return;
    track("share_click", { type: result.code, gender });
    const blob = await new Promise((r) => result.canvas.toBlob(r, "image/png"));
    const file = new File([blob], `gamer-hero-${result.code}.png`, { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], text: t("shareText", { name: TYPES[result.code][lang].name, code: result.code }) });
        track("share_done", { type: result.code });
        return;
      } catch (e) { if (e.name === "AbortError") return; }
    }
    save();
  }
  function save() {
    track("save_click", { type: result.code, gender });
    const a = document.createElement("a");
    a.href = $("cardImg").src; a.download = `gamer-hero-${result.code}.png`;
    document.body.appendChild(a); a.click(); a.remove();
    $("hint").hidden = false;
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(shareUrl());
      $("copyBtn").textContent = t("copied");
      setTimeout(() => ($("copyBtn").textContent = t("copy")), 1600);
    } catch (_) { prompt("", shareUrl()); }
  }

  // ---------- Language ----------
  function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-t]").forEach((el) => (el.textContent = t(el.dataset.t)));
    document.querySelectorAll("[data-th]").forEach((el) => (el.innerHTML = UI[lang][el.dataset.th]));
    document.querySelectorAll(".seg button[data-lang]").forEach((b) => b.classList.toggle("on", b.dataset.lang === lang));
    document.querySelectorAll("[data-gender]").forEach((b) => b.classList.toggle("on", b.dataset.gender === gender));
    renderHome();
    if (!$("quiz").hidden) renderQuestion();
    if (result && !$("result").hidden) renderResult(false);
  }

  // ---------- Embers (floating sparks) ----------
  function embers() {
    const cv = $("embers"), ctx = cv.getContext("2d");
    if (reduceMotion) return;
    let w, h, parts = [];
    const resize = () => { w = cv.width = innerWidth; h = cv.height = innerHeight; };
    resize(); addEventListener("resize", resize);
    const n = innerWidth < 600 ? 26 : 48;
    for (let i = 0; i < n; i++) parts.push({ x: Math.random() * w, y: Math.random() * h, r: 0.6 + Math.random() * 1.8, s: 0.2 + Math.random() * 0.6, d: Math.random() * 6.28, a: 0.2 + Math.random() * 0.6 });
    (function tick() {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y -= p.s; p.d += 0.01; p.x += Math.sin(p.d) * 0.3;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        ctx.globalAlpha = p.a * (0.6 + 0.4 * Math.sin(p.d * 3));
        ctx.fillStyle = "#f6cf7f"; ctx.shadowColor = "#f2c46d"; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28); ctx.fill();
      }
      requestAnimationFrame(tick);
    })();
  }

  // ---------- Wire up ----------
  document.querySelectorAll(".seg button[data-lang]").forEach((b) => b.addEventListener("click", () => {
    lang = b.dataset.lang; localStorage.setItem("lang", lang);
    if (result) history.replaceState(null, "", `?r=${result.code}&g=${gender}&lang=${lang}`);
    applyLang();
  }));
  document.querySelectorAll(".gender-seg [data-gender]").forEach((b) => b.addEventListener("click", () => setGender(b.dataset.gender)));
  document.querySelectorAll(".pick").forEach((b) => b.addEventListener("click", () => {
    setGender(b.dataset.gender);
    document.querySelectorAll(".pick").forEach((p) => p.classList.toggle("on", p === b));
  }));
  $("startBtn").onclick = openCreate;
  $("goBtn").onclick = startQuiz;
  $("createBack").onclick = () => show("home");
  $("retryBtn").onclick = openCreate;
  $("quitBtn").onclick = () => { answers = []; show("home"); };
  $("homeLink").onclick = (e) => { e.preventDefault(); result = null; setColor("#8B5CF6"); history.replaceState(null, "", `?lang=${lang}`); renderHome(); show("home"); };
  $("stmtA").onclick = () => answer(2);
  $("stmtB").onclick = () => answer(-2);
  document.querySelectorAll(".gem").forEach((d) => (d.onclick = () => answer(Number(d.dataset.v))));
  $("backBtn").onclick = () => { answers.pop(); renderQuestion(); };
  $("shareBtn").onclick = share;
  $("saveBtn").onclick = save;
  $("copyBtn").onclick = copy;
  $("groups").addEventListener("click", (e) => { const b = e.target.closest(".slot"); if (b) openType(b.dataset.code); });
  $("dlgClose").onclick = () => $("typeDialog").close();
  $("typeDialog").addEventListener("click", (e) => { if (e.target === $("typeDialog")) $("typeDialog").close(); });
  document.addEventListener("keydown", (e) => {
    if ($("quiz").hidden) return;
    const map = { "1": 2, "2": 1, "3": -1, "4": -2 };
    if (map[e.key]) answer(map[e.key]);
    if (e.key === "Backspace" && answers.length) { answers.pop(); renderQuestion(); }
  });
  const tilt = $("rArt");
  tilt.addEventListener("pointermove", (e) => {
    const r = tilt.getBoundingClientRect();
    tilt.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 16}deg`);
    tilt.style.setProperty("--rx", `${-((e.clientY - r.top) / r.height - 0.5) * 16}deg`);
  });
  tilt.addEventListener("pointerleave", () => { tilt.style.setProperty("--rx", "0deg"); tilt.style.setProperty("--ry", "0deg"); });

  applyLang();
  embers();
})();
