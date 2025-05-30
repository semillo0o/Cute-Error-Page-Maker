// 🖌️ content.js - 페이지 덮어쓰기

// 유틸리티 함수들 (inline)
function getRandomTemplate(templates) {
    const idx = Math.floor(Math.random() * templates.length);
    return templates[idx];
}

function getTodayKey() {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${mm}-${dd}`; // 예: '02-14'
}

// React 앱 감지 함수
function isReactApp() {
    // React 관련 요소들을 확인
    return !!(
        window.React || 
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__ ||
        document.querySelector('[data-reactroot]') ||
        document.querySelector('[data-react-helmet]') ||
        document.querySelector('#root') ||
        document.querySelector('#__next') ||
        document.querySelector('.react-') ||
        document.body.innerHTML.includes('react') ||
        window.location.hostname.includes('chatgpt') ||
        window.location.hostname.includes('openai')
    );
}

// 안전한 오버레이 생성 함수
function createSafeOverlay(htmlContent, originalUrl) {
    // 기존 오버레이 제거
    const existingOverlay = document.getElementById('cute-error-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }

    // 원래 URL 저장 (전역)
    window.originalErrorUrl = originalUrl;

    // 오버레이 컨테이너 생성 (초기에는 반투명 모드)
    const overlay = document.createElement('div');
    overlay.id = 'cute-error-overlay';
    overlay.dataset.mode = 'transparent'; // 초기 모드: transparent, full, minimized
    overlay.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        z-index: 2147483647 !important;
        background: rgba(255, 255, 255, 0.85) !important;
        backdrop-filter: blur(2px) !important;
        overflow-y: auto !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif !important;
        transition: all 0.3s ease !important;
    `;

    // HTML 내용에서 body 내용만 추출 (스크립트 제거)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // 스크립트 태그들 제거
    const scripts = tempDiv.querySelectorAll('script');
    scripts.forEach(script => script.remove());
    
    const bodyContent = tempDiv.querySelector('body')?.innerHTML || htmlContent;
    
    // 스타일도 추출하여 추가
    const styleContent = tempDiv.querySelector('style')?.innerHTML || '';
    
    // 메인 콘텐츠 컨테이너
    const mainContent = document.createElement('div');
    mainContent.id = 'cute-error-main-content';
    mainContent.style.cssText = `
        position: relative;
        z-index: 10;
        transition: all 0.3s ease;
        opacity: 0.7;
    `;
    
    // CSP 안전하게 HTML만 설정 (스크립트 없이)
    mainContent.innerHTML = `
        <style>${styleContent}</style>
        ${bodyContent}
    `;

    // 모드 전환 패널 추가
    const modePanel = document.createElement('div');
    modePanel.id = 'cute-error-mode-panel';
    modePanel.style.cssText = `
        position: fixed !important;
        top: 20px !important;
        right: 20px !important;
        background: rgba(255, 107, 157, 0.95) !important;
        color: white !important;
        padding: 15px !important;
        border-radius: 15px !important;
        z-index: 2147483648 !important;
        box-shadow: 0 8px 25px rgba(255, 107, 157, 0.4) !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 8px !important;
        font-size: 0.85em !important;
        min-width: 200px !important;
    `;
    
    modePanel.innerHTML = `
        <div style="font-weight: bold; text-align: center; margin-bottom: 5px;">🌸 귀여운 오류 페이지</div>
        <div style="display: flex; gap: 5px;">
            <button id="mode-transparent" style="flex: 1; background: rgba(255,255,255,0.3); color: white; border: none; padding: 5px; border-radius: 8px; font-size: 0.8em; cursor: pointer; border: 2px solid rgba(255,255,255,0.5);">👁️ 투명</button>
            <button id="mode-full" style="flex: 1; background: rgba(255,255,255,0.2); color: white; border: none; padding: 5px; border-radius: 8px; font-size: 0.8em; cursor: pointer;">🌸 전체</button>
            <button id="mode-minimized" style="flex: 1; background: rgba(255,255,255,0.2); color: white; border: none; padding: 5px; border-radius: 8px; font-size: 0.8em; cursor: pointer;">📱 최소</button>
        </div>
        <button id="mode-close" style="background: rgba(220, 53, 69, 0.8); color: white; border: none; padding: 8px; border-radius: 8px; font-size: 0.8em; cursor: pointer; margin-top: 5px;">❌ 완전히 닫기</button>
    `;

    overlay.appendChild(mainContent);
    overlay.appendChild(modePanel);
    
    // body에 오버레이 추가
    document.body.appendChild(overlay);
    
    // 모드 전환 기능 설정
    setupOverlayModes(overlay, originalUrl);
    
    // JavaScript로 이벤트 리스너 설정 (CSP 안전)
    setupOverlayEventListeners(overlay, originalUrl);
    
    // 오버레이 제거 함수를 전역으로 설정
    window.removeCuteErrorOverlay = function() {
        const overlayElement = document.getElementById('cute-error-overlay');
        if (overlayElement) {
            overlayElement.remove();
        }
    };

    return overlay;
}

