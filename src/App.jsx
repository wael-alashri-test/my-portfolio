import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// === Dark Mode Hook ===
function useDarkMode() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("dark");
    return saved ? JSON.parse(saved) : false;
  });
  
  useEffect(() => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      html.classList.remove("dark");
      document.body.classList.remove("dark");
    }
    localStorage.setItem("dark", JSON.stringify(dark));
  }, [dark]);
  
  return { dark, toggleDark: () => setDark(d => !d) };
}

// === أيقونات ===
const Sun = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
  </svg>
);

const Moon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7.5 7.5 0 0 0 21 12.79z"/>
  </svg>
);

const HomeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>);
const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="7" r="4"/><path d="M5 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2"/></svg>);
const Folder = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h5l2 2h11v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>);
const File = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12V8z"/><path d="M14 2v6h6"/></svg>);
const Mail = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-9 6a2 2 0 0 1-2 0L2 7"/></svg>);
const Grad = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 10-10-5L2 10l10 5 10-5z"/><path d="M6 12v5a10 6 0 0 0 12 0v-5"/></svg>);
const Arrow = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h10"/><path d="m12 7 5 5-5 5"/></svg>);

// === بيانات الموقع ===
const SITE = {
  brand: "وائل العشري",
  email: "waelalashri07@icloud.com",
  phone: "+971-583028215",
  location: "Dubai, UAE",
  socials: [
    { label: "GitHub", href: "https://github.com/WanoX7" },
    { label: "LinkedIn", href: "https://linkedin.com/in/wano-x7" },
  ],
  about: {
    headline: { ar: "مهندس أمن سيبراني وذكاء اصطناعي", en: "Cybersecurity & AI Engineer" },
    bio: {
      ar: "خبير في تطوير حلول الذكاء الاصطناعي وتأمين الأنظمة ضد الهجمات الإلكترونية، أقدّم استشارات ومشاريع عالية الجودة تجمع بين التقنية والأمان.",
      en: "Expert in AI development and cybersecurity solutions, providing high-quality consultancy and secure digital products.",
    },
  },
  mentorship: {
    intro: {
      ar: "برنامج تدريب ومتابعة مخصص لتطوير المهارات التقنية والمهنية في الأمن السيبراني والذكاء الاصطناعي",
      en: "Hands-on mentorship and ongoing follow-up in Cybersecurity & AI.",
    },
  }
};

// === الترجمة ===
const dict = {
  ar: { 
    home: "الرئيسية", 
    about: "عنّي", 
    projects: "المشاريع", 
    blog: "المقالات", 
    contact: "اتصل بي", 
    mentorship: "التدريب",
    goToPage: "اذهب للصفحة",
    readMore: "اقرأ المزيد",
    viewDetails: "عرض التفاصيل",
    back: "رجوع",
    search: "بحث",
    all: "الكل",
    tags: "وسوم"
  },
  en: { 
    home: "Home", 
    about: "About", 
    projects: "Projects", 
    blog: "Blog", 
    contact: "Contact", 
    mentorship: "Mentorship",
    goToPage: "Go to page",
    readMore: "Read more",
    viewDetails: "View details",
    back: "Back",
    search: "Search",
    all: "All",
    tags: "Tags"
  },
};

const t = (lang, k) => dict?.[lang]?.[k] ?? k;
const pick = (lang, obj) => (typeof obj === 'string' ? obj : obj?.[lang] ?? obj?.ar ?? "");

// === الهوكس ===
function useI18n(){
  const [lang,setLang] = useState(() => localStorage.getItem("lang") || "ar");
  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);
  return { lang, toggle: () => setLang(p => p === "ar" ? "en" : "ar") };
}

function useScrollTop(){ 
  const loc = useLocation(); 
  useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }), [loc.pathname]); 
}

