/* =========================================================
   /dev — Dev Tools — Matemática e cálculo de área
   ========================================================= */

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
