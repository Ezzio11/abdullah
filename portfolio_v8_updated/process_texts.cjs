const fs = require('fs');
const path = require('path');

const papers = [
  {
    id: "g-project",
    file: "public/Graduation project.txt",
    tabs: [
      { id: "intro", titleAR: "المقدمة", titleEN: "Intro", keywords: ["المقدمة"] },
      { id: "ch1_real", titleAR: "الفصل 1 (الواقعية)", titleEN: "Ch.1 Realism", keywords: ["الفصل الأول", "النظرية الواقعية"] },
      { id: "ch1_lib", titleAR: "الفصل 1 (الليبرالية)", titleEN: "Ch.1 Liberalism", keywords: ["المبحث الثاني:", "النظرية الليبرالية", "الليبرالية والسلام"] },
      { id: "ch1_marx", titleAR: "الفصل 1 (الماركسية)", titleEN: "Ch.1 Marxism", keywords: ["المبحث الثالث:", "النظرية الماركسية"] },
      { id: "ch2_naqd", titleAR: "الفصل 2", titleEN: "Ch.2", keywords: ["الفصل الثاني", "الرؤى النقدية"] },
      { id: "itaar", titleAR: "الإطار المفاهيمي", titleEN: "Framework", keywords: ["الإطار المفاهيمي", "الخاتمة"] }
    ]
  },
  {
    id: "ukraine",
    file: "public/Ukraine political system (final).txt",
    tabs: [
      { id: "intro", titleAR: "المقدمة", titleEN: "Intro", keywords: ["المقدمة"] },
      { id: "ch1", titleAR: "الفصل 1", titleEN: "Ch.1", keywords: ["الفصل الأول", "المبحث الأول"] },
      { id: "ch2", titleAR: "الفصل 2", titleEN: "Ch.2", keywords: ["الفصل الثاني", "المبحث الثاني"] },
      { id: "ch3", titleAR: "الفصل 3", titleEN: "Ch.3", keywords: ["الفصل الثالث", "المبحث الثالث"] },
      { id: "con", titleAR: "الخاتمة", titleEN: "Con", keywords: ["الخاتمة"] }
    ]
  },
  {
    id: "public-opinion",
    file: "public/بحث الرأي العام_merged-1.txt",
    tabs: [
      { id: "intro", titleAR: "المقدمة", titleEN: "Intro", keywords: ["المقدمة"] },
      { id: "ch1", titleAR: "الفصل 1", titleEN: "Ch.1", keywords: ["الفصل الأول", "المبحث الأول"] },
      { id: "ch2", titleAR: "الفصل 2", titleEN: "Ch.2", keywords: ["الفصل الثاني", "المبحث الثاني"] },
      { id: "ch3", titleAR: "الفصل 3", titleEN: "Ch.3", keywords: ["الفصل الثالث", "المبحث الثالث"] },
      { id: "con", titleAR: "الخاتمة", titleEN: "Con", keywords: ["الخاتمة", "خاتمة"] }
    ]
  },
  {
    id: "illusion",
    file: "public/وهم التفوق-1.txt",
    tabs: [
      { id: "intro", titleAR: "المقدمة", titleEN: "Intro", keywords: ["المقدمة"] },
      { id: "ch1", titleAR: "الفصل 1", titleEN: "Ch.1", keywords: ["الفصل الأول", "المبحث الأول"] },
      { id: "ch2", titleAR: "الفصل 2", titleEN: "Ch.2", keywords: ["الفصل الثاني", "المبحث الثاني"] },
      { id: "con", titleAR: "الخاتمة", titleEN: "Con", keywords: ["الخاتمة", "خاتمة"] }
    ]
  },
  {
    id: "ilovepdf",
    file: "public/ilovepdf_merged.txt",
    tabs: [
      { id: "intro", titleAR: "المقدمة", titleEN: "Intro", keywords: ["المقدمة"] },
      { id: "ch1", titleAR: "المدينة الفاضلة", titleEN: "Ch.1", keywords: ["المدينة الفاضلة", "الفصل الأول"] },
      { id: "ch2", titleAR: "نظام الحكم", titleEN: "Ch.2", keywords: ["نظام الحكم", "الفصل الثاني"] },
      { id: "ch3", titleAR: "النظام الاقتصادي", titleEN: "Ch.3", keywords: ["النظام الإقتصادي", "النظام الاقتصادي"] },
      { id: "con", titleAR: "الخاتمة", titleEN: "Con", keywords: ["الخاتمة", "خاتمة"] }
    ]
  },
  {
    id: "pdf",
    file: "public/pdf.txt",
    tabs: [
      { id: "intro", titleAR: "المقدمة", titleEN: "Intro", keywords: ["المقدمة"] },
      { id: "ch1", titleAR: "الفصل 1", titleEN: "Ch.1", keywords: ["الفصل الأول", "المبحث الأول"] },
      { id: "ch2", titleAR: "الفصل 2", titleEN: "Ch.2", keywords: ["الفصل الثاني", "المبحث الثاني"] },
      { id: "ch3", titleAR: "الفصل 3", titleEN: "Ch.3", keywords: ["الفصل الثالث", "المبحث الثالث"] },
      { id: "con", titleAR: "الخاتمة", titleEN: "Con", keywords: ["الخاتمة", "خاتمة"] }
    ]
  }
];

function normalize(str) {
  return str.replace(/\s+/g, ' ').trim();
}

function findBestIndex(text, keywords, startIndex) {
  let bestIdx = -1;
  const searchArea = text.substring(startIndex);
  for (const kw of keywords) {
    // try to find kw with flexible spacing
    const regexStr = kw.split('').join('\\s*');
    const regex = new RegExp(regexStr, 'i');
    const match = searchArea.match(regex);
    if (match && match.index !== undefined) {
      const idx = startIndex + match.index;
      if (bestIdx === -1 || idx < bestIdx) {
        bestIdx = idx;
      }
    }
  }
  return bestIdx;
}

const resultData = {};

for (const paper of papers) {
  if (!fs.existsSync(paper.file)) continue;
  const text = fs.readFileSync(paper.file, 'utf-8');
  
  const contentMap = {};
  let currentIndex = 0;
  
  for (let i = 0; i < paper.tabs.length; i++) {
    const tab = paper.tabs[i];
    const nextTab = paper.tabs[i + 1];
    
    let endIndex = text.length;
    if (nextTab) {
      const nextIdx = findBestIndex(text, nextTab.keywords, currentIndex + 10);
      if (nextIdx !== -1) {
        endIndex = nextIdx;
      }
    }
    
    let chunk = text.substring(currentIndex, endIndex);
    contentMap[tab.id] = chunk.trim() || 'المحتوى غير متوفر... (Content not found in extraction)';
    currentIndex = endIndex;
  }
  
  resultData[paper.id] = contentMap;
}

fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/researchContent.json', JSON.stringify(resultData, null, 2));
console.log('Saved src/data/researchContent.json');
