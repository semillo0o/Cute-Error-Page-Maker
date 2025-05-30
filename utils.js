//utils.js - 공통 유틸 함수

// 랜덤 템플릿 선택기
export function getRandomTemplate(templates) {
    const idx = Math.floor(Math.random() * templates.length);
    return templates[idx];
}

// 상태 코드가 4xx인지 5xx인지 판단
export function getStatusCategory(code) {
    const str = String(code);
    if (str.startsWith('4')) return '4xx';
    if (str.startsWith('5')) return '5xx';
    return 'unknown';
}

//오늘 날짜를 MM-DD 포맷으로 반환 (양력 기념일용)
export function getTodayKey() {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${mm}-${dd}`; // 예: '02-14'
}

// 상태 코드 기반 템플릿 폴더 경로 리턴
// 예: 404 -> templates/404/, 기념일이면 templates/special/
export function getTemplatePathByCode(code, special = false) {
    const folder = special ? 'special' : `${code}`;
    return `templates/${folder}`;
}

// HTML 템플릿 불러오기 (fetch 기반)
export async function fetchTemplateHTML(path, filename) {
    const url = `${path}/${filename}`;
    const res = await fetch(chrome.runtime.getURL(url));
    return await res.text();
}
