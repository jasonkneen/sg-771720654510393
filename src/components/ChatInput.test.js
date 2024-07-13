import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatInput from './ChatInput';

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

  it('updates input when typing', () => {
    render(<ChatInput input="" setInput={mockSetInput} handleSend={mockHandleSend} isLoading={false} />);
    fireEvent.change(screen.getByPlaceholderText('Type your message...'), { target: { value: 'Hello' } });
    expect(mockSetInput).toHaveBeenCalledWith('Hello');
  });

  it('shows character count', () => {
    render(<ChatInput input="Hello" setInput={mockSetInput} handleSend={mockHandleSend} isLoading={false} maxLength={500} />);
    expect(screen.getByText('5/500 characters')).toBeInTheDocument();
  });
});