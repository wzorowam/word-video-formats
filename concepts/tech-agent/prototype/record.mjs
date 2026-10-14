import { spawn } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const page = path.join(here, "index.html");
const out = process.env.AGENT_MP4
  || "/cursor/stores/bc-0126f01b-3969-5bab-b455-7e75f997cab0/media/agent-terminal.mp4";
const framesDir = "/tmp/agent-terminal-frames";
const fps = 30;
const duration = 14.5;
const port = 9223;

rmSync(framesDir, { recursive: true, force: true });
mkdirSync(framesDir, { recursive: true });
mkdirSync(path.dirname(out), { recursive: true });

const chrome = spawn("google-chrome", [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--disable-dev-shm-usage",
  "--hide-scrollbars",
  "--no-first-run",
  "--force-device-scale-factor=1",
  `--remote-debugging-port=${port}`,
  "--window-size=1080,1920",
  "--user-data-dir=/tmp/chrome-agent-profile",
  `file://${page}`,
], { stdio: "ignore" });

function die(err) {
  chrome.kill("SIGKILL");
  console.error(err);
  process.exit(1);
}

let wsUrl;
for (let i = 0; i < 50; i++) {
  try {
    const list = await fetch(`http://127.0.0.1:${port}/json/list`).then((r) => r.json());
    const tab = list.find((t) => t.type === "page" && t.webSocketDebuggerUrl);
    if (tab) { wsUrl = tab.webSocketDebuggerUrl; break; }
  } catch { /* chrome still booting */ }
  await sleep(200);
}
if (!wsUrl) die("Chrome did not open a debuggable page");

const ws = new WebSocket(wsUrl);
await new Promise((resolve, reject) => {
  ws.addEventListener("open", resolve);
  ws.addEventListener("error", () => reject(new Error("devtools socket failed")));
});

let seq = 0;
const pending = new Map();
ws.addEventListener("message", (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(JSON.stringify(msg.error)));
    else resolve(msg.result);
  }
});

function send(method, params = {}) {
  const id = ++seq;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: 1080,
  height: 1920,
  deviceScaleFactor: 1,
  mobile: false,
});

for (let i = 0; i < 50; i++) {
  const ready = await send("Runtime.evaluate", {
    expression: "Boolean(window.__ready)",
    returnByValue: true,
  });
  if (ready.result?.value) break;
  await sleep(100);
  if (i === 49) die("page never became ready");
}

const frameCount = Math.round(duration * fps);
for (let i = 0; i < frameCount; i++) {
  const t = i / fps;
  await send("Runtime.evaluate", {
    expression: `window.__renderAt(${t})`,
    awaitPromise: true,
  });
  const shot = await send("Page.captureScreenshot", {
    format: "jpeg",
    quality: 86,
    fromSurface: true,
  });
  writeFileSync(path.join(framesDir, `${String(i).padStart(4, "0")}.jpg`), Buffer.from(shot.data, "base64"));
  if (i % 30 === 0) console.log(`frame ${i}/${frameCount}`);
}

chrome.kill("SIGKILL");
ws.close();

await new Promise((resolve, reject) => {
  const ff = spawn("ffmpeg", [
    "-y",
    "-framerate", String(fps),
    "-i", path.join(framesDir, "%04d.jpg"),
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-crf", "18",
    "-movflags", "+faststart",
    out,
  ], { stdio: "inherit" });
  ff.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`ffmpeg ${code}`)));
});

console.log(out);
