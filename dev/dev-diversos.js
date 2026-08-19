/* =========================================================
   /dev — Dev Tools — Rede, finanças e dados fake
   ========================================================= */

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
