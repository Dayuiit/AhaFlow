import type { BaseSiteAdapter } from '../adapters/BaseSiteAdapter';

export function injectText(adapter: BaseSiteAdapter, text: string) {
  const input = adapter.getQueryInput();
  if (!input) return false;

  const isTextarea = input.tagName.toLowerCase() === 'textarea';

  if (isTextarea) {
    const textarea = input as HTMLTextAreaElement;
    textarea.focus();
    textarea.value = text;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  if (input.isContentEditable) {
    input.focus();
    try {
      document.execCommand('insertText', false, text);
    } catch {
      input.textContent = text;
    }
    input.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  }

  return false;
}
