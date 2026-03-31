import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Globe, Menu, X } from 'lucide-react';
import Home from './components/Home';
import Research from './components/Research';
import Dashboard from './components/Dashboard';
import { t, Lang } from './translations';
import { motion, AnimatePresence } from 'motion/react';

function LogoImg({ size, className = "" }: { size: number; className?: string }) {
  return (
    <motion.div
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lang, setLang] = useState<Lang>('ar');
  const [isAdmin, setIsAdmin] = useState(window.location.pathname === '/admin');
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
      setIsAdmin(window.location.pathname === '/admin');
      
      // Auto-switch to research tab if ?paper= is present
      const params = new URLSearchParams(window.location.search);
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
    { id: 'home', label: tr.nav.home },
    { id: 'research', label: tr.nav.research },
    ...(isAuth ? [{ id: 'admin', label: tr.nav.admin }] : []),
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
    if (isAdmin) return <Dashboard lang={lang} />;
    if (activeTab === 'research') return <Research lang={lang} />;
    return <Home setActiveTab={setActiveTab} lang={lang} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-16 lg:px-32 h-20 flex items-center justify-between">
          <div className="flex items-center cursor-pointer transition-opacity hover:opacity-80 translate-y-2"
            onClick={() => {
              setIsAdmin(false);
              setActiveTab('home');
              window.history.pushState({}, '', '/');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <LogoImg size={170} className="flex-shrink-0" />
          </div>

          <nav className="hidden md:flex items-center gap-8">
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

          <div className="hidden md:flex items-center gap-2">
            <button onClick={() => setLang(l => l === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-all font-bold text-sm">
              <Globe size={16} />
              <span>{lang === 'ar' ? 'EN' : 'ع'}</span>
            </button>
            <button onClick={() => setIsDarkMode(d => !d)}
              className="p-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-all">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <button className="md:hidden p-2 text-primary" onClick={() => setIsMenuOpen(o => !o)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-background-light dark:bg-background-dark border-b border-primary/20 p-4 flex flex-col gap-3 shadow-xl">
            {tabs.map(tab => (
              <button key={tab.id}
                onClick={() => { handleTabChange(tab.id); setIsMenuOpen(false); }}
                className={`text-right text-base font-medium p-2.5 rounded-xl transition-colors ${(isAdmin && tab.id === 'admin') || (!isAdmin && activeTab === tab.id)
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-700 dark:text-slate-300'
                  }`}>
                {tab.label}
              </button>
            ))}
            <div className="flex items-center justify-between pt-3 border-t border-primary/10">
              <button onClick={() => setLang(l => l === 'ar' ? 'en' : 'ar')}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 text-primary font-bold text-sm">
                <Globe size={16} />
                <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
              </button>
              <button onClick={() => setIsDarkMode(d => !d)}
                className="p-2 rounded-xl bg-primary/10 text-primary">
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
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

      <footer className="bg-white dark:bg-card-dark border-t border-primary/10 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex justify-center items-center text-sm text-slate-400">
          <p>{tr.footer.rights}</p>
        </div>
      </footer>
    </div>
  );
}
