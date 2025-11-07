'use client';

import { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceMicrophoneButtonProps {
  onClick: () => void;
  isRecording: boolean;
  disabled?: boolean;
  className?: string;
}

export function VoiceMicrophoneButton({
  onClick,
  isRecording,
  disabled = false,
  className = ''
}: VoiceMicrophoneButtonProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        type="button"
        disabled={true}
      >
        <Mic className="size-4" />
      </Button>
    );
  }

  const isSupported = typeof window !== 'undefined' && 
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  return (
    <Button
      variant="ghost"
      size="icon"
      type="button"
      onClick={onClick}
      disabled={disabled || !isSupported}
      className={`${isRecording ? "text-red-500 animate-pulse" : ""} ${className}`}
      title={
        !isSupported 
          ? "Voice input not supported in this browser" 
          : isRecording 
          ? "Click to stop recording" 
          : "Click to start voice input"
      }
    >
      {isRecording ? (
        <MicOff className="size-4" />
      ) : (
        <Mic className="size-4" />
      )}
    </Button>
  );
}
