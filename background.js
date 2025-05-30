// 💡 background.js - 오류 응답 감지
chrome.webRequest.onCompleted.addListener(
    function (details) {
        const errorCodes = [400, 401, 403, 404, 429, 500, 502, 503, 504];
        if (errorCodes.includes(details.statusCode)) {
            chrome.tabs.sendMessage(details.tabId, {
                type: 'SHOW_CUTE_ERROR',
                code: details.statusCode
            });
        }
    },
    { urls: ['<all_urls>'] },
    []
);
