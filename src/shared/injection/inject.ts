import type { BaseSiteAdapter } from '../adapters/BaseSiteAdapter';

export function injectText(adapter: BaseSiteAdapter, text: string) {
  const target = adapter.getQueryInput();
  if (!target) return false;

  if (target instanceof HTMLTextAreaElement || target instanceof HTMLInputElement) {
    target.focus();
    target.value = text;
    target.dispatchEvent(new Event('input', { bubbles: true }));
    target.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  if (target.isContentEditable) {
    target.focus();
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      const range = document.createRange();
      range.selectNodeContents(target);
      range.collapse(false);
      selection.addRange(range);
    }

    const success = document.execCommand('insertText', false, text);
    if (!success) {
      target.textContent = text;
      target.dispatchEvent(new Event('input', { bubbles: true }));
    }
    return true;
  }

  return false;
}
