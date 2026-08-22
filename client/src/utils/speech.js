let currentUtterance = null;

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

export const isSpeechSupported = () => {
  return typeof window !== 'undefined' && !!window.speechSynthesis;
};

export const speakText = (text, langCode = 'en', onStart = null, onEnd = null, onError = null) => {
  if (!isSpeechSupported()) {
    if (onError) onError('not_supported');
    return;
  }

  // Cancel any running speech before starting new speech
  stopSpeech();

  if (!text || !text.trim()) {
    if (onEnd) onEnd();
    return;
  }

  const synth = window.speechSynthesis;
  
  // Clean markdown syntax like asterisks or hashtags from the text to read it cleanly
  const cleanedText = text
    .replace(/\*+/g, '')
    .replace(/#+/g, '')
    .replace(/`+/g, '')
    .trim();

  const utterance = new SpeechSynthesisUtterance(cleanedText);
  currentUtterance = utterance;

  // Set language code mapping
  let targetLang = 'en-IN';
  if (langCode === 'hi') targetLang = 'hi-IN';

  utterance.lang = targetLang;

  // Find matching voice
  const voices = synth.getVoices();
  let matchedVoice = voices.find(
    v => v.lang.toLowerCase() === targetLang.toLowerCase() || 
         v.lang.toLowerCase().replace('_', '-') === targetLang.toLowerCase()
  );

  if (!matchedVoice) {
    // Fallback: look for generic language prefix (e.g. "hi-" or "en-")
    matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(langCode.toLowerCase()));
  }

  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    if (currentUtterance === utterance) {
      currentUtterance = null;
    }
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    // If cancelled manually, e.error will be 'interrupted' or 'removed'
    if (e.error === 'interrupted' || e.error === 'removed') {
      if (onEnd) onEnd();
      return;
    }
    console.error('SpeechSynthesisUtterance error:', e);
    if (currentUtterance === utterance) {
      currentUtterance = null;
    }
    if (onError) onError(e);
  };

  synth.speak(utterance);
};
