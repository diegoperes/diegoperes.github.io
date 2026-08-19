/* =========================================================
   /dev — Dev Tools — Dev avançado — regex, sub-rede, user-agent, SQL, identificadores, .gitignore, JWT encoder, JSON
   ========================================================= */

/* ---------- Testador de Regex ---------- */
function initRegexTesterCard(card) {
  if (!card) return;
  const pattern = card.querySelector(".regex-pattern");
  const flags = card.querySelector(".regex-flags");
  const texto = card.querySelector(".regex-texto");
  const output = card.querySelector(".tool-output");

  card.querySelector(".regex-testar").addEventListener("click", () => {
    const globalFlags = flags.value.includes("g") ? flags.value : `${flags.value}g`;
    let regex;
    try {
      regex = new RegExp(pattern.value, globalFlags);
    } catch (err) {
      output.value = `Regex inválida: ${err.message}`;
      return;
    }
    const matches = [...texto.value.matchAll(regex)];
    if (matches.length === 0) {
      output.value = "Nenhuma correspondência encontrada.";
      return;
    }
    output.value = matches.map((m, i) => {
      const groups = m.length > 1 ? ` | grupos: ${m.slice(1).map((g) => g ?? "—").join(", ")}` : "";
      return `#${i + 1}: "${m[0]}" (posição ${m.index})${groups}`;
    }).join("\n");
  });
}

/* ---------- Calculadora de Sub-rede (CIDR) ---------- */
function ipToInt(ip) {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p) || p < 0 || p > 255)) return null;
  return parts.reduce((acc, oct) => (acc << 8) + oct, 0) >>> 0;
}

function intToIp(int) {
  return [24, 16, 8, 0].map((shift) => (int >>> shift) & 0xff).join(".");
}

function subnetInfo(ip, prefix) {
  const ipInt = ipToInt(ip);
  if (ipInt === null || prefix < 0 || prefix > 32) return null;
  const maskInt = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const network = (ipInt & maskInt) >>> 0;
  const broadcast = (network | (~maskInt >>> 0)) >>> 0;
  const totalHosts = 2 ** (32 - prefix);
  const usableHosts = prefix >= 31 ? 0 : totalHosts - 2;
  return {
    network: intToIp(network),
    broadcast: intToIp(broadcast),
    mask: intToIp(maskInt),
    firstHost: prefix >= 31 ? intToIp(network) : intToIp(network + 1),
    lastHost: prefix >= 31 ? intToIp(broadcast) : intToIp(broadcast - 1),
    totalHosts,
    usableHosts,
  };
}

function initSubnetCard(card) {
  if (!card) return;
  const input = card.querySelector(".subnet-input");
  const output = card.querySelector(".tool-output");

  card.querySelector(".subnet-calcular").addEventListener("click", () => {
    const match = input.value.trim().match(/^(\d{1,3}(?:\.\d{1,3}){3})\/(\d{1,2})$/);
    if (!match) {
      output.value = "Formato esperado: 192.168.1.10/24";
      return;
    }
    const info = subnetInfo(match[1], parseInt(match[2], 10));
    if (!info) {
      output.value = "IP ou prefixo inválido.";
      return;
    }
    output.value = [
      `Rede: ${info.network}`,
      `Broadcast: ${info.broadcast}`,
      `Máscara: ${info.mask}`,
      `Primeiro host: ${info.firstHost}`,
      `Último host: ${info.lastHost}`,
      `Total de endereços: ${info.totalHosts.toLocaleString("pt-BR")}`,
      `Hosts utilizáveis: ${info.usableHosts.toLocaleString("pt-BR")}`,
    ].join("\n");
  });
}

