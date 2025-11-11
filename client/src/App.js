import React from 'react';
import TypingGame from './components/TypingGame';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>🎮 儿童打字游戏 🎮</h1>
        <p>练习打字，提高速度！</p>
      </header>
      <main>
        <TypingGame />
      </main>
      <footer className="app-footer">
        <p>加油！继续练习！💪</p>
      </footer>
    </div>
  );
}

export default App;
