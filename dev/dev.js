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

  initQrWifiCard(document.querySelector('[data-tool="qr-wifi"]'));
  initQrPixCard(document.querySelector('[data-tool="qr-pix"]'));
  initBarcodeCard(document.querySelector('[data-tool="codigo-barras"]'));
  initBinarioCard(document.querySelector('[data-tool="binario-texto"]'));
  initMorseCard(document.querySelector('[data-tool="morse"]'));
  initSimbolosCard(document.querySelector('[data-tool="simbolos"]'));
  initWhatsappCard(document.querySelector('[data-tool="whatsapp-link"]'));
  initFlipCard(document.querySelector('[data-tool="texto-invertido"]'));
  initStackCard(document.querySelector('[data-tool="letras-empilhadas"]'));
  initPrefixoSufixoCard(document.querySelector('[data-tool="prefixo-sufixo"]'));
  initCompareCard(document.querySelector('[data-tool="comparar-textos"]'));
  initUnidadesCard(document.querySelector('[data-tool="unidades"]'));
  initFracaoCard(document.querySelector('[data-tool="fracao"]'));
  initFeriadosCard(document.querySelector('[data-tool="feriados"]'));
  initDiasUteisCard(document.querySelector('[data-tool="dias-uteis"]'));
  initCalcularIdadeCard(document.querySelector('[data-tool="calcular-idade"]'));
  initSignoCard(document.querySelector('[data-tool="signo"]'));
  initFaseLuaCard(document.querySelector('[data-tool="fase-lua"]'));
  initCronometroCard(document.querySelector('[data-tool="cronometro"]'));
  initPomodoroCard(document.querySelector('[data-tool="pomodoro"]'));
  initPoupancaCard(document.querySelector('[data-tool="poupanca"]'));
  initFinanciamentoCard(document.querySelector('[data-tool="financiamento"]'));
  initMoedaCard(document.querySelector('[data-tool="moeda"]'));
  initSalarioMinimoCard(document.querySelector('[data-tool="salario-minimo"]'));
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
    cep: () => generateCEP(),
    "conta-bancaria": () => generateContaBancaria(),
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
  let hasRendered = false;

  function render() {
    const text = input.value.trim();
    if (!text) {
      showToast("Digite um texto primeiro.");
      return false;
    }
    try {
      renderQrToCanvas(canvas, text);
    } catch (err) {
      showToast(err.message);
      return false;
    }
    hasRendered = true;
    return true;
  }

  card.querySelector(".qr-generate").addEventListener("click", render);

  card.querySelector(".qr-download").addEventListener("click", () => {
    if (!hasRendered && !render()) return;
    downloadCanvas(canvas, "qrcode.png");
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

/* ---------- CEP e Conta Bancária (fictícios) ---------- */
function generateCEP() {
  const digits = randomDigits(8).join("");
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function generateContaBancaria() {
  const bancos = [
    { codigo: "001", nome: "Banco do Brasil" },
    { codigo: "104", nome: "Caixa Econômica" },
    { codigo: "237", nome: "Bradesco" },
    { codigo: "341", nome: "Itaú" },
    { codigo: "033", nome: "Santander" },
    { codigo: "260", nome: "Nubank" },
  ];
  const banco = bancos[Math.floor(Math.random() * bancos.length)];
  const agencia = randomDigits(4).join("");
  const contaBase = randomDigits(7);
  const pesos = [2, 3, 4, 5, 6, 7, 8];
  const soma = contaBase.reduce((acc, d, i) => acc + d * pesos[i], 0);
  const dv = soma % 11;
  return `${banco.codigo} (${banco.nome}) | Ag: ${agencia} | Conta: ${contaBase.join("")}-${dv}`;
}

/* ---------- QR Code: helper compartilhado de renderização/download ---------- */
function renderQrToCanvas(canvas, text) {
  const ctx = canvas.getContext("2d");
  const matrix = generateQR(text);
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
}

function downloadCanvas(canvas, filename) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

/* ---------- QR Wi-Fi ---------- */
function wifiEscape(text) {
  return text.replace(/([\\;,":])/g, "\\$1");
}

function buildWifiPayload(ssid, password, security) {
  if (security === "nopass") return `WIFI:T:nopass;S:${wifiEscape(ssid)};H:false;;`;
  return `WIFI:T:${security};S:${wifiEscape(ssid)};P:${wifiEscape(password)};H:false;;`;
}

function initQrWifiCard(card) {
  if (!card) return;
  const ssid = card.querySelector(".wifi-ssid");
  const senha = card.querySelector(".wifi-senha");
  const seguranca = card.querySelector(".wifi-seguranca");
  const canvas = card.querySelector(".qr-canvas");
  let hasRendered = false;

  function render() {
    if (!ssid.value.trim()) {
      showToast("Digite o nome da rede.");
      return false;
    }
    renderQrToCanvas(canvas, buildWifiPayload(ssid.value.trim(), senha.value, seguranca.value));
    hasRendered = true;
    return true;
  }

  card.querySelector(".wifi-generate").addEventListener("click", render);
  card.querySelector(".wifi-download").addEventListener("click", () => {
    if (!hasRendered && !render()) return;
    downloadCanvas(canvas, "qrcode-wifi.png");
  });
}

/* ---------- QR Pix (BR Code / EMV) ---------- */
function crc16ccitt(text) {
  let crc = 0xffff;
  for (let i = 0; i < text.length; i++) {
    crc ^= text.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function emvField(id, value) {
  const len = String(value.length).padStart(2, "0");
  return `${id}${len}${value}`;
}

function buildPixPayload({ chave, nome, cidade, valor, txid }) {
  const merchantAccount = emvField("00", "br.gov.bcb.pix") + emvField("01", chave);
  let payload =
    emvField("00", "01") +
    emvField("26", merchantAccount) +
    emvField("52", "0000") +
    emvField("53", "986") +
    (valor ? emvField("54", Number(valor).toFixed(2)) : "") +
    emvField("58", "BR") +
    emvField("59", (nome || "RECEBEDOR").slice(0, 25).toUpperCase()) +
    emvField("60", (cidade || "CIDADE").slice(0, 15).toUpperCase()) +
    emvField("62", emvField("05", txid || "***"));
  payload += "6304";
  return payload + crc16ccitt(payload);
}

function initQrPixCard(card) {
  if (!card) return;
  const chave = card.querySelector(".pix-chave");
  const valor = card.querySelector(".pix-valor");
  const nome = card.querySelector(".pix-nome");
  const cidade = card.querySelector(".pix-cidade");
  const canvas = card.querySelector(".qr-canvas");
  let hasRendered = false;

  function render() {
    if (!chave.value.trim()) {
      showToast("Digite a chave Pix.");
      return false;
    }
    const payload = buildPixPayload({
      chave: chave.value.trim(),
      nome: nome.value.trim(),
      cidade: cidade.value.trim(),
      valor: valor.value,
    });
    renderQrToCanvas(canvas, payload);
    hasRendered = true;
    return true;
  }

  card.querySelector(".pix-generate").addEventListener("click", render);
  card.querySelector(".pix-download").addEventListener("click", () => {
    if (!hasRendered && !render()) return;
    downloadCanvas(canvas, "qrcode-pix.png");
  });
}

/* ---------- Código de Barras (Code 128, conjunto B) ---------- */
const CODE128B_CHARS = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
const CODE128_PATTERNS = [
  "11011001100", "11001101100", "11001100110", "10010011000", "10010001100", "10001001100", "10011001000", "10011000100", "10001100100", "11001001000",
  "11001000100", "11000100100", "10110011100", "10011011100", "10011001110", "10111001100", "10011101100", "10011100110", "11001110010", "11001011100",
  "11001001110", "11011100100", "11001110100", "11101101110", "11101001100", "11100101100", "11100100110", "11101100100", "11100110100", "11100110010",
  "11011011000", "11011000110", "11000110110", "10100011000", "10001011000", "10001000110", "10110001000", "10001101000", "10001100010", "11010001000",
  "11000101000", "11000100010", "10110111000", "10110001110", "10001101110", "10111011000", "10111000110", "10001110110", "11101110110", "11010001110",
  "11000101110", "11011101000", "11011100010", "11011101110", "11101011000", "11101000110", "11100010110", "11101101000", "11101100010", "11100011010",
  "11101111010", "11001000010", "11110001010", "10100110000", "10100001100", "10010110000", "10010000110", "10000101100", "10000100110", "10110010000",
  "10110000100", "10011010000", "10011000010", "10000110100", "10000110010", "11000010010", "11001010000", "11110111010", "11000010100", "10001111010",
  "10100111100", "10010111100", "10010011110", "10111100100", "10011110100", "10011110010", "11110100100", "11110010100", "11110010010", "11011011110",
  "11011110110", "11110110110", "10101111000", "10100011110", "10001011110", "10111101000", "10111100010", "11110101000", "11110100010", "10111011110",
  "10111101110", "11101011110", "11110101110", "11010000100", "11010010000", "11010011100", "1100011101011",
];

function code128bEncode(text) {
  const values = [104];
  for (const ch of text) {
    const idx = CODE128B_CHARS.indexOf(ch);
    if (idx === -1) throw new Error(`Caractere não suportado: "${ch}"`);
    values.push(idx);
  }
  let checksum = values[0];
  for (let i = 1; i < values.length; i++) checksum += values[i] * i;
  values.push(checksum % 103);
  values.push(106);
  return values.map((v) => CODE128_PATTERNS[v]).join("");
}

function initBarcodeCard(card) {
  if (!card) return;
  const input = card.querySelector(".barcode-input");
  const canvas = card.querySelector(".barcode-canvas");
  const ctx = canvas.getContext("2d");
  let hasRendered = false;

  function render() {
    const text = input.value.trim();
    if (!text) {
      showToast("Digite um texto primeiro.");
      return false;
    }
    let pattern;
    try {
      pattern = code128bEncode(text);
    } catch (err) {
      showToast(err.message);
      return false;
    }
    const scale = 3;
    const quiet = 20;
    const height = 120;
    const width = pattern.length * scale + quiet * 2;
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#000000";
    let x = quiet;
    for (const bit of pattern) {
      if (bit === "1") ctx.fillRect(x, 10, scale, height - 30);
      x += scale;
    }
    ctx.font = "14px monospace";
    ctx.textAlign = "center";
    ctx.fillText(text, width / 2, height - 8);
    hasRendered = true;
    return true;
  }

  card.querySelector(".barcode-generate").addEventListener("click", render);
  card.querySelector(".barcode-download").addEventListener("click", () => {
    if (!hasRendered && !render()) return;
    downloadCanvas(canvas, "barcode.png");
  });
}

/* ---------- Texto em Binário ---------- */
function textToBinary(text) {
  const bytes = new TextEncoder().encode(text);
  return Array.from(bytes, (b) => b.toString(2).padStart(8, "0")).join(" ");
}

function binaryToText(binary) {
  const bytes = binary.trim().split(/\s+/).map((b) => parseInt(b, 2));
  if (bytes.some(Number.isNaN)) throw new Error("Binário inválido");
  return new TextDecoder().decode(Uint8Array.from(bytes));
}

function initBinarioCard(card) {
  if (!card) return;
  const input = card.querySelector(".tool-input");
  const output = card.querySelector(".tool-output");

  card.querySelector(".bin-encode").addEventListener("click", () => {
    output.value = textToBinary(input.value);
  });

  card.querySelector(".bin-decode").addEventListener("click", () => {
    try {
      output.value = binaryToText(input.value);
    } catch (err) {
      output.value = err.message;
    }
  });
}

/* ---------- Código Morse ---------- */
const MORSE_MAP = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....", I: "..", J: ".---",
  K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-",
  U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
  0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-", 5: ".....", 6: "-....", 7: "--...", 8: "---..", 9: "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "!": "-.-.--", "/": "-..-.", "(": "-.--.", ")": "-.--.-",
  "&": ".-...", ":": "---...", ";": "-.-.-.", "=": "-...-", "+": ".-.-.", "-": "-....-", _: "..--.-", '"': ".-..-.",
  $: "...-..-", "@": ".--.-.",
};
const MORSE_MAP_REVERSE = Object.fromEntries(Object.entries(MORSE_MAP).map(([k, v]) => [v, k]));

function textToMorse(text) {
  return text.toUpperCase().split(" ").map((word) =>
    Array.from(word).map((ch) => MORSE_MAP[ch] ?? "").filter(Boolean).join(" ")
  ).join(" / ");
}

function morseToText(morse) {
  return morse.trim().split(" / ").map((word) =>
    word.trim().split(/\s+/).map((code) => MORSE_MAP_REVERSE[code] ?? "").join("")
  ).join(" ");
}

function initMorseCard(card) {
  if (!card) return;
  const input = card.querySelector(".tool-input");
  const output = card.querySelector(".tool-output");

  card.querySelector(".morse-encode").addEventListener("click", () => {
    output.value = textToMorse(input.value);
  });

  card.querySelector(".morse-decode").addEventListener("click", () => {
    output.value = morseToText(input.value);
  });
}

/* ---------- Símbolos e Emojis ---------- */
const SIMBOLOS_LISTA = [
  "😀", "😂", "😍", "🤔", "😎", "😢", "😡", "👍", "👎", "🙏",
  "🔥", "✨", "🎉", "❤️", "💡", "⭐", "✅", "❌", "⚠️", "📌",
  "→", "←", "↑", "↓", "•", "★", "☆", "©", "®", "™",
  "§", "¶", "±", "≈", "≠", "≤", "≥", "∞", "√", "π",
  "€", "£", "¥", "¢", "°", "…", "–", "—", "«", "»",
];

function initSimbolosCard(card) {
  if (!card) return;
  const grid = card.querySelector(".simbolos-grid");
  SIMBOLOS_LISTA.forEach((simbolo) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "simbolo-item";
    btn.textContent = simbolo;
    btn.addEventListener("click", () => {
      copyToClipboard(simbolo);
      showToast("Copiado!");
    });
    grid.appendChild(btn);
  });
}

/* ---------- Link do WhatsApp ---------- */
function initWhatsappCard(card) {
  if (!card) return;
  const telefone = card.querySelector(".wa-telefone");
  const mensagem = card.querySelector(".wa-mensagem");
  const output = card.querySelector(".tool-output");

  card.querySelector(".wa-generate").addEventListener("click", () => {
    const numero = telefone.value.replace(/\D/g, "");
    if (!numero) {
      output.value = "Digite um telefone válido (com DDI e DDD).";
      return;
    }
    const texto = mensagem.value ? `?text=${encodeURIComponent(mensagem.value)}` : "";
    output.value = `https://wa.me/${numero}${texto}`;
  });
}

/* ---------- Texto de Cabeça pra Baixo ---------- */
const FLIP_MAP = {
  a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ", i: "ᴉ", j: "ɾ", k: "ʞ", l: "l", m: "ɯ",
  n: "u", o: "o", p: "d", q: "b", r: "ɹ", s: "s", t: "ʇ", u: "n", v: "ʌ", w: "ʍ", x: "x", y: "ʎ", z: "z",
  A: "Ɐ", B: "𐐒", C: "Ɔ", D: "D", E: "Ǝ", F: "Ⅎ", G: "⅁", H: "H", I: "I", J: "ſ", K: "ʞ", L: "˥", M: "W",
  N: "N", O: "O", P: "Ԁ", Q: "Ό", R: "ᴚ", S: "S", T: "⊥", U: "∩", V: "Λ", W: "M", X: "X", Y: "⅄", Z: "Z",
  0: "0", 1: "Ɩ", 2: "ᄅ", 3: "Ɛ", 4: "ㄣ", 5: "ϛ", 6: "9", 7: "ㄥ", 8: "8", 9: "6",
  ".": "˙", ",": "'", "'": ",", '"': ",,", "?": "¿", "!": "¡", "(": ")", ")": "(",
  "[": "]", "]": "[", "{": "}", "}": "{", "<": ">", ">": "<", "&": "⅋", _: "‾", ";": "؛",
};

function upsideDown(text) {
  return Array.from(text).reverse().map((ch) => FLIP_MAP[ch] ?? ch).join("");
}

function initFlipCard(card) {
  if (!card) return;
  const input = card.querySelector(".tool-input");
  const output = card.querySelector(".tool-output");

  card.querySelector(".flip-generate").addEventListener("click", () => {
    output.value = upsideDown(input.value);
  });
}

/* ---------- Letras Empilhadas ---------- */
function initStackCard(card) {
  if (!card) return;
  const input = card.querySelector(".tool-input");
  const output = card.querySelector(".tool-output");

  card.querySelector(".stack-generate").addEventListener("click", () => {
    output.value = Array.from(input.value).join("\n");
  });
}

/* ---------- Prefixo e Sufixo ---------- */
function initPrefixoSufixoCard(card) {
  if (!card) return;
  const input = card.querySelector(".tool-input");
  const prefixo = card.querySelector(".ps-prefixo");
  const sufixo = card.querySelector(".ps-sufixo");
  const output = card.querySelector(".tool-output");

  card.querySelector(".ps-generate").addEventListener("click", () => {
    const lines = input.value.split("\n");
    output.value = lines.map((line) => `${prefixo.value}${line}${sufixo.value}`).join("\n");
  });
}

/* ---------- Comparar Textos (diff por linha, LCS) ---------- */
function lineDiff(textA, textB) {
  const linesA = textA.split("\n");
  const linesB = textB.split("\n");
  const n = linesA.length;
  const m = linesB.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = linesA[i] === linesB[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const result = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (linesA[i] === linesB[j]) {
      result.push(`  ${linesA[i]}`);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      result.push(`- ${linesA[i]}`);
      i++;
    } else {
      result.push(`+ ${linesB[j]}`);
      j++;
    }
  }
  while (i < n) {
    result.push(`- ${linesA[i]}`);
    i++;
  }
  while (j < m) {
    result.push(`+ ${linesB[j]}`);
    j++;
  }
  return result.join("\n");
}

function initCompareCard(card) {
  if (!card) return;
  const a = card.querySelector(".compare-a");
  const b = card.querySelector(".compare-b");
  const output = card.querySelector(".tool-output");

  card.querySelector(".compare-generate").addEventListener("click", () => {
    output.value = lineDiff(a.value, b.value);
  });
}

/* ---------- Conversor de Unidades ---------- */
const UNIT_CATEGORIES = {
  comprimento: { label: "Comprimento", units: { mm: "mm", cm: "cm", m: "m", km: "km", pol: "pol", pe: "pé", milha: "milha" }, factors: { mm: 0.001, cm: 0.01, m: 1, km: 1000, pol: 0.0254, pe: 0.3048, milha: 1609.344 } },
  peso: { label: "Peso", units: { mg: "mg", g: "g", kg: "kg", ton: "tonelada", lb: "libra", oz: "onça" }, factors: { mg: 0.000001, g: 0.001, kg: 1, ton: 1000, lb: 0.45359237, oz: 0.0283495 } },
  volume: { label: "Volume", units: { ml: "ml", l: "litro", m3: "m³", galao: "galão (US)" }, factors: { ml: 0.001, l: 1, m3: 1000, galao: 3.785411784 } },
  temperatura: { label: "Temperatura", units: { c: "Celsius", f: "Fahrenheit", k: "Kelvin" } },
};

function convertTemperature(value, from, to) {
  let celsius;
  if (from === "c") celsius = value;
  else if (from === "f") celsius = ((value - 32) * 5) / 9;
  else celsius = value - 273.15;

  if (to === "c") return celsius;
  if (to === "f") return (celsius * 9) / 5 + 32;
  return celsius + 273.15;
}

function convertUnit(category, value, from, to) {
  if (category === "temperatura") return convertTemperature(value, from, to);
  const { factors } = UNIT_CATEGORIES[category];
  return (value * factors[from]) / factors[to];
}

function populateUnitSelects(card) {
  const categoria = card.querySelector(".unidade-categoria").value;
  const de = card.querySelector(".unidade-de");
  const para = card.querySelector(".unidade-para");
  const { units } = UNIT_CATEGORIES[categoria];
  const options = Object.entries(units).map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
  de.innerHTML = options;
  para.innerHTML = options;
  if (para.options.length > 1) para.selectedIndex = 1;
}

function initUnidadesCard(card) {
  if (!card) return;
  const categoria = card.querySelector(".unidade-categoria");
  const valor = card.querySelector(".unidade-valor");
  const de = card.querySelector(".unidade-de");
  const para = card.querySelector(".unidade-para");
  const output = card.querySelector(".tool-output");

  populateUnitSelects(card);
  categoria.addEventListener("change", () => populateUnitSelects(card));

  card.querySelector(".unidade-converter").addEventListener("click", () => {
    const value = parseFloat(valor.value);
    if (Number.isNaN(value)) {
      output.value = "Digite um valor válido.";
      return;
    }
    const result = convertUnit(categoria.value, value, de.value, para.value);
    output.value = `${value} ${de.value} = ${result.toLocaleString("pt-BR", { maximumFractionDigits: 6 })} ${para.value}`;
  });
}

/* ---------- Calculadora de Fração ---------- */
function fractionGcd(a, b) {
  return b === 0 ? a : fractionGcd(b, a % b);
}

function simplifyFraction(num, den) {
  if (den < 0) {
    num = -num;
    den = -den;
  }
  const g = fractionGcd(Math.abs(num), Math.abs(den)) || 1;
  return [num / g, den / g];
}

function fractionOperation(a, b, c, d, op) {
  let num;
  let den;
  if (op === "+") { num = a * d + c * b; den = b * d; }
  else if (op === "-") { num = a * d - c * b; den = b * d; }
  else if (op === "*") { num = a * c; den = b * d; }
  else { num = a * d; den = b * c; }
  return simplifyFraction(num, den);
}

function initFracaoCard(card) {
  if (!card) return;
  const aNum = card.querySelector(".frac-a-num");
  const aDen = card.querySelector(".frac-a-den");
  const op = card.querySelector(".frac-op");
  const bNum = card.querySelector(".frac-b-num");
  const bDen = card.querySelector(".frac-b-den");
  const output = card.querySelector(".tool-output");

  card.querySelector(".frac-calcular").addEventListener("click", () => {
    const a = parseInt(aNum.value, 10);
    const b = parseInt(aDen.value, 10);
    const c = parseInt(bNum.value, 10);
    const d = parseInt(bDen.value, 10);
    if ([a, b, c, d].some(Number.isNaN) || b === 0 || d === 0) {
      output.value = "Preencha todos os campos (denominadores não podem ser 0).";
      return;
    }
    const [num, den] = fractionOperation(a, b, c, d, op.value);
    output.value = `${num}/${den}${den !== 0 ? ` (≈ ${(num / den).toLocaleString("pt-BR", { maximumFractionDigits: 4 })})` : ""}`;
  });
}

/* ---------- Feriados Nacionais (fixos + Páscoa via Computus) ---------- */
function easterDate(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function addDaysToDate(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function nationalHolidays(year) {
  const easter = easterDate(year);
  const fixos = [
    [0, 1, "Confraternização Universal"],
    [3, 21, "Tiradentes"],
    [4, 1, "Dia do Trabalho"],
    [8, 7, "Independência do Brasil"],
    [9, 12, "Nossa Senhora Aparecida"],
    [10, 2, "Finados"],
    [10, 15, "Proclamação da República"],
    [11, 25, "Natal"],
  ].map(([month, day, nome]) => ({ date: new Date(year, month, day), nome }));

  const moveis = [
    { date: addDaysToDate(easter, -47), nome: "Carnaval" },
    { date: addDaysToDate(easter, -2), nome: "Sexta-feira Santa" },
    { date: easter, nome: "Páscoa" },
    { date: addDaysToDate(easter, 60), nome: "Corpus Christi" },
  ];

  return [...fixos, ...moveis].sort((x, y) => x.date - y.date);
}

function initFeriadosCard(card) {
  if (!card) return;
  const ano = card.querySelector(".feriados-ano");
  const output = card.querySelector(".tool-output");

  card.querySelector(".feriados-listar").addEventListener("click", () => {
    const year = parseInt(ano.value, 10) || new Date().getFullYear();
    const holidays = nationalHolidays(year);
    output.value = holidays.map((h) => `${h.date.toLocaleDateString("pt-BR")} — ${h.nome}`).join("\n");
  });
}

/* ---------- Dias Úteis ---------- */
function initDiasUteisCard(card) {
  if (!card) return;
  const inicio = card.querySelector(".du-inicio");
  const fim = card.querySelector(".du-fim");
  const output = card.querySelector(".tool-output");

  card.querySelector(".du-calcular").addEventListener("click", () => {
    if (!inicio.value || !fim.value) {
      output.value = "Preencha as duas datas.";
      return;
    }
    let d1 = new Date(`${inicio.value}T00:00:00`);
    const d2 = new Date(`${fim.value}T00:00:00`);
    if (d1 > d2) [d1, d2] = [d2, d1];

    let count = 0;
    const current = new Date(d1);
    while (current <= d2) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) count++;
      current.setDate(current.getDate() + 1);
    }
    output.value = `${count} dia(s) útil(eis) (feriados não descontados)`;
  });
}

/* ---------- Calcular Idade ---------- */
function initCalcularIdadeCard(card) {
  if (!card) return;
  const nascimento = card.querySelector(".idade-nascimento");
  const output = card.querySelector(".tool-output");

  card.querySelector(".idade-calcular").addEventListener("click", () => {
    if (!nascimento.value) {
      output.value = "Selecione uma data de nascimento.";
      return;
    }
    const nasc = new Date(`${nascimento.value}T00:00:00`);
    const hoje = new Date();
    if (nasc > hoje) {
      output.value = "Data no futuro.";
      return;
    }
    let anos = hoje.getFullYear() - nasc.getFullYear();
    let meses = hoje.getMonth() - nasc.getMonth();
    let dias = hoje.getDate() - nasc.getDate();
    if (dias < 0) {
      meses--;
      dias += new Date(hoje.getFullYear(), hoje.getMonth(), 0).getDate();
    }
    if (meses < 0) {
      anos--;
      meses += 12;
    }
    const totalDias = Math.floor((hoje - nasc) / 86400000);
    output.value = `${anos} anos, ${meses} meses e ${dias} dias (${totalDias.toLocaleString("pt-BR")} dias no total)`;
  });
}

/* ---------- Signo do Zodíaco ---------- */
const ZODIAC_SIGNS = [
  [20, "Capricórnio"], [19, "Aquário"], [20, "Peixes"], [20, "Áries"], [21, "Touro"], [21, "Gêmeos"],
  [22, "Câncer"], [22, "Leão"], [23, "Virgem"], [23, "Libra"], [22, "Escorpião"], [21, "Sagitário"], [20, "Capricórnio"],
];

function zodiacSign(month, day) {
  return day < ZODIAC_SIGNS[month - 1][0] ? ZODIAC_SIGNS[month - 1][1] : ZODIAC_SIGNS[month][1];
}

function initSignoCard(card) {
  if (!card) return;
  const data = card.querySelector(".signo-data");
  const output = card.querySelector(".tool-output");

  card.querySelector(".signo-calcular").addEventListener("click", () => {
    if (!data.value) {
      output.value = "Selecione uma data de nascimento.";
      return;
    }
    const [, month, day] = data.value.split("-").map(Number);
    output.value = zodiacSign(month, day);
  });
}

/* ---------- Fase da Lua ---------- */
const SYNODIC_MONTH = 29.530588853;
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);

function moonPhaseAge(date) {
  const diffDays = (date.getTime() - KNOWN_NEW_MOON) / 86400000;
  return ((diffDays % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
}

function moonPhaseName(age) {
  const p = age / SYNODIC_MONTH;
  if (p < 0.03 || p > 0.97) return "Lua Nova";
  if (p < 0.22) return "Lua Crescente";
  if (p < 0.28) return "Quarto Crescente";
  if (p < 0.47) return "Lua Crescente Gibosa";
  if (p < 0.53) return "Lua Cheia";
  if (p < 0.72) return "Lua Minguante Gibosa";
  if (p < 0.78) return "Quarto Minguante";
  return "Lua Minguante";
}

function initFaseLuaCard(card) {
  if (!card) return;
  const data = card.querySelector(".lua-data");
  const output = card.querySelector(".tool-output");

  card.querySelector(".lua-calcular").addEventListener("click", () => {
    const date = data.value ? new Date(`${data.value}T12:00:00Z`) : new Date();
    const age = moonPhaseAge(date);
    output.value = `${moonPhaseName(age)} (dia ${age.toFixed(1)} do ciclo de ${SYNODIC_MONTH.toFixed(2)} dias)`;
  });
}

/* ---------- Cronômetro e Contagem Regressiva ---------- */
function formatTimerDisplay(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds));
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function initCronometroCard(card) {
  if (!card) return;
  const display = card.querySelector(".timer-display");
  const minutosInput = card.querySelector(".timer-minutos");
  let intervalId = null;
  let elapsed = 0;
  let mode = null;

  function tick() {
    if (mode === "crono") {
      elapsed += 1;
      display.textContent = formatTimerDisplay(elapsed);
    } else if (mode === "regressiva") {
      elapsed -= 1;
      display.textContent = formatTimerDisplay(elapsed);
      if (elapsed <= 0) {
        clearInterval(intervalId);
        intervalId = null;
        showToast("Tempo esgotado!");
      }
    }
  }

  function stop() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  card.querySelector(".timer-start-crono").addEventListener("click", () => {
    stop();
    mode = "crono";
    elapsed = 0;
    display.textContent = formatTimerDisplay(elapsed);
    intervalId = setInterval(tick, 1000);
  });

  card.querySelector(".timer-start-regressiva").addEventListener("click", () => {
    stop();
    const minutos = parseFloat(minutosInput.value);
    if (Number.isNaN(minutos) || minutos <= 0) {
      showToast("Digite a quantidade de minutos.");
      return;
    }
    mode = "regressiva";
    elapsed = Math.round(minutos * 60);
    display.textContent = formatTimerDisplay(elapsed);
    intervalId = setInterval(tick, 1000);
  });

  card.querySelector(".timer-parar").addEventListener("click", stop);

  card.querySelector(".timer-zerar").addEventListener("click", () => {
    stop();
    elapsed = 0;
    mode = null;
    display.textContent = formatTimerDisplay(0);
  });
}

/* ---------- Pomodoro Timer ---------- */
function initPomodoroCard(card) {
  if (!card) return;
  const display = card.querySelector(".pomodoro-display");
  const status = card.querySelector(".pomodoro-status");
  const focoInput = card.querySelector(".pomo-foco");
  const pausaInput = card.querySelector(".pomo-pausa");
  let intervalId = null;
  let remaining = 0;
  let onBreak = false;

  function render() {
    const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
    const ss = String(remaining % 60).padStart(2, "0");
    display.textContent = `${mm}:${ss}`;
    status.textContent = onBreak ? "Pausa" : "Foco";
  }

  function tick() {
    remaining -= 1;
    if (remaining < 0) {
      onBreak = !onBreak;
      const minutos = onBreak ? parseFloat(pausaInput.value) : parseFloat(focoInput.value);
      remaining = Math.round((minutos || (onBreak ? 5 : 25)) * 60);
      showToast(onBreak ? "Hora da pausa!" : "De volta ao foco!");
    }
    render();
  }

  card.querySelector(".pomo-iniciar").addEventListener("click", () => {
    if (intervalId) return;
    if (remaining <= 0) {
      onBreak = false;
      remaining = Math.round((parseFloat(focoInput.value) || 25) * 60);
      render();
    }
    intervalId = setInterval(tick, 1000);
  });

  card.querySelector(".pomo-pausar").addEventListener("click", () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  });

  card.querySelector(".pomo-reiniciar").addEventListener("click", () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    onBreak = false;
    remaining = Math.round((parseFloat(focoInput.value) || 25) * 60);
    render();
  });

  remaining = Math.round((parseFloat(focoInput.value) || 25) * 60);
  render();
}

/* ---------- Simulador de Poupança ---------- */
function initPoupancaCard(card) {
  if (!card) return;
  const inicial = card.querySelector(".poup-inicial");
  const aporte = card.querySelector(".poup-aporte");
  const taxa = card.querySelector(".poup-taxa");
  const meses = card.querySelector(".poup-meses");
  const output = card.querySelector(".tool-output");

  card.querySelector(".poup-calcular").addEventListener("click", () => {
    const p0 = parseFloat(inicial.value) || 0;
    const aporteMensal = parseFloat(aporte.value) || 0;
    const taxaMensal = (parseFloat(taxa.value) || 0) / 100;
    const numMeses = parseInt(meses.value, 10);
    if (!numMeses || numMeses <= 0) {
      output.value = "Preencha a quantidade de meses.";
      return;
    }
    let total = p0;
    let totalAportado = p0;
    for (let i = 0; i < numMeses; i++) {
      total = total * (1 + taxaMensal) + aporteMensal;
      totalAportado += aporteMensal;
    }
    const juros = total - totalAportado;
    output.value = [
      `Valor final: ${total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`,
      `Total aportado: ${totalAportado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`,
      `Juros acumulados: ${juros.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`,
    ].join("\n");
  });
}

/* ---------- Simulador de Financiamento (Tabela Price) ---------- */
function initFinanciamentoCard(card) {
  if (!card) return;
  const valor = card.querySelector(".fin-valor");
  const taxa = card.querySelector(".fin-taxa");
  const parcelas = card.querySelector(".fin-parcelas");
  const output = card.querySelector(".tool-output");

  card.querySelector(".fin-calcular").addEventListener("click", () => {
    const principal = parseFloat(valor.value);
    const taxaMensal = (parseFloat(taxa.value) || 0) / 100;
    const n = parseInt(parcelas.value, 10);
    if (!principal || !n || n <= 0) {
      output.value = "Preencha o valor e a quantidade de parcelas.";
      return;
    }
    const parcela = taxaMensal === 0
      ? principal / n
      : (principal * (taxaMensal * Math.pow(1 + taxaMensal, n))) / (Math.pow(1 + taxaMensal, n) - 1);
    const total = parcela * n;
    output.value = [
      `Parcela mensal: ${parcela.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`,
      `Total pago: ${total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`,
      `Total de juros: ${(total - principal).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`,
    ].join("\n");
  });
}

/* ---------- Conversor de Moedas ---------- */
function initMoedaCard(card) {
  if (!card) return;
  const valor = card.querySelector(".moeda-valor");
  const de = card.querySelector(".moeda-de");
  const para = card.querySelector(".moeda-para");
  const output = card.querySelector(".tool-output");

  card.querySelector(".moeda-converter").addEventListener("click", async () => {
    const amount = parseFloat(valor.value);
    if (Number.isNaN(amount)) {
      output.value = "Digite um valor válido.";
      return;
    }
    output.value = "Buscando cotação...";
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${de.value}`);
      const data = await res.json();
      const rate = data.rates?.[para.value];
      if (!rate) throw new Error("Moeda não encontrada");
      const result = amount * rate;
      output.value = `${amount} ${de.value} = ${result.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} ${para.value}`;
    } catch {
      output.value = "Não foi possível buscar a cotação agora.";
    }
  });
}

/* ---------- Salário Mínimo por Ano ---------- */
const SALARIO_MINIMO_HISTORICO = {
  2018: 954, 2019: 998, 2020: 1045, 2021: 1100, 2022: 1212,
  2023: 1320, 2024: 1412, 2025: 1518, 2026: 1621,
};

function initSalarioMinimoCard(card) {
  if (!card) return;
  const ano = card.querySelector(".sm-ano");
  const output = card.querySelector(".tool-output");

  card.querySelector(".sm-consultar").addEventListener("click", () => {
    const year = parseInt(ano.value, 10);
    const valor = SALARIO_MINIMO_HISTORICO[year];
    if (!valor) {
      output.value = `Sem dados para ${year || "esse ano"}. Anos disponíveis: ${Math.min(...Object.keys(SALARIO_MINIMO_HISTORICO).map(Number))}-${Math.max(...Object.keys(SALARIO_MINIMO_HISTORICO).map(Number))}.`;
      return;
    }
    output.value = `Salário mínimo em ${year}: ${valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;
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
