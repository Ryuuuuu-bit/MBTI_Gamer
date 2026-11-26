// 16 Gamer Heroes: static site + tiny visit counter (Node, no dependencies)
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const PORT = Number(process.env.PORT) || 8080;
const ROOT = __dirname;
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, "data");
const STATS_FILE = path.join(DATA_DIR, "stats.json");
const VERSION = String(Date.now()); // cache-busting stamp for CSS/JS links

// ---------- Stats storage (JSON file on a persistent volume) ----------
let stats = { visitors: 0, visits: 0, starts: 0, completes: 0, byType: {}, daily: {}, since: new Date().toISOString() };
try {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (fs.existsSync(STATS_FILE)) stats = { ...stats, ...JSON.parse(fs.readFileSync(STATS_FILE, "utf8")) };
} catch (e) { console.error("stats load failed:", e.message); }

let dirty = false;
function save() {
  if (!dirty) return;
  dirty = false;
  const tmp = STATS_FILE + ".tmp";
  try { fs.writeFileSync(tmp, JSON.stringify(stats)); fs.renameSync(tmp, STATS_FILE); }
  catch (e) { dirty = true; console.error("stats save failed:", e.message); }
}
setInterval(save, 2000).unref();
for (const sig of ["SIGTERM", "SIGINT"]) process.on(sig, () => { save(); process.exit(0); });

const today = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10); // Thailand date
function bump(field, n = 1) {
  stats[field] = (stats[field] || 0) + n;
  const d = (stats.daily[today()] ||= {});
  d[field] = (d[field] || 0) + n;
  dirty = true;
}
const publicStats = () => ({ visitors: stats.visitors, visits: stats.visits, completes: stats.completes });

// ---------- Simple per-IP rate limit (IP kept in memory only, never stored) ----------
const hitsByIp = new Map();
setInterval(() => hitsByIp.clear(), 60e3).unref();
function allowed(req) {
  const ip = String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();
  const n = (hitsByIp.get(ip) || 0) + 1;
  hitsByIp.set(ip, n);
  return n <= 30; // per minute
}

const CODES = /^[EI][SN][TF][JP]$/;
function handleHit(req, res, body) {
  let data = {};
  try { data = JSON.parse(body || "{}"); } catch (_) {}
  if (!allowed(req)) return json(res, 429, publicStats());
  switch (data.e) {
    case "visit":
      bump("visits");
      if (data.newVisitor === true) bump("visitors");
      break;
    case "start": bump("starts"); break;
    case "complete":
      bump("completes");
      if (CODES.test(data.type || "")) {
        const k = `${data.type}-${data.g === "f" ? "f" : "m"}`;
        stats.byType[k] = (stats.byType[k] || 0) + 1;
      }
      break;
    default: return json(res, 400, { error: "unknown event" });
  }
  json(res, 200, publicStats());
}

function json(res, status, obj) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(obj));
}

// ---------- Static files ----------
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png",
  ".jpg": "image/jpeg", ".ico": "image/x-icon", ".txt": "text/plain; charset=utf-8", ".md": "text/plain; charset=utf-8"
};
const COMPRESS = new Set([".html", ".css", ".js", ".json", ".svg", ".txt"]);
const BLOCKED = new Set(["server.js", "Dockerfile", ".dockerignore", "package.json"]);
const cache = new Map(); // path -> { raw, gz, etag }

function load(file) {
  if (cache.has(file)) return cache.get(file);
  let raw = fs.readFileSync(file);
  if (path.basename(file) === "index.html") raw = Buffer.from(raw.toString("utf8").replaceAll("__V__", VERSION));
  const ext = path.extname(file);
  const entry = { raw, gz: COMPRESS.has(ext) ? zlib.gzipSync(raw, { level: 9 }) : null, etag: `"${raw.length.toString(36)}-${VERSION}"` };
  cache.set(file, entry);
  return entry;
}

function serveStatic(req, res, urlPath) {
  let rel = decodeURIComponent(urlPath);
  if (rel === "/" || rel === "") rel = "/index.html";
  const file = path.normalize(path.join(ROOT, rel));
  if (!file.startsWith(ROOT + path.sep) || BLOCKED.has(path.basename(file)) || file.startsWith(DATA_DIR)) {
    res.writeHead(404); return res.end("Not found");
  }
  let stat;
  try { stat = fs.statSync(file); } catch (_) { stat = null; }
  if (!stat || !stat.isFile()) { res.writeHead(404, { "Content-Type": "text/plain" }); return res.end("Not found"); }

  const ext = path.extname(file);
  const entry = load(file);
  const headers = { "Content-Type": TYPES[ext] || "application/octet-stream", ETag: entry.etag, Vary: "Accept-Encoding" };
  if (rel.startsWith("/art/")) headers["Cache-Control"] = "public, max-age=604800";
  else if (ext === ".html") headers["Cache-Control"] = "no-cache";
  else headers["Cache-Control"] = "public, max-age=300";
  if (req.headers["if-none-match"] === entry.etag) { res.writeHead(304, headers); return res.end(); }
  const gz = entry.gz && /\bgzip\b/.test(req.headers["accept-encoding"] || "");
  if (gz) headers["Content-Encoding"] = "gzip";
  const body = gz ? entry.gz : entry.raw;
  headers["Content-Length"] = body.length;
  res.writeHead(200, headers);
  res.end(req.method === "HEAD" ? undefined : body);
}

// ---------- Server ----------
http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/api/stats" && req.method === "GET") return json(res, 200, publicStats());
  if (url.pathname === "/api/hit" && req.method === "POST") {
    let body = "";
    req.on("data", (c) => { body += c; if (body.length > 2000) req.destroy(); });
    req.on("end", () => handleHit(req, res, body));
    return;
  }
  if (req.method !== "GET" && req.method !== "HEAD") { res.writeHead(405); return res.end(); }
  try { serveStatic(req, res, url.pathname); }
  catch (e) { console.error(e); res.writeHead(500); res.end("Server error"); }
}).listen(PORT, () => console.log(`16 Gamer Heroes on :${PORT}, stats in ${STATS_FILE}`));
