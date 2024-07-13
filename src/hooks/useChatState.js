import { useState, useCallback, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { saveChatSessions, loadChatSessions, clearChatSessions } from '@/utils/chatStorage';
import { callOpenAI } from '@/utils/openai';
import { OPENAI_CONFIG } from '@/config/openai';
import { handleError } from '@/utils/errorHandler';

export const useChatState = (initialSettings = { autoSave: true }) => {
  const [chatHistory, setChatHistory] = useState(() => loadChatSessions());
  const [currentChatIndex, setCurrentChatIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchingChat, setIsSwitchingChat] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [settings, setSettings] = useState(initialSettings);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const chatHistoryRef = useRef(chatHistory);

  useEffect(() => {
    chatHistoryRef.current = chatHistory;
    console.log('Chat history updated:', chatHistory); // Debug log
  }, [chatHistory]);

  useEffect(() => {
    if (settings.autoSave) {
      saveChatSessions(chatHistory);
      console.log('Chat sessions saved:', chatHistory); // Debug log
    }
  }, [chatHistory, settings.autoSave]);

  const updateChatHistory = useCallback((updater) => {
    setChatHistory((prevHistory) => {
      const newHistory = updater(prevHistory);
      chatHistoryRef.current = newHistory;
      console.log('Chat history updated:', newHistory); // Debug log
      return newHistory;
    });
  }, []);

  // ... (rest of the code remains the same)

  return {
    chatHistory,
    currentChatIndex,
    input,
    setInput,
    isLoading,
    isSwitchingChat,
    isCreatingChat,
    settings,
    progress,
    handleSend,
    handleNewChat,
    handleSelectChat,
    handleRenameChat,
    handleDeleteChat,
    handleClearHistory,
    handleSettingsChange,
    updateChatHistory,
  };
};

export default useChatState;