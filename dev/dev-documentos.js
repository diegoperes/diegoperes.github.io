/* =========================================================
   /dev — Dev Tools — Documentos (BR) — CPF, CNPJ, RG, CNH, PIS, RENAVAM, Título, Cartão, CEP, Conta
   ========================================================= */

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
