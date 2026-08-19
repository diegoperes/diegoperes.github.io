/* =========================================================
   /dev — Dev Tools — Imagem e PDF (Canvas nativo)
   ========================================================= */

/* ---------- Imagem: helpers compartilhados ---------- */
function loadImageFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Não foi possível carregar essa imagem."));
    img.src = url;
  });
}

function drawImageToCanvas(canvas, img, width, height) {
  canvas.width = width ?? img.naturalWidth;
  canvas.height = height ?? img.naturalHeight;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return ctx;
}

function canvasToBlob(canvas, mimeType, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, mimeType, quality));
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/* ---------- Comprimir Imagem ---------- */
function initCompressCard(card) {
  if (!card) return;
  const fileInput = card.querySelector(".img-input");
  const qualidade = card.querySelector(".compress-qualidade");
  const formato = card.querySelector(".compress-formato");
  const canvas = card.querySelector(".img-canvas");
  const info = card.querySelector(".img-info");
  let originalFile = null;
  let originalImg = null;
  let compressedBlob = null;

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;
    originalFile = file;
    originalImg = await loadImageFile(file);
    drawImageToCanvas(canvas, originalImg);
    info.textContent = `Original: ${formatFileSize(file.size)} (${originalImg.naturalWidth}×${originalImg.naturalHeight})`;
    compressedBlob = null;
  });

  card.querySelector(".compress-processar").addEventListener("click", async () => {
    if (!originalImg) {
      showToast("Selecione uma imagem primeiro.");
      return;
    }
    drawImageToCanvas(canvas, originalImg);
    compressedBlob = await canvasToBlob(canvas, formato.value, (parseFloat(qualidade.value) || 70) / 100);
    const reducao = originalFile ? (100 - (compressedBlob.size / originalFile.size) * 100) : 0;
    info.textContent = `Original: ${formatFileSize(originalFile.size)} → Comprimido: ${formatFileSize(compressedBlob.size)} (${reducao > 0 ? `-${reducao.toFixed(0)}%` : "sem redução"})`;
  });

  card.querySelector(".compress-download").addEventListener("click", () => {
    if (!compressedBlob) {
      showToast("Clique em Comprimir primeiro.");
      return;
    }
    const ext = formato.value === "image/webp" ? "webp" : "jpg";
    downloadBlob(compressedBlob, `imagem-comprimida.${ext}`);
  });
}

/* ---------- Redimensionar Imagem ---------- */
function initResizeCard(card) {
  if (!card) return;
  const fileInput = card.querySelector(".img-input");
  const largura = card.querySelector(".resize-largura");
  const altura = card.querySelector(".resize-altura");
  const manterProporcao = card.querySelector(".resize-proporcao");
  const canvas = card.querySelector(".img-canvas");
  const info = card.querySelector(".img-info");
  let originalImg = null;
  let aspectRatio = 1;

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;
    originalImg = await loadImageFile(file);
    aspectRatio = originalImg.naturalWidth / originalImg.naturalHeight;
    largura.value = originalImg.naturalWidth;
    altura.value = originalImg.naturalHeight;
    drawImageToCanvas(canvas, originalImg);
    info.textContent = `Tamanho original: ${originalImg.naturalWidth}×${originalImg.naturalHeight}`;
  });

  largura.addEventListener("input", () => {
    if (manterProporcao.checked && largura.value) {
      altura.value = Math.round(largura.value / aspectRatio);
    }
  });

  altura.addEventListener("input", () => {
    if (manterProporcao.checked && altura.value) {
      largura.value = Math.round(altura.value * aspectRatio);
    }
  });

  card.querySelector(".resize-processar").addEventListener("click", () => {
    if (!originalImg) {
      showToast("Selecione uma imagem primeiro.");
      return;
    }
    const w = parseInt(largura.value, 10);
    const h = parseInt(altura.value, 10);
    if (!w || !h) {
      showToast("Preencha largura e altura.");
      return;
    }
    drawImageToCanvas(canvas, originalImg, w, h);
    info.textContent = `Redimensionado para: ${w}×${h}`;
  });

  card.querySelector(".resize-download").addEventListener("click", async () => {
    const blob = await canvasToBlob(canvas, "image/png");
    if (!blob) {
      showToast("Redimensione a imagem primeiro.");
      return;
    }
    downloadBlob(blob, "imagem-redimensionada.png");
  });
}

