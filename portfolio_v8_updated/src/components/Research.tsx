import React, { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Lang } from '../translations';
import researchData from '../data/researchContent.json';

interface Part { id: string; title: string; content: string }
interface Section { id: string; title: string; parts: Part[] }
interface Tab { id: string; label: string; content: string; titleEN?: string; titleAR?: string }
interface Paper {
  id: string; title: string; cat: string; lang: 'ENGLISH' | 'ARABIC';
  year: string; desc: string; img: string; cta: string;
  meta: string; tabs: Tab[];
  sections?: Section[];
  iframeUrl?: string;
}

const papers = (lang: Lang): Paper[] => {
  const ar = lang === 'ar';
  const pasteMsg = ar ? '[يرجى لصق النص الكامل للبحث هنا من ملف الوورد الأصلي]' : '[Please paste the full paper text here from the original Word file]';

  const getSections = (id: string): Section[] | undefined => {
    const data = (researchData as any)[id];
    return data && data.sections ? data.sections : undefined;
  };

  return [
    {
      id: 'pdf',
      title: ar ? 'عوائق التواصل وتأثيرها في بناء العلاقات الدولية' : 'Communication Barriers & Their Impact on International Relations',
      cat: ar ? 'العلاقات الدولية' : 'INTERNATIONAL RELATIONS',
      lang: 'ARABIC', year: '2025',
      desc: ar
        ? 'دراسة تحليلية منشورة على ResearchGate تكشف كيف تؤثر العوائق اللغوية والنفسية والتقنية على مسار العلاقات الدولية عبر نماذج تاريخية متنوعة.'
        : 'Published analytical study on ResearchGate revealing how linguistic, psychological, and technical barriers affect international relations through diverse historical cases.',
      img: '/communication_barriers.png',
      cta: ar ? 'اقرأ البحث ←' : 'READ PAPER →',
      meta: ar ? 'دراسة تحليلية · ResearchGate 2025 · DOI: 10.13140/RG.2.2.31855.34728' : 'Analytical Study · ResearchGate 2025 · DOI: 10.13140/RG.2.2.31855.34728',
      sections: getSections('pdf'),
      tabs: [],
    },
    {
      id: 'ukraine',
      title: ar ? 'النظام السياسي الأوكراني: المؤسسات والانتخابات وتأثير الحرب' : 'Ukraine Political System: Institutions, Elections & the Impact of War',
      cat: ar ? 'السياسة المقارنة · العلاقات الدولية' : 'COMPARATIVE POLITICS · IR',
      lang: 'ENGLISH', year: '2024',
      desc: ar
        ? 'تحليل شامل للنظام شبه الرئاسي الأوكراني، المؤسسات السياسية، المشهد الحزبي، المجتمع المدني، والتأثيرات العميقة للحرب الروسية على الشأن الداخلي الأوكراني.'
        : 'A comprehensive analysis of Ukraine\'s semi-presidential system, political institutions, party landscape, civil society, and the profound effects of the Russian war on Ukrainian internal affairs.',
      img: '/ukraine_politics.png',
      cta: ar ? 'اقرأ البحث ←' : 'READ PAPER →',
      meta: ar ? 'بحث أكاديمي · قسم العلوم السياسية، جامعة القاهرة' : 'Academic Research · Dept. of Political Science, Cairo University',
      sections: getSections('ukraine'),
      tabs: [],
    },
    {
      id: 'plato-mawardi',
      title: ar ? 'المدينة الفاضلة مقابل الدولة الرشيدة: دراسة مقارنة بين أفلاطون والماوردي' : 'The Ideal City vs. The Rational State: A Comparative Study of Plato & Al-Mawardi',
      cat: ar ? 'الفكر السياسي · الفلسفة' : 'POLITICAL THOUGHT · PHILOSOPHY',
      lang: 'ARABIC', year: '2024',
      desc: ar
        ? 'دراسة مقارنة تتناول مفهوم العدالة، ونظام الحكم المثالي، والنظام الاقتصادي عند أفلاطون في جمهوريته والماوردي في أحكامه السلطانية، مع تقييم قابلية تطبيق أفكارهم في السياق المعاصر.'
        : 'A comparative study examining justice, ideal governance, and economic systems in Plato\'s Republic and Al-Mawardi\'s Al-Ahkam al-Sultaniyya, evaluating their applicability in contemporary context.',
      img: '/plato_mawardi.png',
      cta: ar ? 'اقرأ البحث ←' : 'READ PAPER →',
      meta: ar ? 'بحث أكاديمي · 5050 كلمة · قسم العلوم السياسية، جامعة القاهرة' : 'Academic Research · 5050 words · Dept. of Political Science, Cairo University',
      sections: getSections('plato-mawardi'),
      tabs: [],
    },
    {
      id: 'public-opinion',
      title: ar ? 'تأثير وسائل التواصل الاجتماعي في تشكيل الرأي العام: دراسة حالة القضية الفلسطينية' : 'Social Media\'s Impact on Public Opinion: A Case Study of the Palestinian Cause',
      cat: ar ? 'الإعلام السياسي · الرأي العام' : 'POLITICAL MEDIA · PUBLIC OPINION',
      lang: 'ARABIC', year: '2024',
      desc: ar
        ? 'دراسة ميدانية كمية ونوعية على عينة من 42 طالباً في جامعة القاهرة تكشف كيف أعادت المنصات الرقمية هندسة المجال العام وأثّرت على تشكيل الرأي العام السياسي تجاه القضية الفلسطينية.'
        : 'A quantitative and qualitative field study on 42 Cairo University students revealing how digital platforms re-engineered the public sphere and shaped political public opinion toward the Palestinian cause.',
      img: '/social_media_opinion.png',
      cta: ar ? 'اقرأ البحث ←' : 'READ PAPER →',
      meta: ar ? 'دراسة حالة · قسم العلوم السياسية، جامعة القاهرة · 42 مشارك' : 'Case Study · Dept. of Political Science, Cairo University · 42 participants',
      sections: getSections('public-opinion'),
      tabs: [],
    },
    {
      id: 'g-project',
      title: ar ? 'نقد رؤى السلام الليبرالي: دراسة تطبيقية على الحالة الفلسطينية' : 'Critiquing Liberal Peace Visions: An Applied Study on the Palestinian Case',
      cat: ar ? 'دراسات السلام والصراع · رسالة تخرج' : 'PEACE STUDIES · DISSERTATION',
      lang: 'ARABIC', year: '2026',
      desc: ar
        ? 'رسالة تخرج تحلل أطر السلام السائدة (الواقعية، الليبرالية، الماركسية) نقدياً من منظور ما بعد الاستعمار، وتستخدم القضية الفلسطينية نموذجاً بنيوياً يكشف حدود الليبرالية في بناء السلام المستدام.'
        : 'Graduation dissertation critically analysing dominant peace frameworks (Realism, Liberalism, Marxism) through a post-colonial lens, using the Palestinian question as a structural case exposing the limits of liberal peacebuilding.',
      img: '/palestine_peace.png',
      cta: ar ? 'اقرأ الرسالة ←' : 'READ DISSERTATION →',
      meta: ar ? 'رسالة تخرج · قسم العلوم السياسية، جامعة القاهرة · 2025–2026' : 'Graduation Dissertation · Dept. of Political Science, Cairo University · 2025–2026',
      sections: getSections('g-project'),
      tabs: [],
    },
    {
      id: 'qualityland',
      title: ar ? 'الكمال الزائف: تحذيرات سياسية من QualityLand' : 'False Perfection: Political Warnings from QualityLand',
      cat: ar ? 'الفكر السياسيي' : 'POLITICAL THOUGHT ',
      lang: 'ENGLISH', year: '2024',
      desc: ar
        ? 'بحث أكاديمي يستخدم رواية QualityLand للكاتب الألماني مارك-أوفه كلينغ إطاراً نقدياً لتحليل الأنظمة السياسية الخوارزمية، والحوكمة الرقمية، وما تُخفيه وعود الكمال التكنوقراطي من مخاطر.'
        : 'An academic research using Marc-Uwe Kling\'s QualityLand as a critical lens to analyze algorithmic political systems, digital governance, and the dangers concealed within technocratic promises of perfection.',
      img: '/qualityland_robots.png',
      cta: ar ? 'اقرأ البحث ←' : 'READ PAPER →',
      meta: ar ? 'بحث أكاديمي · موقع تفاعلي كامل · قسم العلوم السياسية، جامعة القاهرة' : 'Academic Research · Full Interactive Website · Dept. of Political Science, Cairo University',
      iframeUrl: 'https://69c59936a363e16ee4c97852--extraordinary-melomakarona-890852.netlify.app/',
      tabs: [],
    },
    {
      id: 'illusion',
      title: ar ? 'وهم التفوق' : 'The Illusion of Excellence',
      cat: ar ? 'مقال رأي · الحياة الأكاديمية' : 'OPINION ARTICLE · ACADEMIC LIFE',
      lang: 'ARABIC', year: '2024',
      desc: ar
        ? 'مقال نقدي يتناول مظاهر الخلل في حفل تكريم "المتفوقين" بكلية الاقتصاد والعلوم السياسية — من غياب معايير واضحة للتكريم إلى التناقض بين تكريم الأنشطة والتفوق الأكاديمي، وصولاً إلى التساؤل عن مفهوم التفوق الحقيقي.'
        : 'A critical article examining the flaws in an "Excellence Day" ceremony at the Faculty of Economics and Political Science — from absent clear criteria to the contradiction between honoring activities vs. academic achievement, questioning what true excellence means.',
      img: '/excellence_illusion.png',
      cta: ar ? 'اقرأ المقال ←' : 'READ ARTICLE →',
      meta: ar ? 'مقال رأي · كتابة حرة · 2024' : 'Opinion Article · Free Writing · 2024',
      sections: getSections('illusion'),
      tabs: [],
    },
  ];
};

