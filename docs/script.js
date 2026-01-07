let currentLang = "pt";

async function loadLang(lang) {
    const res = await fetch(`assets/lang/${lang}.json`);
    const data = await res.json();

    // Apply text directly to matching IDs
    const keys = Object.keys(data);
    keys.forEach(k => {
        const el = document.getElementById(k);
        if (el) el.innerHTML = data[k];
    });

    // Fill explore blocks automatically
    const infoBlocks = document.getElementById("info-blocks");
    infoBlocks.innerHTML = "";
    for (let i = 1; i <= 11; i++) {
        const div = document.createElement("div");
        div.className = "info-block";
        div.innerHTML = `<h3>${data[`section_${i}`]}</h3><p>${data[`section_${i}_p`]}</p>`;
        infoBlocks.appendChild(div);
    }

    // FAQ
    const faq = document.getElementById("faq-container");
    faq.innerHTML = "";
    for (let f = 1; f <= 6; f++) {
        const div = document.createElement("div");
        div.className = "faq-item";
        div.innerHTML = `<p>${data[`faq_${f}`]}</p>`;
        faq.appendChild(div);
    }

    // Whitepaper button:
    const wp = document.createElement("div");
    wp.className = "info-block";
    wp.innerHTML = `
       <h3>Whitepaper</h3>
       <button onclick="window.open('whitepaper.pdf','_blank')">
         ${data.whitepaper}
       </button>`;
    infoBlocks.appendChild(wp);
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadLang(currentLang);

    // Language buttons
    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            currentLang = btn.dataset.lang;
            await loadLang(currentLang);
        });
    });

    // Explore system toggle
    document.getElementById("explore-btn").addEventListener("click", () => {
        document.querySelector(".hero").classList.add("hidden");
        document.getElementById("explore-section").classList.remove("hidden");
    });

    // Back button
    document.getElementById("back").addEventListener("click", () => {
        document.getElementById("explore-section").classList.add("hidden");
        document.querySelector(".hero").classList.remove("hidden");
    });
});
