import { AgentProfile, PerformanceAnalysis } from '../types/game';

/**
 * High-resolution (1600x1100) canvas certificate generator.
 * Bypasses html2canvas / CSS oklch color parsing limitations to guarantee
 * 100% foolproof, ultra-crisp PNG downloads on all browsers, mobile, and tablets.
 */
export async function generateCertificatePNG(
  agent: AgentProfile,
  performance: PerformanceAnalysis
): Promise<string> {
  const width = 1600;
  const height = 1100;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // 1. Background Parchment Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#fffbeb'); // warm cream
  bgGrad.addColorStop(0.5, '#fef3c7'); // soft amber
  bgGrad.addColorStop(1, '#fde68a'); // gold parchment
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Ornate Double Gold Borders
  ctx.strokeStyle = '#92400e'; // dark amber
  ctx.lineWidth = 14;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  ctx.strokeStyle = '#d97706'; // gold highlight
  ctx.lineWidth = 4;
  ctx.strokeRect(48, 48, width - 96, height - 96);

  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 2;
  ctx.strokeRect(58, 58, width - 116, height - 116);

  // Corner Ornaments
  const drawCorner = (x: number, y: number, angle: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  };

  drawCorner(58, 58, 0);
  drawCorner(width - 58, 58, 0);
  drawCorner(58, height - 58, 0);
  drawCorner(width - 58, height - 58, 0);

  // 3. Watermark Crest in Center
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, 260, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 4. Header Badge / Crest
  const crestX = width / 2;
  const crestY = 125;
  const crestGrad = ctx.createRadialGradient(crestX, crestY, 5, crestX, crestY, 45);
  crestGrad.addColorStop(0, '#f59e0b');
  crestGrad.addColorStop(1, '#92400e');
  ctx.fillStyle = crestGrad;
  ctx.beginPath();
  ctx.arc(crestX, crestY, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Star symbol inside crest
  ctx.fillStyle = '#fffbeb';
  ctx.font = 'bold 36px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('★', crestX, crestY + 2);

  // 5. Header Typography
  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('BADAN PENYIASATAN KHAS & FORENSIK RIMBA', width / 2, 205);

  ctx.fillStyle = '#451a03';
  ctx.font = '900 46px "Times New Roman", Georgia, serif';
  ctx.fillText('SIJIL PENTAULIAHAN DETEKTIF', width / 2, 265);

  // Decorative divider line
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 280, 285);
  ctx.lineTo(width / 2 + 280, 285);
  ctx.stroke();

  ctx.fillStyle = '#78350f';
  ctx.font = 'italic 22px "Times New Roman", serif';
  ctx.fillText('Dengan penuh pengiktirafan dan kepujian rasmi diperakui bahawa:', width / 2, 330);

  // 6. Recipient Name
  ctx.fillStyle = '#451a03';
  ctx.font = 'bold 52px "Times New Roman", Georgia, serif';
  ctx.fillText(agent.name, width / 2, 405);

  // Underline beneath name
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 320, 430);
  ctx.lineTo(width / 2 + 320, 430);
  ctx.stroke();

  // 7. Class, School, Agent ID Metadata
  ctx.fillStyle = '#78350f';
  ctx.font = '22px sans-serif';
  const metaText = `Kelas: ${agent.classroom}    •    Sekolah: ${agent.school}    •    No. Ejen: ${agent.agentId}`;
  ctx.fillText(metaText, width / 2, 475);

  // 8. Citation Paragraph
  ctx.fillStyle = '#451a03';
  ctx.font = '20px "Times New Roman", serif';
  const citation1 = 'Telah menunjukkan kecemerlangan pemikiran kritis, analisis bukti forensik dan ketangkasan kawalan jari kamera dalam';
  const citation2 = 'menyelesaikan Siasatan Bilik Terkurung: Kes Sang Buaya, Kerbau dan Sang Kancil,';
  const citation3 = 'berjaya merungkai kebenaran di sebalik pengkhianatan dan tipu helah pemangsa rimba.';
  ctx.fillText(citation1, width / 2, 530);
  ctx.font = 'bold 22px "Times New Roman", serif';
  ctx.fillText(citation2, width / 2, 565);
  ctx.font = '20px "Times New Roman", serif';
  ctx.fillText(citation3, width / 2, 600);

  // 9. Score & Rank Pills
  const drawPill = (x: number, y: number, w: number, h: number, text: string, bg: string, textCol: string) => {
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - h / 2, w, h, 14);
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = textCol;
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(text, x, y + 2);
  };

  const pillY = 670;
  drawPill(420, pillY, 270, 50, `Markah: ${performance.totalScore} / 100 (${performance.percentage}%)`, '#fef3c7', '#78350f');
  drawPill(710, pillY, 160, 50, `Gred: ${performance.rankGrade}`, '#fef3c7', '#78350f');
  drawPill(1080, pillY, 440, 50, performance.rankTitle, '#78350f', '#fffbeb');

  // Divider above footer
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(100, 755);
  ctx.lineTo(width - 100, 755);
  ctx.stroke();

  // 10. Left Signature (Sang Kancil)
  ctx.fillStyle = '#451a03';
  ctx.font = 'italic bold 32px "Brush Script MT", cursive, "Times New Roman"';
  ctx.fillText('Sang Kancil', 280, 840);

  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(160, 865);
  ctx.lineTo(400, 865);
  ctx.stroke();

  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('Sang Kancil, S.P.R.', 280, 895);
  ctx.font = '16px "Times New Roman", serif';
  ctx.fillText('Ketua Hakim & Siasatan Rimba', 280, 922);

  // 11. Center Official Gold Seal
  const sealX = width / 2;
  const sealY = 870;
  const sealGrad = ctx.createRadialGradient(sealX, sealY, 10, sealX, sealY, 65);
  sealGrad.addColorStop(0, '#fef08a');
  sealGrad.addColorStop(0.5, '#f59e0b');
  sealGrad.addColorStop(1, '#b45309');
  ctx.fillStyle = sealGrad;
  ctx.beginPath();
  ctx.arc(sealX, sealY, 60, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = '#451a03';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('MOHOR RASMI', sealX, sealY - 14);
  ctx.fillText('PENTAULIAHAN', sealX, sealY);
  ctx.fillText('2026 - SAH', sealX, sealY + 14);

  const formattedDate = new Intl.DateTimeFormat('ms-MY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(agent.startedAt));
  ctx.font = 'bold 16px monospace';
  ctx.fillStyle = '#78350f';
  ctx.fillText(formattedDate, sealX, sealY + 95);

  // 12. Right Verification Code & Barcode
  const rightX = width - 280;
  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 15px monospace';
  ctx.fillText('KOD VERIFIKASI RASMI:', rightX, 825);

  // Code Box
  ctx.fillStyle = '#fef3c7';
  ctx.beginPath();
  ctx.roundRect(rightX - 120, 840, 240, 40, 8);
  ctx.fill();
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#451a03';
  ctx.font = 'bold 20px monospace';
  ctx.fillText(agent.certificateCode, rightX, 866);

  // Barcode simulation
  const barStartY = 895;
  const barWidthTotal = 200;
  const barStartX = rightX - barWidthTotal / 2;
  ctx.fillStyle = '#451a03';
  for (let i = 0; i < 28; i++) {
    const barW = (i % 3 === 0) ? 5 : (i % 2 === 0) ? 3 : 2;
    const barX = barStartX + (i * 7);
    ctx.fillRect(barX, barStartY, barW, 26);
  }

  ctx.font = '12px monospace';
  ctx.fillText('KES-BUAYA-KERBAU-KANCIL', rightX, 938);

  return canvas.toDataURL('image/png', 1.0);
}
