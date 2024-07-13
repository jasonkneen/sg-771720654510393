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

  const handleSend = useCallback(async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setProgress(0);

    const newMessage = { id: Date.now(), sender: 'user', content: input };
    updateChatHistory((prevHistory) => {
      const updatedHistory = [...prevHistory];
      updatedHistory[currentChatIndex].messages.push(newMessage);
      return updatedHistory;
    });

    setInput('');

    try {
      const aiResponse = await callOpenAI(
        [...chatHistory[currentChatIndex].messages, newMessage],
        OPENAI_CONFIG.apiKey
      );

      updateChatHistory((prevHistory) => {
        const updatedHistory = [...prevHistory];
        updatedHistory[currentChatIndex].messages.push({
          id: Date.now(),
          sender: 'ai',
          content: aiResponse,
        });
        return updatedHistory;
      });

      setProgress(100);
    } catch (error) {
      handleError(error, 'Error sending message');
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, updateChatHistory, currentChatIndex, chatHistory, toast]);

  const handleNewChat = useCallback(() => {
    setIsCreatingChat(true);
    const newChat = { id: Date.now(), name: `Chat ${chatHistory.length + 1}`, messages: [] };
    updateChatHistory((prevHistory) => [...prevHistory, newChat]);
    setCurrentChatIndex(chatHistory.length);
    setIsCreatingChat(false);
  }, [chatHistory.length, updateChatHistory]);

  const handleSelectChat = useCallback((index) => {
    setIsSwitchingChat(true);
    setCurrentChatIndex(index);
    setIsSwitchingChat(false);
  }, []);

  const handleRenameChat = useCallback((index, newName) => {
    updateChatHistory((prevHistory) => {
      const updatedHistory = [...prevHistory];
      updatedHistory[index].name = newName;
      return updatedHistory;
    });
  }, [updateChatHistory]);

  const handleDeleteChat = useCallback((index) => {
    updateChatHistory((prevHistory) => {
      const updatedHistory = prevHistory.filter((_, i) => i !== index);
      return updatedHistory;
    });
    if (currentChatIndex >= index) {
      setCurrentChatIndex((prevIndex) => Math.max(0, prevIndex - 1));
    }
  }, [updateChatHistory, currentChatIndex]);

  const handleClearHistory = useCallback(() => {
    clearChatSessions();
    setChatHistory([{ id: Date.now(), name: 'New Chat', messages: [] }]);
    setCurrentChatIndex(0);
  }, []);

  const handleSettingsChange = useCallback((newSettings) => {
    setSettings((prevSettings) => ({ ...prevSettings, ...newSettings }));
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