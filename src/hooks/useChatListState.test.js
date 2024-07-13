import { renderHook, act } from '@testing-library/react-hooks';
import useChatListState from './useChatListState';

describe('useChatListState', () => {
  const initialChatHistory = [
    { id: 1, name: 'Chat 1', messages: [] },
    { id: 2, name: 'Chat 2', messages: [] },
  ];

  it('initializes with default values', () => {
    const { result } = renderHook(() => useChatListState(initialChatHistory));

    expect(result.current.showChatList).toBe(false);
    expect(result.current.searchTerm).toBe('');
    expect(result.current.chatHistory).toEqual(initialChatHistory);
    expect(result.current.filteredChats).toEqual(initialChatHistory);
  });

  it('toggles chat list visibility', () => {
    const { result } = renderHook(() => useChatListState(initialChatHistory));

    act(() => {
      result.current.toggleChatList();
    });

    expect(result.current.showChatList).toBe(true);

    act(() => {
      result.current.toggleChatList();
    });

    expect(result.current.showChatList).toBe(false);
  });

  it('handles search', () => {
    const { result } = renderHook(() => useChatListState(initialChatHistory));

    act(() => {
      result.current.handleSearch('Chat 1');
    });

    expect(result.current.searchTerm).toBe('Chat 1');
    expect(result.current.filteredChats).toEqual([initialChatHistory[0]]);
  });

  it('adds a new chat', () => {
    const { result } = renderHook(() => useChatListState(initialChatHistory));

    const newChat = { id: 3, name: 'Chat 3', messages: [] };

    act(() => {
      result.current.addChat(newChat);
    });

    expect(result.current.chatHistory).toHaveLength(3);
    expect(result.current.chatHistory[2]).toEqual(newChat);
  });

  it('removes a chat', () => {
    const { result } = renderHook(() => useChatListState(initialChatHistory));

    act(() => {
      result.current.removeChat(1);
    });

    expect(result.current.chatHistory).toHaveLength(1);
    expect(result.current.chatHistory[0]).toEqual(initialChatHistory[1]);
  });

  it('updates a chat', () => {
    const { result } = renderHook(() => useChatListState(initialChatHistory));

    const updatedChat = { id: 1, name: 'Updated Chat 1', messages: [] };

    act(() => {
      result.current.updateChat(1, updatedChat);
    });

    expect(result.current.chatHistory[0]).toEqual(updatedChat);
  });
});