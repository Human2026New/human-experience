/* =========================
   HUMAN — app.js v8
   ========================= */

const STORAGE_KEY = "human_app_v8";

/* ---------- I18N ---------- */
const LANG = detectLang();

const TEXT = {
  pt: {
    splash_line_1: "Presença humana registada no tempo",
    splash_line_2: "Não é investimento. Não é promessa.",
    splash_line_3: "Lançado oficialmente — fase génese",

    phase_0: "Fase 0 — Génese",
    phase_1: "Fase 1 — Evolução",
    phase_2: "Fase 2 — Maturidade"
  },
  en: {
    splash_line_1: "Human presence recorded over time",
    splash_line_2: "Not an investment. Not a promise.",
    splash_line_3: "Officially launched — genesis phase",

    phase_0: "Phase 0 — Genesis",
    phase_1: "Phase 1 — Evolution",
    phase_2: "Phase 2 — Maturity"
  }
};

/* ---------- PROTOCOLO ---------- */
const PROTOCOL = {
  totalHum: 80000000,
  minedHum: 0
};

/* ---------- STATE ---------- */
let state = {
  started: false,
  hum: 0,
  time: 0,
  days: {}
};

/* ---------- LOAD ---------- */
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  try { state = { ...state, ...JSON.parse(saved) }; } catch {}
}

/* ---------- HELPERS ---------- */
const $ = id => document.getElementById(id);

/* ---------- AUDIO (OPCIONAL) ---------- */
let heartbeatPlayed = false;
const heartbeat = new Audio(
  "https://assets.mixkit.co/sfx/preview/mixkit-heartbeat-fast-483.mp3"
);
heartbeat.volume = 0.05;

/* ---------- ENTER ---------- */
$("enterBtn").onclick = () => {
  $("enterBtn").style.display = "none";
  $("dashboard").classList.remove("hidden");

  if (!heartbeatPlayed) {
    heartbeat.play().catch(() => {});
    heartbeatPlayed = true;
  }

  startLoop();
};

/* ---------- LOOP ---------- */
function startLoop() {
  setInterval(() => {
    state.time++;
    state.hum += 0.00002;
    PROTOCOL.minedHum += 0.00002;

    if (state.time >= 300) {
      state.days[today()] = true;
    }

    updateUI();
    save();
  }, 1000);
}

/* ---------- UI ---------- */
function updateUI() {
  $("humValue").textContent = state.hum.toFixed(5) + " HUM";
  $("daysCount").textContent = Object.keys(state.days).length;
  $("timeSpent").textContent = Math.floor(state.time / 60) + " min";

  const percent =
    Math.min(100, (PROTOCOL.minedHum / PROTOCOL.totalHum) * 100);

  let phaseKey = "phase_0";
  if (percent >= 20) phaseKey = "phase_1";
  if (percent >= 60) phaseKey = "phase_2";

  $("phaseText").textContent = TEXT[LANG][phaseKey];
  $("protocolPhase").textContent = TEXT[LANG][phaseKey];
  $("protocolPercent").textContent = percent.toFixed(4) + "%";
}

/* ---------- I18N APPLY ---------- */
function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (TEXT[LANG][key]) el.textContent = TEXT[LANG][key];
  });
}

/* ---------- UTILS ---------- */
function today() {
  return new Date().toISOString().slice(0, 10);
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function detectLang() {
  try {
    if (window.Telegram && Telegram.WebApp?.initDataUnsafe?.user?.language_code) {
      return Telegram.WebApp.initDataUnsafe.user.language_code.startsWith("pt")
        ? "pt"
        : "en";
    }
  } catch {}
  return navigator.language.startsWith("pt") ? "pt" : "en";
}

/* ---------- MODALS ---------- */
document.querySelectorAll("[data-open]").forEach(btn => {
  btn.onclick = () =>
    document.getElementById(btn.dataset.open).classList.remove("hidden");
});

document.querySelectorAll(".close").forEach(btn => {
  btn.onclick = () =>
    document.querySelectorAll(".space").forEach(s =>
      s.classList.add("hidden")
    );
});

/* ---------- SPLASH ---------- */
window.addEventListener("load", () => {
  applyI18n();
  setTimeout(() => {
    const splash = $("mainnetSplash");
    if (splash) splash.style.display = "none";
  }, 2000);
});

updateUI();
