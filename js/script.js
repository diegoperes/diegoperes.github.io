/* =========================================================
   Diego Peres — Portfólio pessoal
   ========================================================= */

/* ---------------------------------------------------------
   PERSONALIZAR
   Edite os valores abaixo. Todos os links do site (hero,
   contato, rodapé) são preenchidos automaticamente a partir
   deste único objeto — não é necessário editar o HTML.
   --------------------------------------------------------- */
const CONFIG = {
  linkedin: "https://www.linkedin.com/in/diegoperes-developer/",
  github: "https://github.com/diegoperes",
};

/* ---------------------------------------------------------
   PERSONALIZAR
   O e-mail fica codificado (não em texto puro) para dificultar a
   coleta automática por bots que varrem o HTML/JS do site. Ele só é
   decodificado no navegador após um clique do usuário (ver
   initEmailProtection). Isso não é criptografia — apenas evita expor
   o endereço em texto puro nos arquivos estáticos do site.

   Para trocar o e-mail, gere um novo array no console do navegador:
   [...'seuemail@dominio.com'].map(c => c.charCodeAt(0))
   --------------------------------------------------------- */
const EMAIL_ENCODED = [
  99, 111, 110, 116, 97, 116, 111, 64, 100, 105, 101, 103, 111, 112, 101, 114,
  101, 115, 46, 99, 111, 109, 46, 98, 114,
];

function decodeEmail() {
  return String.fromCharCode(...EMAIL_ENCODED);
}

document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  initEmailProtection();
  initTheme();
  initMobileMenu();
  initHeaderScroll();
  initScrollSpy();
  initRevealAnimations();
  document.getElementById("year").textContent = new Date().getFullYear();
});

/* ---------- Aplica os links do CONFIG nos elementos ---------- */
function applyConfig() {
  document.querySelectorAll('[data-config="linkedin"]').forEach((el) => {
    el.href = CONFIG.linkedin;
  });

  document.querySelectorAll('[data-config="github"]').forEach((el) => {
    el.href = CONFIG.github;
  });
}

/* ---------- E-mail protegido: só decodifica após clique do usuário ---------- */
function initEmailProtection() {
  document.querySelectorAll("[data-email-trigger]").forEach((el) => {
    el.addEventListener("click", (event) => {
      const action = el.dataset.emailTrigger;

      // Depois de revelado, o link vira um mailto: normal — deixa o navegador seguir.
      if (action === "show" && el.classList.contains("is-revealed")) {
        return;
      }

      event.preventDefault();
      const email = decodeEmail();

      if (action === "show") {
        el.textContent = email;
        el.href = `mailto:${email}`;
        el.classList.add("is-revealed");
      } else {
        window.location.href = `mailto:${email}`;
      }
    });
  });
}

/* ---------- Dark / Light mode ---------- */
function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const stored = localStorage.getItem("theme");

  if (stored) {
    root.setAttribute("data-theme", stored);
  }

  toggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
    const next = current === "light" ? "dark" : "light";

    if (next === "dark") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", "light");
    }

    localStorage.setItem("theme", next);
  });
}

/* ---------- Menu mobile ---------- */
function initMobileMenu() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  });

  menu.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- Header com sombra/borda ao rolar ---------- */
function initHeaderScroll() {
  const header = document.getElementById("header");

  const update = () => {
    header.classList.toggle("header--scrolled", window.scrollY > 8);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

/* ---------- Destaca o link do menu correspondente à seção visível ---------- */
function initScrollSpy() {
  const links = document.querySelectorAll(".nav__link");
  const sections = Array.from(links)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!("IntersectionObserver" in window) || sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          link.classList.toggle(
            "is-active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------- Animações discretas ao entrar na viewport ---------- */
function initRevealAnimations() {
  const items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item) => observer.observe(item));
}
