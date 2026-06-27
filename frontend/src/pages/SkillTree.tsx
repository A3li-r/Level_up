import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Data Types ────────────────────────────────────────────
interface SkillTask {
  id: string
  name: string
  xp: number
  type: 'theory' | 'project' | 'challenge' | 'cert'
}

interface Skill {
  id: string
  name: string
  nameEn: string
  icon: string
  status: 'locked' | 'available' | 'active' | 'completed'
  xp: number
  description: string
  tasks: SkillTask[]
  rewards: string[]
  connectsTo: string[]  // skill IDs in other branches/paths
}

interface Branch {
  id: string
  name: string
  nameEn: string
  icon: string
  color: string
  skills: Skill[]
  connectsTo: string[]  // branch IDs
}

interface Path {
  id: string
  name: string
  nameEn: string
  icon: string
  color: string
  glow: string
  description: string
  salary: string
  demand: 'عالي' | 'متوسط' | 'منخفض'
  branches: Branch[]
  connectsTo: string[]  // path IDs
}

// ─── Rich Data ─────────────────────────────────────────────
const careerPaths: Path[] = [
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
          { id: 'fs-html', name: 'HTML/CSS', nameEn: 'HTML/CSS', icon: '◆', status: 'completed', xp: 30, description: 'أساسيات بناء صفحات الويب', tasks: [{ id: 't1', name: 'بناء صفحة شخصية', xp: 15, type: 'project' }, { id: 't2', name: 'CSS Grid & Flexbox', xp: 15, type: 'challenge' }], rewards: ['🛡️ أساسيات الويب'], connectsTo: ['fs-js'] },
          { id: 'fs-js', name: 'JavaScript', nameEn: 'JavaScript', icon: '◈', status: 'active', xp: 50, description: 'لغة البرمجة الأساسية للويب', tasks: [{ id: 't3', name: 'DOM Manipulation', xp: 20, type: 'theory' }, { id: 't4', name: 'تطبيق تفاعلي', xp: 30, type: 'project' }], rewards: ['⚡ JS Warrior'], connectsTo: ['fs-react', 'cy- scripting', 'auto-selenium'] },
          { id: 'fs-react', name: 'React', nameEn: 'React', icon: '◈', status: 'available', xp: 80, description: 'بناء واجهات تفاعلية', tasks: [{ id: 't5', name: 'Components & Props', xp: 25, type: 'theory' }, { id: 't6', name: 'بناء Todo App', xp: 30, type: 'project' }, { id: 't7', name: 'Hooks Advanced', xp: 25, type: 'challenge' }], rewards: ['⚛️ React Coder'], connectsTo: ['fs-next'] },
          { id: 'fs-next', name: 'Next.js', nameEn: 'Next.js', icon: '◈', status: 'locked', xp: 100, description: 'Framework كامل مع SSR', tasks: [{ id: 't8', name: 'SSR & SSG', xp: 30, type: 'theory' }, { id: 't9', name: 'بناء متجر إلكتروني', xp: 70, type: 'project' }], rewards: ['🚀 Next.js Pro'], connectsTo: [] },
          { id: 'fs-node', name: 'Node.js', nameEn: 'Node.js', icon: '◉', status: 'available', xp: 70, description: 'تشغيل JS على السيرفر', tasks: [{ id: 't10', name: 'REST API', xp: 35, type: 'project' }, { id: 't11', name: 'Authentication', xp: 35, type: 'challenge' }], rewards: ['🔧 Backend Ready'], connectsTo: ['fs-db'] },
          { id: 'fs-db', name: 'قواعد البيانات', nameEn: 'Databases', icon: '⬢', status: 'locked', xp: 70, description: 'SQL & NoSQL', tasks: [{ id: 't12', name: 'SQL Queries', xp: 25, type: 'theory' }, { id: 't13', name: 'تصميم Schema', xp: 45, type: 'project' }], rewards: ['💾 DB Master'], connectsTo: [] },
        ]
      },
      {
        id: 'prog-mobile',
        name: 'تطبيقات الجوال',
        nameEn: 'Mobile Dev',
        icon: '◉',
        color: '#06b6d4',
        connectsTo: ['prog-fullstack'],
        skills: [
          { id: 'mob-dart', name: 'Dart', nameEn: 'Dart', icon: '◈', status: 'available', xp: 40, description: 'لغة Flutter', tasks: [{ id: 't14', name: 'أساسيات Dart', xp: 20, type: 'theory' }, { id: 't15', name: 'OOP in Dart', xp: 20, type: 'challenge' }], rewards: ['🎯 Dart Starter'], connectsTo: ['mob-flutter'] },
          { id: 'mob-flutter', name: 'Flutter', nameEn: 'Flutter', icon: '⬡', status: 'locked', xp: 70, description: 'تطبيقات متعددة المنصات', tasks: [{ id: 't16', name: 'Widgets', xp: 25, type: 'theory' }, { id: 't17', name: 'بناء تطبيق chat', xp: 45, type: 'project' }], rewards: ['📱 Flutter Dev'], connectsTo: [] },
        ]
      },
    ]
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
          { id: 'cy-http', name: 'HTTP & Protocols', nameEn: 'HTTP', icon: '◈', status: 'available', xp: 40, description: 'فهم بروتوكولات الويب', tasks: [{ id: 't20', name: 'HTTP Methods', xp: 15, type: 'theory' }, { id: 't21', name: 'تحليل Requests', xp: 25, type: 'challenge' }], rewards: ['🌐 Web Hunter'], connectsTo: ['cy-owasp'] },
          { id: 'cy-owasp', name: 'OWASP Top 10', nameEn: 'OWASP', icon: '⚔', status: 'locked', xp: 80, description: 'أشهر الثغرات الأمنية', tasks: [{ id: 't22', name: 'SQL Injection', xp: 25, type: 'challenge' }, { id: 't23', name: 'XSS Attacks', xp: 25, type: 'challenge' }, { id: 't24', name: 'CSRF', xp: 30, type: 'challenge' }], rewards: ['🛡️ OWASP Warrior'], connectsTo: ['cy-burp'] },
          { id: 'cy-burp', name: 'Burp Suite', nameEn: 'Burp Suite', icon: '🔧', status: 'locked', xp: 70, description: 'أداة اختبار الاختراق', tasks: [{ id: 't25', name: 'Proxy & Intercept', xp: 25, type: 'theory' }, { id: 't26', name: 'اختبار تطبيق حقيقي', xp: 45, type: 'project' }], rewards: ['⚔️ Pen Tester'], connectsTo: [] },
        ]
      },
      {
        id: 'cy-apphack',
        name: 'اختراق التطبيقات',
        nameEn: 'App Hacking',
        icon: '📱',
        color: '#fb923c',
        connectsTo: ['cy-webhack', 'cy-carhack'],
        skills: [
          { id: 'cy-reverse', name: 'Reverse Engineering', nameEn: 'Reverse Eng', icon: '🔍', status: 'locked', xp: 90, description: 'تحليل التطبيقات من الداخل', tasks: [{ id: 't27', name: 'Ghidra Basics', xp: 40, type: 'theory' }, { id: 't28', name: 'تحليل APK', xp: 50, type: 'challenge' }], rewards: ['🔬 Reverse Eng'], connectsTo: ['cy-exploit'] },
          { id: 'cy-exploit', name: 'Exploit Development', nameEn: 'Exploit Dev', icon: '⚡', status: 'locked', xp: 120, description: 'تطوير واستغلال الثغرات', tasks: [{ id: 't29', name: 'Buffer Overflow', xp: 50, type: 'challenge' }, { id: 't30', name: 'كتابة Exploit', xp: 70, type: 'project' }], rewards: ['⚡ Exploit Hacker'], connectsTo: [] },
        ]
      },
      {
        id: 'cy-carhack',
        name: 'اختراق السيارات',
        nameEn: 'Car Hacking',
        icon: '🚗',
        color: '#facc15',
        connectsTo: ['cy-apphack'],
        skills: [
          { id: 'cy-canbus', name: 'CAN Bus', nameEn: 'CAN Bus', icon: '🔌', status: 'locked', xp: 80, description: 'بروتوكول اتصال السيارات', tasks: [{ id: 't31', name: 'فهم CAN Protocol', xp: 30, type: 'theory' }, { id: 't32', name: 'تحليل CAN Messages', xp: 50, type: 'challenge' }], rewards: ['🚗 CAN Master'], connectsTo: ['cy-ecu'] },
          { id: 'cy-ecu', name: 'ECU Hacking', nameEn: 'ECU Hacking', icon: '⚙', status: 'locked', xp: 100, description: 'اختراق وحدات التحكم', tasks: [{ id: 't33', name: 'ECU Flashing', xp: 50, type: 'challenge' }, { id: 't34', name: 'Fuzzing ECU', xp: 50, type: 'project' }], rewards: ['⚙️ ECU Hacker'], connectsTo: [] },
        ]
      },
      {
        id: 'cy-network',
        name: 'أمن الشبكات',
        nameEn: 'Network Security',
        icon: '🌐',
        color: '#a855f7',
        connectsTo: ['cy-webhack'],
        skills: [
          { id: 'cy-net', name: 'الشبكات', nameEn: 'Networking', icon: '◉', status: 'available', xp: 50, description: 'TCP/IP & Protocols', tasks: [{ id: 't35', name: 'Wireshark', xp: 25, type: 'theory' }, { id: 't36', name: 'تحليل حركة شبكة', xp: 25, type: 'challenge' }], rewards: ['📡 Net Analyst'], connectsTo: ['cy-pentest'] },
          { id: 'cy-pentest', name: 'Pen Testing', nameEn: 'Pen Testing', icon: '⚔', status: 'locked', xp: 100, description: 'اختبار الاختراق الشامل', tasks: [{ id: 't37', name: 'Nmap & Scanning', xp: 30, type: 'challenge' }, { id: 't38', name: 'شبكة كاملة اختراق', xp: 70, type: 'project' }], rewards: ['⚔️ Pen Tester Pro'], connectsTo: ['cy-crypto'] },
          { id: 'cy-crypto', name: 'التشفير', nameEn: 'Cryptography', icon: '🔐', status: 'locked', xp: 90, description: 'علم التشفير وفك التشفير', tasks: [{ id: 't39', name: 'AES & RSA', xp: 40, type: 'theory' }, { id: 't40', name: 'فك تشفير حقيقي', xp: 50, type: 'challenge' }], rewards: ['🔐 Crypto Master'], connectsTo: [] },
        ]
      },
    ]
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
          { id: 'des-figma', name: 'Figma', nameEn: 'Figma', icon: '◈', status: 'available', xp: 50, description: 'أداة التصميم الأساسية', tasks: [{ id: 't50', name: 'Auto Layout', xp: 15, type: 'theory' }, { id: 't51', name: 'تصميم dashboard', xp: 35, type: 'project' }], rewards: ['🎨 Figma Pro'], connectsTo: ['des-ui'] },
          { id: 'des-ui', name: 'UI Design', nameEn: 'UI Design', icon: '◆', status: 'locked', xp: 70, description: 'تصميم واجهات احترافية', tasks: [{ id: 't52', name: 'Color Theory', xp: 20, type: 'theory' }, { id: 't53', name: 'Design System', xp: 50, type: 'project' }], rewards: ['✨ UI Artist'], connectsTo: ['des-ux'] },
          { id: 'des-ux', name: 'UX Research', nameEn: 'UX Research', icon: '◎', status: 'locked', xp: 60, description: 'بحث تجربة المستخدم', tasks: [{ id: 't54', name: 'User Interviews', xp: 25, type: 'theory' }, { id: 't55', name: 'A/B Testing', xp: 35, type: 'challenge' }], rewards: ['🧠 UX Master'], connectsTo: [] },
        ]
      },
      {
        id: 'des-motion',
        name: 'Motion Design',
        nameEn: 'Motion Design',
        icon: '🎬',
        color: '#e879f9',
        connectsTo: ['des-uiux'],
        skills: [
          { id: 'des-anim', name: 'After Effects', nameEn: 'After Effects', icon: '🎞', status: 'locked', xp: 70, description: 'أنيميشن احترافية', tasks: [{ id: 't56', name: 'Keyframes', xp: 25, type: 'theory' }, { id: 't57', name: 'Micro-interactions', xp: 45, type: 'project' }], rewards: ['🎬 Motion Artist'], connectsTo: [] },
        ]
      },
      {
        id: 'des-3d',
        name: '3D Design',
        nameEn: '3D Design',
        icon: '🧊',
        color: '#8b5cf6',
        connectsTo: ['des-uiux'],
        skills: [
          { id: 'des-blender', name: 'Blender', nameEn: 'Blender', icon: '🧊', status: 'locked', xp: 80, description: 'نمذجة ثلاثية الأبعاد', tasks: [{ id: 't58', name: 'Modeling', xp: 30, type: 'theory' }, { id: 't59', name: 'تصميم مشهد 3D', xp: 50, type: 'project' }], rewards: ['🧊 3D Creator'], connectsTo: [] },
        ]
      },
    ]
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
          { id: 'auto-selenium', name: 'Selenium', nameEn: 'Selenium', icon: '◈', status: 'available', xp: 60, description: 'أتمتة اختبار الويب', tasks: [{ id: 't60', name: 'WebDriver', xp: 25, type: 'theory' }, { id: 't61', name: 'اختبار تطبيق كامل', xp: 35, type: 'project' }], rewards: ['🧪 QA Starter'], connectsTo: ['auto-cypress'] },
          { id: 'auto-cypress', name: 'Cypress', nameEn: 'Cypress', icon: '⬡', status: 'locked', xp: 70, description: 'اختبار E2E حديث', tasks: [{ id: 't62', name: 'E2E Tests', xp: 30, type: 'challenge' }, { id: 't63', name: 'CI Integration', xp: 40, type: 'project' }], rewards: ['🧪 Cypress Pro'], connectsTo: [] },
        ]
      },
      {
        id: 'auto-rpa',
        name: 'RPA',
        nameEn: 'RPA',
        icon: '🤖',
        color: '#a855f7',
        connectsTo: ['auto-qa'],
        skills: [
          { id: 'auto-puppeteer', name: 'Puppeteer', nameEn: 'Puppeteer', icon: '🎭', status: 'locked', xp: 60, description: 'أتمتة المتصفح', tasks: [{ id: 't64', name: 'Web Scraping', xp: 25, type: 'challenge' }, { id: 't65', name: 'أتمتة نموذج', xp: 35, type: 'project' }], rewards: ['🤖 RPA Dev'], connectsTo: [] },
        ]
      },
      {
        id: 'auto-scripts',
        name: 'سكربتات',
        nameEn: 'Scripting',
        icon: '📜',
        color: '#facc15',
        connectsTo: ['auto-qa'],
        skills: [
          { id: 'auto-bash', name: 'Bash/Python', nameEn: 'Bash/Python', icon: '📜', status: 'available', xp: 50, description: 'سكربتات أتمتة', tasks: [{ id: 't66', name: 'Shell Scripting', xp: 25, type: 'theory' }, { id: 't67', name: 'أتمتة deployment', xp: 25, type: 'project' }], rewards: ['📜 Scripter'], connectsTo: [] },
        ]
      },
    ]
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
          { id: 'ai-python', name: 'Python', nameEn: 'Python', icon: '◈', status: 'available', xp: 40, description: 'لغة AI الأساسية', tasks: [{ id: 't70', name: 'NumPy & Pandas', xp: 20, type: 'theory' }, { id: 't71', name: 'تحليل بيانات', xp: 20, type: 'project' }], rewards: ['🐍 Pythonista'], connectsTo: ['ai-mlbasic'] },
          { id: 'ai-mlbasic', name: 'ML Basics', nameEn: 'ML Basics', icon: '◈', status: 'locked', xp: 80, description: 'خوارزميات تعلم الآلة', tasks: [{ id: 't72', name: 'Regression', xp: 25, type: 'theory' }, { id: 't73', name: 'بناء نموذج تنبؤ', xp: 55, type: 'project' }], rewards: ['🧠 ML Learner'], connectsTo: ['ai-dl'] },
          { id: 'ai-dl', name: 'Deep Learning', nameEn: 'Deep Learning', icon: '◉', status: 'locked', xp: 120, description: 'الشبكات العصبية العميقة', tasks: [{ id: 't74', name: 'Neural Networks', xp: 40, type: 'theory' }, { id: 't75', name: 'تصنيف صور', xp: 80, type: 'project' }], rewards: ['🧬 DL Wizard'], connectsTo: [] },
        ]
      },
      {
        id: 'ai-nlp',
        name: 'معالجة اللغة',
        nameEn: 'NLP',
        icon: '💬',
        color: '#ec4899',
        connectsTo: ['ai-ml'],
        skills: [
          { id: 'ai-prompt', name: 'Prompt Engineering', nameEn: 'Prompt Eng', icon: '✧', status: 'available', xp: 60, description: 'تصميم أوامر AI', tasks: [{ id: 't76', name: 'Prompt Patterns', xp: 30, type: 'theory' }, { id: 't77', name: 'بناء AI Agent', xp: 30, type: 'project' }], rewards: ['✧ Prompt Master'], connectsTo: ['ai-llm'] },
          { id: 'ai-llm', name: 'LLMs & RAG', nameEn: 'LLMs', icon: '⬡', status: 'locked', xp: 100, description: 'نماذج اللغة الكبيرة', tasks: [{ id: 't78', name: 'Fine-tuning', xp: 50, type: 'challenge' }, { id: 't79', name: 'RAG System', xp: 50, type: 'project' }], rewards: ['🤖 LLM Engineer'], connectsTo: [] },
        ]
      },
    ]
  },

  // ─ـ DevOps ──
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
          { id: 'ops-linux', name: 'Linux', nameEn: 'Linux', icon: '⬡', status: 'available', xp: 40, description: 'إدارة أنظمة Linux', tasks: [{ id: 't80', name: 'Shell Commands', xp: 15, type: 'theory' }, { id: 't81', name: 'إدارة سيرفر', xp: 25, type: 'challenge' }], rewards: ['🐧 Linux Admin'], connectsTo: ['ops-docker'] },
          { id: 'ops-docker', name: 'Docker', nameEn: 'Docker', icon: '◉', status: 'locked', xp: 70, description: 'الحاويات والتشغيل', tasks: [{ id: 't82', name: 'Dockerfile', xp: 25, type: 'theory' }, { id: 't83', name: 'Dockerize تطبيق', xp: 45, type: 'project' }], rewards: ['🐳 Docker Pro'], connectsTo: ['ops-k8s'] },
          { id: 'ops-k8s', name: 'Kubernetes', nameEn: 'K8s', icon: '⬡', status: 'locked', xp: 120, description: 'إدارة الحاويات على نطاق واسع', tasks: [{ id: 't84', name: 'Pods & Services', xp: 40, type: 'theory' }, { id: 't85', name: 'نشر تطبيق على K8s', xp: 80, type: 'project' }], rewards: ['☸️ K8s Master'], connectsTo: [] },
        ]
      },
      {
        id: 'ops-cicd',
        name: 'CI/CD',
        nameEn: 'CI/CD Pipelines',
        icon: '🔄',
        color: '#34d399',
        connectsTo: ['ops-infra'],
        skills: [
          { id: 'ops-githubactions', name: 'GitHub Actions', nameEn: 'GH Actions', icon: '🔄', status: 'locked', xp: 70, description: 'أتمتة البناء والنشر', tasks: [{ id: 't86', name: 'Workflow YAML', xp: 25, type: 'theory' }, { id: 't87', name: 'CI Pipeline كامل', xp: 45, type: 'project' }], rewards: ['🔄 CI/CD Pro'], connectsTo: [] },
        ]
      },
    ]
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
          { id: 'ds-sql', name: 'SQL', nameEn: 'SQL', icon: '⬢', status: 'available', xp: 45, description: 'استعلام قواعد البيانات', tasks: [{ id: 't90', name: 'Joins & Subqueries', xp: 20, type: 'theory' }, { id: 't91', name: 'تحليل بيانات حقيقية', xp: 25, type: 'project' }], rewards: ['📊 SQL Pro'], connectsTo: ['ds-pandas'] },
          { id: 'ds-pandas', name: 'Pandas', nameEn: 'Pandas', icon: '⬡', status: 'locked', xp: 60, description: 'معالجة البيانات بPython', tasks: [{ id: 't92', name: 'Data Cleaning', xp: 25, type: 'theory' }, { id: 't93', name: 'تحليل مالي', xp: 35, type: 'project' }], rewards: ['🐼 Pandas Master'], connectsTo: [] },
        ]
      },
      {
        id: 'ds-viz',
        name: 'تصور البيانات',
        nameEn: 'Data Viz',
        icon: '📈',
        color: '#22d3ee',
        connectsTo: ['ds-analysis'],
        skills: [
          { id: 'ds-d3', name: 'D3.js / Charts', nameEn: 'D3.js', icon: '📈', status: 'locked', xp: 60, description: 'تصور تفاعلي', tasks: [{ id: 't94', name: 'Charts', xp: 20, type: 'theory' }, { id: 't95', name: 'Dashboard تفاعلي', xp: 40, type: 'project' }], rewards: ['📈 Viz Artist'], connectsTo: [] },
        ]
      },
    ]
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
          { id: 'game-csharp', name: 'C#', nameEn: 'C#', icon: '◈', status: 'available', xp: 50, description: 'لغة Unity', tasks: [{ id: 't100', name: 'OOP in C#', xp: 25, type: 'theory' }, { id: 't101', name: 'بناء لعبة بسيطة', xp: 25, type: 'project' }], rewards: ['🎮 C# Game Dev'], connectsTo: ['game-unitycore'] },
          { id: 'game-unitycore', name: 'Unity Engine', nameEn: 'Unity', icon: '⬡', status: 'locked', xp: 80, description: 'محرك الألعاب', tasks: [{ id: 't102', name: 'Physics & Colliders', xp: 30, type: 'theory' }, { id: 't103', name: 'لعبة 2D كاملة', xp: 50, type: 'project' }], rewards: ['🎮 Unity Dev'], connectsTo: [] },
        ]
      },
    ]
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
          { id: 'bc-solidity', name: 'Solidity', nameEn: 'Solidity', icon: '◈', status: 'available', xp: 70, description: 'لغة العقود الذكية', tasks: [{ id: 't110', name: 'ERC-20 Token', xp: 35, type: 'challenge' }, { id: 't111', name: 'NFT Contract', xp: 35, type: 'project' }], rewards: ['📋 Smart Contract Dev'], connectsTo: [] },
        ]
      },
    ]
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
          { id: 'emb-c', name: 'C Language', nameEn: 'C', icon: '◈', status: 'available', xp: 50, description: 'لغة الهاردوير', tasks: [{ id: 't120', name: 'Pointers & Memory', xp: 25, type: 'theory' }, { id: 't121', name: 'برمجة Arduino', xp: 25, type: 'project' }], rewards: ['🔌 C Embedded'], connectsTo: ['emb-rtos'] },
          { id: 'emb-rtos', name: 'RTOS', nameEn: 'RTOS', icon: '◉', status: 'locked', xp: 90, description: 'أنظمة تشغيل الوقت الحقيقي', tasks: [{ id: 't122', name: 'FreeRTOS', xp: 40, type: 'theory' }, { id: 't123', name: 'مشروع IoT', xp: 50, type: 'project' }], rewards: ['⚙️ RTOS Pro'], connectsTo: [] },
        ]
      },
    ]
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
          { id: 'pm-agile', name: 'Agile/Scrum', nameEn: 'Agile', icon: '⬡', status: 'available', xp: 50, description: 'إدارة المشاريع المرنة', tasks: [{ id: 't130', name: 'Sprint Planning', xp: 25, type: 'theory' }, { id: 't131', name: 'إدارة مشروع حقيقي', xp: 25, type: 'project' }], rewards: ['📌 Agile PM'], connectsTo: [] },
        ]
      },
    ]
  },
]

