import { useState, useRef, useCallback, useEffect } from 'react';

// Type definitions for Web Speech API
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

export function useSpeechRecognition(
  onResult?: (transcript: string) => void,
  onError?: (error: string) => void,
  continuous = false,
  language = 'en-US'
) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Check speech recognition support on mount
  useEffect(() => {
    const checkSupport = () => {
      const windowWithSpeech = window as unknown as {
        SpeechRecognition?: new () => SpeechRecognitionInstance;
        webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
      };
      const SpeechRecognition = 
        windowWithSpeech.SpeechRecognition || 
        windowWithSpeech.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setIsSupported(true);
        console.log('Speech recognition is supported');
      } else {
        setIsSupported(false);
        console.log('Speech recognition is not supported in this browser');
      }
    };

    checkSupport();
  }, []);

  const initializeRecognition = useCallback(() => {
    if (typeof window === 'undefined') return false;
    
    const windowWithSpeech = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionInstance;
      webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
    };
    const SpeechRecognition = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return false;
    }

    const recognition = new SpeechRecognition() as SpeechRecognitionInstance;
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
      }

      if (finalTranscript) {
        onResult?.(finalTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      onError?.(event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    setIsSupported(true);
    return true;
  }, [continuous, language, onResult, onError]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current && !initializeRecognition()) {
      onError?.('Speech recognition not supported');
      return;
    }

    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch {
        onError?.('Failed to start speech recognition');
      }
    }
  }, [isListening, initializeRecognition, onError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    toggleListening
  };
}
