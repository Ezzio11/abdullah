import React, { useState, useEffect } from 'react';
import { Lang } from '../translations';
import papersData from '../data/papers.json';
import { motion } from 'motion/react';
import PaperModal from './PaperModal';
import { Paper } from '../types/paper';
import { localizePapers } from '../utils/paperUtils';
import { setGistCache, getGistCache } from '../utils/gistCache';

export default function Research({ lang }: { lang: Lang }) {
  const [selected, setSelected] = useState<Paper | null>(null);
  const [items, setItems] = useState<Paper[]>([]);
  const [filteredItems, setFilteredItems] = useState<Paper[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const isAr = lang === 'ar';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const gistId = localStorage.getItem('gist_id');
      
      // 1. Try Memory Cache
      const cached = getGistCache();
      if (cached) {
        const localized = localizePapers(cached, lang);
        setItems(localized);
        setFilteredItems(localized);
        setLoading(false);
        return;
      }

      let data = papersData;

      // 2. Try Gist
      if (gistId) {
        try {
          const resp = await fetch(`https://gist.githubusercontent.com/${gistId}/raw/papers.json?t=${Date.now()}`);
          if (resp.ok) {
            data = await resp.json();
            setGistCache(data);
          }
        } catch (e) {
          console.warn('Gist fetch error, falling back to local source:', e);
        }
      }
      
      const localized = localizePapers(data as any[], lang);
      setItems(localized);
      setFilteredItems(localized);
      setLoading(false);

      // Handle Deep Linking from URL
      const params = new URLSearchParams(window.location.search);
      const paperId = params.get('paper');
      if (paperId) {
        const found = localized.find(p => p.id === paperId);
        if (found) setSelected(found);
      }
    };

    fetchData();
  }, [lang]);

  // Handle URL Sync and SEO
  useEffect(() => {
    if (selected) {
      document.title = `${selected.title} | ${isAr ? 'عبدالله حسام' : 'Abdullah Hossam'}`;
      const url = new URL(window.location.href);
      if (url.searchParams.get('paper') !== selected.id) {
        url.searchParams.set('paper', selected.id);
        window.history.pushState({}, '', url);
      }
    } else {
      document.title = isAr ? 'الأبحاث والمنشورات | عبدالله حسام' : 'Research & Publications | Abdullah Hossam';
      const url = new URL(window.location.href);
      if (url.searchParams.has('paper')) {
        url.searchParams.delete('paper');
        window.history.pushState({}, '', url);
      }
    }
  }, [selected, isAr]);

  // Handle Browser Back/Forward Sync
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const paperId = params.get('paper');
      if (paperId && items.length > 0) {
        const found = items.find(p => p.id === paperId);
        if (found) setSelected(found);
        else setSelected(null);
      } else {
        setSelected(null);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [items]);

  // Handle Search Filtering (Truly Bilingual)
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter(p => {
      const matchLocal = 
        p.title.toLowerCase().includes(query) ||
        p.desc.toLowerCase().includes(query) ||
        p.cat.toLowerCase().includes(query);
      
      // Also match against the alternative language ID or year
      const matchMeta = (p.id && p.id.toLowerCase().includes(query)) || (p.year && p.year.includes(query));
      
      return matchLocal || matchMeta;
    });
    setFilteredItems(filtered);
  }, [searchQuery, items]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex-1">
          <h1 className="font-serif font-black text-5xl lg:text-6xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
            {isAr ? 'الأبحاث والمنشورات' : 'Research & Publications'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            {isAr ? 'اضغط على أي بحث لقراءته كاملاً.' : 'Click any paper to read it in full.'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80 group">
          <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'ابحث عن عنوان أو موضوع...' : 'Search titles or topics...'}
            className="w-full h-14 ps-11 pe-4 text-sm bg-white dark:bg-card-dark border-2 border-slate-100 dark:border-slate-800 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-900 dark:text-slate-50 placeholder:text-slate-400"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-card-dark rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 h-[400px] animate-pulse">
              <div className="h-44 bg-slate-200 dark:bg-slate-800" />
              <div className="p-6 space-y-4">
                <div className="h-2 w-1/4 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-12 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50">
                  <div className="h-2 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Grid */
        /* Grid with AnimatePresence */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
          {filteredItems.length > 0 ? (
            filteredItems.map((p, i) => (
              <motion.article
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                layoutId={`paper-card-${p.id}`}
                onClick={() => setSelected(p)}
                className="group flex flex-col bg-white dark:bg-card-dark rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 hover:border-primary/50 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-primary/10"
              >
              {/* Image */}
              <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <motion.img
                  layoutId={`paper-img-${p.id}`}
                  src={p.img} alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <motion.span 
                  layoutId={`paper-year-${p.id}`}
                  className="absolute bottom-3 start-3 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-md"
                >
                  {p.year}
                </motion.span>
              </div>

              {/* Body */}
              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-3 mb-3 text-start">
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                  <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">{p.lang}</span>
                </div>
                <p className="text-[11px] font-bold text-primary tracking-widest uppercase mb-3 text-start">{p.cat}</p>
                <h3 className="font-serif text-[15px] font-bold text-slate-900 dark:text-slate-50 mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-3 flex-1 text-start">
                  {p.title}
                </h3>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-5 text-start">
                  {p.desc}
                </p>
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 text-start">
                    <span className="text-[11px] font-bold text-primary tracking-widest uppercase transition-all group-hover:tracking-[0.2em]">
                      {p.cta}
                    </span>
                  </div>
                </div>
              </motion.article>
          ))
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full py-20 text-center"
          >
             <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
             </div>
             <p className="text-slate-500 dark:text-slate-400 font-medium">
               {isAr ? 'لم يتم العثور على نتائج للبحث...' : 'No matching research found...'}
             </p>
          </motion.div>
        )}
        </div>
      )}

      <PaperModal selected={selected} setSelected={setSelected} lang={lang} />
    </div>
  );
}