// === الكومبوننتس المساعدة ===
const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 ${className}`}>
    {children}
  </div>
);

const Btn = ({ children, className = "", ...props }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </motion.button>
);

// === Counter Component ===
const Counter = ({ number, label, delay }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const duration = 2000;
      const increment = number / (duration / 16);
      
      const updateCount = () => {
        start += increment;
        if (start < number) {
          setCount(Math.ceil(start));
          requestAnimationFrame(updateCount);
        } else {
          setCount(number);
        }
      };
      
      updateCount();
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [number, delay]);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="text-center p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700"
    >
      <motion.div 
        key={count}
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        className="text-3xl font-bold text-blue-600 dark:text-blue-400"
      >
        {count}+
      </motion.div>
      <div className="text-sm text-slate-600 dark:text-slate-400 mt-2">{label}</div>
    </motion.div>
  );
};

// === Feature Card Component ===
const FeatureCard = ({ item, index, lang }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ 
        y: -10,
        transition: { type: "spring", stiffness: 300 }
      }}
      className="group cursor-pointer"
    >
      <Link to={item.to} className="block h-full">
        <Card className="relative overflow-hidden h-full">
          {/* تأثير خلفية متدرج */}
          <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
          
          {/* أيقونة */}
          <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} grid place-items-center text-white mb-4`}
          >
            <item.icon />
          </motion.div>

          <h3 className="font-bold text-xl mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {item.title}
          </h3>
          
          <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            {item.desc}
          </p>

          <motion.div
            whileHover={{ x: 5 }}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium"
          >
            <span className="flex items-center gap-2">
              {lang === 'ar' ? 'اكتشف المزيد' : 'Discover More'}
              <Arrow />
            </span>
          </motion.div>

          {/* تأثير عند Hover */}
          <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-teal-500 group-hover:w-full transition-all duration-500"></div>
        </Card>
      </Link>
    </motion.div>
  );
};

// === Theme Toggle ===
const ThemeToggle = ({ dark, onToggle }) => {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative inline-flex items-center gap-3 rounded-full border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm font-semibold bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 shadow-sm hover:shadow-md"
    >
      <motion.div
        key={dark ? "moon" : "sun"}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="relative w-6 h-6"
      >
        {dark ? (
          <Moon className="text-slate-200" />
        ) : (
          <Sun className="text-amber-500" />
        )}
      </motion.div>
      
      <motion.span
        key={dark ? "light" : "dark"}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="min-w-[70px] text-center"
      >
        {dark ? "وضع النهار" : "وضع الليل"}
      </motion.span>

      {/* تأثير إضافي */}
      <motion.div
        className={`absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 opacity-0 hover:opacity-10 transition-opacity duration-300`}
      />
    </motion.button>
  );
};

