"use client";

import { useState, FormEvent } from "react";
import { Bot, CornerDownLeft, Paperclip, Mic, MicOff } from "lucide-react";
import { ClientTimestamp } from "@/components/ClientTimestamp";
import { Button } from "@/components/ui/button";
import { useSpeechRecognition } from "@/components/hooks/use-speech-recognition";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble";
import { ChatInput } from "@/components/ui/chat-input";
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "@/components/ui/expandable-chat";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { chatAPI } from "@/lib/api";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export function KarunaExpandableChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI medical assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date()
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

    // Speech recognition functionality
  const handleSpeechResult = (transcript: string) => {
    setInput(transcript);
    console.log('Voice input received:', transcript);
  };

  const handleSpeechError = (error: string) => {
    console.error('Speech recognition error:', error);
  };

  const {
    isListening,
    isSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition(
    handleSpeechResult,
    handleSpeechError,
    false, // continuous
    'en-US' // language
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = input;
    setInput("");
    setIsLoading(true);

    try {
      // Start session if we don't have one
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        const sessionResponse = await chatAPI.startSession();
        currentSessionId = sessionResponse.data.sessionId;
        setSessionId(currentSessionId);
      }

      // Send message to API
      const response = await chatAPI.sendMessage({
        sessionId: currentSessionId,
        message: messageToSend
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.reply || "I received your message. How else can I help you?",
        sender: "ai",
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble connecting right now. Please try again later.",
        sender: "ai",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttachFile = () => {
    // Future implementation for file attachments
    console.log("File attachment feature coming soon!");
  };

  const handleMicrophoneClick = () => {
    if (!isSupported) {
      console.log("Voice input is not supported in this browser");
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <ExpandableChat
      size="lg"
      position="bottom-right"
      icon={<Bot className="h-6 w-6" />}
    >
      <ExpandableChatHeader className="flex-col text-center justify-center">
        <h1 className="text-xl font-semibold">Karuna AI Assistant ✨</h1>
        <p className="text-sm text-muted-foreground">
          Your medical AI assistant for health questions and guidance
        </p>
      </ExpandableChatHeader>

      <ExpandableChatBody>
        <ChatMessageList smooth>
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              variant={message.sender === "user" ? "sent" : "received"}
            >
              <ChatBubbleAvatar
                className="h-8 w-8 shrink-0"
                src={
                  message.sender === "user"
                    ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&crop=faces&fit=crop"
                    : "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=64&h=64&q=80&crop=faces&fit=crop"
                }
                fallback={message.sender === "user" ? "YU" : "AI"}
              />
              <ChatBubbleMessage
                variant={message.sender === "user" ? "sent" : "received"}
              >
                {message.content}
                <ClientTimestamp 
                  timestamp={message.timestamp} 
                  className="text-xs mt-1 opacity-70 block" 
                />
              </ChatBubbleMessage>
            </ChatBubble>
          ))}

          {isLoading && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar
                className="h-8 w-8 shrink-0"
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=64&h=64&q=80&crop=faces&fit=crop"
                fallback="AI"
              />
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}
        </ChatMessageList>
      </ExpandableChatBody>

      <ExpandableChatFooter>
        <form
          onSubmit={handleSubmit}
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
        >
          <ChatInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about symptoms, medications, or health concerns..."
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          
          {/* Voice Status Indicator */}
          {isListening && (
            <div className="text-xs text-blue-600 px-3">
              🎤 Listening... Click microphone to stop
            </div>
          )}          <div className="flex items-center p-3 pt-0 justify-between">
            <div className="flex">
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={handleAttachFile}
                disabled={isLoading}
              >
                <Paperclip className="size-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={handleMicrophoneClick}
                disabled={isLoading}
                className={isListening ? "text-red-500 animate-pulse" : ""}
              >
                {isListening ? (
                  <MicOff className="size-4" />
                ) : (
                  <Mic className="size-4" />
                )}
              </Button>
            </div>
            <Button 
              type="submit" 
              size="sm" 
              className="ml-auto gap-1.5"
              disabled={!input.trim() || isLoading}
            >
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </ExpandableChatFooter>
    </ExpandableChat>
  );
}
