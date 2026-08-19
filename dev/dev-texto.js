/* =========================================================
   /dev — Dev Tools — Funções de string
   ========================================================= */

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
