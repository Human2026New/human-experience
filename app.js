const tg = window.Telegram.WebApp;
tg.expand();

let activeMinutes = 0;

function enterApp() {
  showScreen("dashboard");
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function openMine() {
  openPanel(
    "⛏ Continuar Ciclo",
    "O tempo continua a contar.\nO HUM só entra quando o ciclo fecha."
  );
}

function openStatus() {
  openPanel(
    "📊 Meu Estado",
    "Consistência vale mais que perfeição."
  );
}

function openDuels() {
  openPanel(
    "⚔ Desafios",
    "Desafios humanos baseados em disciplina.\nSem humilhação."
  );
}

function openAbout() {
  openPanel(
    "ℹ HUMAN",
    "Isto não é investimento.\nNão promete retorno.\nMede presença humana."
  );
}

function openPanel(title, content) {
  document.getElementById("panelTitle").innerText = title;
  document.getElementById("panelContent").innerText = content;
  showScreen("panel");
}

function closePanel() {
  showScreen("dashboard");
}

// Simulação visual de tempo ativo
setInterval(() => {
  activeMinutes++;
  document.getElementById("timeActive").innerText = activeMinutes + " min";
  document.getElementById("cycle").innerText =
    Math.min(100, Math.floor((activeMinutes / 1440) * 100)) + "%";
}, 60000);
