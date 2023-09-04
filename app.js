import express from 'express';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import indexRouter from './routes/index.js';

// ES6 방식으로 __filename과 __dirname을 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3017;

// 정적 파일을 제공하기 위한 설정
app.use(express.static(path.join(__dirname, 'public')));

// posts.html 파일을 특정 라우트에 연결
// 주의: 이 라우트는 API 라우트보다 먼저 정의되어야 합니다.

// JSON을 파싱하기 위한 미들웨어 설정
app.use(express.json());
app.get('/posts/:postId', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/posts.html'));
});
// API 라우터 설정
app.use('/api', indexRouter);

// 서버 시작
app.listen(PORT, () => {
  console.log(`${PORT} 포트로 서버가 열렸어요!`);
});
