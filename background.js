// 💡 background.js - 오류 응답 감지
chrome.webRequest.onCompleted.addListener(
    function (details) {
        const errorCodes = [400, 401, 403, 404, 429, 500, 502, 503, 504];
        if (errorCodes.includes(details.statusCode)) {
            // content script가 준비될 때까지 잠시 기다린 후 메시지 전송
            setTimeout(() => {
                chrome.tabs.sendMessage(details.tabId, {
                    type: 'SHOW_CUTE_ERROR',
                    code: details.statusCode
                }).catch(error => {
                    // 메시지 전송 실패 시 무시 (content script가 없거나 준비되지 않음)
                    console.log('Content script 메시지 전송 실패 (정상):', error.message);
                });
            }, 100);
        }
    },
    { urls: ['<all_urls>'] },
    []
);
