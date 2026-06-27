const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument({
  size: 'A4',
  margin: 0,
  info: {
    Title: 'Level Up Design Preview',
    Author: 'Level Up Team'
  }
});

const width = 595.28; // A4 width in points
const height = 841.89; // A4 height in points

// Helper functions
function drawBackground() {
  // Dark gradient background
  doc.rect(0, 0, width, height).fill('#06060e');
  
  // Decorative circles
  doc.circle(100, 150, 120).fill({ color: '#a855f7', opacity: 0.08 });
  doc.circle(500, 700, 150).fill({ color: '#3b82f6', opacity: 0.06 });
  doc.circle(300, 400, 100).fill({ color: '#22d3ee', opacity: 0.05 });
}

function drawHeader(pageNum) {
  // Header background
  doc.rect(0, 0, width, 80).fill('#0c0c1a');
  doc.rect(0, 78, width, 2).fill('#a855f7');
  
  // Logo
  doc.fontSize(28).fillColor('#a855f7').text('◈', 30, 25);
  
  // Title
  doc.fontSize(22).fillColor('#f0f0ff').text('Level Up', 65, 28);
  doc.fontSize(10).fillColor('#8888aa').text('Level up your life', 65, 52);
  
  // Page number
  doc.fontSize(10).fillColor('#555577').text(`Page ${pageNum}`, width - 60, 35, { align: 'right' });
}

function drawFooter() {
  doc.rect(0, height - 40, width, 40).fill('#0c0c1a');
  doc.fontSize(10).fillColor('#555577').text('Level Up - Design Preview', width / 2, height - 22, { align: 'center' });
}

function drawStatCard(x, y, icon, value, label, color) {
  // Card background
  doc.roundedRect(x, y, 120, 90, 12).fill('#111128');
  doc.roundedRect(x, y, 120, 90, 12).stroke({ color: '#ffffff', opacity: 0.06 });
  
  // Icon box
  doc.roundedRect(x + 12, y + 12, 36, 36, 10).fill({ color: color, opacity: 0.15 });
  doc.fontSize(18).fillColor(color).text(icon, x + 21, y + 20);
  
  // Value
  doc.fontSize(24).fillColor(color).text(value, x + 12, y + 52);
  
  // Label
  doc.fontSize(10).fillColor('#8888aa').text(label, x + 12, y + 74);
}

function drawProgressBar(x, y, width, progress, color) {
  // Background
  doc.roundedRect(x, y, width, 6, 3).fill({ color: '#ffffff', opacity: 0.08 });
  // Fill
  if (progress > 0) {
    doc.roundedRect(x, y, width * (progress / 100), 6, 3).fill(color);
  }
}

function drawSkillCard(x, y, name, level, status, color) {
  const cardWidth = 130;
  const cardHeight = 120;
  
  // Card background
  doc.roundedRect(x, y, cardWidth, cardHeight, 12).fill('#111128');
  
  // Border based on status
  let borderColor = '#ffffff';
  if (status === 'available') borderColor = '#fb923c';
  else if (status === 'completed') borderColor = '#34d399';
  else if (status === 'active') borderColor = '#22d3ee';
  else borderColor = '#ffffff';
  
  doc.roundedRect(x, y, cardWidth, cardHeight, 12).stroke({ color: borderColor, width: status === 'locked' ? 1 : 2, opacity: status === 'locked' ? 0.1 : 0.3 });
  
  // Icon box
  doc.roundedRect(x + 10, y + 10, 40, 40, 10).fill({ color: color, opacity: 0.15 });
  doc.fontSize(16).fillColor(color).text('◈', x + 20, y + 20);
  
  // Name
  doc.fontSize(12).fillColor('#f0f0ff').text(name, x + 10, y + 56, { width: cardWidth - 20, align: 'center' });
  
  // Level
  doc.fontSize(9).fillColor('#555577').text(`Level ${level}/5`, x + 10, y + 74, { width: cardWidth - 20, align: 'center' });
  
  // Status
  doc.fontSize(8).fillColor(borderColor).text(status, x + 10, y + 90, { width: cardWidth - 20, align: 'center' });
  
  // XP badge
  if (status === 'available') {
    doc.roundedRect(x + 35, y + 100, 60, 16, 8).fill({ color: '#fb923c', opacity: 0.15 });
    doc.fontSize(8).fillColor('#fb923c').text('+50 XP', x + 65, y + 104, { align: 'center' });
  }
}

