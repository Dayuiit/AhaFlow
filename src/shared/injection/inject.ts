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

export function appendText(adapter: BaseSiteAdapter, text: string) {
  const target = adapter.getQueryInput();
  if (!target) return false;

  const suffix = text.trim();

  if (target instanceof HTMLTextAreaElement || target instanceof HTMLInputElement) {
    target.focus();
    const existing = target.value || '';
    const next = existing ? `${existing}\n${suffix}` : suffix;
    target.value = next;
    target.dispatchEvent(new Event('input', { bubbles: true }));
    target.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  if (target.isContentEditable) {
    target.focus();
    const existing = target.textContent || '';
    const next = existing ? `${existing}\n${suffix}` : suffix;
    target.textContent = next;
    target.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  }

  return false;
}
