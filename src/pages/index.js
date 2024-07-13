import React, { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ChatInput from '@/components/ChatInput';
import SettingsMenu from '@/components/SettingsMenu';
import HelpModal from '@/components/HelpModal';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import ErrorBoundary from '@/components/ErrorBoundary';
import logError from '@/utils/errorLogger';

const ChatWindow = dynamic(() => import('@/components/ChatWindow'), {
  loading: () => <p>Loading chat...</p>,
  ssr: false,
});

const simulateAIResponse = (message) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const responses = [
        `Here's a simple React component that demonstrates the concept:\n\`\`\`jsx\nimport React from 'react';\n\nconst ExampleComponent = () => {\n  return (\n    <div>\n      <h1>Hello, World!</h1>\n      <p>This is a simple React component.</p>\n    </div>\n  );\n};\n\nexport default ExampleComponent;\n\`\`\``,
        `To solve this problem, you can use a dynamic programming approach. Here's a Python implementation:\n\`\`\`python\ndef solve_problem(input_data):\n    # Initialize dynamic programming table\n    dp = [0] * len(input_data)\n    \n    # Base cases\n    dp[0] = input_data[0]\n    dp[1] = max(input_data[0], input_data[1])\n    \n    # Fill the dp table\n    for i in range(2, len(input_data)):\n        dp[i] = max(dp[i-1], dp[i-2] + input_data[i])\n    \n    return dp[-1]\n\`\`\``,
        `For your CSS issue, try using flexbox. Here's an example:\n\`\`\`css\n.container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.item {\n  flex: 1;\n  margin: 0 10px;\n}\n\`\`\``,
      ];
      resolve(responses[Math.floor(Math.random() * responses.length)]);
    }, 1000 + Math.random() * 2000);
  });
};

export default function Home() {
  const [chatHistory, setChatHistory] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chatHistory');
      return saved ? JSON.parse(saved) : [{ id: 1, name: 'New Chat', messages: [] }];
    }
    return [{ id: 1, name: 'New Chat', messages: [] }];
  });
  const [currentChatIndex, setCurrentChatIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchingChat, setIsSwitchingChat] = useState(false);
  const [settings, setSettings] = useState({ darkMode: false, autoSave: true });
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined' && settings.autoSave) {
      localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
  }, [chatHistory, settings.autoSave]);

  const handleSend = useCallback(async (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      setIsLoading(true);
      const userMessage = { sender: 'user', content: input };
      setChatHistory((prev) => {
        const newHistory = [...prev];
        newHistory[currentChatIndex].messages.push(userMessage);
        return newHistory;
      });
      setInput('');

      try {
        const aiResponse = await simulateAIResponse(input);
        const aiMessage = { sender: 'ai', content: aiResponse };
        setChatHistory((prev) => {
          const newHistory = [...prev];
          newHistory[currentChatIndex].messages.push(aiMessage);
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
        setIsLoading(false);
      }
    }
  }, [input, isLoading, currentChatIndex, toast]);

  const handleNewChat = useCallback(() => {
    const newChat = { id: chatHistory.length + 1, name: `New Chat ${chatHistory.length + 1}`, messages: [] };
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

  const handleExportChat = useCallback(() => {
    const currentChat = chatHistory[currentChatIndex];
    const chatContent = currentChat.messages.map(msg => `${msg.sender}: ${msg.content}`).join('\n\n');
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentChat.name}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: 'Chat Exported',
      description: 'Your chat has been successfully exported.',
    });
  }, [chatHistory, currentChatIndex, toast]);

  const handleClearHistory = useCallback(() => {
    setChatHistory([{ id: 1, name: 'New Chat', messages: [] }]);
    setCurrentChatIndex(0);
    toast({
      title: 'Chat History Cleared',
      description: 'Your chat history has been cleared.',
    });
  }, [toast]);

  const handleSettingsChange = useCallback((newSettings) => {
    setSettings(newSettings);
    if (newSettings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        handleSend(e);
      } else if (e.key === 'n' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleNewChat();
      } else if (e.key === 'e' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleExportChat();
      } else if (e.key === '/' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        // Open help modal
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleSend, handleNewChat, handleExportChat]);

  return (
    <ErrorBoundary>
      <Layout>
        <div className="flex flex-col h-screen">
          <Header onExport={handleExportChat}>
            <SettingsMenu settings={settings} onSettingsChange={handleSettingsChange} />
            <HelpModal />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Clear History</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your chat history.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearHistory}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Header>
          <div className="flex flex-1 overflow-hidden">
            <Sidebar
              chatHistory={chatHistory}
              onNewChat={handleNewChat}
              onSelectChat={handleSelectChat}
              onRenameChat={handleRenameChat}
              currentChatIndex={currentChatIndex}
            />
            <div className="flex flex-col flex-1">
              {isSwitchingChat ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-muted-foreground">Loading chat...</p>
                </div>
              ) : (
                <ChatWindow messages={chatHistory[currentChatIndex].messages} />
              )}
              <ChatInput
                input={input}
                setInput={setInput}
                handleSend={handleSend}
                isLoading={isLoading}
                maxLength={500}
              />
            </div>
          </div>
        </div>
      </Layout>
    </ErrorBoundary>
  );
}