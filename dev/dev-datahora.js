/* =========================================================
   /dev — Dev Tools — Data e hora, cron e fuso horário
   ========================================================= */

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

/* ---------- Emenda de Feriados (Feriadão) ---------- */
const WEEKDAY_NAMES = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

function feriadaoOpportunities(year) {
  const holidays = nationalHolidays(year);
  const opportunities = [];

  for (const h of holidays) {
    const weekday = h.date.getDay();
    if (weekday === 0 || weekday === 6) continue;

    let bridgeDays = [];
    let blockStart;
    let blockEnd;

    if (weekday === 1) {
      blockStart = addDaysToDate(h.date, -2);
      blockEnd = h.date;
    } else if (weekday === 5) {
      blockStart = h.date;
      blockEnd = addDaysToDate(h.date, 2);
    } else if (weekday === 2) {
      bridgeDays = [addDaysToDate(h.date, -1)];
      blockStart = addDaysToDate(h.date, -3);
      blockEnd = h.date;
    } else if (weekday === 4) {
      bridgeDays = [addDaysToDate(h.date, 1)];
      blockStart = h.date;
      blockEnd = addDaysToDate(h.date, 3);
    } else {
      bridgeDays = [addDaysToDate(h.date, -2), addDaysToDate(h.date, -1)];
      blockStart = addDaysToDate(h.date, -4);
      blockEnd = h.date;
    }

    const totalDaysOff = Math.round((blockEnd - blockStart) / 86400000) + 1;
    opportunities.push({
      nome: h.nome,
      data: h.date,
      diaSemana: WEEKDAY_NAMES[weekday],
      bridgeDays,
      totalDaysOff,
      blockStart,
      blockEnd,
    });
  }

  return opportunities;
}

function describeFeriadao(opp) {
  const periodo = `${opp.blockStart.toLocaleDateString("pt-BR")} a ${opp.blockEnd.toLocaleDateString("pt-BR")}`;
  if (opp.bridgeDays.length === 0) {
    return `${opp.nome} (${opp.diaSemana}, ${opp.data.toLocaleDateString("pt-BR")}): já forma um feriadão automático de ${opp.totalDaysOff} dias (${periodo}).`;
  }
  const dias = opp.bridgeDays.map((d) => d.toLocaleDateString("pt-BR")).join(" e ");
  return `${opp.nome} (${opp.diaSemana}, ${opp.data.toLocaleDateString("pt-BR")}): tire ${dias} de férias → ${opp.totalDaysOff} dias seguidos de folga (${periodo}).`;
}

function initFeriadaoCard(card) {
  if (!card) return;
  const ano = card.querySelector(".feriadao-ano");
  const output = card.querySelector(".tool-output");

  card.querySelector(".feriadao-calcular").addEventListener("click", () => {
    const year = parseInt(ano.value, 10) || new Date().getFullYear();
    const opportunities = feriadaoOpportunities(year);
    if (!opportunities.length) {
      output.value = "Nenhuma oportunidade de feriadão encontrada.";
      return;
    }
    output.value = opportunities.map(describeFeriadao).join("\n\n");
  });
}

