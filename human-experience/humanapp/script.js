const BACKEND_URL = "https://human-2026-railway.onrender.com";

let userId = null;

function initTelegramUser() {
  try {
    const initData = Telegram.WebApp.initDataUnsafe;
    userId = initData?.user?.id;
  } catch(err) {
    userId = null;
    console.error("No Telegram init data");
  }
}

async function fetchUserData() {
  if(!userId) return;

  const res = await fetch(`${BACKEND_URL}/hum/user/${userId}`);
  const data = await res.json();

  document.getElementById("status").textContent = "👤 Humano ativo";
  document.getElementById("stats").style.display = "block";
  
  document.getElementById("streak").textContent = data.streak_days || 0;
  document.getElementById("nfts").textContent = data.rewards?.length || 0;
  document.getElementById("hum").textContent = data.hum_balance || 0;
}

async function checkin() {
  if(!userId) return;

  await fetch(`${BACKEND_URL}/presence/checkin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegram_id: userId })
  });

  fetchUserData();
}

document.getElementById("checkinBtn").addEventListener("click", checkin);

initTelegramUser();
fetchUserData();
Telegram.WebApp.ready();
