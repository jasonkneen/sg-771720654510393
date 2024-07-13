import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { saveChatSessions, loadChatSessions, clearChatSessions } from '@/utils/chatStorage';
import logError from '@/utils/errorLogger';

const simulateAIResponse = (message, context) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const responses = [
        `Based on your question "${message}", here's a simple React component that demonstrates the concept:\n\`\`\`jsx\nimport React from 'react';\n\nconst ExampleComponent = () => {\n  return (\n    <div>\n      <h1>Hello, World!</h1>\n      <p>This is a simple React component.</p>\n    </div>\n  );\n};\n\nexport default ExampleComponent;\n\`\`\``,
        `To solve the problem you described ("${message}"), you can use a dynamic programming approach. Here's a Python implementation:\n\`\`\`python\ndef solve_problem(input_data):\n    # Initialize dynamic programming table\n    dp = [0] * len(input_data)\n    \n    # Base cases\n    dp[0] = input_data[0]\n    dp[1] = max(input_data[0], input_data[1])\n    \n    # Fill the dp table\n    for i in range(2, len(input_data)):\n        dp[i] = max(dp[i-1], dp[i-2] + input_data[i])\n    \n    return dp[-1]\n\`\`\``,
        `For your CSS issue ("${message}"), try using flexbox. Here's an example:\n\`\`\`css\n.container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.item {\n  flex: 1;\n  margin: 0 10px;\n}\n\`\`\``,
      ];
      resolve(responses[Math.floor(Math.random() * responses.length)]);
    }, 1000 + Math.random() * 2000);
  });
};

export const useChatState = (initialSettings = { autoSave: true }) => {
  const [chatHistory, setChatHistory] = useState(() => loadChatSessions());
  const [currentChatIndex, setCurrentChatIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchingChat, setIsSwitchingChat] = useState(false);
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
        const context = chatHistory[currentChatIndex].messages.slice(-5);
        const aiResponse = await simulateAIResponse(input, context);
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
        logError(error, { context: 'AI Response' });
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
    const newChat = { id: Date.now(), name: `New Chat ${chatHistory.length + 1}`, messages: [] };
    setChatHistory((prev) => [...prev, newChat]);
    setCurrentChatIndex(chatHistory.length);
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