/* ---------- Planejador de Férias (calendário visual) ---------- */
function buildYearDayTypes(year) {
  const holidays = new Map(nationalHolidays(year).map((h) => [h.date.toDateString(), h.nome]));
  const days = [];
  const cursor = new Date(year, 0, 1);
  while (cursor.getFullYear() === year) {
    const date = new Date(cursor);
    const weekday = date.getDay();
    let type = "work";
    if (weekday === 0 || weekday === 6) type = "weekend";
    else if (holidays.has(date.toDateString())) type = "holiday";
    days.push({ date, type, holidayName: holidays.get(date.toDateString()) });
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

// Art. 134 da CLT: cada período de férias precisa ter entre 5 e 30 dias
// corridos, e não pode começar nos 2 dias que antecedem um feriado ou o
// domingo (dia de descanso semanal remunerado).
function isValidVacationStart(date, holidaySet) {
  for (const offset of [1, 2]) {
    const check = addDaysToDate(date, offset);
    if (check.getDay() === 0) return false;
    if (holidaySet.has(check.toDateString())) return false;
  }
  return true;
}

function findBestVacationWindows(year, vacationDays, topN) {
  const days = buildYearDayTypes(year);
  const holidaySet = new Set(days.filter((d) => d.type === "holiday").map((d) => d.date.toDateString()));
  const n = days.length;
  const candidates = [];

  for (let i = 0; i < n; i++) {
    if (days[i].type !== "work") continue;
    if (!isValidVacationStart(days[i].date, holidaySet)) continue;
    let workCount = 0;
    let j = i;
    while (j < n) {
      if (days[j].type === "work") workCount++;
      if (workCount > vacationDays) break;
      j++;
    }
    j--;
    if (j >= i) {
      const totalDaysOff = j - i + 1;
      if (totalDaysOff < 5 || totalDaysOff > 30) continue;
      const workUsed = days.slice(i, j + 1).filter((d) => d.type === "work").length;
      candidates.push({ start: days[i].date, end: days[j].date, totalDaysOff, workUsed });
    }
  }

  candidates.sort((a, b) => (b.totalDaysOff - a.totalDaysOff) || (a.workUsed - b.workUsed));

  const selected = [];
  for (const c of candidates) {
    const overlaps = selected.some((s) => !(c.end < s.start || c.start > s.end));
    if (!overlaps) selected.push(c);
    if (selected.length >= topN) break;
  }
  return selected;
}

const CAL_MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const CAL_DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];

function renderYearCalendar(container, year, holidaysMap, highlightOption) {
  container.innerHTML = "";

  for (let month = 0; month < 12; month++) {
    const monthEl = document.createElement("div");
    monthEl.className = "cal-month";

    const title = document.createElement("h3");
    title.className = "cal-month__title";
    title.textContent = CAL_MESES[month];
    monthEl.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "cal-grid";

    CAL_DIAS_SEMANA.forEach((d) => {
      const head = document.createElement("span");
      head.className = "cal-cell cal-cell--head";
      head.textContent = d;
      grid.appendChild(head);
    });

    const firstDay = new Date(year, month, 1);
    for (let i = 0; i < firstDay.getDay(); i++) {
      const empty = document.createElement("span");
      empty.className = "cal-cell cal-cell--empty";
      grid.appendChild(empty);
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const cell = document.createElement("span");
      cell.className = "cal-cell";
      cell.textContent = String(day);

      const weekday = date.getDay();
      const isWeekend = weekday === 0 || weekday === 6;
      const holidayName = holidaysMap.get(date.toDateString());
      const isVacation = highlightOption && date >= highlightOption.start && date <= highlightOption.end && !holidayName && !isWeekend;

      if (holidayName) {
        cell.classList.add("cal-cell--holiday");
        cell.title = holidayName;
      } else if (isWeekend) {
        cell.classList.add("cal-cell--weekend");
      } else if (isVacation) {
        cell.classList.add("cal-cell--vacation");
      }

      grid.appendChild(cell);
    }

    monthEl.appendChild(grid);
    container.appendChild(monthEl);
  }
}

function initFeriasPlanejadorCard(card) {
  if (!card) return;
  const anoInput = card.querySelector(".ferias-ano");
  const diasInput = card.querySelector(".ferias-dias");
  const opcoesEl = card.querySelector(".ferias-opcoes");
  const calendarioEl = card.querySelector(".ferias-calendario");
  let currentYear = new Date().getFullYear();

  function renderOptions(options) {
    opcoesEl.innerHTML = "";
    const holidaysMap = new Map(nationalHolidays(currentYear).map((h) => [h.date.toDateString(), h.nome]));

    options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn--outline";
      if (idx === 0) btn.classList.add("is-active");
      btn.textContent = `${opt.start.toLocaleDateString("pt-BR")} a ${opt.end.toLocaleDateString("pt-BR")} — ${opt.totalDaysOff} dias (usa ${opt.workUsed})`;
      btn.addEventListener("click", () => {
        opcoesEl.querySelectorAll(".btn").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        renderYearCalendar(calendarioEl, currentYear, holidaysMap, opt);
      });
      opcoesEl.appendChild(btn);
    });

    renderYearCalendar(calendarioEl, currentYear, holidaysMap, options[0]);
  }

  card.querySelector(".ferias-calcular").addEventListener("click", () => {
    currentYear = parseInt(anoInput.value, 10) || new Date().getFullYear();
    const dias = parseInt(diasInput.value, 10);
    if (!dias || dias < 1) {
      showToast("Digite quantos dias de férias você tem.");
      return;
    }
    const options = findBestVacationWindows(currentYear, dias, 5);
    if (!options.length) {
      opcoesEl.innerHTML = "";
      calendarioEl.innerHTML = "";
      showToast("Nenhuma opção encontrada.");
      return;
    }
    renderOptions(options);
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

/* ---------- Explicador de Cron ---------- */
function parseCronField(field, min, max) {
  const values = new Set();
  for (const part of field.split(",")) {
    let step = 1;
    let range = part;
    if (part.includes("/")) {
      [range, step] = part.split("/");
      step = parseInt(step, 10);
    }
    let start = min;
    let end = max;
    if (range !== "*") {
      if (range.includes("-")) {
        [start, end] = range.split("-").map(Number);
      } else {
        start = end = Number(range);
      }
    }
    for (let v = start; v <= end; v += step) values.add(v);
  }
  return values;
}

function cronMatches(date, fields) {
  return fields.minute.has(date.getMinutes())
    && fields.hour.has(date.getHours())
    && fields.day.has(date.getDate())
    && fields.month.has(date.getMonth() + 1)
    && fields.weekday.has(date.getDay());
}

function cronNextRuns(expr, count, from) {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) throw new Error("A expressão precisa ter 5 campos: minuto hora dia mês dia-da-semana.");
  const [min, hour, day, month, weekday] = parts;
  const fields = {
    minute: parseCronField(min, 0, 59),
    hour: parseCronField(hour, 0, 23),
    day: parseCronField(day, 1, 31),
    month: parseCronField(month, 1, 12),
    weekday: parseCronField(weekday, 0, 6),
  };
  const results = [];
  const cur = new Date(from);
  cur.setSeconds(0, 0);
  cur.setMinutes(cur.getMinutes() + 1);
  let guard = 0;
  while (results.length < count && guard < 600000) {
    if (cronMatches(cur, fields)) results.push(new Date(cur));
    cur.setMinutes(cur.getMinutes() + 1);
    guard++;
  }
  return results;
}

function initCronCard(card) {
  if (!card) return;
  const input = card.querySelector(".cron-input");
  const output = card.querySelector(".tool-output");

  card.querySelector(".cron-explicar").addEventListener("click", () => {
    try {
      const runs = cronNextRuns(input.value, 5, new Date());
      const lines = ["Próximas execuções:", ...runs.map((d) => d.toLocaleString("pt-BR"))];
      output.value = lines.join("\n");
    } catch (err) {
      output.value = err.message;
    }
  });
}

/* ---------- Conversor de Fuso Horário ---------- */
const TIMEZONE_LIST = [
  "America/Sao_Paulo", "America/New_York", "America/Los_Angeles", "America/Mexico_City",
  "Europe/Lisbon", "Europe/London", "Europe/Berlin", "Europe/Moscow",
  "Asia/Tokyo", "Asia/Shanghai", "Asia/Dubai", "Asia/Kolkata",
  "Australia/Sydney", "Pacific/Auckland", "UTC",
];

function formatInTimezone(date, timeZone) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone, dateStyle: "short", timeStyle: "medium",
  }).format(date);
}