export default function Research({ lang }: { lang: Lang }) {
  const [selected, setSelected] = useState<Paper | null>(null);
  const [tab, setTab] = useState('intro');
  const items = papers(lang);
  const isAr = lang === 'ar';

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-14">
        <h1 className="font-serif font-black text-5xl lg:text-6xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          {isAr ? 'الأبحاث والمنشورات' : 'Research & Publications'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          {isAr ? 'اضغط على أي بحث لقراءته كاملاً.' : 'Click any paper to read it in full.'}
        </p>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((p, i) => (
          <article
            key={i}
            onClick={() => {
              setSelected(p);
              const firstTabId = p.sections && p.sections.length > 0 ? p.sections[0].id : (p.tabs[0]?.id ?? '');
              setTab(firstTabId);
            }}
            className="group flex flex-col bg-white dark:bg-card-dark rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 hover:border-primary/50 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-primary/10"
          >
            {/* Image */}
            <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={p.img} alt={p.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <span className="absolute bottom-3 start-3 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-md">
                {p.year}
              </span>
              {p.iframeUrl && (
                <span className="absolute bottom-3 end-3 bg-black/40 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm">
                  <ExternalLink size={9} /> WEB
                </span>
              )}
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">{p.lang}</span>
              </div>
              <p className="text-[11px] font-bold text-primary tracking-widest uppercase mb-3">{p.cat}</p>
              <h3 className="font-serif text-[15px] font-bold text-slate-900 dark:text-slate-50 mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-3 flex-1">
                {p.title}
              </h3>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-5">
                {p.desc}
              </p>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <span className="text-[11px] font-bold text-primary tracking-widest uppercase transition-all group-hover:tracking-[0.2em]">
                  {p.cta}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`bg-white dark:bg-background-dark rounded-2xl w-full overflow-hidden shadow-2xl flex flex-col ${selected.iframeUrl ? 'max-w-5xl h-[90vh]' : 'max-w-3xl max-h-[88vh]'
                }`}
              style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-slate-900 p-6 relative flex-shrink-0">
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 end-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
                >
                  <X size={15} />
                </button>
                <p className="text-[10px] font-bold text-primary tracking-widest uppercase mb-3">{selected.cat}</p>
                <h2 className="font-serif text-xl font-bold text-white leading-snug pr-8">{selected.title}</h2>
                <p className="text-slate-400 text-[11px] mt-2 leading-relaxed">{selected.meta}</p>
                {selected.iframeUrl && (
                  <a
                    href={selected.iframeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 mt-3 text-[11px] font-bold text-primary/80 hover:text-primary transition-colors"
                  >
                    <ExternalLink size={11} />
                    {isAr ? 'فتح في نافذة جديدة' : 'Open in new tab'}
                  </a>
                )}
              </div>

              {/* iframe variant */}
              {selected.iframeUrl ? (
                <div className="flex-1 overflow-hidden">
                  <iframe
                    src={selected.iframeUrl}
                    className="w-full h-full border-0"
                    title={selected.title}
                    allow="fullscreen"
                  />
                </div>
              ) : (
                <>
                  {/* Tabs */}
                  <div className="bg-slate-800 flex overflow-x-auto border-b border-slate-700 flex-shrink-0 scrollbar-hide">
                    {selected.sections ? (
                      selected.sections.map(s => (
                        <button
                          key={s.id}
                          onClick={() => setTab(s.id)}
                          className={`px-5 py-3 text-[10px] font-bold tracking-[0.12em] uppercase whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${tab === s.id ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-200'
                            }`}
                        >
                          {s.title}
                        </button>
                      ))
                    ) : (
                      selected.tabs.map(t => (
                        <button
                          key={t.id}
                          onClick={() => setTab(t.id)}
                          className={`px-5 py-3 text-[10px] font-bold tracking-[0.12em] uppercase whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${tab === t.id ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-200'
                            }`}
                        >
                          {t.label}
                        </button>
                      ))
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-7 min-h-[40vh]">
                    {selected.sections ? (
                      <div className="space-y-8">
                        {selected.sections.find(s => s.id === tab)?.parts.map(p => (
                          <div key={p.id}>
                            <h4 className="text-primary font-bold text-sm mb-4 uppercase tracking-[0.2em] border-b border-primary/20 pb-2 inline-block">
                              {p.title}
                            </h4>
                            <p className="text-slate-700 dark:text-slate-300 leading-[1.9] text-[15px] whitespace-pre-line">
                              {p.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-700 dark:text-slate-300 leading-[1.9] text-[15px] whitespace-pre-line">
                        {selected.tabs.find(t => t.id === tab)?.content}
                      </p>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
