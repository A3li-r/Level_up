import { useState, useMemo, useRef, useEffect, useCallback, type ReactNode, type PointerEvent as ReactPointerEvent } from 'react'
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
    ],
  },
  // ── تصميم UI/UX ──
  {
    id: 'design-uiux',
    name: 'تصميم UI/UX',
    nameEn: 'UI/UX Design',
    icon: '◆',
    color: '#f472b6',
    glow: '#f472b640',
    description: 'تصميم واجهات ومواقع يستخدمها الملايين',
    salary: '$60K - $150K',
    demand: 'عالي',
    connectsTo: ['programming', 'product'],
    branches: [
      {
        id: 'uix-basics',
        name: 'أساسيات التصميم',
        nameEn: 'Design Basics',
        icon: '🎨',
        color: '#f472b6',
        connectsTo: [],
        skills: [
          { id: 'uix-color', name: 'نظرية الألوان', nameEn: 'Color Theory', icon: '◆', status: 'available', xp: 40, description: 'فهم الألوان وتأثيرها', tasks: [{ id: 'dt1', name: 'لوحة ألوان', xp: 20, type: 'project' }, { id: 'dt2', name: 'تباين الألوان', xp: 20, type: 'theory' }], rewards: ['🎨 Colorist'], connectsTo: [] },
          { id: 'uix-typo', name: 'الخطوط', nameEn: 'Typography', icon: '✒', status: 'available', xp: 40, description: 'اختيار وترتيب الخطوط', tasks: [{ id: 'dt3', name: 'زوج خطوط', xp: 20, type: 'project' }, { id: 'dt4', name: 'قواعد القراءة', xp: 20, type: 'theory' }], rewards: ['✒ Typographer'], connectsTo: [] },
        ]
      },
      {
        id: 'uix-tools',
        name: 'أدوات التصميم',
        nameEn: 'Design Tools',
        icon: '🛠',
        color: '#f472b6',
        connectsTo: [],
        skills: [
          { id: 'uix-figma', name: 'Figma', nameEn: 'Figma', icon: '◆', status: 'available', xp: 60, description: 'أشهر أداة تصميم واجهات', tasks: [{ id: 'dt5', name: 'تصميم شاشة', xp: 30, type: 'project' }, { id: 'dt6', name: 'Components', xp: 30, type: 'challenge' }], rewards: ['🛠 Figma User'], connectsTo: ['uix-ui'] },
          { id: 'uix-ui', name: 'تصميم واجهة', nameEn: 'UI Design', icon: '⬡', status: 'locked', xp: 70, description: 'بناء واجهات جذابة', tasks: [{ id: 'dt7', name: 'تصميم Dashboard', xp: 35, type: 'project' }, { id: 'dt8', name: 'Design Tokens', xp: 35, type: 'challenge' }], rewards: ['⬡ UI Designer'], connectsTo: ['uix-proto'] },
        ]
      },
      {
        id: 'uix-research',
        name: 'أبحاث وتجربة المستخدم',
        nameEn: 'UX Research',
        icon: '🔍',
        color: '#f472b6',
        connectsTo: [],
        skills: [
          { id: 'uix-uxr', name: 'أبحاث المستخدم', nameEn: 'UX Research', icon: '🔍', status: 'locked', xp: 60, description: 'فهم احتياجات المستخدم', tasks: [{ id: 'dt9', name: 'مقابلة مستخدم', xp: 30, type: 'project' }, { id: 'dt10', name: 'Persona', xp: 30, type: 'theory' }], rewards: ['🔍 UX Researcher'], connectsTo: ['uix-proto'] },
          { id: 'uix-proto', name: 'النماذج الأولية', nameEn: 'Prototyping', icon: '⚡', status: 'locked', xp: 80, description: 'تحويل التصميم إلى نموذج تفاعلي', tasks: [{ id: 'dt11', name: 'نموذج تفاعلي', xp: 40, type: 'project' }, { id: 'dt12', name: 'اختبار استخدام', xp: 40, type: 'challenge' }], rewards: ['⚡ Prototyper'], connectsTo: [] },
        ]
      },
    ]
  },
  // ── مهندس Cloud ──
  {
    id: 'cloud',
    name: 'مهندس Cloud',
    nameEn: 'Cloud Architect',
    icon: '☁',
    color: '#8b5cf6',
    glow: '#8b5cf640',
    description: 'تصميم البنية التحتية لشركات كبرى على AWS و Azure و GCP',
    salary: '$100K - $230K',
    demand: 'عالي',
    connectsTo: ['programming', 'devops'],
    branches: [
      {
        id: 'cloud-linux',
        name: 'الأساسيات',
        nameEn: 'Foundations',
        icon: '🐧',
        color: '#8b5cf6',
        connectsTo: [],
        skills: [
          { id: 'cl-linux', name: 'Linux', nameEn: 'Linux', icon: '🐧', status: 'available', xp: 40, description: 'أساسيات الخوادم', tasks: [{ id: 'clt1', name: 'سطر الأوامر', xp: 20, type: 'theory' }, { id: 'clt2', name: 'إدارة العمليات', xp: 20, type: 'challenge' }], rewards: ['🐧 Linux User'], connectsTo: ['cl-net'] },
          { id: 'cl-net', name: 'الشبكات', nameEn: 'Networking', icon: '🌐', status: 'available', xp: 50, description: 'فهم عمل الشبكات', tasks: [{ id: 'clt3', name: 'TCP/IP', xp: 25, type: 'theory' }, { id: 'clt4', name: 'إعداد VPC', xp: 25, type: 'project' }], rewards: ['🌐 Net Worker'], connectsTo: ['cl-aws'] },
        ]
      },
      {
        id: 'cloud-aws',
        name: 'السحابة',
        nameEn: 'Cloud Provider',
        icon: '☁',
        color: '#8b5cf6',
        connectsTo: [],
        skills: [
          { id: 'cl-aws', name: 'AWS', nameEn: 'AWS', icon: '☁', status: 'locked', xp: 80, description: 'أشهر منصة سحابية', tasks: [{ id: 'clt5', name: 'EC2 & S3', xp: 30, type: 'project' }, { id: 'clt6', name: 'IAM', xp: 50, type: 'challenge' }], rewards: ['☁ AWS Builder'], connectsTo: ['cl-terra'] },
          { id: 'cl-azure', name: 'Azure / GCP', nameEn: 'Azure/GCP', icon: '⬡', status: 'locked', xp: 70, description: 'منصات سحابية بديلة', tasks: [{ id: 'clt7', name: 'نشر خدمة', xp: 35, type: 'project' }, { id: 'clt8', name: 'المصادقة', xp: 35, type: 'theory' }], rewards: ['⬡ Multi-Cloud'], connectsTo: ['cl-terra'] },
        ]
      },
      {
        id: 'cloud-iac',
        name: 'أتمتة البنية',
        nameEn: 'Infra as Code',
        icon: '🛠',
        color: '#8b5cf6',
        connectsTo: [],
        skills: [
          { id: 'cl-terra', name: 'Terraform', nameEn: 'Terraform', icon: '🛠', status: 'locked', xp: 80, description: 'تعريف البنية بكود', tasks: [{ id: 'clt9', name: 'كتابة Module', xp: 40, type: 'project' }, { id: 'clt10', name: 'State Management', xp: 40, type: 'challenge' }], rewards: ['🛠 IaC Dev'], connectsTo: ['cl-k8s'] },
          { id: 'cl-k8s', name: 'Kubernetes', nameEn: 'Kubernetes', icon: '⚙', status: 'locked', xp: 90, description: 'تنسيق الحاويات', tasks: [{ id: 'clt11', name: 'نشر Cluster', xp: 45, type: 'project' }, { id: 'clt12', name: 'Scaling', xp: 45, type: 'challenge' }], rewards: ['⚙ Cloud Arch'], connectsTo: [] },
        ]
      },
    ]
  },
  {
    id: 'arvr',
    name: 'مطور AR/VR',
    nameEn: 'AR/VR Developer',
    icon: '◎',
    color: '#a78bfa',
    glow: '#a78bfa40',
    description: 'تبني تجارب غامرة وألعاب VR وتطبيقات AR للتجارة والتدريب — المستقبل القادم للتقنية',
    salary: '$80,000 - $180,000',
    demand: 'متوسط',
    branches: [
      {
        id: 'arvr-foundations',
        name: 'الأساسيات',
        nameEn: 'Foundations',
        icon: '◎',
        color: '#a78bfa',
        connectsTo: [],
        skills: [
          { id: 'arvr-unity', name: 'Unity', nameEn: 'Unity', icon: '⚙', status: 'available', xp: 60, description: 'محرك الألعاب والمحاكاة', tasks: [{ id: 'avt1', name: 'مشهد تفاعلي أول', xp: 30, type: 'project' }, { id: 'avt2', name: 'فيزياء الأساس', xp: 30, type: 'theory' }], rewards: ['🎮 Unity Dev'], connectsTo: ['arvr-3d'] },
          { id: 'arvr-3d', name: 'نمذجة 3D', nameEn: '3D Modeling', icon: '🧊', status: 'locked', xp: 70, description: 'نمذجة ونماذج ثلاثية الأبعاد', tasks: [{ id: 'avt3', name: 'نموذج بسيط', xp: 35, type: 'project' }, { id: 'avt4', name: 'تطبيق مواد', xp: 35, type: 'challenge' }], rewards: ['🧊 Modeler'], connectsTo: ['arvr-xr', 'des-blender'] },
        ]
      },
      {
        id: 'arvr-xr',
        name: 'تطوير XR',
        nameEn: 'XR Development',
        icon: '⬡',
        color: '#a78bfa',
        connectsTo: [],
        skills: [
          { id: 'arvr-xr-sdk', name: 'XR SDK', nameEn: 'XR SDK', icon: '⬡', status: 'locked', xp: 90, description: 'أدوات الواقع المختلط (VR/AR)', tasks: [{ id: 'avt5', name: 'مشهد VR', xp: 45, type: 'project' }, { id: 'avt6', name: 'تفاعل باليد', xp: 45, type: 'challenge' }], rewards: ['🥽 XR Dev'], connectsTo: ['arvr-spatial'] },
          { id: 'arvr-spatial', name: 'تصميم الفضاء', nameEn: 'Spatial Design', icon: '📐', status: 'locked', xp: 80, description: 'تصميم تجارب غامرة مكانية', tasks: [{ id: 'avt7', name: 'UX للـ VR', xp: 40, type: 'theory' }, { id: 'avt8', name: 'تجربة غامرة', xp: 40, type: 'project' }], rewards: ['📐 Spatial Designer'], connectsTo: ['arvr-pro'] },
        ]
      },
      {
        id: 'arvr-advanced',
        name: 'متقدم',
        nameEn: 'Advanced',
        icon: '🚀',
        color: '#a78bfa',
        connectsTo: [],
        skills: [
          { id: 'arvr-pro', name: 'محترف AR/VR', nameEn: 'AR/VR Pro', icon: '◎', status: 'locked', xp: 120, description: 'مشاريع احترافية كاملة', tasks: [{ id: 'avt9', name: 'تطبيق AR تسوق', xp: 60, type: 'project' }, { id: 'avt10', name: 'تدريب طبي VR', xp: 60, type: 'challenge' }], rewards: ['🚀 AR/VR Master'], connectsTo: [] },
        ]
      },
    ],
    connectsTo: ['design'],
  },
  {
    id: 'prompt',
    name: 'مهندس الـ Prompt',
    nameEn: 'Prompt Engineer',
    icon: '✧',
    color: '#c084fc',
    glow: '#c084fc40',
    description: 'تصمم أوامر AI تعطيك أفضل النتائج، تبني AI Agents، وتشتغل في شركات تطبق الذكاء الاصطناعي — تخصص جديد وطلبه عالي جداً',
    salary: '$80,000 - $180,000',
    demand: 'عالي',
    branches: [
      {
        id: 'prompt-foundations',
        name: 'الأساسيات',
        nameEn: 'Foundations',
        icon: '✧',
        color: '#c084fc',
        connectsTo: [],
        skills: [
          { id: 'prompt-llm', name: 'أساسيات LLM', nameEn: 'LLM Basics', icon: '🤖', status: 'available', xp: 60, description: 'كيف تشتغل نماذج اللغة الكبيرة', tasks: [{ id: 'pt1', name: 'فهم الـ Tokens', xp: 30, type: 'theory' }, { id: 'pt2', name: 'تجربة أول Prompt', xp: 30, type: 'project' }], rewards: ['🤖 LLM Explorer'], connectsTo: ['prompt-design'] },
          { id: 'prompt-design', name: 'تصميم الـ Prompt', nameEn: 'Prompt Design', icon: '✍', status: 'locked', xp: 70, description: 'صياغة أوامر واضحة وفعالة', tasks: [{ id: 'pt3', name: 'Prompt لهيكل', xp: 35, type: 'project' }, { id: 'pt4', name: 'ضبط الصياغة', xp: 35, type: 'challenge' }], rewards: ['✍ Prompt Crafter'], connectsTo: ['prompt-cot'] },
        ]
      },
      {
        id: 'prompt-techniques',
        name: 'التقنيات',
        nameEn: 'Techniques',
        icon: '🧩',
        color: '#c084fc',
        connectsTo: [],
        skills: [
          { id: 'prompt-cot', name: 'التفكير المتسلسل', nameEn: 'Chain-of-Thought', icon: '🔗', status: 'locked', xp: 90, description: 'تقسيم المشكلة لخطوات منطقية', tasks: [{ id: 'pt5', name: 'CoT لحساب', xp: 45, type: 'project' }, { id: 'pt6', name: 'تقييم النتائج', xp: 45, type: 'theory' }], rewards: ['🔗 CoT Master'], connectsTo: ['prompt-rag'] },
          { id: 'prompt-fewshot', name: 'Few-Shot', nameEn: 'Few-Shot', icon: '📚', status: 'locked', xp: 80, description: 'تعليم النموذج بالأمثلة', tasks: [{ id: 'pt7', name: 'تصنيف بأمثلة', xp: 40, type: 'project' }, { id: 'pt8', name: 'تنسيق المخرجات', xp: 40, type: 'challenge' }], rewards: ['📚 Example Engineer'], connectsTo: ['prompt-rag'] },
        ]
      },
      {
        id: 'prompt-building',
        name: 'البناء',
        nameEn: 'Building',
        icon: '🛠',
        color: '#c084fc',
        connectsTo: [],
        skills: [
          { id: 'prompt-rag', name: 'RAG', nameEn: 'RAG', icon: '📄', status: 'locked', xp: 100, description: 'ربط النموذج بمصادر المعرفة', tasks: [{ id: 'pt9', name: 'بحث في مستند', xp: 50, type: 'project' }, { id: 'pt10', name: 'توليد إجابة موثقة', xp: 50, type: 'challenge' }], rewards: ['📄 RAG Builder'], connectsTo: ['prompt-agents'] },
          { id: 'prompt-agents', name: 'AI Agents', nameEn: 'AI Agents', icon: '🤖', status: 'locked', xp: 120, description: 'بناء وكلاء ذكيين متعددي الخطوات', tasks: [{ id: 'pt11', name: 'وكيل بخطوات', xp: 60, type: 'project' }, { id: 'pt12', name: 'مشروع وكيل كامل', xp: 60, type: 'challenge' }], rewards: ['🚀 Agent Architect'], connectsTo: [] },
        ]
      },
    ],
    connectsTo: ['ai'],
  },
]

