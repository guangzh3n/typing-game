const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { wordData, getWordWithEmoji } = require('./wordData');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/words', (req, res) => {
  const level = req.query.level || 'easy';
  const count = parseInt(req.query.count) || 10;
  
  const words = wordData[level] || wordData.easy;
  const selectedWords = [];
  const usedIndices = new Set();
  
  // 随机选择单词，确保不重复
  while (selectedWords.length < count && selectedWords.length < words.length) {
    const randomIndex = Math.floor(Math.random() * words.length);
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      selectedWords.push({
        word: words[randomIndex].word,
        emoji: words[randomIndex].emoji
      });
    }
  }
  
  res.json({ words: selectedWords, level });
});

app.get('/api/levels', (req, res) => {
  res.json({
    levels: [
      { id: 'easy', name: '简单', description: '3-4 个字母的单词' },
      { id: 'medium', name: '中等', description: '5-6 个字母的单词' },
      { id: 'hard', name: '困难', description: '7+ 个字母的单词' }
    ]
  });
});

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服务器运行正常' });
});

// 在开发环境中，提供静态文件服务
if (process.env.NODE_ENV === 'production') {
  // 提供静态文件
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  // 所有其他路由都返回 React 应用
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
});
