// ===========================================================
// Matheus Felipe — Portfólio
// Efeito de digitação no terminal do hero + parallax de chips
// (respeitando prefers-reduced-motion nos dois casos)
// ===========================================================

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Terminal: efeito de digitação ----------

function typeTerminal() {
    const typedLine = document.getElementById("typedLine");
    const typedOutput = document.getElementById("typedOutput");
    const texto = "whoami --stack";

    if (reduceMotion) {
        typedLine.textContent = texto;
        typedOutput.hidden = false;
        return;
    }

    let i = 0;
    const digitar = () => {
        if (i <= texto.length) {
            typedLine.textContent = texto.slice(0, i);
            i++;
            setTimeout(digitar, 55);
        } else {
            setTimeout(() => {
                typedOutput.hidden = false;
            }, 300);
        }
    };
    digitar();
}

// ---------- Parallax: chips de "status" flutuando no hero ----------

const PARALLAX_CHIPS = [
    { text: "$ git push origin main", cls: "" },
    { text: "200 OK", cls: "ok" },
    { text: "deploy: success ✓", cls: "ok" },
    { text: "npm run build", cls: "" },
    { text: "● online", cls: "ok" },
    { text: "POST /api/analyze", cls: "accent" },
    { text: "commit -m \"fix\"", cls: "" },
];

function buildParallaxField() {
    const field = document.getElementById("parallaxField");
    if (!field) return;

    const isNarrow = window.innerWidth < 760;
    const count = isNarrow ? 3 : PARALLAX_CHIPS.length;

    const chips = [];

    for (let i = 0; i < count; i++) {
        const data = PARALLAX_CHIPS[i];
        const el = document.createElement("span");
        el.className = "chip" + (data.cls ? " " + data.cls : "");
        el.textContent = data.text;

        // Posições espalhadas, evitando a coluna central onde fica o texto/terminal
        const top = 6 + ((i * 37) % 90);
        const leftSide = i % 2 === 0;
        const left = leftSide ? 2 + (i * 5) % 12 : 78 + (i * 4) % 18;

        el.style.top = top + "%";
        el.style.left = left + "%";

        field.appendChild(el);
        chips.push({ el, speed: 0.08 + (i % 4) * 0.05 });
    }

    return chips;
}

function initParallax() {
    const chips = buildParallaxField();
    if (!chips || chips.length === 0 || reduceMotion) return;

    const hero = document.querySelector(".hero");
    let ticking = false;

    function update() {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;

        // Só anima enquanto o hero está (ao menos parcialmente) visível — economiza trabalho no scroll
        if (scrollY < heroHeight + 200) {
            chips.forEach(({ el, speed }) => {
                el.style.transform = `translateY(${scrollY * speed}px)`;
            });
        }
        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });

    update();
}

document.addEventListener("DOMContentLoaded", () => {
    typeTerminal();
    initParallax();
});
