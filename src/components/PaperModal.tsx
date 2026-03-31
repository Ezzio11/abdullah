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

const FootnoteSheet = ({ note, onClose, isAr }: { note: { num: string, text: string } | null, onClose: () => void, isAr: boolean }) => (
  <AnimatePresence>
    {note && (
      <>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] md:hidden"
        />
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-[2rem] shadow-2xl z-[80] p-8 md:hidden border-t border-primary/20"
        >
          <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6" />
          <div className="flex items-center gap-3 mb-4 text-primary font-bold text-sm">
            <Info size={16} />
            <span>{isAr ? `مرجع [${note.num}]` : `Reference [${note.num}]`}</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm font-serif">
            {note.text}
          </p>
          <button 
            onClick={onClose}
            className="w-full mt-8 py-4 bg-primary/10 text-primary font-bold rounded-2xl hover:bg-primary/20 transition-all"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const ImageLightbox = ({ src, alt, onClose, isAr }: { src: string | null, alt: string, onClose: () => void, isAr: boolean }) => (
  <AnimatePresence>
    {src && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-4 md:p-12"
        onClick={onClose}
      >
        <button onClick={onClose} className="absolute top-6 end-6 text-white/60 hover:text-white transition-all">
          <X size={32} />
        </button>
        <motion.img 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          src={src} 
          alt={alt}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          onClick={e => e.stopPropagation()}
        />
        <p className="mt-8 text-white/80 font-medium text-center max-w-2xl text-sm italic">
          {alt}
        </p>
      </motion.div>
    )}
  </AnimatePresence>
);

// Sub-component to handle the reading experience Safely
const PaperReader = ({ paper, lang }: { paper: Paper, lang: Lang }) => {
  const [showToc, setShowToc] = useState(false);
  const [selectedFootnote, setSelectedFootnote] = useState<{ num: string, text: string } | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ src: string, alt: string } | null>(null);
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

  const FootnoteTrigger = ({ part, num, refText, isAr }: { part: string, num: string, refText?: string, isAr: boolean }) => (
    <span className="group relative inline-block">
      <sup 
        onClick={(e) => {
          if (window.innerWidth < 768 && refText) {
            e.stopPropagation();
            setSelectedFootnote({ num, text: refText });
          }
        }}
        className="text-primary font-bold cursor-help mx-0.5 px-0.5 hover:bg-primary/10 rounded transition-colors"
      >
        {part}
      </sup>
      {refText && (
        <span className="invisible md:group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-primary/20 text-[12px] leading-relaxed z-[60] text-slate-700 dark:text-slate-300 pointer-events-none">
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
          if (num) return <FootnoteTrigger key={i} part={p} num={num} refText={footnotes[num]} isAr={isAr} />;
          return p;
        })}
      </>
    );
  };

  return (
    <>
      <motion.div className="h-1 bg-primary origin-left z-20 sticky top-0" style={{ scaleX }} />
      <div className="flex-1 flex overflow-hidden relative text-start">
        <AnimatePresence>
          {showToc && (
            <motion.div
              initial={{ x: isAr ? 300 : -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isAr ? 300 : -300, opacity: 0 }}
              className="absolute inset-0 md:relative md:inset-auto z-40 w-full md:w-[280px] border-r border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl overflow-y-auto"
            >
              <div className="p-8 md:p-6 space-y-6">
                <div className="flex items-center justify-between md:hidden mb-4">
                  <h5 className="text-[10px] font-bold text-primary tracking-widest uppercase opacity-60">
                    {isAr ? 'فهرس المحتويات' : 'TABLE OF CONTENTS'}
                  </h5>
                  <button onClick={() => setShowToc(false)} className="p-2 -me-2 text-slate-400 hover:text-primary transition-colors">
                    <X size={20} />
                  </button>
                </div>
                
                <h5 className="hidden md:block text-[10px] font-bold text-primary tracking-widest uppercase opacity-60">
                  {isAr ? 'فهرس المحتويات' : 'TABLE OF CONTENTS'}
                </h5>

                {paper.sections.map(section => {
                  const isSecAr = /[\u0600-\u06FF]/.test(section.title);
                  return (
                    <div key={section.id} className="space-y-3 md:space-y-2">
                      <h6 className={`text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ${isSecAr ? 'text-right' : 'text-left'}`}>
                        {section.title}
                      </h6>
                      <div className={`space-y-1 ps-2 ${isSecAr ? 'border-r-2 border-l-0 pe-3 ps-0' : 'border-l-2 border-r-0'} border-slate-200 dark:border-slate-800`}>
                        {section.parts.map(p => (
                          <button 
                            key={p.id} 
                            onClick={() => {
                              document.getElementById(`part-${p.id}`)?.scrollIntoView({ behavior: 'smooth' });
                              if (window.innerWidth < 768) setShowToc(false);
                            }} 
                            className={`w-full text-sm md:text-[12px] text-slate-500 hover:text-primary transition-colors block py-2 md:py-1 leading-snug ${/[\u0600-\u06FF]/.test(p.title) ? 'text-right' : 'text-left'}`}
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
        
        <div ref={contentRef} className="flex-1 overflow-y-auto p-5 md:p-12 scroll-smooth">
           <div className="max-w-3xl mx-auto">
              <div className="sticky top-0 md:-top-6 z-30 mb-8 md:mb-12 py-2">
                 <button 
                   onClick={() => setShowToc(!showToc)} 
                   className={`flex items-center gap-2 text-[10px] font-bold px-4 py-2 rounded-full border border-primary/20 backdrop-blur-md transition-all shadow-sm ${showToc ? 'bg-primary text-white' : 'bg-white/80 dark:bg-slate-900/80 text-primary hover:bg-primary/10'}`}
                 >
                   <List size={14} />
                   {isAr ? 'فهرس المحتويات' : 'NAVIGATE SECTIONS'}
                 </button>
              </div>

              {paper.sections.map((section, sIdx) => {
                const secDir = /[\u0600-\u06FF]/.test(section.title) ? 'rtl' : 'ltr';
                return (
                  <div key={section.id} className="mb-16 md:mb-20" style={{ direction: secDir }}>
                     {section.title && (
                       <div className="mb-8 md:mb-12">
                          <span className={`text-[9px] md:text-[10px] font-bold text-primary/50 tracking-[0.4em] uppercase block mb-3 ${secDir === 'rtl' ? 'text-start' : 'text-left'}`}>
                            {isAr ? `القسم ${sIdx + 1}` : `SECTION ${sIdx + 1}`}
                          </span>
                          <h2 className={`text-xl md:text-2xl font-display font-bold text-slate-900 dark:text-white ${secDir === 'rtl' ? 'text-start' : 'text-left'}`}>
                            {section.title}
                          </h2>
                          <div className={`h-1 w-16 md:w-20 bg-primary mt-4 ${secDir === 'rtl' ? 'ms-auto' : ''}`} />
                       </div>
                     )}

                     {section.parts.map(p => {
                       const partDir = /[\u0600-\u06FF]/.test(p.content) ? 'rtl' : 'ltr';
                       return (
                         <div key={p.id} id={`part-${p.id}`} className="mb-12 md:mb-16 last:mb-0 scroll-mt-20" style={{ direction: partDir }}>
                            {p.title && (
                              <h3 className={`text-primary font-bold mb-5 md:mb-6 text-[13px] md:text-sm flex items-center gap-3 ${partDir === 'rtl' ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
                                <span className="w-6 md:w-8 h-[1px] bg-primary/30" />
                                {p.title}
                              </h3>
                            )}
                            <div className={`prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-base md:text-[16px] font-serif ${partDir === 'rtl' ? 'text-right' : 'text-left'}`}>
                              <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  p: ({ children }) => <p className="mb-6 whitespace-pre-wrap">{React.Children.map(children, c => typeof c === 'string' ? <FootnoteRenderer content={c} footnotes={footnotes} isAr={isAr} /> : c)}</p>,
                                  li: ({ children }) => <li className="mb-2">{React.Children.map(children, c => typeof c === 'string' ? <FootnoteRenderer content={c} footnotes={footnotes} isAr={isAr} /> : c)}</li>,
                                  img: ({ src, alt }) => (
                                    <div className="my-10 text-start group">
                                      <div 
                                        onClick={() => src && setSelectedImage({ src, alt: alt || '' })}
                                        className="relative rounded-2xl overflow-hidden cursor-pointer bg-slate-100 dark:bg-slate-800"
                                      >
                                        <img src={src} alt={alt} className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all" />
                                        <div className="absolute top-4 end-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                          <ExternalLink size={16} />
                                        </div>
                                      </div>
                                      {alt && <p className="mt-4 text-[12px] italic text-slate-400 dark:text-slate-500 text-center">{alt}</p>}
                                    </div>
                                  )
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
      
      <FootnoteSheet 
        note={selectedFootnote} 
        onClose={() => setSelectedFootnote(null)} 
        isAr={isAr} 
      />
      <ImageLightbox 
        src={selectedImage?.src || null} 
        alt={selectedImage?.alt || ''} 
        onClose={() => setSelectedImage(null)} 
        isAr={isAr} 
      />
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
           className="fixed inset-0 z-50 flex items-center justify-center md:p-4 bg-black/95 backdrop-blur-xl"
           onClick={() => setSelected(null)}
        >
          <motion.div
            layoutId={`paper-card-${selected.id}`}
            style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
            className={`bg-white dark:bg-background-dark md:rounded-3xl w-full h-full md:h-[90vh] overflow-hidden shadow-2xl flex flex-col relative max-w-5xl`}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-slate-900 h-40 md:h-48 relative flex-shrink-0 flex items-end p-6 md:p-8 overflow-hidden">
               <motion.img 
                 layoutId={`paper-img-${selected.id}`}
                 src={selected.img} 
                 className="absolute inset-0 w-full h-full object-cover opacity-30 blur-[1px]"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
               
               <button onClick={() => setSelected(null)} className="absolute top-4 md:top-6 end-4 md:end-6 w-9 md:w-10 h-9 md:h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-20">
                 <X size={18} />
               </button>

               <div className="relative z-10 w-full">
                  <p className="text-primary font-bold text-[9px] md:text-[10px] tracking-[0.3em] uppercase mb-1.5 md:mb-2">{selected.cat}</p>
                  <motion.h2 
                    layoutId={`paper-title-${selected.id}`}
                    className="text-xl md:text-3xl font-display font-bold text-white leading-tight"
                  >
                    {selected.title}
                  </motion.h2>
                  <div className="flex gap-4 mt-3 md:mt-4">
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
