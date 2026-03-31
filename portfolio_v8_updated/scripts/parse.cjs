const fs = require('fs');

const pathUkraine = 'c:/Users/salmb/Downloads/portfolio_v8/portfolio_v8_updated/public/deepseek_text_20260329_3230a6.txt';
const pathComm = 'c:/Users/salmb/Downloads/portfolio_v8/portfolio_v8_updated/public/deepseek_text_20260329_9cf179.txt';
const pathPlato = 'c:/Users/salmb/Downloads/portfolio_v8/portfolio_v8_updated/public/deepseek_text_20260329_537819.txt';
const pathSocial = 'c:/Users/salmb/Downloads/portfolio_v8/portfolio_v8_updated/public/deepseek_text_20260329_719042 (1).txt';
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

function extractExcludeStart(text, startStr, endStr) {
    let startIdx = text.indexOf(startStr);
    if (startIdx === -1) return '';
    let startContent = startIdx + startStr.length;
    let endIdx = endStr ? text.indexOf(endStr, startContent) : text.length;
    if (endIdx === -1) endIdx = text.length;
    return text.substring(startContent, endIdx).trim();
}

// 1. Ukraine
let textUk = fs.readFileSync(pathUkraine, 'utf8');
const ukraineData = {
    sections: [
        {
            id: 'sec-intro',
            title: 'Introduction & Environment',
            parts: [
                { id: 'uk-p1', title: 'Introduction', content: extract(textUk, 'Introduction:', 'Environment of the Political System:') },
                { id: 'uk-p2', title: 'Geography of Ukraine', content: extract(textUk, '1- Geography of Ukraine:', '2- Society and Demographic Features:') },
                { id: 'uk-p3', title: 'Society & Demographics', content: extract(textUk, '2- Society and Demographic Features:', '3- Historical Development of Ukraine') },
                { id: 'uk-p4', title: 'Historical Development', content: extract(textUk, '3- Historical Development of Ukraine', 'Political Institutions in Ukraine:') }
            ]
        },
        {
            id: 'sec-inst',
            title: 'Political Institutions',
            parts: [
                { id: 'uk-p5', title: 'Overview', content: extract(textUk, 'Political Institutions in Ukraine:', 'The President of Ukraine:') },
                { id: 'uk-p6', title: 'The President', content: extract(textUk, 'The President of Ukraine:', 'The Verkhovna Rada (Parliament):') },
                { id: 'uk-p7', title: 'The Parliament', content: extract(textUk, 'The Verkhovna Rada (Parliament):', 'The Cabinet of Ministers:') },
                { id: 'uk-p8', title: 'The Cabinet of Ministers', content: extract(textUk, 'The Cabinet of Ministers:', 'The Constitutional Court:') },
                { id: 'uk-p9', title: 'The Constitutional Court', content: extract(textUk, 'The Constitutional Court:', 'The Supreme Court of Ukraine:') },
                { id: 'uk-p10', title: 'The Supreme Court', content: extract(textUk, 'The Supreme Court of Ukraine:', 'The Party System in Ukraine:') }
            ]
        },
        {
            id: 'sec-party',
            title: 'Party & Electoral Systems',
            parts: [
                { id: 'uk-p11', title: 'Party System', content: extract(textUk, 'The Party System in Ukraine:', 'Ukraine Electoral System:') },
                { id: 'uk-p12', title: 'Electoral System', content: extract(textUk, 'Ukraine Electoral System:', 'Civil Society:') }
            ]
        },
        {
            id: 'sec-issues',
            title: 'Civil Society & Current Issues',
            parts: [
                { id: 'uk-p13', title: 'Civil Society', content: extract(textUk, 'Civil Society:', 'The Pressing Current Issue:') },
                { id: 'uk-p14', title: 'Current Issues (War Impact)', content: extract(textUk, 'The Pressing Current Issue:', null) }
            ]
        }
    ]
};