/* ---------- Recortar Imagem ---------- */
function initCropCard(card) {
  if (!card) return;
  const fileInput = card.querySelector(".img-input");
  const canvas = card.querySelector(".crop-canvas");
  const ctx = canvas.getContext("2d");
  const info = card.querySelector(".img-info");
  let originalImg = null;
  let selection = null;
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let croppedCanvas = null;

  function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(originalImg, 0, 0, canvas.width, canvas.height);
    if (selection) {
      ctx.strokeStyle = "#5eead4";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(selection.x, selection.y, selection.w, selection.h);
      ctx.setLineDash([]);
    }
  }

  function canvasPos(evt) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (evt.clientX - rect.left) * scaleX, y: (evt.clientY - rect.top) * scaleY };
  }

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;
    originalImg = await loadImageFile(file);
    const maxW = 700;
    const scale = Math.min(1, maxW / originalImg.naturalWidth);
    canvas.width = Math.round(originalImg.naturalWidth * scale);
    canvas.height = Math.round(originalImg.naturalHeight * scale);
    selection = null;
    croppedCanvas = null;
    redraw();
    info.textContent = `Imagem carregada: ${originalImg.naturalWidth}×${originalImg.naturalHeight}`;
  });

  canvas.addEventListener("mousedown", (evt) => {
    if (!originalImg) return;
    dragging = true;
    const pos = canvasPos(evt);
    startX = pos.x;
    startY = pos.y;
    selection = { x: startX, y: startY, w: 0, h: 0 };
  });

  canvas.addEventListener("mousemove", (evt) => {
    if (!dragging) return;
    const pos = canvasPos(evt);
    selection = {
      x: Math.min(startX, pos.x),
      y: Math.min(startY, pos.y),
      w: Math.abs(pos.x - startX),
      h: Math.abs(pos.y - startY),
    };
    redraw();
  });

  window.addEventListener("mouseup", () => { dragging = false; });

  card.querySelector(".crop-processar").addEventListener("click", () => {
    if (!originalImg || !selection || selection.w < 2 || selection.h < 2) {
      showToast("Selecione uma área arrastando sobre a imagem.");
      return;
    }
    const scaleToOriginal = originalImg.naturalWidth / canvas.width;
    const sx = selection.x * scaleToOriginal;
    const sy = selection.y * scaleToOriginal;
    const sw = selection.w * scaleToOriginal;
    const sh = selection.h * scaleToOriginal;

    croppedCanvas = document.createElement("canvas");
    croppedCanvas.width = Math.round(sw);
    croppedCanvas.height = Math.round(sh);
    croppedCanvas.getContext("2d").drawImage(originalImg, sx, sy, sw, sh, 0, 0, croppedCanvas.width, croppedCanvas.height);
    info.textContent = `Recorte pronto: ${croppedCanvas.width}×${croppedCanvas.height}`;
  });

  card.querySelector(".crop-download").addEventListener("click", async () => {
    if (!croppedCanvas) {
      showToast("Clique em Recortar primeiro.");
      return;
    }
    const blob = await canvasToBlob(croppedCanvas, "image/png");
    downloadBlob(blob, "imagem-recortada.png");
  });
}

/* ---------- Foto em Preto e Branco ---------- */
function initBwCard(card) {
  if (!card) return;
  const fileInput = card.querySelector(".img-input");
  const canvas = card.querySelector(".img-canvas");
  let originalImg = null;

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;
    originalImg = await loadImageFile(file);
    drawImageToCanvas(canvas, originalImg);
  });

  card.querySelector(".bw-processar").addEventListener("click", () => {
    if (!originalImg) {
      showToast("Selecione uma imagem primeiro.");
      return;
    }
    const ctx = drawImageToCanvas(canvas, originalImg);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      data[i] = data[i + 1] = data[i + 2] = gray;
    }
    ctx.putImageData(imageData, 0, 0);
  });

  card.querySelector(".bw-download").addEventListener("click", async () => {
    const blob = await canvasToBlob(canvas, "image/png");
    if (!blob) {
      showToast("Selecione uma imagem primeiro.");
      return;
    }
    downloadBlob(blob, "imagem-pb.png");
  });
}