function drawAchievementCard(x, y, icon, name, desc, unlocked, tier) {
  const cardWidth = 110;
  const cardHeight = 110;
  
  doc.roundedRect(x, y, cardWidth, cardHeight, 12).fill('#111128');
  
  if (!unlocked) {
    doc.roundedRect(x, y, cardWidth, cardHeight, 12).fill({ color: '#000000', opacity: 0.4 });
  }
  
  // Icon circle
  let iconColor = '#888888';
  if (tier === 'bronze') iconColor = '#cd7f32';
  else if (tier === 'silver') iconColor = '#c0c0c0';
  else if (tier === 'gold') iconColor = '#ffd700';
  else if (tier === 'diamond') iconColor = '#b9f2ff';
  
  doc.circle(x + cardWidth/2, y + 35, 20).fill({ color: iconColor, opacity: 0.15 });
  doc.circle(x + cardWidth/2, y + 35, 20).stroke({ color: iconColor, width: 2, opacity: unlocked ? 0.5 : 0.2 });
  
  doc.fontSize(18).fillColor('#f0f0ff').text(icon, x + cardWidth/2, y + 30, { align: 'center' });
  
  // Name
  doc.fontSize(10).fillColor(unlocked ? '#f0f0ff' : '#555577').text(name, x + 8, y + 62, { width: cardWidth - 16, align: 'center' });
  
  // Description
  doc.fontSize(7).fillColor('#555577').text(desc, x + 8, y + 78, { width: cardWidth - 16, align: 'center' });
  
  // Lock overlay
  if (!unlocked) {
    doc.fontSize(16).fillColor('#555577').text('🔒', x + cardWidth/2, y + 96, { align: 'center' });
  }
}

// ===== PAGE 1: Dashboard =====
drawBackground();
drawHeader(1);

// Welcome Banner
doc.roundedRect(30, 100, width - 60, 80, 16).fill({ color: '#a855f7', opacity: 0.15 });
doc.roundedRect(30, 100, width - 60, 80, 16).stroke({ color: '#a855f7', opacity: 0.2 });
doc.fontSize(20).fillColor('#f0f0ff').text('مرحباً بك في Level Up', 50, 115);
doc.fontSize(11).fillColor('#8888aa').text('ابدأ رحلتك في تطوير نفسك. كل مهارة تتعلمها تقربك من هدفك!', 50, 145);

// Stats
drawStatCard(30, 200, '⚡', '0', 'XP', '#facc15');
drawStatCard(170, 200, '◆', '1', 'Level', '#a855f7');
drawStatCard(310, 200, '⬡', '0', 'Skills', '#22d3ee');
drawStatCard(450, 200, '⚔', '0', 'Quests', '#34d399');

// Daily Goals Section
doc.fontSize(16).fillColor('#f0f0ff').text('أهداف اليوم', 30, 320);

const goals = [
  { text: 'أكمل درس واحد', progress: 100, done: true },
  { text: 'مارس 25 دقيقة Focus', progress: 60, done: false },
  { text: 'أكمل كويست واحد', progress: 0, done: false },
];

goals.forEach((goal, i) => {
  const y = 350 + i * 50;
  doc.roundedRect(30, y, width - 60, 40, 10).fill({ color: '#ffffff', opacity: 0.03 });
  doc.roundedRect(30, y, width - 60, 40, 10).stroke({ color: '#ffffff', opacity: 0.06 });
  
  doc.fontSize(11).fillColor(goal.done ? '#34d399' : '#f0f0ff').text(goal.text, 45, y + 12);
  doc.fontSize(9).fillColor('#555577').text(`${goal.progress}%`, width - 70, y + 12);
  
  drawProgressBar(45, y + 28, width - 120, goal.progress, goal.done ? '#34d399' : '#a855f7');
});

