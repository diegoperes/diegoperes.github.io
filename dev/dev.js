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

  initSlugCard(document.querySelector('[data-tool="slug"]'));
  initBase64Card(document.querySelector('[data-tool="base64"]'));
  initJwtCard(document.querySelector('[data-tool="jwt"]'));
  initJsonCard(document.querySelector('[data-tool="json"]'));
  initHashCard(document.querySelector('[data-tool="hash"]'));
  initTimestampCard(document.querySelector('[data-tool="timestamp"]'));
  initLoremCard(document.querySelector('[data-tool="lorem"]'));
});

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

/* ---------- Base64 ---------- */
function initBase64Card(card) {
  if (!card) return;
  const input = card.querySelector(".tool-input");
  const output = card.querySelector(".tool-output");

  card.querySelector(".base64-encode").addEventListener("click", () => {
    try {
      output.value = toBase64(input.value);
    } catch (err) {
      output.value = `Erro ao codificar: ${err.message}`;
    }
  });

  card.querySelector(".base64-decode").addEventListener("click", () => {
    try {
      output.value = fromBase64(input.value.trim());
    } catch {
      output.value = "Base64 inválido.";
    }
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

/* ---------- Hash (MD5 / SHA-256) ---------- */
function initHashCard(card) {
  if (!card) return;
  const input = card.querySelector(".tool-input");
  const algo = card.querySelector(".hash-algo");
  const output = card.querySelector(".tool-output");

  card.querySelector(".hash-generate").addEventListener("click", async () => {
    output.value = algo.value === "MD5" ? md5(input.value) : await sha256(input.value);
  });
}

async function sha256(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
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
