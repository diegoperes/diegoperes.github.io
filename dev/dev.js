/* =========================================================
   /dev — Dev Tools
   Geradores de CPF, CNPJ, placa e GUID. 100% client-side.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  document.getElementById("year").textContent = new Date().getFullYear();

  document.querySelectorAll(".tool-card").forEach(initToolCard);
  wireCopyButtons();
  initDevNav();
  initDevNavFilter();

  initSlugCard(document.querySelector('[data-tool="slug"]'));
  initBase64Card(document.querySelector('[data-tool="base64"]'));
  initJwtCard(document.querySelector('[data-tool="jwt"]'));
  initJsonCard(document.querySelector('[data-tool="json"]'));
  initHashCard(document.querySelector('[data-tool="hash"]'));
  initTimestampCard(document.querySelector('[data-tool="timestamp"]'));
  initLoremCard(document.querySelector('[data-tool="lorem"]'));
  initValidadorCard(document.querySelector('[data-tool="validador"]'));
  initQrCard(document.querySelector('[data-tool="qrcode"]'));
  initBaseNumericaCard(document.querySelector('[data-tool="base-numerica"]'));
  initExtensoCard(document.querySelector('[data-tool="extenso"]'));
  initAmbienteCard(document.querySelector('[data-tool="ambiente"]'));
  initMeuIpCard(document.querySelector('[data-tool="meuip"]'));
  initStatsCard(document.querySelector('[data-tool="stats-texto"]'));
  initTransformCard(document.querySelector('[data-tool="transformar-texto"]'));
  initOrdenarLinhasCard(document.querySelector('[data-tool="ordenar-linhas"]'));
  initDividirTextoCard(document.querySelector('[data-tool="dividir-texto"]'));
  initBuscarSubstituirCard(document.querySelector('[data-tool="buscar-substituir"]'));
  initCharInfoCard(document.querySelector('[data-tool="char-info"]'));
  initRomanosCard(document.querySelector('[data-tool="romanos"]'));
  initFatoracaoCard(document.querySelector('[data-tool="fatoracao"]'));
  initMdcMmcCard(document.querySelector('[data-tool="mdc-mmc"]'));
  initPorcentagemCard(document.querySelector('[data-tool="porcentagem"]'));
  initRegraTresCard(document.querySelector('[data-tool="regra-tres"]'));
  initRestoDivisaoCard(document.querySelector('[data-tool="resto-divisao"]'));
  initAreaCard(document.querySelector('[data-tool="area"]'));
  initDiasEntreDatasCard(document.querySelector('[data-tool="dias-entre-datas"]'));
  initSomarDiasCard(document.querySelector('[data-tool="somar-dias"]'));
  initPerfilCard(document.querySelector('[data-tool="perfil"]'));
  initEmpresaCard(document.querySelector('[data-tool="empresa"]'));
  initSorteioCard(document.querySelector('[data-tool="sorteio"]'));
});

/* ---------- Filtro de busca da sidebar ---------- */
function initDevNavFilter() {
  const filterInput = document.querySelector(".dev-nav__filter");
  if (!filterInput) return;

  const groups = document.querySelectorAll(".dev-nav__group");

  filterInput.addEventListener("input", () => {
    const query = filterInput.value.trim().toLowerCase();

    groups.forEach((group) => {
      let visibleCount = 0;
      let node = group.nextElementSibling;
      while (node && node.classList.contains("dev-nav__link")) {
        const matches = !query || node.textContent.toLowerCase().includes(query);
        node.classList.toggle("is-hidden", !matches);
        if (matches) visibleCount++;
        node = node.nextElementSibling;
      }
      group.classList.toggle("is-hidden", visibleCount === 0);
    });
  });
}

/* ---------- Menu lateral: mostra só a ferramenta selecionada ---------- */
function initDevNav() {
  const links = document.querySelectorAll(".dev-nav__link");
  const panels = document.querySelectorAll(".dev-content .tool-card");
  if (!links.length || !panels.length) return;

  function activate(tool) {
    const target = Array.from(panels).find((panel) => panel.dataset.tool === tool);
    if (!target) return false;

    panels.forEach((panel) => panel.classList.toggle("is-active", panel === target));
    links.forEach((link) => link.classList.toggle("is-active", link.dataset.target === tool));
    return true;
  }

  links.forEach((link) => {
    link.addEventListener("click", () => {
      const tool = link.dataset.target;
      if (!activate(tool)) return;
      history.replaceState(null, "", `#${tool}`);
    });
  });

  window.addEventListener("hashchange", () => {
    activate(window.location.hash.slice(1));
  });

  const initialTool = window.location.hash.slice(1);
  if (!initialTool || !activate(initialTool)) {
    activate(links[0].dataset.target);
  }
}

/* ---------- Copiar saída (comum a todos os cards) ---------- */
function wireCopyButtons() {
  document.querySelectorAll(".tool-copy").forEach((btn) => {
    btn.addEventListener("click", () => {
      const output = btn.closest(".tool-card")?.querySelector(".tool-output");
      if (!output || !output.value) return;
      copyToClipboard(output.value);
      showToast("Copiado!");
    });
  });
}

/* ---------- Dark / Light mode (mesma lógica do site principal) ---------- */
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

/* ---------- Liga cada card "gerar N linhas" aos geradores ---------- */
function initToolCard(card) {
  const tool = card.dataset.tool;
  const qtyInput = card.querySelector(".tool-qty");
  const output = card.querySelector(".tool-output");
  const generateBtn = card.querySelector(".tool-generate");

  const generators = {
    cpf: () => generateCPF(card.querySelector(".tool-formatted").checked),
    cnpj: () => generateCNPJ(card.querySelector(".tool-formatted").checked),
    placa: () => generatePlaca(card.querySelector(".tool-format").value),
    guid: () => generateGUID({
      version: card.querySelector(".tool-guid-version").value,
      hyphens: card.querySelector(".tool-guid-hyphens").checked,
      upper: card.querySelector(".tool-guid-upper").checked,
      braces: card.querySelector(".tool-guid-braces").checked,
      quotes: card.querySelector(".tool-guid-quotes").checked,
      commas: card.querySelector(".tool-guid-commas").checked,
    }),
    senha: () => generatePassword(
      clamp(parseInt(card.querySelector(".tool-pw-length").value, 10) || 16, 4, 128),
      {
        upper: card.querySelector(".tool-pw-upper").checked,
        lower: card.querySelector(".tool-pw-lower").checked,
        numbers: card.querySelector(".tool-pw-numbers").checked,
        symbols: card.querySelector(".tool-pw-symbols").checked,
      }
    ),
    rg: () => generateRG(),
    cnh: () => generateCNH(),
    pis: () => generatePIS(card.querySelector(".tool-formatted").checked),
    renavam: () => generateRENAVAM(),
    titulo: () => generateTitulo(parseInt(card.querySelector(".titulo-uf").value, 10) || null),
    cartao: () => generateCreditCard(card.querySelector(".cartao-bandeira").value),
  };

  const generate = generators[tool];
  if (!generate || !generateBtn) return;

  const qtyMin = parseInt(qtyInput.min, 10) || 1;
  const qtyMax = parseInt(qtyInput.max, 10) || 50;

  generateBtn.addEventListener("click", () => {
    const qty = clamp(parseInt(qtyInput.value, 10) || 1, qtyMin, qtyMax);
    qtyInput.value = qty;
    const lines = Array.from({ length: qty }, generate);
    output.value = lines.join("\n");
  });
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/* ---------- CPF ---------- */
function generateCPF(formatted) {
  const base = randomDigits(9);
  const d1 = cpfCheckDigit(base);
  const d2 = cpfCheckDigit([...base, d1]);
  const digits = [...base, d1, d2].join("");
  return formatted ? digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : digits;
}

function cpfCheckDigit(digits) {
  let sum = 0;
  let weight = digits.length + 1;
  for (const digit of digits) {
    sum += digit * weight;
    weight--;
  }
  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
}

/* ---------- CNPJ ---------- */
const CNPJ_WEIGHTS_1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const CNPJ_WEIGHTS_2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function generateCNPJ(formatted) {
  const base = randomDigits(12);
  const d1 = cnpjCheckDigit(base, CNPJ_WEIGHTS_1);
  const d2 = cnpjCheckDigit([...base, d1], CNPJ_WEIGHTS_2);
  const digits = [...base, d1, d2].join("");
  return formatted
    ? digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
    : digits;
}

function cnpjCheckDigit(digits, weights) {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    sum += digits[i] * weights[i];
  }
  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
}