/* ---------- Parser de User-Agent ---------- */
function parseUserAgent(ua) {
  let browser = "Desconhecido";
  let browserVersion = "";
  const browserPatterns = [
    [/Edg\/([\d.]+)/, "Edge"],
    [/OPR\/([\d.]+)/, "Opera"],
    [/Chrome\/([\d.]+)/, "Chrome"],
    [/Firefox\/([\d.]+)/, "Firefox"],
    [/Version\/([\d.]+).*Safari/, "Safari"],
  ];
  for (const [regex, name] of browserPatterns) {
    const m = ua.match(regex);
    if (m) { browser = name; browserVersion = m[1]; break; }
  }

  let os = "Desconhecido";
  if (/Windows NT 10/.test(ua)) os = "Windows 10/11";
  else if (/Windows NT/.test(ua)) os = "Windows";
  else if (/Mac OS X ([\d_]+)/.test(ua)) os = `macOS ${ua.match(/Mac OS X ([\d_]+)/)[1].replace(/_/g, ".")}`;
  else if (/Android ([\d.]+)/.test(ua)) os = `Android ${ua.match(/Android ([\d.]+)/)[1]}`;
  else if (/iPhone OS ([\d_]+)/.test(ua)) os = `iOS ${ua.match(/iPhone OS ([\d_]+)/)[1].replace(/_/g, ".")}`;
  else if (/Linux/.test(ua)) os = "Linux";

  const isMobile = /Mobile|Android|iPhone/.test(ua);

  return { browser, browserVersion, os, isMobile };
}

function initUserAgentCard(card) {
  if (!card) return;
  const input = card.querySelector(".ua-input");
  const output = card.querySelector(".tool-output");

  card.querySelector(".ua-usar-meu").addEventListener("click", () => {
    input.value = navigator.userAgent;
  });

  card.querySelector(".ua-analisar").addEventListener("click", () => {
    const ua = input.value.trim() || navigator.userAgent;
    const info = parseUserAgent(ua);
    output.value = [
      `Navegador: ${info.browser} ${info.browserVersion}`,
      `Sistema: ${info.os}`,
      `Dispositivo: ${info.isMobile ? "Mobile" : "Desktop"}`,
      "",
      `User-Agent original: ${ua}`,
    ].join("\n");
  });
}

/* ---------- Comparador de SemVer ---------- */
function parseSemver(v) {
  const m = v.trim().replace(/^v/, "").match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+([0-9A-Za-z.-]+))?$/);
  if (!m) return null;
  return { major: +m[1], minor: +m[2], patch: +m[3], pre: m[4] || null };
}

function comparePrerelease(a, b) {
  if (a === b) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  const pa = a.split(".");
  const pb = b.split(".");
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    if (pa[i] === undefined) return -1;
    if (pb[i] === undefined) return 1;
    const na = Number(pa[i]);
    const nb = Number(pb[i]);
    const bothNum = !Number.isNaN(na) && !Number.isNaN(nb);
    if (bothNum) {
      if (na !== nb) return na - nb;
    } else if (pa[i] !== pb[i]) {
      return pa[i] < pb[i] ? -1 : 1;
    }
  }
  return 0;
}

function compareSemver(v1, v2) {
  const a = parseSemver(v1);
  const b = parseSemver(v2);
  if (!a || !b) return null;
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  if (a.patch !== b.patch) return a.patch - b.patch;
  return comparePrerelease(a.pre, b.pre);
}

function initSemverCard(card) {
  if (!card) return;
  const a = card.querySelector(".semver-a");
  const b = card.querySelector(".semver-b");
  const output = card.querySelector(".tool-output");

  card.querySelector(".semver-comparar").addEventListener("click", () => {
    const result = compareSemver(a.value, b.value);
    if (result === null) {
      output.value = "Formato inválido — use major.minor.patch (ex: 1.2.3 ou 1.2.3-beta.1).";
      return;
    }
    if (result === 0) output.value = `${a.value} é igual a ${b.value}`;
    else if (result < 0) output.value = `${a.value} é MENOR que ${b.value}`;
    else output.value = `${a.value} é MAIOR que ${b.value}`;
  });
}

