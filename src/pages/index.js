import React, { useState, useCallback } from 'react';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ChatWindow from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';

const simulateAIResponse = (message) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`This is a simulated AI response to: "${message}"`);
    }, 1000 + Math.random() * 2000);
  });
};

export default function Home() {
  const [chatHistory, setChatHistory] = useState([{ id: 1, messages: [] }]);
  const [currentChatIndex, setCurrentChatIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

      const aiResponse = await simulateAIResponse(input);
      const aiMessage = { sender: 'ai', content: aiResponse };
      setChatHistory((prev) => {
        const newHistory = [...prev];
        newHistory[currentChatIndex].messages.push(aiMessage);
        return newHistory;
      });
      setIsLoading(false);
    }
  }, [input, isLoading, currentChatIndex]);

  const handleNewChat = useCallback(() => {
    setChatHistory((prev) => [...prev, { id: prev.length + 1, messages: [] }]);
    setCurrentChatIndex(chatHistory.length);
  }, [chatHistory.length]);

  const handleSelectChat = useCallback((index) => {
    setCurrentChatIndex(index);
  }, []);

  return (
    <Layout>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            chatHistory={chatHistory}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
          />
          <div className="flex flex-col flex-1">
            <ChatWindow messages={chatHistory[currentChatIndex].messages} />
            <ChatInput
              input={input}
              setInput={setInput}
              handleSend={handleSend}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}