/* ---------- Placa ---------- */
function generatePlaca(format) {
  const letters = randomLetters(3);

  if (format === "antiga") {
    return `${letters}-${randomDigits(4).join("")}`;
  }

  // Mercosul: LLL N L NN
  const digit1 = randomDigits(1)[0];
  const letter4 = randomLetters(1);
  const digits23 = randomDigits(2).join("");
  return `${letters}${digit1}${letter4}${digits23}`;
}

/* ---------- GUID / UUID (v4 e v7) ---------- */
function generateGUID(options) {
  let uuid = options.version === "v7" ? uuidV7() : crypto.randomUUID();

  if (!options.hyphens) uuid = uuid.replace(/-/g, "");
  if (options.upper) uuid = uuid.toUpperCase();
  if (options.braces) uuid = `{${uuid}}`;
  if (options.quotes) uuid = `"${uuid}"`;
  if (options.commas) uuid += ",";

  return uuid;
}

// RFC 9562 UUIDv7: 48 bits de timestamp (ms) + 74 bits aleatórios,
// o que faz os IDs saírem ordenáveis por tempo de criação.
function uuidV7() {
  const bytes = new Uint8Array(16);
  let ts = BigInt(Date.now());

  for (let i = 5; i >= 0; i--) {
    bytes[i] = Number(ts & 0xffn);
    ts >>= 8n;
  }

  const random = crypto.getRandomValues(new Uint8Array(10));
  bytes[6] = 0x70 | (random[0] & 0x0f); // versão 7
  bytes[7] = random[1];
  bytes[8] = 0x80 | (random[2] & 0x3f); // variante RFC 4122
  bytes.set(random.slice(3), 9);

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/* ---------- Senha ---------- */
function generatePassword(length, options) {
  let charset = "";
  if (options.lower) charset += "abcdefghijklmnopqrstuvwxyz";
  if (options.upper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (options.numbers) charset += "0123456789";
  if (options.symbols) charset += "!@#$%^&*()-_=+[]{}<>?/";
  if (!charset) charset = "abcdefghijklmnopqrstuvwxyz0123456789";

  const randomValues = crypto.getRandomValues(new Uint32Array(length));
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charset.length];
  }
  return password;
}

/* ---------- Slug ---------- */
function initSlugCard(card) {
  if (!card) return;
  const input = card.querySelector(".tool-input");
  const output = card.querySelector(".tool-output");

  card.querySelector(".slug-generate").addEventListener("click", () => {
    output.value = slugify(input.value);
  });
}

function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ---------- Codificador / Decodificador (Base64 / URL / HTML Entities) ---------- */
function initBase64Card(card) {
  if (!card) return;
  const input = card.querySelector(".tool-input");
  const output = card.querySelector(".tool-output");
  const tipo = card.querySelector(".base64-tipo");

  const encoders = {
    base64: toBase64,
    url: (text) => encodeURIComponent(text),
    html: htmlEntitiesEncode,
  };
  const decoders = {
    base64: (text) => fromBase64(text.trim()),
    url: (text) => decodeURIComponent(text),
    html: htmlEntitiesDecode,
  };

  card.querySelector(".base64-encode").addEventListener("click", () => {
    try {
      output.value = encoders[tipo.value](input.value);
    } catch (err) {
      output.value = `Erro ao codificar: ${err.message}`;
    }
  });

  card.querySelector(".base64-decode").addEventListener("click", () => {
    try {
      output.value = decoders[tipo.value](input.value);
    } catch {
      output.value = "Valor inválido para decodificar.";
    }
  });
}

function htmlEntitiesEncode(text) {
  const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return text.replace(/[&<>"']/g, (ch) => map[ch]);
}

function htmlEntitiesDecode(text) {
  const map = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", apos: "'" };
  return text.replace(/&(#?[a-z0-9]+);/gi, (match, entity) => {
    if (map[entity.toLowerCase()] !== undefined) return map[entity.toLowerCase()];
    if (entity[0] === "#") {
      const code = entity[1] === "x" || entity[1] === "X"
        ? parseInt(entity.slice(2), 16)
        : parseInt(entity.slice(1), 10);
      return Number.isNaN(code) ? match : String.fromCodePoint(code);
    }
    return match;
  });
}

function toBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function fromBase64(base64) {
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/* ---------- JWT ---------- */
function initJwtCard(card) {
  if (!card) return;
  const input = card.querySelector(".tool-input");
  const output = card.querySelector(".tool-output");

  card.querySelector(".jwt-decode").addEventListener("click", () => {
    output.value = decodeJWT(input.value.trim());
  });
}

function decodeJWT(token) {
  const parts = token.split(".");
  if (parts.length < 2) {
    return "Token inválido: formato esperado é header.payload.assinatura";
  }

  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));

    const readableDates = ["exp", "iat", "nbf"]
      .filter((field) => typeof payload[field] === "number")
      .map((field) => `${field}: ${new Date(payload[field] * 1000).toLocaleString("pt-BR")}`)
      .join("\n");

    return [
      "HEADER:",
      JSON.stringify(header, null, 2),
      "",
      "PAYLOAD:",
      JSON.stringify(payload, null, 2),
      readableDates ? `\nDatas legíveis:\n${readableDates}` : "",
    ].join("\n");
  } catch (err) {
    return `Não foi possível decodificar: ${err.message}`;
  }
}

function base64UrlDecode(segment) {
  let base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  return fromBase64(base64);
}

/* ---------- JSON ---------- */
function initJsonCard(card) {
  if (!card) return;
  const input = card.querySelector(".tool-input");
  const output = card.querySelector(".tool-output");

  card.querySelector(".json-format").addEventListener("click", () => {
    output.value = formatJSON(input.value, 2);
  });

  card.querySelector(".json-minify").addEventListener("click", () => {
    output.value = formatJSON(input.value, 0);
  });
}

function formatJSON(text, indent) {
  try {
    const parsed = JSON.parse(text);
    return JSON.stringify(parsed, null, indent || undefined);
  } catch (err) {
    return `JSON inválido: ${err.message}`;
  }
}

/* ---------- Hash (MD5 / SHA-1 / SHA-256 / CRC32) ---------- */
function initHashCard(card) {
  if (!card) return;
  const input = card.querySelector(".tool-input");
  const algo = card.querySelector(".hash-algo");
  const output = card.querySelector(".tool-output");

  card.querySelector(".hash-generate").addEventListener("click", async () => {
    const text = input.value;
    switch (algo.value) {
      case "MD5": output.value = md5(text); break;
      case "SHA-1": output.value = await webCryptoHash("SHA-1", text); break;
      case "SHA-256": output.value = await webCryptoHash("SHA-256", text); break;
      case "CRC32": output.value = crc32(text); break;
    }
  });
}

