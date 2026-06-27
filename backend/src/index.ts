import express from 'express';
import cors from 'cors';
import helmet from 'helmet'
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*' }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Level Up v2 API', time: new Date().toISOString() });
});

// ============ AUTH ============
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) return res.status(400).json({ error: 'All fields required' });
    const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
    if (existing) return res.status(400).json({ error: 'User already exists' });
    const bcrypt = await import('bcryptjs');
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, username, password: hashed } });
    await prisma.userStats.create({ data: { userId: user.id } });
    await prisma.userSettings.create({ data: { userId: user.id } });
    const token = Buffer.from(JSON.stringify({ userId: user.id, exp: Date.now() + 604800000 })).toString('base64');
    res.json({ token, user: { id: user.id, email, username, level: 1, xp: 0, title: 'Novice Adventurer', streak: 0, coins: 0 } });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const found = await prisma.user.findFirst({
      where: { OR: [{ email }, { username: email }] },
      include: { stats: true, userSettings: true }
    });
    if (!found) return res.status(404).json({ error: 'User not found' });
    const bcrypt = await import('bcryptjs');
    const valid = await bcrypt.compare(password, found.password);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });
    await prisma.user.update({ where: { id: found.id }, data: { lastActive: new Date() } });
    const token = Buffer.from(JSON.stringify({ userId: found.id, exp: Date.now() + 604800000 })).toString('base64');
    res.json({
      token,
      user: { id: found.id, email: found.email, username: found.username, level: found.level, xp: found.xp, title: found.title, streak: found.streak, coins: found.coins, avatar: found.avatar, totalHours: found.totalHours },
      settings: found.userSettings,
      stats: found.stats
    });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// ============ SKILLS ============
app.get('/api/skills/tree', async (req, res) => {
  const skills = await prisma.skill.findMany({
    where: { parentId: null },
    include: { children: { include: { children: { include: { children: { include: { children: true } } } } } } },
    orderBy: { category: 'asc' }
  });
  res.json(skills);
});

app.get('/api/skills/:slug', async (req, res) => {
  const skill = await prisma.skill.findUnique({
    where: { slug: req.params.slug },
    include: { children: true, parent: true, resources: { orderBy: { rating: 'desc' } } }
  });
  if (!skill) return res.status(404).json({ error: 'Skill not found' });
  res.json(skill);
});

// ============ USER SKILLS ============
app.get('/api/user/skills', async (req, res) => {
  const userId = (req.query.userId as string) || (req.headers['x-user-id'] as string);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const skills = await prisma.userSkill.findMany({
    where: { userId },
    include: { skill: { include: { children: true } } },
    orderBy: { updatedAt: 'desc' }
  });
  res.json(skills);
});

