/* eslint-disable */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VoterJourney } from '../../components/VoterJourney.jsx';

// Mock framer-motion for jsdom compatibility
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => {
      const { initial, animate, exit, transition, whileInView, viewport, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock firebase
vi.mock('../../firebase.js', () => ({ trackEvent: vi.fn() }));

describe('VoterJourney component', () => {
  it('renders the section heading', () => {
    render(<VoterJourney />);
    expect(screen.getByRole('heading', { name: /your voter journey/i })).toBeInTheDocument();
  });

  it('renders all 4 journey steps', () => {
    render(<VoterJourney />);
    const steps = screen.getAllByRole('checkbox');
    expect(steps).toHaveLength(4);
  });

  it('renders a progress bar element', () => {
    render(<VoterJourney />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('step 1 is checked by default (persisted initial value)', () => {
    render(<VoterJourney />);
    const step1 = screen.getByTestId('journey-step-1');
    expect(step1).toHaveAttribute('aria-checked', 'true');
  });

  it('steps 2, 3, 4 are unchecked by default', () => {
    render(<VoterJourney />);
    expect(screen.getByTestId('journey-step-2')).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByTestId('journey-step-3')).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByTestId('journey-step-4')).toHaveAttribute('aria-checked', 'false');
  });

  it('clicking an unchecked step marks it as checked', async () => {
    const user = userEvent.setup();
    render(<VoterJourney />);
    const step2 = screen.getByTestId('journey-step-2');
    await user.click(step2);
    expect(step2).toHaveAttribute('aria-checked', 'true');
  });

  it('clicking a checked step unchecks it', async () => {
    const user = userEvent.setup();
    render(<VoterJourney />);
    const step1 = screen.getByTestId('journey-step-1');
    await user.click(step1); // uncheck
    expect(step1).toHaveAttribute('aria-checked', 'false');
  });

  it('progress bar aria-valuenow reflects completed count', () => {
    render(<VoterJourney />);
    // Default: 1 of 4 = 25%
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '25');
  });

  it('progress bar updates after toggling a step', async () => {
    const user = userEvent.setup();
    render(<VoterJourney />);
    await user.click(screen.getByTestId('journey-step-2')); // now 2/4 = 50%
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '50');
  });

  it('persists completed steps to localStorage on toggle', async () => {
    const user = userEvent.setup();
    render(<VoterJourney />);
    await user.click(screen.getByTestId('journey-step-3'));
    expect(window.localStorage.setItem).toHaveBeenCalled();
  });

  it('calls trackEvent when a step is toggled', async () => {
    const { trackEvent } = await import('../../firebase.js');
    const user = userEvent.setup();
    render(<VoterJourney />);
    await user.click(screen.getByTestId('journey-step-2'));
    expect(trackEvent).toHaveBeenCalledWith('journey_step_toggled', expect.any(Object));
  });

  it('each step has the correct accessible label', () => {
    render(<VoterJourney />);
    // Use getAllByText since step names may appear in heading + aria contexts
    expect(screen.getAllByText(/register to vote/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/verify your details/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/find your polling booth/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/cast your vote/i).length).toBeGreaterThan(0);
  });

  it('step buttons are keyboard accessible (Enter key)', async () => {
    const user = userEvent.setup();
    render(<VoterJourney />);
    const step2 = screen.getByTestId('journey-step-2');
    step2.focus();
    await user.keyboard('{Enter}');
    expect(step2).toHaveAttribute('aria-checked', 'true');
  });
});