/* ---------- Converter JPG em PDF ---------- */
function getJpegDimensions(bytes) {
  let i = 2;
  while (i < bytes.length) {
    if (bytes[i] !== 0xff) { i++; continue; }
    const marker = bytes[i + 1];
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      const height = (bytes[i + 5] << 8) | bytes[i + 6];
      const width = (bytes[i + 7] << 8) | bytes[i + 8];
      return { width, height };
    }
    const length = (bytes[i + 2] << 8) | bytes[i + 3];
    i += 2 + length;
  }
  throw new Error("Não foi possível ler as dimensões do JPEG.");
}

function buildPdfFromJpegImages(images) {
  const A4_WIDTH = 595.28;
  const A4_HEIGHT = 841.89;
  const MARGIN = 20;

  const encoder = new TextEncoder();
  const chunks = [];
  const offsets = {};
  let currentOffset = 0;

  function append(bytesOrStr) {
    const bytes = typeof bytesOrStr === "string" ? encoder.encode(bytesOrStr) : bytesOrStr;
    chunks.push(bytes);
    currentOffset += bytes.length;
  }
  function track(num) { offsets[num] = currentOffset; }

  append("%PDF-1.4\n");

  let objNum = 3;
  const pageRefs = [];
  const pageBlocks = [];

  for (const img of images) {
    const pageNum = objNum++;
    const xobjNum = objNum++;
    const contentNum = objNum++;

    const maxW = A4_WIDTH - MARGIN * 2;
    const maxH = A4_HEIGHT - MARGIN * 2;
    const scale = Math.min(maxW / img.width, maxH / img.height, 1);
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const x = (A4_WIDTH - drawW) / 2;
    const y = (A4_HEIGHT - drawH) / 2;

    const contentStream = `q ${drawW.toFixed(2)} 0 0 ${drawH.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} cm /Im0 Do Q`;
    const contentBytes = encoder.encode(contentStream);

    pageBlocks.push({
      pageNum, xobjNum, contentNum,
      pageText: `${pageNum} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${A4_WIDTH} ${A4_HEIGHT}] /Resources << /XObject << /Im0 ${xobjNum} 0 R >> >> /Contents ${contentNum} 0 R >>\nendobj\n`,
      xobjHeader: `${xobjNum} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${img.width} /Height ${img.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.bytes.length} >>\nstream\n`,
      xobjBinary: img.bytes,
      xobjFooter: "\nendstream\nendobj\n",
      contentText: `${contentNum} 0 obj\n<< /Length ${contentBytes.length} >>\nstream\n${contentStream}\nendstream\nendobj\n`,
    });
    pageRefs.push(pageNum);
  }

  track(1);
  append(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`);
  track(2);
  append(`2 0 obj\n<< /Type /Pages /Kids [${pageRefs.map((n) => `${n} 0 R`).join(" ")}] /Count ${pageRefs.length} >>\nendobj\n`);

  for (const block of pageBlocks) {
    track(block.pageNum);
    append(block.pageText);
    track(block.xobjNum);
    append(block.xobjHeader);
    append(block.xobjBinary);
    append(block.xobjFooter);
    track(block.contentNum);
    append(block.contentText);
  }

  const totalObjects = objNum - 1;
  const xrefOffset = currentOffset;
  let xref = `xref\n0 ${totalObjects + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= totalObjects; i++) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  append(xref);
  append(`trailer\n<< /Size ${totalObjects + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  const totalLen = chunks.reduce((a, c) => a + c.length, 0);
  const result = new Uint8Array(totalLen);
  let pos = 0;
  for (const c of chunks) { result.set(c, pos); pos += c.length; }
  return result;
}

function initJpgToPdfCard(card) {
  if (!card) return;
  const fileInput = card.querySelector(".jpg2pdf-input");
  const info = card.querySelector(".img-info");
  let pdfBlob = null;

  card.querySelector(".jpg2pdf-gerar").addEventListener("click", async () => {
    const files = Array.from(fileInput.files);
    if (!files.length) {
      showToast("Selecione ao menos uma imagem JPEG.");
      return;
    }
    const images = [];
    for (const file of files) {
      const bytes = new Uint8Array(await file.arrayBuffer());
      let dims;
      try {
        dims = getJpegDimensions(bytes);
      } catch {
        info.textContent = `"${file.name}" não parece ser um JPEG válido.`;
        return;
      }
      images.push({ bytes, width: dims.width, height: dims.height });
    }
    const pdfBytes = buildPdfFromJpegImages(images);
    pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
    info.textContent = `PDF gerado com ${images.length} página(s), ${formatFileSize(pdfBlob.size)}.`;
  });

  card.querySelector(".jpg2pdf-download").addEventListener("click", () => {
    if (!pdfBlob) {
      showToast("Clique em Gerar PDF primeiro.");
      return;
    }
    downloadBlob(pdfBlob, "imagens.pdf");
  });
}

/* ---------- Juntar PDFs (best-effort, PDFs simples e não comprimidos) ---------- */
function bytesToLatin1(bytes) {
  let s = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    s += String.fromCharCode(...bytes.subarray(i, Math.min(i + chunkSize, bytes.length)));
  }
  return s;
}

function latin1ToBytes(str) {
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i) & 0xff;
  return bytes;
}

function scanPdfObjects(text) {
  const objects = new Map();
  const objRegex = /(\d+)\s+(\d+)\s+obj\b/g;
  let match;
  while ((match = objRegex.exec(text))) {
    const num = parseInt(match[1], 10);
    const start = match.index;
    const endIdx = text.indexOf("endobj", objRegex.lastIndex);
    if (endIdx === -1) continue;
    const end = endIdx + "endobj".length;
    objects.set(num, { start, end });
    objRegex.lastIndex = end;
  }
  return objects;
}

function pdfDictPartOf(text, obj) {
  const objText = text.slice(obj.start, obj.end);
  const streamIdx = objText.indexOf("stream");
  return streamIdx === -1 ? objText : objText.slice(0, streamIdx);
}

function extractPdfInfo(bytes) {
  const text = bytesToLatin1(bytes);
  const objects = scanPdfObjects(text);

  const trailerMatches = [...text.matchAll(/trailer\s*<<([\s\S]*?)>>/g)];
  let rootRef = null;
  if (trailerMatches.length) {
    const lastTrailer = trailerMatches[trailerMatches.length - 1][1];
    if (/\/Encrypt/.test(lastTrailer)) throw new Error("PDF criptografado não é suportado.");
    const rootMatch = lastTrailer.match(/\/Root\s+(\d+)\s+\d+\s+R/);
    if (rootMatch) rootRef = parseInt(rootMatch[1], 10);
  }
  if (!rootRef) {
    for (const [num, obj] of objects) {
      if (/\/Type\s*\/Catalog\b/.test(pdfDictPartOf(text, obj))) { rootRef = num; break; }
    }
  }
  if (!rootRef || !objects.has(rootRef)) {
    throw new Error("Não foi possível ler a estrutura deste PDF (pode usar streams de referência cruzada comprimidos, sem suporte aqui).");
  }

  const catalogDict = pdfDictPartOf(text, objects.get(rootRef));
  const pagesMatch = catalogDict.match(/\/Pages\s+(\d+)\s+\d+\s+R/);
  if (!pagesMatch) throw new Error("Estrutura de páginas não encontrada neste PDF.");
  const pagesRootNum = parseInt(pagesMatch[1], 10);

  const pageNums = [];
  function walk(num, depth) {
    if (depth > 50) throw new Error("Árvore de páginas malformada (profundidade excessiva).");
    if (!objects.has(num)) throw new Error(`Objeto ${num} não encontrado — PDF pode ter conteúdo comprimido sem suporte.`);
    const dict = pdfDictPartOf(text, objects.get(num));
    if (/\/Type\s*\/Pages\b/.test(dict)) {
      const kidsMatch = dict.match(/\/Kids\s*\[([^\]]*)\]/);
      if (!kidsMatch) throw new Error("Árvore de páginas malformada (sem /Kids).");
      const kidRefs = [...kidsMatch[1].matchAll(/(\d+)\s+\d+\s+R/g)].map((m) => parseInt(m[1], 10));
      kidRefs.forEach((k) => walk(k, depth + 1));
    } else if (/\/Type\s*\/Page\b/.test(dict)) {
      pageNums.push(num);
    } else {
      throw new Error(`Objeto ${num} referenciado como página não é /Page nem /Pages.`);
    }
  }
  walk(pagesRootNum, 0);
  if (!pageNums.length) throw new Error("Nenhuma página encontrada neste PDF.");

  function collectReachable(num, visited) {
    if (visited.has(num) || !objects.has(num)) return;
    visited.add(num);
    const dict = pdfDictPartOf(text, objects.get(num));
    const refs = [...dict.matchAll(/(\d+)\s+(\d+)\s+R\b/g)].map((m) => parseInt(m[1], 10));
    refs.forEach((r) => collectReachable(r, visited));
  }

  return { text, objects, pageNums, collectReachable };
}

function mergePdfBuffers(buffers) {
  const infos = buffers.map((b) => extractPdfInfo(new Uint8Array(b)));

  let nextNum = 3; // 1 = Catalog, 2 = Pages
  const allPageRefs = [];
  const outputParts = [];

  for (const info of infos) {
    const reachable = new Set();
    for (const pageNum of info.pageNums) info.collectReachable(pageNum, reachable);

    const idMap = new Map();
    for (const oldNum of reachable) idMap.set(oldNum, nextNum++);

    for (const oldNum of reachable) {
      const obj = info.objects.get(oldNum);
      const objText = info.text.slice(obj.start, obj.end);
      const streamIdx = objText.indexOf("stream");
      const dictPart = streamIdx === -1 ? objText : objText.slice(0, streamIdx);
      const restPart = streamIdx === -1 ? "" : objText.slice(streamIdx);

      let newDict = dictPart.replace(/^\d+\s+\d+\s+obj/, `${idMap.get(oldNum)} 0 obj`);
      newDict = newDict.replace(/(\d+)\s+(\d+)\s+R\b/g, (m, n) => {
        const refNum = parseInt(n, 10);
        return idMap.has(refNum) ? `${idMap.get(refNum)} 0 R` : m;
      });
      if (/\/Type\s*\/Page\b/.test(dictPart)) {
        newDict = newDict.replace(/\/Parent\s+\d+\s+\d+\s+R/, "/Parent 2 0 R");
      }

      outputParts.push({ num: idMap.get(oldNum), text: `${newDict}${restPart}` });
    }
    allPageRefs.push(...info.pageNums.map((p) => idMap.get(p)));
  }

  const chunks = [];
  const offsets = {};
  let currentOffset = 0;
  function append(str) {
    const bytes = latin1ToBytes(str);
    chunks.push(bytes);
    currentOffset += bytes.length;
  }
  function track(num) { offsets[num] = currentOffset; }

  append("%PDF-1.4\n");
  track(1);
  append(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`);
  track(2);
  append(`2 0 obj\n<< /Type /Pages /Kids [${allPageRefs.map((n) => `${n} 0 R`).join(" ")}] /Count ${allPageRefs.length} >>\nendobj\n`);

  for (const part of outputParts) {
    track(part.num);
    append(`${part.text}\n`);
  }

  const totalObjects = nextNum - 1;
  const xrefOffset = currentOffset;
  let xref = `xref\n0 ${totalObjects + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= totalObjects; i++) {
    xref += `${String(offsets[i] ?? 0).padStart(10, "0")} 00000 n \n`;
  }
  append(xref);
  append(`trailer\n<< /Size ${totalObjects + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  const totalLen = chunks.reduce((a, c) => a + c.length, 0);
  const result = new Uint8Array(totalLen);
  let pos = 0;
  for (const c of chunks) { result.set(c, pos); pos += c.length; }
  return result;
}

function initMergePdfCard(card) {
  if (!card) return;
  const fileInput = card.querySelector(".pdf-merge-input");
  const info = card.querySelector(".img-info");
  let mergedBlob = null;

  card.querySelector(".pdf-merge-gerar").addEventListener("click", async () => {
    const files = Array.from(fileInput.files);
    if (files.length < 2) {
      showToast("Selecione ao menos 2 PDFs.");
      return;
    }
    try {
      const buffers = await Promise.all(files.map((f) => f.arrayBuffer()));
      const mergedBytes = mergePdfBuffers(buffers);
      mergedBlob = new Blob([mergedBytes], { type: "application/pdf" });
      info.textContent = `PDF gerado com sucesso a partir de ${files.length} arquivo(s), ${formatFileSize(mergedBlob.size)}.`;
    } catch (err) {
      mergedBlob = null;
      info.textContent = `Não foi possível juntar: ${err.message}`;
    }
  });

  card.querySelector(".pdf-merge-download").addEventListener("click", () => {
    if (!mergedBlob) {
      showToast("Clique em Juntar primeiro.");
      return;
    }
    downloadBlob(mergedBlob, "pdfs-unidos.pdf");
  });
}
