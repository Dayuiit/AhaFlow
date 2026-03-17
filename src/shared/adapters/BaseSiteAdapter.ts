import type { ChatElement, ChatMessage, ChatSource } from './types';

export abstract class BaseSiteAdapter {
  abstract getSource(): ChatSource;
  abstract getQueryInput(): HTMLElement | null;
  abstract getChatHistory(): ChatMessage[];
  abstract getChatMessageElements(): ChatElement[];
  abstract getChatContainer(): Element | null;

  getSessionId(): string {
    const path = location.pathname.replace(/\/+$/, '') || '/';
    return `${location.host}${path}`;
  }

  protected getTextFromNode(node: Element): string {
    const text = node.textContent ?? '';
    return text.replace(/\s+/g, ' ').trim();
  }

  protected pickBySelectors(selectors: string[]): Element[] {
    for (const selector of selectors) {
      const nodes = Array.from(document.querySelectorAll(selector));
      if (nodes.length > 0) return nodes;
    }
    return [];
  }
}
