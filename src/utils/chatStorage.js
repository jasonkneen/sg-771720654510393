// In-memory storage for chat sessions
let inMemoryStorage = [{ id: 1, name: 'New Chat', messages: [] }];

export const saveChatSessions = (chatHistory) => {
  inMemoryStorage = chatHistory;
};

export const loadChatSessions = () => {
  return inMemoryStorage;
};

export const clearChatSessions = () => {
  inMemoryStorage = [{ id: 1, name: 'New Chat', messages: [] }];
};