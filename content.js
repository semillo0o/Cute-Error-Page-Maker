// 🖌️ content.js - 페이지 덮어쓰기
import { getRandomTemplate, getTemplatePathByCode } from './utils.js';
import { getSpecialTemplateIfAny } from './date-checker.js';

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    if (msg.type === 'SHOW_CUTE_ERROR') {
        const code = msg.code;
        let templatePath;

        // 🎉 기념일 우선 렌더링
        const special = getSpecialTemplateIfAny();
        if (special) {
            templatePath = `templates/special/${special}`;
        } else {
            // 랜덤 템플릿 로딩
            const candidates = [
                `templates/${code}/index.html`,
                // 여기에 다른 템플릿 이름 추가 가능
            ];
            templatePath = getRandomTemplate(candidates);
        }

        const html = await fetch(chrome.runtime.getURL(templatePath)).then(res => res.text());

        document.documentElement.innerHTML = html;
        // 원래 타이틀 유지
        const originalTitle = document.title;
        setTimeout(() => { document.title = originalTitle; }, 10);
    }
});