async function webCryptoHash(algorithm, text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest(algorithm, bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

const CRC32_TABLE = (() => {
  const table = new Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(text) {
  const bytes = new TextEncoder().encode(text);
  let crc = 0xffffffff;
  for (const b of bytes) {
    crc = CRC32_TABLE[(crc ^ b) & 0xff] ^ (crc >>> 8);
  }
  return ((crc ^ 0xffffffff) >>> 0).toString(16).padStart(8, "0");
}

// Implementação própria de MD5 (RFC 1321) — o Web Crypto (SubtleCrypto)
// não expõe MD5 por ser um algoritmo obsoleto para criptografia.
function md5(input) {
  const bytes = new TextEncoder().encode(input);
  const bitLength = bytes.length * 8;
  const wordCount = (((bitLength + 64) >>> 9) << 4) + 16;
  const words = new Array(wordCount).fill(0);

  for (let i = 0; i < bytes.length; i++) {
    words[i >> 2] |= bytes[i] << ((i % 4) * 8);
  }
  words[bitLength >>> 5] |= 0x80 << (bitLength % 32);
  words[(((bitLength + 64) >>> 9) << 4) + 14] = bitLength;

  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;

  for (let i = 0; i < words.length; i += 16) {
    const aa = a, bb = b, cc = c, dd = d;

    a = md5ff(a, b, c, d, words[i + 0], 7, -680876936);
    d = md5ff(d, a, b, c, words[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, words[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, words[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, words[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, words[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, words[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, words[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, words[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, words[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, words[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, words[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, words[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, words[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, words[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, words[i + 15], 22, 1236535329);

    a = md5gg(a, b, c, d, words[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, words[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, words[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, words[i + 0], 20, -373897302);
    a = md5gg(a, b, c, d, words[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, words[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, words[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, words[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, words[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, words[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, words[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, words[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, words[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, words[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, words[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, words[i + 12], 20, -1926607734);

    a = md5hh(a, b, c, d, words[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, words[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, words[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, words[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, words[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, words[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, words[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, words[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, words[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, words[i + 0], 11, -358537222);
    c = md5hh(c, d, a, b, words[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, words[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, words[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, words[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, words[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, words[i + 2], 23, -995338651);

    a = md5ii(a, b, c, d, words[i + 0], 6, -198630844);
    d = md5ii(d, a, b, c, words[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, words[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, words[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, words[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, words[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, words[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, words[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, words[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, words[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, words[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, words[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, words[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, words[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, words[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, words[i + 9], 21, -343485551);

    a = addUnsigned32(a, aa);
    b = addUnsigned32(b, bb);
    c = addUnsigned32(c, cc);
    d = addUnsigned32(d, dd);
  }

  return [a, b, c, d].map(md5WordToHex).join("");
}

function addUnsigned32(x, y) {
  return (x + y) | 0;
}

function rotateLeft(x, n) {
  return (x << n) | (x >>> (32 - n));
}

function md5cmn(q, a, b, x, s, t) {
  return addUnsigned32(rotateLeft(addUnsigned32(addUnsigned32(a, q), addUnsigned32(x, t)), s), b);
}

function md5ff(a, b, c, d, x, s, t) {
  return md5cmn((b & c) | (~b & d), a, b, x, s, t);
}

function md5gg(a, b, c, d, x, s, t) {
  return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
}

function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}

function md5WordToHex(word) {
  let hex = "";
  for (let i = 0; i < 4; i++) {
    hex += ((word >> (i * 8)) & 0xff).toString(16).padStart(2, "0");
  }
  return hex;
}

/* ---------- Timestamp Unix ---------- */
function initTimestampCard(card) {
  if (!card) return;
  const tsInput = card.querySelector(".ts-input");
  const tsUnit = card.querySelector(".ts-unit");
  const dateInput = card.querySelector(".ts-date-input");
  const output = card.querySelector(".tool-output");

  card.querySelector(".ts-now").addEventListener("click", () => {
    tsInput.value = tsUnit.value === "ms" ? Date.now() : Math.floor(Date.now() / 1000);
  });

  card.querySelector(".ts-to-date").addEventListener("click", () => {
    const raw = Number(tsInput.value);
    if (Number.isNaN(raw) || tsInput.value.trim() === "") {
      output.value = "Timestamp inválido.";
      return;
    }
    const ms = tsUnit.value === "ms" ? raw : raw * 1000;
    const date = new Date(ms);
    output.value = `ISO: ${date.toISOString()}\nLocal: ${date.toLocaleString("pt-BR")}`;
  });

  card.querySelector(".ts-to-timestamp").addEventListener("click", () => {
    if (!dateInput.value) {
      output.value = "Selecione uma data e hora.";
      return;
    }
    const date = new Date(dateInput.value);
    output.value = `Segundos: ${Math.floor(date.getTime() / 1000)}\nMilissegundos: ${date.getTime()}`;
  });
}

/* ---------- Lorem Ipsum ---------- */
const LOREM_WORDS = (
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod " +
  "tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam " +
  "quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo " +
  "consequat duis aute irure in reprehenderit voluptate velit esse cillum " +
  "eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident " +
  "sunt culpa qui officia deserunt mollit anim id est laborum"
).split(" ");

function initLoremCard(card) {
  if (!card) return;
  const qtyInput = card.querySelector(".lorem-qty");
  const unitSelect = card.querySelector(".lorem-unit");
  const output = card.querySelector(".tool-output");

  const qtyMin = parseInt(qtyInput.min, 10) || 1;
  const qtyMax = parseInt(qtyInput.max, 10) || 50;

  card.querySelector(".lorem-generate").addEventListener("click", () => {
    const qty = clamp(parseInt(qtyInput.value, 10) || 1, qtyMin, qtyMax);
    qtyInput.value = qty;
    output.value = generateLorem(qty, unitSelect.value);
  });
}

function generateLorem(qty, unit) {
  if (unit === "palavras") {
    const text = Array.from({ length: qty }, loremWord).join(" ");
    return capitalize(text);
  }

  if (unit === "frases") {
    return Array.from({ length: qty }, () => loremSentence()).join(" ");
  }

  return Array.from({ length: qty }, loremParagraph).join("\n\n");
}

function loremWord() {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function loremSentence() {
  const count = 8 + Math.floor(Math.random() * 8);
  const sentence = Array.from({ length: count }, loremWord).join(" ");
  return capitalize(sentence) + ".";
}

function loremParagraph() {
  const sentenceCount = 4 + Math.floor(Math.random() * 4);
  return Array.from({ length: sentenceCount }, loremSentence).join(" ");
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/* ---------- RG ---------- */
// O RG não tem um algoritmo nacional único (cada estado emite o seu).
// Segue o formato/dígito verificador mais comum entre geradores (padrão SP-like).
function generateRG() {
  const base = randomDigits(8);
  const weights = [2, 3, 4, 5, 6, 7, 8, 9];
  const sum = base.reduce((acc, d, i) => acc + d * weights[i], 0);
  const rest = sum % 11;
  const dv = rest === 10 ? "X" : String(rest);
  const digits = base.join("");
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}-${dv}`;
}

/* ---------- CNH ---------- */
function generateCNH() {
  const base = randomDigits(9);
  const w1 = [9, 8, 7, 6, 5, 4, 3, 2, 1];
  const sum1 = base.reduce((acc, d, i) => acc + d * w1[i], 0);
  const rest1 = sum1 % 11;
  const dv1 = rest1 < 2 ? 0 : 11 - rest1;

  const w2 = [10, 9, 8, 7, 6, 5, 4, 3, 2];
  const sum2 = base.reduce((acc, d, i) => acc + d * w2[i], 0);
  const rest2 = sum2 % 11;
  const dv2 = rest2 < 2 ? 0 : 11 - rest2;

  return [...base, dv1, dv2].join("");
}

function validateCNH(cnh) {
  const digits = cnh.replace(/\D/g, "").split("").map(Number);
  if (digits.length !== 11) return false;
  return generateCNHFromBase(digits.slice(0, 9)) === digits.join("");
}

function generateCNHFromBase(base) {
  const w1 = [9, 8, 7, 6, 5, 4, 3, 2, 1];
  const sum1 = base.reduce((acc, d, i) => acc + d * w1[i], 0);
  const rest1 = sum1 % 11;
  const dv1 = rest1 < 2 ? 0 : 11 - rest1;

  const w2 = [10, 9, 8, 7, 6, 5, 4, 3, 2];
  const sum2 = base.reduce((acc, d, i) => acc + d * w2[i], 0);
  const rest2 = sum2 % 11;
  const dv2 = rest2 < 2 ? 0 : 11 - rest2;

  return [...base, dv1, dv2].join("");
}

/* ---------- PIS/PASEP ---------- */
const PIS_WEIGHTS = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function generatePIS(formatted) {
  const base = randomDigits(10);
  const sum = base.reduce((acc, d, i) => acc + d * PIS_WEIGHTS[i], 0);
  const rest = sum % 11;
  const dv = rest < 2 ? 0 : 11 - rest;
  const digits = [...base, dv].join("");
  return formatted ? digits.replace(/(\d{3})(\d{5})(\d{2})(\d{1})/, "$1.$2.$3-$4") : digits;
}

function validatePIS(pis) {
  const digits = pis.replace(/\D/g, "").split("").map(Number);
  if (digits.length !== 11) return false;
  const sum = digits.slice(0, 10).reduce((acc, d, i) => acc + d * PIS_WEIGHTS[i], 0);
  const rest = sum % 11;
  const dv = rest < 2 ? 0 : 11 - rest;
  return dv === digits[10];
}

/* ---------- RENAVAM ---------- */
const RENAVAM_WEIGHTS = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3];

function generateRENAVAM() {
  const base = randomDigits(10);
  const reversed = [...base].reverse();
  const sum = reversed.reduce((acc, d, i) => acc + d * RENAVAM_WEIGHTS[i], 0);
  const rest = sum % 11;
  const dv = rest < 2 ? 0 : 11 - rest;
  return [...base, dv].join("");
}

function validateRENAVAM(renavam) {
  const digits = renavam.replace(/\D/g, "").split("").map(Number);
  if (digits.length !== 11) return false;
  const base = digits.slice(0, 10);
  const reversed = [...base].reverse();
  const sum = reversed.reduce((acc, d, i) => acc + d * RENAVAM_WEIGHTS[i], 0);
  const rest = sum % 11;
  const dv = rest < 2 ? 0 : 11 - rest;
  return dv === digits[10];
}

/* ---------- Título de Eleitor ---------- */
function generateTitulo(ufCode) {
  const uf = ufCode || 1 + Math.floor(Math.random() * 28);
  const ufDigits = [Math.floor(uf / 10), uf % 10];
  const seq = randomDigits(8);

  const w1 = [2, 3, 4, 5, 6, 7, 8, 9];
  const sum1 = seq.reduce((acc, d, i) => acc + d * w1[i], 0);
  const rest1 = sum1 % 11;
  let dv1 = rest1 >= 10 ? 0 : rest1;
  if (uf <= 2 && (rest1 === 0 || rest1 === 1)) dv1 = 1;

  const w2 = [7, 8, 9];
  const part2 = [...ufDigits, dv1];
  const sum2 = part2.reduce((acc, d, i) => acc + d * w2[i], 0);
  const rest2 = sum2 % 11;
  let dv2 = rest2 >= 10 ? 0 : rest2;
  if (uf <= 2 && (rest2 === 0 || rest2 === 1)) dv2 = 1;

  return [...seq, ...ufDigits, dv1, dv2].join("");
}

function validateTitulo(titulo) {
  const digits = titulo.replace(/\D/g, "").split("").map(Number);
  if (digits.length !== 12) return false;
  const ufDigits = digits.slice(8, 10);
  const uf = ufDigits[0] * 10 + ufDigits[1];
  return generateTituloDeterministic(digits.slice(0, 8), uf) === digits.join("");
}

function generateTituloDeterministic(seq, uf) {
  const ufDigits = [Math.floor(uf / 10), uf % 10];
  const w1 = [2, 3, 4, 5, 6, 7, 8, 9];
  const sum1 = seq.reduce((acc, d, i) => acc + d * w1[i], 0);
  const rest1 = sum1 % 11;
  let dv1 = rest1 >= 10 ? 0 : rest1;
  if (uf <= 2 && (rest1 === 0 || rest1 === 1)) dv1 = 1;

  const w2 = [7, 8, 9];
  const part2 = [...ufDigits, dv1];
  const sum2 = part2.reduce((acc, d, i) => acc + d * w2[i], 0);
  const rest2 = sum2 % 11;
  let dv2 = rest2 >= 10 ? 0 : rest2;
  if (uf <= 2 && (rest2 === 0 || rest2 === 1)) dv2 = 1;

  return [...seq, ...ufDigits, dv1, dv2].join("");
}

/* ---------- Cartão de crédito (Luhn) ---------- */
const CARD_BRANDS = {
  visa: { prefix: "4", length: 16 },
  mastercard: { prefix: "51", length: 16 },
  amex: { prefix: "34", length: 15 },
  elo: { prefix: "636297", length: 16 },
};

function generateCreditCard(brand) {
  const { prefix, length } = CARD_BRANDS[brand] || CARD_BRANDS.visa;
  const digits = prefix.split("").map(Number);
  while (digits.length < length - 1) digits.push(Math.floor(Math.random() * 10));
  const check = luhnCheckDigit(digits);
  const number = [...digits, check].join("");
  return number.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function luhnCheckDigit(digits) {
  let sum = 0;
  let double = true;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits[i];
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return (10 - (sum % 10)) % 10;
}

function validateLuhn(number) {
  const digits = number.replace(/\D/g, "").split("").map(Number);
  if (digits.length < 2) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits[i];
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

/* ---------- Validador de Documentos ---------- */
function validateCPF(cpf) {
  const digits = cpf.replace(/\D/g, "").split("").map(Number);
  if (digits.length !== 11 || new Set(digits).size === 1) return false;
  const d1 = cpfCheckDigit(digits.slice(0, 9));
  const d2 = cpfCheckDigit(digits.slice(0, 10));
  return d1 === digits[9] && d2 === digits[10];
}

function validateCNPJ(cnpj) {
  const digits = cnpj.replace(/\D/g, "").split("").map(Number);
  if (digits.length !== 14) return false;
  const d1 = cnpjCheckDigit(digits.slice(0, 12), CNPJ_WEIGHTS_1);
  const d2 = cnpjCheckDigit(digits.slice(0, 13), CNPJ_WEIGHTS_2);
  return d1 === digits[12] && d2 === digits[13];
}

function initValidadorCard(card) {
  if (!card) return;
  const tipo = card.querySelector(".validador-tipo");
  const input = card.querySelector(".tool-input");
  const output = card.querySelector(".tool-output");

  const validators = {
    cpf: validateCPF,
    cnpj: validateCNPJ,
    cnh: validateCNH,
    pis: validatePIS,
    renavam: validateRENAVAM,
    titulo: validateTitulo,
    cartao: validateLuhn,
  };

  card.querySelector(".validador-checar").addEventListener("click", () => {
    if (!input.value.trim()) {
      output.value = "Digite um número.";
      return;
    }
    const valid = validators[tipo.value](input.value);
    output.value = valid ? "Válido ✓" : "Inválido ✗";
  });
}

/* ---------- QR Code (ISO/IEC 18004, modo byte, nível de correção M) ---------- */
const QR_GF_EXP = new Array(512);
const QR_GF_LOG = new Array(256);
(function initQrGaloisField() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    QR_GF_EXP[i] = x;
    QR_GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) QR_GF_EXP[i] = QR_GF_EXP[i - 255];
})();

function qrGfMul(a, b) {
  if (a === 0 || b === 0) return 0;
  return QR_GF_EXP[QR_GF_LOG[a] + QR_GF_LOG[b]];
}

function qrPolyMul(p1, p2) {
  const result = new Array(p1.length + p2.length - 1).fill(0);
  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      result[i + j] ^= qrGfMul(p1[i], p2[j]);
    }
  }
  return result;
}

function qrRsGeneratorPoly(degree) {
  let g = [1];
  for (let i = 0; i < degree; i++) g = qrPolyMul(g, [1, QR_GF_EXP[i]]);
  return g;
}

function qrRsEncode(dataCodewords, ecCount) {
  const generator = qrRsGeneratorPoly(ecCount);
  const buffer = dataCodewords.concat(new Array(ecCount).fill(0));
  for (let i = 0; i < dataCodewords.length; i++) {
    const coef = buffer[i];
    if (coef === 0) continue;
    for (let j = 0; j < generator.length; j++) buffer[i + j] ^= qrGfMul(generator[j], coef);
  }
  return buffer.slice(dataCodewords.length);
}

// [totalCodewords, ecCodewordsPorBloco, blocosGrupo1, dadosGrupo1, blocosGrupo2, dadosGrupo2]
// Nível de correção M, ISO/IEC 18004 Anexo D, versões 1-10.
const QR_RS_BLOCK_TABLE_M = {
  1: [26, 10, 1, 16, 0, 0],
  2: [44, 16, 1, 28, 0, 0],
  3: [70, 26, 1, 44, 0, 0],
  4: [100, 18, 2, 32, 0, 0],
  5: [134, 24, 2, 43, 0, 0],
  6: [172, 16, 4, 27, 0, 0],
  7: [196, 18, 4, 31, 0, 0],
  8: [242, 22, 2, 38, 2, 39],
  9: [292, 22, 3, 36, 2, 37],
  10: [346, 26, 4, 43, 1, 44],
};

const QR_CHAR_CAPACITY_M = { 1: 14, 2: 26, 3: 42, 4: 62, 5: 84, 6: 106, 7: 122, 8: 152, 9: 180, 10: 213 };

function qrPickVersion(byteLength) {
  for (let v = 1; v <= 10; v++) {
    if (byteLength <= QR_CHAR_CAPACITY_M[v]) return v;
  }
  throw new Error("Texto longo demais (máx. 213 caracteres).");
}

class QrBitBuffer {
  constructor() {
    this.bits = [];
  }
  put(value, length) {
    for (let i = length - 1; i >= 0; i--) this.bits.push((value >>> i) & 1);
  }
  toBytes() {
    while (this.bits.length % 8 !== 0) this.bits.push(0);
    const bytes = [];
    for (let i = 0; i < this.bits.length; i += 8) {
      let byte = 0;
      for (let j = 0; j < 8; j++) byte = (byte << 1) | this.bits[i + j];
      bytes.push(byte);
    }
    return bytes;
  }
}

function qrBuildCodewords(text, version) {
  const bytes = Array.from(new TextEncoder().encode(text));
  const [, ecPerBlock, blocks1, data1, blocks2, data2] = QR_RS_BLOCK_TABLE_M[version];

  const buffer = new QrBitBuffer();
  buffer.put(0b0100, 4);
  buffer.put(bytes.length, version <= 9 ? 8 : 16);
  bytes.forEach((b) => buffer.put(b, 8));

  const totalDataCodewords = blocks1 * data1 + blocks2 * data2;
  const totalBits = totalDataCodewords * 8;

  for (let i = 0; i < 4 && buffer.bits.length < totalBits; i++) buffer.bits.push(0);
  while (buffer.bits.length % 8 !== 0) buffer.bits.push(0);

  const dataCodewords = buffer.toBytes();
  const padBytes = [0xec, 0x11];
  let padIndex = 0;
  while (dataCodewords.length < totalDataCodewords) {
    dataCodewords.push(padBytes[padIndex % 2]);
    padIndex++;
  }

  const blockDefs = [];
  for (let i = 0; i < blocks1; i++) blockDefs.push(data1);
  for (let i = 0; i < blocks2; i++) blockDefs.push(data2);

  const dataBlocks = [];
  const ecBlocks = [];
  let offset = 0;
  for (const size of blockDefs) {
    const block = dataCodewords.slice(offset, offset + size);
    offset += size;
    dataBlocks.push(block);
    ecBlocks.push(qrRsEncode(block, ecPerBlock));
  }

  const result = [];
  const maxDataLen = Math.max(...blockDefs);
  for (let i = 0; i < maxDataLen; i++) {
    for (const block of dataBlocks) if (i < block.length) result.push(block[i]);
  }
  for (let i = 0; i < ecPerBlock; i++) {
    for (const block of ecBlocks) result.push(block[i]);
  }
  return result;
}

function qrModuleCount(version) {
  return version * 4 + 17;
}

function qrCreateMatrix(version) {
  const n = qrModuleCount(version);
  return Array.from({ length: n }, () => new Array(n).fill(null));
}

function qrPlaceFinder(matrix, row, col) {
  for (let r = -1; r <= 7; r++) {
    for (let c = -1; c <= 7; c++) {
      const rr = row + r;
      const cc = col + c;
      if (rr < 0 || rr >= matrix.length || cc < 0 || cc >= matrix.length) continue;
      const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
      const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
      if (r === -1 || r === 7 || c === -1 || c === 7) matrix[rr][cc] = 0;
      else if (isBorder || isInner) matrix[rr][cc] = 1;
      else matrix[rr][cc] = 0;
    }
  }
}

const QR_ALIGNMENT_POSITIONS = {
  1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30],
  6: [6, 34], 7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50],
};

function qrPlaceAlignmentPatterns(matrix, version) {
  const positions = QR_ALIGNMENT_POSITIONS[version];
  const n = matrix.length;
  for (const row of positions) {
    for (const col of positions) {
      if ((row <= 8 && col <= 8) || (row <= 8 && col >= n - 9) || (row >= n - 9 && col <= 8)) continue;
      for (let r = -2; r <= 2; r++) {
        for (let c = -2; c <= 2; c++) {
          const isEdge = r === -2 || r === 2 || c === -2 || c === 2;
          matrix[row + r][col + c] = isEdge || (r === 0 && c === 0) ? 1 : 0;
        }
      }
    }
  }
}

function qrPlaceTimingPatterns(matrix) {
  const n = matrix.length;
  for (let i = 8; i < n - 8; i++) {
    const value = i % 2 === 0 ? 1 : 0;
    if (matrix[6][i] === null) matrix[6][i] = value;
    if (matrix[i][6] === null) matrix[i][6] = value;
  }
}

function qrPlaceDarkModule(matrix, version) {
  matrix[4 * version + 9][8] = 1;
}

function qrReserveFormatAreas(matrix) {
  const n = matrix.length;
  for (let i = 0; i <= 8; i++) {
    if (i !== 6) {
      if (matrix[8][i] === null) matrix[8][i] = -1;
      if (matrix[i][8] === null) matrix[i][8] = -1;
    }
  }
  for (let i = 0; i < 8; i++) {
    matrix[8][n - 1 - i] = -1;
    matrix[n - 1 - i][8] = -1;
  }
  matrix[n - 8][8] = -1;
}

const QR_FORMAT_GENERATOR = 0x537;
function qrFormatBits(ecLevelBits, maskPattern) {
  const data = (ecLevelBits << 3) | maskPattern;
  let value = data << 10;
  for (let i = 14; i >= 10; i--) {
    if ((value >> i) & 1) value ^= QR_FORMAT_GENERATOR << (i - 10);
  }
  return ((data << 10) | value) ^ 0b101010000010010;
}

function qrPlaceFormatInfo(matrix, ecLevelBits, maskPattern) {
  const n = matrix.length;
  const bits = qrFormatBits(ecLevelBits, maskPattern);
  const getBit = (i) => (bits >> i) & 1;

  const col8Rows = [0, 1, 2, 3, 4, 5, 7, 8];
  for (let i = 0; i <= 7; i++) matrix[col8Rows[i]][8] = getBit(i);

  const row8Cols = [7, 5, 4, 3, 2, 1, 0];
  for (let i = 8; i <= 14; i++) matrix[8][row8Cols[i - 8]] = getBit(i);

  for (let i = 0; i <= 7; i++) matrix[8][n - 1 - i] = getBit(i);
  for (let i = 8; i <= 14; i++) matrix[n - 15 + i][8] = getBit(i);
}

const QR_VERSION_GENERATOR = 0x1f25;
function qrVersionBits(version) {
  let value = version << 12;
  for (let i = 17; i >= 12; i--) {
    if ((value >> i) & 1) value ^= QR_VERSION_GENERATOR << (i - 12);
  }
  return (version << 12) | value;
}

function qrPlaceVersionInfo(matrix, version) {
  if (version < 7) return;
  const n = matrix.length;
  const bits = qrVersionBits(version);
  for (let i = 0; i < 18; i++) {
    const bit = (bits >> i) & 1;
    const row = Math.floor(i / 3);
    const col = n - 11 + (i % 3);
    matrix[row][col] = bit;
    matrix[col][row] = bit;
  }
}

function qrMaskFunction(pattern, r, c) {
  switch (pattern) {
    case 0: return (r + c) % 2 === 0;
    case 1: return r % 2 === 0;
    case 2: return c % 3 === 0;
    case 3: return (r + c) % 3 === 0;
    case 4: return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
    case 5: return ((r * c) % 2) + ((r * c) % 3) === 0;
    case 6: return (((r * c) % 2) + ((r * c) % 3)) % 2 === 0;
    case 7: return (((r + c) % 2) + ((r * c) % 3)) % 2 === 0;
    default: return false;
  }
}

function qrPlaceData(matrix, codewords, maskPattern) {
  const n = matrix.length;
  const bits = [];
  for (const byte of codewords) {
    for (let i = 7; i >= 0; i--) bits.push((byte >> i) & 1);
  }

  let bitIndex = 0;
  let col = n - 1;
  let dir = -1;

  while (col > 0) {
    if (col === 6) col--;

    for (let i = 0; i < n; i++) {
      const row = dir === -1 ? n - 1 - i : i;
      for (const c of [col, col - 1]) {
        if (matrix[row][c] !== null) continue;
        const bit = bitIndex < bits.length ? bits[bitIndex] : 0;
        bitIndex++;
        matrix[row][c] = qrMaskFunction(maskPattern, row, c) ? bit ^ 1 : bit;
      }
    }
    dir *= -1;
    col -= 2;
  }
}

function generateQR(text) {
  const version = qrPickVersion(new TextEncoder().encode(text).length);
  const codewords = qrBuildCodewords(text, version);
  const maskPattern = 0;

  const matrix = qrCreateMatrix(version);
  qrPlaceFinder(matrix, 0, 0);
  qrPlaceFinder(matrix, 0, matrix.length - 7);
  qrPlaceFinder(matrix, matrix.length - 7, 0);
  qrPlaceTimingPatterns(matrix);
  qrPlaceAlignmentPatterns(matrix, version);
  qrPlaceDarkModule(matrix, version);
  qrReserveFormatAreas(matrix);
  qrPlaceVersionInfo(matrix, version);
  qrPlaceData(matrix, codewords, maskPattern);
  qrPlaceFormatInfo(matrix, 0b00, maskPattern);

  return matrix.map((row) => row.map((v) => (v === 1 ? 1 : 0)));
}

function initQrCard(card) {
  if (!card) return;
  const input = card.querySelector(".qr-input");
  const canvas = card.querySelector(".qr-canvas");
  const ctx = canvas.getContext("2d");
  let hasRendered = false;

  function render() {
    const text = input.value.trim();
    if (!text) {
      showToast("Digite um texto primeiro.");
      return false;
    }
    let matrix;
    try {
      matrix = generateQR(text);
    } catch (err) {
      showToast(err.message);
      return false;
    }
    const n = matrix.length;
    const scale = Math.max(6, Math.floor(440 / n));
    const quiet = 4;
    const size = (n + quiet * 2) * scale;
    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#000000";
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (matrix[r][c]) ctx.fillRect((c + quiet) * scale, (r + quiet) * scale, scale, scale);
      }
    }
    hasRendered = true;
    return true;
  }

  card.querySelector(".qr-generate").addEventListener("click", render);

  card.querySelector(".qr-download").addEventListener("click", () => {
    if (!hasRendered && !render()) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

/* ---------- Conversor de Base Numérica ---------- */
function initBaseNumericaCard(card) {
  if (!card) return;
  const valor = card.querySelector(".base-valor");
  const de = card.querySelector(".base-de");
  const output = card.querySelector(".tool-output");

  card.querySelector(".base-converter").addEventListener("click", () => {
    const base = parseInt(de.value, 10);
    const num = parseInt(valor.value.trim(), base);
    if (Number.isNaN(num)) {
      output.value = "Valor inválido para essa base.";
      return;
    }
    output.value = [
      `Decimal: ${num.toString(10)}`,
      `Binário: ${num.toString(2)}`,
      `Octal: ${num.toString(8)}`,
      `Hexadecimal: ${num.toString(16).toUpperCase()}`,
    ].join("\n");
  });
}

/* ---------- Número por Extenso (PT-BR) ---------- */
const EXTENSO_UNIDADES = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];
const EXTENSO_DEZ_A_DEZENOVE = ["dez", "onze", "doze", "treze", "catorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
const EXTENSO_DEZENAS = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
const EXTENSO_CENTENAS = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];
const EXTENSO_ESCALAS = [
  { valor: 1000000000000, singular: "trilhão", plural: "trilhões" },
  { valor: 1000000000, singular: "bilhão", plural: "bilhões" },
  { valor: 1000000, singular: "milhão", plural: "milhões" },
  { valor: 1000, singular: "mil", plural: "mil" },
];

function extensoGrupo(n) {
  if (n === 0) return "";
  if (n === 100) return "cem";
  const c = Math.floor(n / 100);
  const resto = n % 100;
  const partes = [];
  if (c > 0) partes.push(EXTENSO_CENTENAS[c]);
  if (resto > 0) {
    if (resto < 10) partes.push(EXTENSO_UNIDADES[resto]);
    else if (resto < 20) partes.push(EXTENSO_DEZ_A_DEZENOVE[resto - 10]);
    else {
      const d = Math.floor(resto / 10);
      const u = resto % 10;
      partes.push(u > 0 ? `${EXTENSO_DEZENAS[d]} e ${EXTENSO_UNIDADES[u]}` : EXTENSO_DEZENAS[d]);
    }
  }
  return partes.join(" e ");
}

function numeroPorExtenso(n) {
  if (n === 0) return "zero";
  if (n < 0) return "menos " + numeroPorExtenso(-n);

  const partes = [];
  let resto = n;

  for (const escala of EXTENSO_ESCALAS) {
    const qtd = Math.floor(resto / escala.valor);
    if (qtd > 0) {
      if (escala.valor === 1000 && qtd === 1) partes.push("mil");
      else partes.push(`${extensoGrupo(qtd)} ${qtd === 1 ? escala.singular : escala.plural}`);
      resto %= escala.valor;
    }
  }

  if (resto > 0) partes.push(extensoGrupo(resto));

  if (partes.length > 1) {
    const ultimo = partes[partes.length - 1];
    const restoFinal = n % 1000;
    const precisaE = restoFinal > 0 && (restoFinal < 100 || restoFinal % 100 === 0);
    if (precisaE) return partes.slice(0, -1).join(", ") + " e " + ultimo;
  }

  return partes.join(", ");
}

function initExtensoCard(card) {
  if (!card) return;
  const input = card.querySelector(".extenso-input");
  const output = card.querySelector(".tool-output");

  card.querySelector(".extenso-gerar").addEventListener("click", () => {
    const n = parseInt(input.value, 10);
    if (Number.isNaN(n)) {
      output.value = "Digite um número válido.";
      return;
    }
    output.value = numeroPorExtenso(n);
  });
}

/* ---------- Navegador e Sistema ---------- */
function initAmbienteCard(card) {
  if (!card) return;
  const output = card.querySelector(".tool-output");

  card.querySelector(".ambiente-detectar").addEventListener("click", () => {
    const nav = navigator;
    output.value = [
      `Navegador (user agent): ${nav.userAgent}`,
      `Idioma: ${nav.language}`,
      `Plataforma: ${nav.platform || "n/d"}`,
      `Núcleos de CPU: ${nav.hardwareConcurrency || "n/d"}`,
      `Cookies habilitados: ${nav.cookieEnabled ? "sim" : "não"}`,
      `Resolução da tela: ${screen.width}x${screen.height}`,
      `Viewport: ${window.innerWidth}x${window.innerHeight}`,
      `Fuso horário: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
      `Online: ${nav.onLine ? "sim" : "não"}`,
    ].join("\n");
  });
}

/* ---------- Meu IP Público ---------- */
function initMeuIpCard(card) {
  if (!card) return;
  const output = card.querySelector(".tool-output");

  card.querySelector(".ip-buscar").addEventListener("click", async () => {
    output.value = "Buscando...";
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      output.value = `IP: ${data.ip}`;
    } catch {
      output.value = "Não foi possível buscar o IP (sem conexão ou serviço indisponível).";
    }
  });
}

/* ---------- Estatísticas de Texto ---------- */
function initStatsCard(card) {
  if (!card) return;
  const input = card.querySelector(".tool-input");
  const substr = card.querySelector(".stats-substring");
  const output = card.querySelector(".tool-output");

  card.querySelector(".stats-calcular").addEventListener("click", () => {
    const text = input.value;
    const lines = [
      `Caracteres: ${text.length}`,
      `Caracteres (sem espaços): ${text.replace(/\s/g, "").length}`,
      `Palavras: ${text.trim() ? text.trim().split(/\s+/).length : 0}`,
      `Linhas: ${text ? text.split("\n").length : 0}`,
    ];
    const needle = substr.value;
    if (needle) {
      lines.push(`Ocorrências de "${needle}": ${text.split(needle).length - 1}`);
    }
    output.value = lines.join("\n");
  });
}

/* ---------- Transformador de Texto ---------- */
function initTransformCard(card) {
  if (!card) return;
  const input = card.querySelector(".tool-input");
  const tipo = card.querySelector(".transform-tipo");
  const output = card.querySelector(".tool-output");

  card.querySelector(".transform-aplicar").addEventListener("click", () => {
    output.value = applyTextTransform(input.value, tipo.value);
  });
}

function applyTextTransform(text, tipo) {
  switch (tipo) {
    case "upper": return text.toUpperCase();
    case "lower": return text.toLowerCase();
    case "title": return text.replace(/\S+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    case "sentence": return text.charAt(0).toUpperCase() + text.slice(1);
    case "reverse": return Array.from(text).reverse().join("");
    case "accents": return stripAccents(text);
    case "trim": return text.trim().replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n");
    default: return text;
  }
}

function stripAccents(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/* ---------- Ordenador de Linhas ---------- */
function initOrdenarLinhasCard(card) {
  if (!card) return;
  const input = card.querySelector(".tool-input");
  const reverso = card.querySelector(".ordenar-reverso");
  const dedupe = card.querySelector(".ordenar-dedupe");
  const output = card.querySelector(".tool-output");

  card.querySelector(".ordenar-aplicar").addEventListener("click", () => {
    let lines = input.value.split("\n");
    if (dedupe.checked) lines = [...new Set(lines)];
    lines.sort((a, b) => a.localeCompare(b, "pt-BR"));
    if (reverso.checked) lines.reverse();
    output.value = lines.join("\n");
  });
}

/* ---------- Divisor de Texto ---------- */
function initDividirTextoCard(card) {
  if (!card) return;
  const input = card.querySelector(".tool-input");
  const delim = card.querySelector(".dividir-delim");
  const output = card.querySelector(".tool-output");

  card.querySelector(".dividir-aplicar").addEventListener("click", () => {
    const d = delim.value || ",";
    output.value = input.value.split(d).map((s) => s.trim()).filter(Boolean).join("\n");
  });
}

/* ---------- Buscar e Substituir ---------- */
function initBuscarSubstituirCard(card) {
  if (!card) return;
  const input = card.querySelector(".tool-input");
  const buscar = card.querySelector(".bs-buscar");
  const substituir = card.querySelector(".bs-substituir");
  const output = card.querySelector(".tool-output");

  card.querySelector(".bs-aplicar").addEventListener("click", () => {
    if (!buscar.value) {
      output.value = input.value;
      return;
    }
    output.value = input.value.split(buscar.value).join(substituir.value);
  });
}

/* ---------- Informações de Caractere ---------- */
function initCharInfoCard(card) {
  if (!card) return;
  const input = card.querySelector(".char-input");
  const output = card.querySelector(".tool-output");

  card.querySelector(".char-analisar").addEventListener("click", () => {
    const char = Array.from(input.value)[0];
    if (!char) {
      output.value = "Digite um caractere.";
      return;
    }
    const codePoint = char.codePointAt(0);
    const bytes = new TextEncoder().encode(char);
    output.value = [
      `Caractere: ${char}`,
      `Unicode: U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`,
      `Decimal: ${codePoint}`,
      `HTML entity: &#${codePoint};`,
      `UTF-8 bytes: ${Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join(" ")}`,
    ].join("\n");
  });
}

/* ---------- Números Romanos ---------- */
const ROMAN_VALUES = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
  [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

function toRoman(num) {
  let result = "";
  let n = num;
  for (const [value, symbol] of ROMAN_VALUES) {
    while (n >= value) {
      result += symbol;
      n -= value;
    }
  }
  return result;
}

function fromRoman(str) {
  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  const s = str.toUpperCase().trim();
  if (!/^[IVXLCDM]+$/.test(s)) return null;
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const curr = map[s[i]];
    const next = map[s[i + 1]];
    total += next && curr < next ? -curr : curr;
  }
  return total;
}

function initRomanosCard(card) {
  if (!card) return;
  const decimalInput = card.querySelector(".romano-decimal");
  const romanoInput = card.querySelector(".romano-texto");
  const output = card.querySelector(".tool-output");

  card.querySelector(".romano-para-romano").addEventListener("click", () => {
    const n = parseInt(decimalInput.value, 10);
    if (!n || n < 1 || n > 3999) {
      output.value = "Digite um número entre 1 e 3999.";
      return;
    }
    output.value = toRoman(n);
  });

  card.querySelector(".romano-para-decimal").addEventListener("click", () => {
    const value = fromRoman(romanoInput.value);
    output.value = value === null ? "Algarismo romano inválido." : String(value);
  });
}

/* ---------- Fatoração em Primos ---------- */
function primeFactors(n) {
  const factors = [];
  let num = n;
  for (let d = 2; d * d <= num; d++) {
    while (num % d === 0) {
      factors.push(d);
      num /= d;
    }
  }
  if (num > 1) factors.push(num);
  return factors;
}

function initFatoracaoCard(card) {
  if (!card) return;
  const input = card.querySelector(".fatoracao-input");
  const output = card.querySelector(".tool-output");

  card.querySelector(".fatoracao-calcular").addEventListener("click", () => {
    const n = parseInt(input.value, 10);
    if (!n || n < 2) {
      output.value = "Digite um número inteiro maior que 1.";
      return;
    }
    output.value = `${n} = ${primeFactors(n).join(" × ")}`;
  });
}

/* ---------- MDC / MMC ---------- */
function gcdTwo(a, b) {
  return b === 0 ? a : gcdTwo(b, a % b);
}

function lcmTwo(a, b) {
  return Math.abs(a * b) / gcdTwo(a, b);
}

function initMdcMmcCard(card) {
  if (!card) return;
  const input = card.querySelector(".mdc-numeros");
  const output = card.querySelector(".tool-output");

  card.querySelector(".mdc-calcular").addEventListener("click", () => {
    const nums = input.value.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !Number.isNaN(n) && n > 0);
    if (nums.length < 2) {
      output.value = "Digite pelo menos 2 números separados por vírgula.";
      return;
    }
    output.value = `MDC: ${nums.reduce(gcdTwo)}\nMMC: ${nums.reduce(lcmTwo)}`;
  });
}

/* ---------- Porcentagem ---------- */
function initPorcentagemCard(card) {
  if (!card) return;
  const x = card.querySelector(".pct-x");
  const y = card.querySelector(".pct-y");
  const a = card.querySelector(".pct-a");
  const b = card.querySelector(".pct-b");
  const output = card.querySelector(".tool-output");

  card.querySelector(".pct-calcular1").addEventListener("click", () => {
    const xv = parseFloat(x.value);
    const yv = parseFloat(y.value);
    if (Number.isNaN(xv) || Number.isNaN(yv)) {
      output.value = "Preencha os dois campos.";
      return;
    }
    output.value = `${xv}% de ${yv} = ${((xv / 100) * yv).toLocaleString("pt-BR", { maximumFractionDigits: 4 })}`;
  });

  card.querySelector(".pct-calcular2").addEventListener("click", () => {
    const av = parseFloat(a.value);
    const bv = parseFloat(b.value);
    if (Number.isNaN(av) || Number.isNaN(bv) || bv === 0) {
      output.value = "Preencha os dois campos (o segundo não pode ser 0).";
      return;
    }
    output.value = `${av} é ${((av / bv) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 4 })}% de ${bv}`;
  });
}

/* ---------- Regra de Três Simples ---------- */
function initRegraTresCard(card) {
  if (!card) return;
  const a = card.querySelector(".rt-a");
  const b = card.querySelector(".rt-b");
  const c = card.querySelector(".rt-c");
  const output = card.querySelector(".tool-output");

  card.querySelector(".rt-calcular").addEventListener("click", () => {
    const av = parseFloat(a.value);
    const bv = parseFloat(b.value);
    const cv = parseFloat(c.value);
    if ([av, bv, cv].some(Number.isNaN) || av === 0) {
      output.value = "Preencha os três campos (A não pode ser 0).";
      return;
    }
    const x = (bv * cv) / av;
    output.value = `X = ${x.toLocaleString("pt-BR", { maximumFractionDigits: 4 })}`;
  });
}

/* ---------- Resto da Divisão ---------- */
function initRestoDivisaoCard(card) {
  if (!card) return;
  const dividendo = card.querySelector(".rd-dividendo");
  const divisor = card.querySelector(".rd-divisor");
  const output = card.querySelector(".tool-output");

  card.querySelector(".rd-calcular").addEventListener("click", () => {
    const d = parseInt(dividendo.value, 10);
    const v = parseInt(divisor.value, 10);
    if (Number.isNaN(d) || Number.isNaN(v) || v === 0) {
      output.value = "Preencha os dois campos (divisor não pode ser 0).";
      return;
    }
    output.value = `Quociente: ${Math.trunc(d / v)}\nResto: ${d % v}`;
  });
}

/* ---------- Calculadora de Área ---------- */
const AREA_SHAPES = {
  circulo: { fields: [{ key: "r", label: "Raio" }], calc: ({ r }) => Math.PI * r * r },
  quadrado: { fields: [{ key: "l", label: "Lado" }], calc: ({ l }) => l * l },
  retangulo: {
    fields: [{ key: "b", label: "Base" }, { key: "h", label: "Altura" }],
    calc: ({ b, h }) => b * h,
  },
  triangulo: {
    fields: [{ key: "a", label: "Lado A" }, { key: "b", label: "Lado B" }, { key: "c", label: "Lado C" }],
    calc: ({ a, b, c }) => {
      const s = (a + b + c) / 2;
      return Math.sqrt(s * (s - a) * (s - b) * (s - c));
    },
  },
  pentagono: {
    fields: [{ key: "l", label: "Lado" }],
    calc: ({ l }) => (1 / 4) * Math.sqrt(5 * (5 + 2 * Math.sqrt(5))) * l * l,
  },
  hexagono: { fields: [{ key: "l", label: "Lado" }], calc: ({ l }) => ((3 * Math.sqrt(3)) / 2) * l * l },
  poligono: {
    fields: [{ key: "n", label: "Nº de lados" }, { key: "l", label: "Lado" }],
    calc: ({ n, l }) => (n * l * l) / (4 * Math.tan(Math.PI / n)),
  },
  trapezio: {
    fields: [{ key: "B", label: "Base maior" }, { key: "b", label: "Base menor" }, { key: "h", label: "Altura" }],
    calc: ({ B, b, h }) => ((B + b) * h) / 2,
  },
  paralelogramo: {
    fields: [{ key: "b", label: "Base" }, { key: "h", label: "Altura" }],
    calc: ({ b, h }) => b * h,
  },
  elipse: {
    fields: [{ key: "a", label: "Semieixo maior" }, { key: "b", label: "Semieixo menor" }],
    calc: ({ a, b }) => Math.PI * a * b,
  },
  coroa: {
    fields: [{ key: "R", label: "Raio maior" }, { key: "r", label: "Raio menor" }],
    calc: ({ R, r }) => Math.PI * (R * R - r * r),
  },
  setor: {
    fields: [{ key: "r", label: "Raio" }, { key: "angulo", label: "Ângulo (graus)" }],
    calc: ({ r, angulo }) => (angulo / 360) * Math.PI * r * r,
  },
};

function renderAreaFields(card) {
  const forma = card.querySelector(".area-forma").value;
  const container = card.querySelector(".area-campos");
  container.innerHTML = "";
  AREA_SHAPES[forma].fields.forEach(({ key, label }) => {
    const wrapper = document.createElement("label");
    wrapper.className = "tool-field";
    wrapper.append(label);
    const input = document.createElement("input");
    input.type = "number";
    input.step = "any";
    input.min = "0";
    input.className = "area-param";
    input.dataset.param = key;
    wrapper.appendChild(input);
    container.appendChild(wrapper);
  });
}

function initAreaCard(card) {
  if (!card) return;
  const formaSelect = card.querySelector(".area-forma");
  const output = card.querySelector(".tool-output");

  renderAreaFields(card);
  formaSelect.addEventListener("change", () => renderAreaFields(card));

  card.querySelector(".area-calcular").addEventListener("click", () => {
    const config = AREA_SHAPES[formaSelect.value];
    const params = {};
    let valid = true;
    card.querySelectorAll(".area-param").forEach((input) => {
      const value = parseFloat(input.value);
      if (Number.isNaN(value) || value <= 0) valid = false;
      params[input.dataset.param] = value;
    });
    if (!valid) {
      output.value = "Preencha todos os campos com valores positivos.";
      return;
    }
    output.value = `Área: ${config.calc(params).toLocaleString("pt-BR", { maximumFractionDigits: 4 })}`;
  });
}

/* ---------- Data e Hora ---------- */
function initDiasEntreDatasCard(card) {
  if (!card) return;
  const inicio = card.querySelector(".dias-inicio");
  const fim = card.querySelector(".dias-fim");
  const output = card.querySelector(".tool-output");

  card.querySelector(".dias-calcular").addEventListener("click", () => {
    if (!inicio.value || !fim.value) {
      output.value = "Preencha as duas datas.";
      return;
    }
    const d1 = new Date(`${inicio.value}T00:00:00`);
    const d2 = new Date(`${fim.value}T00:00:00`);
    const dias = Math.round((d2 - d1) / 86400000);
    output.value = `${Math.abs(dias)} dia(s)`;
  });
}

function initSomarDiasCard(card) {
  if (!card) return;
  const data = card.querySelector(".somar-data");
  const dias = card.querySelector(".somar-dias-valor");
  const output = card.querySelector(".tool-output");

  card.querySelector(".somar-calcular").addEventListener("click", () => {
    if (!data.value || dias.value === "") {
      output.value = "Preencha a data e a quantidade de dias.";
      return;
    }
    const d = new Date(`${data.value}T00:00:00`);
    d.setDate(d.getDate() + parseInt(dias.value, 10));
    output.value = d.toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  });
}

/* ---------- Dados Fake ---------- */
const PERFIL_NOMES_F = ["Ana", "Beatriz", "Camila", "Daniela", "Fernanda", "Gabriela", "Juliana", "Larissa", "Mariana", "Patrícia", "Rafaela", "Tatiane"];
const PERFIL_NOMES_M = ["André", "Bruno", "Carlos", "Diego", "Eduardo", "Felipe", "Gustavo", "Henrique", "Lucas", "Marcelo", "Rafael", "Thiago"];
const PERFIL_SOBRENOMES = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Almeida", "Costa", "Pereira", "Carvalho", "Gomes", "Martins"];

function generatePerfil(genero) {
  const gen = genero === "aleatorio" ? (Math.random() < 0.5 ? "f" : "m") : genero;
  const nomes = gen === "f" ? PERFIL_NOMES_F : PERFIL_NOMES_M;
  const nome = nomes[Math.floor(Math.random() * nomes.length)];
  const sobrenome1 = PERFIL_SOBRENOMES[Math.floor(Math.random() * PERFIL_SOBRENOMES.length)];
  const sobrenome2 = PERFIL_SOBRENOMES[Math.floor(Math.random() * PERFIL_SOBRENOMES.length)];
  const usuario = `${slugify(nome)}.${slugify(sobrenome1)}${Math.floor(Math.random() * 100)}`;
  const dominios = ["exemplo.com", "teste.dev", "fakemail.com"];
  const email = `${usuario}@${dominios[Math.floor(Math.random() * dominios.length)]}`;
  const ddd = 11 + Math.floor(Math.random() * 89);
  const telefone = `(${ddd}) 9${randomDigits(4).join("")}-${randomDigits(4).join("")}`;
  const idade = 18 + Math.floor(Math.random() * 60);
  const nascAno = new Date().getFullYear() - idade;
  const nascMes = String(1 + Math.floor(Math.random() * 12)).padStart(2, "0");
  const nascDia = String(1 + Math.floor(Math.random() * 28)).padStart(2, "0");

  return [
    `Nome: ${nome} ${sobrenome1} ${sobrenome2}`,
    `Usuário: ${usuario}`,
    `E-mail: ${email}`,
    `Telefone: ${telefone}`,
    `Nascimento: ${nascDia}/${nascMes}/${nascAno} (${idade} anos)`,
  ].join("\n");
}

function initPerfilCard(card) {
  if (!card) return;
  const genero = card.querySelector(".perfil-genero");
  const output = card.querySelector(".tool-output");

  card.querySelector(".perfil-gerar").addEventListener("click", () => {
    output.value = generatePerfil(genero.value);
  });
}

const EMPRESA_PREFIXOS = ["Alpha", "Nexus", "Prime", "Vertex", "Nova", "Union", "Global", "Meridian", "Órbita", "Zenith"];
const EMPRESA_SUFIXOS = ["Tecnologia", "Comércio", "Serviços", "Soluções", "Sistemas", "Indústria", "Consultoria", "Logística"];

function generateEmpresa() {
  const prefixo = EMPRESA_PREFIXOS[Math.floor(Math.random() * EMPRESA_PREFIXOS.length)];
  const sufixo = EMPRESA_SUFIXOS[Math.floor(Math.random() * EMPRESA_SUFIXOS.length)];
  const nomeFantasia = `${prefixo} ${sufixo}`;
  const dominio = `${slugify(prefixo)}${slugify(sufixo)}.com.br`;

  return [
    `Razão social: ${nomeFantasia} Ltda`,
    `Nome fantasia: ${nomeFantasia}`,
    `CNPJ: ${generateCNPJ(true)}`,
    `E-mail: contato@${dominio}`,
    `Site: https://www.${dominio}`,
  ].join("\n");
}

function initEmpresaCard(card) {
  if (!card) return;
  const output = card.querySelector(".tool-output");

  card.querySelector(".empresa-gerar").addEventListener("click", () => {
    output.value = generateEmpresa();
  });
}

function initSorteioCard(card) {
  if (!card) return;
  const min = card.querySelector(".sorteio-min");
  const max = card.querySelector(".sorteio-max");
  const qtd = card.querySelector(".sorteio-qtd");
  const repetir = card.querySelector(".sorteio-repetir");
  const output = card.querySelector(".tool-output");

  card.querySelector(".sorteio-gerar").addEventListener("click", () => {
    const minV = parseInt(min.value, 10);
    const maxV = parseInt(max.value, 10);
    const qtdV = parseInt(qtd.value, 10);
    if (Number.isNaN(minV) || Number.isNaN(maxV) || Number.isNaN(qtdV) || minV >= maxV || qtdV < 1) {
      output.value = "Verifique os valores (mínimo menor que máximo, quantidade positiva).";
      return;
    }
    const range = maxV - minV + 1;
    if (!repetir.checked && qtdV > range) {
      output.value = `Não é possível sortear ${qtdV} números únicos entre ${minV} e ${maxV}.`;
      return;
    }

    const resultado = [];
    if (repetir.checked) {
      for (let i = 0; i < qtdV; i++) resultado.push(minV + Math.floor(Math.random() * range));
    } else {
      const pool = Array.from({ length: range }, (_, i) => minV + i);
      for (let i = 0; i < qtdV; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        resultado.push(pool.splice(idx, 1)[0]);
      }
      resultado.sort((a, b) => a - b);
    }
    output.value = resultado.join(", ");
  });
}

/* ---------- Helpers ---------- */
function randomDigits(length) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10));
}

function randomLetters(length) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function showToast(message) {
  let toast = document.querySelector(".egg-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "egg-toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("is-visible");

  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("is-visible"), 1600);
}