// 오버레이 모드 전환 기능
function setupOverlayModes(overlay, originalUrl) {
    const modePanel = overlay.querySelector('#cute-error-mode-panel');
    const mainContent = overlay.querySelector('#cute-error-main-content');
    
    const transparentBtn = modePanel.querySelector('#mode-transparent');
    const fullBtn = modePanel.querySelector('#mode-full');
    const minimizedBtn = modePanel.querySelector('#mode-minimized');
    const closeBtn = modePanel.querySelector('#mode-close');
    
    // 버튼 활성 상태 업데이트
    function updateActiveButton(activeMode) {
        [transparentBtn, fullBtn, minimizedBtn].forEach(btn => {
            btn.style.background = 'rgba(255,255,255,0.2)';
            btn.style.border = 'none';
        });
        
        const activeBtn = activeMode === 'transparent' ? transparentBtn : 
                         activeMode === 'full' ? fullBtn : minimizedBtn;
        activeBtn.style.background = 'rgba(255,255,255,0.3)';
        activeBtn.style.border = '2px solid rgba(255,255,255,0.5)';
    }
    
    // 투명 모드
    transparentBtn.addEventListener('click', function() {
        overlay.dataset.mode = 'transparent';
        overlay.style.background = 'rgba(255, 255, 255, 0.1)';
        overlay.style.backdropFilter = 'blur(1px)';
        mainContent.style.opacity = '0.3';
        mainContent.style.pointerEvents = 'none';
        updateActiveButton('transparent');
    });
    
    // 전체 모드
    fullBtn.addEventListener('click', function() {
        overlay.dataset.mode = 'full';
        overlay.style.background = 'white';
        overlay.style.backdropFilter = 'none';
        mainContent.style.opacity = '1';
        mainContent.style.pointerEvents = 'auto';
        updateActiveButton('full');
    });
    
    // 최소화 모드
    minimizedBtn.addEventListener('click', function() {
        overlay.dataset.mode = 'minimized';
        overlay.style.background = 'transparent';
        overlay.style.backdropFilter = 'none';
        mainContent.style.opacity = '0';
        mainContent.style.pointerEvents = 'none';
        updateActiveButton('minimized');
    });
    
    // 완전히 닫기
    closeBtn.addEventListener('click', function() {
        if (window.removeCuteErrorOverlay) {
            window.removeCuteErrorOverlay();
        }
    });
    
    // 초기 상태 설정 (투명 모드)
    updateActiveButton('transparent');
}

