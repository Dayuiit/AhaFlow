import { BaseSiteAdapter } from './BaseSiteAdapter';
import type { ChatElement, ChatMessage, ChatSource } from './types';

export class ClaudeAdapter extends BaseSiteAdapter {
  private readonly messageSelectors = [
    'main [data-testid="user-message"], main [data-testid="assistant-message"]',
    'main [data-test-render-count] article',
    'main article',
    'main [role="listitem"]',
    '[role="main"] article'
  ];

  private readonly contentSelectors = [
    '[data-testid="message-text"]',
    '.prose',
    '.font-claude-message',
    '[dir="auto"]'
  ];

  getSource(): ChatSource {
    return 'Claude';
  }

  getQueryInput(): HTMLElement | null {
    return this.getFirstMatchingInput(
      [
        'fieldset textarea',
        'textarea[aria-label]',
        'textarea[placeholder]',
        '[contenteditable="true"][role="textbox"]',
        '[contenteditable="true"]'
      ],
      /message|claude|chat|prompt|输入|消息|提问/i
    );
  }

  getChatContainer(): Element | null {
    return document.querySelector('main') || document.querySelector('[role="main"]');
  }

  getChatMessageElements(): ChatElement[] {
    return this.collectMessages(this.messageSelectors, {
      sourceHints: ['claude', 'assistant'],
      contentSelectors: this.contentSelectors
    });
  }

  getChatHistory(): ChatMessage[] {
    return this.toHistory(this.getChatMessageElements());
  }
}
