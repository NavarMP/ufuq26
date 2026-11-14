import QRCode from 'qrcode';

export interface SvgQrOptions {
  text: string;
  darkColor?: string;
  lightColor?: string;
  margin?: number;
  width?: number;
}

/**
 * Generates an SVG string representation of a QR code suitable for vector graphics and sharp printing.
 */
export async function formatQrToSvg(options: SvgQrOptions): Promise<string> {
  const {
    text,
    darkColor = '#0B132B',
    lightColor = '#FFFFFF',
    margin = 1,
    width = 300,
  } = options;

  return new Promise((resolve, reject) => {
    QRCode.toString(
      text,
      {
        type: 'svg',
        errorCorrectionLevel: 'H',
        margin,
        width,
        color: {
          dark: darkColor,
          light: lightColor,
        },
      },
      (err, svgString) => {
        if (err) reject(err);
        else resolve(svgString);
      }
    );
  });
}
