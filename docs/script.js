/***********************************************
 * HUMAN NETWORK ULTRA SCRIPT
 * 🌍 8 Línguas + Geo + LocalStorage
 * 👁️ Atualiza <html lang> e RTL
 * 🌀 Variantes Fractais
 * 🔊 TTS por secção
 * 🏷️ Mini banner idioma
 * 🎌 Dropdown flags animado
 ************************************************/

let currentLang = "pt";
const supportedLangs = ["pt","en","es","fr","de","ru","zh","ar"];

// GEO fallback
const geoMap = {
    pt:"pt", br:"pt", ao:"pt", mz:"pt",
    es:"es", mx:"es", ar:"es", co:"es",
    fr:"fr", be:"fr", ca:"fr",
    de:"de", at:"de",
    ru:"ru",
    cn:"zh", tw:"zh",
    ae:"ar", sa:"ar", eg:"ar", ma:"ar"
};

// Check saved language
const saved = localStorage.getItem("lang");
if (saved) {
    currentLang = saved;
} else {
    const nav = navigator.language.slice(0,2);
    if (supportedLangs.includes(nav)) currentLang = nav;
    else {
        const tz = Intl.DateTimeFormat().resolvedOptions().locale.slice(-2).toLowerCase();
        currentLang = geoMap[tz] ?? "en";
    }
}

// Update <html>
function updateHtmlLang(lang, isRTL=false) {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
}

// Show banner
function showBanner(text) {
    const banner = document.getElementById("lang-banner");
    banner.innerText = text;
    banner.classList.remove("hidden");
    setTimeout(()=>banner.classList.add("hidden"), 2500);
}

// Text to speech
function speak(text, langCode) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = langCode;
    window.speechSynthesis.speak(msg);
}

// Load JSON + fill UI
async function loadLang(lang) {
    const res = await fetch(`assets/lang/${lang}.json`);
    const data = await res.json();

    const pick = (key) =>
        data.variants?.[key]
        ? data.variants[key][Math.floor(Math.random()*data.variants[key].length)]
        : data[key];

    updateHtmlLang(lang, data.dir==="rtl");

    for (let key in data) {
        const el = document.getElementById(key);
        if (el && typeof data[key] === "string") el.innerHTML = pick(key);
    }

    const info = document.getElementById("info-blocks");
    info.innerHTML = "";
    for (let i=1; i<=11; i++) {
        const t = pick(`section_${i}`);
        const p = pick(`section_${i}_p`);
        if (t && p) {
            const div = document.createElement("div");
            div.className = "info-block";
            div.innerHTML = `
                <span class="tts-btn" onclick="speak('${p.replace(/'/g,'’')}', '${lang}')">🔊</span>
                <h3>${t}</h3><p>${p}</p>`;
            info.appendChild(div);
        }
    }

    const div = document.createElement("div");
    div.className = "info-block";
    div.innerHTML = `
       <span class="tts-btn" onclick="speak('${data.whitepaper}','${lang}')">🔊</span>
       <h3>Whitepaper</h3>
       <button onclick="window.open('whitepaper.pdf','_blank')">
         ${pick('whitepaper')}
       </button>`;
    info.appendChild(div);

    const faq = document.getElementById("faq-container");
    faq.innerHTML = "";
    for (let f=1; f<=6; f++) {
        const text = pick(`faq_${f}`);
        if (text) {
            const divFaq = document.createElement("div");
            divFaq.className = "faq-item";
            divFaq.innerHTML = `
                <span class="tts-btn" onclick="speak('${text.replace(/'/g,'’')}', '${lang}')">🔊</span>
                <p>${text}</p>`;
            faq.appendChild(divFaq);
        }
    }

    document.getElementById("current-flag").src = `assets/flags/${lang}.png`;
    showBanner(`${lang.toUpperCase()}`);
    localStorage.setItem("lang", lang);
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadLang(currentLang);

    const menu = document.getElementById("lang-dropdown");
    document.getElementById("current-lang").addEventListener("click", ()=>{
        menu.classList.toggle("hidden");
    });

    document.querySelectorAll(".flag-option").forEach(flag=>{
        flag.addEventListener("click", async ()=>{
            currentLang = flag.dataset.lang;
            menu.classList.add("hidden");
            await loadLang(currentLang);
        });
    });

    const explorer = document.getElementById("explore-section");

    document.getElementById("explore-btn").addEventListener("click",()=>{
        explorer.classList.remove("hidden");
        explorer.scrollIntoView({ behavior: "smooth" });
    });

    document.getElementById("back").addEventListener("click",()=>{
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});
