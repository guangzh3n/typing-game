// 语音工具 - 使用 Web Speech API 实现文字转语音

let speechEnabled = true; // 默认开启语音

// 设置语音开关
export const setSpeechEnabled = (enabled) => {
  speechEnabled = enabled;
  if (!enabled) {
    stopAllSpeech(); // 关闭时停止所有语音
  }
};

// 获取语音状态
export const isSpeechEnabled = () => {
  return speechEnabled;
};

// 检查浏览器是否支持语音合成
const isSpeechSupported = () => {
  return 'speechSynthesis' in window;
};

// 获取语音合成对象
const getSpeechSynthesis = () => {
  if (!isSpeechSupported()) {
    return null;
  }
  return window.speechSynthesis;
};

// 停止当前所有语音
export const stopAllSpeech = () => {
  const synth = getSpeechSynthesis();
  if (synth) {
    synth.cancel();
  }
};

// 说出字母的发音
export const speakLetter = (letter) => {
  if (!speechEnabled) return; // 如果语音关闭，不播放
  
  const synth = getSpeechSynthesis();
  if (!synth || !letter) return;

  // 停止之前的语音（字母发音应该立即响应）
  synth.cancel();

  // 使用小写字母，避免读出 "capital"
  const letterToSpeak = letter.toLowerCase();
  const utterance = new SpeechSynthesisUtterance(letterToSpeak);
  
  // 设置语音参数 - 更可爱的声音
  utterance.lang = 'en-US'; // 英语
  utterance.rate = 0.85; // 稍微慢一点，更清晰可爱
  utterance.pitch = 1.5; // 更高的音调，更可爱（范围 0-2）
  utterance.volume = 0.95; // 稍微大一点的音量

  // 尝试使用儿童友好的语音（优先选择女性或儿童语音）
  const voices = synth.getVoices();
  
  // 优先选择列表（按优先级排序）
  const preferredVoices = voices.filter(voice => 
    voice.name.includes('Child') || 
    voice.name.includes('Kid') ||
    voice.name.includes('Samantha') || // macOS 友好的女性语音
    voice.name.includes('Karen') || // macOS 友好的女性语音
    voice.name.includes('Google UK English Female') ||
    voice.name.includes('Google US English Female') ||
    voice.name.includes('Microsoft Zira') || // Windows 友好的女性语音
    voice.name.includes('Microsoft Hazel') || // Windows 友好的女性语音
    (voice.name.includes('Female') && voice.lang.startsWith('en'))
  );
  
  // 如果没有找到首选语音，尝试找任何女性语音
  if (preferredVoices.length === 0) {
    const femaleVoices = voices.filter(voice => 
      voice.name.toLowerCase().includes('female') ||
      voice.name.toLowerCase().includes('woman') ||
      voice.name.toLowerCase().includes('girl')
    );
    if (femaleVoices.length > 0) {
      utterance.voice = femaleVoices[0];
    } else if (voices.length > 0) {
      // 最后使用第一个可用的语音
      utterance.voice = voices[0];
    }
  } else {
    utterance.voice = preferredVoices[0];
  }

  synth.speak(utterance);
};

// 说出单词的发音
export const speakWord = (word) => {
  if (!speechEnabled) return; // 如果语音关闭，不播放
  
  const synth = getSpeechSynthesis();
  if (!synth || !word) return;

  // 停止之前的语音
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(word);
  
  // 设置语音参数 - 单词发音要慢一点，清晰一点
  utterance.lang = 'en-US';
  utterance.rate = 0.75; // 稍微慢一点，让儿童能听清楚
  utterance.pitch = 1.2; // 稍微高一点，更友好
  utterance.volume = 1.0; // 最大音量

  // 尝试使用儿童友好的语音
  const voices = synth.getVoices();
  const preferredVoices = voices.filter(voice => 
    voice.name.includes('Child') || 
    voice.name.includes('Kid') ||
    voice.name.includes('Google UK English Female') ||
    voice.name.includes('Samantha') ||
    voice.name.includes('Alex') ||
    voice.name.includes('Karen') // macOS 的友好语音
  );
  
  if (preferredVoices.length > 0) {
    utterance.voice = preferredVoices[0];
  } else if (voices.length > 0) {
    // 如果没有找到首选语音，使用第一个可用的
    utterance.voice = voices[0];
  }

  synth.speak(utterance);
};

// 初始化语音（加载语音列表）
export const initSpeech = () => {
  const synth = getSpeechSynthesis();
  if (!synth) return;

  // 某些浏览器需要等待语音列表加载
  if (synth.getVoices().length === 0) {
    synth.addEventListener('voiceschanged', () => {
      // 语音列表已加载
    });
  }
};

