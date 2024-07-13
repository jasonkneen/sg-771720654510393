import { renderHook, act } from '@testing-library/react-hooks';
import useKeyboardNavigation from './useKeyboardNavigation';

describe('useKeyboardNavigation', () => {
  it('should call onSelectItem when ArrowUp is pressed', () => {
    const onSelectItem = jest.fn();
    const { result } = renderHook(() => useKeyboardNavigation(5, 2, onSelectItem));

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      document.dispatchEvent(event);
    });

    expect(onSelectItem).toHaveBeenCalledWith(1);
  });

  it('should call onSelectItem when ArrowDown is pressed', () => {
    const onSelectItem = jest.fn();
    const { result } = renderHook(() => useKeyboardNavigation(5, 2, onSelectItem));

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      document.dispatchEvent(event);
    });

    expect(onSelectItem).toHaveBeenCalledWith(3);
  });

  it('should not call onSelectItem when at the top of the list and ArrowUp is pressed', () => {
    const onSelectItem = jest.fn();
    const { result } = renderHook(() => useKeyboardNavigation(5, 0, onSelectItem));

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      document.dispatchEvent(event);
    });

    expect(onSelectItem).not.toHaveBeenCalled();
  });

  it('should not call onSelectItem when at the bottom of the list and ArrowDown is pressed', () => {
    const onSelectItem = jest.fn();
    const { result } = renderHook(() => useKeyboardNavigation(5, 4, onSelectItem));

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      document.dispatchEvent(event);
    });

    expect(onSelectItem).not.toHaveBeenCalled();
  });
});