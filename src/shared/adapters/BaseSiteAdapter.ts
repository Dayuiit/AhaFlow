import type { ChatElement, ChatMessage, ChatSource } from './types';

export abstract class BaseSiteAdapter {
  protected readonly defaultInputSelectors = [
    'textarea[aria-label]',
    'textarea[placeholder]',
    'textarea',
    '[contenteditable="true"][role="textbox"]',
    '[contenteditable="true"][aria-label]',
    '[contenteditable="true"][data-placeholder]',
    '[contenteditable="true"]'
  ];

  protected readonly defaultInputLabelPattern = /message|prompt|ask|chat|claude|gpt|deepseek|kimi|qwen|doubao|gemini|输入|消息|提问|询问/i;

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

  protected isVisible(node: Element | null): node is HTMLElement {
    if (!(node instanceof HTMLElement)) return false;
    const style = window.getComputedStyle(node);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    return node.getClientRects().length > 0;
  }

  protected pickBySelectors(selectors: string[]): Element[] {
    for (const selector of selectors) {
      const nodes = Array.from(document.querySelectorAll(selector));
      if (nodes.length > 0) return nodes;
    }
    return [];
  }

  protected uniqueMessages<T extends ChatMessage | ChatElement>(items: T[]): T[] {
    const deduped: T[] = [];
    for (const item of items) {
      const previous = deduped[deduped.length - 1];
      if (previous && previous.role === item.role && previous.content === item.content) continue;
      deduped.push(item);
    }
    return deduped;
  }

  protected getFirstMatchingInput(
    selectors = this.defaultInputSelectors,
    labelPattern = this.defaultInputLabelPattern
  ): HTMLElement | null {
    const candidates = this.pickBySelectors(selectors)
      .filter((node): node is HTMLElement => this.isVisible(node))
      .filter((node) => !node.hasAttribute('readonly') && !node.hasAttribute('disabled'))
      .filter((node) => {
        const label = [
          node.getAttribute('aria-label'),
          node.getAttribute('placeholder'),
          node.getAttribute('data-placeholder'),
          node.getAttribute('title'),
          node.textContent
        ]
          .filter(Boolean)
          .join(' ');
        const isTextarea = node.tagName === 'TEXTAREA';
        const isTextbox = node.getAttribute('role') === 'textbox';
        const inComposer = Boolean(node.closest('form, footer, main'));
        return labelPattern.test(label) || isTextarea || (isTextbox && inComposer);
      });
    return candidates[0] || null;
  }

  protected inferMessageRole(node: Element, sourceHints: string[] = []): ChatMessage['role'] {
    const signal = [
      node.tagName,
      node.getAttribute('data-message-author-role'),
      node.getAttribute('data-role'),
      node.getAttribute('data-testid'),
      node.getAttribute('data-test-id'),
      node.getAttribute('aria-label'),
      node.getAttribute('class'),
      node.getAttribute('id')
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    if (/\b(system|developer)\b/.test(signal)) return 'system';
    if (/\buser\b|\byou\b|human|prompt|query|input|你|我/.test(signal)) return 'user';
    if (/\bassistant\b|bot|model|response|reply|output|ai\b/.test(signal)) return 'assistant';
    if (sourceHints.some((hint) => signal.includes(hint.toLowerCase()))) return 'assistant';
    return 'assistant';
  }

  protected getMessageContent(node: Element, selectors: string[] = []): string {
    const target = selectors.length > 0 ? node.querySelector(selectors.join(', ')) : null;
    return this.getTextFromNode(target || node)
      .replace(/\b(copy|edit|retry|share|重新生成|复制)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  protected collectMessages(
    selectors: string[],
    options?: {
      sourceHints?: string[];
      contentSelectors?: string[];
    }
  ): ChatElement[] {
    const sourceHints = options?.sourceHints || [];
    const contentSelectors = options?.contentSelectors || [];
    const seen = new Set<Element>();
    const nodes: Element[] = [];
    for (const selector of selectors) {
      for (const node of Array.from(document.querySelectorAll(selector))) {
        if (seen.has(node)) continue;
        seen.add(node);
        nodes.push(node);
      }
    }
    return this.uniqueMessages(
      nodes
        .filter((node) => this.isVisible(node))
        .map((node) => {
          const content = this.getMessageContent(node, contentSelectors);
          return {
            role: this.inferMessageRole(node, sourceHints),
            content,
            element: node
          };
        })
        .filter((item) => item.content.length > 0)
    );
  }

  protected toHistory(elements: ChatElement[]): ChatMessage[] {
    return elements.map(({ role, content }) => ({ role, content }));
  }
}
