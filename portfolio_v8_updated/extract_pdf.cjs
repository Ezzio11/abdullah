const fs = require('fs');
const pdf = require('pdf-parse');

async function extract() {
    const files = [
        "public/Ukraine political system (final).pdf",
        "public/بحث الرأي العام_merged-1.pdf",
        "public/Graduation project.pdf",
        "public/وهم التفوق-1.pdf",
        "public/ilovepdf_merged.pdf",
        "public/pdf.pdf"
    ];

    for (const f of files) {
        try {
            if (fs.existsSync(f)) {
                let dataBuffer = fs.readFileSync(f);
                const data = await pdf(dataBuffer);
                const outName = f.replace('.pdf', '.json');
                fs.writeFileSync(outName, JSON.stringify({ text: data.text }));
                console.log(`Extracted: ${f}`);
            }
        } catch (e) {
            console.error(`Failed: ${f}`, e);
        }
    }
}
extract();
