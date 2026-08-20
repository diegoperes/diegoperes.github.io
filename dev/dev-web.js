/* =========================================================
   /dev — Dev Tools — Cores/CSS e metadados web (meta tags, robots.txt, favicon)
   ========================================================= */

/* ---------- Cores: HEX/RGB/HSL + contraste WCAG ---------- */
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h; let s;
  const l = (max + min) / 2;
  if (max === min) {
    h = 0; s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function relativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(hex1, hex2) {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  const l1 = relativeLuminance(c1.r, c1.g, c1.b);
  const l2 = relativeLuminance(c2.r, c2.g, c2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function initCorConversorCard(card) {
  if (!card) return;
  const picker = card.querySelector(".cor-picker");
  const hexInput = card.querySelector(".cor-hex");
  const picker2 = card.querySelector(".cor-picker-2");
  const output = card.querySelector(".tool-output");

  picker.addEventListener("input", () => { hexInput.value = picker.value; });

  card.querySelector(".cor-converter").addEventListener("click", () => {
    const hex = /^#?[0-9a-fA-F]{6}$/.test(hexInput.value.trim())
      ? (hexInput.value.trim().startsWith("#") ? hexInput.value.trim() : `#${hexInput.value.trim()}`)
      : picker.value;
    const { r, g, b } = hexToRgb(hex);
    const { h, s, l } = rgbToHsl(r, g, b);
    picker.value = hex;
    output.value = [
      `HEX: ${hex}`,
      `RGB: rgb(${r}, ${g}, ${b})`,
      `HSL: hsl(${h}, ${s}%, ${l}%)`,
    ].join("\n");
  });

  card.querySelector(".cor-contraste").addEventListener("click", () => {
    const ratio = contrastRatio(picker.value, picker2.value);
    const passAA = ratio >= 4.5;
    const passAAA = ratio >= 7;
    output.value = [
      `Contraste: ${ratio.toFixed(2)}:1`,
      `WCAG AA (texto normal, mín. 4.5:1): ${passAA ? "passa ✓" : "não passa ✗"}`,
      `WCAG AAA (texto normal, mín. 7:1): ${passAAA ? "passa ✓" : "não passa ✗"}`,
    ].join("\n");
  });
}

/* ---------- Gerador de Gradiente CSS ---------- */
function initGradienteCard(card) {
  if (!card) return;
  const cor1 = card.querySelector(".grad-cor1");
  const cor2 = card.querySelector(".grad-cor2");
  const angulo = card.querySelector(".grad-angulo");
  const tipo = card.querySelector(".grad-tipo");
  const preview = card.querySelector(".grad-preview");
  const output = card.querySelector(".tool-output");

  function build() {
    return tipo.value === "radial"
      ? `radial-gradient(circle, ${cor1.value}, ${cor2.value})`
      : `linear-gradient(${angulo.value}deg, ${cor1.value}, ${cor2.value})`;
  }

  card.querySelector(".grad-gerar").addEventListener("click", () => {
    const css = `background: ${build()};`;
    preview.style.background = build();
    output.value = css;
  });
}

/* ---------- Gerador de Box-Shadow CSS ---------- */
function initBoxShadowCard(card) {
  if (!card) return;
  const x = card.querySelector(".shadow-x");
  const y = card.querySelector(".shadow-y");
  const blur = card.querySelector(".shadow-blur");
  const spread = card.querySelector(".shadow-spread");
  const cor = card.querySelector(".shadow-cor");
  const opacidade = card.querySelector(".shadow-opacidade");
  const inset = card.querySelector(".shadow-inset");
  const previewBox = card.querySelector(".shadow-preview-box");
  const output = card.querySelector(".tool-output");

  card.querySelector(".shadow-gerar").addEventListener("click", () => {
    const { r, g, b } = hexToRgb(cor.value);
    const alpha = (parseFloat(opacidade.value) || 0) / 100;
    const value = `${inset.checked ? "inset " : ""}${x.value}px ${y.value}px ${blur.value}px ${spread.value}px rgba(${r}, ${g}, ${b}, ${alpha})`;
    previewBox.style.boxShadow = value;
    output.value = `box-shadow: ${value};`;
  });
}

/* ---------- Gerador de Border-Radius CSS ---------- */
function initBorderRadiusCard(card) {
  if (!card) return;
  const tl = card.querySelector(".radius-tl");
  const tr = card.querySelector(".radius-tr");
  const br = card.querySelector(".radius-br");
  const bl = card.querySelector(".radius-bl");
  const previewBox = card.querySelector(".radius-preview-box");
  const output = card.querySelector(".tool-output");

  card.querySelector(".radius-gerar").addEventListener("click", () => {
    const value = `${tl.value}px ${tr.value}px ${br.value}px ${bl.value}px`;
    previewBox.style.borderRadius = value;
    output.value = `border-radius: ${value};`;
  });
}

/* ---------- Gerador de Meta Tags / Open Graph ---------- */
function initMetaTagsCard(card) {
  if (!card) return;
  const titulo = card.querySelector(".meta-titulo");
  const descricao = card.querySelector(".meta-descricao");
  const url = card.querySelector(".meta-url");
  const imagem = card.querySelector(".meta-imagem");
  const output = card.querySelector(".tool-output");

  card.querySelector(".meta-gerar").addEventListener("click", () => {
    output.value = [
      `<title>${titulo.value}</title>`,
      `<meta name="description" content="${descricao.value}">`,
      `<meta property="og:title" content="${titulo.value}">`,
      `<meta property="og:description" content="${descricao.value}">`,
      `<meta property="og:url" content="${url.value}">`,
      `<meta property="og:image" content="${imagem.value}">`,
      `<meta property="og:type" content="website">`,
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:title" content="${titulo.value}">`,
      `<meta name="twitter:description" content="${descricao.value}">`,
      `<meta name="twitter:image" content="${imagem.value}">`,
    ].join("\n");
  });
}

/* ---------- Gerador de robots.txt ---------- */
function initRobotsCard(card) {
  if (!card) return;
  const bloquearTudo = card.querySelector(".robots-bloquear-tudo");
  const disallow = card.querySelector(".robots-disallow");
  const sitemap = card.querySelector(".robots-sitemap");
  const output = card.querySelector(".tool-output");

  card.querySelector(".robots-gerar-btn").addEventListener("click", () => {
    const lines = ["User-agent: *"];
    if (bloquearTudo.checked) {
      lines.push("Disallow: /");
    } else {
      lines.push("Allow: /");
      disallow.value.split("\n").map((l) => l.trim()).filter(Boolean).forEach((path) => lines.push(`Disallow: ${path}`));
    }
    if (sitemap.value.trim()) {
      lines.push("", `Sitemap: ${sitemap.value.trim()}`);
    }
    output.value = lines.join("\n");
  });
}

/* ---------- Gerador de Favicon ---------- */
// Emoji renderiza com as próprias cores (o navegador ignora fillStyle pra
// glifos coloridos), mas texto normal usa fillStyle — por isso precisa de
// uma cor de texto com contraste, calculada a partir da luminância do fundo.
function faviconTextColor(hex) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  const toLinear = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

// Desenha o caminho da forma de fundo (sem dar fill) — usado tanto pro
// preenchimento quanto, se precisar, por outros efeitos futuros.
function tracarFormaFavicon(ctx, shape, size) {
  ctx.beginPath();
  if (shape === "circle") {
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  } else if (shape === "rounded") {
    const r = size * 0.22;
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(0, 0, size, size, r);
    } else {
      ctx.moveTo(r, 0);
      ctx.lineTo(size - r, 0);
      ctx.quadraticCurveTo(size, 0, size, r);
      ctx.lineTo(size, size - r);
      ctx.quadraticCurveTo(size, size, size - r, size);
      ctx.lineTo(r, size);
      ctx.quadraticCurveTo(0, size, 0, size - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
    }
  } else {
    ctx.rect(0, 0, size, size);
  }
  ctx.closePath();
}

function initFaviconCard(card) {
  if (!card) return;
  const texto = card.querySelector(".favicon-texto");
  const cor = card.querySelector(".favicon-cor");
  const corTexto = card.querySelector(".favicon-texto-cor");
  const forma = card.querySelector(".favicon-forma");
  const canvas = card.querySelector(".favicon-canvas");
  const ctx = canvas.getContext("2d");
  let hasRendered = false;
  let corTextoTocada = false;

  // Enquanto a pessoa não mexer manualmente na cor do texto, sugere
  // automaticamente preto ou branco com base na cor de fundo escolhida.
  corTexto.addEventListener("input", () => { corTextoTocada = true; });
  cor.addEventListener("input", () => {
    if (!corTextoTocada) corTexto.value = faviconTextColor(cor.value);
  });

  function render() {
    if (!texto.value.trim()) {
      showToast("Digite um emoji ou texto.");
      return false;
    }
    const size = 256;
    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = cor.value;
    tracarFormaFavicon(ctx, forma.value, size);
    ctx.fill();
    ctx.fillStyle = corTexto.value;
    ctx.font = `${size * 0.6}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(texto.value.trim(), size / 2, size / 2 + size * 0.05);
    hasRendered = true;
    return true;
  }

  card.querySelector(".favicon-generate").addEventListener("click", render);
  card.querySelector(".favicon-download").addEventListener("click", () => {
    if (!hasRendered && !render()) return;
    downloadCanvas(canvas, "favicon.png");
  });
}
