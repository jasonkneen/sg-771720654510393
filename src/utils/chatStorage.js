const STORAGE_KEY = 'ai_coding_assistant_chats';

export const saveChatSessions = (chatHistory) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
    } catch (error) {
      console.error('Error saving chat sessions:', error);
    }
  }
};

export const loadChatSessions = () => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [{ id: 1, name: 'New Chat', messages: [] }];
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      return [{ id: 1, name: 'New Chat', messages: [] }];
    }
  }
  return [{ id: 1, name: 'New Chat', messages: [] }];
};

export const clearChatSessions = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing chat sessions:', error);
    }
  }
};