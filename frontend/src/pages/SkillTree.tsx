import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Skill {
  id: number
  name: string
  nameEn: string
  icon: string
  status: 'locked' | 'available' | 'active' | 'completed'
  tier: number
  xp: number
  description: string
}

interface CareerPath {
  id: string
  name: string
  nameEn: string
  icon: string
  color: string
  description: string
  afterComplete: string
  salary: string
  demand: 'عالي' | 'متوسط' | 'منخفض'
  skills: Skill[]
}

const careerPaths: CareerPath[] = [
  {
    id: 'fullstack',
    name: 'مطور Full Stack',
    nameEn: 'Full Stack Developer',
    icon: '◈',
    color: '#22d3ee',
    description: 'بناء تطبيقات ويب كاملة من الواجهة الأمامية إلى الخلفية',
    afterComplete: 'تكدر تبني أي موقع أو تطبيق ويب من الصفر، تشتغل كـ Freelancer أو في شركة تقنية، وتقدر تبني الـ Startup حقك. المطور Full Stack هو الأكثر طلباً في سوق العمل.',
    salary: '$70,000 - $180,000',
    demand: 'عالي',
    skills: [
      { id: 1, name: 'HTML/CSS', nameEn: 'HTML/CSS', icon: '◆', status: 'completed', tier: 0, xp: 30, description: 'أساسيات بناء صفحات الويب والتنسيق' },
      { id: 2, name: 'JavaScript', nameEn: 'JavaScript', icon: '◈', status: 'active', tier: 1, xp: 50, description: 'لغة البرمجة الأساسية للويب التفاعلي' },
      { id: 3, name: 'Git & GitHub', nameEn: 'Git', icon: '⬡', status: 'completed', tier: 1, xp: 30, description: 'إدارة الإصدارات والتعاون مع الفريق' },
      { id: 4, name: 'React', nameEn: 'React', icon: '◈', status: 'available', tier: 2, xp: 80, description: 'مكتبة بناء واجهات المستخدم التفاعلية' },
      { id: 5, name: 'Node.js', nameEn: 'Node.js', icon: '◉', status: 'available', tier: 2, xp: 70, description: 'تشغيل JavaScript على السيرفر' },
      { id: 6, name: 'TypeScript', nameEn: 'TypeScript', icon: '◆', status: 'locked', tier: 2, xp: 60, description: 'JavaScript مع أنواع البيانات الآمنة' },
      { id: 7, name: 'Next.js', nameEn: 'Next.js', icon: '◈', status: 'locked', tier: 3, xp: 100, description: 'Framework React للإنتاج مع SSR' },
      { id: 8, name: 'API Design', nameEn: 'API Design', icon: '◇', status: 'locked', tier: 3, xp: 80, description: 'تصميم واجهات برمجة التطبيقات REST و GraphQL' },
      { id: 9, name: 'Database', nameEn: 'Database', icon: '⬢', status: 'locked', tier: 3, xp: 70, description: 'قواعد البيانات SQL و NoSQL' },
      { id: 10, name: 'Full Stack Pro', nameEn: 'Full Stack Pro', icon: '★', status: 'locked', tier: 4, xp: 200, description: 'بناء تطبيقات كاملة مع Authentication و Deployment' },
    ]
  },
  {
    id: 'ai',
    name: 'مهندس AI / ML',
    nameEn: 'AI / ML Engineer',
    icon: '⬡',
    color: '#a855f7',
    description: 'بناء أنظمة ذكاء اصطناعي وتعلم آلة',
    afterComplete: 'تكدر تبني نماذج AI تتعرف على الصور، تفهم النصوص، وتتوقع البيانات. تشتغل في شركات عالمية مثل Google, OpenAI, أو تبني منتجات AI خاصة بك. هذا هو المستقبل الحقيقي.',
    salary: '$100,000 - $250,000',
    demand: 'عالي',
    skills: [
      { id: 20, name: 'Python', nameEn: 'Python', icon: '◈', status: 'available', tier: 0, xp: 40, description: 'لغة البرمجة الأساسية للـ AI و Data Science' },
      { id: 21, name: 'Statistics', nameEn: 'Statistics', icon: '⬢', status: 'available', tier: 1, xp: 50, description: 'أساسيات الإحصاء والاحتمالات' },
      { id: 22, name: 'Linear Algebra', nameEn: 'Linear Algebra', icon: '◆', status: 'locked', tier: 1, xp: 45, description: 'الجبر الخطي أساس تعلم الآلة' },
      { id: 23, name: 'Pandas', nameEn: 'Pandas', icon: '⬡', status: 'locked', tier: 2, xp: 60, description: 'تحليل ومعالجة البيانات' },
      { id: 24, name: 'ML Basics', nameEn: 'ML Basics', icon: '◈', status: 'locked', tier: 2, xp: 80, description: 'أساسيات تعلم الآلة والخوارزميات' },
      { id: 25, name: 'Deep Learning', nameEn: 'Deep Learning', icon: '◉', status: 'locked', tier: 3, xp: 120, description: 'الشبكات العصبية العميقة' },
      { id: 26, name: 'NLP', nameEn: 'NLP', icon: '◆', status: 'locked', tier: 3, xp: 100, description: 'معالجة اللغة الطبيعية' },
      { id: 27, name: 'Computer Vision', nameEn: 'Computer Vision', icon: '⬡', status: 'locked', tier: 3, xp: 100, description: 'الرؤية الحاسوبية وتحليل الصور' },
      { id: 28, name: 'AI Engineer', nameEn: 'AI Engineer', icon: '★', status: 'locked', tier: 4, xp: 250, description: 'بناء ونشر أنظمة AI في الإنتاج' },
    ]
  },
  {
    id: 'cybersecurity',
    name: 'متخصص أمن سيبراني',
    nameEn: 'Cybersecurity Specialist',
    icon: '⬡',
    color: '#34d399',
    description: 'حماية الأنظمة والشبكات من الهجمات',
    afterComplete: 'تكدر تخترق أنظمة لاكتشاف الثغرات (Ethical Hacking)، تحمي الشركات من الهجمات، وتعمل كـ Security Consultant. الطلب على هذا التخصص ضخم جداً وما يوقف.',
    salary: '$80,000 - $200,000',
    demand: 'عالي',
    skills: [
      { id: 30, name: 'Linux', nameEn: 'Linux', icon: '⬡', status: 'available', tier: 0, xp: 40, description: 'نظام التشغيل الأساسي للأمان' },
      { id: 31, name: 'Networking', nameEn: 'Networking', icon: '◉', status: 'available', tier: 1, xp: 50, description: 'أساسيات الشبكات والبروتوكولات' },
      { id: 32, name: 'Terminal', nameEn: 'Terminal', icon: '◈', status: 'locked', tier: 1, xp: 35, description: 'سطر الأوامر المتقدم' },
      { id: 33, name: 'Security Basics', nameEn: 'Security', icon: '⬡', status: 'locked', tier: 2, xp: 70, description: 'أساسيات الأمان السيبراني' },
      { id: 34, name: 'Pen Testing', nameEn: 'Pen Testing', icon: '⚔', status: 'locked', tier: 3, xp: 100, description: 'اختبار الاختراق الأخلاقي' },
      { id: 35, name: 'Cryptography', nameEn: 'Cryptography', icon: '◆', status: 'locked', tier: 3, xp: 90, description: 'علم التشفير وحماية البيانات' },
      { id: 36, name: 'Exploit Dev', nameEn: 'Exploit Dev', icon: '⚡', status: 'locked', tier: 4, xp: 150, description: 'تطوير واستغلال الثغرات' },
      { id: 37, name: 'Security Pro', nameEn: 'Security Pro', icon: '★', status: 'locked', tier: 5, xp: 250, description: 'محترف أمن سيبراني شامل' },
    ]
  },
  {
    id: 'data',
    name: 'عالم بيانات',
    nameEn: 'Data Scientist',
    icon: '⬢',
    color: '#facc15',
    description: 'تحليل البيانات واستخراج الرؤى',
    afterComplete: 'تكدر تحلل ملايين البيانات وتتخقر المستقبل، تشتغل في شركات كبرى أو بنوك أو حتى فرق رياضية. Data Scientist من أعلى الوظائف أجراً في العالم.',
    salary: '$90,000 - $220,000',
    demand: 'عالي',
    skills: [
      { id: 40, name: 'Statistics', nameEn: 'Statistics', icon: '⬢', status: 'available', tier: 0, xp: 40, description: 'الإحصاء والاحتمالات التطبيقية' },
      { id: 41, name: 'Python', nameEn: 'Python', icon: '◈', status: 'available', tier: 1, xp: 50, description: 'لغة البرمجة للتحليل' },
      { id: 42, name: 'SQL', nameEn: 'SQL', icon: '⬢', status: 'locked', tier: 1, xp: 45, description: 'استعلام قواعد البيانات' },
      { id: 43, name: 'Pandas', nameEn: 'Pandas', icon: '⬡', status: 'locked', tier: 2, xp: 60, description: 'معالجة وتحليل البيانات' },
      { id: 44, name: 'Visualization', nameEn: 'Visualization', icon: '◆', status: 'locked', tier: 2, xp: 55, description: 'عرض البيانات بصرياً' },
      { id: 45, name: 'ML Basics', nameEn: 'ML Basics', icon: '◈', status: 'locked', tier: 3, xp: 80, description: 'أساسيات تعلم الآلة' },
      { id: 46, name: 'Deep Learning', nameEn: 'Deep Learning', icon: '◉', status: 'locked', tier: 4, xp: 120, description: 'الشبكات العصبية للبيانات' },
      { id: 47, name: 'Data Pro', nameEn: 'Data Pro', icon: '★', status: 'locked', tier: 5, xp: 250, description: 'محترف علوم بيانات شامل' },
    ]
  },
  {
    id: 'devops',
    name: 'مهندس DevOps',
    nameEn: 'DevOps Engineer',
    icon: '⚙',
    color: '#fb923c',
    description: 'أتمتة عمليات التطوير والنشر',
    afterComplete: 'تكدر تبني البنية التحتية لأي شركة تقنية، تنشر الكود تلقائياً، وتضمن اشتغال الأنظظام 24/7. DevOps مطلوب في كل شركة تقنية كبيرة.',
    salary: '$90,000 - $200,000',
    demand: 'عالي',
    skills: [
      { id: 50, name: 'Linux', nameEn: 'Linux', icon: '⬡', status: 'available', tier: 0, xp: 40, description: 'إدارة أنظمة Linux' },
      { id: 51, name: 'Bash', nameEn: 'Bash', icon: '◈', status: 'available', tier: 1, xp: 35, description: 'سطر أوامر Linux' },
      { id: 52, name: 'Git', nameEn: 'Git', icon: '⬡', status: 'locked', tier: 1, xp: 30, description: 'إدارة الإصدارات' },
      { id: 53, name: 'Docker', nameEn: 'Docker', icon: '◉', status: 'locked', tier: 2, xp: 70, description: 'الحاويات والتشغيل' },
      { id: 54, name: 'CI/CD', nameEn: 'CI/CD', icon: '◈', status: 'locked', tier: 3, xp: 90, description: 'أتمتة البناء والنشر' },
      { id: 55, name: 'Kubernetes', nameEn: 'Kubernetes', icon: '⬡', status: 'locked', tier: 4, xp: 120, description: 'إدارة الحاويات على نطاق واسع' },
      { id: 56, name: 'Cloud', nameEn: 'Cloud', icon: '☁', status: 'locked', tier: 5, xp: 150, description: 'الحوسبة السحابية AWS/GCP/Azure' },
    ]
  },
  {
    id: 'mobile',
    name: 'مطور تطبيقات جوال',
    nameEn: 'Mobile Developer',
    icon: '◉',
    color: '#06b6d4',
    description: 'بناء تطبيقات Android و iOS',
    afterComplete: 'تكدر تبني تطبيقات جوال تنافس التطبيقات العالمية، تنشرها على App Store و Google Play، وتكسب منها أو تشتغل في شركة تقنية.',
    salary: '$70,000 - $170,000',
    demand: 'عالي',
    skills: [
      { id: 60, name: 'Dart', nameEn: 'Dart', icon: '◈', status: 'available', tier: 0, xp: 40, description: 'لغة برمجة Flutter' },
      { id: 61, name: 'Flutter', nameEn: 'Flutter', icon: '⬡', status: 'available', tier: 1, xp: 70, description: 'بناء تطبيقات متعددة المنصات' },
      { id: 62, name: 'State Mgmt', nameEn: 'State Mgmt', icon: '◉', status: 'locked', tier: 2, xp: 60, description: 'إدارة حالة التطبيق' },
      { id: 63, name: 'APIs', nameEn: 'APIs', icon: '◆', status: 'locked', tier: 2, xp: 50, description: 'ربط التطبيق بالسيرفر' },
      { id: 64, name: 'Firebase', nameEn: 'Firebase', icon: '⬢', status: 'locked', tier: 3, xp: 80, description: 'خدمات Google السحابية' },
      { id: 65, name: 'Publishing', nameEn: 'Publishing', icon: '◈', status: 'locked', tier: 4, xp: 100, description: 'نشر التطبيقات على المتاجر' },
    ]
  },
  {
    id: 'designer',
    name: 'مصمم UI/UX',
    nameEn: 'UI/UX Designer',
    icon: '◆',
    color: '#f472b6',
    description: 'تصميم واجهات وتجربة المستخدم',
    afterComplete: 'تكدر تصمم تطبيقات ومواقع يستخدمها الملايين، تشتغل كـ Freelancer بأسعار ممتازة أو في شركة تصميم. التصميم هو أول شي يشوفه المستخدم.',
    salary: '$60,000 - $150,000',
    demand: 'عالي',
    skills: [
      { id: 70, name: 'Design Basics', nameEn: 'Design', icon: '◆', status: 'available', tier: 0, xp: 30, description: 'أساسيات التصميم والألوان' },
      { id: 71, name: 'Figma', nameEn: 'Figma', icon: '◈', status: 'available', tier: 1, xp: 50, description: 'أداة تصميم الواجهات' },
      { id: 72, name: 'Typography', nameEn: 'Typography', icon: '◆', status: 'locked', tier: 1, xp: 40, description: 'فن الخطوط والتنسيق' },
      { id: 73, name: 'UI Design', nameEn: 'UI Design', icon: '◉', status: 'locked', tier: 2, xp: 70, description: 'تصميم واجهات المستخدم' },
      { id: 74, name: 'UX Research', nameEn: 'UX Research', icon: '◇', status: 'locked', tier: 2, xp: 60, description: 'بحث تجربة المستخدم' },
      { id: 75, name: 'Prototyping', nameEn: 'Prototyping', icon: '◆', status: 'locked', tier: 3, xp: 80, description: 'بناء نماذج تفاعلية' },
      { id: 76, name: 'Design System', nameEn: 'Design System', icon: '⬡', status: 'locked', tier: 4, xp: 100, description: 'أنظمة التصميم المتكاملة' },
    ]
  },
  {
    id: 'cloud',
    name: 'مهندس Cloud',
    nameEn: 'Cloud Architect',
    icon: '☁',
    color: '#8b5cf6',
    description: 'تصميم وإدارة البنية التحتية السحابية',
    afterComplete: 'تكدر تبني البنية التحتية لشركات كبرى على AWS أو Azure أو GCP. مهندس Cloud من أعلى الوظائف أجراً والطلب عليه متزايد بشكل كبير.',
    salary: '$100,000 - $230,000',
    demand: 'عالي',
    skills: [
      { id: 80, name: 'Linux', nameEn: 'Linux', icon: '⬡', status: 'available', tier: 0, xp: 40, description: 'إدارة أنظمة الخوادم' },
      { id: 81, name: 'Networking', nameEn: 'Networking', icon: '◉', status: 'available', tier: 1, xp: 50, description: 'شبكات واتصالات' },
      { id: 82, name: 'AWS Basics', nameEn: 'AWS', icon: '☁', status: 'locked', tier: 2, xp: 80, description: 'خدمات Amazon السحابية' },
      { id: 83, name: 'Terraform', nameEn: 'Terraform', icon: '◈', status: 'locked', tier: 3, xp: 90, description: 'Infrastructure as Code' },
      { id: 84, name: 'Kubernetes', nameEn: 'Kubernetes', icon: '⬡', status: 'locked', tier: 4, xp: 120, description: 'إدارة الحاويات' },
      { id: 85, name: 'Cloud Arch', nameEn: 'Cloud Arch', icon: '★', status: 'locked', tier: 5, xp: 200, description: 'تصميم أنظمة سحابية متكاملة' },
    ]
  },
  {
    id: 'game',
    name: 'مطور ألعاب',
    nameEn: 'Game Developer',
    icon: '⚔',
    color: '#e879f9',
    description: 'بناء ألعاب فيديو تفاعلية',
    afterComplete: 'تكدر تبني ألعاب تنافس ألعاب عالمية، تنشرها على Steam أو المتاجر، أو تشتغل في استوديو ألعاب. صناعة الألعاب تتجاوز 180 مليار دولار.',
    salary: '$60,000 - $160,000',
    demand: 'متوسط',
    skills: [
      { id: 90, name: 'C#', nameEn: 'C#', icon: '◈', status: 'available', tier: 0, xp: 50, description: 'لغة برمجة Unity' },
      { id: 91, name: 'Unity', nameEn: 'Unity', icon: '⬡', status: 'available', tier: 1, xp: 70, description: 'محرك الألعاب الأشهر' },
      { id: 92, name: '3D Math', nameEn: '3D Math', icon: '◆', status: 'locked', tier: 2, xp: 60, description: 'رياضيات الأبعاد الثلاثية' },
      { id: 93, name: 'Game Physics', nameEn: 'Physics', icon: '⬢', status: 'locked', tier: 3, xp: 80, description: 'محاكاة الفيزياء في الألعاب' },
      { id: 94, name: 'Game AI', nameEn: 'Game AI', icon: '◈', status: 'locked', tier: 4, xp: 100, description: 'ذكاء اصطناعي للألعاب' },
      { id: 95, name: 'Game Pro', nameEn: 'Game Pro', icon: '★', status: 'locked', tier: 5, xp: 200, description: 'تطوير ألعاب احترافية كاملة' },
    ]
  },
  {
    id: 'blockchain',
    name: 'مطور Blockchain',
    nameEn: 'Blockchain Developer',
    icon: '⬢',
    color: '#f59e0b',
    description: 'بناء تطبيقات لامركزية وعقود ذكية',
    afterComplete: 'تكدر تبني تطبيقات DeFi، NFTs، وعقود ذكية. تشتغل في شركات Web3 أو تبني مشروعك الخاص. السوق ناشئ لكنه ينمو بسرعة.',
    salary: '$90,000 - $200,000',
    demand: 'متوسط',
    skills: [
      { id: 100, name: 'Blockchain Basics', nameEn: 'Blockchain', icon: '⬢', status: 'available', tier: 0, xp: 50, description: 'أساسيات البلوكتشين' },
      { id: 101, name: 'Solidity', nameEn: 'Solidity', icon: '◈', status: 'available', tier: 1, xp: 70, description: 'لغة العقود الذكية' },
      { id: 102, name: 'Smart Contracts', nameEn: 'Smart Contracts', icon: '⬡', status: 'locked', tier: 2, xp: 90, description: 'تطوير العقود الذكية' },
      { id: 103, name: 'Web3.js', nameEn: 'Web3.js', icon: '◉', status: 'locked', tier: 3, xp: 100, description: 'ربط التطبيقات بالبلوكتشين' },
      { id: 104, name: 'DeFi', nameEn: 'DeFi', icon: '◆', status: 'locked', tier: 4, xp: 120, description: 'التمويل اللامركزي' },
    ]
  },
  {
    id: 'embedded',
    name: 'مهندس أنظمة مدمجة',
    nameEn: 'Embedded Systems Engineer',
    icon: '◉',
    color: '#14b8a6',
    description: 'برمجة الأجهزة الذكية وIoT',
    afterComplete: 'تكدر تبرمج المتحكمات الدقيقة، تبني أجهزة ذكية، وتشتغل في شركات السيارات، الأجهزة الطبية، أو الـ IoT. العالم المادي يحتاج مبرمجين.',
    salary: '$75,000 - $170,000',
    demand: 'متوسط',
    skills: [
      { id: 110, name: 'C Language', nameEn: 'C', icon: '◈', status: 'available', tier: 0, xp: 50, description: 'لغة البرمجة الأساسية للهاردوير' },
      { id: 111, name: 'Microcontrollers', nameEn: 'MCU', icon: '⬡', status: 'available', tier: 1, xp: 70, description: 'برمجة المتحكمات الدقيقة' },
      { id: 112, name: 'RTOS', nameEn: 'RTOS', icon: '◉', status: 'locked', tier: 2, xp: 80, description: 'أنظمة تشغيل الوقت الحقيقي' },
      { id: 113, name: 'IoT Protocols', nameEn: 'IoT', icon: '⬢', status: 'locked', tier: 3, xp: 90, description: 'بروتوكولات إنترنت الأشياء' },
      { id: 114, name: 'Embedded Pro', nameEn: 'Embedded Pro', icon: '★', status: 'locked', tier: 4, xp: 200, description: 'هندسة أنظمة مدمجة متقدمة' },
    ]
  },
  {
    id: 'qa',
    name: 'مهندس اختبار آلي',
    nameEn: 'QA Automation Engineer',
    icon: '◇',
    color: '#06b6d4',
    description: 'أتمتة اختبار البرمجيات',
    afterComplete: 'تكدر تبني أنظمة اختبار تضمن جودة أي برنامج قبل إطلاقه. كل شركة تقنية تحتاج QA. الوظيفة ممتازة للدخول عالم التقنية.',
    salary: '$60,000 - $140,000',
    demand: 'متوسط',
    skills: [
      { id: 120, name: 'Testing Basics', nameEn: 'Testing', icon: '◇', status: 'available', tier: 0, xp: 30, description: 'أساسيات اختبار البرمجيات' },
      { id: 121, name: 'Selenium', nameEn: 'Selenium', icon: '◈', status: 'available', tier: 1, xp: 60, description: 'أتمتة اختبار الويب' },
      { id: 122, name: 'API Testing', nameEn: 'API Testing', icon: '⬡', status: 'locked', tier: 2, xp: 70, description: 'اختبار واجهات API' },
      { id: 123, name: 'Performance', nameEn: 'Performance', icon: '◉', status: 'locked', tier: 3, xp: 80, description: 'اختبار الأداء' },
      { id: 124, name: 'QA Pro', nameEn: 'QA Pro', icon: '★', status: 'locked', tier: 4, xp: 150, description: 'مهندس اختبار آلي شامل' },
    ]
  },
  {
    id: 'prompt',
    name: 'مهندس Prompt',
    nameEn: 'Prompt Engineer',
    icon: '✧',
    color: '#c084fc',
    description: 'تصميم أوامر الذكاء الاصطناعي',
    afterComplete: 'تكدر تصمم أوامر AI تعطيك أفضل النتائج، تبني AI Agents، وتشتغل في شركات تطبق الذكاء الاصطناعي. تخصص جديد وطلبه عالي جداً.',
    salary: '$80,000 - $180,000',
    demand: 'عالي',
    skills: [
      { id: 130, name: 'LLM Basics', nameEn: 'LLM', icon: '✧', status: 'available', tier: 0, xp: 40, description: 'فهم نماذج اللغة الكبيرة' },
      { id: 131, name: 'Prompt Design', nameEn: 'Prompt Design', icon: '◈', status: 'available', tier: 1, xp: 60, description: 'تصميم أوامر فعالة' },
      { id: 132, name: 'Chain-of-Thought', nameEn: 'CoT', icon: '⬡', status: 'locked', tier: 2, xp: 80, description: 'تقنيات التفكير المتسلسل' },
      { id: 133, name: 'RAG', nameEn: 'RAG', icon: '◉', status: 'locked', tier: 3, xp: 100, description: 'التوليد المعزز بالاسترجاع' },
      { id: 134, name: 'AI Agents', nameEn: 'AI Agents', icon: '★', status: 'locked', tier: 4, xp: 150, description: 'بناء وكلاء ذكيين مستقلين' },
    ]
  },
  {
    id: 'product',
    name: 'مدير منتج تقني',
    nameEn: 'Technical Product Manager',
    icon: '◈',
    color: '#ec4899',
    description: 'إدارة المنتجات التقنية',
    afterComplete: 'تكود تحدد شنو اللي يسويه الفريق التقني، تدير المشاريع، وتكون الحلقة الواصلة بين العمال والتقنيين. من أهم الوظائف القيادية.',
    salary: '$90,000 - $200,000',
    demand: 'عالي',
    skills: [
      { id: 140, name: 'Product Basics', nameEn: 'Product', icon: '◈', status: 'available', tier: 0, xp: 30, description: 'أساسيات إدارة المنتج' },
      { id: 141, name: 'Agile/Scrum', nameEn: 'Agile', icon: '⬡', status: 'available', tier: 1, xp: 50, description: 'إدارة المشاريع المرنة' },
      { id: 142, name: 'User Research', nameEn: 'User Research', icon: '◉', status: 'locked', tier: 2, xp: 60, description: 'فهم احتياجات المستخدمين' },
      { id: 143, name: 'Data Driven', nameEn: 'Data Driven', icon: '⬢', status: 'locked', tier: 3, xp: 80, description: 'اتخاذ قرارات مبنية على البيانات' },
      { id: 144, name: 'Product Pro', nameEn: 'Product Pro', icon: '★', status: 'locked', tier: 4, xp: 150, description: 'مدير منتج تقني محترف' },
    ]
  },
  {
    id: 'arvr',
    name: 'مطور AR/VR',
    nameEn: 'AR/VR Developer',
    icon: '◎',
    color: '#a78bfa',
    description: 'بناء تطبيقات الواقع المعزز والافتراضي',
    afterComplete: 'تكدر تبني تجارب غامرة، ألعاب VR، تطبيقات AR للتجارة، أو تدريب طبي. المستقبل القادم للتقنية.',
    salary: '$80,000 - $180,000',
    demand: 'متوسط',
    skills: [
      { id: 150, name: 'Unity', nameEn: 'Unity', icon: '◈', status: 'available', tier: 0, xp: 50, description: 'محرك تطوير AR/VR' },
      { id: 151, name: '3D Modeling', nameEn: '3D', icon: '⬡', status: 'available', tier: 1, xp: 60, description: 'نمذجة الأجسام ثلاثية الأبعاد' },
      { id: 152, name: 'XR SDK', nameEn: 'XR SDK', icon: '◉', status: 'locked', tier: 2, xp: 80, description: 'أدوات تطوير الواقع الممتد' },
      { id: 153, name: 'Spatial Design', nameEn: 'Spatial', icon: '◎', status: 'locked', tier: 3, xp: 100, description: 'تصميم تجارب مكانية' },
      { id: 154, name: 'AR/VR Pro', nameEn: 'AR/VR Pro', icon: '★', status: 'locked', tier: 4, xp: 200, description: 'مطور واقع معزز محترف' },
    ]
  },
]

