import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, ExternalLink, Download, FileText, List, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Lang } from '../translations';
import { Paper } from '../types/paper';

const PDF_SUFFIX = '_abdullah_hossam';

const superscriptMap: Record<string, string> = {
  '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5',
  '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁰': '0',
  '¹⁰': '10', '¹¹': '11', '¹²': '12', '¹³': '13', '¹⁴': '14',
  '¹⁵': '15', '¹⁶': '16', '¹⁷': '17', '¹⁸': '18', '¹⁹': '19', '²⁰': '20'
};

const FootnoteTooltip = ({ part, num, refText, isAr }: { part: string, num: string, refText?: string, isAr: boolean }) => (
  <span className="group relative inline-block">
    <sup className="text-primary font-bold cursor-help mx-0.5 px-0.5 hover:bg-primary/10 rounded transition-colors">
      {part}
    </sup>
    {refText && (
      <span className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-primary/20 text-[12px] leading-relaxed z-[60] text-slate-700 dark:text-slate-300 pointer-events-none">
        <span className="flex items-center gap-1.5 mb-1 text-primary font-bold">
          <Info size={12} />
          {isAr ? `مرجع [${num}]` : `Reference [${num}]`}
        </span>
        {refText}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white dark:border-t-slate-800" />
      </span>
    )}
  </span>
);

const FootnoteRenderer = ({ content, footnotes, isAr }: { content: string, footnotes: Record<string, string>, isAr: boolean }) => {
  const parts = content.split(/([¹²³⁴⁵⁶⁷⁸⁹⁰]+|¹⁰|¹¹|¹²|¹³|¹⁴|¹⁵|¹⁶|¹⁷|¹⁸|¹⁹|²⁰)/g);
  return (
    <>
      {parts.map((p, i) => {
        const num = superscriptMap[p];
        if (num) return <FootnoteTooltip key={i} part={p} num={num} refText={footnotes[num]} isAr={isAr} />;
        return p;
      })}
    </>
  );
};

