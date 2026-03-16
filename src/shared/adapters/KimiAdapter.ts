import { BaseSiteAdapter } from './BaseSiteAdapter';
import type { ChatMessage, ChatSource } from './types';

export class KimiAdapter extends BaseSiteAdapter {
  getSource(): ChatSource {
    return 'Kimi';
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
    return document.querySelector('main') || document.querySelector('[role="main"]');
  }

  getChatHistory(): ChatMessage[] {
    const listItems = this.pickBySelectors([
      'main [role="listitem"]',
      'main article',
      'main [data-message-author-role]'
    ]);

    const messages = listItems
      .map((node) => {
        const roleAttr = node.getAttribute('data-message-author-role');
        const aria = node.getAttribute('aria-label') || '';
        let role: ChatMessage['role'] = 'assistant';
        if (roleAttr === 'user' || /you|user|你/i.test(aria)) role = 'user';
        if (/assistant|kimi|model/i.test(aria)) role = 'assistant';
        const content = this.getTextFromNode(node);
        return { role, content };
      })
      .filter((msg) => msg.content.length > 0);

    return messages;
  }
}
