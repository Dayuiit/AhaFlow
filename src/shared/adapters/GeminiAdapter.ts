import { BaseSiteAdapter } from './BaseSiteAdapter';
import type { ChatElement, ChatMessage, ChatSource } from './types';

export class GeminiAdapter extends BaseSiteAdapter {
  private readonly inputSelectors = [
    'rich-textarea textarea',
    'rich-textarea [contenteditable="true"]',
    '[role="textbox"][contenteditable="true"]',
    'textarea[aria-label]',
    'textarea[placeholder]',
    '[contenteditable="true"][aria-label]',
    '[contenteditable="true"][data-placeholder]'
  ];

  private readonly messageSelectors = [
    'main user-query, main model-response',
    'main [data-test-id="user-query"], main [data-test-id="model-response"]',
    'main [data-user-query], main [data-response-id]',
    'main [role="listitem"]',
    'main article',
    '[role="main"] user-query, [role="main"] model-response',
    '[role="main"] [data-test-id="user-query"], [role="main"] [data-test-id="model-response"]'
  ];

  getSource(): ChatSource {
    return 'Gemini';
  }

  getQueryInput(): HTMLElement | null {
    const candidates = this.pickBySelectors(this.inputSelectors)
      .filter((node): node is HTMLElement => this.isVisible(node))
      .filter((node) => {
        const label = [
          node.getAttribute('aria-label'),
          node.getAttribute('placeholder'),
          node.getAttribute('data-placeholder'),
          node.textContent
        ]
          .filter(Boolean)
          .join(' ');
        return /message|prompt|ask|gemini|chat|输入|消息|提问|询问/i.test(label);
      });

    return candidates[0] || null;
  }

  getChatContainer(): Element | null {
    return document.querySelector('main') || document.querySelector('[role="main"]');
  }

  private getRole(node: Element): ChatMessage['role'] {
    const signal = [
      node.tagName,
      node.getAttribute('data-test-id'),
      node.getAttribute('data-message-author-role'),
      node.getAttribute('data-role'),
      node.getAttribute('aria-label'),
      node.getAttribute('class'),
      node.getAttribute('id')
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    if (/user-query|user message|data-user-query|author-user|\byou\b|\buser\b|你|我/.test(signal)) {
      return 'user';
    }
    if (/model-response|assistant|gemini|response|author-model|bot|ai/.test(signal)) {
      return 'assistant';
    }
    return 'assistant';
  }

  private getMessageText(node: Element): string {
    const contentRoot = node.querySelector(
      [
        '[data-test-id="user-query-text"]',
        '[data-test-id="model-response-text"]',
        '.query-text-line',
        '.markdown',
        '.model-response-text',
        '.message-content',
        '[dir="auto"]'
      ].join(', ')
    );

    const text = this.getTextFromNode(contentRoot || node);
    return text
      .replace(/\b(thumb_up|thumb_down|edit|retry|copy|share)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private getMessageNodes(): Element[] {
    return this.pickBySelectors(this.messageSelectors).filter((node) => this.isVisible(node));
  }

  getChatHistory(): ChatMessage[] {
    return this.toHistory(this.getChatMessageElements());
  }

  getChatMessageElements(): ChatElement[] {
    return this.uniqueMessages(
      this.getMessageNodes()
        .map((node) => {
          const content = this.getMessageText(node);
          return { role: this.getRole(node), content, element: node };
        })
        .filter((msg) => msg.content.length > 0)
    );
  }
}