// ─── Component ─────────────────────────────────────────────
function NodeCard({ cx, cy, w, h, color, children, onClick, glow, dim }: {
  cx: number; cy: number; w: number; h: number; color: string
  children: ReactNode; onClick?: () => void; glow?: boolean; dim?: boolean
}) {
  return (
    <motion.div
      whileHover={onClick ? { scale: 1.05 } : undefined}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: dim ? 0.25 : 1, scale: 1 }}
      style={{
        position: 'absolute',
        left: cx - w / 2, top: cy - h / 2, width: w, height: h,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '0 10px', borderRadius: 14,
        background: glow ? `linear-gradient(135deg, ${color}22, rgba(17,17,40,0.92))` : 'rgba(17,17,40,0.85)',
        border: `1px solid ${color}55`,
        boxShadow: glow ? `0 0 24px ${color}40` : '0 4px 14px rgba(0,0,0,0.4)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s',
        userSelect: 'none',
      }}
    >
      {children}
    </motion.div>
  )
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

// ── Bottom-up vertical tree constants ──
const SZ = {
  ROOT: { w: 184, h: 74 },
  PATH: { w: 172, h: 62 },
  BRANCH: { w: 168, h: 52 },
  SKILL: { w: 142, h: 48 },
  TASK: { w: 118, h: 28 },
}
const V_PAD = 50
const TASK_GAP = 8
const LEVEL_GAP = 110
const SLOT = SZ.SKILL.w + 22   // horizontal space per skill

