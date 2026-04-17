import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChatMessage } from './chat-message';

describe('ChatMessage', () => {
  it('renders user message correctly', () => {
    const message = {
      id: 'msg-1',
      role: 'user' as const,
      content: 'Hello AI, help me analyze this document',
      timestamp: new Date('2024-01-15T10:30:00'),
    };

    render(<ChatMessage message={message} />);

    expect(screen.getByText('Hello AI, help me analyze this document')).toBeInTheDocument();
    expect(screen.getByText(/10:30/i)).toBeInTheDocument();
  });

  it('renders AI message correctly', () => {
    const message = {
      id: 'msg-2',
      role: 'assistant' as const,
      content: 'I can help you analyze the document. Let me review it first.',
      model: 'gpt-4',
      timestamp: new Date('2024-01-15T10:31:00'),
    };

    render(<ChatMessage message={message} />);

    expect(screen.getByText('I can help you analyze the document. Let me review it first.')).toBeInTheDocument();
    expect(screen.getByText('Model: gpt-4')).toBeInTheDocument();
  });

  it('renders AI message with citations', () => {
    const message = {
      id: 'msg-3',
      role: 'assistant' as const,
      content: 'Based on the Q4 Report, revenue increased by 25%.',
      model: 'gpt-4',
      citations: [
        {
          id: 'cit-1',
          title: 'Q4 Financial Report.pdf',
          excerpt: 'Revenue grew 25% year over year',
          sourceType: 'pdf' as const,
        },
        {
          id: 'cit-2',
          title: 'Annual Summary',
          excerpt: 'Strong performance in Q4',
          sourceType: 'notion' as const,
        },
      ],
      timestamp: new Date('2024-01-15T10:32:00'),
    };

    render(<ChatMessage message={message} />);

    expect(screen.getByText('Sources:')).toBeInTheDocument();
    expect(screen.getByText('Q4 Financial Report.pdf')).toBeInTheDocument();
    expect(screen.getByText('Annual Summary')).toBeInTheDocument();
  });

  it('renders AI message without citations section when no citations provided', () => {
    const message = {
      id: 'msg-4',
      role: 'assistant' as const,
      content: 'Here is my analysis.',
      timestamp: new Date('2024-01-15T10:33:00'),
    };

    render(<ChatMessage message={message} />);

    expect(screen.getByText('Here is my analysis.')).toBeInTheDocument();
    expect(screen.queryByText('Sources:')).not.toBeInTheDocument();
  });

  it('does not render model badge for user messages', () => {
    const message = {
      id: 'msg-5',
      role: 'user' as const,
      content: 'Test message',
      model: 'gpt-4', // Should be ignored for user messages
      timestamp: new Date('2024-01-15T10:34:00'),
    };

    render(<ChatMessage message={message} />);

    expect(screen.queryByText(/Model:/)).not.toBeInTheDocument();
  });

  it('does not render model badge when model is not specified', () => {
    const message = {
      id: 'msg-6',
      role: 'assistant' as const,
      content: 'Test message without model',
      timestamp: new Date('2024-01-15T10:35:00'),
    };

    render(<ChatMessage message={message} />);

    expect(screen.queryByText(/Model:/)).not.toBeInTheDocument();
  });

  it('renders markdown content correctly', () => {
    const message = {
      id: 'msg-7',
      role: 'assistant' as const,
      content: '## Heading\n\n- Item 1\n- Item 2',
      timestamp: new Date('2024-01-15T10:36:00'),
    };

    render(<ChatMessage message={message} />);

    expect(screen.getByText('Heading')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('renders empty citations section when citations array is empty', () => {
    const message = {
      id: 'msg-8',
      role: 'assistant' as const,
      content: 'Test with empty citations',
      citations: [],
      timestamp: new Date('2024-01-15T10:37:00'),
    };

    render(<ChatMessage message={message} />);

    expect(screen.queryByText('Sources:')).not.toBeInTheDocument();
  });
});