/* ---------- Formatador de SQL (baseado em palavras-chave) ---------- */
const SQL_KEYWORDS_NEWLINE = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "GROUP BY", "ORDER BY", "HAVING",
  "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "JOIN", "ON", "LIMIT", "OFFSET",
  "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM",
];

function formatSql(sql) {
  let formatted = ` ${sql.replace(/\s+/g, " ").trim()} `;
  const sorted = [...SQL_KEYWORDS_NEWLINE].sort((a, b) => b.length - a.length);
  for (const kw of sorted) {
    const regex = new RegExp(`\\s+${kw}\\s+`, "gi");
    formatted = formatted.replace(regex, `\n${kw.toUpperCase()} `);
  }
  return formatted.trim();
}

function initSqlFormatterCard(card) {
  if (!card) return;
  const input = card.querySelector(".tool-input");
  const output = card.querySelector(".tool-output");

  card.querySelector(".sql-formatar").addEventListener("click", () => {
    output.value = formatSql(input.value);
  });
}

/* ---------- Case de Identificador ---------- */
function splitIdentifierWords(text) {
  return text
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_\-\s]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((w) => w.toLowerCase());
}

function initCaseIdentificadorCard(card) {
  if (!card) return;
  const input = card.querySelector(".case-input");
  const output = card.querySelector(".tool-output");

  card.querySelector(".case-converter").addEventListener("click", () => {
    const words = splitIdentifierWords(input.value);
    if (!words.length) {
      output.value = "Digite um identificador.";
      return;
    }
    const camel = words.map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1))).join("");
    const pascal = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
    const snake = words.join("_");
    const kebab = words.join("-");
    const constant = words.join("_").toUpperCase();
    output.value = [
      `camelCase: ${camel}`,
      `PascalCase: ${pascal}`,
      `snake_case: ${snake}`,
      `kebab-case: ${kebab}`,
      `CONSTANT_CASE: ${constant}`,
    ].join("\n");
  });
}

/* ---------- Gerador de .gitignore ---------- */
const GITIGNORE_PRESETS = {
  node: ["node_modules/", "npm-debug.log*", "yarn-debug.log*", "yarn-error.log*", "dist/", "build/", ".env", ".env.local", "coverage/"],
  python: ["__pycache__/", "*.pyc", ".venv/", "venv/", "*.egg-info/", "dist/", "build/", ".pytest_cache/", ".env"],
  java: ["*.class", "target/", "*.jar", "*.war", ".gradle/", "build/", "out/"],
  dotnet: ["bin/", "obj/", "*.user", "*.suo", "packages/", "*.dll", "*.pdb"],
  go: ["*.exe", "*.test", "*.out", "vendor/", "go.work"],
  rust: ["target/", "Cargo.lock", "**/*.rs.bk"],
};

function initGitignoreCard(card) {
  if (!card) return;
  const stack = card.querySelector(".gitignore-stack");
  const macos = card.querySelector(".gitignore-macos");
  const vscode = card.querySelector(".gitignore-vscode");
  const output = card.querySelector(".tool-output");

  card.querySelector(".gitignore-gerar").addEventListener("click", () => {
    const lines = [`# ${stack.options[stack.selectedIndex].text}`, ...GITIGNORE_PRESETS[stack.value]];
    if (macos.checked) lines.push("", "# macOS", ".DS_Store");
    if (vscode.checked) lines.push("", "# VS Code", ".vscode/");
    output.value = lines.join("\n");
  });
}

