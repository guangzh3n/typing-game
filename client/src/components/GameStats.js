import React from 'react';
import './GameStats.css';

const GameStats = ({ timeElapsed, correctWords, incorrectWords, wpm, accuracy, isGameActive }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-stats">
      <h3>📊 游戏统计</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-value">{formatTime(timeElapsed)}</div>
          <div className="stat-label">时间</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{correctWords}</div>
          <div className="stat-label">正确</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-value">{incorrectWords}</div>
          <div className="stat-label">错误</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-value">{wpm}</div>
          <div className="stat-label">WPM</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">{accuracy}%</div>
          <div className="stat-label">准确率</div>
        </div>
      </div>
      {isGameActive && (
        <div className="encouragement">
          <p>💪 加油！继续努力！</p>
        </div>
      )}
    </div>
  );
};

export default GameStats;

