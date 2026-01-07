/******************************
 * HUMAN NETWORK MULTI-LANGUAGE ENGINE
 * Auto-detect + Manual switch
 * 8 Languages:
 * PT, EN, ES, FR, RU, ZH, AR, DE
 ******************************/

let currentLang = "pt";

// Detect browser language
const supportedLangs = ["pt","en","es","fr","ru","zh","ar","de"];
const browserLang = navigator.language.slice(0,2);

if (supportedLangs.includes(browserLang)) {
    currentLang = browserLang;
} else {
    currentLang = "en"; // fallback
}

// Load language JSON and inject into DOM
async function loadLang(lang) {
    try {
        const res = await fetch(`assets/lang/${lang}.json`);
        const data = await res.json();

        // RTL support (Arabic)
        document.body.dir = data.dir ? data.dir : "ltr";

        // Fill simple mapped elements
        Object.keys(data).forEach(key => {
            const el = document.getElementById(key);
            if (el && typeof data[key] === "string" && key !== "dir") {
                el.innerHTML = data[key];
            }
        });

        // Fill explore blocks 1-11
        const infoBlocks = document.getElementById("info-blocks");
        infoBlocks.innerHTML = "";

        for (let i = 1; i <= 11; i++) {
            const titleKey = `section_${i}`;
            const textKey = `section_${i}_p`;

            if (data[titleKey] && data[textKey]) {
                const div = document.createElement("div");
                div.className = "info-block";
                div.innerHTML = `<h3>${data[titleKey]}</h3><p>${data[textKey]}</p>`;
                infoBlocks.appendChild(div);
            }
        }

        // Add Whitepaper block
        const wp = document.createElement("div");
        wp.className = "info-block";
        wp.innerHTML = `
            <h3>Whitepaper</h3>
            <button onclick="window.open('whitepaper.pdf','_blank')">
                ${data.whitepaper}
            </button>`;
        infoBlocks.appendChild(wp);

        // FAQ
        const faq = document.getElementById("faq-container");
        faq.innerHTML = "";
        for (let f = 1; f <= 6; f++) {
            const key = `faq_${f}`;
            if (data[key]) {
                const div = document.createElement("div");
                div.className = "faq-item";
                div.innerHTML = `<p>${data[key]}</p>`;
                faq.appendChild(div);
            }
        }

    } catch (err) {
        console.error("Erro ao carregar idioma:", lang, err);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadLang(currentLang);

    // Manual language buttons
    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            currentLang = btn.dataset.lang;
            await loadLang(currentLang);
        });
    });

    // Explore toggle
    const hero = document.querySelector(".hero");
    const exploreSection = document.getElementById("explore-section");

    document.getElementById("explore-btn").addEventListener("click", () => {
        hero.classList.add("hidden");
        exploreSection.classList.remove("hidden");
    });

    document.getElementById("back").addEventListener("click", () => {
        exploreSection.classList.add("hidden");
        hero.classList.remove("hidden");
    });
});
