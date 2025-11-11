import React, { useState, useEffect, useRef } from 'react';
import LevelSelector from './LevelSelector';
import GameStats from './GameStats';
import ScoreBoard from './ScoreBoard';
import { playCorrectSound, playIncorrectSound, setSoundEnabled, isSoundEnabled } from '../utils/soundEffects';
import { speakLetter, speakWord, initSpeech, stopAllSpeech, setSpeechEnabled, isSpeechEnabled } from '../utils/speechUtils';
import './TypingGame.css';

const TypingGame = () => {
  const [level, setLevel] = useState('easy');
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isGameActive, setIsGameActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [incorrectWords, setIncorrectWords] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [soundOn, setSoundOn] = useState(true); // 声音开关状态
  const [showScoreBoard, setShowScoreBoard] = useState(false); // 显示分数表
  const [gameCompleted, setGameCompleted] = useState(false); // 游戏是否完成
  const inputRef = useRef(null);
  const intervalRef = useRef(null);

  // 获取单词 - 固定20个
  const fetchWords = async (selectedLevel) => {
    try {
      const response = await fetch(`/api/words?level=${selectedLevel}&count=20`);
      const data = await response.json();
      // API 返回的是包含 word 和 emoji 的对象数组
      setWords(data.words);
      setCurrentWordIndex(0);
      setUserInput('');
      setGameCompleted(false);
      setShowScoreBoard(false);
    } catch (error) {
      console.error('获取单词失败:', error);
      // 如果 API 失败，使用备用单词（带 emoji）
      const fallbackWords = {
        easy: [
          { word: 'cat', emoji: '🐱' },
          { word: 'dog', emoji: '🐶' },
          { word: 'bird', emoji: '🐦' },
          { word: 'fish', emoji: '🐟' },
          { word: 'tree', emoji: '🌳' }
        ],
        medium: [
          { word: 'rabbit', emoji: '🐰' },
          { word: 'panda', emoji: '🐼' },
          { word: 'apple', emoji: '🍎' },
          { word: 'banana', emoji: '🍌' },
          { word: 'orange', emoji: '🍊' }
        ],
        hard: [
          { word: 'elephant', emoji: '🐘' },
          { word: 'butterfly', emoji: '🦋' },
          { word: 'watermelon', emoji: '🍉' },
          { word: 'pineapple', emoji: '🍍' },
          { word: 'cactus', emoji: '🌵' }
        ]
      };
      setWords(fallbackWords[selectedLevel] || fallbackWords.easy);
    }
  };

  // 开始游戏
  const startGame = () => {
    // 初始化音频上下文（在用户点击时）
    if (typeof window !== 'undefined' && window.AudioContext) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
      } catch (error) {
        console.log('音频初始化:', error);
      }
    }

    // 初始化语音合成
    initSpeech();

    setIsGameActive(true);
    setTimeElapsed(0);
    setCorrectWords(0);
    setIncorrectWords(0);
    setCurrentWordIndex(0);
    setUserInput('');
    setGameCompleted(false);
    setShowScoreBoard(false);
    fetchWords(level);
    inputRef.current?.focus();

    // 开始计时
    intervalRef.current = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
  };

  // 停止游戏
  const stopGame = () => {
    setIsGameActive(false);
    stopAllSpeech(); // 停止所有语音
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // 重置游戏
  const resetGame = () => {
    stopGame();
    stopAllSpeech(); // 停止所有语音
    setTimeElapsed(0);
    setCorrectWords(0);
    setIncorrectWords(0);
    setCurrentWordIndex(0);
    setUserInput('');
    setWpm(0);
    setAccuracy(100);
    setGameCompleted(false);
    setShowScoreBoard(false);
  };

  // 处理下一个单词的逻辑
  const moveToNextWord = (isCorrect, word) => {
    // 确保 word 是字符串
    const wordStr = typeof word === 'string' ? word : (word?.word || '');
    
    if (isCorrect) {
      setCorrectWords((prev) => prev + 1);
      // 播放答对音效
      playCorrectSound();
      // 说出单词的发音
      setTimeout(() => {
        speakWord(wordStr);
      }, 300); // 稍微延迟，让音效先播放
    } else {
      setIncorrectWords((prev) => prev + 1);
      // 播放答错音效
      playIncorrectSound();
    }
    
    setCurrentWordIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex >= words.length) {
        // 完成所有20个单词，游戏结束
        setIsGameActive(false);
        setGameCompleted(true);
        setShowScoreBoard(true);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        return prev; // 保持在最后一个索引
      }
      return nextIndex;
    });
    setUserInput('');
  };

  // 处理输入变化
  const handleInputChange = (e) => {
    if (!isGameActive) return;

    const value = e.target.value;
    const previousValue = userInput;
    
    // 检测新输入的字母
    if (value.length > previousValue.length) {
      const newLetter = value[value.length - 1];
      // 只播放字母（不是空格或其他字符）
      if (/[a-zA-Z]/.test(newLetter)) {
        speakLetter(newLetter);
      }
    }
    
    setUserInput(value);

    const currentWord = words[currentWordIndex]?.word || words[currentWordIndex];
    
    // 检查是否完成当前单词（通过空格）
    if (value.endsWith(' ')) {
      const trimmedValue = value.trim();
      const wordToCompare = typeof currentWord === 'string' ? currentWord : currentWord.word;
      if (trimmedValue === wordToCompare) {
        // 正确
        moveToNextWord(true, wordToCompare);
      } else {
        // 错误
        moveToNextWord(false, wordToCompare);
      }
    }
  };

  // 处理键盘按键（支持 Enter 键）
  const handleKeyDown = (e) => {
    if (!isGameActive) return;

    const currentWordObj = words[currentWordIndex];
    const currentWord = typeof currentWordObj === 'string' ? currentWordObj : currentWordObj?.word;
    const trimmedInput = userInput.trim();

    // 如果按 Enter 键
    if (e.key === 'Enter' && trimmedInput.length > 0) {
      e.preventDefault(); // 防止表单提交
      
      if (trimmedInput === currentWord) {
        // 正确
        moveToNextWord(true, currentWord);
      } else {
        // 错误
        moveToNextWord(false, currentWord);
      }
    }
  };

  // 计算 WPM 和准确率
  useEffect(() => {
    if (isGameActive && timeElapsed > 0) {
      const totalWords = correctWords + incorrectWords;
      const minutes = timeElapsed / 60;
      const calculatedWpm = totalWords > 0 ? Math.round(correctWords / minutes) : 0;
      const calculatedAccuracy = totalWords > 0 
        ? Math.round((correctWords / totalWords) * 100) 
        : 100;
      
      setWpm(calculatedWpm);
      setAccuracy(calculatedAccuracy);
    }
  }, [correctWords, incorrectWords, timeElapsed, isGameActive]);

  // 当难度改变时，重新获取单词
  useEffect(() => {
    if (words.length === 0) {
      fetchWords(level);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  // 初始化语音（组件加载时）
  useEffect(() => {
    initSpeech();
    // 同步初始状态
    setSoundEnabled(soundOn);
    setSpeechEnabled(soundOn);
  }, []);

  // 切换声音开关
  const toggleSound = () => {
    const newState = !soundOn;
    setSoundOn(newState);
    setSoundEnabled(newState);
    setSpeechEnabled(newState);
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      stopAllSpeech(); // 清理时停止所有语音
    };
  }, []);

  const currentWordObj = words[currentWordIndex] || {};
  const currentWord = typeof currentWordObj === 'string' ? currentWordObj : (currentWordObj.word || '');
  const currentEmoji = typeof currentWordObj === 'string' ? '' : (currentWordObj.emoji || '');
  const displayWords = words.slice(currentWordIndex, currentWordIndex + 5);

  return (
    <div className="typing-game">
      <div className="game-header-controls">
        <LevelSelector 
          level={level} 
          setLevel={setLevel} 
          disabled={isGameActive}
        />
        <button 
          className={`sound-toggle-button ${soundOn ? 'sound-on' : 'sound-off'}`}
          onClick={toggleSound}
          title={soundOn ? '关闭声音' : '开启声音'}
        >
          {soundOn ? '🔊 声音开启' : '🔇 声音关闭'}
        </button>
      </div>

      <div className="game-container">
        {!isGameActive ? (
          <div className="game-start">
            <button className="start-button" onClick={startGame}>
              🚀 开始游戏
            </button>
            <p className="instruction">
              选择难度后点击开始，然后开始打字！<br />
              💡 提示：输入完单词后按空格或 Enter 键跳到下一个单词
            </p>
          </div>
        ) : (
          <>
            <div className="words-display">
              {displayWords.map((wordObj, index) => {
                const word = typeof wordObj === 'string' ? wordObj : wordObj.word;
                const emoji = typeof wordObj === 'string' ? '' : wordObj.emoji;
                return (
                  <div
                    key={`${word}-${currentWordIndex + index}`}
                    className={`word-card ${
                      index === 0 ? 'current-word' : ''
                    }`}
                  >
                    <div className="word-emoji">{emoji}</div>
                    <div className="word-text">{word}</div>
                  </div>
                );
              })}
            </div>

            <div className="input-container">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="typing-input"
                placeholder="开始打字... (按空格或 Enter 跳到下一个单词)"
                autoFocus
              />
            </div>

            <div className="current-word-hint">
              <div className="current-word-display">
                <span className="hint-emoji">{currentEmoji}</span>
                <p>当前单词: <strong>{currentWord}</strong></p>
              </div>
            </div>

            <div className="game-controls">
              <button className="stop-button" onClick={stopGame}>
                ⏸️ 暂停
              </button>
              <button className="reset-button" onClick={resetGame}>
                🔄 重置
              </button>
            </div>
          </>
        )}
      </div>

      <GameStats
        timeElapsed={timeElapsed}
        correctWords={correctWords}
        incorrectWords={incorrectWords}
        wpm={wpm}
        accuracy={accuracy}
        isGameActive={isGameActive}
      />

      {showScoreBoard && (
        <ScoreBoard
          correctWords={correctWords}
          incorrectWords={incorrectWords}
          timeElapsed={timeElapsed}
          wpm={wpm}
          accuracy={accuracy}
          onPlayAgain={() => {
            setShowScoreBoard(false);
            resetGame();
            setTimeout(() => {
              startGame();
            }, 100);
          }}
          onClose={() => {
            setShowScoreBoard(false);
          }}
        />
      )}
    </div>
  );
};

export default TypingGame;