/* ---------- JWT Encoder ---------- */
function base64UrlEncodeBytes(bytes) {
  let binary = "";
  bytes.forEach((b) => { binary += String.fromCharCode(b); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlEncodeText(text) {
  return base64UrlEncodeBytes(new TextEncoder().encode(text));
}

async function signJwtHs256(payloadObj, secret) {
  const header = { alg: "HS256", typ: "JWT" };
  const headerB64 = base64UrlEncodeText(JSON.stringify(header));
  const payloadB64 = base64UrlEncodeText(JSON.stringify(payloadObj));
  const signingInput = `${headerB64}.${payloadB64}`;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signingInput));
  return `${signingInput}.${base64UrlEncodeBytes(new Uint8Array(sig))}`;
}

function initJwtEncoderCard(card) {
  if (!card) return;
  const payloadInput = card.querySelector(".jwt-payload");
  const secret = card.querySelector(".jwt-secret");
  const expira = card.querySelector(".jwt-expira");
  const output = card.querySelector(".tool-output");

  card.querySelector(".jwt-assinar").addEventListener("click", async () => {
    let payload;
    try {
      payload = JSON.parse(payloadInput.value);
    } catch (err) {
      output.value = `Payload inválido: ${err.message}`;
      return;
    }
    if (!secret.value) {
      output.value = "Digite um segredo.";
      return;
    }
    const now = Math.floor(Date.now() / 1000);
    payload.iat = now;
    if (expira.value) payload.exp = now + Math.round(parseFloat(expira.value) * 60);
    output.value = await signJwtHs256(payload, secret.value);
  });
}

/* ---------- Comparador de JSON ---------- */
function jsonDiff(a, b, path = "") {
  const diffs = [];
  if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    diffs.push(`${path || "(raiz)"}: tipo mudou (${JSON.stringify(a)} → ${JSON.stringify(b)})`);
    return diffs;
  }
  if (a === null || b === null || typeof a !== "object") {
    if (a !== b) diffs.push(`${path || "(raiz)"}: ${JSON.stringify(a)} → ${JSON.stringify(b)}`);
    return diffs;
  }
  const keysA = Array.isArray(a) ? a.map((_, i) => i) : Object.keys(a);
  const keysB = Array.isArray(b) ? b.map((_, i) => i) : Object.keys(b);
  const allKeys = [...new Set([...keysA, ...keysB])];
  for (const key of allKeys) {
    const childPath = path ? `${path}.${key}` : String(key);
    if (!(key in a)) diffs.push(`+ ${childPath}: ${JSON.stringify(b[key])}`);
    else if (!(key in b)) diffs.push(`- ${childPath}: ${JSON.stringify(a[key])}`);
    else diffs.push(...jsonDiff(a[key], b[key], childPath));
  }
  return diffs;
}

function initJsonDiffCard(card) {
  if (!card) return;
  const a = card.querySelector(".compare-a");
  const b = card.querySelector(".compare-b");
  const output = card.querySelector(".tool-output");

  card.querySelector(".json-diff-comparar").addEventListener("click", () => {
    let objA;
    let objB;
    try {
      objA = JSON.parse(a.value);
      objB = JSON.parse(b.value);
    } catch (err) {
      output.value = `JSON inválido: ${err.message}`;
      return;
    }
    const diffs = jsonDiff(objA, objB);
    output.value = diffs.length ? diffs.join("\n") : "Os dois JSONs são idênticos.";
  });
}

/* ---------- Gerador de JSON Mock ---------- */
const MOCK_NOMES = ["Ana Silva", "Bruno Costa", "Carla Souza", "Diego Santos", "Elisa Lima", "Felipe Alves"];
const MOCK_PALAVRAS = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing"];

function mockValueFor(type) {
  switch (type) {
    case "nome": return MOCK_NOMES[Math.floor(Math.random() * MOCK_NOMES.length)];
    case "email": return `${slugify(MOCK_NOMES[Math.floor(Math.random() * MOCK_NOMES.length)])}${Math.floor(Math.random() * 1000)}@exemplo.com`;
    case "numero": return Math.floor(Math.random() * 1000);
    case "booleano": return Math.random() < 0.5;
    case "uuid": return crypto.randomUUID();
    case "data": return new Date(Date.now() - Math.floor(Math.random() * 1e10)).toISOString().slice(0, 10);
    case "frase": return Array.from({ length: 6 }, () => MOCK_PALAVRAS[Math.floor(Math.random() * MOCK_PALAVRAS.length)]).join(" ");
    case "palavra": return MOCK_PALAVRAS[Math.floor(Math.random() * MOCK_PALAVRAS.length)];
    default: return null;
  }
}

