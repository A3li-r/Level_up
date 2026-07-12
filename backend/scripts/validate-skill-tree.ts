#!/usr/bin/env npx tsx
/**
 * Skill Tree Validation & Repair Script
 * Runs every 3 hours via cron to ensure the database skill tree
 * matches the desired structure from the frontend SkillTree.tsx
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Desired Tree Structure (mirrors frontend SkillTree.tsx) ─────────────────
interface DesiredSkill {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  category: string;
  subcategory: string;
  difficulty: number;
  xpPerLevel: number;
  parentId?: string;
  connectsTo?: string[]; // cross-path connections
}

interface DesiredBranch {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  skills: DesiredSkill[];
  connectsTo?: string[]; // cross-branch connections
}

interface DesiredPath {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  glow: string;
  description: string;
  salary: string;
  demand: string;
  branches: DesiredBranch[];
  connectsTo?: string[]; // cross-path connections
}

// Complete desired structure matching frontend SkillTree.tsx
const DESIRED_PATHS: DesiredPath[] = [
  // ── البرمجة ──
  {
    id: 'programming',
    name: 'البرمجة',
    nameEn: 'Programming',
    icon: '◈',
    color: '#22d3ee',
    glow: '#22d3ee40',
    description: 'بناء التطبيقات والأنظمة البرمجية',
    salary: '$70K - $180K',
    demand: 'عالي',
    connectsTo: ['cybersecurity', 'devops', 'automation', 'ai'],
    branches: [
      {
        id: 'prog-fullstack',
        name: 'Full Stack',
        nameEn: 'Full Stack Dev',
        icon: '◆',
        color: '#22d3ee',
        connectsTo: ['prog-mobile'],
        skills: [
          { id: 'fs-html', name: 'HTML/CSS', nameEn: 'HTML/CSS', icon: '◆', category: 'programming', subcategory: 'fullstack', difficulty: 1, xpPerLevel: 30, parentId: undefined, connectsTo: ['fs-js'] },
          { id: 'fs-js', name: 'JavaScript', nameEn: 'JavaScript', icon: '◈', category: 'programming', subcategory: 'fullstack', difficulty: 2, xpPerLevel: 50, parentId: 'fs-html', connectsTo: ['fs-react', 'cy-scripting', 'auto-selenium'] },
          { id: 'fs-react', name: 'React', nameEn: 'React', icon: '◈', category: 'programming', subcategory: 'fullstack', difficulty: 3, xpPerLevel: 80, parentId: 'fs-js', connectsTo: ['fs-next'] },
          { id: 'fs-next', name: 'Next.js', nameEn: 'Next.js', icon: '◈', category: 'programming', subcategory: 'fullstack', difficulty: 4, xpPerLevel: 100, parentId: 'fs-react', connectsTo: [] },
          { id: 'fs-node', name: 'Node.js', nameEn: 'Node.js', icon: '◉', category: 'programming', subcategory: 'fullstack', difficulty: 3, xpPerLevel: 70, parentId: 'fs-js', connectsTo: ['fs-db'] },
          { id: 'fs-db', name: 'قواعد البيانات', nameEn: 'Databases', icon: '⬢', category: 'programming', subcategory: 'fullstack', difficulty: 4, xpPerLevel: 70, parentId: 'fs-node', connectsTo: [] },
        ],
      },
      {
        id: 'prog-mobile',
        name: 'تطبيقات الجوال',
        nameEn: 'Mobile Dev',
        icon: '◉',
        color: '#06b6d4',
        connectsTo: ['prog-fullstack'],
        skills: [
          { id: 'mob-dart', name: 'Dart', nameEn: 'Dart', icon: '◈', category: 'programming', subcategory: 'mobile', difficulty: 1, xpPerLevel: 40, parentId: undefined, connectsTo: ['mob-flutter'] },
          { id: 'mob-flutter', name: 'Flutter', nameEn: 'Flutter', icon: '⬡', category: 'programming', subcategory: 'mobile', difficulty: 3, xpPerLevel: 70, parentId: 'mob-dart', connectsTo: [] },
        ],
      },
    ],
  },

  // ── الأمن السيبراني والهاك ──
  {
    id: 'cybersecurity',
    name: 'الأمن السيبراني والهاك',
    nameEn: 'Cybersecurity & Hacking',
    icon: '⚔',
    color: '#34d399',
    glow: '#34d39940',
    description: 'حماية الأنظمة واكتشاف الثغرات والاختراق الأخلاقي',
    salary: '$80K - $200K',
    demand: 'عالي',
    connectsTo: ['programming', 'devops'],
    branches: [
      {
        id: 'cy-webhack',
        name: 'اختراق الويب',
        nameEn: 'Web Hacking',
        icon: '🌐',
        color: '#f87171',
        connectsTo: ['cy-apphack'],
        skills: [
          { id: 'cy-http', name: 'HTTP & Protocols', nameEn: 'HTTP', icon: '◈', category: 'cybersecurity', subcategory: 'webhack', difficulty: 1, xpPerLevel: 40, parentId: undefined, connectsTo: ['cy-owasp'] },
          { id: 'cy-owasp', name: 'OWASP Top 10', nameEn: 'OWASP', icon: '⚔', category: 'cybersecurity', subcategory: 'webhack', difficulty: 3, xpPerLevel: 80, parentId: 'cy-http', connectsTo: ['cy-burp'] },
          { id: 'cy-burp', name: 'Burp Suite', nameEn: 'Burp Suite', icon: '🔧', category: 'cybersecurity', subcategory: 'webhack', difficulty: 3, xpPerLevel: 70, parentId: 'cy-owasp', connectsTo: [] },
        ],
      },
      {
        id: 'cy-apphack',
        name: 'اختراق التطبيقات',
        nameEn: 'App Hacking',
        icon: '📱',
        color: '#fb923c',
        connectsTo: ['cy-webhack', 'cy-carhack'],
        skills: [
          { id: 'cy-reverse', name: 'Reverse Engineering', nameEn: 'Reverse Eng', icon: '🔍', category: 'cybersecurity', subcategory: 'apphack', difficulty: 4, xpPerLevel: 90, parentId: undefined, connectsTo: ['cy-exploit'] },
          { id: 'cy-exploit', name: 'Exploit Development', nameEn: 'Exploit Dev', icon: '⚡', category: 'cybersecurity', subcategory: 'apphack', difficulty: 5, xpPerLevel: 120, parentId: 'cy-reverse', connectsTo: [] },
        ],
      },
      {
        id: 'cy-carhack',
        name: 'اختراق السيارات',
        nameEn: 'Car Hacking',
        icon: '🚗',
        color: '#facc15',
        connectsTo: ['cy-apphack'],
        skills: [
          { id: 'cy-canbus', name: 'CAN Bus', nameEn: 'CAN Bus', icon: '🔌', category: 'cybersecurity', subcategory: 'carhack', difficulty: 4, xpPerLevel: 80, parentId: undefined, connectsTo: ['cy-ecu'] },
          { id: 'cy-ecu', name: 'ECU Hacking', nameEn: 'ECU Hacking', icon: '⚙', category: 'cybersecurity', subcategory: 'carhack', difficulty: 5, xpPerLevel: 100, parentId: 'cy-canbus', connectsTo: [] },
        ],
      },
      {
        id: 'cy-network',
        name: 'أمن الشبكات',
        nameEn: 'Network Security',
        icon: '🌐',
        color: '#a855f7',
        connectsTo: ['cy-webhack'],
        skills: [
          { id: 'cy-net', name: 'الشبكات', nameEn: 'Networking', icon: '◉', category: 'cybersecurity', subcategory: 'network', difficulty: 2, xpPerLevel: 50, parentId: undefined, connectsTo: ['cy-pentest'] },
          { id: 'cy-pentest', name: 'Pen Testing', nameEn: 'Pen Testing', icon: '⚔', category: 'cybersecurity', subcategory: 'network', difficulty: 4, xpPerLevel: 100, parentId: 'cy-net', connectsTo: ['cy-crypto'] },
          { id: 'cy-crypto', name: 'التشفير', nameEn: 'Cryptography', icon: '🔐', category: 'cybersecurity', subcategory: 'network', difficulty: 4, xpPerLevel: 90, parentId: 'cy-pentest', connectsTo: [] },
        ],
      },
    ],
  },

  // ── التصميم ──
  {
    id: 'design',
    name: 'التصميم',
    nameEn: 'Design',
    icon: '◆',
    color: '#f472b6',
    glow: '#f472b640',
    description: 'تصميم الواجهات والتجربة والهوية البصرية',
    salary: '$60K - $150K',
    demand: 'عالي',
    connectsTo: ['programming'],
    branches: [
      {
        id: 'des-uiux',
        name: 'UI/UX',
        nameEn: 'UI/UX Design',
        icon: '🎨',
        color: '#f472b6',
        connectsTo: ['des-motion', 'des-3d'],
        skills: [
          { id: 'des-figma', name: 'Figma', nameEn: 'Figma', icon: '◈', category: 'design', subcategory: 'uiux', difficulty: 1, xpPerLevel: 50, parentId: undefined, connectsTo: ['des-ui'] },
          { id: 'des-ui', name: 'UI Design', nameEn: 'UI Design', icon: '◆', category: 'design', subcategory: 'uiux', difficulty: 3, xpPerLevel: 70, parentId: 'des-figma', connectsTo: ['des-ux'] },
          { id: 'des-ux', name: 'UX Research', nameEn: 'UX Research', icon: '◎', category: 'design', subcategory: 'uiux', difficulty: 3, xpPerLevel: 60, parentId: 'des-ui', connectsTo: [] },
        ],
      },
      {
        id: 'des-motion',
        name: 'Motion Design',
        nameEn: 'Motion Design',
        icon: '🎬',
        color: '#e879f9',
        connectsTo: ['des-uiux'],
        skills: [
          { id: 'des-anim', name: 'After Effects', nameEn: 'After Effects', icon: '🎞', category: 'design', subcategory: 'motion', difficulty: 3, xpPerLevel: 70, parentId: undefined, connectsTo: [] },
        ],
      },
      {
        id: 'des-3d',
        name: '3D Design',
        nameEn: '3D Design',
        icon: '🧊',
        color: '#8b5cf6',
        connectsTo: ['des-uiux'],
        skills: [
          { id: 'des-blender', name: 'Blender', nameEn: 'Blender', icon: '🧊', category: 'design', subcategory: '3d', difficulty: 4, xpPerLevel: 80, parentId: undefined, connectsTo: [] },
        ],
      },
    ],
  },

  // ── الأتمتة ──
  {
    id: 'automation',
    name: 'الأتمتة',
    nameEn: 'Automation',
    icon: '⚙',
    color: '#fb923c',
    glow: '#fb923c40',
    description: 'أتمتة العمليات والاختبارات وسكربتات',
    salary: '$60K - $140K',
    demand: 'عالي',
    connectsTo: ['programming', 'devops'],
    branches: [
      {
        id: 'auto-qa',
        name: 'اختبار آلي',
        nameEn: 'QA Automation',
        icon: '◇',
        color: '#06b6d4',
        connectsTo: ['auto-rpa'],
        skills: [
          { id: 'auto-selenium', name: 'Selenium', nameEn: 'Selenium', icon: '◈', category: 'automation', subcategory: 'qa', difficulty: 2, xpPerLevel: 60, parentId: undefined, connectsTo: ['auto-cypress'] },
          { id: 'auto-cypress', name: 'Cypress', nameEn: 'Cypress', icon: '⬡', category: 'automation', subcategory: 'qa', difficulty: 3, xpPerLevel: 70, parentId: 'auto-selenium', connectsTo: [] },
        ],
      },
      {
        id: 'auto-rpa',
        name: 'RPA',
        nameEn: 'RPA',
        icon: '🤖',
        color: '#a855f7',
        connectsTo: ['auto-qa'],
        skills: [
          { id: 'auto-puppeteer', name: 'Puppeteer', nameEn: 'Puppeteer', icon: '🎭', category: 'automation', subcategory: 'rpa', difficulty: 3, xpPerLevel: 60, parentId: undefined, connectsTo: [] },
        ],
      },
      {
        id: 'auto-scripts',
        name: 'سكربتات',
        nameEn: 'Scripting',
        icon: '📜',
        color: '#facc15',
        connectsTo: ['auto-qa'],
        skills: [
          { id: 'auto-bash', name: 'Bash/Python', nameEn: 'Bash/Python', icon: '📜', category: 'automation', subcategory: 'scripts', difficulty: 1, xpPerLevel: 50, parentId: undefined, connectsTo: [] },
        ],
      },
    ],
  },

  // ── الذكاء الاصطناعي ──
  {
    id: 'ai',
    name: 'الذكاء الاصطناعي',
    nameEn: 'AI & ML',
    icon: '⬡',
    color: '#a855f7',
    glow: '#a855f740',
    description: 'بناء أنظمة ذكاء اصطناعي وتعلم آلة',
    salary: '$100K - $250K',
    demand: 'عالي',
    connectsTo: ['programming'],
    branches: [
      {
        id: 'ai-ml',
        name: 'تعلم الآلة',
        nameEn: 'Machine Learning',
        icon: '🧠',
        color: '#a855f7',
        connectsTo: ['ai-nlp'],
        skills: [
          { id: 'ai-python', name: 'Python', nameEn: 'Python', icon: '◈', category: 'ai', subcategory: 'ml', difficulty: 1, xpPerLevel: 40, parentId: undefined, connectsTo: ['ai-mlbasic'] },
          { id: 'ai-mlbasic', name: 'ML Basics', nameEn: 'ML Basics', icon: '◈', category: 'ai', subcategory: 'ml', difficulty: 3, xpPerLevel: 80, parentId: 'ai-python', connectsTo: ['ai-dl'] },
          { id: 'ai-dl', name: 'Deep Learning', nameEn: 'Deep Learning', icon: '◉', category: 'ai', subcategory: 'ml', difficulty: 5, xpPerLevel: 120, parentId: 'ai-mlbasic', connectsTo: [] },
        ],
      },
      {
        id: 'ai-nlp',
        name: 'معالجة اللغة',
        nameEn: 'NLP',
        icon: '💬',
        color: '#ec4899',
        connectsTo: ['ai-ml'],
        skills: [
          { id: 'ai-prompt', name: 'Prompt Engineering', nameEn: 'Prompt Eng', icon: '✧', category: 'ai', subcategory: 'nlp', difficulty: 2, xpPerLevel: 60, parentId: undefined, connectsTo: ['ai-llm'] },
          { id: 'ai-llm', name: 'LLMs & RAG', nameEn: 'LLMs', icon: '⬡', category: 'ai', subcategory: 'nlp', difficulty: 4, xpPerLevel: 100, parentId: 'ai-prompt', connectsTo: [] },
        ],
      },
    ],
  },

  // ── DevOps ──
  {
    id: 'devops',
    name: 'DevOps',
    nameEn: 'DevOps',
    icon: '⚙',
    color: '#fb923c',
    glow: '#fb923c40',
    description: 'أتمتة التطوير والنشر والبنية التحتية',
    salary: '$90K - $200K',
    demand: 'عالي',
    connectsTo: ['programming', 'cybersecurity'],
    branches: [
      {
        id: 'ops-infra',
        name: 'البنية التحتية',
        nameEn: 'Infrastructure',
        icon: '🏗',
        color: '#fb923c',
        connectsTo: ['ops-cicd'],
        skills: [
          { id: 'ops-linux', name: 'Linux', nameEn: 'Linux', icon: '⬡', category: 'devops', subcategory: 'infra', difficulty: 1, xpPerLevel: 40, parentId: undefined, connectsTo: ['ops-docker'] },
          { id: 'ops-docker', name: 'Docker', nameEn: 'Docker', icon: '◉', category: 'devops', subcategory: 'infra', difficulty: 3, xpPerLevel: 70, parentId: 'ops-linux', connectsTo: ['ops-k8s'] },
          { id: 'ops-k8s', name: 'Kubernetes', nameEn: 'K8s', icon: '⬡', category: 'devops', subcategory: 'infra', difficulty: 5, xpPerLevel: 120, parentId: 'ops-docker', connectsTo: [] },
        ],
      },
      {
        id: 'ops-cicd',
        name: 'CI/CD',
        nameEn: 'CI/CD Pipelines',
        icon: '🔄',
        color: '#34d399',
        connectsTo: ['ops-infra'],
        skills: [
          { id: 'ops-githubactions', name: 'GitHub Actions', nameEn: 'GH Actions', icon: '🔄', category: 'devops', subcategory: 'cicd', difficulty: 3, xpPerLevel: 70, parentId: undefined, connectsTo: [] },
        ],
      },
    ],
  },

  // ── علوم البيانات ──
  {
    id: 'data',
    name: 'علوم البيانات',
    nameEn: 'Data Science',
    icon: '⬢',
    color: '#facc15',
    glow: '#facc1540',
    description: 'تحليل البيانات واستخراج الرؤى',
    salary: '$90K - $220K',
    demand: 'عالي',
    connectsTo: ['ai'],
    branches: [
      {
        id: 'ds-analysis',
        name: 'تحليل البيانات',
        nameEn: 'Data Analysis',
        icon: '📊',
        color: '#facc15',
        connectsTo: ['ds-viz'],
        skills: [
          { id: 'ds-sql', name: 'SQL', nameEn: 'SQL', icon: '⬢', category: 'data', subcategory: 'analysis', difficulty: 1, xpPerLevel: 45, parentId: undefined, connectsTo: ['ds-pandas'] },
          { id: 'ds-pandas', name: 'Pandas', nameEn: 'Pandas', icon: '⬡', category: 'data', subcategory: 'analysis', difficulty: 3, xpPerLevel: 60, parentId: 'ds-sql', connectsTo: [] },
        ],
      },
      {
        id: 'ds-viz',
        name: 'تصور البيانات',
        nameEn: 'Data Viz',
        icon: '📈',
        color: '#22d3ee',
        connectsTo: ['ds-analysis'],
        skills: [
          { id: 'ds-d3', name: 'D3.js / Charts', nameEn: 'D3.js', icon: '📈', category: 'data', subcategory: 'viz', difficulty: 3, xpPerLevel: 60, parentId: undefined, connectsTo: [] },
        ],
      },
    ],
  },

  // ── الألعاب ──
  {
    id: 'gamedev',
    name: 'تطوير الألعاب',
    nameEn: 'Game Dev',
    icon: '⚔',
    color: '#e879f9',
    glow: '#e879f940',
    description: 'بناء ألعاب فيديو تفاعلية',
    salary: '$60K - $160K',
    demand: 'متوسط',
    connectsTo: ['programming', 'design'],
    branches: [
      {
        id: 'game-unity',
        name: 'Unity',
        nameEn: 'Unity',
        icon: '🎮',
        color: '#e879f9',
        connectsTo: [],
        skills: [
          { id: 'game-csharp', name: 'C#', nameEn: 'C#', icon: '◈', category: 'gamedev', subcategory: 'unity', difficulty: 2, xpPerLevel: 50, parentId: undefined, connectsTo: ['game-unitycore'] },
          { id: 'game-unitycore', name: 'Unity Engine', nameEn: 'Unity', icon: '⬡', category: 'gamedev', subcategory: 'unity', difficulty: 4, xpPerLevel: 80, parentId: 'game-csharp', connectsTo: [] },
        ],
      },
    ],
  },

  // ── Blockchain ──
  {
    id: 'blockchain',
    name: 'Blockchain',
    nameEn: 'Blockchain',
    icon: '⬢',
    color: '#f59e0b',
    glow: '#f59e0b40',
    description: 'العقود الذكية والتطبيقات اللامركزية',
    salary: '$90K - $200K',
    demand: 'متوسط',
    connectsTo: ['programming', 'cybersecurity'],
    branches: [
      {
        id: 'bc-smart',
        name: 'عقود ذكية',
        nameEn: 'Smart Contracts',
        icon: '📋',
        color: '#f59e0b',
        connectsTo: [],
        skills: [
          { id: 'bc-solidity', name: 'Solidity', nameEn: 'Solidity', icon: '◈', category: 'blockchain', subcategory: 'smart', difficulty: 3, xpPerLevel: 70, parentId: undefined, connectsTo: [] },
        ],
      },
    ],
  },

  // ── الأنظمة المدمجة و IoT ──
  {
    id: 'embedded',
    name: 'الأنظمة المدمجة',
    nameEn: 'Embedded & IoT',
    icon: '◉',
    color: '#14b8a6',
    glow: '#14b8a640',
    description: 'برمجة الأجهزة الذكية والمتحكمات',
    salary: '$75K - $170K',
    demand: 'متوسط',
    connectsTo: ['cybersecurity', 'devops'],
    branches: [
      {
        id: 'emb-mcu',
        name: 'المتحكمات',
        nameEn: 'Microcontrollers',
        icon: '🔌',
        color: '#14b8a6',
        connectsTo: [],
        skills: [
          { id: 'emb-c', name: 'C Language', nameEn: 'C', icon: '◈', category: 'embedded', subcategory: 'mcu', difficulty: 2, xpPerLevel: 50, parentId: undefined, connectsTo: ['emb-rtos'] },
          { id: 'emb-rtos', name: 'RTOS', nameEn: 'RTOS', icon: '◉', category: 'embedded', subcategory: 'mcu', difficulty: 4, xpPerLevel: 90, parentId: 'emb-c', connectsTo: [] },
        ],
      },
    ],
  },

  // ── إدارة المنتجات ──
  {
    id: 'product',
    name: 'إدارة المنتجات',
    nameEn: 'Product Management',
    icon: '◈',
    color: '#ec4899',
    glow: '#ec489940',
    description: 'إدارة المنتجات التقنية وقيادة الفرق',
    salary: '$90K - $200K',
    demand: 'عالي',
    connectsTo: ['programming', 'design'],
    branches: [
      {
        id: 'pm-core',
        name: 'أساسيات PM',
        nameEn: 'PM Core',
        icon: '📌',
        color: '#ec4899',
        connectsTo: [],
        skills: [
          { id: 'pm-agile', name: 'Agile/Scrum', nameEn: 'Agile', icon: '⬡', category: 'product', subcategory: 'core', difficulty: 2, xpPerLevel: 50, parentId: undefined, connectsTo: [] },
        ],
      },
    ],
  },
];

// ─── Helper Functions ────────────────────────────────────────────────────────

function getAllDesiredSkills(): DesiredSkill[] {
  const skills: DesiredSkill[] = [];
  for (const path of DESIRED_PATHS) {
    for (const branch of path.branches) {
      skills.push(...branch.skills);
    }
  }
  return skills;
}

function getDesiredPaths() {
  return DESIRED_PATHS.map(p => ({
    id: p.id,
    name: p.name,
    nameEn: p.nameEn,
    icon: p.icon,
    color: p.color,
    description: p.description,
    salary: p.salary,
    demand: p.demand,
    connectsTo: p.connectsTo,
    branchCount: p.branches.length,
    skillCount: p.branches.reduce((acc, b) => acc + b.skills.length, 0),
  }));
}

async function validateTree() {
  console.log('🔍 Starting Skill Tree Validation...\n');
  
  // Get current DB state
  const dbSkills = await prisma.skill.findMany({
    include: { children: true, parent: true },
    orderBy: { createdAt: 'asc' },
  });
  
  const desiredSkills = getAllDesiredSkills();
  const desiredPaths = getDesiredPaths();
  
  console.log(`📊 Current DB: ${dbSkills.length} skills`);
  console.log(`🎯 Desired: ${desiredSkills.length} skills across ${desiredPaths.length} paths\n`);
  
  // Build lookup maps
  const dbById = new Map(dbSkills.map(s => [s.id, s]));
  const dbByName = new Map(dbSkills.map(s => [s.name, s]));
  const desiredById = new Map(desiredSkills.map(s => [s.id, s]));
  
  // Track issues
  const missing: DesiredSkill[] = [];
  const orphaned: typeof dbSkills = [];
  const mismatched: { db: typeof dbSkills[0]; desired: DesiredSkill; diffs: string[] }[] = [];
  
  // Check for missing desired skills
  for (const desired of desiredSkills) {
    const dbSkill = dbById.get(desired.id) || dbByName.get(desired.name);
    if (!dbSkill) {
      missing.push(desired);
    } else {
      // Check for mismatches
      const diffs: string[] = [];
      if (dbSkill.category !== desired.category) diffs.push(`category: ${dbSkill.category} → ${desired.category}`);
      if (dbSkill.subcategory !== desired.subcategory) diffs.push(`subcategory: ${dbSkill.subcategory} → ${desired.subcategory}`);
      if (dbSkill.icon !== desired.icon) diffs.push(`icon: ${dbSkill.icon} → ${desired.icon}`);
      if (dbSkill.difficulty !== desired.difficulty) diffs.push(`difficulty: ${dbSkill.difficulty} → ${desired.difficulty}`);
      if (dbSkill.xpPerLevel !== desired.xpPerLevel) diffs.push(`xpPerLevel: ${dbSkill.xpPerLevel} → ${desired.xpPerLevel}`);
      if ((dbSkill.parentId || null) !== (desired.parentId || null)) diffs.push(`parentId: ${dbSkill.parentId || 'none'} → ${desired.parentId || 'none'}`);
      
      if (diffs.length > 0) {
        mismatched.push({ db: dbSkill, desired, diffs });
      }
    }
  }
  
  // Check for orphaned skills (in DB but not in desired)
  const desiredIds = new Set(desiredSkills.map(s => s.id));
  const desiredNames = new Set(desiredSkills.map(s => s.name));
  for (const dbSkill of dbSkills) {
    if (!desiredIds.has(dbSkill.id) && !desiredNames.has(dbSkill.name)) {
      orphaned.push(dbSkill);
    }
  }
  
  // Report
  let hasIssues = false;
  
  if (missing.length > 0) {
    hasIssues = true;
    console.log(`❌ MISSING SKILLS (${missing.length}):`);
    for (const s of missing) {
      console.log(`   - ${s.id} | ${s.name} (${s.category}/${s.subcategory}) parent: ${s.parentId || 'ROOT'}`);
    }
    console.log('');
  }
  
  if (mismatched.length > 0) {
    hasIssues = true;
    console.log(`⚠️ MISMATCHED SKILLS (${mismatched.length}):`);
    for (const { db, desired, diffs } of mismatched) {
      console.log(`   - ${db.name} (${db.id}):`);
      for (const d of diffs) console.log(`     ${d}`);
    }
    console.log('');
  }
  
  if (orphaned.length > 0) {
    hasIssues = true;
    console.log(`🗑️ ORPHANED SKILLS (${orphaned.length}) - in DB but not in desired:`);
    for (const s of orphaned) {
      console.log(`   - ${s.id} | ${s.name} (${s.category}/${s.subcategory})`);
    }
    console.log('');
  }
  
  // Path structure validation
  console.log('📋 PATH STRUCTURE:');
  for (const path of desiredPaths) {
    const dbPathSkills = dbSkills.filter(s => s.category === path.id || desiredSkills.filter(ds => ds.category === path.id).some(ds => ds.name === s.name));
    console.log(`   ${path.icon} ${path.name} (${path.id}): ${path.branchCount} branches, ${path.skillCount} skills → DB has ${dbPathSkills.length} skills`);
  }
  
  if (!hasIssues) {
    console.log('\n✅ Skill tree is valid and matches desired structure!');
    return { valid: true, missing: 0, mismatched: 0, orphaned: 0 };
  }
  
  return { valid: false, missing: missing.length, mismatched: mismatched.length, orphaned: orphaned.length };
}

async function repairTree(dryRun = false) {
  console.log(`\n🔧 Starting Skill Tree Repair ${dryRun ? '(DRY RUN)' : ''}...\n`);
  
  const desiredSkills = getAllDesiredSkills();
  let created = 0, updated = 0, deleted = 0;
  
  for (const desired of desiredSkills) {
    // Find existing skill by ID or name
    let dbSkill = await prisma.skill.findUnique({ where: { id: desired.id } });
    if (!dbSkill) {
      dbSkill = await prisma.skill.findFirst({ where: { name: desired.name } });
    }
    
    if (!dbSkill) {
      // CREATE
      if (!dryRun) {
        await prisma.skill.create({
          data: {
            id: desired.id,
            name: desired.name,
            slug: desired.id,
            description: `${desired.nameEn} skill in ${desired.category}`,
            icon: desired.icon,
            color: desired.category === 'programming' ? '#22d3ee' :
                   desired.category === 'cybersecurity' ? '#34d399' :
                   desired.category === 'design' ? '#f472b6' :
                   desired.category === 'automation' ? '#fb923c' :
                   desired.category === 'ai' ? '#a855f7' :
                   desired.category === 'devops' ? '#fb923c' :
                   desired.category === 'data' ? '#facc15' :
                   desired.category === 'gamedev' ? '#e879f9' :
                   desired.category === 'blockchain' ? '#f59e0b' :
                   desired.category === 'embedded' ? '#14b8a6' :
                   '#ec4899',
            category: desired.category,
            subcategory: desired.subcategory,
            difficulty: desired.difficulty,
            xpPerLevel: desired.xpPerLevel,
            parentId: desired.parentId || null,
            tags: desired.connectsTo?.join(',') || '',
            maxLevel: 10,
          },
        });
      }
      console.log(`   ➕ CREATE: ${desired.name} (${desired.id})`);
      created++;
    } else {
      // UPDATE if needed
      const needsUpdate = 
        dbSkill.category !== desired.category ||
        dbSkill.subcategory !== desired.subcategory ||
        dbSkill.icon !== desired.icon ||
        dbSkill.difficulty !== desired.difficulty ||