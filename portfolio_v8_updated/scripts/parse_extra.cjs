const fs = require('fs');

const pathGrad = 'c:/Users/salmb/Downloads/portfolio_v8/portfolio_v8_updated/public/Graduation project.txt';
const pathIllusion = 'c:/Users/salmb/Downloads/portfolio_v8/portfolio_v8_updated/public/وهم التفوق-1.txt';
const jsonPath = 'c:/Users/salmb/Downloads/portfolio_v8/portfolio_v8_updated/src/data/researchContent.json';

// Helper to extract text between two strings
function extract(text, startStr, endStr) {
    let startIdx = text.indexOf(startStr);
    if (startIdx === -1) return '';
    let startContent = startIdx; // Include the heading
    let endIdx = endStr ? text.indexOf(endStr, startIdx + startStr.length) : text.length;
    if (endIdx === -1) endIdx = text.length;
    return text.substring(startContent, endIdx).trim();
}

// 1. Graduation Project
let textGrad = fs.readFileSync(pathGrad, 'utf8');
const gradData = {
    sections: [
        {
            id: 'sec-intro',
            title: 'المقدمة والإشكالية',
            parts: [
                { id: 'gp-p1', title: 'المقدمة', content: extract(textGrad, 'المقدمة  1', 'المشكلة البحثية') },
                { id: 'gp-p2', title: 'المشكلة البحثية', content: extract(textGrad, 'المشكلة البحثية', 'الأهمية البحثية') },
                { id: 'gp-p3', title: 'الأهمية البحثية', content: extract(textGrad, 'الأهمية البحثية', 'عرض الأدبيات') }
            ]
        },
        {
            id: 'sec-lit',
            title: 'عرض الأدبيات',
            parts: [
                { id: 'gp-p4', title: 'الرؤية الكلاسيكية', content: extract(textGrad, 'أو لًا: أدبيات تتعلق بالرؤية الكلاسيكية', 'ثاني أدبيات تتعلق بالرؤى والإتجاهات النقدية') },
                { id: 'gp-p5', title: 'الاتجاهات النقدية', content: extract(textGrad, 'ثاني أدبيات تتعلق بالرؤى والإتجاهات النقدية', 'ثالث الي أدبيات الحالة التطبيقية') },
                { id: 'gp-p6', title: 'الحالة التطبيقية (فلسطين)', content: extract(textGrad, 'ثالث الي أدبيات الحالة التطبيقية', 'الإطار النظر') }
            ]
        },
        {
            id: 'sec-theory',
            title: 'الإطار النظري',
            parts: [
                { id: 'gp-p7', title: 'اتجاهات السلام النقدية', content: extract(textGrad, 'الإطار النظر', 'الإطار المفاهيمي') },
                { id: 'gp-p8', title: 'الإطار المفاهيمي', content: extract(textGrad, 'الإطار المفاهيمي', 'المنهج المقارن النقدي') },
                { id: 'gp-p9', title: 'المنهج المقارن', content: extract(textGrad, 'المنهج المقارن النقدي', 'الفصل الأول') }
            ]
        },
        {
            id: 'sec-ch1',
            title: 'الفصل الأول: الرؤى التقليدية',
            parts: [
                { id: 'gp-p10', title: 'النظرية الواقعية', content: extract(textGrad, 'النظرية الواقعية والسلام العالمي', 'المبحث الثاني: النظرية الليبر والمركزية الغربية') },
                { id: 'gp-p11', title: 'النظرية الليبرالية', content: extract(textGrad, 'المبحث الثاني: النظرية الليبر والمركزية الغربية', 'المبحث الثالث: النظرية الماركسية والحكم والسيطرة') },
                { id: 'gp-p12', title: 'النظرية الماركسية', content: extract(textGrad, 'المبحث الثالث: النظرية الماركسية والحكم والسيطرة', null) }
            ]
        }
    ]
};

// 2. Illusion of Excellence
let textIllusion = fs.readFileSync(pathIllusion, 'utf8');
const illusionData = {
    sections: [
        {
            id: 'sec-full',
            title: 'المقال كاملاً',
            parts: [
                { id: 'il-p1', title: 'احتفال بلا متفوقين', content: extract(textIllusion, 'وهم التفوق', 'ولننتقل لمظهر آخر') },
                { id: 'il-p2', title: 'يوم التفوق أم يوم الأنشطة؟', content: extract(textIllusion, 'ولننتقل لمظهر آخر', 'ولننتقل الآن للنقطة الأخيرة') },
                { id: 'il-p3', title: 'النهاية المرة: تكريم معاذ', content: extract(textIllusion, 'ولننتقل الآن للنقطة الأخيرة', null) }
            ]
        }
    ]
};

// Load existing json and merge
let currentData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

currentData['g-project'] = gradData;
currentData['illusion'] = illusionData;

fs.writeFileSync(jsonPath, JSON.stringify(currentData, null, 2));
console.log('Successfully wrote parsed extra content to JSON');
