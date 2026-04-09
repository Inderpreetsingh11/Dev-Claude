#!/usr/bin/env node
/**
 * CORS proxy for Ollama — runs on port 11435
 * Forwards all requests to Ollama on 11434 and adds CORS headers.
 * Usage: node cors-proxy.js
 */
const http = require('http');

const PORT = 11435;
const OLLAMA_HOST = 'localhost';
const OLLAMA_PORT = 11434;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

const server = http.createServer((req, res) => {
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  const options = {
    hostname: OLLAMA_HOST,
    port: OLLAMA_PORT,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: `${OLLAMA_HOST}:${OLLAMA_PORT}` },
  };

  const proxy = http.request(options, (proxyRes) => {
    const headers = { ...proxyRes.headers, ...CORS_HEADERS };
    res.writeHead(proxyRes.statusCode, headers);
    proxyRes.pipe(res);
  });

  req.pipe(proxy);

  proxy.on('error', (err) => {
    console.error('Proxy error:', err.message);
    if (!res.headersSent) {
      res.writeHead(502, CORS_HEADERS);
      res.end('Proxy error: ' + err.message);
    }
  });
});

server.listen(PORT, () => {
  console.log(`✅ CORS proxy running on port ${PORT}`);
  console.log(`   Forwarding to Ollama on port ${OLLAMA_PORT}`);
  console.log(`   Tunnel cloudflared to: http://localhost:${PORT}`);
});
