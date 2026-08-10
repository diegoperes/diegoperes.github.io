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

  /* ---------- Chuva de emojis cobrindo a tela (usado nos efeitos de empresa) ---------- */
  function spawnEmojiRain(emojis, duration = 2800) {
    const spawnInterval = 60;
    const elapsedLimit = duration;
    let elapsed = 0;

    const spawnOne = () => {
      const el = document.createElement("span");
      el.className = "egg-particle";
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      const x = Math.random() * window.innerWidth;
      const fall = window.innerHeight + 120;
      const drift = (Math.random() - 0.5) * 160;
      const rotate = (Math.random() - 0.5) * 200;
      const fallDuration = 1900 + Math.random() * 1400;

      el.style.left = `${x}px`;
      el.style.top = "-40px";
      el.style.fontSize = `${1.6 + Math.random() * 1.4}rem`;
      document.body.appendChild(el);

      const animation = el.animate(
        [
          { transform: "translate(-50%, 0) rotate(0deg)", opacity: 0 },
          { transform: "translate(-50%, 0) rotate(0deg)", opacity: 1, offset: 0.06 },
          {
            transform: `translate(calc(-50% + ${drift}px), ${fall}px) rotate(${rotate}deg)`,
            opacity: 1,
            offset: 0.88,
          },
          {
            transform: `translate(calc(-50% + ${drift}px), ${fall}px) rotate(${rotate}deg)`,
            opacity: 0,
          },
        ],
        { duration: fallDuration, easing: "cubic-bezier(.4, 0, .7, 1)" }
      );

      animation.onfinish = () => el.remove();
    };

    const timer = setInterval(() => {
      spawnOne();
      elapsed += spawnInterval;
      if (elapsed >= elapsedLimit) clearInterval(timer);
    }, spawnInterval);
  }

  /* ---------- 6. Duplo clique nas empresas da timeline ---------- */
  function initCompanyEffects() {
    const effects = {
      beer: { emojis: ["🍺", "🍻", "🫧"], message: "🍺 Ambev, é claro." },
      money: { emojis: ["💵", "💰", "🤑"], message: "💰 BTG Pactual, o dinheiro fala." },
      stock: { emojis: ["📦", "🧾", "📊", "🧮"], message: "📦 ao3 — 11 anos de financeiro, comercial e estoque." },
    };

    document.querySelectorAll("[data-egg]").forEach((el) => {
      const effect = effects[el.dataset.egg];
      if (!effect) return;

      el.addEventListener("dblclick", () => {
        spawnEmojiRain(effect.emojis);
        toast(effect.message);
      });
    });
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
    initCompanyEffects();
  });
})();
