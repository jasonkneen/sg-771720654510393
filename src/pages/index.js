import React, { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import CollapsibleSidebar from '@/components/CollapsibleSidebar';
import ChatInput from '@/components/ChatInput';
import SettingsMenu from '@/components/SettingsMenu';
import HelpModal from '@/components/HelpModal';
import OnboardingTutorial from '@/components/OnboardingTutorial';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import ErrorBoundary from '@/components/ErrorBoundary';
import logError from '@/utils/errorLogger';
import { saveChatSessions, loadChatSessions, clearChatSessions } from '@/utils/chatStorage';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWindow = dynamic(() => import('@/components/ChatWindow'), {
  loading: () => <p>Loading chat...</p>,
  ssr: false,
});

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

export default function Home() {
  const [chatHistory, setChatHistory] = useState(() => loadChatSessions());
  const [currentChatIndex, setCurrentChatIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchingChat, setIsSwitchingChat] = useState(false);
  const [settings, setSettings] = useState({ darkMode: false, autoSave: true, fontSize: 'medium', language: 'en' });
  const [progress, setProgress] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (settings.autoSave) {
      saveChatSessions(chatHistory);
    }
  }, [chatHistory, settings.autoSave]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.darkMode);
    document.documentElement.style.fontSize = settings.fontSize === 'small' ? '14px' : settings.fontSize === 'large' ? '18px' : '16px';
  }, [settings.darkMode, settings.fontSize]);

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

  const handleExportChat = useCallback(() => {
    const currentChat = chatHistory[currentChatIndex];
    const chatContent = currentChat.messages.map(msg => `## ${msg.sender === 'user' ? 'User' : 'AI'}\n\n${msg.content}\n\n`).join('');
    const blob = new Blob([`# ${currentChat.name}\n\n${chatContent}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentChat.name}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: 'Chat Exported',
      description: 'Your chat has been successfully exported as a Markdown file.',
    });
  }, [chatHistory, currentChatIndex, toast]);

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
        <div className="flex flex-col h-screen w-full">
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
            <CollapsibleSidebar
              chatHistory={chatHistory}
              onNewChat={handleNewChat}
              onSelectChat={handleSelectChat}
              onRenameChat={handleRenameChat}
              onDeleteChat={handleDeleteChat}
              currentChatIndex={currentChatIndex}
            />
            <div className="flex flex-col flex-1 bg-background dark:bg-gray-900">
              <AnimatePresence mode="wait">
                {isSwitchingChat ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex items-center justify-center"
                  >
                    <p className="text-muted-foreground">Loading chat...</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1"
                  >
                    <ChatWindow messages={chatHistory[currentChatIndex].messages} />
                  </motion.div>
                )}
              </AnimatePresence>
              {isLoading && (
                <Progress value={progress} className="w-full" />
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
        {showOnboarding && <OnboardingTutorial onClose={() => setShowOnboarding(false)} />}
      </Layout>
    </ErrorBoundary>
  );
}