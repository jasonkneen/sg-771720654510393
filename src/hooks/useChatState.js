import { useState, useCallback, useEffect } from 'react';
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

  useEffect(() => {
    if (settings.autoSave) {
      saveChatSessions(chatHistory);
    }
  }, [chatHistory, settings.autoSave]);

  const handleSend = useCallback(async (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      setIsLoading(true);
      setProgress(0);
      const userMessage = { sender: 'user', content: input };
      setChatHistory((prev) => {
        const newHistory = [...prev];
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
        const messages = chatHistory[currentChatIndex].messages.concat(userMessage);
        const aiResponse = await callOpenAI(messages, OPENAI_CONFIG.apiKey);
        const aiMessage = { sender: 'ai', content: aiResponse };
        setChatHistory((prev) => {
          const newHistory = [...prev];
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
  }, [input, isLoading, currentChatIndex, chatHistory, toast]);

  const handleNewChat = useCallback(() => {
    setIsCreatingChat(true);
    const newChat = { id: Date.now(), name: `New Chat ${chatHistory.length + 1}`, messages: [] };
    setChatHistory((prev) => [...prev, newChat]);
    setCurrentChatIndex(chatHistory.length);
    setTimeout(() => setIsCreatingChat(false), 300);
  }, [chatHistory.length]);

  const handleSelectChat = useCallback((index) => {
    setIsSwitchingChat(true);
    setCurrentChatIndex(index);
    setTimeout(() => setIsSwitchingChat(false), 300);
  }, []);

  const handleRenameChat = useCallback((index, newName) => {
    setChatHistory((prev) => {
      const newHistory = [...prev];
      newHistory[index].name = newName;
      return newHistory;
    });
  }, []);

  const handleDeleteChat = useCallback((index) => {
    setChatHistory((prev) => {
      const newHistory = prev.filter((_, i) => i !== index);
      if (newHistory.length === 0) {
        newHistory.push({ id: Date.now(), name: 'New Chat', messages: [] });
      }
      return newHistory;
    });
    if (currentChatIndex >= index && currentChatIndex > 0) {
      setCurrentChatIndex(currentChatIndex - 1);
    }
  }, [currentChatIndex]);

  const handleClearHistory = useCallback(() => {
    setChatHistory([{ id: Date.now(), name: 'New Chat', messages: [] }]);
    setCurrentChatIndex(0);
    clearChatSessions();
    toast({
      title: 'Chat History Cleared',
      description: 'Your chat history has been cleared.',
    });
  }, [toast]);

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
  };
};

export default useChatState;