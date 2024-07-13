import { renderHook, act } from '@testing-library/react-hooks';
import useChatState from './useChatState';

// Mock the dependencies
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: jest.fn() }),
}));
jest.mock('@/utils/chatStorage', () => ({
  saveChatSessions: jest.fn(),
  loadChatSessions: jest.fn(() => [{ id: 1, name: 'Test Chat', messages: [] }]),
  clearChatSessions: jest.fn(),
}));
jest.mock('@/utils/openai', () => ({
  callOpenAI: jest.fn(() => Promise.resolve('AI response')),
}));
jest.mock('@/config/openai', () => ({
  OPENAI_CONFIG: {
    apiKey: 'test-api-key',
  },
}));

describe('useChatState', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useChatState());

    expect(result.current.chatHistory).toHaveLength(1);
    expect(result.current.currentChatIndex).toBe(0);
    expect(result.current.input).toBe('');
    expect(result.current.isLoading).toBe(false);
  });

  it('handles new chat creation', () => {
    const { result } = renderHook(() => useChatState());

    act(() => {
      result.current.handleNewChat();
    });

    expect(result.current.chatHistory).toHaveLength(2);
    expect(result.current.currentChatIndex).toBe(1);
  });

  it('handles chat selection', () => {
    const { result } = renderHook(() => useChatState());

    act(() => {
      result.current.handleNewChat();
      result.current.handleSelectChat(0);
    });

    expect(result.current.currentChatIndex).toBe(0);
  });

  it('handles message sending', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useChatState());

    act(() => {
      result.current.setInput('Test message');
    });

    await act(async () => {
      await result.current.handleSend({ preventDefault: jest.fn() });
    });

    await waitForNextUpdate();

    expect(result.current.chatHistory[0].messages).toHaveLength(2);
    expect(result.current.input).toBe('');
    expect(result.current.isLoading).toBe(false);
  });

  it('handles errors during message sending', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useChatState());
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    jest.spyOn(require('@/utils/openai'), 'callOpenAI').mockRejectedValueOnce(new Error('API Error'));

    act(() => {
      result.current.setInput('Test message');
    });

    await act(async () => {
      await result.current.handleSend({ preventDefault: jest.fn() });
    });

    await waitForNextUpdate();

    expect(consoleSpy).toHaveBeenCalledWith('Error in AI response:', expect.any(Error));
    expect(result.current.isLoading).toBe(false);

    consoleSpy.mockRestore();
  });
});