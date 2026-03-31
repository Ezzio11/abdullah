import React, { useState } from 'react';
import { User, BrainCircuit } from 'lucide-react';
import { t, Lang } from '../translations';
import { LogoCanvas } from './LogoCanvas';



export default function About({ lang }: { lang: Lang }) {
  const tr = t[lang];
  const a = tr.about;

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
    <div className="flex flex-1 justify-center py-10 px-6">
      <div className="flex flex-col max-w-[900px] flex-1 gap-12">

        {/* Profile header */}
        <section className="flex flex-col md:flex-row gap-12 items-center md:items-center bg-white/40 dark:bg-slate-800/40 p-10 rounded-[2.5rem] border border-primary/10 backdrop-blur-md shadow-xl shadow-primary/5">
          <div className="relative shrink-0">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary to-primary/30 rounded-full blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative z-10 w-48 h-48 md:w-56 md:h-56 rounded-full border-4 border-white dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900 flex items-center justify-center shadow-2xl ring-4 ring-primary/10">
              <LogoCanvas size={224} />
            </div>
          </div>
          <div className="flex flex-col items-center md:items-start justify-center flex-1 text-center md:text-start">
            <h1 className="text-slate-900 dark:text-slate-100 text-4xl md:text-5xl font-black tracking-tight mb-3 leading-tight">{tr.fullName}</h1>
            <p className="text-primary text-xl font-bold mb-2 tracking-wide uppercase">{a.role}</p>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl leading-relaxed font-medium">{a.roleSub}</p>
          </div>
        </section>

        {/* Bio + Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-slate-900 dark:text-slate-100 text-2xl font-bold flex items-center gap-3 mb-6">
              <User className="text-primary" size={28} />
              {a.bioTitle}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-4">{a.bioP1}</p>
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">{a.bioP2}</p>
          </div>

          <div>
            <h2 className="text-slate-900 dark:text-slate-100 text-2xl font-bold flex items-center gap-3 mb-8">
              <BrainCircuit className="text-primary" size={28} />
              {a.skillsTitle}
            </h2>
            {/* Clean tag grid — no bars, no percentages */}
            <div className="flex flex-wrap gap-3">
              {skills.map(skill => (
                <span
                  key={skill}
                  className="px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-primary/15 hover:border-primary/60 transition-colors duration-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Contact section anchor ── */}
        <div id="contact-section" className="scroll-mt-24">
          <h2 className="text-slate-900 dark:text-slate-100 text-2xl font-bold mb-6">{a.contactTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a href="mailto:Abdullah.hossam2022@feps.edu.eg"
               className="flex items-center gap-3 p-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors group">
              <span className="text-primary font-bold text-sm">{a.emailLabel}:</span>
              <span className="text-slate-600 dark:text-slate-300 text-sm group-hover:text-primary transition-colors">Abdullah.hossam2022@feps.edu.eg</span>
            </a>
            <a href="https://www.linkedin.com/in/abdullah-hossam-abdullah"
               target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-3 p-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors group">
              <span className="text-primary font-bold text-sm">{a.linkedinLabel}:</span>
              <span className="text-slate-600 dark:text-slate-300 text-sm group-hover:text-primary transition-colors">linkedin.com/in/abdullah-hossam-abdullah</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
