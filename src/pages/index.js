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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import ErrorBoundary from '@/components/ErrorBoundary';
import { motion, AnimatePresence } from 'framer-motion';
import useChatState from '@/hooks/useChatState';
import useExportShare from '@/hooks/useExportShare';
import useKeyboardNavigation from '@/hooks/useKeyboardNavigation';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/components/ui/use-toast';
import logger from '@/utils/logger';

const ChatWindow = dynamic(() => import('@/components/ChatWindow'), {
  loading: () => <ChatSkeleton />,
  ssr: false,
});

const ChatSkeleton = () => (
  <div className="flex-1 p-4 space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex items-start space-x-2">
        <div className="w-8 h-8 rounded-full loading-skeleton"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 loading-skeleton"></div>
          <div className="h-4 w-1/2 loading-skeleton"></div>
        </div>
      </div>
    ))}
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
    progress,
    handleSend,
    handleNewChat,
    handleSelectChat,
    handleRenameChat,
    handleDeleteChat,
    handleClearHistory,
  } = useChatState();

  const { exportConversation, shareCodeSnippet } = useExportShare();
  const { settings, updateSettings, aiPersonality, updateAIPersonality, colorScheme, updateColorScheme } = useAppContext();
  const { toast } = useToast();

  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showChatList, setShowChatList] = useState(false);

  useKeyboardNavigation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.darkMode);
    document.documentElement.style.fontSize = settings.fontSize === 'small' ? '14px' : settings.fontSize === 'large' ? '18px' : '16px';
  }, [settings.darkMode, settings.fontSize]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleExport = () => {
    try {
      exportConversation(chatHistory[currentChatIndex]);
    } catch (error) {
      logger.error('Error exporting conversation:', { error });
      toast({
        title: 'Export Failed',
        description: 'An error occurred while exporting the conversation. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleShare = (snippet) => {
    try {
      shareCodeSnippet(snippet);
    } catch (error) {
      logger.error('Error sharing code snippet:', { error });
      toast({
        title: 'Share Failed',
        description: 'An error occurred while sharing the code snippet. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const filteredChats = chatHistory.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <SettingsMenu settings={settings} onSettingsChange={updateSettings} />
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
              <AnimatePresence mode="wait">
                {isInitializing ? (
                  <motion.div
                    key="initializing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex items-center justify-center"
                  >
                    <p className="text-muted-foreground">Initializing chat...</p>
                  </motion.div>
                ) : isSwitchingChat ? (
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
                    <ChatWindow messages={chatHistory[currentChatIndex].messages} onShare={handleShare} />
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