import { BaseSiteAdapter } from './BaseSiteAdapter';
import type { ChatElement, ChatMessage, ChatSource } from './types';

export class KimiAdapter extends BaseSiteAdapter {
  private readonly messageSelectors = [
    'main [data-message-author-role]',
    'main [data-role]',
    'main [role="listitem"]',
    'main article'
  ];

  getSource(): ChatSource {
    return 'Kimi';
  }

  getQueryInput(): HTMLElement | null {
    return this.getFirstMatchingInput(undefined, /message|prompt|kimi|输入|消息|提问/i);
  }

  getChatContainer(): Element | null {
    return document.querySelector('main') || document.querySelector('[role="main"]');
  }

  getChatHistory(): ChatMessage[] {
    return this.toHistory(this.getChatMessageElements());
  }

  getChatMessageElements(): ChatElement[] {
    return this.collectMessages(this.messageSelectors, {
      sourceHints: ['kimi', 'assistant'],
      contentSelectors: ['.markdown', '.segment-content', '[dir="auto"]']
    });
  }
}