function populateTimezoneSelects(card) {
  const options = TIMEZONE_LIST.map((tz) => `<option value="${tz}">${tz}</option>`).join("");
  const de = card.querySelector(".tz-de");
  const para = card.querySelector(".tz-para");
  de.innerHTML = options;
  para.innerHTML = options;
  de.value = "America/Sao_Paulo";
  para.value = "UTC";
}

function initFusoHorarioCard(card) {
  if (!card) return;
  const data = card.querySelector(".tz-data");
  const de = card.querySelector(".tz-de");
  const para = card.querySelector(".tz-para");
  const output = card.querySelector(".tool-output");

  populateTimezoneSelects(card);

  card.querySelector(".tz-agora").addEventListener("click", () => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    data.value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  });

  card.querySelector(".tz-converter").addEventListener("click", () => {
    if (!data.value) {
      output.value = "Selecione uma data e hora.";
      return;
    }
    // Interpreta o horário digitado como se fosse no fuso de origem.
    const [datePart, timePart] = data.value.split("T");
    const isoGuess = new Date(`${datePart}T${timePart}:00`);
    const asUtcString = new Intl.DateTimeFormat("en-US", {
      timeZone: de.value, timeZoneName: "shortOffset",
    }).formatToParts(isoGuess).find((p) => p.type === "timeZoneName")?.value ?? "";
    const offsetMatch = asUtcString.match(/GMT([+-]\d+)/);
    const offsetHours = offsetMatch ? parseInt(offsetMatch[1], 10) : 0;
    const utcDate = new Date(isoGuess.getTime() - offsetHours * 3600000 - isoGuess.getTimezoneOffset() * 60000);

    output.value = [
      `${de.value}: ${formatInTimezone(utcDate, de.value)}`,
      `${para.value}: ${formatInTimezone(utcDate, para.value)}`,
    ].join("\n");
  });
}
