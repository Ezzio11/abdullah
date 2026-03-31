export interface Part { 
  id: string; 
  title: string; 
  content: string; 
}

export interface Section { 
  id: string; 
  title: string; 
  parts: Part[]; 
}

export interface Paper {
  id: string; 
  title: string; 
  cat: string; 
  lang: string;
  year: string; 
  desc: string; 
  img: string; 
  cta: string;
  meta: string;
  sections?: Section[];
  iframeUrl?: string;
  pdfUrl?: string;
}
