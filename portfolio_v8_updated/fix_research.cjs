const fs = require('fs');

const file = 'src/components/Research.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

// 1. Add imports
lines[2] = "import { motion, AnimatePresence } from 'motion/react';\n" + lines[2];

// 2. Replace tabs with iframeUrls (1-indexed lines to 0-indexed)
const replacements = [
  { start: 27, end: 43, repl: "      tabs: [], iframeUrl: '/ilovepdf_merged.pdf'," },
  { start: 56, end: 75, repl: "      tabs: [], iframeUrl: '/Ukraine political system (final).pdf'," },
  { start: 88, end: 104, repl: "      tabs: [], iframeUrl: '/pdf.pdf'," },
  { start: 117, end: 133, repl: "      tabs: [], iframeUrl: '/بحث الرأي العام_merged-1.pdf'," },
  { start: 146, end: 180, repl: "      tabs: [], iframeUrl: '/Graduation project.pdf'," },
  { start: 207, end: 220, repl: "      tabs: [], iframeUrl: '/وهم التفوق-1.pdf'," }
];

// Reverse sort to safely mutate array without affecting earlier indices
replacements.sort((a, b) => b.start - a.start).forEach(({ start, end, repl }) => {
  lines.splice(start - 1, end - start + 1, repl);
});

fs.writeFileSync(file, lines.join('\n'));
console.log('Modified Research.tsx pdf mappings.');
