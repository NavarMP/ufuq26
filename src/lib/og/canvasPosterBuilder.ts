import QRCode from 'qrcode';
import { SharePayload, StoryTheme, StoryFormat } from '@/types/share';

/**
 * Client-side canvas graphics engine for exporting pristine 1080x1920 Instagram Story cards
 * and 1200x630 landscape feed posters.
 */
export async function renderPosterToCanvas(
  canvas: HTMLCanvasElement,
  payload: SharePayload,
  theme: StoryTheme = 'horizon',
  format: StoryFormat = 'story'
): Promise<void> {
  const isStory = format === 'story';
  const width = isStory ? 1080 : 1200;
  const height = isStory ? 1920 : 630;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Rich Deep Midnight Navy Gradient Background
  const bgGrad = ctx.createRadialGradient(
    width * 0.5,
    height * (isStory ? 0.35 : 0.4),
    width * 0.1,
    width * 0.5,
    height * 0.5,
    Math.max(width, height) * 0.8
  );
  bgGrad.addColorStop(0, '#16253f'); // Bright midnight navy glow
  bgGrad.addColorStop(0.5, '#101d32'); // Brand navy
  bgGrad.addColorStop(1, '#070b13'); // Deep obsidian
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Decorative Geometric Starburst & Celestial Rings
  ctx.save();
  ctx.strokeStyle = 'rgba(201, 164, 92, 0.12)';
  ctx.lineWidth = 1.5;

  const ringCenterY = isStory ? height * 0.38 : height * 0.5;
  const ringRadiusBase = Math.min(width, height) * 0.28;

  for (let r = 1; r <= 4; r++) {
    ctx.beginPath();
    ctx.arc(width * 0.5, ringCenterY, ringRadiusBase * (r * 0.4), 0, Math.PI * 2);
    ctx.stroke();
  }

  // Draw 8-point geometric star pattern lines
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI / 4) * i;
    ctx.beginPath();
    ctx.moveTo(width * 0.5, ringCenterY);
    ctx.lineTo(
      width * 0.5 + Math.cos(angle) * (ringRadiusBase * 1.8),
      ringCenterY + Math.sin(angle) * (ringRadiusBase * 1.8)
    );
    ctx.stroke();
  }
  ctx.restore();

  // 3. Luxurious Double Gold Border Frame
  const margin = isStory ? 54 : 32;
  const innerMargin = margin + 12;

  // Outer border
  ctx.save();
  ctx.strokeStyle = 'rgba(201, 164, 92, 0.45)';
  ctx.lineWidth = 2.5;
  roundRect(ctx, margin, margin, width - margin * 2, height - margin * 2, 36);
  ctx.stroke();

  // Thin inner hairline border
  ctx.strokeStyle = 'rgba(201, 164, 92, 0.2)';
  ctx.lineWidth = 1;
  roundRect(ctx, innerMargin, innerMargin, width - innerMargin * 2, height - innerMargin * 2, 28);
  ctx.stroke();

  // Corner decorative diamond marks
  const corners = [
    [innerMargin, innerMargin],
    [width - innerMargin, innerMargin],
    [innerMargin, height - innerMargin],
    [width - innerMargin, height - innerMargin],
  ];
  ctx.fillStyle = '#f5ad1f';
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // 4. Header Badge & ADSA Banner
  ctx.save();
  ctx.textAlign = 'center';

  // Sub-badge: Organizers
  const topTextY = isStory ? 150 : 80;
  ctx.font = '600 24px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#c9a45c';
  ctx.letterSpacing = '3px';
  ctx.fillText('ALATHURPADI DARS STUDENTS ASSOCIATION (ADSA)', width * 0.5, topTextY);

  ctx.font = '500 18px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(245, 240, 232, 0.7)';
  ctx.letterSpacing = '1.5px';
  ctx.fillText('PRESENTS FOR SUFFA DARS GRADUATING SCHOLARS', width * 0.5, topTextY + 34);
  ctx.restore();

  // 5. Arabic Calligraphy: أُفُق
  ctx.save();
  ctx.textAlign = 'center';
  const arabicY = isStory ? 350 : 170;
  ctx.font = 'bold 96px "DG Sahabah", "Traditional Arabic", "Amiri", serif';
  ctx.fillStyle = '#f5ad1f'; // Warm gold
  ctx.shadowColor = 'rgba(245, 173, 31, 0.4)';
  ctx.shadowBlur = 24;
  ctx.fillText('أُفُق', width * 0.5, arabicY);
  ctx.restore();

  // 6. Title: UFUQ ’26
  ctx.save();
  ctx.textAlign = 'center';
  const englishTitleY = isStory ? 470 : 250;
  ctx.font = '800 84px "Clash Display", -apple-system, system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 18;
  ctx.fillText('UFUQ ’26', width * 0.5, englishTitleY);

  // Subtitle
  const descY = isStory ? 540 : 298;
  ctx.font = '600 32px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#c9a45c';
  ctx.fillText('A Transition & Leadership Camp', width * 0.5, descY);

  // Tagline
  ctx.font = 'italic 26px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#f5f0e8';
  ctx.fillText('“Rooted in Ilm. Ready for the World.”', width * 0.5, descY + 46);
  ctx.restore();

  // 7. Middle Dynamic Card depending on chosen Theme
  if (theme === 'pass' && payload.attendee) {
    // --- THEME: ATTENDEE DIGITAL PASS ---
    const cardY = isStory ? 710 : 360;
    const cardW = width * 0.86;
    const cardH = isStory ? 520 : 180;
    const cardX = (width - cardW) / 2;

    // Card background panel
    ctx.save();
    ctx.fillStyle = 'rgba(16, 29, 50, 0.85)';
    ctx.strokeStyle = 'rgba(201, 164, 92, 0.5)';
    ctx.lineWidth = 2;
    roundRect(ctx, cardX, cardY, cardW, cardH, 28);
    ctx.fill();
    ctx.stroke();

    // Top pill badge: OFFICIAL ATTENDEE PASS
    ctx.fillStyle = '#c9a45c';
    roundRect(ctx, cardX + cardW / 2 - 170, cardY - 20, 340, 40, 20);
    ctx.fill();
    ctx.fillStyle = '#101d32';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('OFFICIAL ATTENDEE PASS', cardX + cardW / 2, cardY + 6);

    // Attendee Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(payload.attendee.fullName.toUpperCase(), cardX + cardW / 2, cardY + 90);

    // SUFFA Dars info
    if (payload.attendee.darsName) {
      ctx.fillStyle = '#d4b577';
      ctx.font = '600 24px system-ui, sans-serif';
      ctx.fillText(payload.attendee.darsName, cardX + cardW / 2, cardY + 140);
    }

    if (payload.attendee.darsRegNo) {
      ctx.fillStyle = 'rgba(245, 240, 232, 0.7)';
      ctx.font = '500 20px monospace';
      ctx.fillText(`SUFFA Reg No: ${payload.attendee.darsRegNo}`, cardX + cardW / 2, cardY + 175);
    }

    // Reference ID & Status
    const refY = isStory ? cardY + 260 : cardY + 120;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    roundRect(ctx, cardX + 50, refY, cardW - 100, 90, 18);
    ctx.fill();

    ctx.fillStyle = '#f5ad1f';
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(payload.attendee.refId, cardX + cardW / 2, refY + 44);

    ctx.fillStyle = '#10b981'; // Emerald confirmed
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText('✓ ADMISSION CONFIRMED', cardX + cardW / 2, refY + 74);

    // "I'm Attending!" badge banner
    if (isStory) {
      ctx.fillStyle = '#c9a45c';
      ctx.font = '800 36px system-ui, sans-serif';
      ctx.fillText("I'M ATTENDING UFUQ ’26", cardX + cardW / 2, cardY + 430);
    }
    ctx.restore();
  } else if (theme === 'session' && payload.session) {
    // --- THEME: SESSION SPOTLIGHT ---
    const cardY = isStory ? 730 : 360;
    const cardW = width * 0.86;
    const cardH = isStory ? 480 : 180;
    const cardX = (width - cardW) / 2;

    ctx.save();
    ctx.fillStyle = 'rgba(16, 29, 50, 0.85)';
    ctx.strokeStyle = 'rgba(201, 164, 92, 0.5)';
    ctx.lineWidth = 2;
    roundRect(ctx, cardX, cardY, cardW, cardH, 28);
    ctx.fill();
    ctx.stroke();

    // Day & Category Badge
    const badgeText = `DAY ${payload.session.day} · ${payload.session.category?.toUpperCase() || 'SESSION'}`;
    ctx.fillStyle = '#c9a45c';
    roundRect(ctx, cardX + cardW / 2 - 140, cardY - 20, 280, 40, 20);
    ctx.fill();
    ctx.fillStyle = '#101d32';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(badgeText, cardX + cardW / 2, cardY + 6);

    // Session Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px system-ui, sans-serif';
    wrapText(ctx, payload.session.title.en, cardX + cardW / 2, cardY + 80, cardW - 80, 44);

    // Time
    ctx.fillStyle = '#f5ad1f';
    ctx.font = '600 24px monospace';
    ctx.fillText(`${payload.session.startTime} — ${payload.session.endTime}`, cardX + cardW / 2, cardY + 220);

    // Speaker Name
    if (payload.session.speaker) {
      ctx.fillStyle = '#f5f0e8';
      ctx.font = 'italic 24px system-ui, sans-serif';
      ctx.fillText(`Led by ${payload.session.speaker}`, cardX + cardW / 2, cardY + 270);
    }
    ctx.restore();
  } else {
    // --- THEME: DEFAULT CAMP HORIZON ---
    const cardY = isStory ? 760 : 360;
    const cardW = width * 0.86;
    const cardH = isStory ? 420 : 170;
    const cardX = (width - cardW) / 2;

    ctx.save();
    ctx.fillStyle = 'rgba(16, 29, 50, 0.85)';
    ctx.strokeStyle = 'rgba(201, 164, 92, 0.5)';
    ctx.lineWidth = 2;
    roundRect(ctx, cardX, cardY, cardW, cardH, 28);
    ctx.fill();
    ctx.stroke();

    // Seven-day highlight
    ctx.fillStyle = '#c9a45c';
    roundRect(ctx, cardX + cardW / 2 - 190, cardY - 20, 380, 40, 20);
    ctx.fill();
    ctx.fillStyle = '#101d32';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SEVEN DAYS OF TRANSFORMATION', cardX + cardW / 2, cardY + 6);

    // Date
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px system-ui, sans-serif';
    ctx.fillText('DECEMBER 24–30, 2026', cardX + cardW / 2, cardY + 90);

    // Venue
    ctx.fillStyle = '#f5ad1f';
    ctx.font = '600 28px system-ui, sans-serif';
    ctx.fillText('Alathurpadi Dars Campus', cardX + cardW / 2, cardY + 150);

    ctx.fillStyle = 'rgba(245, 240, 232, 0.8)';
    ctx.font = '500 22px system-ui, sans-serif';
    ctx.fillText('Malappuram, Kerala, India', cardX + cardW / 2, cardY + 195);

    if (isStory) {
      // Key pillars
      const pillars = ['ACADEMIC TRANSITION', 'LEADERSHIP EXCELLENCE', 'MORAL ROOTS'];
      const pillY = cardY + 290;
      pillars.forEach((pil, idx) => {
        ctx.fillStyle = 'rgba(201, 164, 92, 0.15)';
        ctx.strokeStyle = 'rgba(201, 164, 92, 0.35)';
        ctx.lineWidth = 1;
        const px = cardX + 40 + idx * 260;
        roundRect(ctx, px, pillY, 240, 60, 16);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px system-ui, sans-serif';
        ctx.fillText(pil, px + 120, pillY + 36);
      });
    }
    ctx.restore();
  }

  // 8. Bottom Section: QR Code & Call to Action
  if (isStory) {
    const qrSize = 220;
    const qrX = (width - qrSize) / 2;
    const qrY = 1380;

    // Generate dynamic QR Code DataURL
    try {
      const qrDataUrl = await QRCode.toDataURL(payload.url, {
        width: qrSize,
        margin: 1,
        color: { dark: '#101d32', light: '#ffffff' },
        errorCorrectionLevel: 'H',
      });

      const qrImg = await loadImage(qrDataUrl);
      ctx.save();
      // White protective card behind QR code
      ctx.fillStyle = '#ffffff';
      roundRect(ctx, qrX - 16, qrY - 16, qrSize + 32, qrSize + 32, 24);
      ctx.fill();
      ctx.strokeStyle = '#c9a45c';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

      // Centered UFUQ logo on QR code
      const logoBadgeSize = 50;
      const logoCenter = qrX + qrSize / 2;
      const logoCenterY = qrY + qrSize / 2;
      ctx.beginPath();
      ctx.arc(logoCenter, logoCenterY, logoBadgeSize / 2 + 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(logoCenter, logoCenterY, logoBadgeSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = '#101d32';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#c9a45c';
      ctx.stroke();

      ctx.font = 'bold 16px sans-serif';
      ctx.fillStyle = '#c9a45c';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('أُفُق', logoCenter, logoCenterY);
      ctx.restore();
    } catch {
      // Fallback if QR generator fails
    }

    // Call to Action
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = 'bold 24px system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('SCAN WITH PHONE CAMERA TO EXPLORE', width * 0.5, qrY + qrSize + 60);

    ctx.font = '600 20px monospace';
    ctx.fillStyle = '#c9a45c';
    ctx.fillText('https://alathurpadidars.in', width * 0.5, qrY + qrSize + 95);

    ctx.font = '500 16px system-ui, sans-serif';
    ctx.fillStyle = 'rgba(245, 240, 232, 0.5)';
    ctx.fillText('Alathurpadi Dars Students Association · SUFFA Dars', width * 0.5, height - 75);
    ctx.restore();
  } else {
    // 16:9 Feed post bottom
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = '600 16px monospace';
    ctx.fillStyle = '#c9a45c';
    ctx.fillText('alathurpadidars.in · December 24–30, 2026', width * 0.5, height - 44);
    ctx.restore();
  }
}

/**
 * Utility: Draws a rounded rectangle path
 */
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Utility: Wraps text to multiple lines within a maximum width
 */
function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';
  let curY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, curY);
}

/**
 * Utility: Promise-based image loader
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}