// 오버레이 이벤트 리스너 설정 (CSP 안전)
function setupOverlayEventListeners(overlay, originalUrl) {
    // ESC 키로 오버레이 닫기
    const escKeyHandler = function(e) {
        if (e.key === 'Escape') {
            if (window.removeCuteErrorOverlay) {
                window.removeCuteErrorOverlay();
            }
        }
    };
    document.addEventListener('keydown', escKeyHandler);
    
    // 오버레이가 제거될 때 이벤트 리스너도 제거
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.removedNodes.forEach(function(node) {
                    if (node.id === 'cute-error-overlay') {
                        document.removeEventListener('keydown', escKeyHandler);
                        observer.disconnect();
                        // 자동 재시도 타이머 정리
                        if (window.autoRetryTimer) {
                            clearInterval(window.autoRetryTimer);
                            window.autoRetryTimer = null;
                        }
                    }
                });
            }
        });
    });
    observer.observe(document.body, { childList: true });

    // 버튼 이벤트 리스너 설정
    setTimeout(() => {
        const retryBtn = overlay.querySelector('#retryBtn, #manualRetryBtn');
        const backBtn = overlay.querySelector('#backBtn');
        const closeBtn = overlay.querySelector('#closeBtn');
        const goHomeBtn = overlay.querySelector('#goHomeBtn');

        if (retryBtn) {
            retryBtn.addEventListener('click', function() {
                window.location.reload();
            });
        }

        if (backBtn) {
            backBtn.addEventListener('click', function() {
                window.history.back();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                if (window.removeCuteErrorOverlay) {
                    window.removeCuteErrorOverlay();
                }
            });
        }

        if (goHomeBtn) {
            goHomeBtn.addEventListener('click', function() {
                try {
                    const homeUrls = [
                        new URL('/', window.location.origin).href,
                        window.location.origin,
                        'https://www.google.com'
                    ];
                    window.location.href = homeUrls[0];
                } catch (error) {
                    window.location.href = 'https://www.google.com';
                }
            });
        }

        // 자동 재시도 기능 직접 구현 (CSP 안전)
        initAutoRetryForOverlay(overlay, originalUrl);
    }, 200);
}

