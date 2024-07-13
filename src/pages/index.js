import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import ChatInput from '@/components/ChatInput';
import ChatList from '@/components/ChatList';
import SettingsMenu from '@/components/SettingsMenu';
import HelpModal from '@/components/HelpModal';
import OnboardingTutorial from '@/components/OnboardingTutorial';
import AIPersonalityCustomizer from '@/components/AIPersonalityCustomizer';
import AIPersonalityDisplay from '@/components/AIPersonalityDisplay';
import ColorSchemeCustomizer from '@/components/ColorSchemeCustomizer';
import ChatSearch from '@/components/ChatSearch';
import LoadingState from '@/components/LoadingState';
import ErrorMessage from '@/components/ErrorMessage';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import ErrorBoundary from '@/components/ErrorBoundary';
import { motion, AnimatePresence } from 'framer-motion';
import useChatState from '@/hooks/useChatState';
import useChatListState from '@/hooks/useChatListState';
import useExportShare from '@/hooks/useExportShare';
import useKeyboardNavigation from '@/hooks/useKeyboardNavigation';
import useApi from '@/hooks/useApi';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/components/ui/use-toast';
import { handleComponentError } from '@/utils/componentErrorHandler';
import { debounce } from '@/utils/debounce';

const VirtualizedChatWindow = dynamic(() => import('@/components/VirtualizedChatWindow'), {
  loading: () => <LoadingState message="Loading Chat..." />,
  ssr: false,
});

const ChatBox = ({ children }) => (
  <div className="flex flex-col flex-1 bg-background dark:bg-gray-900 overflow-hidden">
    {children}
  </div>
);

export default function Home() {
  const {
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
  } = useChatState();

  const {
    showChatList,
    setShowChatList,
    searchTerm,
    setSearchTerm,
    filteredChats,
    toggleChatList,
    handleSearch,
  } = useChatListState(chatHistory);

  const { exportConversation, shareCodeSnippet } = useExportShare();
  const { settings: appSettings, updateSettings, aiPersonality, updateAIPersonality, colorScheme, updateColorScheme } = useAppContext();
  const { toast } = useToast();
  const api = useApi();

  const [isChatVisible, setIsChatVisible] = useState(true);

  const handleKeyboardNavigation = useKeyboardNavigation(
    filteredChats.length,
    currentChatIndex,
    handleSelectChat
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', appSettings.darkMode);
    document.documentElement.style.fontSize = appSettings.fontSize === 'small' ? '14px' : appSettings.fontSize === 'large' ? '18px' : '16px';
  }, [appSettings.darkMode, appSettings.fontSize]);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await api.get('/api/health');
      } catch (error) {
        handleComponentError(error, 'Server health check');
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
      handleComponentError(error, 'Export conversation');
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
      handleComponentError(error, 'Share code snippet');
    }
  };

  const debouncedSearch = debounce(handleSearch, 300);

  const handleChatVisibility = () => {
    setIsChatVisible((prev) => !prev);
  };

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
            <ErrorBoundary>
              {showChatList && (
                <div className="w-64 bg-background border-r border-border">
                  <ChatList
                    chats={filteredChats}
                    currentChatIndex={currentChatIndex}
                    onSelectChat={handleSelectChat}
                    onDeleteChat={handleDeleteChat}
                    onRenameChat={handleRenameChat}
                    onKeyDown={handleKeyboardNavigation}
                  />
                </div>
              )}
            </ErrorBoundary>
            <ErrorBoundary>
              <ChatBox>
                <ChatSearch messages={chatHistory[currentChatIndex].messages} onSearchResult={debouncedSearch} />
                <div className="flex-1 overflow-hidden">
                  <AnimatePresence mode="wait">
                    {isCreatingChat || isSwitchingChat ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex items-center justify-center"
                      >
                        <LoadingState message={isCreatingChat ? "Creating new chat..." : "Loading chat..."} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="chat"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`h-full ${isChatVisible ? '' : 'hidden'}`}
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
              </ChatBox>
            </ErrorBoundary>
            <ErrorBoundary>
              <div className="w-64 p-4 border-l border-border">
                <AIPersonalityDisplay personality={aiPersonality} />
              </div>
            </ErrorBoundary>
          </div>
        </div>
        <OnboardingTutorial />
      </Layout>
    </ErrorBoundary>
  );
}