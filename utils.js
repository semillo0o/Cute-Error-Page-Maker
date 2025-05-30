// 🧠 utils.js - 공통 유틸 함수
export function getRandomTemplate(templates) {
    const idx = Math.floor(Math.random() * templates.length);
    return templates[idx];
}

export function getStatusCategory(code) {
    return String(code).startsWith('4') ? '4xx' : '5xx';
}

export function getTodayKey() {
    const today = new Date();
    return `${today.getMonth() + 1}-${today.getDate()}`;
}

// 💡 상태 코드에 따라 템플릿 경로 지정
export function getTemplatePathByCode(code, special = false) {
    const category = special ? 'special' : `${code}`;
    return `templates/${category}`;
}
