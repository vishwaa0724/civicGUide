import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import AppWrapper from './App';

describe('App Component', () => {
  it('renders without crashing', () => {
    // Basic test to verify the app renders
    const { container } = render(<AppWrapper />);
    expect(container).toBeTruthy();
  });

  it('contains the main navigation links', () => {
    const { getByText } = render(<AppWrapper />);
    expect(getByText('How It Works')).toBeTruthy();
    expect(getByText('AI Assistant')).toBeTruthy();
  });
});
