const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// 简单的单词库 - 适合儿童
const wordLists = {
  easy: [
    'cat', 'dog', 'sun', 'moon', 'star', 'tree', 'bird', 'fish', 'book', 'ball',
    'car', 'bus', 'hat', 'cup', 'pen', 'red', 'blue', 'green', 'big', 'small',
    'happy', 'sad', 'run', 'jump', 'play', 'sing', 'dance', 'read', 'write', 'draw'
  ],
  medium: [
    'apple', 'banana', 'orange', 'grape', 'water', 'house', 'school', 'friend', 'family',
    'mother', 'father', 'sister', 'brother', 'happy', 'smile', 'laugh', 'music', 'piano',
    'guitar', 'dance', 'sport', 'soccer', 'basketball', 'swimming', 'reading', 'writing',
    'drawing', 'painting', 'cooking', 'eating', 'sleeping', 'waking', 'morning', 'evening'
  ],
  hard: [
    'beautiful', 'wonderful', 'amazing', 'fantastic', 'adventure', 'journey', 'explore',
    'discover', 'imagine', 'creative', 'curious', 'excited', 'delicious', 'comfortable',
    'butterfly', 'elephant', 'dinosaur', 'rainbow', 'sunshine', 'mountain', 'ocean',
    'forest', 'garden', 'library', 'hospital', 'restaurant', 'airport', 'station'
  ]
};

// API Routes
app.get('/api/words', (req, res) => {
  const level = req.query.level || 'easy';
  const count = parseInt(req.query.count) || 10;
  
  const words = wordLists[level] || wordLists.easy;
  const selectedWords = [];
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    selectedWords.push(words[randomIndex]);
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
