import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, ExternalLink, BookOpen, Globe, FlaskConical, BrainCircuit } from 'lucide-react';
import { t, Lang } from '../translations';
import { motion } from 'motion/react';
import papersData from '../data/papers.json';
import PaperModal from './PaperModal';
import { Paper } from '../types/paper';
import { localizePapers } from '../utils/paperUtils';

const PDF_SUFFIX = '_abdullah_hossam';

/* ── Social icon SVGs (raw, no external font needed) ── */
const GmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

import { getGistCache, setGistCache } from '../utils/gistCache';

export default function Home({ setActiveTab, lang }: { setActiveTab: (tab: string) => void; lang: Lang }) {
  const [papers, setPapers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedPaper, setSelectedPaper] = React.useState<Paper | null>(null);
  const tr = t[lang];
  const h = tr.home;
  const isRTL = lang === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  // Fetch data from Gist or fallback
  React.useEffect(() => {
    const loadData = async () => {
      const gistId = localStorage.getItem('gist_id');
      
      // 1. Try Memory Cache
      const cached = getGistCache();
      if (cached) {
        setPapers(cached);
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
      
      setPapers(data as any[]);
      setLoading(false);
    };
    loadData();
  }, []);

  const researchCards = papers
    .filter(p => p.featured)
    .slice(0, 3)
    .map(p => ({
      id: p.id,
      title: p.title[lang] || p.title.ar,
      desc: p.desc[lang] || p.desc.ar,
      tag: p.cat[lang] || p.cat.ar,
      img: p.img,
      icon: p.id === 'g-project' ? <FlaskConical size={24} /> : p.id === 'pdf' ? <Globe size={24} /> : <BookOpen size={24} />
    }));

  const skills = lang === 'ar'
    ? [
      'دراسات السلام والصراع النقدية',
      'التحليل الجيوسياسي والاستراتيجي',
      'الكتابة الأكاديمية (عربي / إنجليزي)',
      'مناهج البحث النوعي',
      'الفلسفة السياسية المقارنة',
      'اللغة الإنجليزية (C1)',
      'الأتمتة وإدارة سير العمل',
      'تطوير الويب (React / TypeScript)',
    ]
    : [
      'Critical Peace & Conflict Studies',
      'Geopolitical & Strategic Analysis',
      'Academic Writing (Arabic / English)',
      'Qualitative Research Methods',
      'Comparative Political Philosophy',
      'Post-Colonial IR Frameworks',
      'English Language (C1)',
      'Workflow Automation (Apps Script)',
    ];

  return (
    <>
      {/* ── Editorial Spotlight (Merged Hero & About) ── */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 border-b border-primary/10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 lg:translate-x-1/3 opacity-[0.02] dark:opacity-[0.04] pointer-events-none">
            <motion.div
              className="bg-[#1a2e22] dark:bg-white w-[600px] md:w-[1200px] aspect-square"
              style={{
                maskImage: 'url(/Logo.svg)',
                WebkitMaskImage: 'url(/Logo.svg)',
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
              }}
              animate={{ rotate: 15 }}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Main Column */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-start text-start">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                 <h1 className="font-serif font-black text-5xl md:text-7xl lg:text-8xl text-slate-900 dark:text-slate-50 leading-none mb-6">
                   {isRTL ? 'عبدالله' : 'Abdullah'} <span className="text-primary">{isRTL ? 'حسام' : 'Hossam'}</span>
                 </h1>
                 <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-serif font-medium leading-relaxed max-w-3xl border-s-4 border-primary/30 ps-6">
                   {h.aboutP1}
                 </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-6 text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-2xl mb-12"
              >
                <p>{h.aboutP2}</p>
                <p className="text-sm italic opacity-80">{h.heroBio}</p>
              </motion.div>

              {/* CTAs & Socials */}
              <div className="flex flex-col gap-8 w-full mt-auto">
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => setActiveTab('research')}
                    className="px-8 py-4 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all text-sm"
                  >
                    {h.browsePapers} <ArrowIcon size={18} />
                  </button>
                  <a
                    href="/Abdullah_Hossam_CV_2026.pdf"
                    download={`Abdullah_Hossam_CV_2026${PDF_SUFFIX}.pdf`}
                    className="px-8 py-4 bg-transparent border-2 border-primary/30 text-primary dark:text-primary-light rounded-xl font-bold hover:bg-primary/5 transition-all text-sm flex items-center justify-center"
                  >
                    {h.downloadCV}
                  </a>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-px w-8 bg-primary/20" />
                  <a
                    href="mailto:Abdullah.hossam2022@feps.edu.eg"
                    className="p-3 rounded-xl border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all scale-90"
                    aria-label="Gmail"
                  >
                    <GmailIcon />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/abdullah-hossam-abdullah"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all scale-90"
                    aria-label="LinkedIn"
                  >
                    <LinkedInIcon />
                  </a>
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-10 lg:pt-8">
              {/* Certifications Card */}
              <div className="p-8 rounded-2xl bg-white dark:bg-card-dark border border-primary/10 shadow-sm border-s-8 border-s-primary">
                <h3 className="font-serif text-xl font-bold mb-6 text-slate-900 dark:text-slate-50">{h.aboutTitle}</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="text-primary shrink-0 mt-1" size={20} />
                    <div className="text-start">
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-tight mb-1">{h.cert1Title}</p>
                      <p className="text-xs text-slate-400">{h.cert1Sub}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="text-primary shrink-0 mt-1" size={20} />
                    <div className="text-start">
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-tight mb-1">{h.cert2Title}</p>
                      <p className="text-xs text-slate-400">{h.cert2Sub}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Cloud */}
              <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                <h3 className="font-serif text-lg font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                  <BrainCircuit className="text-primary" size={22} />
                  {h.skillsTitle}
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {skills.map(skill => (
                    <span
                      key={skill}
                      className="px-3.5 py-1.5 rounded-lg border border-primary/10 bg-white dark:bg-card-dark text-slate-600 dark:text-slate-300 text-[11px] font-bold hover:border-primary/40 transition-all"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Research Grid ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="font-serif text-4xl font-bold mb-4 text-slate-900 dark:text-slate-50">{h.researchTitle}</h2>
              <p className="text-slate-600 dark:text-slate-400">{h.researchSubtitle}</p>
            </div>
            <button
              onClick={() => setActiveTab('research')}
              className="text-primary font-bold flex items-center gap-2 hover:underline shrink-0"
            >
              {h.viewAll} <ExternalLink size={18} />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-80 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              ))
            ) : (
              researchCards.map((card, i) => (
                <div
                  key={i}
                  onClick={() => {
                    const fullPaper = papers.find(p => p.id === card.id);
                    if (fullPaper) {
                      const localized = localizePapers([fullPaper], lang)[0];
                      setSelectedPaper(localized);
                    }
                  }}
                  className="cursor-pointer bg-white dark:bg-card-dark rounded-xl overflow-hidden border border-primary/10 flex flex-col group shadow-sm"
                  style={{
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(0,0,0,0.12)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary, #16a34a)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '';
                    (e.currentTarget as HTMLElement).style.borderColor = '';
                  }}
                >
                  {/* Card image */}
                  <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={card.img}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <span className="absolute bottom-3 start-3 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
                      {card.tag}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="flex flex-col flex-1 p-7">
                    <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 text-primary w-fit group-hover:scale-110 transition-transform">
                      {card.icon}
                    </div>
                    <h3 className="font-serif text-lg font-bold mb-3 group-hover:text-primary transition-colors leading-snug flex-1">
                      {card.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {card.desc}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      <PaperModal selected={selectedPaper} setSelected={setSelectedPaper} lang={lang} />
    </>
  );
}