// Sub-component to handle the reading experience Safely
const PaperReader = ({ paper, lang }: { paper: Paper, lang: Lang }) => {
  const [tab, setTab] = useState(paper.sections?.[0]?.id || '');
  const [showToc, setShowToc] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const isAr = lang === 'ar';

  const { scrollYProgress } = useScroll({ container: contentRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const footnotes = useMemo(() => {
    const dict: Record<string, string> = {};
    const refKeywords = ['References', 'المراجع', 'المصادر'];
    const allContent = paper.sections?.flatMap(s => s.parts).map(p => p.content).join('\n') || '';
    const lines = allContent.split('\n');
    let inRefs = false;
    lines.forEach(line => {
      const trimmed = line.trim();
      if (refKeywords.some(k => trimmed.includes(k))) inRefs = true;
      else if (inRefs) {
        const match = trimmed.match(/^(\d+)[.\-]\s+(.*)/);
        if (match) dict[match[1]] = match[2];
      }
    });
    return dict;
  }, [paper]);

  return (
    <>
      <motion.div className="h-1 bg-primary origin-left z-20 sticky top-0" style={{ scaleX }} />
      <div className="flex-1 flex overflow-hidden relative text-start">
        <AnimatePresence>
          {showToc && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 backdrop-blur-md overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                <h5 className="text-[10px] font-bold text-primary tracking-widest uppercase opacity-60">
                  {isAr ? 'فهرس المحتويات' : 'TABLE OF CONTENTS'}
                </h5>
                {paper.sections.map(section => {
                  const isSecAr = /[\u0600-\u06FF]/.test(section.title);
                  return (
                    <div key={section.id} className="space-y-2">
                      <h6 className={`text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ${isSecAr ? 'text-right' : 'text-left'}`}>
                        {section.title}
                      </h6>
                      <div className={`space-y-1 ps-2 ${isSecAr ? 'border-r-2 border-l-0 pe-2 ps-0' : 'border-l-2 border-r-0'} border-slate-200 dark:border-slate-800`}>
                        {section.parts.map(p => (
                          <button 
                            key={p.id} 
                            onClick={() => document.getElementById(`part-${p.id}`)?.scrollIntoView({ behavior: 'smooth' })} 
                            className={`w-full text-[12px] text-slate-500 hover:text-primary transition-colors block py-1 leading-snug ${/[\u0600-\u06FF]/.test(p.title) ? 'text-right' : 'text-left'}`}
                          >
                            {p.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={contentRef} className="flex-1 overflow-y-auto p-8 md:p-12 scroll-smooth">
           <div className="max-w-3xl mx-auto">
              <button 
                onClick={() => setShowToc(!showToc)} 
                className={`mb-10 flex items-center gap-2 text-[10px] font-bold px-4 py-2 rounded-full border border-primary/20 transition-all ${showToc ? 'bg-primary text-white' : 'text-primary hover:bg-primary/10'}`}
              >
                <List size={14} />
                {isAr ? 'فهرس المحتويات' : 'NAVIGATE SECTIONS'}
              </button>

              {paper.sections.map((section, sIdx) => {
                const secDir = /[\u0600-\u06FF]/.test(section.title) ? 'rtl' : 'ltr';
                return (
                  <div key={section.id} className="mb-20" style={{ direction: secDir }}>
                     {section.title && (
                       <div className="mb-12">
                          <span className={`text-[10px] font-bold text-primary/50 tracking-[0.4em] uppercase block mb-3 ${secDir === 'rtl' ? 'text-start' : 'text-left'}`}>
                            {isAr ? `القسم ${sIdx + 1}` : `SECTION ${sIdx + 1}`}
                          </span>
                          <h2 className={`text-2xl font-display font-bold text-slate-900 dark:text-white ${secDir === 'rtl' ? 'text-start' : 'text-left'}`}>
                            {section.title}
                          </h2>
                          <div className={`h-1 w-20 bg-primary mt-4 ${secDir === 'rtl' ? 'ms-auto' : ''}`} />
                       </div>
                     )}

                     {section.parts.map(p => {
                       const partDir = /[\u0600-\u06FF]/.test(p.content) ? 'rtl' : 'ltr';
                       return (
                         <div key={p.id} id={`part-${p.id}`} className="mb-16 last:mb-0 scroll-mt-20" style={{ direction: partDir }}>
                            {p.title && (
                              <h3 className={`text-primary font-bold mb-6 text-sm flex items-center gap-3 ${partDir === 'rtl' ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
                                <span className="w-8 h-[1px] bg-primary/30" />
                                {p.title}
                              </h3>
                            )}
                            <div className={`prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-[16px] font-serif ${partDir === 'rtl' ? 'text-right' : 'text-left'}`}>
                              <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  p: ({ children }) => <p className="mb-6 whitespace-pre-wrap">{React.Children.map(children, c => typeof c === 'string' ? <FootnoteRenderer content={c} footnotes={footnotes} isAr={isAr} /> : c)}</p>,
                                  li: ({ children }) => <li className="mb-2">{React.Children.map(children, c => typeof c === 'string' ? <FootnoteRenderer content={c} footnotes={footnotes} isAr={isAr} /> : c)}</li>
                                }}
                              >
                                {p.content}
                              </ReactMarkdown>
                            </div>
                         </div>
                       );
                     })}
                  </div>
                );
              })}
           </div>
        </div>
      </div>
    </>
  );
};

export default function PaperModal({ selected, setSelected, lang }: { selected: Paper | null, setSelected: (p: Paper | null) => void, lang: Lang }) {
  const isAr = lang === 'ar';

  // Sync document title
  useEffect(() => {
    if (selected) {
      const prevTitle = document.title;
      document.title = `${selected.title} | ${isAr ? 'عبدالله حسام' : 'Abdullah Hossam'}`;
      document.body.style.overflow = 'hidden';
      return () => { 
        document.title = prevTitle; 
        document.body.style.overflow = 'auto';
      };
    }
  }, [selected, isAr]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [setSelected]);

  return (
    <AnimatePresence>
      {selected && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
           onClick={() => setSelected(null)}
        >
          <motion.div
            layoutId={`paper-card-${selected.id}`}
            style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
            className={`bg-white dark:bg-background-dark rounded-3xl w-full overflow-hidden shadow-2xl flex flex-col relative max-w-5xl h-[90vh]`}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-slate-900 h-48 relative flex-shrink-0 flex items-end p-8 overflow-hidden">
               <motion.img 
                 layoutId={`paper-img-${selected.id}`}
                 src={selected.img} 
                 className="absolute inset-0 w-full h-full object-cover opacity-30 blur-[2px]"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
               
               <button onClick={() => setSelected(null)} className="absolute top-6 end-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-20">
                 <X size={20} />
               </button>

               <div className="relative z-10 w-full">
                  <p className="text-primary font-bold text-[10px] tracking-[0.3em] uppercase mb-2">{selected.cat}</p>
                  <motion.h2 
                    layoutId={`paper-title-${selected.id}`}
                    className="text-2xl md:text-3xl font-display font-bold text-white leading-tight"
                  >
                    {selected.title}
                  </motion.h2>
                  <div className="flex gap-4 mt-4">
                    {selected.pdfUrl && (
                      <a href={selected.pdfUrl} download className="text-[10px] font-bold text-white/60 hover:text-primary transition-all flex items-center gap-1">
                        <Download size={12} /> {isAr ? 'تحميل البحث' : 'DOWNLOAD PDF'}
                      </a>
                    )}
                    {selected.iframeUrl && (
                      <a href={selected.iframeUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-white/60 hover:text-primary transition-all flex items-center gap-1">
                        <ExternalLink size={12} /> {isAr ? 'فتح الرابط' : 'OPEN LINK'}
                      </a>
                    )}
                  </div>
               </div>
            </div>

            {/* Reading Experience */}
            {selected.iframeUrl ? (
              <iframe src={selected.iframeUrl} className="flex-1 w-full border-0" />
            ) : (
              <PaperReader paper={selected} lang={lang} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
