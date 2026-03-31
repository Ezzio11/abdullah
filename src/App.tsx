import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Moon, Sun, Globe, UserCircle, BookOpen, Home as HomeIcon } from 'lucide-react';
import Home from './components/Home';
import { t, Lang } from './translations';
import { motion, AnimatePresence } from 'motion/react';

// Lazy load non-critical sections
const Research = lazy(() => import('./components/Research'));
const Dashboard = lazy(() => import('./components/Dashboard'));

function LogoImg({ size, className = "" }: { size: number; className?: string }) {
  return (
    <motion.div
      role="img"
      aria-label="Abdullah Hossam Logo"
      className={`bg-[#1a2e22] dark:bg-white ${className}`}
      style={{
        width: size,
        height: size,
        maskImage: 'url(/Logo.svg)',
        WebkitMaskImage: 'url(/Logo.svg)',
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center'
      }}
      initial={{ scale: 1.2, opacity: 0, rotate: -5 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.6
      }}
    />
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lang, setLang] = useState<Lang>('ar');
  const [isAdmin, setIsAdmin] = useState(() => {
    const p = window.location.pathname;
    const s = window.location.search;
    const h = window.location.hash;
    return p === '/admin' || s.includes('admin') || h.includes('admin');
  });
  const [isAuth, setIsAuth] = useState(localStorage.getItem('admin_auth') === 'true');

  // Check auth status periodically in case of login/logout
  useEffect(() => {
    const checkAuth = () => {
      setIsAuth(localStorage.getItem('admin_auth') === 'true');
    };
    checkAuth();
    const interval = setInterval(checkAuth, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleLocationChange = () => {
      const p = window.location.pathname;
      const s = window.location.search;
      const h = window.location.hash;
      setIsAdmin(p === '/admin' || s.includes('admin') || h.includes('admin'));
      
      // Auto-switch to research tab if ?paper= is present
      const params = new URLSearchParams(s);
      if (params.has('paper')) {
        setActiveTab('research');
      }
    };
    
    // Check on mount
    handleLocationChange();
    
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const h = document.documentElement;
    h.setAttribute('lang', lang);
    h.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.title = lang === 'ar' ? 'عبدالله حسام | باحث في العلوم السياسية' : 'Abdullah Hossam | Political Science Researcher';
  }, [lang]);

  const tr = t[lang];
  const tabs = [
    { id: 'home', label: tr.nav.home, icon: HomeIcon },
    { id: 'research', label: tr.nav.research, icon: BookOpen },
    { id: 'admin', label: isAuth ? tr.nav.admin : (lang === 'ar' ? 'دخول' : 'Login'), icon: UserCircle },
  ];

  const handleTabChange = (tabId: string) => {
    if (tabId === 'admin') {
      setIsAdmin(true);
      window.history.pushState({}, '', '/admin');
    } else {
      setIsAdmin(false);
      setActiveTab(tabId);
      window.history.pushState({}, '', '/');
    }
  };

  const renderContent = () => {
    return (
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      }>
        {isAdmin ? <Dashboard lang={lang} /> : (
          activeTab === 'research' ? <Research lang={lang} /> : <Home setActiveTab={setActiveTab} lang={lang} />
        )}
      </Suspense>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-32 h-16 md:h-20 flex items-center justify-between md:justify-between relative">
          
          {/* Logo - Centered on Mobile, Start on Desktop */}
          <div 
            className="flex-1 md:flex-initial flex items-center justify-center md:justify-start cursor-pointer transition-opacity hover:opacity-80 translate-y-1 md:translate-y-2"
            onClick={() => {
              setIsAdmin(false);
              setActiveTab('home');
              window.history.pushState({}, '', '/');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <LogoImg size={lang === 'ar' ? (window.innerWidth < 768 ? 140 : 180) : 170} className="flex-shrink-0" />
          </div>

          <nav className="hidden md:flex items-center gap-8 ml-8">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => handleTabChange(tab.id)}
                className={`text-sm font-medium transition-colors pb-0.5 ${(isAdmin && tab.id === 'admin') || (!isAdmin && activeTab === tab.id)
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-slate-600 dark:text-slate-300 hover:text-primary'
                  }`}>
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <button 
              onClick={() => setLang(l => l === 'ar' ? 'en' : 'ar')}
              aria-label={lang === 'ar' ? 'Switch to English' : 'تغيير اللغة إلى العربية'}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-all font-bold text-[12px] md:text-sm">
              <Globe size={14} className="md:w-4 md:h-4" />
              <span>{lang === 'ar' ? 'EN' : 'ع'}</span>
            </button>
            <button 
              onClick={() => setIsDarkMode(d => !d)}
              aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-all">
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden pb-20 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={isAdmin ? 'admin' : activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex-1 flex flex-col"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full border-t border-primary/20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-xl z-[100] pb-safe">
        <div className="flex items-center justify-around h-16">
          {tabs.map(tab => {
            const isActive = (isAdmin && tab.id === 'admin') || (!isAdmin && activeTab === tab.id);
            const Icon = tab.icon;
            return (
              <button 
                key={tab.id} 
                onClick={() => handleTabChange(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all ${isActive ? 'text-primary' : 'text-slate-400'}`}
              >
                <Icon size={20} className={isActive ? 'scale-110' : ''} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">{tab.label}</span>
                {isActive && <motion.div layoutId="activeTab" className="absolute bottom-1 w-10 h-0.5 bg-primary rounded-full" />}
              </button>
            );
          })}
        </div>
      </nav>

      <footer className="hidden md:block bg-white dark:bg-card-dark border-t border-primary/10 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex justify-center items-center text-sm text-slate-400">
          <p>{tr.footer.rights}</p>
        </div>
      </footer>
    </div>
  );
}
