import { BaseSiteAdapter } from '../adapters/BaseSiteAdapter';
import type { ChatMessage } from '../adapters/types';

export type ObserverUpdate = {
  history: ChatMessage[];
  newMessages: ChatMessage[];
};

export class ObserverService {
  private observer: MutationObserver | null = null;
  private lastCount = 0;
  private scheduled = false;

  start(adapter: BaseSiteAdapter, onUpdate: (payload: ObserverUpdate) => void) {
    const root = adapter.getChatContainer() || document.body;

    const runUpdate = () => {
      this.scheduled = false;
      const history = adapter.getChatHistory();
      if (history.length === 0) return;
      if (this.lastCount === 0) this.lastCount = history.length;

      const newMessages = history.slice(this.lastCount);
      if (newMessages.length > 0) {
        this.lastCount = history.length;
        onUpdate({ history, newMessages });
      } else {
        onUpdate({ history, newMessages: [] });
      }
    };

    const schedule = () => {
      if (this.scheduled) return;
      this.scheduled = true;
      window.setTimeout(runUpdate, 200);
    };

    this.observer = new MutationObserver(() => schedule());
    this.observer.observe(root, { childList: true, subtree: true, characterData: true });

    schedule();
  }

  stop() {
    this.observer?.disconnect();
    this.observer = null;
  }
}