// Recent Activity Section
doc.fontSize(16).fillColor('#f0f0ff').text('النشاط الأخير', 30, 520);

const activities = [
  { text: 'أكملت درس JavaScript الأساسي', time: 'منذ ساعتين', xp: '+50 XP' },
  { text: 'بدأت كويست "بناء أول مشروع"', time: 'منذ 3 ساعات', xp: '+25 XP' },
  { text: 'حصلت على إنجاز "المبتدئ"', time: 'منذ يوم', xp: '+100 XP' },
];

activities.forEach((act, i) => {
  const y = 545 + i * 35;
  doc.roundedRect(30, y, width - 60, 28, 8).fill({ color: '#ffffff', opacity: 0.03 });
  
  // Dot
  doc.circle(48, y + 14, 4).fill('#a855f7');
  
  doc.fontSize(10).fillColor('#f0f0ff').text(act.text, 60, y + 8);
  doc.fontSize(8).fillColor('#555577').text(act.time, 60, y + 18);
  doc.fontSize(10).fillColor('#34d399').text(act.xp, width - 70, y + 10);
});

// Action Buttons
doc.roundedRect(30, 670, 180, 36, 10).fill({ color: '#a855f7', opacity: 0.8 });
doc.fontSize(11).fillColor('#ffffff').text('ابدأ تعلم مهارة جديدة', 120, 682, { align: 'center' });

doc.roundedRect(220, 670, 150, 36, 10).fill({ color: '#ffffff', opacity: 0.05 });
doc.roundedRect(220, 670, 150, 36, 10).stroke({ color: '#ffffff', opacity: 0.06 });
doc.fontSize(11).fillColor('#f0f0ff').text('ابدأ Focus Session', 295, 682, { align: 'center' });

doc.roundedRect(380, 670, 120, 36, 10).fill({ color: '#ffffff', opacity: 0.05 });
doc.roundedRect(380, 670, 120, 36, 10).stroke({ color: '#ffffff', opacity: 0.06 });
doc.fontSize(11).fillColor('#f0f0ff').text('كويستس جديدة', 440, 682, { align: 'center' });

drawFooter();

// ===== PAGE 2: Skill Tree =====
doc.addPage();
drawBackground();
drawHeader(2);

doc.fontSize(18).fillColor('#22d3ee').text('شجرة المهارات', 30, 110);
doc.fontSize(10).fillColor('#8888aa').text('اختر مهارة لتطويرها واكسب XP مع كل مستوى', 30, 130);

// Filter chips
const categories = ['الكل', 'Frontend', 'Backend', 'Database', 'DevOps', 'Cloud'];
let chipX = 30;
categories.forEach((cat, i) => {
  const isActive = i === 0;
  const chipWidth = doc.widthOfString(cat) + 24;
  doc.roundedRect(chipX, 150, chipWidth, 28, 14).fill({ color: isActive ? '#22d3ee' : '#ffffff', opacity: isActive ? 0.15 : 0.03 });
  doc.roundedRect(chipX, 150, chipWidth, 28, 14).stroke({ color: isActive ? '#22d3ee' : '#ffffff', opacity: isActive ? 0.5 : 0.06 });
  doc.fontSize(10).fillColor(isActive ? '#22d3ee' : '#8888aa').text(cat, chipX + 12, 158);
  chipX += chipWidth + 8;
});

// Skills Grid
const skills = [
  { name: 'JavaScript', level: 0, status: 'available', color: '#facc15' },
  { name: 'React', level: 0, status: 'locked', color: '#22d3ee' },
  { name: 'TypeScript', level: 0, status: 'locked', color: '#3b82f6' },
  { name: 'Node.js', level: 0, status: 'locked', color: '#34d399' },
  { name: 'Python', level: 0, status: 'locked', color: '#f472b6' },
  { name: 'SQL', level: 0, status: 'locked', color: '#a855f7' },
  { name: 'Git', level: 0, status: 'available', color: '#fb923c' },
  { name: 'Docker', level: 0, status: 'locked', color: '#06b6d4' },
  { name: 'HTML/CSS', level: 3, status: 'completed', color: '#f59e0b' },
  { name: 'SQL Server', level: 2, status: 'active', color: '#3b82f6' },
  { name: 'Linux', level: 0, status: 'locked', color: '#f87171' },
  { name: 'AWS', level: 0, status: 'locked', color: '#e879f9' },
];

