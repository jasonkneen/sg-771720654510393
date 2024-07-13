import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

// Mock the Alert component
jest.mock('@/components/ui/alert', () => ({
  Alert: ({ children }) => <div data-testid="mock-alert">{children}</div>,
  AlertTitle: ({ children }) => <h5 data-testid="mock-alert-title">{children}</h5>,
  AlertDescription: ({ children }) => <div data-testid="mock-alert-description">{children}</div>,
}));

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders error message when there is an error', () => {
    const ErrorComponent = () => {
      throw new Error('Test error');
    };

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('mock-alert')).toBeInTheDocument();
    expect(screen.getByTestId('mock-alert-title')).toHaveTextContent('Something went wrong');
    expect(screen.getByTestId('mock-alert-description')).toHaveTextContent("We're sorry, but an error occurred");

    consoleErrorSpy.mockRestore();
  });
});