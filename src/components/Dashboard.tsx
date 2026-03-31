import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Save, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  Download, 
  ExternalLink, 
  FileText, 
  Star,
  LogOut,
  ChevronDown,
  ChevronUp,
  Globe,
  Settings,
  Cloud,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import papersData from '../data/papers.json';

// SHA-256 Hash of "AbdullahH@1532005"
const AUTH_HASH = 'f46cbaf771e5957394e2d327cbbaaff5260ddcd7397e40c05a59174509187e89';

async function hashPassword(password: string) {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

type BilingualString = { ar: string; en: string };

interface PaperPart {
  id: string;
  title: BilingualString;
  content: BilingualString;
}

interface PaperSection {
  id: string;
  title: BilingualString;
  parts: PaperPart[];
}

interface Paper {
  id: string;
  title: BilingualString;
  cat: BilingualString;
  lang: string;
  year: string;
  desc: BilingualString;
  img: string;
  cta: BilingualString;
  meta: BilingualString;
  featured: boolean;
  pdfUrl?: string;
  iframeUrl?: string;
  sections?: PaperSection[];
}

import { Lang } from '../translations';

export default function Dashboard({ lang }: { lang: Lang }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const isAr = lang === 'ar';
  const [papers, setPapers] = useState<Paper[]>(() => {
    const saved = localStorage.getItem('papers_db');
    return saved ? JSON.parse(saved) : papersData as Paper[];
  });
  const [editingPaper, setEditingPaper] = useState<Paper | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  
  // Gist Settings
  const [gistId, setGistId] = useState(() => localStorage.getItem('gist_id') || '');
  const [ghToken, setGhToken] = useState(() => localStorage.getItem('gh_token') || '');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showSettings, setShowSettings] = useState(false);

  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem('gist_id', gistId);
    localStorage.setItem('gh_token', ghToken);
  }, [gistId, ghToken]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('papers_db', JSON.stringify(papers));
    setIsAutoSaving(true);
    const timer = setTimeout(() => setIsAutoSaving(false), 2000);
    return () => clearTimeout(timer);
  }, [papers]);

  // Authentication check
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const hash = await hashPassword(password);
    if (hash === AUTH_HASH) {
      setIsAuthenticated(true);
      setError('');
      localStorage.setItem('admin_auth', 'true');
    } else {
      setError('كلمة المرور غير صحيحة | Invalid Password');
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
    localStorage.removeItem('admin_tab_visible');
  };

  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Featured limit check
  const featuredCount = papers.filter(p => p.featured).length;

  const toggleFeatured = (id: string) => {
    const paper = papers.find(p => p.id === id);
    if (!paper) return;

    if (!paper.featured && featuredCount >= 3) {
      alert('لا يمكن تفريد أكثر من 3 أبحاث | Maximum 3 featured items allowed');
      return;
    }

    setPapers(papers.map(p => p.id === id ? { ...p, featured: !p.featured } : p));
  };

  const deletePaper = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا البحث؟ | Are you sure you want to delete this paper?')) {
      setPapers(papers.filter(p => p.id !== id));
    }
  };

  const startEditing = (paper: Paper) => setEditingPaper(JSON.parse(JSON.stringify(paper)));
  
  const startNewPaper = () => {
    const newPaper: Paper = {
      id: `paper-${Date.now()}`,
      title: { ar: '', en: '' },
      cat: { ar: '', en: '' },
      lang: 'ARABIC',
      year: new Date().getFullYear().toString(),
      desc: { ar: '', en: '' },
      img: '',
      cta: { ar: 'اقرأ البحث ←', en: 'READ PAPER →' },
      meta: { ar: '', en: '' },
      featured: false,
      sections: []
    };
    setEditingPaper(newPaper);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height *= maxDim / width;
            width = maxDim;
          } else {
            width *= maxDim / height;
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Quality: 0.8 is the professional sweet spot
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        if (editingPaper) {
          setEditingPaper({ ...editingPaper, img: dataUrl });
        }
        setIsLoading(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      if (!window.confirm('هذا الملف كبير (أكثر من 2MB). قد يؤثر على سرعة الموقع. هل تريد الاستمرار؟ | This PDF is large (>2MB). It may slow down the site. Continue?')) {
        return;
      }
    }

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (editingPaper) {
        setEditingPaper({ ...editingPaper, pdfUrl: event.target?.result as string });
      }
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const formatFileSize = (base64String: string) => {
    if (!base64String || !base64String.startsWith('data:')) return null;
    const stringLength = base64String.length - base64String.indexOf(',') - 1;
    const sizeInBytes = Math.ceil(stringLength * (3 / 4));
    const sizeInKb = sizeInBytes / 1024;
    return sizeInKb > 1024 ? `${(sizeInKb/1024).toFixed(2)} MB` : `${Math.round(sizeInKb)} KB`;
  };

  const savePaper = () => {
    if (!editingPaper) return;
    const exists = papers.find(p => p.id === editingPaper.id);
    if (exists) {
      setPapers(papers.map(p => p.id === editingPaper.id ? editingPaper : p));
    } else {
      setPapers([...papers, editingPaper]);
    }
    setEditingPaper(null);
  };

  const exportJSON = () => {
    const dataStr = JSON.stringify(papers, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'papers.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const syncToGist = async () => {
    if (!gistId || !ghToken) {
      alert('الرجاء إدخال Gist ID و Token في الإعدادات | Please enter Gist ID and Token in settings');
      setShowSettings(true);
      return;
    }

    setIsSyncing(true);
    setSyncStatus('idle');

    try {
      const body = {
        files: {
          'papers.json': {
            content: JSON.stringify(papers, null, 2)
          }
        }
      };

      const response = await fetch(`https://api.github.com/gists/${gistId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `token ${ghToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Failed to sync to Gist');
      
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setSyncStatus('error');
      alert('فشل المزامنة | Sync Failed');
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white dark:bg-card-dark rounded-3xl p-8 shadow-2xl border border-primary/20"
        >
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-primary/10 text-primary">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl font-bold font-serif">لوحة التحكم | Dashboard</h1>
            <p className="text-slate-500 text-center">أدخل كلمة المرور للمتابعة</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور | Password"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all"
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-primary text-white font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? 'جاري التحقق...' : 'دخول | Login'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold font-serif mb-2">إدارة الأبحاث | Research Management</h1>
            <div className="flex items-center gap-4">
              <p className="text-slate-500">تم تفريد {featuredCount} من 3 أبحاث</p>
              <AnimatePresence>
                {isAutoSaving && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-widest"
                  >
                    تم الحفظ تلقائياً | Auto-saved
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`p-3 rounded-xl transition-all shadow-md ${showSettings ? 'bg-primary text-white' : 'bg-white dark:bg-card-dark text-slate-600 dark:text-slate-400'}`}
              title="الإعدادات | Settings"
            >
              <Settings size={20} />
            </button>
            <button 
              onClick={syncToGist}
              disabled={isSyncing}
              className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${
                syncStatus === 'success' ? 'bg-green-500 text-white' : 
                syncStatus === 'error' ? 'bg-red-500 text-white' :
                'bg-blue-600 text-white hover:brightness-110'
              }`}
            >
              {isSyncing ? <Loader2 size={18} className="animate-spin" /> : 
               syncStatus === 'success' ? <CheckCircle size={18} /> : 
               syncStatus === 'error' ? <AlertCircle size={18} /> : 
               <Cloud size={18} />}
              {isSyncing ? 'جاري المزامنة...' : 'مزامنة السحاب | Cloud Sync'}
            </button>
            <button 
              onClick={() => {
                if (window.confirm('سيتم حذف جميع التغييرات غير المحفظة والعودة للملف الأصلي. هل أنت متأكد؟ | This will discard ALL local drafts and reset to the source papers.json. Are you sure?')) {
                  localStorage.removeItem('papers_db');
                  window.location.reload();
                }
              }}
              className="px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold flex items-center gap-2 hover:bg-red-500 hover:text-white transition-all shadow-md"
            >
              <AlertCircle size={18} />
              {isAr ? 'إعادة ضبط | Reset' : 'Reset to Source'}
            </button>
            <button 
              onClick={exportJSON}
              className="px-6 py-3 rounded-xl bg-orange-500 text-white font-bold flex items-center gap-2 hover:brightness-110 transition-all shadow-lg"
            >
              <Download size={18} />
              {isAr ? 'تصدير JSON' : 'Export JSON'}
            </button>
            <button 
              onClick={startNewPaper}
              className="px-6 py-3 rounded-xl bg-primary text-white font-bold flex items-center gap-2 hover:brightness-110 transition-all shadow-lg"
            >
              <Plus size={18} />
              بحث جديد | New Paper
            </button>
            <button 
              onClick={handleLogout}
              className="p-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-red-500 hover:text-white transition-all shadow-md"
              title="تسجيل الخروج"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8 mb-12">
          {/* Main Controls - 9 cols */}
          <div className="lg:col-span-9 space-y-8">
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white dark:bg-card-dark rounded-3xl p-6 border border-primary/10 shadow-xl grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">GitHub Gist ID</label>
                      <input 
                        value={gistId} 
                        onChange={e => setGistId(e.target.value)}
                        placeholder="e.g. 7f1234567890abcdef..."
                        className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">GitHub Personal Access Token (PAT)</label>
                      <input 
                        type="password"
                        value={ghToken} 
                        onChange={e => setGhToken(e.target.value)}
                        placeholder="ghp_..."
                        className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Info - 3 cols */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 border border-primary/10">
              <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-primary">
                <CheckCircle size={16} />
                {isAr ? 'دليل التسليم | Handoff Checklist' : 'Handoff Checklist'}
              </h3>
              <ul className="space-y-3 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">1</span>
                  {isAr ? 'قم بمزاولة جميع التعديلات عبر "مزامنة السحاب" للـ Gist الخاص بك.' : 'Sync all changes using "Cloud Sync" to your Gist.'}
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">2</span>
                  {isAr ? 'في حال تعديل ملف papers.json يدوياً، استخدم زر "إعادة ضبط" لتحديث الواجهة.' : 'If editing papers.json manually, use "Reset to Source" to refresh the UI.'}
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">3</span>
                  {isAr ? 'حافظ على حجم ملفات PDF أقل من 2MB لضمان المزامنة السريعة.' : 'Keep PDF sizes under 2MB for fast Gist synchronization.'}
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">4</span>
                  {isAr ? 'شارك رابط الموقع مع ?paper=id للربط المباشر ببحث معين.' : 'Share deep links using ?paper=id to point to specific research.'}
                </li>
              </ul>
            </div>
            
            <div className="bg-orange-500/5 rounded-3xl p-6 border border-orange-500/20">
              <h3 className="font-bold text-sm mb-2 text-orange-600 dark:text-orange-400 flex items-center gap-2">
                <AlertCircle size={16} />
                {isAr ? 'تنبيه أمان' : 'Security Note'}
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
                {isAr ? 'يتم تخزين رموز الوصول (Tokens) محلياً فقط في متصفحك. لا تقم بمشاركة لقطات شاشة تحتوي على رموزك الخاصة.' : 'Your API tokens are stored locally in your browser. Never share screenshots of your private tokens.'}
              </p>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!editingPaper ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid gap-6"
            >
              {papers.map(paper => (
                <div key={paper.id} className="bg-white dark:bg-card-dark rounded-3xl p-6 shadow-xl border border-primary/5 flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-900 overflow-hidden flex-shrink-0">
                    <img src={paper.img || '/placeholder.png'} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-center md:text-right">
                    <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                       <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">{paper.cat.ar}</span>
                       <span className="text-slate-400 text-xs">{paper.year}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{paper.title.ar}</h3>
                    <p className="text-slate-500 text-sm italic">{paper.title.en}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => toggleFeatured(paper.id)}
                      className={`p-3 rounded-xl transition-all ${paper.featured ? 'bg-yellow-400 text-white shadow-yellow-200 shadow-lg' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'}`}
                    >
                      <Star size={20} fill={paper.featured ? "currentColor" : "none"} />
                    </button>
                    <button 
                      onClick={() => startEditing(paper)}
                      className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-primary hover:text-white transition-all font-bold"
                    >
                      تعديل | Edit
                    </button>
                    <button 
                      onClick={() => deletePaper(paper.id)}
                      className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-red-500 hover:text-white transition-all text-red-500"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="edit"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-card-dark rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-primary/10"
            >
              <button 
                onClick={() => setEditingPaper(null)}
                className="flex items-center gap-2 text-slate-500 hover:text-primary transition-all mb-8 font-bold"
              >
                <ChevronLeft size={20} />
                العودة للقائمة | Back to List
              </button>

              <div className="grid md:grid-cols-2 gap-12">
                {/* Metadata Column */}
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold font-serif flex items-center gap-3">
                    <FileText className="text-primary" />
                    المعلومات الأساسية | Metadata
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold opacity-60">ID</label>
                        <input value={editingPaper.id} onChange={e => setEditingPaper({...editingPaper, id: e.target.value})} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold opacity-60">Year</label>
                        <input value={editingPaper.year} onChange={e => setEditingPaper({...editingPaper, year: e.target.value})} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary outline-none" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold opacity-60">Title (Arabic)</label>
                      <input value={editingPaper.title.ar} onChange={e => setEditingPaper({...editingPaper, title: {...editingPaper.title, ar: e.target.value}})} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary outline-none" dir="rtl" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold opacity-60">Title (English)</label>
                      <input value={editingPaper.title.en} onChange={e => setEditingPaper({...editingPaper, title: {...editingPaper.title, en: e.target.value}})} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary outline-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold opacity-60">Category (AR)</label>
                        <input value={editingPaper.cat.ar} onChange={e => setEditingPaper({...editingPaper, cat: {...editingPaper.cat, ar: e.target.value}})} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold opacity-60">Category (EN)</label>
                        <input value={editingPaper.cat.en} onChange={e => setEditingPaper({...editingPaper, cat: {...editingPaper.cat, en: e.target.value}})} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary outline-none" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold opacity-60">Description (AR)</label>
                      <textarea rows={4} value={editingPaper.desc.ar} onChange={e => setEditingPaper({...editingPaper, desc: {...editingPaper.desc, ar: e.target.value}})} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary outline-none resize-none" dir="rtl" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold opacity-60">Description (EN)</label>
                      <textarea rows={4} value={editingPaper.desc.en} onChange={e => setEditingPaper({...editingPaper, desc: {...editingPaper.desc, en: e.target.value}})} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary outline-none resize-none" />
                    </div>

                    <div className="space-y-4">
                       <label className="text-sm font-bold opacity-60">Image / Thumbnail (Base64 Auto-Engine)</label>
                       <div className="flex flex-col gap-6">
                         <div className="flex gap-6 items-center bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                           <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-950 overflow-hidden flex-shrink-0 border-2 border-primary/20 flex items-center justify-center shadow-inner">
                             {editingPaper.img ? (
                               <img src={editingPaper.img} alt="Preview" className="w-full h-full object-cover" />
                             ) : (
                               <Plus className="text-slate-300" size={32} />
                             )}
                           </div>
                           <div className="flex-1 space-y-3">
                             <p className="text-xs text-slate-500 font-medium">Auto-resized to 1200px Retina standard for Gist-y portability.</p>
                             <div className="flex gap-3">
                               <label className="cursor-pointer px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:brightness-110 transition-all shadow-md flex items-center gap-2">
                                 <Plus size={14} />
                                 {editingPaper.img ? 'استبدال الصورة | Replace' : 'رفع صورة | Upload Image'}
                                 <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                               </label>
                               {editingPaper.img && (
                                 <button 
                                   onClick={() => setEditingPaper({...editingPaper, img: ''})}
                                   className="px-5 py-2.5 bg-red-500/10 text-red-500 text-xs font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                 >
                                   حذف | Remove
                                 </button>
                               )}
                             </div>
                           </div>
                         </div>

                         <div className="space-y-2 opacity-50 focus-within:opacity-100 transition-opacity">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Manual Path / URL (Fallback)</label>
                            <input 
                              placeholder="/thumbnail.png or https://..."
                              value={editingPaper.img.startsWith('data:') ? 'Base64 (Encoded Data)' : editingPaper.img} 
                              onChange={e => setEditingPaper({...editingPaper, img: e.target.value})} 
                              className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary outline-none text-xs font-mono" 
                            />
                         </div>
                       </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-primary/5">
                       <label className="text-sm font-bold opacity-60">Research Paper (PDF Auto-Engine)</label>
                       
                       <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-3 rounded-xl ${editingPaper.pdfUrl ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-950 text-slate-300'}`}>
                                <FileText size={24} />
                              </div>
                              <div>
                                <p className="text-sm font-bold">{editingPaper.pdfUrl ? 'Research PDF Prepared' : 'No PDF Attached'}</p>
                                <p className="text-[10px] text-slate-500 font-medium">Internal Base64 Storage (Zero-Path)</p>
                              </div>
                            </div>
                            {editingPaper.pdfUrl && (
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                                (formatFileSize(editingPaper.pdfUrl)?.includes('MB') && parseFloat(formatFileSize(editingPaper.pdfUrl)!) > 2) 
                                ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                              }`}>
                                {formatFileSize(editingPaper.pdfUrl)}
                              </span>
                            )}
                         </div>

                         <div className="flex gap-3">
                            <label className="flex-1 cursor-pointer px-6 py-3 bg-slate-950 dark:bg-primary text-white text-sm font-bold rounded-2xl hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2">
                              <Cloud size={18} />
                              {editingPaper.pdfUrl ? 'Replace Research Paper' : 'Upload Research Paper'}
                              <input type="file" className="hidden" accept="application/pdf" onChange={handlePdfUpload} />
                            </label>
                            {editingPaper.pdfUrl && (
                              <button 
                                onClick={() => setEditingPaper({...editingPaper, pdfUrl: ''})}
                                className="px-6 py-3 bg-red-500/10 text-red-500 text-sm font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                         </div>
                       </div>

                       <div className="space-y-2 opacity-50 focus-within:opacity-100 transition-opacity">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Manual PDF URL (Fallback)</label>
                          <input 
                            placeholder="https://researchgate.net/..."
                            value={editingPaper.pdfUrl?.startsWith('data:') ? 'Base64 (Encoded Document)' : editingPaper.pdfUrl || ''} 
                            onChange={e => setEditingPaper({...editingPaper, pdfUrl: e.target.value})} 
                            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary outline-none text-xs font-mono" 
                          />
                       </div>
                    </div>
                  </div>
                </div>

                {/* Sections Column */}
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold font-serif flex items-center gap-3">
                      <Globe className="text-primary" />
                      المحتوى الكامل | Full Text
                    </h2>
                    <button 
                      onClick={() => {
                        const newSection: PaperSection = {
                          id: `sec-${Date.now()}`,
                          title: { ar: 'عنوان القسم', en: 'Section Title' },
                          parts: []
                        };
                        setEditingPaper({...editingPaper, sections: [...(editingPaper.sections || []), newSection]});
                      }}
                      className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-all flex items-center gap-2"
                    >
                      <Plus size={16} /> أضف قسم | Add Section
                    </button>
                  </div>

                  <div className="space-y-6">
                    {editingPaper.sections?.map((section, sIndex) => (
                      <div key={section.id} className="bg-slate-50 dark:bg-slate-950 rounded-3xl p-6 border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-start mb-6 gap-4">
                          <div className="flex-1 space-y-4">
                            <input 
                              placeholder="Title AR"
                              value={section.title.ar} 
                              onChange={e => {
                                const newSections = [...(editingPaper.sections || [])];
                                newSections[sIndex].title.ar = e.target.value;
                                setEditingPaper({...editingPaper, sections: newSections});
                              }} 
                              className="w-full p-2 bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-primary outline-none font-bold"
                              dir="rtl"
                            />
                            <input 
                              placeholder="Title EN"
                              value={section.title.en} 
                              onChange={e => {
                                const newSections = [...(editingPaper.sections || [])];
                                newSections[sIndex].title.en = e.target.value;
                                setEditingPaper({...editingPaper, sections: newSections});
                              }} 
                              className="w-full p-2 bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-primary outline-none italic"
                            />
                          </div>
                          <button 
                            onClick={() => {
                              const newSections = editingPaper.sections?.filter((_, i) => i !== sIndex);
                              setEditingPaper({...editingPaper, sections: newSections});
                            }}
                            className="text-red-500 p-2 hover:bg-red-100 rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        {/* Parts List */}
                        <div className="ml-6 border-r-2 border-primary/20 pr-6 space-y-8">
                          {section.parts.map((part, pIndex) => (
                            <div key={part.id} className="relative space-y-4">
                              <button 
                                onClick={() => {
                                  const newSections = [...(editingPaper.sections || [])];
                                  newSections[sIndex].parts = newSections[sIndex].parts.filter((_, i) => i !== pIndex);
                                  setEditingPaper({...editingPaper, sections: newSections});
                                }}
                                className="absolute -left-2 top-0 text-red-400 hover:text-red-600 transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                              
                              <div className="space-y-4">
                                <input 
                                  placeholder="Part Title (AR/EN optional)"
                                  value={part.title.ar}
                                  onChange={e => {
                                    const newSections = [...(editingPaper.sections || [])];
                                    newSections[sIndex].parts[pIndex].title.ar = e.target.value;
                                    setEditingPaper({...editingPaper, sections: newSections});
                                  }}
                                  className="w-full p-1 bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-primary outline-none text-sm font-bold"
                                  dir="rtl"
                                />
                                <div className="grid gap-4">
                                  <textarea 
                                    rows={3}
                                    placeholder="Content Arabic"
                                    value={part.content.ar}
                                    onChange={e => {
                                      const newSections = [...(editingPaper.sections || [])];
                                      newSections[sIndex].parts[pIndex].content.ar = e.target.value;
                                      setEditingPaper({...editingPaper, sections: newSections});
                                    }}
                                    className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-primary outline-none text-sm"
                                    dir="rtl"
                                  />
                                  <textarea 
                                    rows={3}
                                    placeholder="Content English"
                                    value={part.content.en}
                                    onChange={e => {
                                      const newSections = [...(editingPaper.sections || [])];
                                      newSections[sIndex].parts[pIndex].content.en = e.target.value;
                                      setEditingPaper({...editingPaper, sections: newSections});
                                    }}
                                    className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-primary outline-none text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                          <button 
                            onClick={() => {
                              const newPart: PaperPart = {
                                id: `part-${Date.now()}`,
                                title: { ar: '', en: '' },
                                content: { ar: '', en: '' }
                              };
                              const newSections = [...(editingPaper.sections || [])];
                              newSections[sIndex].parts.push(newPart);
                              setEditingPaper({...editingPaper, sections: newSections});
                            }}
                            className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 text-sm font-bold"
                          >
                            <Plus size={16} /> أضف فقرة | Add Paragraph
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12 flex justify-end gap-4 border-t border-primary/10 pt-8">
                 <button 
                   onClick={() => setEditingPaper(null)}
                   className="px-8 py-4 rounded-2xl bg-slate-100 dark:bg-slate-900 font-bold hover:bg-slate-200 transition-all"
                 >
                   إلغاء | Cancel
                 </button>
                 <button 
                   onClick={savePaper}
                   className="px-12 py-4 rounded-2xl bg-primary text-white font-bold hover:brightness-110 transition-all shadow-lg flex items-center gap-2"
                 >
                   <Save size={20} />
                   حفظ التغييرات | Save Changes
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
