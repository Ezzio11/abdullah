import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, ExternalLink, BookOpen, Globe, FlaskConical, Mail, Linkedin } from 'lucide-react';
import { t, Lang } from '../translations';
import { LogoCanvas } from './LogoCanvas';

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

export default function Home({ setActiveTab, lang }: { setActiveTab: (tab: string) => void; lang: Lang }) {
  const tr = t[lang];
  const h = tr.home;
  const isRTL = lang === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const researchCards = [
    {
      icon: <FlaskConical size={24} />,
      title: h.r1Title,
      desc: h.r1Desc,
      tag: h.caseStudy,
      img: '/palestine_peace.png',
    },
    {
      icon: <Globe size={24} />,
      title: h.r2Title,
      desc: h.r2Desc,
      tag: h.academicResearch,
      img: '/communication_barriers.png',
    },
    {
      icon: <BookOpen size={24} />,
      title: h.r3Title,
      desc: h.r3Desc,
      tag: h.academicResearch,
      img: '/plato_mawardi.png',
    },
  ];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-28 lg:pb-36 text-center">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col items-center">
          <h1
            className="font-serif font-black leading-tight mb-6 text-slate-900 dark:text-slate-50"
            style={{ fontSize: 'clamp(2.8rem, 8vw, 6.5rem)' }}
          >
            Abdullah<br />
            <span className="text-primary">Hossam</span>{' '}Abdullah
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed">
            {h.heroBio}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <button
              onClick={() => setActiveTab('research')}
              className="px-8 py-4 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              {h.browsePapers} <ArrowIcon size={20} />
            </button>
            <a
              href="/Abdullah_Hossam_CV_2026.pdf"
              download
              className="px-8 py-4 bg-transparent border-2 border-primary/30 text-primary dark:text-primary-light rounded-xl font-bold hover:bg-primary/5 transition-all inline-flex items-center justify-center"
            >
              {h.downloadCV}
            </a>
          </div>

          {/* ── Social icons ── */}
          <div className="flex items-center gap-5">
            <a
              href="mailto:Abdullah.hossam2022@feps.edu.eg"
              aria-label="Gmail"
              className="w-11 h-11 flex items-center justify-center rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
            >
              <GmailIcon />
            </a>
            <a
              href="https://www.linkedin.com/in/abdullah-hossam-abdullah"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-11 h-11 flex items-center justify-center rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
            >
              <LinkedInIcon />
            </a>
          </div>

          <div className="mt-14 flex items-center gap-4 opacity-30">
            <div className="h-px w-24 bg-primary" />
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="h-px w-24 bg-primary" />
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="py-24 bg-primary/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-start">
            <div className="relative shrink-0 mb-8 md:mb-0">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary to-primary/20 rounded-full blur-2xl opacity-20"></div>
            <div className="relative z-10 w-48 h-48 md:w-56 md:h-56 rounded-full border-[6px] border-white dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 flex items-center justify-center shadow-2xl">
                <LogoCanvas size={224} />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-8 text-slate-900 dark:text-slate-50">{h.aboutTitle}</h2>
              <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed text-lg font-medium">
                <p>{h.aboutP1}</p>
                <p>{h.aboutP2}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                  <div className="flex items-start gap-4 justify-center md:justify-start">
                    <CheckCircle className="text-primary shrink-0 mt-1" size={24} />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-base">{h.cert1Title}</p>
                      <p className="text-sm opacity-80">{h.cert1Sub}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 justify-center md:justify-start">
                    <CheckCircle className="text-primary shrink-0 mt-1" size={24} />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-base">{h.cert2Title}</p>
                      <p className="text-sm opacity-80">{h.cert2Sub}</p>
                    </div>
                  </div>
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
            {researchCards.map((card, i) => (
              <div
                key={i}
                onClick={() => setActiveTab('research')}
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
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
