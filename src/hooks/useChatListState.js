import { useState, useCallback } from 'react';

const useChatListState = (initialChatHistory) => {
  const [showChatList, setShowChatList] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [chatHistory, setChatHistory] = useState(initialChatHistory);

  const toggleChatList = useCallback(() => {
    setShowChatList(prev => !prev);
  }, []);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const filteredChats = chatHistory.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addChat = useCallback((newChat) => {
    setChatHistory(prev => [...prev, newChat]);
  }, []);

  const removeChat = useCallback((chatId) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
  }, []);

  const updateChat = useCallback((chatId, updatedChat) => {
    setChatHistory(prev => prev.map(chat => chat.id === chatId ? { ...chat, ...updatedChat } : chat));
  }, []);

  return {
    showChatList,
    setShowChatList,
    searchTerm,
    setSearchTerm,
    chatHistory,
    filteredChats,
    toggleChatList,
    handleSearch,
    addChat,
    removeChat,
    updateChat,
  };
};

export default useChatListState;