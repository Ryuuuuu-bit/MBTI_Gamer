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

  // ---------- Visit counter (served by server.js; hidden if the API is not there) ----------
  let lastStats = null;
  function renderStats(s, animate = true) {
    if (!s || typeof s.visits !== "number") return;
    lastStats = s;
    $("statsBox").hidden = false;
    const fmt = (n) => Math.round(n).toLocaleString(lang === "th" ? "th-TH" : "en-US");
    document.querySelectorAll("[data-stat]").forEach((el) => {
      const to = s[el.dataset.stat] || 0, from = animate ? Number(el.dataset.v || 0) : to;
      el.dataset.v = to;
      if (reduceMotion || from === to) { el.textContent = fmt(to); return; }
      const t0 = performance.now(), dur = 900;
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(from + (to - from) * e);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }
  async function hit(e, extra = {}) {
    try {
      const r = await fetch("/api/hit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ e, ...extra }), keepalive: true });
      if (r.ok) renderStats(await r.json());
    } catch (_) {}
  }
  async function countVisit() {
    try {
      if (!sessionStorage.getItem("gh_visit")) {
        sessionStorage.setItem("gh_visit", "1");          // one visit per browser session
        const isNew = !localStorage.getItem("gh_vid");     // one visitor per browser (random id, no personal data)
        if (isNew) localStorage.setItem("gh_vid", (crypto.randomUUID && crypto.randomUUID()) || String(Math.random()).slice(2));
        return hit("visit", { newVisitor: isNew });
      }
      const r = await fetch("/api/stats");
      if (r.ok) renderStats(await r.json());
    } catch (_) {}
  }

  // ---------- Hero art: gendered hero -> first chibi -> emoji ----------
  function artSources(code, g = gender, full = false) {
    const list = (CONFIG.heroExts || [".webp", ".png"]).map((ext) => `${CONFIG.heroPath}${code}-${g}${ext}`);
    if (!full) list.unshift(`${CONFIG.heroPath}thumb/${code}-${g}.webp`); // 384px, ~38 KB
    list.push(`${CONFIG.artPath}${code}${CONFIG.artExt || ".png"}`);
    return list;
  }
  window.__nextArt = (img) => {
    const rest = (img.dataset.alt || "").split("|").filter(Boolean);
    if (rest.length) { img.dataset.alt = rest.slice(1).join("|"); img.src = rest[0]; }
    else img.parentNode.classList.add("noart");
  };
  function chibi(code, g = gender, full = false) {
    const ty = TYPES[code], [first, ...rest] = artSources(code, g, full);
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

  // ---------- Screens (View Transitions when supported) ----------
  let current = "home";
  function show(id, mode = "push") {
    if (mode === "push" && id !== current) history.pushState({ screen: id }, "", location.search);
    else if (mode === "replace") history.replaceState({ screen: id }, "", location.search);
    current = id;
    const swap = () => {
      SCREENS.forEach((s) => ($(s).hidden = s !== id));
      $("shareBar").hidden = id !== "result";
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    if (document.startViewTransition && !reduceMotion) document.startViewTransition(swap); else swap();
  }
  function setColor(hex) { document.documentElement.style.setProperty("--c", hex); }

  function markGender() {
    document.querySelectorAll("[data-gender]").forEach((b) => {
      b.classList.toggle("on", b.dataset.gender === gender);
      b.setAttribute("aria-pressed", b.dataset.gender === gender);
    });
  }
  function setGender(g) {
    gender = g;
    localStorage.setItem("gender", g);
    markGender();
    renderGallery();
    if (result && !$("result").hidden) {
      history.replaceState(null, "", `?r=${result.code}&g=${gender}&lang=${lang}`);
      renderResult();
    }
  }

  // ---------- Home ----------
  function renderHome() {
    $("heroChips").innerHTML = UI[lang].chips.map((c) => `<li>${c}</li>`).join("");
    $("heroArt").innerHTML = `<div class="party">${[["INTJ", "m"], ["ENFP", "f"], ["ESTJ", "m"], ["ISFP", "f"]].map(([c, g]) => chibi(c, g)).join("")}</div>`;
    renderGallery();
    $("about").innerHTML = UI[lang].about.map(([h, p]) => `<div class="tile glass reveal"><b>${h}</b><p>${p}</p></div>`).join("");

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
      return `<div class="group reveal" style="--tc:${info.color}">
        <div class="group-head"><b><span class="ico">${info.icon}</span>${info[lang]}</b></div>
        <div class="tiles">${codes.map((c) => `
          <button class="type-tile" data-code="${c}" style="--tc:${info.color}">
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
      <h3 style="margin-top:18px">${t("genres")}</h3><ul class="chips" style="--c:${col}">${d.genres.map((g) => `<li>${esc(g)}</li>`).join("")}</ul>
      <h3 style="margin-top:18px">${t("duo")}</h3><p>${TYPES[ty.duo].emoji} <b>${ty.duo}</b> · ${esc(TYPES[ty.duo][lang].name)}</p>`;
    $("typeDialog").showModal();
    track("type_view", { type: code, gender });
  }

  // ---------- Choose hero ----------
  function openCreate() {
    markGender();
    show("create");
  }

  // ---------- Quiz ----------
  function startQuiz() {
    answers = [];
    result = null;
    setColor("#8B5CF6");
    track("quiz_start", { lang, gender });
    hit("start");
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
    document.querySelectorAll(".dot").forEach((d, k) => { d.classList.remove("sel"); d.setAttribute("aria-label", UI[lang].scale[k]); });
    document.querySelectorAll(".stmt").forEach((s) => s.classList.remove("sel"));
    $("backBtn").disabled = i === 0;
  }

  let locked = false;
  function answer(v) {
    if (locked) return;
    locked = true;
    document.querySelector(`.dot[data-v="${v}"]`).classList.add("sel");
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
    hit("complete", { type: result.code, g: gender });
    history.replaceState({ screen: "quiz" }, "", `?r=${result.code}&g=${gender}&lang=${lang}`);
    renderResult();
    show("result", "replace"); // back from the result goes to the hero picker, not into the quiz
  }

  // ---------- Result ----------
  async function renderResult() {
    const { code, axes } = result, ty = TYPES[code], d = ty[lang], g = groupOf(code);
    setColor(colorOf(code));
    $("rArt").innerHTML = chibi(code, gender, true);
    $("rCode").textContent = code;
    $("rName").textContent = d.name;
    $("rTag").textContent = `“${d.tag}”`;
    $("rGroup").textContent = `${GROUPS[g].icon} ${GROUPS[g][lang]}`;
    markGender();

    $("rAxes").innerHTML = AXIS_ORDER.map((ax) => {
      const [a, b] = LETTERS[ax], { letter, pct, close } = axes[ax], left = letter === a;
      return `<div class="axis">
        <div class="axis-top">
          <span class="${left ? "" : "off"}">${AXES[a][lang]}${left ? ` <span class="axis-pct">${pct}%</span>` : ""}</span>
          <span>${close ? `<span class="tag-border">${t("borderline")}</span>` : ""}</span>
          <span class="${left ? "off" : ""}">${left ? "" : `<span class="axis-pct">${pct}%</span> `}${AXES[b][lang]}</span>
        </div>
        <div class="bar ${left ? "" : "right"}"><span data-w="${pct}"></span></div></div>`;
    }).join("");
    $("rBorderNote").hidden = !AXIS_ORDER.some((ax) => axes[ax].close);
    requestAnimationFrame(() => requestAnimationFrame(() =>
      document.querySelectorAll(".bar span").forEach((s) => (s.style.width = s.dataset.w + "%"))));

    $("rDesc").textContent = d.desc;
    $("rStrengths").innerHTML = d.strengths.map((s) => `<li>${esc(s)}</li>`).join("");
    $("rGenres").innerHTML = d.genres.map((s) => `<li>${esc(s)}</li>`).join("");
    const duo = TYPES[ty.duo];
    $("rDuo").innerHTML = `${chibi(ty.duo)}<div><b>${ty.duo}</b>${esc(duo[lang].name)}<p class="note">${t("duoNote")}</p></div>`;
    $("rDuo").onclick = () => openType(ty.duo);
    $("rTagFriend").textContent = t("tagFriend", { duo: ty.duo });

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

  // ---------- IG Story card 1080x1920 (keep content out of IG's top/bottom ~220px) ----------
  async function drawCard(code, axes, noArt = false) {
    const W = 1080, H = 1920;
    const ty = TYPES[code], d = ty[lang], col = colorOf(code);
    const FAM = lang === "th" ? `"Anuphan", "Bricolage Grotesque", sans-serif` : `"Bricolage Grotesque", "Anuphan", sans-serif`;
    const F = (w, s, fam = FAM) => `${w} ${s}px ${fam}`;
    try {
      await Promise.all([`800 100px "Bricolage Grotesque"`, `700 60px "Anuphan"`, `400 40px "Anuphan"`].map((f) => document.fonts.load(f, "กขAa")));
    } catch (_) {}
    const art = noArt ? null : await loadFirst(artSources(code, gender, true));

    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const x = c.getContext("2d");
    const bg = x.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, ty.color[0]); bg.addColorStop(1, "#07060f");
    x.fillStyle = bg; x.fillRect(0, 0, W, H);
    const glow = (cx, cy, r, color, a) => {
      const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, color); g.addColorStop(1, "transparent");
      x.globalAlpha = a; x.fillStyle = g; x.fillRect(cx - r, cy - r, r * 2, r * 2); x.globalAlpha = 1;
    };
    glow(540, 640, 540, col, 0.8);
    glow(980, 1650, 420, "#ec4899", 0.35);
    glow(80, 260, 360, "#22d3ee", 0.25);

    // glass panel
    x.fillStyle = "rgba(255,255,255,0.07)"; x.strokeStyle = "rgba(255,255,255,0.18)"; x.lineWidth = 2;
    roundRect(x, 70, 990, 940, 680, 48); x.fill(); x.stroke();

    x.textAlign = "center"; x.fillStyle = "#fff";
    x.font = F(600, 40); x.globalAlpha = 0.85; x.fillText(t("youAre"), W / 2, 260); x.globalAlpha = 1;

    if (art) x.drawImage(art, (W - 700) / 2, 290, 700, 700);
    else { x.font = `300px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`; x.fillText(ty.emoji, W / 2, 790); }

    x.font = F(800, 170, `"Bricolage Grotesque", sans-serif`);
    const cg = x.createLinearGradient(0, 1040, 0, 1180);
    cg.addColorStop(0, "#fff"); cg.addColorStop(1, "#e9e3ff");
    x.fillStyle = cg; x.fillText(code, W / 2, 1175); x.fillStyle = "#fff";
    fit(x, d.name, W / 2, 1262, 880, 72, 700, FAM);
    x.globalAlpha = 0.85; fit(x, `“${d.tag}”`, W / 2, 1318, 880, 36, 400, FAM); x.globalAlpha = 1;

    let y = 1370;
    for (const ax of AXIS_ORDER) {
      const [a, b] = LETTERS[ax], { letter, pct } = axes[ax], left = letter === a;
      const bx = 330, bw = 420, bh = 20;
      x.font = F(600, 32);
      x.textAlign = "right"; x.globalAlpha = left ? 1 : 0.5; x.fillText(AXES[a][lang], bx - 22, y + 18);
      x.textAlign = "left"; x.globalAlpha = left ? 0.5 : 1; x.fillText(AXES[b][lang], bx + bw + 22, y + 18);
      x.globalAlpha = 0.2; x.fillStyle = "#fff"; roundRect(x, bx, y, bw, bh, 10); x.fill();
      x.globalAlpha = 1; x.fillStyle = col;
      const fw = (bw * pct) / 100; roundRect(x, left ? bx : bx + bw - fw, y, fw, bh, 10); x.fill();
      x.fillStyle = "#fff"; y += 56;
    }
    x.textAlign = "center";
    const duo = TYPES[ty.duo];
    x.globalAlpha = 0.9;
    fit(x, `${t("duo")}: ${duo.emoji} ${ty.duo} · ${duo[lang].name}`, W / 2, 1625, 860, 34, 600, FAM);
    const foot = [CONFIG.igHandle, CONFIG.siteUrl].filter(Boolean).join("  ·  ") || `16 Gamer Heroes · ${t("tryIt")}`;
    x.font = F(500, 30); x.globalAlpha = 0.7; x.fillText(foot, W / 2, 1722); x.globalAlpha = 1;
    return c;
  }
  function roundRect(x, rx, ry, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    x.beginPath(); x.moveTo(rx + r, ry);
    x.arcTo(rx + w, ry, rx + w, ry + h, r); x.arcTo(rx + w, ry + h, rx, ry + h, r);
    x.arcTo(rx, ry + h, rx, ry, r); x.arcTo(rx, ry, rx + w, ry, r); x.closePath();
  }
  function fit(x, text, cx, cy, maxW, size, weight, fam) {
    let s = size;
    do { x.font = `${weight} ${s}px ${fam}`; s -= 2; } while (x.measureText(text).width > maxW && s > 18);
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
    document.querySelectorAll("[data-aria]").forEach((el) => { el.setAttribute("aria-label", t(el.dataset.aria)); el.title = t(el.dataset.aria); });
    document.querySelectorAll(".seg button[data-lang]").forEach((b) => b.classList.toggle("on", b.dataset.lang === lang));
    markGender();
    renderHome();
    if (lastStats) renderStats(lastStats, false);
    if (!$("quiz").hidden) renderQuestion();
    if (result && !$("result").hidden) renderResult();
  }

  // ---------- Wire up ----------
  document.querySelectorAll(".seg button[data-lang]").forEach((b) => b.addEventListener("click", () => {
    lang = b.dataset.lang; localStorage.setItem("lang", lang);
    if (result) history.replaceState(null, "", `?r=${result.code}&g=${gender}&lang=${lang}`);
    applyLang();
  }));
  document.querySelectorAll("[data-gender]").forEach((b) => b.addEventListener("click", () => setGender(b.dataset.gender)));
  $("startBtn").onclick = openCreate;
  $("retryBtn").onclick = openCreate;
  $("goBtn").onclick = startQuiz;
  $("createBack").onclick = () => show("home");
  $("quitBtn").onclick = () => { answers = []; show("home"); };
  // Phone back button / swipe: previous question inside the quiz, otherwise previous screen
  history.replaceState({ screen: "home" }, "", location.search);
  addEventListener("popstate", (e) => {
    const target = (e.state && e.state.screen) || "home";
    if (current === "quiz" && answers.length) {
      answers.pop(); renderQuestion();
      history.pushState({ screen: "quiz" }, "", location.search);
      return;
    }
    if (target === "result" && !result) return show("home", "none");
    if (target === "quiz") { if (!answers.length) return show("create", "none"); show("quiz", "none"); return renderQuestion(); }
    show(target, "none");
  });
  $("shareBtn2").onclick = () => share();
  $("saveBtn2").onclick = () => save();
  $("homeLink").onclick = (e) => { e.preventDefault(); result = null; setColor("#8B5CF6"); history.replaceState(null, "", `?lang=${lang}`); renderHome(); show("home"); };
  $("stmtA").onclick = () => answer(2);
  $("stmtB").onclick = () => answer(-2);
  document.querySelectorAll(".dot").forEach((d) => (d.onclick = () => answer(Number(d.dataset.v))));
  $("backBtn").onclick = () => { answers.pop(); renderQuestion(); };
  $("shareBtn").onclick = share;
  $("saveBtn").onclick = save;
  $("copyBtn").onclick = copy;
  $("groups").addEventListener("click", (e) => { const b = e.target.closest(".type-tile"); if (b) openType(b.dataset.code); });
  $("dlgClose").onclick = () => $("typeDialog").close();
  $("typeDialog").addEventListener("click", (e) => { if (e.target === $("typeDialog")) $("typeDialog").close(); });
  document.addEventListener("keydown", (e) => {
    if ($("quiz").hidden) return;
    const map = { "1": 2, "2": 1, "3": -1, "4": -2 };
    if (map[e.key]) answer(map[e.key]);
    if (e.key === "Backspace" && answers.length) { answers.pop(); renderQuestion(); }
  });
  // 3D tilt on the result hero
  const tilt = $("rArt");
  tilt.addEventListener("pointermove", (e) => {
    const r = tilt.getBoundingClientRect();
    tilt.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 18}deg`);
    tilt.style.setProperty("--rx", `${-((e.clientY - r.top) / r.height - 0.5) * 18}deg`);
  });
  tilt.addEventListener("pointerleave", () => { tilt.style.setProperty("--rx", "0deg"); tilt.style.setProperty("--ry", "0deg"); });

  applyLang();
  countVisit();
})();