const cols = 4;
const cardW = 120;
const cardH = 110;
const gapX = 16;
const gapY = 16;
const startX = 30;
const startY = 200;

skills.forEach((skill, i) => {
  const col = i % cols;
  const row = Math.floor(i / cols);
  const x = startX + col * (cardW + gapX);
  const y = startY + row * (cardH + gapY);
  
  drawSkillCard(x, y, skill.name, skill.level, skill.status, skill.color);
});

drawFooter();

// ===== PAGE 3: Focus Mode =====
doc.addPage();
drawBackground();
drawHeader(3);

doc.fontSize(18).fillColor('#34d399').text('وضع التركيز', 30, 110);
doc.fontSize(10).fillColor('#8888aa').text('ركز واحصل على XP مع كل جلسة ناجحة', 30, 130);

// Timer Circle
const centerX = width / 2;
const centerY = 320;
const radius = 100;

// Circle background
doc.circle(centerX, centerY, radius).stroke({ color: '#ffffff', width: 6, opacity: 0.06 });

// Progress arc (simulated with multiple arcs)
const progress = 0.64;
for (let i = 0; i < progress * 360; i += 2) {
  const angle = (i - 90) * Math.PI / 180;
  const x1 = centerX + (radius - 3) * Math.cos(angle);
  const y1 = centerY + (radius - 3) * Math.sin(angle);
  const x2 = centerX + (radius + 3) * Math.cos(angle);
  const y2 = centerY + (radius + 3) * Math.sin(angle);
  doc.moveTo(x1, y1).lineTo(x2, y2).stroke({ color: i < progress * 360 * 0.6 ? '#34d399' : '#22d3ee', width: 2 });
}

// Inner circle
doc.circle(centerX, centerY, radius - 10).fill('#0c0c1a');

// Timer text
doc.fontSize(36).fillColor('#22d3ee').text('15:42', centerX, centerY - 10, { align: 'center' });
doc.fontSize(10).fillColor('#555577').text('جاري التركيز...', centerX, centerY + 20, { align: 'center' });

// Presets
const presets = ['25 دقيقة', '45 دقيقة', '60 دقيقة', '90 دقيقة'];
let presetX = 80;
presets.forEach((preset, i) => {
  const w = doc.widthOfString(preset) + 24;
  doc.roundedRect(presetX, 460, w, 30, 15).fill({ color: i === 0 ? '#34d399' : '#ffffff', opacity: i === 0 ? 0.15 : 0.03 });
  doc.roundedRect(presetX, 460, w, 30, 15).stroke({ color: i === 0 ? '#34d399' : '#ffffff', opacity: i === 0 ? 0.5 : 0.06 });
  doc.fontSize(10).fillColor(i === 0 ? '#34d399' : '#8888aa').text(preset, presetX + 12, 469);
  presetX += w + 10;
});

// Focus Stats
const focusStats = [
  { value: '64%', label: 'التقدم', color: '#34d399' },
  { value: '16m', label: 'الوقت المنقضي', color: '#22d3ee' },
  { value: '50', label: 'XP متوقع', color: '#fb923c' },
];

focusStats.forEach((stat, i) => {
  const x = 80 + i * 150;
  doc.roundedRect(x, 520, 120, 60, 12).fill('#111128');
  doc.roundedRect(x, 520, 120, 60, 12).stroke({ color: '#ffffff', opacity: 0.06 });
  doc.fontSize(20).fillColor(stat.color).text(stat.value, x + 60, 532, { align: 'center' });
  doc.fontSize(9).fillColor('#555577').text(stat.label, x + 60, 558, { align: 'center' });
});

// Controls
doc.roundedRect(180, 610, 120, 36, 10).fill({ color: '#a855f7', opacity: 0.8 });
doc.fontSize(11).fillColor('#ffffff').text('إيقاف', 240, 622, { align: 'center' });