interface TaskPos { task: SkillTask; y: number }
interface SkillPos { skill: Skill; x: number; y: number; tasks: TaskPos[] }
interface BranchPos { branch: Branch; x: number; y: number; skills: SkillPos[] }
interface PathPos { path: Path; x: number; y: number; branches: BranchPos[] }

function computeLayout(paths: Path[]) {
  const maxTasks = Math.max(1, ...paths.flatMap(p => p.branches.flatMap(b => b.skills.map(s => s.tasks.length))))
  // vertical (canvas y, downward): tasks at top, root at bottom
  const skillY = V_PAD + SZ.SKILL.h / 2 + TASK_GAP + maxTasks * SZ.TASK.h + (maxTasks - 1) * TASK_GAP
  const branchY = skillY + SZ.SKILL.h / 2 + LEVEL_GAP + SZ.BRANCH.h / 2
  const pathY = branchY + SZ.BRANCH.h / 2 + LEVEL_GAP + SZ.PATH.h / 2
  const rootY = pathY + SZ.PATH.h / 2 + LEVEL_GAP + SZ.ROOT.h / 2

  let x = V_PAD
  const placedPaths: PathPos[] = paths.map(p => {
    const branches = p.branches.map(b => {
      const skills = b.skills.map(s => {
        const sx = x + SZ.SKILL.w / 2
        x += SLOT
        const tasks: TaskPos[] = s.tasks.map((t, i) => ({
          task: t,
          y: skillY - SZ.SKILL.h / 2 - TASK_GAP - SZ.TASK.h / 2 - i * (SZ.TASK.h + TASK_GAP),
        }))
        return { skill: s, x: sx, y: skillY, tasks }
      })
      const bx = skills.reduce((a, c) => a + c.x, 0) / skills.length
      return { branch: b, x: bx, y: branchY, skills }
    })
    const px = branches.reduce((a, c) => a + c.x, 0) / branches.length
    return { path: p, x: px, y: pathY, branches }
  })
  const rootX = placedPaths.reduce((a, c) => a + c.x, 0) / placedPaths.length
  const width = x - 22 + V_PAD
  const height = rootY + SZ.ROOT.h / 2 + V_PAD
  return { placedPaths, rootX, rootY, skillY, branchY, pathY, width, height }
}