export default function SkillTree() {
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [searchQuery, setSearchQuery] = useState('')


  const filteredPaths = useMemo(() => {
    if (!searchQuery) return careerPaths
    const q = searchQuery.toLowerCase()
    return careerPaths.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.nameEn.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.skills.some(s => s.name.toLowerCase().includes(q) || s.nameEn.toLowerCase().includes(q))
    )
  }, [searchQuery])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#34d399'
      case 'active': return '#22d3ee'
      case 'available': return '#fb923c'
      case 'locked': return '#555577'
      default: return '#555577'
    }
  }

  const getDemandColor = (demand: string) => {
    if (demand === 'عالي') return '#34d399'
    if (demand === 'متوسط') return '#facc15'
    return '#f87171'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div>
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span style={{ color: '#22d3ee' }}>⬡</span> شجرة المهارات والمسارات
        </motion.h2>
        <p className="section-subtitle">
          {careerPaths.length} مسار مهني · اختر مسارك وابدأ التعلم
        </p>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ position: 'relative' }}
      >
        <input
          type="text"
          placeholder="ابحث عن مسار أو مهارة..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 20px',
            paddingRight: 44,
            borderRadius: 14,
            border: '1px solid var(--border)',
            background: 'rgba(17, 17, 40, 0.8)',
            color: 'var(--text-primary)',
            fontSize: 15,
            fontFamily: 'Tajawal, sans-serif',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--accent-purple)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
        />
        <span style={{
          position: 'absolute',
          right: 14,
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 18,
          color: 'var(--text-muted)'
        }}>
          🔍
        </span>
        {searchQuery && (
          <span style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 12,
            color: 'var(--text-muted)',
            background: 'rgba(255,255,255,0.05)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)'
          }}>
            {filteredPaths.length} نتيجة
          </span>
        )}
      </motion.div>

      {/* Career Paths Grid */}
      <div className="card-grid">
        {filteredPaths.map((path, i) => (
          <motion.div
            key={path.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ y: -6, scale: 1.01 }}
            onClick={() => setSelectedPath(path)}
            style={{
              padding: 20,
              borderRadius: 16,
              background: selectedPath?.id === path.id 
                ? `linear-gradient(135deg, ${path.color}15, rgba(17, 17, 40, 0.9))`
                : 'rgba(17, 17, 40, 0.7)',
              border: `1px solid ${selectedPath?.id === path.id ? `${path.color}40` : 'var(--border)'}`,
              cursor: 'pointer',
              transition: 'all 0.3s',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Accent line */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, ${path.color}, transparent)`
            }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: `${path.color}15`,
                border: `1px solid ${path.color}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20
              }}>
                {path.icon}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <span className="tag" style={{ 
                  borderColor: `${getDemandColor(path.demand)}40`,
                  color: getDemandColor(path.demand),
                  background: `${getDemandColor(path.demand)}10`,
                  fontSize: 11
                }}>
                  {path.demand}
                </span>
              </div>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4, color: path.color }}>
              {path.name}
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600 }}>
              {path.nameEn}
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
              {path.description}
            </p>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              paddingTop: 12,
              borderTop: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                <span>🪙 {path.skills.reduce((sum, s) => sum + s.xp, 0)} XP</span>
                <span>📚 {path.skills.length} مهارة</span>
              </div>
              <span style={{ fontSize: 12, color: path.color, fontWeight: 600 }}>
                التفاصيل ←
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Path Detail Modal */}
      <AnimatePresence>
        {selectedPath && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setSelectedPath(null); setSelectedSkill(null) }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: 20
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="glass-strong"
              style={{ 
                padding: 32, 
                maxWidth: 700, 
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              {/* Path Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: `${selectedPath.color}20`,
                  border: `2px solid ${selectedPath.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24
                }}>
                  {selectedPath.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 900, color: selectedPath.color }}>
                    {selectedPath.name}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{selectedPath.nameEn}</p>
                </div>
                <span className="tag" style={{ 
                  borderColor: `${getDemandColor(selectedPath.demand)}40`,
                  color: getDemandColor(selectedPath.demand),
                  background: `${getDemandColor(selectedPath.demand)}10`,
                  fontSize: 13
                }}>
                  طلب {selectedPath.demand}
                </span>
              </div>

              {/* Description */}
              <div style={{ 
                padding: 16, 
                borderRadius: 12, 
                background: `${selectedPath.color}08`,
                border: `1px solid ${selectedPath.color}20`,
                marginBottom: 20
              }}>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {selectedPath.description}
                </p>
              </div>

              {/* After Complete */}
              <div style={{ 
                padding: 16, 
                borderRadius: 12, 
                background: 'rgba(52, 211, 153, 0.05)',
                border: '1px solid rgba(52, 211, 153, 0.2)',
                marginBottom: 20
              }}>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: '#34d399', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>🎯</span> شنو تكدر تسوي بعد ما تكمل المسار؟
                </h4>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {selectedPath.afterComplete}
                </p>
                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <span className="tag tag-green">💰 {selectedPath.salary}</span>
                  <span className="tag tag-cyan">📈 الطلب: {selectedPath.demand}</span>
                </div>
              </div>

              {/* Skills */}
              <h4 style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>
                المهارات المطلوبة ({selectedPath.skills.length})
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {selectedPath.skills.map((skill, i) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ x: -4 }}
                    onClick={() => setSelectedSkill(skill)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 14px',
                      borderRadius: 12,
                      background: skill.status === 'completed' ? 'rgba(52, 211, 153, 0.08)' :
                                  skill.status === 'active' ? 'rgba(34, 211, 238, 0.08)' :
                                  skill.status === 'available' ? 'rgba(251, 146, 60, 0.08)' :
                                  'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${getStatusColor(skill.status)}30`,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: `${selectedPath.color}15`,
                      border: `1px solid ${selectedPath.color}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      color: selectedPath.color
                    }}>
                      {skill.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{skill.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{skill.description}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span className="tag" style={{ 
                        borderColor: `${getStatusColor(skill.status)}40`,
                        color: getStatusColor(skill.status),
                        background: `${getStatusColor(skill.status)}10`,
                        fontSize: 10
                      }}>
                        {skill.status === 'completed' ? '✓ مكتملة' : 
                         skill.status === 'active' ? '◉ نشطة' :
                         skill.status === 'available' ? '◈ متاحة' : '🔒 مقفلة'}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: selectedPath.color }}>
                        +{skill.xp}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-primary" style={{ flex: 1 }}>
                  ابدأ هذا المسار
                </button>
                <button className="btn-secondary" onClick={() => { setSelectedPath(null); setSelectedSkill(null) }}>
                  إغلاق
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skill Detail Modal */}
      <AnimatePresence>
        {selectedSkill && selectedPath && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSkill(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1001,
              padding: 20
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="glass-strong"
              style={{ padding: 28, maxWidth: 440, width: '100%', textAlign: 'center' }}
            >
              <div style={{
                width: 60,
                height: 60,
                borderRadius: 18,
                background: `${selectedPath.color}20`,
                border: `2px solid ${selectedPath.color}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
                margin: '0 auto 16px',
                color: selectedPath.color
              }}>
                {selectedSkill.icon}
              </div>
              
              <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 6 }}>
                {selectedSkill.name}
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                {selectedSkill.nameEn} · Tier {selectedSkill.tier}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                {selectedSkill.description}
              </p>

              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 20 }}>
                <span className="tag" style={{ 
                  borderColor: `${selectedPath.color}40`,
                  color: selectedPath.color,
                  background: `${selectedPath.color}10`
                }}>
                  {selectedPath.name}
                </span>
                <span className="tag tag-orange">+{selectedSkill.xp} XP</span>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                {selectedSkill.status === 'available' && (
                  <button className="btn-primary" style={{ flex: 1 }}>
                    ابدأ التعلم
                  </button>
                )}
                {selectedSkill.status === 'active' && (
                  <button className="btn-primary" style={{ flex: 1, background: 'linear-gradient(135deg, #22d3ee, #3b82f6)' }}>
                    أكمل التعلم
                  </button>
                )}
                {selectedSkill.status === 'completed' && (
                  <button className="btn-secondary" style={{ flex: 1, borderColor: '#34d399', color: '#34d399' }}>
                    مكتملة ✓
                  </button>
                )}
                {selectedSkill.status === 'locked' && (
                  <button className="btn-secondary" style={{ flex: 1, opacity: 0.5 }} disabled>
                    مقفلة
                  </button>
                )}
                <button className="btn-secondary" onClick={() => setSelectedSkill(null)}>
                  إغلاق
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
