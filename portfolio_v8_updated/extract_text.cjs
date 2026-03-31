const fs = require('fs');
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();

const files = [
    "public/Ukraine political system (final).pdf",
    "public/بحث الرأي العام_merged-1.pdf",
    "public/Graduation project.pdf",
    "public/وهم التفوق-1.pdf",
    "public/ilovepdf_merged.pdf",
    "public/pdf.pdf"
];

async function run() {
    for (const file of files) {
        if (!fs.existsSync(file)) continue;
        try {
            console.log('Extracting', file);
            const data = await new Promise((resolve, reject) => {
                pdfExtract.extract(file, {}, (err, data) => {
                    if (err) return reject(err);
                    resolve(data);
                });
            });
            let fullText = '';
            for (let page of data.pages) {
                for (let c of page.content) {
                    fullText += c.str + ' ';
                }
                fullText += '\n';
            }
            const out = file.replace('.pdf', '.txt');
            fs.writeFileSync(out, fullText);
            console.log('Saved', out);
        } catch (e) {
            console.error('Error on', file, e.message);
        }
    }
}
run();