// 2. Communication Barriers
let textComm = fs.readFileSync(pathComm, 'utf8');
const commData = {
    sections: [
        {
            id: 'sec-intro',
            title: 'المقدمة والملخص',
            parts: [
                { id: 'co-p1', title: 'مستخلص الدراسة', content: extract(textComm, 'مستخلص الدراسة:', 'Abstract:') },
                { id: 'co-p2', title: 'Abstract', content: extract(textComm, 'Abstract:', 'مقدمة:') },
                { id: 'co-p3', title: 'المقدمة', content: extract(textComm, 'مقدمة:', 'أنواع عوائق التواصل:') }
            ]
        },
        {
            id: 'sec-types',
            title: 'أنواع العوائق',
            parts: [
                { id: 'co-p4', title: 'العوائق اللغوية', content: extract(textComm, 'أولاً: العوائق اللغوية:', 'ثانيًا: العوائق النفسية والشخصية:') },
                { id: 'co-p5', title: 'العوائق النفسية والشخصية', content: extract(textComm, 'ثانيًا: العوائق النفسية والشخصية:', 'ثالثًا: العوائق التقنية والإعلامية:') },
                { id: 'co-p6', title: 'العوائق التقنية والإعلامية', content: extract(textComm, 'ثالثًا: العوائق التقنية والإعلامية:', 'طبيعة عوائق التواصل في القرن العشرين') },
                { id: 'co-p7', title: 'التغير التاريخي', content: extract(textComm, 'طبيعة عوائق التواصل في القرن العشرين', 'طبيعة عوائق التواصل في القرن التاسع عشر:') },
                { id: 'co-p8', title: 'القرن التاسع عشر', content: extract(textComm, 'طبيعة عوائق التواصل في القرن التاسع عشر:', 'أثر عوائق التواصل في العلاقات الدولية:') }
            ]
        },
        {
            id: 'sec-impact',
            title: 'الأثر في العلاقات الدولية',
            parts: [
                { id: 'co-p9', title: 'مؤتمر يالطا (1945)', content: extract(textComm, 'أولاً: مؤتمر يالطا (1945):', 'ثانيًا: مؤتمر بوتسدام (1945):') },
                { id: 'co-p10', title: 'مؤتمر بوتسدام', content: extract(textComm, 'ثانيًا: مؤتمر بوتسدام (1945):', 'ثالثًا: خطأ الترجمة اليابانية') },
                { id: 'co-p11', title: 'أخطاء أخرى', content: extract(textComm, 'ثالثًا: خطأ الترجمة اليابانية', 'سبل تجاوز عوائق التواصل:') }
            ]
        },
        {
            id: 'sec-solutions',
            title: 'الحلول والخاتمة',
            parts: [
                { id: 'co-p12', title: 'الآليات التقليدية', content: extract(textComm, 'أولاً: تعزيز الآليات التقليدية', 'ثانيًا: التكنولوجيا الحديثة') },
                { id: 'co-p13', title: 'التكنولوجيا والذكاء الاصطناعي', content: extract(textComm, 'ثانيًا: التكنولوجيا الحديثة', 'الخاتمة:') },
                { id: 'co-p14', title: 'الخاتمة', content: extract(textComm, 'الخاتمة:', null) }
            ]
        }
    ]
};

// 3. Plato & Mawardi
let textPlato = fs.readFileSync(pathPlato, 'utf8');
const platoData = {
    sections: [
        {
            id: 'sec-intro',
            title: 'المقدمة والنشأة',
            parts: [
                { id: 'pl-p1', title: 'المقدمة', content: extract(textPlato, 'المقدمة:', 'نشأتهم والبيئة التي أثرت في أفكارهم:') },
                { id: 'pl-p2', title: 'النشأة والبيئة', content: extract(textPlato, 'نشأتهم والبيئة التي أثرت في أفكارهم:', 'مفهوم العدالة:') }
            ]
        },
        {
            id: 'sec-concepts',
            title: 'المفاهيم والسمات',
            parts: [
                { id: 'pl-p3', title: 'مفهوم العدالة', content: extract(textPlato, 'مفهوم العدالة:', 'المدينة الفاضلة مقابل الدولة الرشيدة: السمات والغايات') },
                { id: 'pl-p4', title: 'السمات والغايات', content: extract(textPlato, 'المدينة الفاضلة مقابل الدولة الرشيدة: السمات والغايات', 'نظام الحكم المثالي') }
            ]
        },
        {
            id: 'sec-systems',
            title: 'الأنظمة المثالية',
            parts: [
                { id: 'pl-p5', title: 'نظام الحكم المثالي', content: extract(textPlato, 'نظام الحكم المثالي', 'النظام الاقتصادي') },
                { id: 'pl-p6', title: 'النظام الاقتصادي', content: extract(textPlato, 'النظام الاقتصادي', 'الخاتمة:') }
            ]
        },
        {
            id: 'sec-conclusion',
            title: 'الخاتمة',
            parts: [
                { id: 'pl-p7', title: 'الخاتمة', content: extract(textPlato, 'الخاتمة:', null) }
            ]
        }
    ]
};

// 4. Social Media
let textSocial = fs.readFileSync(pathSocial, 'utf8');
const socialData = {
    sections: [
        {
            id: 'sec-intro',
            title: 'الإطار العام',
            parts: [
                { id: 'so-p1', title: 'مقدمة الدراسة', content: extractExcludeStart(textSocial, 'يشهد العالم المعاصر', 'النظريات المستخدمة:') },
                { id: 'so-p2', title: 'النظريات المستخدمة', content: extract(textSocial, 'النظريات المستخدمة:', 'أدوات جمع البيانات:') },
                { id: 'so-p3', title: 'أدوات جمع البيانات والإطار المفاهيمي', content: extract(textSocial, 'أدوات جمع البيانات:', 'ثانيًا: التحليل الكمي للاستبيان') }
            ]
        },
        {
            id: 'sec-analysis',
            title: 'التحليل الميداني',
            parts: [
                { id: 'so-p4', title: 'التحليل الكمي', content: extract(textSocial, 'ثانيًا: التحليل الكمي للاستبيان', 'ثالثًا: التحليل الموضوعي للاستبيان') },
                { id: 'so-p5', title: 'التحليل الموضوعي', content: extract(textSocial, 'ثالثًا: التحليل الموضوعي للاستبيان', null) }
            ]
        }
    ]
};

// Add to the first content extraction for social media so it includes the start strings
socialData.sections[0].parts[0].content = "يشهد العالم المعاصر " + socialData.sections[0].parts[0].content;


// Load existing json and merge
let currentData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

currentData['pdf'] = commData;
currentData['ukraine'] = ukraineData;
currentData['plato-mawardi'] = platoData; // We map this new key to plato
currentData['public-opinion'] = socialData;

fs.writeFileSync(jsonPath, JSON.stringify(currentData, null, 2));
console.log('Successfully wrote parsed data to JSON');