export default function SkillTree() {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'tree' | 'grid'>('tree')
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 })

  const viewportRef = useRef<HTMLDivElement>(null)
  const transformRef = useRef<HTMLDivElement>(null)
  const pctRef = useRef<HTMLSpanElement>(null)
  const live = useRef({ scale: 1, x: 0, y: 0 })
  const drag = useRef({ active: false, sx: 0, sy: 0, ox: 0, oy: 0, moved: false })
  const wheelTimer = useRef<number | null>(null)
  // multi-touch state for pinch-to-zoom
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map())
  const pinch = useRef<{ dist0: number; scale0: number; mid0: { x: number; y: number }; ox: number; oy: number } | null>(null)
  const lastTap = useRef({ t: 0, x: 0, y: 0 })

  const filteredPaths = useMemo(() => {
    if (!searchQuery.trim()) return careerPaths
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

  const { placedPaths, rootX, rootY, skillY, branchY, pathY, width, height } = useMemo(
    () => computeLayout(filteredPaths),
    [filteredPaths]
  )

  const setTransform = (v: { scale: number; x: number; y: number }, animate: boolean) => {
    const el = transformRef.current
    if (el) {
      el.style.transition = animate ? 'transform 0.18s cubic-bezier(0.22, 1, 0.36, 1)' : 'none'
      el.style.transform = `translate(${v.x}px, ${v.y}px) scale(${v.scale})`
    }
    live.current = v
    if (pctRef.current) pctRef.current.textContent = `${Math.round(v.scale * 100)}%`
  }

  const fit = useCallback(() => {
    const vp = viewportRef.current
    if (!vp || width <= 0 || height <= 0) return
    const vw = vp.clientWidth, vh = vp.clientHeight
    const s = clamp(Math.min(vw / width, vh / height) * 0.96, 0.08, 1.6)
    const nv = { scale: s, x: (vw - width * s) / 2, y: (vh - height * s) / 2 }
    setTransform(nv, true)
    setView(nv)
  }, [width, height])

  useEffect(() => { fit() }, [fit])

  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const rect = vp.getBoundingClientRect()
      const px = e.clientX - rect.left, py = e.clientY - rect.top
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12
      const old = live.current
      const ns = clamp(old.scale * factor, 0.08, 4)
      const wx = (px - old.x) / old.scale, wy = (py - old.y) / old.scale
      const nv = { scale: ns, x: px - wx * ns, y: py - wy * ns }
      setTransform(nv, true)   // eased, no re-render -> smooth
      if (wheelTimer.current) clearTimeout(wheelTimer.current)
      wheelTimer.current = window.setTimeout(() => setView({ ...live.current }), 180)
    }
    vp.addEventListener('wheel', onWheel, { passive: false })
    return () => vp.removeEventListener('wheel', onWheel)
  }, [])

  const onPointerDown = (e: ReactPointerEvent) => {
    const vp = viewportRef.current
    if (!vp) return
    vp.setPointerCapture(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (pointers.current.size === 1) {
      drag.current = { active: true, sx: e.clientX, sy: e.clientY, ox: live.current.x, oy: live.current.y, moved: false }
      vp.style.cursor = 'grabbing'
    } else if (pointers.current.size === 2) {
      // begin pinch: lock the world point under the initial two-finger midpoint
      const pts = Array.from(pointers.current.values())
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      const rect = vp.getBoundingClientRect()
      const midX = (pts[0].x + pts[1].x) / 2 - rect.left
      const midY = (pts[0].y + pts[1].y) / 2 - rect.top
      drag.current.moved = true // a pinch is never a click
      pinch.current = { dist0: dist, scale0: live.current.scale, mid0: { x: midX, y: midY }, ox: live.current.x, oy: live.current.y }
    }
  }

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const vp = viewportRef.current
    if (!vp) return

    // pinch zoom (two pointers) — keeps the world point under the fingers fixed
    if (pinch.current && pointers.current.size >= 2) {
      const pts = Array.from(pointers.current.values())
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      const rect = vp.getBoundingClientRect()
      const midX = (pts[0].x + pts[1].x) / 2 - rect.left
      const midY = (pts[0].y + pts[1].y) / 2 - rect.top
      const ns = clamp(pinch.current.scale0 * (dist / pinch.current.dist0), 0.08, 4)
      const wx = (pinch.current.mid0.x - pinch.current.ox) / pinch.current.scale0
      const wy = (pinch.current.mid0.y - pinch.current.oy) / pinch.current.scale0
      setTransform({ scale: ns, x: midX - wx * ns, y: midY - wy * ns }, false) // 1:1 while pinching
      return
    }

    // single-pointer pan
    const d = drag.current
    if (!d.active) return
    const dx = e.clientX - d.sx, dy = e.clientY - d.sy
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) d.moved = true
    setTransform({ scale: live.current.scale, x: d.ox + dx, y: d.oy + dy }, false) // 1:1, no easing
  }

  const endDrag = () => {
    const d = drag.current
    if (!d.active) return
    if (d.moved) setView({ ...live.current })
    d.active = false
    if (viewportRef.current) viewportRef.current.style.cursor = 'grab'
  }

  const onPointerUp = (e: ReactPointerEvent) => {
    const vp = viewportRef.current
    if (vp) { try { vp.releasePointerCapture(e.pointerId) } catch { /* noop */ } }
    pointers.current.delete(e.pointerId)

    // pinch ended
    if (pinch.current && pointers.current.size < 2) {
      pinch.current = null
      setView({ ...live.current })
    }

    if (pointers.current.size === 1) {
      // one finger remains — restart pan from its position so there is no jump
      const [pt] = Array.from(pointers.current.values())
      drag.current = { active: true, sx: pt.x, sy: pt.y, ox: live.current.x, oy: live.current.y, moved: drag.current.moved }
    } else if (pointers.current.size === 0) {
      endDrag()
      // double-tap on empty canvas → zoom in toward the tap point (mobile friendly)
      if (!drag.current.moved && vp) {
        const rect = vp.getBoundingClientRect()
        const lx = e.clientX - rect.left, ly = e.clientY - rect.top
        const now = Date.now()
        if (now - lastTap.current.t < 300 && Math.hypot(lx - lastTap.current.x, ly - lastTap.current.y) < 30) {
          const old = live.current
          const ns = clamp(old.scale * 1.8, 0.08, 4)
          const wx = (lx - old.x) / old.scale, wy = (ly - old.y) / old.scale
          const nv = { scale: ns, x: lx - wx * ns, y: ly - wy * ns }
          setTransform(nv, true); setView(nv)
          lastTap.current = { t: 0, x: 0, y: 0 }
        } else {
          lastTap.current = { t: now, x: lx, y: ly }
        }
      }
    }
  }

  const zoomBy = (factor: number) => {
    const vp = viewportRef.current; if (!vp) return
    const cx = vp.clientWidth / 2, cy = vp.clientHeight / 2
    const old = live.current
    const ns = clamp(old.scale * factor, 0.08, 4)
    const wx = (cx - old.x) / old.scale, wy = (cy - old.y) / old.scale
    const nv = { scale: ns, x: cx - wx * ns, y: cy - wy * ns }
    setTransform(nv, true)
    setView(nv)
  }

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

  // vertical S-curve connector (control points meet at vertical midpoint)
  const link = (key: string, x1: number, y1: number, x2: number, y2: number, color: string, op = 0.5) => {
    const my = (y1 + y2) / 2
    return (
      <path key={key} d={`M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`}
        fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" opacity={op} />
    )
  }

  // ── Full expanded tree (bottom-up, no drill-down) ──
  const renderFullTree = () => {
    const connectors: ReactNode[] = []
    placedPaths.forEach(p => {
      connectors.push(link(`r-${p.path.id}`, rootX, rootY - SZ.ROOT.h / 2, p.x, pathY + SZ.PATH.h / 2, p.path.color, 0.6))
    })
    placedPaths.forEach(p => {
      p.branches.forEach(b => {
        connectors.push(link(`b-${b.branch.id}`, p.x, pathY - SZ.PATH.h / 2, b.x, branchY + SZ.BRANCH.h / 2, b.branch.color, 0.5))
        b.skills.forEach(s => {
          const st = getStatusStyle(s.skill.status)
          connectors.push(link(`s-${s.skill.id}`, b.x, branchY - SZ.BRANCH.h / 2, s.x, skillY + SZ.SKILL.h / 2, st.color, 0.45))
          s.tasks.forEach(t => {
            connectors.push(link(`t-${s.skill.id}-${t.task.id}`, s.x, skillY - SZ.SKILL.h / 2, s.x, t.y + SZ.TASK.h / 2, st.color, 0.28))
          })
        })
      })
    })

    return (
      <div style={{ direction: 'ltr' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>اسحب للتحريك · قصّر بإصبعين للتكبير/التصغير · اضغط مهارة للتفاصيل</span>
          <div style={{ flex: 1 }} />
          <button className="btn-secondary" style={{ fontSize: 18, padding: '8px 14px', minWidth: 46, minHeight: 42, touchAction: 'manipulation' }} onClick={() => zoomBy(1.2)}>➕</button>
          <button className="btn-secondary" style={{ fontSize: 18, padding: '8px 14px', minWidth: 46, minHeight: 42, touchAction: 'manipulation' }} onClick={() => zoomBy(1 / 1.2)}>➖</button>
          <button className="btn-secondary" style={{ fontSize: 13, padding: '8px 14px', minHeight: 42, touchAction: 'manipulation' }} onClick={fit}>⤢ ملاءمة</button>
          <span ref={pctRef} style={{ fontSize: 12, color: 'var(--text-muted)', minWidth: 46, textAlign: 'center' }}>{Math.round(view.scale * 100)}%</span>
        </div>

        <div
          ref={viewportRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={endDrag}
          onPointerCancel={onPointerUp}
          style={{
            position: 'relative', overflow: 'hidden', width: '100%', height: '78vh',
            borderRadius: 16, border: '1px solid var(--border)',
            background: 'radial-gradient(circle at 50% 90%, rgba(34,211,238,0.07), transparent 55%), rgba(10,10,25,0.6)',
            cursor: 'grab', touchAction: 'none',
          }}
        >
          <div ref={transformRef} style={{ position: 'absolute', left: 0, top: 0, width, height, transformOrigin: '0 0', willChange: 'transform' }}>
            <svg width={width} height={height} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}>
              {connectors}
            </svg>

            <NodeCard cx={rootX} cy={rootY} w={SZ.ROOT.w} h={SZ.ROOT.h} color="#22d3ee" glow>
              <span style={{ fontSize: 24 }}>🌳</span>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 15, fontWeight: 900, color: '#22d3ee' }}>شجرة المسارات</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{placedPaths.length} مسار</div>
              </div>
            </NodeCard>

            {placedPaths.map(p => (
              <NodeCard key={p.path.id} cx={p.x} cy={pathY} w={SZ.PATH.w} h={SZ.PATH.h} color={p.path.color} glow>
                <span style={{ fontSize: 20 }}>{p.path.icon}</span>
                <div style={{ textAlign: 'center', minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: p.path.color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.path.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{p.path.branches.length} فرع</div>
                </div>
              </NodeCard>
            ))}

            {placedPaths.flatMap(p => p.branches.map(b => (
              <NodeCard key={b.branch.id} cx={b.x} cy={branchY} w={SZ.BRANCH.w} h={SZ.BRANCH.h} color={b.branch.color}>
                <span style={{ fontSize: 16 }}>{b.branch.icon}</span>
                <div style={{ textAlign: 'center', minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: b.branch.color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.branch.name}</div>
                </div>
              </NodeCard>
            )))}

            {placedPaths.flatMap(p => p.branches.flatMap(b => b.skills.map(s => {
              const st = getStatusStyle(s.skill.status)
              return (
                <NodeCard key={s.skill.id} cx={s.x} cy={skillY} w={SZ.SKILL.w} h={SZ.SKILL.h} color={st.color}
                  onClick={() => { if (drag.current.moved) return; setSelectedSkill(s.skill) }}>
                  <span style={{ fontSize: 14 }}>{s.skill.icon}</span>
                  <div style={{ textAlign: 'center', minWidth: 0, overflow: 'hidden' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: st.color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.skill.name}</div>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{s.skill.xp} XP</div>
                  </div>
                </NodeCard>
              )
            })))}

            {placedPaths.flatMap(p => p.branches.flatMap(b => b.skills.flatMap(s => s.tasks.map(t => (
              <div key={t.task.id} style={{
                position: 'absolute', left: s.x - SZ.TASK.w / 2, top: t.y - SZ.TASK.h / 2,
                width: SZ.TASK.w, height: SZ.TASK.h, display: 'flex', alignItems: 'center', gap: 6,
                padding: '0 8px', borderRadius: 9, fontSize: 10,
                background: 'rgba(255,255,255,0.03)', border: `1px solid ${getStatusStyle(s.skill.status).color}22`,
                color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', userSelect: 'none',
              }}>
                <span>{t.task.type === 'theory' ? '📖' : t.task.type === 'project' ? '🏗' : t.task.type === 'challenge' ? '⚔' : '🏆'}</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.task.name}</span>
              </div>
            )))))}
          </div>
        </div>

        {placedPaths.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>لا توجد نتائج مطابقة للبحث</p>
        )}
      </div>
    )
  }

  // ── Grid View (compact) ──
  const renderGridView = () => (
    <div className="card-grid">
      {filteredPaths.map((path, i) => (
        <motion.div
          key={path.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          whileHover={{ y: -4 }}
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
      <div>
        <motion.h2 className="section-title" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <span style={{ color: '#22d3ee' }}>⬡</span> شجرة المهارات والمسارات
        </motion.h2>
        <p className="section-subtitle">
          {careerPaths.length} مسار · {careerPaths.reduce((a, p) => a + p.branches.length, 0)} فرع · {careerPaths.reduce((a, p) => a + p.branches.reduce((b, br) => b + br.skills.length, 0), 0)} مهارة
        </p>
      </div>

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

      {viewMode === 'tree' ? renderFullTree() : renderGridView()}

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
