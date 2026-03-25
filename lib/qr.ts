import qrcode from "qrcode-generator";

/**
 * Encode a URL into a QR code boolean matrix.
 * Uses qrcode-generator (battle-tested, ~3KB).
 */
export function encodeQR(url: string): boolean[][] {
  const qr = qrcode(0, "L"); // type 0 = auto version, L = low error correction
  qr.addData(url);
  qr.make();

  const size = qr.getModuleCount();
  const matrix: boolean[][] = [];
  for (let row = 0; row < size; row++) {
    const line: boolean[] = [];
    for (let col = 0; col < size; col++) {
      line.push(qr.isDark(row, col));
    }
    matrix.push(line);
  }
  return matrix;
}
