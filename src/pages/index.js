import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import CollapsibleSidebar from '@/components/CollapsibleSidebar';
import ChatInput from '@/components/ChatInput';
import SettingsMenu from '@/components/SettingsMenu';
import HelpModal from '@/components/HelpModal';
import OnboardingTutorial from '@/components/OnboardingTutorial';
import AIPersonalityCustomizer from '@/components/AIPersonalityCustomizer';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import ErrorBoundary from '@/components/ErrorBoundary';
import { motion, AnimatePresence } from 'framer-motion';
import useChatState from '@/hooks/useChatState';
import useExportShare from '@/hooks/useExportShare';
import useAIPersonality from '@/hooks/useAIPersonality';
import { useToast } from '@/components/ui/use-toast';

const ChatWindow = dynamic(() => import('@/components/ChatWindow'), {
  loading: () => <p>Loading chat...</p>,
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
  } = useChatState({ darkMode: false, autoSave: true, fontSize: 'medium', language: 'en' });

  const { exportConversation, shareCodeSnippet } = useExportShare();
  const [aiPersonality, updateAIPersonality] = useAIPersonality({
    name: 'AI Assistant',
    tone: 50,
    verbosity: 50,
  });
  const { toast } = useToast();

  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);

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

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        handleSend(e);
      } else if (e.key === 'n' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleNewChat();
      } else if (e.key === 'e' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        exportConversation(chatHistory[currentChatIndex]);
      } else if (e.key === '/' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        // Open help modal
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleSend, handleNewChat, exportConversation, chatHistory, currentChatIndex]);

  const handleExport = () => {
    try {
      exportConversation(chatHistory[currentChatIndex]);
    } catch (error) {
      console.error('Error exporting conversation:', error);
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
      console.error('Error sharing code snippet:', error);
      toast({
        title: 'Share Failed',
        description: 'An error occurred while sharing the code snippet. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handlePersonalityChange = (newPersonality) => {
    updateAIPersonality(newPersonality);
    toast({
      title: 'AI Personality Updated',
      description: `The AI personality has been updated to ${newPersonality.name}.`,
    });
  };

  return (
    <ErrorBoundary>
      <Layout>
        <div className="flex flex-col h-screen w-full">
          <Header onExport={handleExport}>
            <SettingsMenu settings={settings} onSettingsChange={handleSettingsChange} />
            <AIPersonalityCustomizer personality={aiPersonality} onPersonalityChange={handlePersonalityChange} />
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
          </div>
        </div>
        {showOnboarding && <OnboardingTutorial onClose={() => setShowOnboarding(false)} />}
      </Layout>
    </ErrorBoundary>
  );
}