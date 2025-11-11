import React from 'react';
import './ScoreBoard.css';

const ScoreBoard = ({ correctWords, incorrectWords, timeElapsed, wpm, accuracy, onPlayAgain, onClose }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 根据准确率计算等级和评价
  const getGrade = () => {
    if (accuracy >= 95) return { grade: 'S+', emoji: '🌟', color: '#FFD700', message: '完美！你是打字大师！' };
    if (accuracy >= 90) return { grade: 'S', emoji: '⭐', color: '#FFA500', message: '太棒了！几乎完美！' };
    if (accuracy >= 80) return { grade: 'A', emoji: '🎉', color: '#4CAF50', message: '优秀！做得很好！' };
    if (accuracy >= 70) return { grade: 'B', emoji: '👍', color: '#2196F3', message: '不错！继续加油！' };
    if (accuracy >= 60) return { grade: 'C', emoji: '😊', color: '#FF9800', message: '还可以！多练习会更好！' };
    return { grade: 'D', emoji: '💪', color: '#F44336', message: '加油！多练习会进步的！' };
  };

  const gradeInfo = getGrade();
  const totalWords = correctWords + incorrectWords;

  return (
    <div className="scoreboard-overlay">
      <div className="scoreboard-container">
        <div className="scoreboard-header">
          <h1 className="scoreboard-title">🎊 游戏结束！🎊</h1>
          <div className="grade-display" style={{ color: gradeInfo.color }}>
            <div className="grade-emoji">{gradeInfo.emoji}</div>
            <div className="grade-letter">{gradeInfo.grade}</div>
          </div>
          <p className="grade-message">{gradeInfo.message}</p>
        </div>

        <div className="scoreboard-stats">
          <div className="stat-row highlight">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <div className="stat-label">正确单词</div>
              <div className="stat-value big">{correctWords}</div>
            </div>
          </div>

          <div className="stat-row">
            <div className="stat-icon">❌</div>
            <div className="stat-info">
              <div className="stat-label">错误单词</div>
              <div className="stat-value">{incorrectWords}</div>
            </div>
          </div>

          <div className="stat-row highlight">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <div className="stat-label">总单词数</div>
              <div className="stat-value big">{totalWords}</div>
            </div>
          </div>

          <div className="stat-row highlight">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <div className="stat-label">准确率</div>
              <div className="stat-value big" style={{ color: gradeInfo.color }}>
                {accuracy}%
              </div>
            </div>
          </div>

          <div className="stat-row">
            <div className="stat-icon">⚡</div>
            <div className="stat-info">
              <div className="stat-label">打字速度</div>
              <div className="stat-value">{wpm} WPM</div>
            </div>
          </div>

          <div className="stat-row">
            <div className="stat-icon">⏱️</div>
            <div className="stat-info">
              <div className="stat-label">用时</div>
              <div className="stat-value">{formatTime(timeElapsed)}</div>
            </div>
          </div>
        </div>

        <div className="scoreboard-actions">
          <button className="play-again-button" onClick={onPlayAgain}>
            🎮 再玩一次
          </button>
          <button className="close-button" onClick={onClose}>
            ✖️ 关闭
          </button>
        </div>

        <div className="celebration">
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} className="confetti" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}>
              {['🎉', '🎊', '⭐', '🌟', '✨', '💫', '🎈', '🎁'][Math.floor(Math.random() * 8)]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;

