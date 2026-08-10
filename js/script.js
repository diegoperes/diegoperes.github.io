/* =========================================================
   Diego Peres — Portfólio pessoal
   ========================================================= */

document.documentElement.classList.add("js");

const CONFIG = {
  linkedin: "__USER_LINKEDIN__",
  github: "__USER_GITHUB__",
};

const EMAIL_ENCODED = "__EMAIL_ENCODED__";

function decodeEmail() {
  if (!Array.isArray(EMAIL_ENCODED)) {
    return "";
  }

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
    applyLinkConfig(el, CONFIG.linkedin);
  });

  document.querySelectorAll('[data-config="github"]').forEach((el) => {
    applyLinkConfig(el, CONFIG.github);
  });
}

function applyLinkConfig(el, href) {
  if (!href || href.startsWith("__")) {
    el.hidden = true;
    return;
  }

  el.href = href;
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

      if (!email) {
        return;
      }

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
