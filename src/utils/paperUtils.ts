import { Lang } from '../translations';
import { Paper } from '../types/paper';

export const localizePapers = (papersItems: any[], lang: Lang): Paper[] => {
  return papersItems.map(p => ({
    id: p.id,
    title: p.title[lang] || p.title.ar,
    cat: p.cat[lang] || p.cat.ar,
    lang: p.lang,
    year: p.year,
    desc: p.desc[lang] || p.desc.ar,
    img: p.img,
    cta: p.cta[lang] || p.cta.ar,
    meta: p.meta[lang] || p.meta.ar,
    pdfUrl: p.pdfUrl,
    iframeUrl: p.iframeUrl,
    sections: p.sections?.map((s: any) => ({
      id: s.id,
      title: s.title[lang] || s.title.ar,
      parts: s.parts.map((part: any) => ({
        id: part.id,
        title: part.title[lang] || part.title.ar,
        content: part.content[lang] || part.content.ar
      }))
    }))
  }));
};