// 오버레이용 자동 재시도 기능 구현 (CSP 안전)
function initAutoRetryForOverlay(overlay, originalUrl) {
    // 현재 오류 코드 감지
    const titleElement = overlay.querySelector('h1, title');
    const errorCode = titleElement ? titleElement.textContent.match(/\d{3}/)?.[0] : '404';
    
    // 오류 코드별 재시도 간격 설정
    const retryIntervals = {
        '404': 30000, // 30초
        '500': 20000, // 20초
        '502': 15000, // 15초
        '503': 25000, // 25초
        '504': 20000, // 20초
        '429': 60000, // 60초 (Too Many Requests)
        '400': 45000, // 45초
        '401': 30000, // 30초
        '403': 45000  // 45초
    };
    
    const interval = retryIntervals[errorCode] || 30000;
    let retryCount = 0;
    let successCount = 0; // 연속 성공 카운트
    let nextRetryTime = Date.now() + interval;
    const maxRetries = 20; // 최대 재시도 횟수
    const requiredSuccessCount = 3; // 복구 판단을 위한 연속 성공 횟수
    
    // 상태 표시 요소 찾기 또는 생성
    let statusElement = overlay.querySelector('#autoRetryStatus');
    if (!statusElement) {
        statusElement = document.createElement('div');
        statusElement.id = 'autoRetryStatus';
        statusElement.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 107, 157, 0.9);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 0.9em;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(255, 107, 157, 0.3);
            transition: all 0.3s ease;
            max-width: 80%;
            text-align: center;
        `;
        overlay.appendChild(statusElement);
    }
    
    // 카운트다운 표시 요소
    let countdownElement = overlay.querySelector('#autoRetryCountdown');
    if (!countdownElement) {
        countdownElement = document.createElement('div');
        countdownElement.id = 'autoRetryCountdown';
        countdownElement.style.cssText = `
            position: fixed;
            bottom: 70px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 255, 255, 0.9);
            color: #ff6b9d;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: 500;
            z-index: 1000;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        `;
        overlay.appendChild(countdownElement);
    }
    
    // 수동 제어 버튼들 추가
    let controlsElement = overlay.querySelector('#autoRetryControls');
    if (!controlsElement) {
        controlsElement = document.createElement('div');
        controlsElement.id = 'autoRetryControls';
        controlsElement.style.cssText = `
            position: fixed;
            bottom: 120px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            z-index: 1000;
        `;
        
        const pauseBtn = document.createElement('button');
        pauseBtn.id = 'pauseAutoRetry';
        pauseBtn.textContent = '⏸️ 자동확인 중지';
        pauseBtn.style.cssText = `
            background: rgba(108, 117, 125, 0.9);
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 15px;
            font-size: 0.8em;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        const manualBtn = document.createElement('button');
        manualBtn.id = 'manualCheck';
        manualBtn.textContent = '🔍 지금 확인';
        manualBtn.style.cssText = `
            background: rgba(40, 167, 69, 0.9);
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 15px;
            font-size: 0.8em;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        controlsElement.appendChild(pauseBtn);
        controlsElement.appendChild(manualBtn);
        overlay.appendChild(controlsElement);
    }
    
    let autoRetryPaused = false;
    
    // 페이지 상태 확인 함수 (더 정확한 확인)
    async function checkPageStatus() {
        try {
            // 실제 GET 요청으로 페이지 내용 확인 (더 정확함)
            const response = await fetch(originalUrl, { 
                method: 'GET',
                cache: 'no-cache',
                credentials: 'same-origin'
            });
            
            // 응답이 성공적이고 HTML 내용이 있는지 확인
            if (response.ok && response.status >= 200 && response.status < 400) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('text/html')) {
                    const text = await response.text();
                    // 실제 HTML 내용이 있고 오류 페이지가 아닌지 확인
                    if (text.length > 500 && !text.includes('404') && !text.includes('error')) {
                        return true;
                    }
                }
            }
            return false;
        } catch (error) {
            // 네트워크 오류 등으로 실패
            return false;
        }
    }
    
    // 카운트다운 업데이트 함수
    function updateCountdown() {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((nextRetryTime - now) / 1000));
        
        if (remaining > 0 && !autoRetryPaused) {
            countdownElement.textContent = `다음 자동 확인까지: ${remaining}초`;
            countdownElement.style.display = 'block';
        } else {
            countdownElement.style.display = 'none';
        }
    }
    
    // 자동 재시도 실행
    async function performAutoRetry() {
        if (autoRetryPaused) return;
        
        retryCount++;
        
        if (retryCount > maxRetries) {
            statusElement.textContent = `❌ 최대 재시도 횟수 초과 (${maxRetries}회)`;
            statusElement.style.background = 'rgba(220, 53, 69, 0.9)';
            clearInterval(window.autoRetryTimer);
            return;
        }
        
        statusElement.textContent = `🔄 페이지 상태 확인 중... (${retryCount}/${maxRetries})`;
        statusElement.style.background = 'rgba(255, 193, 7, 0.9)';
        
        const isFixed = await checkPageStatus();
        
        if (isFixed) {
            successCount++;
            statusElement.textContent = `✅ 페이지 응답 확인 (${successCount}/${requiredSuccessCount})`;
            statusElement.style.background = 'rgba(40, 167, 69, 0.9)';
            
            if (successCount >= requiredSuccessCount) {
                statusElement.textContent = `🌸 페이지 복구 확인! 원래 페이지로 이동합니다...`;
                console.log('🌸 페이지가 안정적으로 복구되었습니다. 원래 페이지로 이동합니다!');
                
                // 약간의 지연 후 이동 (사용자가 메시지를 볼 수 있도록)
                setTimeout(() => {
                    window.location.href = originalUrl;
                }, 2000);
                return;
            }
        } else {
            successCount = 0; // 실패 시 성공 카운트 리셋
            nextRetryTime = Date.now() + interval;
            statusElement.textContent = `⏰ 아직 복구 안됨. 대기 중... (${retryCount}/${maxRetries})`;
            statusElement.style.background = 'rgba(255, 107, 157, 0.9)';
        }
    }
    
    // 수동 확인 함수
    async function performManualCheck() {
        statusElement.textContent = `🔍 수동으로 페이지 상태 확인 중...`;
        statusElement.style.background = 'rgba(255, 193, 7, 0.9)';
        
        const isFixed = await checkPageStatus();
        
        if (isFixed) {
            statusElement.textContent = `✅ 페이지가 정상적으로 로드됩니다!`;
            statusElement.style.background = 'rgba(40, 167, 69, 0.9)';
            
            setTimeout(() => {
                window.location.href = originalUrl;
            }, 1500);
        } else {
            statusElement.textContent = `❌ 아직 페이지에 문제가 있습니다`;
            statusElement.style.background = 'rgba(220, 53, 69, 0.9)';
            
            setTimeout(() => {
                statusElement.textContent = `⏰ 자동 재시도 대기 중... (${retryCount}/${maxRetries})`;
                statusElement.style.background = 'rgba(255, 107, 157, 0.9)';
            }, 3000);
        }
    }
    
    // 버튼 이벤트 리스너
    const pauseBtn = controlsElement.querySelector('#pauseAutoRetry');
    const manualBtn = controlsElement.querySelector('#manualCheck');
    
    pauseBtn.addEventListener('click', function() {
        autoRetryPaused = !autoRetryPaused;
        if (autoRetryPaused) {
            pauseBtn.textContent = '▶️ 자동확인 재시작';
            statusElement.textContent = '⏸️ 자동 재시도가 일시 중지되었습니다';
            statusElement.style.background = 'rgba(108, 117, 125, 0.9)';
        } else {
            pauseBtn.textContent = '⏸️ 자동확인 중지';
            statusElement.textContent = '▶️ 자동 재시도를 재시작했습니다';
            statusElement.style.background = 'rgba(255, 107, 157, 0.9)';
            nextRetryTime = Date.now() + 5000; // 5초 후 재시작
        }
    });
    
    manualBtn.addEventListener('click', performManualCheck);
    
    // 초기 상태 표시
    statusElement.textContent = `⏰ 자동 재시도 준비 중... (최대 ${maxRetries}회)`;
    
    // 첫 번째 재시도까지의 카운트다운 시작
    const countdownTimer = setInterval(updateCountdown, 1000);
    
    // 자동 재시도 타이머 시작
    window.autoRetryTimer = setInterval(async () => {
        await performAutoRetry();
    }, interval);
    
    // 컴포넌트 정리 시 타이머들도 정리
    const originalRemoveFunction = window.removeCuteErrorOverlay;
    window.removeCuteErrorOverlay = function() {
        clearInterval(window.autoRetryTimer);
        clearInterval(countdownTimer);
        window.autoRetryTimer = null;
        if (originalRemoveFunction) {
            originalRemoveFunction();
        }
    };
    
    // 즉시 첫 번째 확인 실행 (5초 후)
    setTimeout(performAutoRetry, 5000);
}

// 🎀 양력 기념일 템플릿 맵
const solarSpecialDates = {
    '01-01': 'new_years_day.html',
    '02-14': 'valentines_day.html',
    '03-14': 'white_day.html',
    '04-14': 'black_day.html',
    '05-05': 'children_day.html',
    '06-14': 'rose_day.html',
    '07-07': 'silver_day.html',
    '08-08': 'green_day.html',
    '10-31': 'halloween.html',
    '11-11': 'pepero_day.html',
    '12-25': 'christmas.html',
};

// 🎊 기념일 확인 함수
function getSpecialTemplateIfAny() {
    const today = new Date();
    const key = getTodayKey(); // 'MM-DD' 형식 (ex: '02-14')
    
    // 양력 기념일 확인
    if (solarSpecialDates[key]) {
        return solarSpecialDates[key];
    }
    
    // 음력 기념일은 일단 생략 (필요시 추가)
    return null;
}

// 메시지 리스너
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    if (msg.type === 'SHOW_CUTE_ERROR') {
        const code = String(msg.code);
        let templatePath;

        // 원래 URL 저장 (CSP 안전하게)
        const originalUrl = window.location.href;
        
        // 🎉 기념일 우선 렌더링
        const special = getSpecialTemplateIfAny();
        if (special) {
            templatePath = `templates/special/${special}`;
        } else {
            // 랜덤 템플릿 로딩
            const templatesMap = {
                '404': ['404html1.html', '404html2.html', '404html3.html'],
                '500': ['index.html'],
                '503': ['index.html'],
                '502': ['index.html'],
                '403': ['index.html'],
                '401': ['index.html'],
                '400': ['index.html'],
                '429': ['index.html'],
                '504': ['index.html']
            };

            // Get templates for current error code or default to index.html
            const templates = templatesMap[code] || ['index.html'];
            const candidates = templates.map(file => `templates/${code}/${file}`);
            templatePath = getRandomTemplate(candidates);
        }

        try {
            const html = await fetch(chrome.runtime.getURL(templatePath)).then(res => res.text());
            
            // 원래 타이틀 백업
            const originalTitle = document.title;
            
            // React 앱 감지
            const isReact = isReactApp();
            
            if (isReact) {
                // React 앱인 경우 안전한 오버레이 방식 사용
                console.log(`🌸 React 앱 감지! 안전한 오버레이로 귀여운 오류 페이지 표시 (${code}) - 원래 URL: ${originalUrl}`);
                createSafeOverlay(html, originalUrl);
            } else {
                // 일반 페이지인 경우 기존 방식 사용
                console.log(`🌸 일반 페이지로 귀여운 오류 페이지 교체 (${code}) - 원래 URL: ${originalUrl}`);
                
                // HTML에 원래 URL을 안전하게 삽입 (CSP 친화적 방법)
                const modifiedHtml = html.replace(
                    /<script>/,
                    `<script>
                        // CSP 안전한 방법으로 원래 URL 저장
                        try {
                            window.originalErrorUrl = "${originalUrl.replace(/"/g, '\\"')}";
                        } catch (e) {
                            window.originalErrorUrl = window.location.href;
                        }
                    `
                );
                
                // 페이지 교체
                document.documentElement.innerHTML = modifiedHtml;
                
                // 타이틀 복원
                setTimeout(() => { 
                    document.title = originalTitle || `오류 ${code}`;
                }, 100);
            }
            
        } catch (error) {
            console.error('템플릿 로딩 실패:', error);
            
            // React 앱인 경우 안전한 폴백 오버레이
            if (isReactApp()) {
                createSimpleFallbackOverlay(code, originalUrl);
            } else {
                // 일반 페이지용 폴백
                createFallbackPage(code, originalUrl);
            }
        }
    }
});

// 간단한 폴백 오버레이 (CSP 안전)
function createSimpleFallbackOverlay(code, originalUrl) {
    // 기존 오버레이 제거
    const existingOverlay = document.getElementById('cute-error-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }

    // 오버레이 컨테이너 생성
    const overlay = document.createElement('div');
    overlay.id = 'cute-error-overlay';
    overlay.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        z-index: 2147483647 !important;
        background: linear-gradient(135deg, #ff9a9e, #fecfef) !important;
        overflow-y: auto !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
    `;

    // 컨테이너 생성
    const container = document.createElement('div');
    container.style.cssText = `
        background: white !important;
        border-radius: 20px !important;
        padding: 40px !important;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
        max-width: 500px !important;
        width: 90% !important;
        text-align: center !important;
    `;

    // 내용 추가
    container.innerHTML = `
        <div style="font-size: 4em; margin-bottom: 20px;">🐰</div>
        <h1 style="color: #ff6b9d; font-size: 3em; margin-bottom: 20px;">오류 ${code}</h1>
        <p style="color: #666; font-size: 1.2em; margin-bottom: 15px;">뭔가 잘못되었지만... 귀엽게 넘어가자~!</p>
        <p style="color: #888; font-size: 0.9em; margin-bottom: 30px;">템플릿을 불러올 수 없어서 기본 페이지예요 🌸</p>
        <div style="margin-top: 20px;">
            <button id="retryBtn" style="background: linear-gradient(135deg, #ff6b9d, #ff8fab); color: white; border: none; padding: 15px 30px; border-radius: 25px; font-size: 1.1em; font-weight: 500; cursor: pointer; margin: 10px; transition: all 0.3s ease;">🔄 다시 시도하기</button>
            <button id="closeBtn" style="background: linear-gradient(135deg, #ff6b9d, #ff8fab); color: white; border: none; padding: 15px 30px; border-radius: 25px; font-size: 1.1em; font-weight: 500; cursor: pointer; margin: 10px; transition: all 0.3s ease;">❌ 닫기</button>
        </div>
        <div style="margin-top: 20px; font-size: 0.9em; color: #888;">
            💡 ESC 키를 누르면 이 페이지를 닫을 수 있어요
        </div>
    `;

    overlay.appendChild(container);
    document.body.appendChild(overlay);

    // 원래 URL 저장
    window.originalErrorUrl = originalUrl;
    
    // 이벤트 리스너 설정
    setupOverlayEventListeners(overlay, originalUrl);
}

