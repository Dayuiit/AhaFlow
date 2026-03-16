import { BaseSiteAdapter } from './BaseSiteAdapter';
import type { ChatMessage, ChatSource } from './types';

export class ChatGPTAdapter extends BaseSiteAdapter {
  getSource(): ChatSource {
    return 'ChatGPT';
  }

  getQueryInput(): HTMLElement | null {
    const textarea = document.querySelector('textarea[aria-label], textarea[placeholder]');
    if (textarea) return textarea as HTMLElement;

    const editable = Array.from(document.querySelectorAll('[contenteditable="true"]'))
      .map((el) => el as HTMLElement)
      .find((el) => {
        const label = el.getAttribute('aria-label') || '';
        return /message|prompt|send|输入|消息/i.test(label);
      });

    return editable || null;
  }

  getChatContainer(): Element | null {
    return document.querySelector('main');
  }

  getChatHistory(): ChatMessage[] {
    const fromRoleAttr = Array.from(
      document.querySelectorAll('[data-message-author-role]')
    );

    if (fromRoleAttr.length > 0) {
      return fromRoleAttr.map((node) => {
        const role = (node.getAttribute('data-message-author-role') || 'assistant') as
          | 'user'
          | 'assistant'
          | 'system';
        return {
          role,
          content: this.getTextFromNode(node)
        };
      });
    }

    const articles = Array.from(document.querySelectorAll('main article'));
    return articles
      .map((node) => {
        const content = this.getTextFromNode(node);
        return {
          role: 'assistant',
          content
        };
      })
      .filter((msg) => msg.content.length > 0);
  }
}
