/* =========================================================
   /dev — Dev Tools — Codificação — QR Code, QR Wi-Fi/Pix, código de barras, binário, morse, símbolos
   ========================================================= */

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
