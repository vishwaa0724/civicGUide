/* eslint-disable */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FAQ } from '../../components/FAQ.jsx';

// Mock framer-motion to use plain DOM elements in jsdom
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => {
      // Strip non-DOM props
      const { initial, animate, exit, transition, whileInView, viewport, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock firebase trackEvent — FAQ doesn't use it, but transitive imports might
vi.mock('../../firebase.js', () => ({ trackEvent: vi.fn() }));

describe('FAQ component', () => {
  it('renders the section heading', () => {
    render(<FAQ />);
    expect(screen.getByRole('heading', { name: /frequently asked questions/i })).toBeInTheDocument();
  });

  it('renders all FAQ questions', () => {
    render(<FAQ />);
    // All 6 questions from the India-specific data
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(6);
  });

  it('first item is expanded by default (openIndex = 0)', () => {
    render(<FAQ />);
    const firstButton = screen.getByTestId('faq-button-0');
    expect(firstButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('other items are collapsed by default', () => {
    render(<FAQ />);
    const secondButton = screen.getByTestId('faq-button-1');
    expect(secondButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('clicking a collapsed question expands it', async () => {
    const user = userEvent.setup();
    render(<FAQ />);
    const secondButton = screen.getByTestId('faq-button-1');
    await user.click(secondButton);
    expect(secondButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('clicking an expanded question collapses it', async () => {
    const user = userEvent.setup();
    render(<FAQ />);
    const firstButton = screen.getByTestId('faq-button-0');
    await user.click(firstButton); // collapse
    expect(firstButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('clicking a new question collapses the previously open one', async () => {
    const user = userEvent.setup();
    render(<FAQ />);
    const firstButton = screen.getByTestId('faq-button-0');
    const secondButton = screen.getByTestId('faq-button-1');

    await user.click(secondButton);
    expect(secondButton).toHaveAttribute('aria-expanded', 'true');
    expect(firstButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('expanded answer panel has correct aria-labelledby pointing to its button', () => {
    render(<FAQ />);
    const panel = screen.getByTestId('faq-answer-0');
    expect(panel).toHaveAttribute('aria-labelledby', 'faq-btn-0');
  });

  it('each button has aria-controls pointing to its answer panel', () => {
    render(<FAQ />);
    const button = screen.getByTestId('faq-button-0');
    expect(button).toHaveAttribute('aria-controls', 'faq-panel-0');
  });

  it('the first FAQ answer contains India-specific content', () => {
    render(<FAQ />);
    // The first question answer should mention ECI / India specifics
    const answer = screen.getByTestId('faq-answer-0');
    expect(answer.textContent).toMatch(/India|citizen|18/i);
  });

  it('can be navigated with keyboard Enter key', async () => {
    const user = userEvent.setup();
    render(<FAQ />);
    const secondButton = screen.getByTestId('faq-button-1');
    secondButton.focus();
    await user.keyboard('{Enter}');
    expect(secondButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('can be navigated with keyboard Space key', async () => {
    const user = userEvent.setup();
    render(<FAQ />);
    const thirdButton = screen.getByTestId('faq-button-2');
    thirdButton.focus();
    await user.keyboard(' ');
    expect(thirdButton).toHaveAttribute('aria-expanded', 'true');
  });
});
