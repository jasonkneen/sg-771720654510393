const STORAGE_KEY = 'ai_coding_assistant_chats';

export const saveChatSessions = (chatHistory) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
  }
};

export const loadChatSessions = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [{ id: 1, name: 'New Chat', messages: [] }];
  }
  return [{ id: 1, name: 'New Chat', messages: [] }];
};

export const clearChatSessions = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
};