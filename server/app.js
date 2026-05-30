/**
 * Luxmind 访问计数服务
 * 轻量 API，JSON 文件持久化，无外部依赖
 *
 * API:
 *   GET  /api/visits                     → { count: number }
 *   POST /api/visits/increment           → { count: number }   (+1)
 *   GET  /api/visits?increment=true      → { count: number }   (+1, 兼容 GET)
 *
 * 启动:
 *   node app.js              (开发, 端口 3456)
 *   PORT=3456 node app.js    (自定义端口)
 *   pm2 start app.js --name luxmind-visits  (生产)
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3456;

// --- 持久化存储 ---
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'visits.json');

// 确保 data 目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readCount() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw).count || 0;
  } catch {
    return 0;
  }
}

function writeCount(count) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ count }), 'utf-8');
}

// --- Express app ---
const app = express();
app.use(express.json());

// CORS — 只允许 luxmind.cn 和本地开发
const allowedOrigins = [
  'https://luxmind.cn',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5500',   // Live Server
  undefined,                   // 同源请求
];

app.use(cors({
  origin: (origin, callback) => {
    // 允许无 origin 的请求（同源/服务端）
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // 宽松模式，实际生产可收紧
    }
  },
}));

// --- Routes ---

// GET /api/visits — 获取当前计数
// GET /api/visits?increment=true — 获取并 +1
app.get('/api/visits', (req, res) => {
  const shouldIncrement = req.query.increment === 'true';

  if (shouldIncrement) {
    const count = readCount() + 1;
    writeCount(count);
    return res.json({ count });
  }

  res.json({ count: readCount() });
});

// POST /api/visits/increment — +1 并返回新计数
app.post('/api/visits/increment', (req, res) => {
  const count = readCount() + 1;
  writeCount(count);
  res.json({ count });
});

// --- Health check ---
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// --- 启动 ---
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[luxmind-visits] 服务运行在 http://0.0.0.0:${PORT}`);
  console.log(`[luxmind-visits] 当前计数: ${readCount()}`);
});