function initJsonMockCard(card) {
  if (!card) return;
  const schemaInput = card.querySelector(".mock-schema");
  const qtd = card.querySelector(".mock-qtd");
  const output = card.querySelector(".tool-output");

  card.querySelector(".mock-gerar").addEventListener("click", () => {
    let schema;
    try {
      schema = JSON.parse(schemaInput.value);
    } catch (err) {
      output.value = `Schema inválido: ${err.message}`;
      return;
    }
    const count = clamp(parseInt(qtd.value, 10) || 1, 1, 50);
    const items = Array.from({ length: count }, () => {
      const obj = {};
      for (const [key, type] of Object.entries(schema)) obj[key] = mockValueFor(type);
      return obj;
    });
    output.value = JSON.stringify(count === 1 ? items[0] : items, null, 2);
  });
}

/* ---------- ASCII Art / Banner ---------- */
const ASCII_FONT = {
  A: [" # ", "# #", "###", "# #", "# #"], B: ["## ", "# #", "## ", "# #", "## "], C: [" ##", "#  ", "#  ", "#  ", " ##"],
  D: ["## ", "# #", "# #", "# #", "## "], E: ["###", "#  ", "## ", "#  ", "###"], F: ["###", "#  ", "## ", "#  ", "#  "],
  G: [" ##", "#  ", "# #", "# #", " ##"], H: ["# #", "# #", "###", "# #", "# #"], I: ["###", " # ", " # ", " # ", "###"],
  J: ["  #", "  #", "  #", "# #", " # "], K: ["# #", "## ", "#  ", "## ", "# #"], L: ["#  ", "#  ", "#  ", "#  ", "###"],
  M: ["# #", "###", "###", "# #", "# #"], N: ["# #", "###", "###", "###", "# #"], O: [" # ", "# #", "# #", "# #", " # "],
  P: ["## ", "# #", "## ", "#  ", "#  "], Q: [" # ", "# #", "# #", "###", " ##"], R: ["## ", "# #", "## ", "# #", "# #"],
  S: [" ##", "#  ", " # ", "  #", "## "], T: ["###", " # ", " # ", " # ", " # "], U: ["# #", "# #", "# #", "# #", " # "],
  V: ["# #", "# #", "# #", "# #", " # "], W: ["# #", "# #", "###", "###", "# #"], X: ["# #", "# #", " # ", "# #", "# #"],
  Y: ["# #", "# #", " # ", " # ", " # "], Z: ["###", "  #", " # ", "#  ", "###"],
  0: [" # ", "# #", "# #", "# #", " # "], 1: [" # ", "## ", " # ", " # ", "###"], 2: ["## ", "  #", " # ", "#  ", "###"],
  3: ["## ", "  #", " # ", "  #", "## "], 4: ["# #", "# #", "###", "  #", "  #"], 5: ["###", "#  ", "## ", "  #", "## "],
  6: [" ##", "#  ", "## ", "# #", " # "], 7: ["###", "  #", " # ", " # ", " # "], 8: [" # ", "# #", " # ", "# #", " # "],
  9: [" # ", "# #", " ##", "  #", "## "], " ": ["   ", "   ", "   ", "   ", "   "],
};

function asciiArt(text) {
  const chars = text.toUpperCase().split("").filter((ch) => ASCII_FONT[ch]);
  if (!chars.length) return "";
  const rows = [0, 1, 2, 3, 4].map((row) => chars.map((ch) => ASCII_FONT[ch][row]).join(" "));
  return rows.join("\n");
}

function initAsciiArtCard(card) {
  if (!card) return;
  const input = card.querySelector(".ascii-input");
  const output = card.querySelector(".tool-output");

  card.querySelector(".ascii-gerar").addEventListener("click", () => {
    const result = asciiArt(input.value);
    output.value = result || "Nenhum caractere suportado (use A-Z, 0-9 e espaço).";
  });
}
