"use client";

import { useState, FormEvent, useRef } from "react";
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
import { chatAPI, diagnosisAPINew, reportAPINew } from "@/lib/api";

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
  const [, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type - only accept text files and PDFs
    const allowedTypes = ['text/plain', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a text file (.txt) or PDF file (.pdf) containing your symptoms or medical report.');
      return;
    }

    setAttachedFile(file);
    setIsLoading(true);

    try {
      if (file.type === 'text/plain') {
        // Read text file and send to diagnosis API
        const text = await file.text();
        if (text.trim()) {
          await processDiagnosis(text);
        }
      } else if (file.type === 'application/pdf') {
        // Send PDF file to report API
        await processReportUpload(file);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I'm sorry, I couldn't process the uploaded file. Please try typing your symptoms instead.",
        sender: "ai",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setAttachedFile(null);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const processReportUpload = async (file: File) => {
    // Add user message showing the uploaded report
    const userMessage: Message = {
      id: Date.now().toString(),
      content: `📄 Medical report uploaded: ${file.name}`,
      sender: "user",
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Call report API
      const response = await reportAPINew.uploadReport(file);
      const diagnosis = response.data;

      // Format the diagnosis response as a comprehensive message
      const diagnosisContent = `
🔍 **Report Analysis**: ${diagnosis.diagnosis}

💊 **Recommended Medications**:
${diagnosis.medications.map(med => `• ${med.name}: ${med.description}`).join('\n')}

👨‍⚕️ **Specialist Consultation**: ${diagnosis.specialist}

🥗 **Dietary Suggestions**:
${diagnosis.dietary_suggestions.map(suggestion => `• ${suggestion}`).join('\n')}

⚠️ **Disclaimer**: ${diagnosis.disclaimer}
      `.trim();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: diagnosisContent,
        sender: "ai",
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: unknown) {
      console.error('Error processing report:', error);
      
      let errorContent = "I apologize, but I'm having trouble analyzing your medical report right now. Please try again or consult with a healthcare provider.";
      
      // Enhanced error handling for local debugging
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { error?: string } }; code?: string };
        console.log('Error details:', axiosError.response?.data);
        console.log('Error status:', axiosError.response?.status);
        
        if (axiosError.response?.status === 400) {
          errorContent = "There was an issue with the uploaded file. Please make sure it's a valid PDF file.";
        } else if (axiosError.response?.status === 500) {
          const serverError = axiosError.response?.data?.error || 'Server error';
          errorContent = `Server error: ${serverError}. Check the backend console for more details.`;
        } else if (axiosError.code === 'ECONNREFUSED' || axiosError.code === 'NETWORK_ERROR') {
          errorContent = "Cannot connect to the backend server. Make sure the backend is running on localhost:6969.";
        }
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: errorContent,
        sender: "ai",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const processDiagnosis = async (symptoms: string) => {
    // Add user message showing the symptoms from file
    const userMessage: Message = {
      id: Date.now().toString(),
      content: `📄 Symptoms from uploaded file: ${symptoms.substring(0, 200)}${symptoms.length > 200 ? '...' : ''}`,
      sender: "user",
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Call diagnosis API
      const response = await diagnosisAPINew.getDiagnosis({ symptoms });
      const diagnosis = response.data;

      // Format the diagnosis response as a comprehensive message
      const diagnosisContent = `
🔍 **Diagnosis**: ${diagnosis.diagnosis}

💊 **Recommended Medications**:
${diagnosis.medications.map(med => `• ${med.name}: ${med.description}`).join('\n')}

👨‍⚕️ **Specialist Consultation**: ${diagnosis.specialist}

🥗 **Dietary Suggestions**:
${diagnosis.dietary_suggestions.map(suggestion => `• ${suggestion}`).join('\n')}

⚠️ **Disclaimer**: ${diagnosis.disclaimer}
      `.trim();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: diagnosisContent,
        sender: "ai",
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: unknown) {
      console.error('Error getting diagnosis:', error);
      
      let errorContent = "I apologize, but I'm having trouble analyzing your symptoms right now. Please try again or consult with a healthcare provider.";
      
      // Enhanced error handling for local debugging
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { error?: string } }; code?: string };
        console.log('Diagnosis error details:', axiosError.response?.data);
        console.log('Diagnosis error status:', axiosError.response?.status);
        
        if (axiosError.response?.status === 400) {
          errorContent = "Please provide valid symptoms for analysis.";
        } else if (axiosError.response?.status === 500) {
          const serverError = axiosError.response?.data?.error || 'Server error';
          errorContent = `Server error: ${serverError}. Check the backend console for more details.`;
        } else if (axiosError.code === 'ECONNREFUSED' || axiosError.code === 'NETWORK_ERROR') {
          errorContent = "Cannot connect to the backend server. Make sure the backend is running on localhost:6969.";
        }
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: errorContent,
        sender: "ai",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
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
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".txt,.pdf"
            className="hidden"
          />
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