// 일반 페이지용 폴백
function createFallbackPage(code, originalUrl) {
    const safeOriginalUrl = originalUrl.replace(/"/g, '\\"');
    document.documentElement.innerHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>오류 ${code}</title>
            <style>
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
                    text-align: center; 
                    padding: 50px;
                    background: linear-gradient(135deg, #ff9a9e, #fecfef);
                    min-height: 100vh;
                    margin: 0;
                }
                .container {
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    display: inline-block;
                    margin-top: 50px;
                }
                h1 { color: #ff6b9d; font-size: 3em; margin-bottom: 20px; }
                p { color: #666; font-size: 1.2em; }
                .emoji { font-size: 4em; margin-bottom: 20px; }
                .retry-btn {
                    background: linear-gradient(135deg, #ff6b9d, #ff8fab);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 25px;
                    font-size: 1.1em;
                    font-weight: 500;
                    cursor: pointer;
                    margin: 10px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="emoji">🐰</div>
                <h1>오류 ${code}</h1>
                <p>뭔가 잘못되었지만... 귀엽게 넘어가자~!</p>
                <p><small>템플릿을 불러올 수 없어서 기본 페이지예요 🌸</small></p>
                <div style="margin-top: 20px;">
                    <button class="retry-btn" id="retryBtn">🔄 다시 시도하기</button>
                    <button class="retry-btn" id="backBtn">⬅️ 뒤로 가기</button>
                </div>
            </div>
            <script>
                (function() {
                    window.originalErrorUrl = "${safeOriginalUrl}";
                    
                    document.addEventListener('DOMContentLoaded', function() {
                        const retryBtn = document.getElementById('retryBtn');
                        const backBtn = document.getElementById('backBtn');
                        
                        if (retryBtn) {
                            retryBtn.addEventListener('click', function() {
                                window.location.reload();
                            });
                        }
                        
                        if (backBtn) {
                            backBtn.addEventListener('click', function() {
                                window.history.back();
                            });
                        }
                    });
                })();
            </script>
        </body>
        </html>
    `;
}