app.post('/api/user/skills/unlock', async (req, res) => {
  try {
    const userId = req.body.userId || (req.headers['x-user-id'] as string);
    const { skillId } = req.body;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const skill = await prisma.skill.findUnique({ where: { id: skillId } });
    if (!skill) return res.status(404).json({ error: 'Skill not found' });
    const existing = await prisma.userSkill.findUnique({ where: { userId_skillId: { userId, skillId } } });
    if (existing) return res.status(400).json({ error: 'Already unlocked' });
    const userSkill = await prisma.userSkill.create({
      data: { userId, skillId, status: 'active', unlockedAt: new Date() }
    });
    await prisma.userStats.upsert({ where: { userId }, create: { userId, skillsUnlocked: 1 }, update: { skillsUnlocked: { increment: 1 } } });
    res.json(userSkill);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.post('/api/user/skills/:skillId/progress', async (req, res) => {
  try {
    const userId = req.body.userId || (req.headers['x-user-id'] as string);
    const { skillId } = req.params;
    const { progress, xpEarned } = req.body;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const update: any = { progress };
    if (progress >= 100) { update.status = 'completed'; update.completedAt = new Date(); }
    const userSkill = await prisma.userSkill.upsert({
      where: { userId_skillId: { userId, skillId } },
      create: { userId, skillId, progress, status: progress >= 100 ? 'completed' : 'active', unlockedAt: new Date() },
      update
    });
    if (xpEarned) {
      await prisma.user.update({ where: { id: userId }, data: { xp: { increment: xpEarned } } });
      await prisma.userStats.upsert({ where: { userId }, create: { userId, totalXP: xpEarned }, update: { totalXP: { increment: xpEarned } } });
    }
    res.json(userSkill);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// ============ XP ============
app.post('/api/user/xp', async (req, res) => {
  try {
    const userId = req.body.userId || (req.headers['x-user-id'] as string);
    const { amount } = req.body;
    if (!userId || !amount) return res.status(400).json({ error: 'userId and amount required' });
    const user = await prisma.user.update({ where: { id: userId }, data: { xp: { increment: amount } } });
    const newLevel = Math.floor(user.xp / 100) + 1;
    let leveledUp = false;
    let bonusCoins = 0;
    if (newLevel > user.level) {
      leveledUp = true;
      bonusCoins = (newLevel - user.level) * 10;
      await prisma.user.update({ where: { id: userId }, data: { level: newLevel, coins: { increment: bonusCoins } } });
    }
    await prisma.userStats.upsert({ where: { userId }, create: { userId, totalXP: amount }, update: { totalXP: { increment: amount } } });
    res.json({ xp: user.xp, level: newLevel, leveledUp, bonusCoins });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// ============ QUESTS ============
app.get('/api/quests', async (req, res) => {
  const quests = await prisma.quest.findMany({
    include: { skill: { select: { name: true, icon: true } } },
    orderBy: [{ difficulty: 'asc' }, { type: 'asc' }]
  });
  res.json(quests);
});

app.get('/api/quests/daily', async (req, res) => {
  const userId = (req.query.userId as string) || (req.headers['x-user-id'] as string);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let daily = await prisma.dailyMission.findMany({ where: { userId, date: today } });
  if (!daily || daily.length === 0) {
    const quests = await prisma.quest.findMany({ where: { isDaily: true }, take: 5 });
    for (const q of quests) {
      await prisma.dailyMission.create({ data: { userId, title: q.title, xpReward: q.xpReward, type: q.type, date: today } }).catch(() => {});
    }
    daily = await prisma.dailyMission.findMany({ where: { userId, date: today } });
  }
  res.json(daily);
});

app.post('/api/quests/:questId/complete', async (req, res) => {
  try {
    const userId = req.body.userId || (req.headers['x-user-id'] as string);
    const { questId } = req.params;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const quest = await prisma.quest.findUnique({ where: { id: questId } });
    if (!quest) return res.status(404).json({ error: 'Quest not found' });
    const userQuest = await prisma.userQuest.upsert({
      where: { userId_questId: { userId, questId } },
      create: { userId, questId, status: 'completed', progress: 100, completedAt: new Date() },
      update: { status: 'completed', progress: 100, completedAt: new Date() }
    });
    await prisma.user.update({ where: { id: userId }, data: { xp: { increment: quest.xpReward } } });
    await prisma.userStats.upsert({ where: { userId }, create: { userId, completedQuests: 1, totalQuests: 1 }, update: { completedQuests: { increment: 1 }, totalQuests: { increment: 1 } } });
    res.json({ userQuest, xpEarned: quest.xpReward });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// ============ QUIZZES ============
app.get('/api/quizzes/:quizId', async (req, res) => {
  const quiz = await prisma.quiz.findUnique({ where: { id: req.params.quizId }, include: { questions: { orderBy: { order: 'asc' } } } });
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  const safe = quiz.questions.map((q: any) => ({ id: q.id, question: q.question, options: q.options, order: q.order }));
  res.json({ ...quiz, questions: safe });
});

app.post('/api/quizzes/:quizId/submit', async (req, res) => {
  try {
    const userId = req.body.userId || (req.headers['x-user-id'] as string);
    const { quizId } = req.params;
    const { answers, timeSpent } = req.body;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const quiz = await prisma.quiz.findUnique({ where: { id: quizId }, include: { questions: true } });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    let correct = 0;
    const answerRecords = answers.map((a: any) => {
      const question = quiz.questions.find((q: any) => q.id === a.questionId);
      const isCorrect = question && question.correctIdx === a.selectedIdx;
      if (isCorrect) correct++;
      return { questionId: a.questionId, selectedIdx: a.selectedIdx, isCorrect };
    });
    const score = Math.round((correct / quiz.questions.length) * 100);
    const xpEarned = Math.round(score * 0.5);
    const result = await prisma.quizResult.create({
      data: { userId, quizId, score, totalQuestions: quiz.questions.length, timeSpent: timeSpent || 0, xpEarned, answers: { create: answerRecords } }
    });
    await prisma.user.update({ where: { id: userId }, data: { xp: { increment: xpEarned } } });
    await prisma.userStats.upsert({ where: { userId }, create: { userId, quizzesCompleted: 1 }, update: { quizzesCompleted: { increment: 1 } } });
    res.json({ result: { score, xpEarned, correct, total: quiz.questions.length } });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// ============ ACHIEVEMENTS ============
app.get('/api/achievements', async (req, res) => {
  const achievements = await prisma.achievement.findMany({ where: { secret: false } });
  res.json(achievements);
});

app.get('/api/user/achievements', async (req, res) => {
  const userId = (req.query.userId as string) || (req.headers['x-user-id'] as string);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const achievements = await prisma.userAchievement.findMany({ where: { userId }, include: { achievement: true }, orderBy: { unlockedAt: 'desc' } });
  res.json(achievements);
});

// ============ RESOURCES ============
app.get('/api/resources', async (req, res) => {
  const { skillId, type, difficulty } = req.query;
  const where: any = {};
  if (skillId) where.skillId = skillId as string;
  if (type) where.type = type as string;
  if (difficulty) where.difficulty = difficulty as string;
  const resources = await prisma.resource.findMany({ where, include: { skill: { select: { name: true, icon: true } } }, orderBy: { rating: 'desc' } });
  res.json(resources);
});

// ============ NOTES ============
app.get('/api/notes', async (req, res) => {
  const userId = (req.query.userId as string) || (req.headers['x-user-id'] as string);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const notes = await prisma.note.findMany({ where: { userId }, orderBy: [{ pinned: 'desc' }, { updatedAt: 'desc' }] });
  res.json(notes);
});

app.post('/api/notes', async (req, res) => {
  try {
    const userId = req.body.userId || (req.headers['x-user-id'] as string);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { title, content, skillIds, tags, pinned } = req.body;
    const note = await prisma.note.create({ data: { userId, title, content, skillIds: skillIds || '', tags: tags || '', pinned: pinned || false } });
    res.json(note);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// ============ PROJECTS ============
app.get('/api/projects', async (req, res) => {
  const userId = (req.query.userId as string) || (req.headers['x-user-id'] as string);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const projects = await prisma.project.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' } });
  res.json(projects);
});

app.post('/api/projects', async (req, res) => {
  try {
    const userId = req.body.userId || (req.headers['x-user-id'] as string);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { title, description, difficulty, estimatedMin } = req.body;
    const project = await prisma.project.create({ data: { userId, title, description, difficulty: difficulty || 1, estimatedMin: estimatedMin || 120 } });
    res.json(project);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.post('/api/projects/:projectId/complete', async (req, res) => {
  try {
    const userId = req.body.userId || (req.headers['x-user-id'] as string);
    const { projectId } = req.params;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    const updated = await prisma.project.update({ where: { id: projectId }, data: { status: 'completed', completedAt: new Date() } });
    await prisma.user.update({ where: { id: userId }, data: { xp: { increment: project.xpReward } } });
    await prisma.userStats.upsert({ where: { userId }, create: { userId, projectsCompleted: 1 }, update: { projectsCompleted: { increment: 1 } } });
    res.json({ project: updated, xpEarned: project.xpReward });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// ============ FOCUS MODE ============
app.post('/api/focus/start', async (req, res) => {
  try {
    const userId = req.body.userId || (req.headers['x-user-id'] as string);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { questId, skillId } = req.body;
    const session = await prisma.focusSession.create({ data: { userId, questId, skillId, startTime: new Date() } });
    res.json(session);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.post('/api/focus/:sessionId/end', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { completed, notes } = req.body;
    const session = await prisma.focusSession.findUnique({ where: { id: sessionId } });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    const endTime = new Date();
    const durationMin = Math.round((endTime.getTime() - session.startTime.getTime()) / 60000);
    const xpEarned = completed ? Math.round(durationMin * 2) : 0;
    const updated = await prisma.focusSession.update({ where: { id: sessionId }, data: { endTime, durationMin, xpEarned, completed: completed !== false, notes } });
    if (xpEarned > 0) {
      await prisma.user.update({ where: { id: session.userId }, data: { xp: { increment: xpEarned }, totalHours: { increment: durationMin / 60 } } });
      await prisma.userStats.upsert({ where: { userId: session.userId }, create: { userId, focusTime: durationMin }, update: { focusTime: { increment: durationMin } } });
    }
    res.json({ session: updated, xpEarned });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// ============ DASHBOARD ============
app.get('/api/user/dashboard', async (req, res) => {
  const userId = (req.query.userId as string) || (req.headers['x-user-id'] as string);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { stats: true, achievements: { include: { achievement: true } } } });
  const skillsByCategory = await prisma.$queryRaw`
    SELECT category, COUNT(*) as count,
           SUM(CASE WHEN us.status = 'completed' THEN 1 ELSE 0 END) as completed
    FROM Skill s
    LEFT JOIN UserSkill us ON us.skillId = s.id AND us.userId = ${userId}
    GROUP BY category ORDER BY count DESC
  `;
  const recentQuests = await prisma.userQuest.findMany({
    where: { userId, status: 'completed' },
    include: { quest: { select: { title: true, xpReward: true } } },
    orderBy: { completedAt: 'desc' }, take: 5
  });
  res.json({
    user: user ? { id: user.id, username: user.username, level: user.level, xp: user.xp, title: user.title, streak: user.streak, coins: user.coins, totalHours: user.totalHours } : null,
    stats: user?.stats,
    achievementCount: user?.achievements?.length || 0,
    skillsByCategory,
    recentQuests
  });
});

// ============ AI ROADMAP ============
app.post('/api/ai/roadmap', async (req, res) => {
  const { goal, currentLevel, timePerWeek } = req.body;
  if (!goal) return res.status(400).json({ error: 'Goal is required' });
  const lvl = currentLevel || 'beginner';
  const hours = timePerWeek || 10;
  const weeks = lvl === 'beginner' ? 24 : lvl === 'intermediate' ? 16 : 8;
  const goalLower = goal.toLowerCase();
  const sections: any[] = [];

  if (goalLower.includes('cyber') || goalLower.includes('security') || goalLower.includes('hack')) {
    sections.push(
      { title: 'Foundation', duration: '4 weeks', items: [
        { name: 'Linux Administration', resources: ['Linux Journey (free)', 'OverTheWire Bandit'], hours: 20 },
        { name: 'Networking', resources: ['Professor Messer Network+', 'Cisco Academy (free)'], hours: 25 },
        { name: 'Bash Scripting', resources: ['Bash Academy', 'LinuxCommand.org'], hours: 15 }
      ]},
      { title: 'Core Security', duration: '6 weeks', items: [
        { name: 'Python for Security', resources: ['Automate the Boring Stuff (free)', 'Black Hat Python'], hours: 20 },
        { name: 'Web Security OWASP', resources: ['PortSwigger Academy (free)', 'OWASP Top 10'], hours: 25 },
        { name: 'Cryptography', resources: ['CryptoHack (free)', 'Coursera Cryptography'], hours: 15 },
        { name: 'Network Security', resources: ['Wireshark Tutorial', 'Nmap Guide'], hours: 20 }
      ]},
      { title: 'Advanced', duration: '8 weeks', items: [
        { name: 'Penetration Testing', resources: ['HackTheBox', 'TryHackMe'], hours: 30 },
        { name: 'Active Directory', resources: ['ADSecurity.org', 'CRTP Course'], hours: 25 },
        { name: 'CTF Competitions', resources: ['CTFtime.org', 'PicoCTF'], hours: 30 }
      ]},
      { title: 'Boss Battle', duration: '6 weeks', items: [
        { name: 'Red Team Operation', resources: ['CRTO Course', 'Zero-Point Security'], hours: 40 },
        { name: 'Certification Prep', resources: ['OSCP Guide', 'PNPT Course'], hours: 40 }
      ]}
    );
  } else if (goalLower.includes('web') || goalLower.includes('frontend') || goalLower.includes('developer') || goalLower.includes('fullstack')) {
    sections.push(
      { title: 'Foundation', duration: '4 weeks', items: [
        { name: 'HTML & CSS', resources: ['freeCodeCamp (free)', 'MDN Web Docs'], hours: 20 },
        { name: 'JavaScript', resources: ['JavaScript.info (free)', 'freeCodeCamp JS'], hours: 25 },
        { name: 'Git & GitHub', resources: ['Git Immersion', 'GitHub Skills (free)'], hours: 10 }
      ]},
      { title: 'Frontend', duration: '6 weeks', items: [
        { name: 'React.js', resources: ['React.dev', 'Scrimba (free)', 'Full Stack Open'], hours: 30 },
        { name: 'TypeScript', resources: ['TypeScript Handbook', 'Total TypeScript'], hours: 15 },
        { name: 'Tailwind CSS', resources: ['Tailwind Docs', 'YouTube'], hours: 10 }
      ]},
      { title: 'Backend', duration: '6 weeks', items: [
        { name: 'Node.js & Express', resources: ['Node.js Docs', 'Express Guide'], hours: 20 },
        { name: 'PostgreSQL', resources: ['PostgreSQL Tutorial', 'Use The Index Luke'], hours: 15 },
        { name: 'REST & Security', resources: ['JWT.io', 'OWASP API Security'], hours: 15 }
      ]},
      { title: 'Advanced & Boss', duration: '4 weeks', items: [
        { name: 'Docker & CI/CD', resources: ['Docker Docs (free)', 'GitHub Actions'], hours: 20 },
        { name: 'Cloud Deployment', resources: ['AWS Free Tier', 'Vercel'], hours: 20 },
        { name: 'Full Stack Project', resources: ['Build SaaS', 'E-commerce'], hours: 60 }
      ]}
    );
  } else if (goalLower.includes('ai') || goalLower.includes('machine learning') || goalLower.includes('data')) {
    sections.push(
      { title: 'Math Foundation', duration: '4 weeks', items: [
        { name: 'Linear Algebra', resources: ['3Blue1Brown', 'MIT OCW 18.06'], hours: 25 },
        { name: 'Statistics', resources: ['Khan Academy', 'Think Stats (free)'], hours: 20 },
        { name: 'Calculus', resources: ['3Blue1Brown', 'Paul\'s Online Math'], hours: 20 }
      ]},
      { title: 'Programming', duration: '4 weeks', items: [
        { name: 'Python', resources: ['Python.org Tutorial', 'Kaggle Learn'], hours: 25 },
        { name: 'NumPy & Pandas', resources: ['Official Docs', 'Python Data Science Handbook'], hours: 15 }
      ]},
      { title: 'Machine Learning', duration: '6 weeks', items: [
        { name: 'ML Fundamentals', resources: ['Andrew Ng (Coursera)', 'Google ML Crash Course'], hours: 30 },
        { name: 'Scikit-learn', resources: ['Official Docs', 'ML Zoomcamp (free)'], hours: 20 }
      ]},
      { title: 'Deep Learning', duration: '6 weeks', items: [
        { name: 'Neural Networks', resources: ['3Blue1Brown', 'Fast.ai (free)'], hours: 30 },
        { name: 'PyTorch', resources: ['Official Tutorials', 'Hugging Face Course'], hours: 25 },
        { name: 'Transformers & LLMs', resources: ['Attention Paper', 'Karpathy YouTube'], hours: 25 }
      ]},
      { title: 'Boss Battle', duration: '4 weeks', items: [
        { name: 'End-to-End Project', resources: ['Kaggle Competition', 'Deploy ML Model'], hours: 40 },
        { name: 'MLOps', resources: ['MLflow', 'Made With ML'], hours: 20 }
      ]}
    );
  } else {
    sections.push(
      { title: 'Foundation', duration: `${Math.ceil(weeks * 0.25)} weeks`, items: [
        { name: 'Core Concepts', resources: ['YouTube', 'Official Docs'], hours: Math.ceil(weeks * hours * 0.2) },
        { name: 'Tools Setup', resources: ['Setup Guides', 'Community'], hours: Math.ceil(weeks * hours * 0.1) }
      ]},
      { title: 'Intermediate', duration: `${Math.ceil(weeks * 0.35)} weeks`, items: [
        { name: 'Practical Skills', resources: ['Online Courses', 'Tutorials'], hours: Math.ceil(weeks * hours * 0.25) },
        { name: 'Real Projects', resources: ['GitHub', 'Personal Projects'], hours: Math.ceil(weeks * hours * 0.2) }
      ]},
      { title: 'Advanced', duration: `${Math.ceil(weeks * 0.25)} weeks`, items: [
        { name: 'Advanced Techniques', resources: ['Advanced Courses', 'Books'], hours: Math.ceil(weeks * hours * 0.15) }
      ]},
      { title: 'Boss Battle', duration: `${Math.ceil(weeks * 0.15)} weeks`, items: [
        { name: 'Capstone Project', resources: ['Portfolio', 'Certification'], hours: Math.ceil(weeks * hours * 0.1) }
      ]}
    );
  }

  res.json({ goal, level: lvl, hoursPerWeek: hours, estimatedWeeks: weeks, totalHours: weeks * hours, sections, tips: [
    'ادرس بانتظام حتى لو 30 دقيقة يومياً',
    'طبيع اللي تتعلمه بمشاريع حقيقية',
    'شارك في مجتمعات التعلم',
    'راجع أسبوعياً على اللي تعلمته',
    'لا تقارن نفسك بغيرك'
  ]});
});

// ============ SEED ============
app.post('/api/seed', async (req, res) => {
  try {
    const achievements = [
      { name: 'First Step', description: 'Earn your first XP', icon: '👣', type: 'xp', requirement: 1, tier: 'bronze', xpBonus: 5 },
      { name: 'Century Club', description: 'Earn 100 XP', icon: '💯', type: 'xp', requirement: 100, tier: 'bronze', xpBonus: 10 },
      { name: 'Level 5', description: 'Reach level 5', icon: '🌟', type: 'level', requirement: 5, tier: 'silver', xpBonus: 20 },
      { name: 'Level 10', description: 'Reach level 10', icon: '🔮', type: 'level', requirement: 10, tier: 'gold', xpBonus: 50 },
      { name: 'Level 25', description: 'Reach level 25', icon: '💎', type: 'level', requirement: 25, tier: 'platinum', xpBonus: 100 },
      { name: 'Level 50', description: 'Reach level 50', icon: '👑', type: 'level', requirement: 50, tier: 'diamond', xpBonus: 250 },
      { name: 'Quest Warrior', description: 'Complete 5 quests', icon: '⚔️', type: 'quest', requirement: 5, tier: 'bronze', xpBonus: 15 },
      { name: 'Quest Master', description: 'Complete 25 quests', icon: '🗡️', type: 'quest', requirement: 25, tier: 'silver', xpBonus: 40 },
      { name: 'Quest Legend', description: 'Complete 100 quests', icon: '🏅', type: 'quest', requirement: 100, tier: 'gold', xpBonus: 100 },
      { name: 'Streak Week', description: '7-day streak', icon: '🔥', type: 'streak', requirement: 7, tier: 'silver', xpBonus: 30 },
      { name: 'Streak Month', description: '30-day streak', icon: '🔥', type: 'streak', requirement: 30, tier: 'gold', xpBonus: 75 },
      { name: 'Streak Immortal', description: '100-day streak', icon: '💎', type: 'streak', requirement: 100, tier: 'diamond', xpBonus: 200 },
      { name: 'Skill Explorer', description: 'Unlock 5 skills', icon: '🗺️', type: 'skill', requirement: 5, tier: 'bronze', xpBonus: 10 },
      { name: 'Polymath', description: 'Unlock 20 skills', icon: '🧠', type: 'skill', requirement: 20, tier: 'gold', xpBonus: 80 },
      { name: 'Project Builder', description: 'Complete first project', icon: '🔨', type: 'project', requirement: 1, tier: 'silver', xpBonus: 25 },
      { name: 'Quiz Champion', description: 'Pass 10 quizzes', icon: '📝', type: 'quiz', requirement: 10, tier: 'silver', xpBonus: 30 },
      { name: 'Focus Master', description: '10 hours of focus', icon: '⏰', type: 'focus', requirement: 600, tier: 'gold', xpBonus: 50 },
      { name: 'First Boss', description: 'Defeat your first boss', icon: '🐉', type: 'special', requirement: 1, tier: 'gold', xpBonus: 100 },
    ];
    for (const ach of achievements) {
      await prisma.achievement.upsert({ where: { name: ach.name }, update: ach, create: ach });
    }
    res.json({ message: '✅ Seed created', achievements: achievements.length });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// ============ FULL SEED ============
app.post('/api/seed/full', async (req, res) => {
  try {
    // Achievements
    const achs = [
      { name: 'First Step', description: 'Earn your first XP', icon: '👣', type: 'xp', requirement: 1, tier: 'bronze', xpBonus: 5 },
      { name: 'Century Club', description: 'Earn 100 XP', icon: '💯', type: 'xp', requirement: 100, tier: 'bronze', xpBonus: 10 },
      { name: 'Level 5', description: 'Reach level 5', icon: '🌟', type: 'level', requirement: 5, tier: 'silver', xpBonus: 20 },
      { name: 'Level 10', description: 'Reach level 10', icon: '🔮', type: 'level', requirement: 10, tier: 'gold', xpBonus: 50 },
      { name: 'Level 25', description: 'Reach level 25', icon: '💎', type: 'level', requirement: 25, tier: 'platinum', xpBonus: 100 },
      { name: 'Level 50', description: 'Reach level 50', icon: '👑', type: 'level', requirement: 50, tier: 'diamond', xpBonus: 250 },
      { name: 'Quest Warrior', description: 'Complete 5 quests', icon: '⚔️', type: 'quest', requirement: 5, tier: 'bronze', xpBonus: 15 },
      { name: 'Quest Master', description: 'Complete 25 quests', icon: '🗡️', type: 'quest', requirement: 25, tier: 'silver', xpBonus: 40 },
      { name: 'Quest Legend', description: 'Complete 100 quests', icon: '🏅', type: 'quest', requirement: 100, tier: 'gold', xpBonus: 100 },
      { name: 'Streak Week', description: '7-day streak', icon: '🔥', type: 'streak', requirement: 7, tier: 'silver', xpBonus: 30 },
      { name: 'Streak Month', description: '30-day streak', icon: '🔥', type: 'streak', requirement: 30, tier: 'gold', xpBonus: 75 },
      { name: 'Streak Immortal', description: '100-day streak', icon: '💎', type: 'streak', requirement: 100, tier: 'diamond', xpBonus: 200 },
      { name: 'Skill Explorer', description: 'Unlock 5 skills', icon: '🗺️', type: 'skill', requirement: 5, tier: 'bronze', xpBonus: 10 },
      { name: 'Polymath', description: 'Unlock 20 skills', icon: '🧠', type: 'skill', requirement: 20, tier: 'gold', xpBonus: 80 },
      { name: 'Project Builder', description: 'Complete first project', icon: '🔨', type: 'project', requirement: 1, tier: 'silver', xpBonus: 25 },
      { name: 'Quiz Champion', description: 'Pass 10 quizzes', icon: '📝', type: 'quiz', requirement: 10, tier: 'silver', xpBonus: 30 },
      { name: 'Focus Master', description: '10 hours of focus', icon: '⏰', type: 'focus', requirement: 600, tier: 'gold', xpBonus: 50 },
      { name: 'First Boss', description: 'Defeat your first boss', icon: '🐉', type: 'special', requirement: 1, tier: 'gold', xpBonus: 100 },
    ];
    for (const a of achs) await prisma.achievement.upsert({ where: { name: a.name }, update: a, create: a });

    // Skills Tree
    const tech = await prisma.skill.create({ data: { name: 'Technology', slug: 'technology', category: 'Technology', icon: '💻', color: '#6366f1', description: 'Master the digital world', maxLevel: 10 } });
    const prog = await prisma.skill.create({ data: { name: 'Programming', slug: 'programming', category: 'Technology', icon: '👨‍💻', color: '#8b5cf6', parentId: tech.id, maxLevel: 10 } });
    const web = await prisma.skill.create({ data: { name: 'Web Development', slug: 'web-development', category: 'Technology', icon: '🌐', color: '#06b6d4', parentId: prog.id, maxLevel: 10 } });
    const js = await prisma.skill.create({ data: { name: 'JavaScript', slug: 'javascript', category: 'Technology', icon: '🟨', color: '#eab308', parentId: web.id, maxLevel: 10 } });
    const ts = await prisma.skill.create({ data: { name: 'TypeScript', slug: 'typescript', category: 'Technology', icon: '🔷', color: '#3b82f6', parentId: js.id, maxLevel: 10 } });
    const react = await prisma.skill.create({ data: { name: 'React', slug: 'react', category: 'Technology', icon: '⚛️', color: '#14b8a6', parentId: js.id, maxLevel: 10 } });
    const nextjs = await prisma.skill.create({ data: { name: 'Next.js', slug: 'nextjs', category: 'Technology', icon: '▲', color: '#6366f1', parentId: react.id, maxLevel: 10 } });
    const node = await prisma.skill.create({ data: { name: 'Node.js', slug: 'nodejs', category: 'Technology', icon: '🟢', color: '#10b981', parentId: web.id, maxLevel: 10 } });
    const python = await prisma.skill.create({ data: { name: 'Python', slug: 'python', category: 'Technology', icon: '🐍', color: '#3b82f6', parentId: prog.id, maxLevel: 10 } });
    const go = await prisma.skill.create({ data: { name: 'Go', slug: 'golang', category: 'Technology', icon: '🐹', color: '#06b6d4', parentId: prog.id, maxLevel: 10 } });
    const rust = await prisma.skill.create({ data: { name: 'Rust', slug: 'rust', category: 'Technology', icon: '🦀', color: '#ef4444', parentId: prog.id, maxLevel: 10 } });
    const db = await prisma.skill.create({ data: { name: 'Databases', slug: 'databases', category: 'Technology', icon: '🗄️', color: '#f59e0b', parentId: tech.id, maxLevel: 10 } });
    const sql = await prisma.skill.create({ data: { name: 'SQL', slug: 'sql', category: 'Technology', icon: '📊', color: '#f97316', parentId: db.id, maxLevel: 10 } });
    const nosql = await prisma.skill.create({ data: { name: 'NoSQL', slug: 'nosql', category: 'Technology', icon: '🍃', color: '#22c55e', parentId: db.id, maxLevel: 10 } });
    const devops = await prisma.skill.create({ data: { name: 'DevOps', slug: 'devops', category: 'Technology', icon: '🔄', color: '#06b6d4', parentId: tech.id, maxLevel: 10 } });
    const docker = await prisma.skill.create({ data: { name: 'Docker', slug: 'docker', category: 'Technology', icon: '🐳', color: '#3b82f6', parentId: devops.id, maxLevel: 10 } });
    const k8s = await prisma.skill.create({ data: { name: 'Kubernetes', slug: 'kubernetes', category: 'Technology', icon: '☸️', color: '#8b5cf6', parentId: docker.id, maxLevel: 10, isBoss: true, bossDescription: 'Deploy a microservices app with CI/CD' } });
    const linux = await prisma.skill.create({ data: { name: 'Linux', slug: 'linux', category: 'Technology', icon: '🐧', color: '#eab308', parentId: tech.id, maxLevel: 10 } });
    const git = await prisma.skill.create({ data: { name: 'Git & GitHub', slug: 'git-github', category: 'Technology', icon: '🔀', color: '#ef4444', parentId: tech.id, maxLevel: 10 } });
    const security = await prisma.skill.create({ data: { name: 'Cyber Security', slug: 'cyber-security', category: 'Technology', icon: '🛡️', color: '#ef4444', parentId: tech.id, maxLevel: 10 } });
    const websec = await prisma.skill.create({ data: { name: 'Web Security', slug: 'web-security', category: 'Technology', icon: '🔒', color: '#dc2626', parentId: security.id, maxLevel: 10 } });
    const netsec = await prisma.skill.create({ data: { name: 'Network Security', slug: 'network-security', category: 'Technology', icon: '🌐', color: '#f97316', parentId: security.id, maxLevel: 10 } });
    const crypto = await prisma.skill.create({ data: { name: 'Cryptography', slug: 'cryptography', category: 'Technology', icon: '🔑', color: '#8b5cf6', parentId: security.id, maxLevel: 10 } });
    const pentest = await prisma.skill.create({ data: { name: 'Penetration Testing', slug: 'penetration-testing', category: 'Technology', icon: '🎯', color: '#06b6d4', parentId: security.id, maxLevel: 10, isBoss: true, bossDescription: 'Complete a full pentest report' } });
    const ai = await prisma.skill.create({ data: { name: 'AI & Machine Learning', slug: 'ai-ml', category: 'Technology', icon: '🤖', color: '#8b5cf6', parentId: tech.id, maxLevel: 10 } });
    const ml = await prisma.skill.create({ data: { name: 'Machine Learning', slug: 'machine-learning', category: 'Technology', icon: '🧠', color: '#a855f7', parentId: ai.id, maxLevel: 10 } });
    const dl = await prisma.skill.create({ data: { name: 'Deep Learning', slug: 'deep-learning', category: 'Technology', icon: '🧠', color: '#ec4899', parentId: ml.id, maxLevel: 10 } });
    const nlp = await prisma.skill.create({ data: { name: 'NLP', slug: 'nlp', category: 'Technology', icon: '💬', color: '#14b8a6', parentId: dl.id, maxLevel: 10 } });
    const mobile = await prisma.skill.create({ data: { name: 'Mobile Development', slug: 'mobile-development', category: 'Technology', icon: '📱', color: '#06b6d4', parentId: tech.id, maxLevel: 10 } });
    const reactnative = await prisma.skill.create({ data: { name: 'React Native', slug: 'react-native', category: 'Technology', icon: '⚛️', color: '#3b82f6', parentId: mobile.id, maxLevel: 10 } });
    const flutter = await prisma.skill.create({ data: { name: 'Flutter', slug: 'flutter', category: 'Technology', icon: '🦋', color: '#06b6d4', parentId: mobile.id, maxLevel: 10 } });

    // Design
    const design = await prisma.skill.create({ data: { name: 'Design', slug: 'design', category: 'Design', icon: '🎨', color: '#ec4899', maxLevel: 10 } });
    const graphic = await prisma.skill.create({ data: { name: 'Graphic Design', slug: 'graphic-design', category: 'Design', icon: '🖼️', color: '#f43f5e', parentId: design.id, maxLevel: 10 } });
    const ui = await prisma.skill.create({ data: { name: 'UI Design', slug: 'ui-design', category: 'Design', icon: '📱', color: '#8b5cf6', parentId: design.id, maxLevel: 10 } });
    const ux = await prisma.skill.create({ data: { name: 'UX Design', slug: 'ux-design', category: 'Design', icon: '🧠', color: '#06b6d4', parentId: design.id, maxLevel: 10 } });
    const figma = await prisma.skill.create({ data: { name: 'Figma', slug: 'figma', category: 'Design', icon: '🎯', color: '#a855f7', parentId: ui.id, maxLevel: 10 } });
    const photoshop = await prisma.skill.create({ data: { name: 'Photoshop', slug: 'photoshop', category: 'Design', icon: '📸', color: '#3b82f6', parentId: graphic.id, maxLevel: 10 } });
    const motion = await prisma.skill.create({ data: { name: 'Motion Design', slug: 'motion-design', category: 'Design', icon: '🎬', color: '#f59e0b', parentId: design.id, maxLevel: 10 } });

    // Business
    const business = await prisma.skill.create({ data: { name: 'Business', slug: 'business', category: 'Business', icon: '💼', color: '#f59e0b', maxLevel: 10 } });
    const marketing = await prisma.skill.create({ data: { name: 'Digital Marketing', slug: 'digital-marketing', category: 'Business', icon: '📈', color: '#ef4444', parentId: business.id, maxLevel: 10 } });
    const finance = await prisma.skill.create({ data: { name: 'Finance', slug: 'finance', category: 'Business', icon: '💰', color: '#22c55e', parentId: business.id, maxLevel: 10 } });
    const pm = await prisma.skill.create({ data: { name: 'Project Management', slug: 'project-management', category: 'Business', icon: '📋', color: '#3b82f6', parentId: business.id, maxLevel: 10 } });

    // Languages
    const languages = await prisma.skill.create({ data: { name: 'Languages', slug: 'languages', category: 'Languages', icon: '🗣️', color: '#06b6d4', maxLevel: 10 } });
    const english = await prisma.skill.create({ data: { name: 'English', slug: 'english', category: 'Languages', icon: '🇬🇧', color: '#3b82f6', parentId: languages.id, maxLevel: 10 } });
    const spanish = await prisma.skill.create({ data: { name: 'Spanish', slug: 'spanish', category: 'Languages', icon: '🇪🇸', color: '#ef4444', parentId: languages.id, maxLevel: 10 } });

    // Resources
    const resources = [
      { title: 'freeCodeCamp - Responsive Web Design', type: 'course', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', skillSlug: 'web-development', source: 'freeCodeCamp', free: true, duration: 300, rating: 4.8, difficulty: 'beginner' },
      { title: 'JavaScript.info', type: 'book', url: 'https://javascript.info/', skillSlug: 'javascript', source: 'JavaScript.info', free: true, duration: 600, rating: 4.9, difficulty: 'beginner' },
      { title: 'Full Stack Open', type: 'course', url: 'https://fullstackopen.com/', skillSlug: 'react', source: 'University of Helsinki', free: true, duration: 1200, rating: 4.9, difficulty: 'intermediate' },
      { title: 'React Official Tutorial', type: 'course', url: 'https://react.dev/learn', skillSlug: 'react', source: 'React Team', free: true, duration: 200, rating: 4.8, difficulty: 'beginner' },
      { title: 'TypeScript Handbook', type: 'book', url: 'https://www.typescriptlang.org/docs/handbook/', skillSlug: 'typescript', source: 'Microsoft', free: true, duration: 300, rating: 4.7, difficulty: 'intermediate' },
      { title: 'Next.js Learn', type: 'course', url: 'https://nextjs.org/learn', skillSlug: 'nextjs', source: 'Vercel', free: true, duration: 400, rating: 4.8, difficulty: 'intermediate' },
      { title: 'Python Official Tutorial', type: 'book', url: 'https://docs.python.org/3/tutorial/', skillSlug: 'python', source: 'Python Foundation', free: true, duration: 500, rating: 4.7, difficulty: 'beginner' },
      { title: 'Automate the Boring Stuff', type: 'book', url: 'https://automatetheboringstuff.com/', skillSlug: 'python', source: 'Al Sweigart', free: true, duration: 600, rating: 4.8, difficulty: 'beginner' },
      { title: 'Go Tour', type: 'course', url: 'https://go.dev/tour/', skillSlug: 'golang', source: 'Google', free: true, duration: 150, rating: 4.7, difficulty: 'beginner' },
      { title: 'Rust Book', type: 'book', url: 'https://doc.rust-lang.org/book/', skillSlug: 'rust', source: 'Rust Foundation', free: true, duration: 800, rating: 4.9, difficulty: 'intermediate' },
      { title: 'SQLBolt', type: 'course', url: 'https://sqlbolt.com/', skillSlug: 'sql', source: 'SQLBolt', free: true, duration: 120, rating: 4.6, difficulty: 'beginner' },
      { title: 'MongoDB University', type: 'course', url: 'https://university.mongodb.com/', skillSlug: 'nosql', source: 'MongoDB', free: true, duration: 300, rating: 4.7, difficulty: 'intermediate' },
      { title: 'Docker Getting Started', type: 'course', url: 'https://docs.docker.com/get-started/', skillSlug: 'docker', source: 'Docker', free: true, duration: 180, rating: 4.6, difficulty: 'beginner' },
      { title: 'Kubernetes Basics', type: 'course', url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/', skillSlug: 'kubernetes', source: 'Kubernetes', free: true, duration: 300, rating: 4.5, difficulty: 'intermediate' },
      { title: 'Linux Journey', type: 'course', url: 'https://linuxjourney.com/', skillSlug: 'linux', source: 'Linux Journey', free: true, duration: 400, rating: 4.7, difficulty: 'beginner' },
      { title: 'Git Immersion', type: 'course', url: 'https://gitimmersion.com/', skillSlug: 'git-github', source: 'Git Immersion', free: true, duration: 120, rating: 4.6, difficulty: 'beginner' },
      { title: 'PortSwigger Web Security Academy', type: 'course', url: 'https://portswigger.net/web-security', skillSlug: 'web-security', source: 'PortSwigger', free: true, duration: 1000, rating: 4.9, difficulty: 'intermediate' },
      { title: 'CryptoHack', type: 'course', url: 'https://cryptohack.org/', skillSlug: 'cryptography', source: 'CryptoHack', free: true, duration: 500, rating: 4.8, difficulty: 'intermediate' },
      { title: 'HackTheBox', type: 'course', url: 'https://www.hackthebox.com/', skillSlug: 'penetration-testing', source: 'HackTheBox', free: false, duration: 2000, rating: 4.9, difficulty: 'advanced' },
      { title: 'Andrew Ng ML Course', type: 'course', url: 'https://www.coursera.org/learn/machine-learning', skillSlug: 'machine-learning', source: 'Coursera/Stanford', free: true, duration: 1200, rating: 4.9, difficulty: 'intermediate' },
      { title: 'Fast.ai', type: 'course', url: 'https://www.fast.ai/', skillSlug: 'deep-learning', source: 'Fast.ai', free: true, duration: 800, rating: 4.9, difficulty: 'intermediate' },
      { title: 'Hugging Face Course', type: 'course', url: 'https://huggingface.co/learn/nlp-course', skillSlug: 'nlp', source: 'Hugging Face', free: true, duration: 600, rating: 4.8, difficulty: 'advanced' },
      { title: 'Figma Tutorials', type: 'video', url: 'https://www.youtube.com/figma', skillSlug: 'figma', source: 'Figma', free: true, duration: 300, rating: 4.6, difficulty: 'beginner' },
      { title: 'Google UX Design Certificate', type: 'course', url: 'https://www.coursera.org/professional-certificates/google-ux-design', skillSlug: 'ux-design', source: 'Coursera/Google', free: false, duration: 1800, rating: 4.7, difficulty: 'beginner' },
    ];
    for (const r of resources) {
      const skill = await prisma.skill.findUnique({ where: { slug: r.skillSlug } }).catch(() => null);
      if (skill) await prisma.resource.create({ data: { title: r.title, type: r.type, url: r.url, skillId: skill.id, source: r.source, free: r.free, duration: r.duration, rating: r.rating, difficulty: r.difficulty } }).catch(() => {});
    }

    // Quests
    const quests = [
      { title: 'Build your first HTML page', type: 'project', xpReward: 20, difficulty: 1, estimatedMin: 30, skillSlug: 'web-development', description: 'Create a personal webpage' },
      { title: 'Learn JavaScript Basics', type: 'lesson', xpReward: 15, difficulty: 1, estimatedMin: 60, skillSlug: 'javascript', description: 'Variables, functions, loops' },
      { title: 'Build a Todo App', type: 'project', xpReward: 35, difficulty: 2, estimatedMin: 90, skillSlug: 'javascript', description: 'CRUD app with JS' },
      { title: 'Create a React Component', type: 'project', xpReward: 30, difficulty: 2, estimatedMin: 60, skillSlug: 'react', description: 'Build a reusable component' },
      { title: 'Build a Full-Stack App', type: 'project', xpReward: 75, difficulty: 3, estimatedMin: 240, skillSlug: 'nextjs', description: 'Frontend + Backend + DB' },
      { title: 'Write your first SQL query', type: 'practice', xpReward: 15, difficulty: 1, estimatedMin: 30, skillSlug: 'sql', description: 'SELECT, WHERE, JOIN' },
      { title: 'Dockerize an App', type: 'project', xpReward: 40, difficulty: 3, estimatedMin: 90, skillSlug: 'docker', description: 'Create Dockerfile' },
      { title: 'Complete a CTF Challenge', type: 'challenge', xpReward: 50, difficulty: 3, estimatedMin: 120, skillSlug: 'penetration-testing', description: 'HackTheBox or CTFtime' },
      { title: 'Build a Mobile App', type: 'project', xpReward: 60, difficulty: 3, estimatedMin: 180, skillSlug: 'react-native', description: 'Cross-platform app' },
      { title: 'Train your first ML Model', type: 'project', xpReward: 50, difficulty: 3, estimatedMin: 120, skillSlug: 'machine-learning', description: 'Scikit-learn classification' },
      { title: 'Deploy to Kubernetes', type: 'project', xpReward: 80, difficulty: 4, estimatedMin: 180, skillSlug: 'kubernetes', description: 'Full deployment pipeline' },
      { title: 'Study for 30 minutes', type: 'practice', xpReward: 10, difficulty: 1, estimatedMin: 30, isDaily: true, skillSlug: 'programming' },
      { title: 'Read a technical article', type: 'reading', xpReward: 5, difficulty: 1, estimatedMin: 15, isDaily: true, skillSlug: 'programming' },
      { title: 'Practice coding', type: 'practice', xpReward: 10, difficulty: 1, estimatedMin: 30, isDaily: true, skillSlug: 'javascript' },
      { title: 'Take notes', type: 'lesson', xpReward: 5, difficulty: 1, estimatedMin: 10, isDaily: true, skillSlug: 'programming' },
    ];
    for (const q of quests) {
      const skill = await prisma.skill.findUnique({ where: { slug: q.skillSlug } }).catch(() => null);
      if (skill) await prisma.quest.create({ data: { title: q.title, type: q.type, xpReward: q.xpReward, difficulty: q.difficulty, estimatedMin: q.estimatedMin, skillId: skill.id, description: q.description, isDaily: q.isDaily } }).catch(() => {});
    }

    // Quizzes
    const jsSkill = await prisma.skill.findUnique({ where: { slug: 'javascript' } });
    const jsQuiz = await prisma.quiz.create({ data: { title: 'JavaScript Fundamentals', skillId: jsSkill?.id, difficulty: 1, description: 'Test your JS knowledge' } });
    await prisma.quizQuestion.createMany({ data: [
      { quizId: jsQuiz.id, question: 'What is typeof null?', options: '["null", "undefined", "object", "number"]', correctIdx: 2, explanation: 'typeof null returns "object" - a known JS quirk', order: 1 },
      { quizId: jsQuiz.id, question: 'Which adds to end of array?', options: '["push()", "pop()", "shift()", "unshift()"]', correctIdx: 0, explanation: 'push() adds to the end', order: 2 },
      { quizId: jsQuiz.id, question: 'What does === check?', options: '["Value only", "Type only", "Value and type", "Reference"]', correctIdx: 2, explanation: '=== checks both value and type', order: 3 },
      { quizId: jsQuiz.id, question: 'What is a closure?', options: '["Close browser", "Function with outer scope access", "A loop", "Error handler"]', correctIdx: 1, explanation: 'Closures access outer function variables', order: 4 },
      { quizId: jsQuiz.id, question: 'Which is NOT a JS type?', options: '["string", "boolean", "float", "symbol"]', correctIdx: 2, explanation: 'JS has no separate float type', order: 5 },
    ]});

    const pySkill = await prisma.skill.findUnique({ where: { slug: 'python' } });
    const pyQuiz = await prisma.quiz.create({ data: { title: 'Python Basics', skillId: pySkill?.id, difficulty: 1, description: 'Test your Python knowledge' } });
    await prisma.quizQuestion.createMany({ data: [
      { quizId: pyQuiz.id, question: 'Correct way to create a list?', options: '["(1,2,3)", "[1,2,3]", "{1,2,3}", "<1,2,3>"]', correctIdx: 1, explanation: 'Square brackets create lists', order: 1 },
      { quizId: pyQuiz.id, question: 'What does len() do?', options: '["Last element", "Length", "First element", "Sorts"]', correctIdx: 1, explanation: 'len() returns number of items', order: 2 },
      { quizId: pyQuiz.id, question: 'Keyword for function?', options: '["function", "func", "def", "define"]', correctIdx: 2, explanation: 'def defines functions', order: 3 },
      { quizId: pyQuiz.id, question: 'Output of 3 // 2?', options: '["1.5", "1", "2", "1.0"]', correctIdx: 1, explanation: '// is floor division', order: 4 },
      { quizId: pyQuiz.id, question: 'What is a dictionary?', options: '["Ordered collection", "Key-value pairs", "Loop type", "Function"]', correctIdx: 1, explanation: 'Dictionaries store key-value pairs', order: 5 },
    ]});

    const linuxSkill = await prisma.skill.findUnique({ where: { slug: 'linux' } });
    const linuxQuiz = await prisma.quiz.create({ data: { title: 'Linux Essentials', skillId: linuxSkill?.id, difficulty: 1, description: 'Test your Linux knowledge' } });
    await prisma.quizQuestion.createMany({ data: [
      { quizId: linuxQuiz.id, question: 'Command to list files?', options: '["cd", "ls", "pwd", "cat"]', correctIdx: 1, explanation: 'ls lists directory contents', order: 1 },
      { quizId: linuxQuiz.id, question: 'What does chmod do?', options: '["Change owner", "Change permissions", "Change dir", "Change content"]', correctIdx: 1, explanation: 'chmod modifies permissions', order: 2 },
      { quizId: linuxQuiz.id, question: 'Shows current directory?', options: '["ls", "cd", "pwd", "whoami"]', correctIdx: 2, explanation: 'pwd prints working directory', order: 3 },
      { quizId: linuxQuiz.id, question: 'Superuser is called?', options: '["admin", "root", "sudo", "super"]', correctIdx: 1, explanation: 'root is the superuser', order: 4 },
      { quizId: linuxQuiz.id, question: 'Command to search text?', options: '["find", "grep", "search", "locate"]', correctIdx: 1, explanation: 'grep searches text patterns', order: 5 },
    ]});

    // Synergies
    await prisma.skillSynergy.createMany({ data: [
      { primaryId: js.id, targetId: react.id, bonusXP: 20, description: 'JS boosts React' },
      { primaryId: python.id, targetId: ml.id, bonusXP: 25, description: 'Python accelerates ML' },
      { primaryId: linux.id, targetId: docker.id, bonusXP: 15, description: 'Linux helps containers' },
      { primaryId: linux.id, targetId: security.id, bonusXP: 20, description: 'Linux essential for security' },
      { primaryId: sql.id, targetId: node.id, bonusXP: 15, description: 'DB helps backend' },
      { primaryId: python.id, targetId: ai.id, bonusXP: 30, description: 'Python is AI language' },
      { primaryId: js.id, targetId: node.id, bonusXP: 20, description: 'JS fullstack' },
      { primaryId: git.id, targetId: devops.id, bonusXP: 15, description: 'Git key to DevOps' },
    ]});

    res.json({
      message: '✅ Full seed data created!',
      achievements: 18,
      skills: await prisma.skill.count(),
      resources: await prisma.resource.count(),
      quests: await prisma.quest.count(),
      quizzes: await prisma.quiz.count(),
      synergies: 8
    });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🎮 Level Up v2 Backend running on port ${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
  console.log(`🌳 Skills: http://localhost:${PORT}/api/skills/tree`);
});
