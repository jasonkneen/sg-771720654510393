import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingState from './LoadingState';

describe('LoadingState', () => {
  it('renders with default message', () => {
    render(<LoadingState />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    const customMessage = 'Custom loading message';
    render(<LoadingState message={customMessage} />);
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('renders loading spinner', () => {
    render(<LoadingState />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});