doc.roundedRect(310, 610, 100, 36, 10).fill({ color: '#ffffff', opacity: 0.05 });
doc.roundedRect(310, 610, 100, 36, 10).stroke({ color: '#ffffff', opacity: 0.06 });
doc.fontSize(11).fillColor('#f0f0ff').text('إعادة', 360, 622, { align: 'center' });

drawFooter();

// ===== PAGE 4: Achievements & Roadmap =====
doc.addPage();
drawBackground();
drawHeader(4);

doc.fontSize(18).fillColor('#fbbf24').text('الإنجازات', 30, 110);

// Achievements Grid
const achievements = [
  { icon: '🌟', name: 'البداية', desc: 'أكملت أول درس', unlocked: true, tier: 'bronze' },
  { icon: '📚', name: 'المتعلم', desc: 'أكملت 5 دروس', unlocked: true, tier: 'silver' },
  { icon: '⚡', name: 'الماهر', desc: 'أكملت 10 دروس', unlocked: true, tier: 'silver' },
  { icon: '🏆', name: 'البطل', desc: 'كويست كامل', unlocked: false, tier: 'silver' },
  { icon: '🧠', name: 'العبقري', desc: '1000 XP', unlocked: false, tier: 'gold' },
  { icon: '👑', name: 'الأسطورة', desc: 'المستوى 10', unlocked: false, tier: 'gold' },
  { icon: '🌙', name: 'القمر', desc: '3 أيام متتالية', unlocked: false, tier: 'silver' },
  { icon: '🌌', name: 'المجرة', desc: 'كل المهارات', unlocked: false, tier: 'diamond' },
];

const achCols = 4;
const achW = 110;
const achH = 100;
const achGapX = 14;
const achGapY = 12;
const achStartX = 30;
const achStartY = 135;

achievements.forEach((ach, i) => {
  const col = i % achCols;
  const row = Math.floor(i / achCols);
  const x = achStartX + col * (achW + achGapX);
  const y = achStartY + row * (achH + achGapY);
  drawAchievementCard(x, y, ach.icon, ach.name, ach.desc, ach.unlocked, ach.tier);
});

// Roadmap Section
doc.fontSize(16).fillColor('#f472b6').text('خارطة الطريق', 30, 380);

const roadmapSteps = [
  { title: 'الأساسيات', duration: '4 أسابيع', progress: 100, color: '#facc15', tasks: ['HTML/CSS', 'JavaScript', 'Git/GitHub', 'أول مشروع'] },
  { title: 'المتقدم', duration: '6 أسابيع', progress: 40, color: '#22d3ee', tasks: ['React/Vue', 'Node.js', 'قواعد البيانات', 'REST APIs'] },
  { title: 'التخصص', duration: '8 أسابيع', progress: 0, color: '#a855f7', tasks: ['اختر مسارك', 'مشاريع متقدمة', 'Best Practices', 'Code Review'] },
  { title: 'احترافي', duration: 'مستمر', progress: 0, color: '#34d399', tasks: ['System Design', 'DevOps', 'الأداء', 'مفتوح المصدر'] },
];

roadmapSteps.forEach((step, i) => {
  const y = 405 + i * 52;
  
  // Timeline dot
  doc.circle(50, y + 15, 8).fill({ color: step.progress > 0 ? step.color : '#0c0c1a' });
  doc.circle(50, y + 15, 8).stroke({ color: step.color, width: 2 });
  
  // Card
  doc.roundedRect(70, y, width - 100, 42, 10).fill('#111128');
  doc.roundedRect(70, y, width - 100, 42, 10).stroke({ color: step.color, opacity: 0.3 });
  
  // Title
  doc.fontSize(12).fillColor(step.color).text(`${step.title} · ${step.duration} · ${step.progress}%`, 85, y + 8);
  
  // Progress bar
  drawProgressBar(85, y + 26, width - 185, step.progress, step.color);
});

drawFooter();

// Finalize PDF
doc.end();

const outputPath = '/opt/data/level-up-design-preview.pdf';
doc.pipe(fs.createWriteStream(outputPath)).on('finish', () => {
  console.log('PDF created at: ' + outputPath);
});
