import { encodeQR } from "./qr";

export interface ShareCardData {
  type: "thought" | "post";
  content?: string; // thought text or post plain text excerpt
  title?: string; // post title
  description?: string; // post description
  date: string; // e.g. "2026-03-24"
  url: string; // full page URL for QR code
  lang?: string; // "zh" or "en"
}

/**
 * Generate a share card as a base64-encoded PNG data URL.
 * Renders on an offscreen canvas with Retina support.
 */
export function generateShareCard(data: ShareCardData): string {
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const cssWidth = 360;
  const canvasWidth = cssWidth * dpr;
  const padding = 32 * dpr;
  const fontFamily =
    '-apple-system, "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif';

  // Font sizes
  const bodyFontSize = 15 * dpr;
  const titleFontSize = 18 * dpr;
  const footerFontSize = 12 * dpr;
  const metaFontSize = 11 * dpr;
  const lineHeight = 1.7;
  const qrSize = 90 * dpr;
  const cornerRadius = 12 * dpr;

  // Create a temporary canvas to measure text
  const tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = canvasWidth;
  tmpCanvas.height = 100;
  const tmpCtx = tmpCanvas.getContext("2d")!;

  const maxTextWidth = canvasWidth - padding * 2;

  // Prepare text lines
  let textLines: string[] = [];
  let titleLines: string[] = [];

  if (data.type === "thought" && data.content) {
    const truncated =
      data.content.length > 200
        ? data.content.slice(0, 200) + "..."
        : data.content;
    tmpCtx.font = `${bodyFontSize}px ${fontFamily}`;
    textLines = wrapText(tmpCtx, truncated, maxTextWidth);
  } else if (data.type === "post") {
    if (data.title) {
      tmpCtx.font = `bold ${titleFontSize}px ${fontFamily}`;
      titleLines = wrapText(tmpCtx, data.title, maxTextWidth);
    }
    const postText = data.content
      ? data.content.length > 150
        ? data.content.slice(0, 150) + "..."
        : data.content
      : data.description || "";
    if (postText) {
      tmpCtx.font = `${bodyFontSize}px ${fontFamily}`;
      textLines = wrapText(tmpCtx, postText, maxTextWidth);
    }
  }

  // "分享于" / "Shared on" line
  const isZh = data.lang !== "en";
  const sharedDateText = isZh
    ? `分享于 ${formatDateSlash(data.date)}`
    : `Shared on ${formatDateEn(data.date)}`;

  // Calculate total height
  let contentHeight = 0;

  if (titleLines.length > 0) {
    contentHeight += titleLines.length * titleFontSize * lineHeight;
    if (textLines.length > 0) {
      contentHeight += 8 * dpr;
    }
  }
  if (textLines.length > 0) {
    contentHeight += textLines.length * bodyFontSize * lineHeight;
  }

  const metaGap = 16 * dpr; // gap before "分享于"
  const metaHeight = metaFontSize * 1.5;
  const separatorGap = 16 * dpr;
  const footerHeight = qrSize;
  const totalHeight =
    padding +
    contentHeight +
    metaGap +
    metaHeight +
    separatorGap +
    1 * dpr +
    separatorGap +
    footerHeight +
    padding;

  // Create final canvas
  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = totalHeight;
  const ctx = canvas.getContext("2d")!;

  // Draw white rounded rect background
  ctx.fillStyle = "#ffffff";
  drawRoundedRect(ctx, 0, 0, canvasWidth, totalHeight, cornerRadius);
  ctx.fill();

  // Draw text content
  let cursorY = padding;

  // Title (for posts)
  if (titleLines.length > 0) {
    ctx.font = `bold ${titleFontSize}px ${fontFamily}`;
    ctx.fillStyle = "#1a1a1a";
    ctx.textBaseline = "top";
    for (const line of titleLines) {
      ctx.fillText(line, padding, cursorY);
      cursorY += titleFontSize * lineHeight;
    }
    if (textLines.length > 0) {
      cursorY += 8 * dpr;
    }
  }

  // Body text
  if (textLines.length > 0) {
    ctx.font = `${bodyFontSize}px ${fontFamily}`;
    ctx.fillStyle = "#333333";
    ctx.textBaseline = "top";
    for (const line of textLines) {
      ctx.fillText(line, padding, cursorY);
      cursorY += bodyFontSize * lineHeight;
    }
  }

  // "分享于 2026/3/24" above separator
  cursorY += metaGap;
  ctx.font = `${metaFontSize}px ${fontFamily}`;
  ctx.fillStyle = "#bbbbbb";
  ctx.textBaseline = "top";
  ctx.fillText(sharedDateText, padding, cursorY);
  cursorY += metaHeight;

  // Dashed separator
  cursorY += separatorGap;
  ctx.strokeStyle = "#e5e5e5";
  ctx.lineWidth = 1 * dpr;
  ctx.setLineDash([4 * dpr, 4 * dpr]);
  ctx.beginPath();
  ctx.moveTo(padding, cursorY);
  ctx.lineTo(canvasWidth - padding, cursorY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Footer: domain left, QR code right, vertically centered
  cursorY += separatorGap;
  const footerY = cursorY;

  // Draw QR code on the RIGHT side with quiet zone
  let actualQrSize = qrSize;
  try {
    const qrMatrix = encodeQR(data.url);
    const qrModules = qrMatrix.length;
    const quietZone = 3;
    const totalModules = qrModules + quietZone * 2;
    const moduleSize = Math.floor(qrSize / totalModules);
    actualQrSize = moduleSize * totalModules;
    const qrOffsetX = canvasWidth - padding - actualQrSize; // right-aligned
    const qrOffsetY = footerY;

    // White background for QR area (quiet zone)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(qrOffsetX, qrOffsetY, actualQrSize, actualQrSize);

    // Draw black modules
    ctx.fillStyle = "#000000";
    for (let row = 0; row < qrModules; row++) {
      for (let col = 0; col < qrModules; col++) {
        if (qrMatrix[row][col]) {
          ctx.fillRect(
            qrOffsetX + (col + quietZone) * moduleSize,
            qrOffsetY + (row + quietZone) * moduleSize,
            moduleSize,
            moduleSize
          );
        }
      }
    }
  } catch {
    // If QR fails, leave blank
  }

  // Domain text on the LEFT, vertically centered with QR code
  const footerCenterY = footerY + actualQrSize / 2;
  ctx.fillStyle = "#999999";
  ctx.font = `${footerFontSize}px ${fontFamily}`;
  ctx.textBaseline = "middle";
  ctx.fillText("bryantchen.cc", padding, footerCenterY);

  return canvas.toDataURL("image/png");
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const paragraphs = text.split("\n");
  const lines: string[] = [];
  for (const para of paragraphs) {
    if (para === "") {
      lines.push("");
      continue;
    }
    let current = "";
    for (const char of para) {
      if (ctx.measureText(current + char).width > maxWidth) {
        lines.push(current);
        current = char;
      } else {
        current += char;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function formatDateSlash(dateStr: string): string {
  const d = new Date(dateStr.includes("T") ? dateStr : dateStr + "T00:00:00");
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

function formatDateEn(dateStr: string): string {
  const d = new Date(dateStr.includes("T") ? dateStr : dateStr + "T00:00:00");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
