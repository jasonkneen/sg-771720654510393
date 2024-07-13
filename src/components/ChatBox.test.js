import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatBox from './ChatBox';

describe('ChatBox', () => {
  it('renders children correctly', () => {
    render(
      <ChatBox>
        <div data-testid="test-child">Test Child</div>
      </ChatBox>
    );
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<ChatBox />);
    expect(container.firstChild).toHaveClass('flex', 'flex-col', 'flex-1', 'bg-background', 'dark:bg-gray-900', 'overflow-hidden');
  });
});