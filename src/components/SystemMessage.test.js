import React from 'react';
import { render, screen } from '@testing-library/react';
import SystemMessage from './SystemMessage';

describe('SystemMessage', () => {
  it('renders info message correctly', () => {
    render(<SystemMessage type="info" title="Info Title" description="Info description" />);
    expect(screen.getByText('Info Title')).toBeInTheDocument();
    expect(screen.getByText('Info description')).toBeInTheDocument();
  });

  it('renders warning message correctly', () => {
    render(<SystemMessage type="warning" title="Warning Title" description="Warning description" />);
    expect(screen.getByText('Warning Title')).toBeInTheDocument();
    expect(screen.getByText('Warning description')).toBeInTheDocument();
  });

  it('renders success message correctly', () => {
    render(<SystemMessage type="success" title="Success Title" description="Success description" />);
    expect(screen.getByText('Success Title')).toBeInTheDocument();
    expect(screen.getByText('Success description')).toBeInTheDocument();
  });

  it('uses info type by default', () => {
    render(<SystemMessage title="Default Title" description="Default description" />);
    const alertElement = screen.getByRole('alert');
    expect(alertElement).toHaveClass('info');
  });
});