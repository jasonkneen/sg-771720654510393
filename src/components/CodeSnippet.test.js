import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CodeSnippet from './CodeSnippet';

// Mock the highlight.js module
jest.mock('highlight.js', () => ({
  highlightElement: jest.fn(),
}));

describe('CodeSnippet', () => {
  const mockOnShare = jest.fn();
  const mockContent = 'const greeting = "Hello, World!";';
  const mockLanguage = 'javascript';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the code snippet correctly', () => {
    render(<CodeSnippet language={mockLanguage} content={mockContent} onShare={mockOnShare} />);
    expect(screen.getByText(mockContent)).toBeInTheDocument();
  });

  it('applies syntax highlighting', () => {
    render(<CodeSnippet language={mockLanguage} content={mockContent} onShare={mockOnShare} />);
    expect(screen.getByText(mockContent).className).toContain(`language-${mockLanguage}`);
  });

  it('handles copy button click', async () => {
    const mockClipboard = {
      writeText: jest.fn(),
    };
    Object.assign(navigator, {
      clipboard: mockClipboard,
    });

    render(<CodeSnippet language={mockLanguage} content={mockContent} onShare={mockOnShare} />);
    const copyButton = screen.getByLabelText('Copy code');
    fireEvent.click(copyButton);

    expect(mockClipboard.writeText).toHaveBeenCalledWith(mockContent);
    expect(await screen.findByLabelText('Copied')).toBeInTheDocument();
  });

  it('handles share button click', () => {
    render(<CodeSnippet language={mockLanguage} content={mockContent} onShare={mockOnShare} />);
    const shareButton = screen.getByLabelText('Share code snippet');
    fireEvent.click(shareButton);

    expect(mockOnShare).toHaveBeenCalledWith(mockContent);
  });
});