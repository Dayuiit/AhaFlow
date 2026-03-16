import type { ChatMessage } from '../adapters/types';

const MAX_LEN = 200;

export function summarizeMessages(messages: ChatMessage[], count = 3): string[] {
  const tail = messages.slice(-count);
  return tail.map((msg) => {
    const prefix = msg.role === 'user' ? 'You: ' : 'AI: ';
    const clipped = msg.content.length > MAX_LEN ? `${msg.content.slice(0, MAX_LEN)}…` : msg.content;
    return `${prefix}${clipped}`;
  });
}
