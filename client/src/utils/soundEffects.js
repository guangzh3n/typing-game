// 音效工具 - 使用 Web Audio API 生成可爱的音效

let audioContext = null;
let soundEnabled = true; // 默认开启声音

// 设置声音开关
export const setSoundEnabled = (enabled) => {
  soundEnabled = enabled;
};

// 获取声音状态
export const isSoundEnabled = () => {
  return soundEnabled;
};

// 初始化音频上下文（需要用户交互）
const initAudioContext = () => {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.log('无法初始化音频上下文:', error);
    }
  }
  // 如果音频上下文被暂停（某些浏览器需要用户交互），尝试恢复
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
};

// 播放答对音效 - 可爱的上升音调（C-E-G 和弦）
export const playCorrectSound = () => {
  if (!soundEnabled) return; // 如果声音关闭，不播放
  
  try {
    initAudioContext();
    if (!audioContext) return;

    const now = audioContext.currentTime;
    
    // 创建三个音符同时播放，形成和弦效果
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
    const oscillators = [];
    const gainNodes = [];

    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = 'sine'; // 正弦波，声音更柔和
      oscillator.frequency.setValueAtTime(freq, now);

      // 设置音量包络 - 渐入渐出，每个音符稍微延迟
      const delay = index * 0.02;
      gainNode.gain.setValueAtTime(0, now + delay);
      gainNode.gain.linearRampToValueAtTime(0.15, now + delay + 0.05);
      gainNode.gain.linearRampToValueAtTime(0.15, now + delay + 0.2);
      gainNode.gain.linearRampToValueAtTime(0, now + delay + 0.3);

      oscillator.start(now + delay);
      oscillator.stop(now + delay + 0.3);

      oscillators.push(oscillator);
      gainNodes.push(gainNode);
    });
  } catch (error) {
    console.log('无法播放音效:', error);
  }
};

// 播放答错音效 - 低沉的下降音调
export const playIncorrectSound = () => {
  if (!soundEnabled) return; // 如果声音关闭，不播放
  
  try {
    initAudioContext();
    if (!audioContext) return;

    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // 设置音调 - 低沉的下降音
    oscillator.type = 'sawtooth'; // 锯齿波，声音更粗糙
    oscillator.frequency.setValueAtTime(392.00, now); // G4
    oscillator.frequency.setValueAtTime(329.63, now + 0.15); // E4
    oscillator.frequency.setValueAtTime(261.63, now + 0.3); // C4

    // 设置音量包络
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.05);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.35);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.45);

    oscillator.start(now);
    oscillator.stop(now + 0.45);
  } catch (error) {
    console.log('无法播放音效:', error);
  }
};

