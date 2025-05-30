const express = require('express');
const app = express();
const port = 3000;

// Serve static files from the project root
app.use(express.static('../'));

// Test routes for different error pages
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>🌸 귀여운 오류 페이지 테스터 🌸</title>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body { 
          font-family: 'Noto Sans KR', sans-serif;
          background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
          min-height: 100vh;
          padding: 20px;
        }
        
        .container {
          max-width: 1000px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
        }
        
        h1 {
          text-align: center;
          color: #ff6b9d;
          margin-bottom: 10px;
          font-size: 2.5em;
          font-weight: 700;
        }
        
        .subtitle {
          text-align: center;
          color: #999;
          margin-bottom: 30px;
          font-size: 1.1em;
        }
        
        .error-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .error-card {
          background: #fff;
          border: 2px solid #ff9a9e;
          border-radius: 15px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .error-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(255, 107, 157, 0.3);
          border-color: #ff6b9d;
        }
        
        .error-icon {
          font-size: 3em;
          margin-bottom: 10px;
        }
        
        .error-code {
          font-size: 1.5em;
          font-weight: 700;
          color: #ff6b9d;
          margin-bottom: 5px;
        }
        
        .error-name {
          color: #666;
          margin-bottom: 10px;
          font-weight: 500;
        }
        
        .error-desc {
          font-size: 0.9em;
          color: #999;
          line-height: 1.4;
        }
        
        .test-section {
          background: #f8f9fa;
          border-radius: 15px;
          padding: 20px;
          margin-top: 20px;
        }
        
        .test-section h3 {
          color: #ff6b9d;
          margin-bottom: 15px;
          font-size: 1.3em;
        }
        
        .btn-group {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 25px;
          background: #ff9a9e;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        
        .btn:hover {
          background: #ff6b9d;
          transform: scale(1.05);
        }
        
        .status {
          margin-top: 20px;
          padding: 15px;
          border-radius: 10px;
          background: #e3f2fd;
          border-left: 4px solid #2196f3;
          display: none;
        }
        
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #999;
          font-size: 0.9em;
        }
        
        .new-badge {
          background: #ff6b9d;
          color: white;
          font-size: 0.7em;
          padding: 2px 6px;
          border-radius: 10px;
          margin-left: 5px;
          vertical-align: top;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🌸 귀여운 오류 페이지 테스터 🌸</h1>
        <p class="subtitle">크롬 확장 프로그램이 다양한 오류 코드를 귀엽게 바꿔주는지 테스트해보세요!</p>
        
        <div class="error-grid">
          <div class="error-card" onclick="testError(400)">
            <div class="error-icon">🤔</div>
            <div class="error-code">400 <span class="new-badge">NEW</span></div>
            <div class="error-name">Bad Request</div>
            <div class="error-desc">요청이 이상해요! 물음표가 떠다녀요</div>
          </div>
          
          <div class="error-card" onclick="testError(401)">
            <div class="error-icon">🔒</div>
            <div class="error-code">401</div>
            <div class="error-name">Unauthorized</div>
            <div class="error-desc">로그인이 필요해요!</div>
          </div>
          
          <div class="error-card" onclick="testError(403)">
            <div class="error-icon">🚫</div>
            <div class="error-code">403</div>
            <div class="error-name">Forbidden</div>
            <div class="error-desc">접근 권한이 없어요!</div>
          </div>
          
          <div class="error-card" onclick="testError(404)">
            <div class="error-icon">🐰</div>
            <div class="error-code">404</div>
            <div class="error-name">Not Found</div>
            <div class="error-desc">페이지가 도망갔어요! (3가지 버전)</div>
          </div>
          
          <div class="error-card" onclick="testError(429)">
            <div class="error-icon">😵‍💫</div>
            <div class="error-code">429 <span class="new-badge">NEW</span></div>
            <div class="error-name">Too Many Requests</div>
            <div class="error-desc">너무 많이 요청했어요! 카운트다운 포함</div>
          </div>
          
          <div class="error-card" onclick="testError(500)">
            <div class="error-icon">🐣</div>
            <div class="error-code">500</div>
            <div class="error-name">Server Error</div>
            <div class="error-desc">서버가 열받았대요!</div>
          </div>
          
          <div class="error-card" onclick="testError(502)">
            <div class="error-icon">🌐</div>
            <div class="error-code">502</div>
            <div class="error-name">Bad Gateway</div>
            <div class="error-desc">게이트웨이가 삐끗했어요!</div>
          </div>
          
          <div class="error-card" onclick="testError(503)">
            <div class="error-icon">🛠️</div>
            <div class="error-code">503</div>
            <div class="error-name">Service Unavailable</div>
            <div class="error-desc">서비스가 잠깐 쉬고 있어요!</div>
          </div>
          
          <div class="error-card" onclick="testError(504)">
            <div class="error-icon">😴</div>
            <div class="error-code">504 <span class="new-badge">NEW</span></div>
            <div class="error-name">Gateway Timeout</div>
            <div class="error-desc">게이트웨이가 늦잠 중! 구름과 Z 애니메이션</div>
          </div>
        </div>
        
        <div class="test-section">
          <h3>🎯 빠른 테스트</h3>
          <div class="btn-group">
            <button class="btn" onclick="randomError()">랜덤 오류 🎲</button>
            <button class="btn" onclick="testMultiple()">연속 테스트 🔄</button>
            <button class="btn" onclick="testNewErrors()">새 오류들만 테스트 ✨</button>
            <button class="btn" onclick="window.open('/custom-error', '_blank')">커스텀 오류 🎨</button>
          </div>
        </div>
        
        <div id="status" class="status"></div>
        
        <div class="footer">
          💡 확장 프로그램이 설치되고 활성화되어 있는지 확인해주세요!<br>
          각 오류 카드를 클릭하면 새 탭에서 해당 오류 페이지가 열립니다.<br>
          🆕 새로 추가된 오류: 400, 429, 504
        </div>
      </div>
      
      <script>
        function testError(code) {
          showStatus('오류 ' + code + ' 테스트 중... 🚀');
          window.open('/error-test/' + code, '_blank');
        }
        
        function randomError() {
          const codes = [401, 403, 404, 500, 502, 503];
          const randomCode = codes[Math.floor(Math.random() * codes.length)];
          testError(randomCode);
        }
        
        function testMultiple() {
          const codes = [404, 500, 403];
          showStatus('연속 테스트 시작! 잠깐 기다려주세요... ⏰');
          
          codes.forEach((code, index) => {
            setTimeout(() => {
              window.open('/error-test/' + code, '_blank');
            }, index * 1000);
          });
        }
        
        function showStatus(message) {
          const status = document.getElementById('status');
          status.textContent = message;
          status.style.display = 'block';
          
          setTimeout(() => {
            status.style.display = 'none';
          }, 3000);
        }
      </script>
    </body>
    </html>
  `);
});

// Error simulation endpoints
app.get('/error-test/:code', (req, res) => {
  const code = parseInt(req.params.code);
  const messages = {
    401: '🔒 로그인이 필요한 페이지예요!',
    403: '🚫 접근 권한이 없어요!',
    404: '🐰 페이지를 찾을 수 없어요!',
    500: '🐣 서버 내부 오류가 발생했어요!',
    502: '🌐 게이트웨이 오류예요!',
    503: '🛠️ 서비스를 일시적으로 사용할 수 없어요!'
  };
  
  res.status(code).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Error ${code}</title>
      <style>
        body { 
          font-family: 'Noto Sans KR', sans-serif;
          text-align: center; 
          padding: 50px;
          background: #f5f5f5;
        }
        h1 { color: #ff6b9d; }
      </style>
    </head>
    <body>
      <h1>오류 ${code}</h1>
      <p>${messages[code] || '알 수 없는 오류가 발생했어요!'}</p>
      <p><small>이 페이지가 귀여운 오류 페이지로 바뀌어야 해요! 📱</small></p>
    </body>
    </html>
  `);
});

// Custom error page for testing
app.get('/custom-error', (req, res) => {
  const customCode = req.query.code || 418;
  res.status(customCode).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>커스텀 오류 ${customCode}</title>
      <style>
        body { 
          font-family: 'Noto Sans KR', sans-serif;
          text-align: center; 
          padding: 50px;
          background: linear-gradient(45deg, #ff9a9e, #fecfef);
        }
      </style>
    </head>
    <body>
      <h1>🫖 I'm a teapot (${customCode})</h1>
      <p>커스텀 오류 페이지 테스트용이에요!</p>
    </body>
    </html>
  `);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: '테스트 서버가 잘 돌아가고 있어요! 🌸',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(port, () => {
  console.log('🌸 귀여운 오류 페이지 테스트 서버가 시작되었어요!');
  console.log(`📍 URL: http://localhost:${port}`);
  console.log('🔧 크롬에서 확장 프로그램을 활성화한 후 테스트해보세요!');
  console.log('💡 Ctrl+C로 서버를 종료할 수 있어요.');
});