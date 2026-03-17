import { BaseSiteAdapter } from './BaseSiteAdapter';
import type { ChatElement, ChatMessage, ChatSource } from './types';

export class QwenAdapter extends BaseSiteAdapter {
  getSource(): ChatSource {
    return 'Qwen';
  }

  getQueryInput(): HTMLElement | null {
    const textarea = document.querySelector('textarea[aria-label], textarea[placeholder]');
    if (textarea) return textarea as HTMLElement;

    const editable = Array.from(document.querySelectorAll('[contenteditable="true"]'))
      .map((el) => el as HTMLElement)
      .find((el) => {
        const label = el.getAttribute('aria-label') || '';
        return /message|prompt|send|输入|消息|提问/i.test(label);
      });

    return editable || null;
  }

  getChatContainer(): Element | null {
    return document.querySelector('main') || document.querySelector('section[role="main"]');
  }

  getChatHistory(): ChatMessage[] {
    const listItems = this.pickBySelectors([
      'main [role="listitem"]',
      'main article',
      'main [data-message-author-role]',
      'main [data-role]'
    ]);

    return listItems
      .map((node) => {
        const roleAttr = node.getAttribute('data-message-author-role') || node.getAttribute('data-role');
        const aria = node.getAttribute('aria-label') || '';
        let role: ChatMessage['role'] = 'assistant';
        if (roleAttr === 'user' || /you|user|你|我/i.test(aria)) role = 'user';
        if (roleAttr === 'assistant' || roleAttr === 'ai' || /assistant|qwen|model/i.test(aria)) role = 'assistant';
        const content = this.getTextFromNode(node);
        return { role, content };
      })
      .filter((msg) => msg.content.length > 0);
  }

  getChatMessageElements(): ChatElement[] {
    const listItems = this.pickBySelectors([
      'main [role="listitem"]',
      'main article',
      'main [data-message-author-role]',
      'main [data-role]'
    ]);

    return listItems
      .map((node) => {
        const roleAttr = node.getAttribute('data-message-author-role') || node.getAttribute('data-role');
        const aria = node.getAttribute('aria-label') || '';
        let role: ChatElement['role'] = 'assistant';
        if (roleAttr === 'user' || /you|user|你|我/i.test(aria)) role = 'user';
        if (roleAttr === 'assistant' || roleAttr === 'ai' || /assistant|qwen|model/i.test(aria)) role = 'assistant';
        const content = this.getTextFromNode(node);
        return { role, content, element: node };
      })
      .filter((msg) => msg.content.length > 0);
  }
}
