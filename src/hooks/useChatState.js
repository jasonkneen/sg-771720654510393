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
  }, [chatHistory]);

  useEffect(() => {
    if (settings.autoSave) {
      saveChatSessions(chatHistory);
    }
  }, [chatHistory, settings.autoSave]);

  const updateChatHistory = useCallback((updater) => {
    setChatHistory((prevHistory) => {
      const newHistory = updater(prevHistory);
      chatHistoryRef.current = newHistory;
      return newHistory;
    });
  }, []);

  const handleSend = useCallback(async (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      setIsLoading(true);
      setProgress(0);
      const userMessage = { sender: 'user', content: input };
      updateChatHistory((prevHistory) => {
        const newHistory = [...prevHistory];
        newHistory[currentChatIndex] = {
          ...newHistory[currentChatIndex],
          messages: [...newHistory[currentChatIndex].messages, userMessage]
        };
        return newHistory;
      });
      setInput('');

      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 10;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 200);

      try {
        const messages = chatHistoryRef.current[currentChatIndex].messages.concat(userMessage);
        const aiResponse = await callOpenAI(messages, OPENAI_CONFIG.apiKey);
        const aiMessage = { sender: 'ai', content: aiResponse };
        updateChatHistory((prevHistory) => {
          const newHistory = [...prevHistory];
          newHistory[currentChatIndex] = {
            ...newHistory[currentChatIndex],
            messages: [...newHistory[currentChatIndex].messages, aiMessage]
          };
          return newHistory;
        });
      } catch (error) {
        handleError(error, 'Error in AI response');
        toast({
          title: 'Error',
          description: 'Failed to get AI response. Please try again.',
          variant: 'destructive',
        });
      } finally {
        clearInterval(progressInterval);
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          setProgress(0);
        }, 500);
      }
    }
  }, [input, isLoading, currentChatIndex, toast, updateChatHistory]);

  const handleNewChat = useCallback(() => {
    setIsCreatingChat(true);
    const newChat = { id: Date.now(), name: `New Chat ${chatHistoryRef.current.length + 1}`, messages: [] };
    updateChatHistory((prevHistory) => [...prevHistory, newChat]);
    setCurrentChatIndex(chatHistoryRef.current.length);
    setTimeout(() => setIsCreatingChat(false), 300);
  }, [updateChatHistory]);

  const handleSelectChat = useCallback((index) => {
    setIsSwitchingChat(true);
    setCurrentChatIndex(index);
    setTimeout(() => setIsSwitchingChat(false), 300);
  }, []);

  const handleRenameChat = useCallback((index, newName) => {
    updateChatHistory((prevHistory) => {
      const newHistory = [...prevHistory];
      newHistory[index].name = newName;
      return newHistory;
    });
  }, [updateChatHistory]);

  const handleDeleteChat = useCallback((index) => {
    updateChatHistory((prevHistory) => {
      const newHistory = prevHistory.filter((_, i) => i !== index);
      if (newHistory.length === 0) {
        newHistory.push({ id: Date.now(), name: 'New Chat', messages: [] });
      }
      return newHistory;
    });
    if (currentChatIndex >= index && currentChatIndex > 0) {
      setCurrentChatIndex(currentChatIndex - 1);
    }
  }, [currentChatIndex, updateChatHistory]);

  const handleClearHistory = useCallback(() => {
    updateChatHistory(() => [{ id: Date.now(), name: 'New Chat', messages: [] }]);
    setCurrentChatIndex(0);
    clearChatSessions();
    toast({
      title: 'Chat History Cleared',
      description: 'Your chat history has been cleared.',
    });
  }, [toast, updateChatHistory]);

  const handleSettingsChange = useCallback((newSettings) => {
    setSettings(newSettings);
  }, []);

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