// frontend/src/setupProxy.js

/**
 * @typedef {import('http-proxy-middleware').ProxyMiddleware} ProxyMiddleware
 * @typedef {import('express').Application} ExpressApp
 */

// CommonJS module.exports for Node.js environment
const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * @param {ExpressApp} app
 */
module.exports = function(app) {
  // 로컬 개발 환경에서 백엔드 API 호출 (Docker 컨테이너를 로컬에서 직접 띄웠을 때)
  // Docker Desktop이 localhost:8485 요청을 백엔드 컨테이너로 라우팅해줍니다.
  const localTarget = 'http://localhost:8485';

  // Docker Compose 환경에서 백엔드 API 호출 (프론트엔드 컨테이너에서 백엔드 컨테이너로)
  // 'backend'는 docker-compose.yml에 정의된 백엔드 서비스의 이름입니다.
  const dockerTarget = 'http://backend:8485';

  // 환경 변수를 사용하여 개발 환경에 따라 동적으로 target을 설정합니다.
  // process.env.REACT_APP_API_PROXY_TARGET 이 설정되어 있지 않으면 localTarget 사용
  const target = process.env.REACT_APP_API_PROXY_TARGET || localTarget;

  console.log(`[Proxy] API requests will be proxied to: ${target}`);

  app.use(
    '/api', // 프록시할 경로 (예: 모든 /api로 시작하는 요청)
    createProxyMiddleware({
      target: target,
      changeOrigin: true, // 대상 서버의 호스트 헤더를 변경
      logLevel: 'debug', // 프록시 요청 로그 확인 (디버깅에 유용)
      onProxyReq: (proxyReq, req, res) => {
        // 프록시 요청이 백엔드로 전달되기 직전에 로깅
        console.log(`[Proxy] Requesting: ${req.method} ${req.url} -> ${target}${req.url}`);
      },
      onError: (err, req, res) => {
        console.error('[Proxy] Proxy error:', err);
        res.status(500).send('Proxy Error');
      }
    })
  );
};