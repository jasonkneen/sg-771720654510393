import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ChatInput from './ChatInput';

jest.useFakeTimers();

describe('ChatInput', () => {
  const mockHandleSend = jest.fn();
  const mockSetInput = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input and send button', () => {
    render(<ChatInput input="" setInput={mockSetInput} handleSend={mockHandleSend} isLoading={false} />);
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByText('Send')).toBeInTheDocument();
  });

  it('disables send button when input is empty', () => {
    render(<ChatInput input="" setInput={mockSetInput} handleSend={mockHandleSend} isLoading={false} />);
    expect(screen.getByText('Send')).toBeDisabled();
  });

  it('enables send button when input is not empty', () => {
    render(<ChatInput input="Hello" setInput={mockSetInput} handleSend={mockHandleSend} isLoading={false} />);
    expect(screen.getByText('Send')).not.toBeDisabled();
  });

  it('calls handleSend when send button is clicked', () => {
    render(<ChatInput input="Hello" setInput={mockSetInput} handleSend={mockHandleSend} isLoading={false} />);
    fireEvent.click(screen.getByText('Send'));
    expect(mockHandleSend).toHaveBeenCalledTimes(1);
  });

  it('shows loading state when isLoading is true', () => {
    render(<ChatInput input="Hello" setInput={mockSetInput} handleSend={mockHandleSend} isLoading={true} />);
    expect(screen.getByText('Sending...')).toBeInTheDocument();
    expect(screen.getByText('Sending...')).toBeDisabled();
  });

  it('debounces input changes', () => {
    render(<ChatInput input="" setInput={mockSetInput} handleSend={mockHandleSend} isLoading={false} />);
    const input = screen.getByPlaceholderText('Type your message...');

    fireEvent.change(input, { target: { value: 'H' } });
    fireEvent.change(input, { target: { value: 'He' } });
    fireEvent.change(input, { target: { value: 'Hel' } });
    fireEvent.change(input, { target: { value: 'Hell' } });
    fireEvent.change(input, { target: { value: 'Hello' } });

    expect(mockSetInput).not.toHaveBeenCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(mockSetInput).toHaveBeenCalledTimes(1);
    expect(mockSetInput).toHaveBeenCalledWith('Hello');
  });

  it('shows character count', () => {
    render(<ChatInput input="Hello" setInput={mockSetInput} handleSend={mockHandleSend} isLoading={false} maxLength={500} />);
    expect(screen.getByText('5/500 characters')).toBeInTheDocument();
  });

  it('shows error state when over character limit', () => {
    const longInput = 'a'.repeat(501);
    render(<ChatInput input={longInput} setInput={mockSetInput} handleSend={mockHandleSend} isLoading={false} maxLength={500} />);
    expect(screen.getByText('501/500 characters')).toHaveClass('text-destructive');
    expect(screen.getByText('Send')).toBeDisabled();
  });
});