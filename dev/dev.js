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
  initDateInputGuards();

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
  initFeriadaoCard(document.querySelector('[data-tool="feriadao"]'));
  initCronometroCard(document.querySelector('[data-tool="cronometro"]'));
  initPomodoroCard(document.querySelector('[data-tool="pomodoro"]'));
  initPoupancaCard(document.querySelector('[data-tool="poupanca"]'));
  initFinanciamentoCard(document.querySelector('[data-tool="financiamento"]'));
  initMoedaCard(document.querySelector('[data-tool="moeda"]'));
  initSalarioMinimoCard(document.querySelector('[data-tool="salario-minimo"]'));

  initCorConversorCard(document.querySelector('[data-tool="cor-conversor"]'));
  initGradienteCard(document.querySelector('[data-tool="gradiente-css"]'));
  initBoxShadowCard(document.querySelector('[data-tool="box-shadow-css"]'));
  initBorderRadiusCard(document.querySelector('[data-tool="border-radius-css"]'));
  initRegexTesterCard(document.querySelector('[data-tool="regex-tester"]'));
  initCronCard(document.querySelector('[data-tool="cron-explicador"]'));
  initFusoHorarioCard(document.querySelector('[data-tool="fuso-horario"]'));
  initSubnetCard(document.querySelector('[data-tool="subnet-calculadora"]'));
  initUserAgentCard(document.querySelector('[data-tool="user-agent-parser"]'));
  initSemverCard(document.querySelector('[data-tool="semver-comparador"]'));
  initSqlFormatterCard(document.querySelector('[data-tool="sql-formatter"]'));
  initCaseIdentificadorCard(document.querySelector('[data-tool="case-identificador"]'));
  initGitignoreCard(document.querySelector('[data-tool="gitignore-gerador"]'));
  initJwtEncoderCard(document.querySelector('[data-tool="jwt-encoder"]'));
  initJsonDiffCard(document.querySelector('[data-tool="json-diff"]'));
  initJsonMockCard(document.querySelector('[data-tool="json-mock"]'));
  initAsciiArtCard(document.querySelector('[data-tool="ascii-art"]'));
  initMetaTagsCard(document.querySelector('[data-tool="meta-tags-gerador"]'));
  initRobotsCard(document.querySelector('[data-tool="robots-gerador"]'));
  initFaviconCard(document.querySelector('[data-tool="favicon-gerador"]'));

  initCompressCard(document.querySelector('[data-tool="comprimir-imagem"]'));
  initResizeCard(document.querySelector('[data-tool="redimensionar-imagem"]'));
  initCropCard(document.querySelector('[data-tool="recortar-imagem"]'));
  initBwCard(document.querySelector('[data-tool="preto-e-branco"]'));
  initJpgToPdfCard(document.querySelector('[data-tool="jpg-para-pdf"]'));
  initMergePdfCard(document.querySelector('[data-tool="juntar-pdf"]'));
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

/* ---------- Evita anos absurdos nos campos de data e de ano ---------- */
function initDateInputGuards() {
  document.querySelectorAll('input[type="date"]').forEach((input) => {
    input.addEventListener("input", () => {
      const [yearStr] = input.value.split("-");
      if (!yearStr) return;
      if (yearStr.length > 4 || parseInt(yearStr, 10) > 2100) {
        input.value = "";
      }
    });
  });

  document.querySelectorAll(".feriados-ano, .sm-ano").forEach((input) => {
    input.addEventListener("input", () => {
      if (input.value.length > 4) {
        input.value = input.value.slice(0, 4);
      }
    });
  });
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
