import React, { useState } from 'react';
import Layout from '@/components/Layout';
import Sidebar from '@/components/Sidebar';
import ChatWindow from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';

export default function Home() {
  const [chatHistory, setChatHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessages = [
        ...messages,
        { sender: 'user', content: input },
        { sender: 'ai', content: 'This is a simulated AI response.' },
      ];
      setMessages(newMessages);
      setInput('');
      setChatHistory([...chatHistory, { id: chatHistory.length + 1 }]);
    }
  };

  return (
    <Layout>
      <Sidebar chatHistory={chatHistory} />
      <div className="flex flex-col flex-1">
        <ChatWindow messages={messages} />
        <ChatInput input={input} setInput={setInput} handleSend={handleSend} />
      </div>
    </Layout>
  );
}