// === اللايوط ===
function Layout({ children, lang, onToggleLang, dark, onToggleDark }) {
  const loc = useLocation();
  const navItems = [
    { to: "/", icon: HomeIcon, label: t(lang, 'home') },
    { to: "/about", icon: UserIcon, label: t(lang, 'about') },
    { to: "/projects", icon: Folder, label: t(lang, 'projects') },
    { to: "/blog", icon: File, label: t(lang, 'blog') },
    { to: "/contact", icon: Mail, label: t(lang, 'contact') },
    { to: "/mentorship", icon: Grad, label: t(lang, 'mentorship') },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-bold text-blue-600 dark:text-blue-400 text-xl"
            >
              {SITE.brand}
            </motion.div>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={item.to}
                    className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all duration-300 relative overflow-hidden group ${
                      loc.pathname === item.to 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25" 
                      : "text-slate-700 dark:text-slate-200 hover:bg-blue-100 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    {/* تأثير الخلفية */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <item.icon />
                    </motion.div>
                    {item.label}
                    
                    {/* خط تحت النشط */}
                    {loc.pathname === item.to && (
                      <motion.div 
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-white"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Btn onClick={onToggleLang}>
              {lang === "ar" ? "English" : "العربية"}
            </Btn>
            <ThemeToggle dark={dark} onToggle={onToggleDark} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-sm text-slate-600 dark:text-slate-400">
        © {new Date().getFullYear()} {SITE.brand} - {lang === 'ar' ? 'كل الحقوق محفوظة' : 'All rights reserved'}
      </footer>
    </div>
  );
}

// === الصفحات ===
const HomePage = ({ lang }) => {
  useScrollTop();
  
  // Counters animation
  const stats = [
    { number: 7, label: lang === 'ar' ? 'سنوات خبرة' : 'Years Exp' },
    { number: 24, label: lang === 'ar' ? 'مشروع' : 'Projects' },
    { number: 12, label: lang === 'ar' ? 'عميل' : 'Clients' }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section محسنة */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <Card className="relative overflow-hidden">
          {/* خلفية متحركة */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-teal-500/10 animate-pulse"></div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-teal-500 grid place-items-center text-white mb-6 relative z-10"
          >
            <UserIcon />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"
          >
            {SITE.brand}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-blue-600 dark:text-blue-400 mt-2 text-xl font-semibold"
          >
            {SITE.about.headline[lang]}
          </motion.p>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mt-4 text-lg leading-relaxed"
          >
            {SITE.about.bio[lang]}
          </motion.p>

          {/* Counters */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-6 max-w-md mx-auto mt-8"
          >
            {stats.map((stat, index) => (
              <Counter key={index} number={stat.number} label={stat.label} delay={0.7 + index * 0.1} />
            ))}
          </motion.div>

          {/* Social Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap justify-center gap-3 mt-8"
          >
            {SITE.socials.map((social, i) => (
              <motion.a
                key={i}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                whileHover={{ 
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-full border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium flex items-center gap-2 transition-all"
              >
                {social.label}
              </motion.a>
            ))}
          </motion.div>
        </Card>
      </motion.div>

      {/* البطاقات المتحركة */}
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2
            }
          }
        }}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {[
          { 
            to: "/about", 
            title: t(lang, 'about'), 
            desc: SITE.about.bio[lang], 
            icon: UserIcon, 
            color: "from-purple-500 to-pink-500" 
          },
          { 
            to: "/projects", 
            title: t(lang, 'projects'), 
            desc: lang === 'ar' ? "نماذج من أعمالي ومشاريعي في الأمن السيبراني" : "My cybersecurity projects and works", 
            icon: Folder, 
            color: "from-blue-500 to-cyan-500" 
          },
          { 
            to: "/blog", 
            title: t(lang, 'blog'), 
            desc: lang === 'ar' ? "مقالات وتقنيات متقدمة في الأمن السيبراني" : "Advanced cybersecurity articles and techniques", 
            icon: File, 
            color: "from-green-500 to-emerald-500" 
          },
          { 
            to: "/mentorship", 
            title: t(lang, 'mentorship'), 
            desc: lang === 'ar' ? "برامج تدريب وإرشاد متخصصة" : "Specialized training and mentorship programs", 
            icon: Grad, 
            color: "from-orange-500 to-red-500" 
          },
          { 
            to: "/contact", 
            title: t(lang, 'contact'), 
            desc: lang === 'ar' ? "وسائل التواصل المختلفة للتعاون" : "Various contact methods for collaboration", 
            icon: Mail, 
            color: "from-indigo-500 to-purple-500" 
          },
        ].map((item, i) => (
          <FeatureCard key={i} item={item} index={i} lang={lang} />
        ))}
      </motion.div>
    </div>
  );
};

const AboutPage = ({ lang }) => {
  useScrollTop();
  
  const skills = [
    { name: "الأمن السيبراني", level: 90 },
    { name: "الذكاء الاصطناعي", level: 85 },
    { name: "تطوير الويب", level: 80 },
    { name: "تحليل البيانات", level: 75 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Card>
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
          {t(lang, 'about')}
        </h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-600 dark:text-slate-300 mb-6 text-lg leading-relaxed"
        >
          {SITE.about.bio[lang]}
        </motion.p>
        
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-xl mb-4">{lang === 'ar' ? 'معلومات التواصل' : 'Contact Info'}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <span className="text-blue-600">📍</span>
                <span>{SITE.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue-600">📧</span>
                <a href={`mailto:${SITE.email}`} className="text-blue-600 hover:underline">
                  {SITE.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue-600">📞</span>
                <span>{SITE.phone}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="font-semibold text-xl mb-4">{lang === 'ar' ? 'المهارات' : 'Skills'}</h3>
            <div className="space-y-4">
              {skills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-sm text-slate-500">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                      className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

const ProjectsPage = ({ lang }) => {
  useScrollTop();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Card>
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
          {t(lang, 'projects')}
        </h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-600 dark:text-slate-300 text-center py-12 text-lg"
        >
          {lang === 'ar' ? '🔧 قريباً سيتم إضافة المشاريع...' : '🔧 Projects coming soon...'}
        </motion.p>
      </Card>
    </motion.div>
  );
};

const BlogPage = ({ lang }) => {
  useScrollTop();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Card>
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
          {t(lang, 'blog')}
        </h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-600 dark:text-slate-300 text-center py-12 text-lg"
        >
          {lang === 'ar' ? '📝 قريباً سيتم إضافة المقالات...' : '📝 Blog posts coming soon...'}
        </motion.p>
      </Card>
    </motion.div>
  );
};

const ContactPage = ({ lang }) => {
  useScrollTop();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // هنا رح نضيف logic إرسال الإيميل
    alert(lang === 'ar' ? 'سيتم إرسال رسالتك قريباً!' : 'Your message will be sent soon!');
    setFormData({ name: '', email: '', message: '' });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid md:grid-cols-2 gap-6"
    >
      <Card>
        <h2 className="text-2xl font-bold mb-4">{lang === 'ar' ? 'معلومات التواصل' : 'Contact Info'}</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</h3>
            <a href={`mailto:${SITE.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
              {SITE.email}
            </a>
          </div>
          <div>
            <h3 className="font-semibold mb-2">{lang === 'ar' ? 'الهاتف' : 'Phone'}</h3>
            <div>{SITE.phone}</div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">{lang === 'ar' ? 'الموقع' : 'Location'}</h3>
            <div>{SITE.location}</div>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold mb-4">{lang === 'ar' ? 'أرسل رسالة' : 'Send Message'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">{lang === 'ar' ? 'الاسم' : 'Name'}</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{lang === 'ar' ? 'الرسالة' : 'Message'}</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {lang === 'ar' ? 'إرسال الرسالة' : 'Send Message'}
          </motion.button>
        </form>
      </Card>
    </motion.div>
  );
};

const MentorshipPage = ({ lang }) => {
  useScrollTop();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Card>
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
          {t(lang, 'mentorship')}
        </h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-600 dark:text-slate-300 mb-6 text-lg leading-relaxed"
        >
          {SITE.mentorship.intro[lang]}
        </motion.p>
        
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-xl mb-4">{lang === 'ar' ? 'ماذا تقدم؟' : 'What I Offer'}</h3>
            <ul className="space-y-3">
              {[
                lang === 'ar' ? 'تقييم المهارات الحالية' : 'Skills assessment',
                lang === 'ar' ? 'خطة تطوير شخصية' : 'Personal development plan',
                lang === 'ar' ? 'مشاريع عملية حقيقية' : 'Real practical projects',
                lang === 'ar' ? 'متابعة أسبوعية' : 'Weekly follow-ups'
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <div className="bg-gradient-to-br from-blue-500 to-teal-500 text-white p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">{lang === 'ar' ? 'ابدأ رحلتك' : 'Start Your Journey'}</h3>
              <p className="mb-6 opacity-90">
                {lang === 'ar' ? 'احجز جلسة استشارية مجانية' : 'Book a free consultation session'}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                {lang === 'ar' ? 'احجز الآن' : 'Book Now'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

// === التطبيق الرئيسي ===
function App() {
  const { lang, toggle } = useI18n();
  const { dark, toggleDark } = useDarkMode();

  const InnerRoutes = () => {
    const location = useLocation();
    
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage lang={lang} />} />
            <Route path="/about" element={<AboutPage lang={lang} />} />
            <Route path="/projects" element={<ProjectsPage lang={lang} />} />
            <Route path="/blog" element={<BlogPage lang={lang} />} />
            <Route path="/contact" element={<ContactPage lang={lang} />} />
            <Route path="/mentorship" element={<MentorshipPage lang={lang} />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <BrowserRouter>
      <Layout lang={lang} onToggleLang={toggle} dark={dark} onToggleDark={toggleDark}>
        <InnerRoutes />
      </Layout>
    </BrowserRouter>
  );
}

export default App;