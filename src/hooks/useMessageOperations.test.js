import { renderHook, act } from '@testing-library/react-hooks';
import useMessageOperations from './useMessageOperations';

// Mock the toast function
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

describe('useMessageOperations', () => {
  it('should edit a message', () => {
    const updateChatHistory = jest.fn();
    const { result } = renderHook(() => useMessageOperations(updateChatHistory));

    act(() => {
      result.current.handleEditMessage(1, 'Updated content');
    });

    expect(updateChatHistory).toHaveBeenCalled();
    expect(result.current.editingMessageId).toBeNull();
  });

  it('should delete a message', () => {
    const updateChatHistory = jest.fn();
    const { result } = renderHook(() => useMessageOperations(updateChatHistory));

    act(() => {
      result.current.handleDeleteMessage(1);
    });

    expect(updateChatHistory).toHaveBeenCalled();
  });

  it('should set editing message id', () => {
    const updateChatHistory = jest.fn();
    const { result } = renderHook(() => useMessageOperations(updateChatHistory));

    act(() => {
      result.current.setEditingMessageId(1);
    });

    expect(result.current.editingMessageId).toBe(1);
  });
});