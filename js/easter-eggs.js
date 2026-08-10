/* =========================================================
   Easter eggs — pequenos segredos escondidos no site
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Toast genérico ---------- */
  function toast(message, duration = 3200) {
    const el = document.createElement("div");
    el.className = "egg-toast";
    el.textContent = message;
    document.body.appendChild(el);

    requestAnimationFrame(() => el.classList.add("is-visible"));

    setTimeout(() => {
      el.classList.remove("is-visible");
      el.addEventListener("transitionend", () => el.remove(), { once: true });
    }, duration);
  }

  /* ---------- Chuva de código estilo "matrix" ---------- */
  let matrixTimer = null;

  function matrixRain(duration = 4000) {
    if (matrixTimer) return;

    const canvas = document.createElement("canvas");
    canvas.className = "egg-matrix";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const chars = "01{}<>/;=#*$%".split("");
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);

    function draw() {
      ctx.fillStyle = "rgba(11, 15, 20, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#5eead4";
      ctx.font = `${fontSize}px monospace`;

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, y * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });
    }

    matrixTimer = setInterval(draw, 45);

    setTimeout(() => {
      clearInterval(matrixTimer);
      matrixTimer = null;
      window.removeEventListener("resize", resize);
      canvas.classList.add("is-fading");
      setTimeout(() => canvas.remove(), 600);
    }, duration);
  }

  /* ---------- 1. Mensagem no console ---------- */
  function initConsoleMessage() {
    const title = "color:#5eead4; font-family:monospace; font-size:13px; font-weight:bold;";
    const text = "color:#9aa5b1; font-family:monospace; font-size:12px;";
    console.log("%c> whoami", title);
    console.log("%cDiego Peres — backend dev, C# / .NET", text);
    console.log("%cSe chegou até aqui, tenta as setas do teclado. 😉", text);
  }

  /* ---------- 2. Código Konami ---------- */
  function initKonamiCode() {
    const sequence = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
      "b", "a",
    ];
    let position = 0;

    document.addEventListener("keydown", (event) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      const expected = sequence[position];

      if (key === expected) {
        position++;
        if (position === sequence.length) {
          position = 0;
          matrixRain();
          toast("🕶️ Modo desenvolvedor ativado.");
        }
      } else {
        position = key === sequence[0] ? 1 : 0;
      }
    });
  }

  /* ---------- 3. Palavras secretas digitadas em qualquer lugar ---------- */
  function initSecretWords() {
    const words = {
      cafe: "☕ Também preciso de um. Sempre.",
      hire: "🤝 Bora conversar? Usa a seção de contato aqui embaixo.",
      bug: "🐛 Não é bug, é feature não documentada.",
    };
    const maxLength = Math.max(...Object.keys(words).map((w) => w.length));

    let buffer = "";

    document.addEventListener("keydown", (event) => {
      if (event.key.length !== 1) return;
      buffer = (buffer + event.key.toLowerCase()).slice(-maxLength);

      Object.entries(words).forEach(([word, message]) => {
        if (buffer.endsWith(word)) {
          toast(message);
          buffer = "";
        }
      });
    });
  }

  /* ---------- 4. Cliques escondidos no logo ---------- */
  function initLogoClicks() {
    const brand = document.querySelector(".nav__brand");
    if (!brand) return;

    let clicks = 0;
    let resetTimer = null;

    brand.addEventListener("click", () => {
      clicks++;
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => (clicks = 0), 1500);

      if (clicks >= 5) {
        clicks = 0;
        matrixRain();
        toast("🧙 Achou o segredo do logo.");
      }
    });
  }

  /* ---------- 5. Título da aba muda quando o usuário sai ---------- */
  function initTabTitleSwap() {
    const original = document.title;
    const away = "👋 Volta aqui...";

    document.addEventListener("visibilitychange", () => {
      document.title = document.hidden ? away : original;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initConsoleMessage();
    initKonamiCode();
    initSecretWords();
    initLogoClicks();
    initTabTitleSwap();
  });
})();
