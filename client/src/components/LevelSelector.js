import React from 'react';
import './LevelSelector.css';

const LevelSelector = ({ level, setLevel, disabled }) => {
  const levels = [
    { id: 'easy', name: '简单', emoji: '⭐', color: '#4CAF50' },
    { id: 'medium', name: '中等', emoji: '⭐⭐', color: '#FF9800' },
    { id: 'hard', name: '困难', emoji: '⭐⭐⭐', color: '#F44336' }
  ];

  return (
    <div className="level-selector">
      <h3>选择难度：</h3>
      <div className="level-buttons">
        {levels.map((lvl) => (
          <button
            key={lvl.id}
            className={`level-button ${level === lvl.id ? 'active' : ''}`}
            onClick={() => !disabled && setLevel(lvl.id)}
            disabled={disabled}
            style={{
              backgroundColor: level === lvl.id ? lvl.color : '#f0f0f0',
              color: level === lvl.id ? 'white' : '#333',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled && level !== lvl.id ? 0.5 : 1
            }}
          >
            <span className="level-emoji">{lvl.emoji}</span>
            <span className="level-name">{lvl.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LevelSelector;

