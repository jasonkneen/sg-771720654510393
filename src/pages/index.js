import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import ChatInput from '@/components/ChatInput';
import SettingsMenu from '@/components/SettingsMenu';
import HelpModal from '@/components/HelpModal';
import OnboardingTutorial from '@/components/OnboardingTutorial';
import AIPersonalityCustomizer from '@/components/AIPersonalityCustomizer';
import AIPersonalityDisplay from '@/components/AIPersonalityDisplay';
import ColorSchemeCustomizer from '@/components/ColorSchemeCustomizer';
import ChatSearch from '@/components/ChatSearch';
import LoadingState from '@/components/LoadingState';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import ErrorBoundary from '@/components/ErrorBoundary';
import { motion, AnimatePresence } from 'framer-motion';
import useChatState from '@/hooks/useChatState';
import useExportShare from '@/hooks/useExportShare';
import useKeyboardNavigation from '@/hooks/useKeyboardNavigation';
import useApi from '@/hooks/useApi';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/components/ui/use-toast';
import { handleError } from '@/utils/errorHandler';

const CodeDiffViewer = dynamic(() => import('@/components/CodeDiffViewer'), {
  ssr: false,
  loading: () => <LoadingState message="Loading Code Diff Viewer..." />,
});

const VirtualizedChatWindow = dynamic(() => import('@/components/VirtualizedChatWindow'), {
  loading: () => <LoadingState message="Loading Chat..." />,
  ssr: false,
});

export default function Home() {
  const {
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
  } = useChatState();

  const { exportConversation, shareCodeSnippet } = useExportShare();
  const { settings: appSettings, updateSettings, aiPersonality, updateAIPersonality, colorScheme, updateColorScheme } = useAppContext();
  const { toast } = useToast();
  const api = useApi();

  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showChatList, setShowChatList] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  useKeyboardNavigation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', appSettings.darkMode);
    document.documentElement.style.fontSize = appSettings.fontSize === 'small' ? '14px' : appSettings.fontSize === 'large' ? '18px' : '16px';
  }, [appSettings.darkMode, appSettings.fontSize]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await api.get('/api/health');
        setIsServerError(false);
      } catch (error) {
        setIsServerError(true);
        handleError(error, 'Server health check failed');
      }
    };

    checkServerStatus();
    const intervalId = setInterval(checkServerStatus, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [api]);

  const handleExport = async () => {
    try {
      await exportConversation(chatHistory[currentChatIndex]);
      toast({
        title: 'Export Successful',
        description: 'Your conversation has been exported successfully.',
      });
    } catch (error) {
      handleError(error, 'Error exporting conversation');
      toast({
        title: 'Export Failed',
        description: 'An error occurred while exporting the conversation. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async (snippet) => {
    try {
      await shareCodeSnippet(snippet);
      toast({
        title: 'Share Successful',
        description: 'Your code snippet has been shared successfully.',
      });
    } catch (error) {
      handleError(error, 'Error sharing code snippet');
      toast({
        title: 'Share Failed',
        description: 'An error occurred while sharing the code snippet. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSearch = (results) => {
    setSearchResults(results);
  };

  const filteredChats = chatHistory.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isServerError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Server Unavailable</h1>
          <p className="mb-4">We're experiencing technical difficulties. Please try again later.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Layout>
        <div className="flex flex-col h-screen w-full">
          <Header
            onExport={handleExport}
            onNewChat={handleNewChat}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showChatList={showChatList}
            setShowChatList={setShowChatList}
          >
            <SettingsMenu settings={appSettings} onSettingsChange={updateSettings} />
            <AIPersonalityCustomizer personality={aiPersonality} onPersonalityChange={updateAIPersonality} />
            <ColorSchemeCustomizer colorScheme={colorScheme} onColorSchemeChange={updateColorScheme} />
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
            {showChatList && (
              <div className="w-64 bg-background border-r border-border">
                <div className="p-4 space-y-2">
                  {filteredChats.map((chat, index) => (
                    <Button
                      key={chat.id}
                      variant={currentChatIndex === index ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleSelectChat(index)}
                    >
                      {chat.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col flex-1 bg-background dark:bg-gray-900">
              <ChatSearch messages={chatHistory[currentChatIndex].messages} onSearchResult={handleSearch} />
              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  {isInitializing ? (
                    <motion.div
                      key="initializing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex items-center justify-center"
                    >
                      <LoadingState message="Initializing chat..." />
                    </motion.div>
                  ) : isSwitchingChat ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex items-center justify-center"
                    >
                      <LoadingState message="Loading chat..." />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="chat"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full"
                    >
                      <VirtualizedChatWindow 
                        messages={chatHistory[currentChatIndex].messages} 
                        onShare={handleShare}
                        isLoading={isLoading}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {isLoading && (
                <Progress value={progress} className="w-full" />
              )}
              <div className="mt-auto">
                <ChatInput
                  input={input}
                  setInput={setInput}
                  handleSend={handleSend}
                  isLoading={isLoading}
                  maxLength={500}
                />
              </div>
            </div>
            <div className="w-64 p-4 border-l border-border">
              <AIPersonalityDisplay personality={aiPersonality} />
            </div>
          </div>
        </div>
        {showOnboarding && <OnboardingTutorial onClose={() => setShowOnboarding(false)} />}
      </Layout>
    </ErrorBoundary>
  );
}