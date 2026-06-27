const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({ size: 'A4', margin: 0 });
const outputPath = '/opt/data/level-up-design-screenshots.pdf';
doc.pipe(fs.createWriteStream(outputPath));

const screenshots = [
  { file: '01-dashboard.png', title: 'Dashboard - الصفحة الرئيسية' },
  { file: '02-skill-tree.png', title: 'Skill Tree - شجرة المهارات المتصلة' },
  { file: '03-focus.png', title: 'Focus Mode - وضع التركيز' },
  { file: '04-ideas.png', title: 'مركز الأفكار والمشاريع' },
  { file: '05-courses.png', title: 'مركز الكورسات' },
  { file: '06-achievements.png', title: 'الإنجازات' },
  { file: '07-roadmap.png', title: 'خارطة الطريق' },
  { file: '08-quests.png', title: 'الكويستس' },
  { file: '09-rewards.png', title: 'متجر المكافآت' },
  { file: '10-community.png', title: 'المجتمع' },
];

const pageWidth = 595.28;
const pageHeight = 841.89;
const screenshotsDir = '/opt/data/screenshots';

screenshots.forEach((ss, i) => {
  if (i > 0) doc.addPage();
  
  // Background
  doc.rect(0, 0, pageWidth, pageHeight).fill('#06060e');
  
  // Header
  doc.rect(0, 0, pageWidth, 50).fill('#0c0c1a');
  doc.rect(0, 48, pageWidth, 2).fill('#a855f7');
  
  // Logo
  doc.fontSize(16).fillColor('#f0f0ff').text('Level Up', 20, 18);
  doc.fontSize(8).fillColor('#8888aa').text('Level up your life', 20, 32);
  
  // Page title
  doc.fontSize(10).fillColor('#8888aa').text(ss.title, pageWidth - 20, 22, { align: 'right' });
  
  // Screenshot
  const imgPath = path.join(screenshotsDir, ss.file);
  if (fs.existsSync(imgPath)) {
    const imgWidth = pageWidth - 30;
    const imgHeight = (imgWidth / 1400) * 900;
    doc.image(imgPath, 15, 60, { 
      width: imgWidth, 
      height: Math.min(imgHeight, pageHeight - 100),
      align: 'center'
    });
  } else {
    doc.fontSize(14).fillColor('#555577').text('Screenshot not available', pageWidth / 2, 300, { align: 'center' });
  }
  
  // Footer
  doc.rect(0, pageHeight - 25, pageWidth, 25).fill('#0c0c1a');
  doc.fontSize(8).fillColor('#555577').text(`Level Up v2 · ${i + 1}/${screenshots.length}`, pageWidth / 2, pageHeight - 12, { align: 'center' });
});

doc.end();
console.log('PDF created: ' + outputPath);
console.log('Size: ' + (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2) + ' MB');