// ─── Component ─────────────────────────────────────────────
export default function SkillTree() {
  const [selectedPath, setSelectedPath] = useState<Path | null>(null)
  const [expandedBranch, setExpandedBranch] = useState<string | null>(null)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'tree'>('tree')

  const filteredPaths = useMemo(() => {
    if (!searchQuery) return careerPaths
    const q = searchQuery.toLowerCase()
    return careerPaths.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.nameEn.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.branches.some(b =>
        b.name.toLowerCase().includes(q) ||
        b.skills.some(s => s.name.toLowerCase().includes(q) || s.nameEn.toLowerCase().includes(q))
      )
    )
  }, [searchQuery])

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return { color: '#34d399', bg: '#34d39920', border: '#34d39940', label: 'مكتمل' }
      case 'active': return { color: '#22d3ee', bg: '#22d3ee20', border: '#22d3ee40', label: 'نشط' }
      case 'available': return { color: '#fb923c', bg: '#fb923c20', border: '#fb923c40', label: 'متاح' }
      default: return { color: '#6b7280', bg: '#6b728020', border: '#6b728040', label: 'مقفل' }
    }
  }

  const getDemandColor = (d: string) => {
    if (d === 'عالي') return '#34d399'
    if (d === 'متوسط') return '#facc15'
    return '#f87171'
  }

  const toggleBranch = useCallback((id: string) => {
    setExpandedBranch(prev => prev === id ? null : id)
  }, [])

  // ── Render: Tree View ──
  const renderTreeView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {filteredPaths.map((path, pi) => (
        <motion.div
          key={path.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: pi * 0.05 }}
        >
          {/* Path Root (Trunk) */}
          <motion.div
            whileHover={{ x: 4 }}
            onClick={() => { setSelectedPath(selectedPath?.id === path.id ? null : path); setExpandedBranch(null) }}
            style={{
              padding: '14px 18px',
              borderRadius: 14,
              background: selectedPath?.id === path.id
                ? `linear-gradient(135deg, ${path.color}15, rgba(17,17,40,0.9))`
                : 'rgba(17, 17, 40, 0.6)',
              border: `1px solid ${selectedPath?.id === path.id ? `${path.color}50` : 'var(--border)'}`,
              cursor: 'pointer',
              transition: 'all 0.3s',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Glow accent */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: `linear-gradient(90deg, ${path.color}, transparent)`
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Tree icon */}
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: `${path.color}15`, border: `1px solid ${path.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0
              }}>
                {path.icon}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: path.color }}>{path.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{path.nameEn}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{path.description}</p>
              </div>

              <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                <span className="tag" style={{
                  borderColor: `${getDemandColor(path.demand)}40`, color: getDemandColor(path.demand),
                  background: `${getDemandColor(path.demand)}10`, fontSize: 11
                }}>{path.demand}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{path.branches.length} فرع</span>
                <motion.span
                  animate={{ rotate: selectedPath?.id === path.id ? 90 : 0 }}
                  style={{ fontSize: 14, color: 'var(--text-muted)' }}
                >◀</motion.span>
              </div>
            </div>

            {/* Cross-path connections */}
            {path.connectsTo.length > 0 && (
              <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>🔗 مرتبط:</span>
                {path.connectsTo.map(cid => {
                  const cp = careerPaths.find(p => p.id === cid)
                  return cp ? (
                    <span key={cid} style={{
                      fontSize: 10, padding: '2px 8px', borderRadius: 10,
                      background: `${cp.color}10`, color: cp.color,
                      border: `1px solid ${cp.color}20`
                    }}>{cp.icon} {cp.name}</span>
                  ) : null
                })}
              </div>
            )}
          </motion.div>

          {/* Expanded: Branches */}
          <AnimatePresence>
            {selectedPath?.id === path.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden', paddingRight: 8 }}
              >
                {/* SVG connection lines from trunk to branches */}
                <div style={{ position: 'relative', marginTop: 4 }}>
                  <svg width="28" height={path.branches.length * 8 + 12} style={{ position: 'absolute', right: -4, top: 0 }}>
                    <line x1="14" y1="0" x2="14" y2="100%" stroke={path.color} strokeWidth="2" strokeDasharray="4 3" opacity="0.3" />
                  </svg>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 8 }}>
                    {path.branches.map((branch, bi) => (
                      <motion.div
                        key={branch.id}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: bi * 0.08 }}
                      >
                        {/* Branch node */}
                        <div
                          onClick={() => toggleBranch(branch.id)}
                          style={{
                            padding: '10px 14px',
                            paddingRight: 24,
                            borderRadius: 12,
                            background: expandedBranch === branch.id
                              ? `${branch.color}10`
                              : 'rgba(17, 17, 40, 0.4)',
                            border: `1px solid ${expandedBranch === branch.id ? `${branch.color}30` : 'var(--border)'}`,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            position: 'relative',
                          }}
                        >
                          {/* Branch connector line */}
                          <div style={{
                            position: 'absolute', right: -8, top: '50%',
                            width: 12, height: 2,
                            background: path.color, opacity: 0.3
                          }} />

                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 18 }}>{branch.icon}</span>
                            <div style={{ flex: 1 }}>
                              <span style={{ fontSize: 14, fontWeight: 700, color: branch.color }}>{branch.name}</span>
                              <span style={{ fontSize: 11, color: 'var(--text-muted)', marginRight: 8 }}>{branch.nameEn}</span>
                            </div>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{branch.skills.length} مهارة</span>
                            <span style={{
                              fontSize: 12, color: expandedBranch === branch.id ? branch.color : 'var(--text-muted)',
                              transition: 'color 0.2s'
                            }}>{expandedBranch === branch.id ? '▲' : '▼'}</span>
                          </div>

                          {/* Cross-branch connections */}
                          {branch.connectsTo.length > 0 && (
                            <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                              {branch.connectsTo.map(bid => {
                                const bb = path.branches.find(b => b.id === bid)
                                return bb ? (
                                  <span key={bid} style={{
                                    fontSize: 10, padding: '1px 6px', borderRadius: 8,
                                    background: `${bb.color}10`, color: bb.color,
                                  }}>↗ {bb.name}</span>
                                ) : null
                              })}
                            </div>
                          )}
                        </div>

                        {/* Skills (leaves) */}
                        <AnimatePresence>
                          {expandedBranch === branch.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              style={{ overflow: 'hidden', paddingRight: 20 }}
                            >
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 6, paddingBottom: 4 }}>
                                {branch.skills.map((skill, si) => {
                                  const st = getStatusStyle(skill.status)
                                  const isActive = selectedSkill?.id === skill.id
                                  return (
                                    <motion.div
                                      key={skill.id}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: si * 0.05 }}
                                      onClick={() => setSelectedSkill(isActive ? null : skill)}
                                      style={{
                                        padding: '8px 12px',
                                        borderRadius: 10,
                                        background: isActive ? `${st.color}10` : 'rgba(17,17,40,0.3)',
                                        border: `1px solid ${isActive ? st.border : 'transparent'}`,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        position: 'relative',
                                      }}
                                    >
                                      {/* Leaf connector */}
                                      <div style={{
                                        position: 'absolute', right: -12, top: '50%',
                                        width: 10, height: 1.5,
                                        background: branch.color, opacity: 0.2
                                      }} />

                                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{
                                          width: 28, height: 28, borderRadius: 8,
                                          background: st.bg, border: `1px solid ${st.border}`,
                                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                                          fontSize: 13, flexShrink: 0
                                        }}>{skill.icon}</span>

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <span style={{ fontSize: 13, fontWeight: 600, color: st.color }}>{skill.name}</span>
                                            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{skill.nameEn}</span>
                                          </div>
                                          <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.3 }}>{skill.description}</p>
                                        </div>

                                        <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }}>
                                          <span style={{ fontSize: 11, fontWeight: 700, color: st.color }}>{skill.xp}XP</span>
                                          {skill.status === 'completed' && <span style={{ fontSize: 12 }}>✅</span>}
                                          {skill.status === 'active' && <span style={{ fontSize: 12 }}>🔥</span>}
                                          {skill.status === 'locked' && <span style={{ fontSize: 12 }}>🔒</span>}
                                        </div>
                                      </div>

                                      {/* Cross-skill connections */}
                                      {skill.connectsTo.length > 0 && (
                                        <div style={{ display: 'flex', gap: 3, marginTop: 4, flexWrap: 'wrap' }}>
                                          {skill.connectsTo.slice(0, 3).map(cid => {
                                            // find the connected skill across all paths
                                            let found: { name: string; color: string } | null = null
                                            for (const p of careerPaths) {
                                              for (const b of p.branches) {
                                                const s = b.skills.find(sk => sk.id === cid)
                                                if (s) { found = { name: s.name, color: p.color }; break }
                                              }
                                              if (found) break
                                            }
                                            return found ? (
                                              <span key={cid} style={{
                                                fontSize: 9, padding: '1px 5px', borderRadius: 6,
                                                background: `${found.color}08`, color: found.color,
                                                border: `1px solid ${found.color}15`
                                              }}>🔗 {found.name}</span>
                                            ) : null
                                          })}
                                        </div>
                                      )}
                                    </motion.div>
                                  )
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )

  // ── Render: Grid View (compact) ──
  const renderGridView = () => (
    <div className="card-grid">
      {filteredPaths.map((path, i) => (
        <motion.div
          key={path.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          whileHover={{ y: -4 }}
          onClick={() => setSelectedPath(path)}
          style={{
            padding: 18, borderRadius: 14,
            background: 'rgba(17, 17, 40, 0.7)',
            border: '1px solid var(--border)',
            cursor: 'pointer', transition: 'all 0.3s',
            position: 'relative', overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${path.color}, transparent)` }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 22 }}>{path.icon}</span>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: path.color, marginBottom: 2 }}>{path.name}</h3>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{path.nameEn}</span>
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: 10 }}>{path.description}</p>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {path.branches.map(b => (
              <span key={b.id} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 8, background: `${b.color}10`, color: b.color }}>
                {b.icon} {b.name}
              </span>
            ))}
          </div>
          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: 12, color: getDemandColor(path.demand), fontWeight: 600 }}>{path.demand} الطلب</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{path.salary}</span>
          </div>
        </motion.div>
      ))}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div>
        <motion.h2 className="section-title" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <span style={{ color: '#22d3ee' }}>⬡</span> شجرة المهارات والمسارات
        </motion.h2>
        <p className="section-subtitle">
          {careerPaths.length} مسار · {careerPaths.reduce((a, p) => a + p.branches.length, 0)} فرع · {careerPaths.reduce((a, p) => a + p.branches.reduce((b, br) => b + br.skills.length, 0), 0)} مهارة
        </p>
      </div>

      {/* Search + View Toggle */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            placeholder="ابحث عن مسار أو مهارة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '12px 18px', paddingRight: 40, borderRadius: 12,
              border: '1px solid var(--border)', background: 'rgba(17, 17, 40, 0.8)',
              color: 'var(--text-primary)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none'
            }}
          />
          <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'var(--text-muted)' }}>🔍</span>
        </motion.div>

        {/* View mode toggle */}
        <div style={{ display: 'flex', background: 'rgba(17,17,40,0.8)', borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden' }}>
          {(['tree', 'grid'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: '8px 14px', border: 'none', cursor: 'pointer', fontSize: 13,
                background: viewMode === mode ? '#22d3ee20' : 'transparent',
                color: viewMode === mode ? '#22d3ee' : 'var(--text-muted)',
                fontWeight: viewMode === mode ? 700 : 400,
                transition: 'all 0.2s'
              }}
            >
              {mode === 'tree' ? '🌳 شجرة' : '📊 شبكة'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {viewMode === 'tree' ? renderTreeView() : renderGridView()}

      {/* Skill Detail Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSkill(null)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', zIndex: 1000, padding: 20
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              onClick={e => e.stopPropagation()}
              className="glass-strong"
              style={{ padding: 28, maxWidth: 480, width: '100%' }}
            >
              {(() => {
                const st = getStatusStyle(selectedSkill.status)
                return (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 14,
                        background: st.bg, border: `2px solid ${st.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22
                      }}>{selectedSkill.icon}</div>
                      <div>
                        <h3 style={{ fontSize: 18, fontWeight: 900, color: st.color, marginBottom: 2 }}>{selectedSkill.name}</h3>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{selectedSkill.nameEn}</span>
                      </div>
                      <span style={{ marginLeft: 'auto', padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>{st.label}</span>
                    </div>

                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 18 }}>{selectedSkill.description}</p>

                    {/* XP Bar */}
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>نقاط الخبرة</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: st.color }}>{selectedSkill.xp} XP</span>
                      </div>
                      <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.05)' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, selectedSkill.xp)}%` }}
                          style={{ height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${st.color}, ${st.color}80)` }}
                        />
                      </div>
                    </div>

                    {/* Tasks */}
                    <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>📋 المهام</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                      {selectedSkill.tasks.map((task, ti) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: ti * 0.08 }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 14px', borderRadius: 10,
                            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)'
                          }}
                        >
                          <span style={{ fontSize: 14 }}>
                            {task.type === 'theory' ? '📖' : task.type === 'project' ? '🏗' : task.type === 'challenge' ? '⚔' : '🏆'}
                          </span>
                          <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{task.name}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-orange)' }}>+{task.xp} XP</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Rewards */}
                    {selectedSkill.rewards.length > 0 && (
                      <>
                        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>🎁 الجوائز</h4>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
                          {selectedSkill.rewards.map((r, ri) => (
                            <span key={ri} style={{
                              padding: '6px 12px', borderRadius: 10, fontSize: 13,
                              background: `${st.color}15`, color: st.color, border: `1px solid ${st.color}30`,
                              fontWeight: 600
                            }}>{r}</span>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Connections */}
                    {selectedSkill.connectsTo.length > 0 && (
                      <>
                        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>🔗 مهارات مرتبطة</h4>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
                          {selectedSkill.connectsTo.map(cid => {
                            let found: { name: string; color: string; pathName: string } | null = null
                            for (const p of careerPaths) {
                              for (const b of p.branches) {
                                const s = b.skills.find(sk => sk.id === cid)
                                if (s) { found = { name: s.name, color: p.color, pathName: p.name }; break }
                              }
                              if (found) break
                            }
                            return found ? (
                              <span key={cid} style={{
                                padding: '5px 10px', borderRadius: 8, fontSize: 12,
                                background: `${found.color}10`, color: found.color,
                                border: `1px solid ${found.color}20`, fontWeight: 600
                              }}>↗ {found.name} ({found.pathName})</span>
                            ) : null
                          })}
                        </div>
                      </>
                    )}

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn-primary" style={{ flex: 1 }}>
                        {selectedSkill.status === 'locked' ? '🔓 فتح المهارة' : selectedSkill.status === 'active' ? '▶ متابعة' : '⬡ ابدأ التعلم'}
                      </button>
                      <button className="btn-secondary" onClick={() => setSelectedSkill(null)}>✕</button>
                    </div>
                  </>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
