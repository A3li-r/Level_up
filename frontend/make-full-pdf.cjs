const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument({ size: 'A4', margin: 0 });
const outputPath = '/opt/data/level-up-design-screenshots.pdf';
doc.pipe(fs.createWriteStream(outputPath));

const pageWidth = 595.28;
const pageHeight = 841.89;

const pages = [
  { img: '/opt/data/screenshots/01-dashboard.png', title: 'Dashboard - الصفحة الرئيسية' },
  { img: '/opt/data/screenshots/02-skill-tree.png', title: 'Skill Tree - شجرة المهارات المتصلة' },
  { img: '/opt/data/screenshots/03-focus.png', title: 'Focus Mode - وضع التركيز' },
  { img: '/opt/data/screenshots/04-ideas.png', title: 'مركز الأفكار والمشاريع' },
  { img: '/opt/data/screenshots/05-courses.png', title: 'مركز الكورسات' },
  { img: '/opt/data/screenshots/06-achievements.png', title: 'الإنجازات' },
  { img: '/opt/data/screenshots/07-roadmap.png', title: 'خارطة الطريق' },
  { img: '/opt/data/screenshots/08-quests.png', title: 'الكويستس' },
  { img: '/opt/data/screenshots/09-rewards.png', title: 'متجر المكافآت' },
  { img: '/opt/data/screenshots/10-community.png', title: 'المجتمع' },
];

pages.forEach((page, i) => {
  if (i > 0) doc.addPage();
  
  // Background
  doc.rect(0, 0, pageWidth, pageHeight).fill('#06060e');
  
  // Header bar
  doc.rect(0, 0, pageWidth, 50).fill('#0c0c1a');
  doc.rect(0, 48, pageWidth, 2).fill('#a855f7');
  
  // Header content
  doc.fontSize(18).fillColor('#a855f7').text('◈', 18, 14);
  doc.fontSize(14).fillColor('#f0f0ff').text('Level Up', 44, 18);
  doc.fontSize(8).fillColor('#8888aa').text('Level up your life', 44, 34);
  
  // Page title (right aligned)
  doc.fontSize(10).fillColor('#8888aa').text(page.title, pageWidth - 18, 22, { align: 'right' });
  
  // Screenshot
  if (fs.existsSync(page.img)) {
    const imgBuf = fs.readFileSync(page.img);
    doc.image(imgBuf, 15, 60, { 
      width: pageWidth - 30, 
      height: pageHeight - 100,
      align: 'center'
    });
  } else {
    doc.fontSize(12).fillColor('#555577').text('Screenshot not found', pageWidth / 2, 300, { align: 'center' });
  }
  
  // Footer
  doc.rect(0, pageHeight - 25, pageWidth, 25).fill('#0c0c1a');
  doc.fontSize(8).fillColor('#555577').text(`Level Up v2 Design · ${i + 1}/${pages.length}`, pageWidth / 2, pageHeight - 12, { align: 'center' });
});

doc.end();

doc.on('finish', () => {
  const stats = fs.statSync(outputPath);
  console.log(`PDF created: ${outputPath}`);
  console.log(`Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
});
