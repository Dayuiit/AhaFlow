import type { BaseSiteAdapter } from '../adapters/BaseSiteAdapter';

function setNativeValue(target: HTMLTextAreaElement | HTMLInputElement, value: string) {
  const prototype = target instanceof HTMLTextAreaElement
    ? HTMLTextAreaElement.prototype
    : HTMLInputElement.prototype;
  const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
  descriptor?.set?.call(target, value);
}

function dispatchInputLikeEvents(target: HTMLElement, value: string, inputType: string) {
  try {
    target.dispatchEvent(
      new InputEvent('beforeinput', {
        bubbles: true,
        cancelable: true,
        data: value,
        inputType
      })
    );
  } catch {}

  try {
    target.dispatchEvent(
      new InputEvent('input', {
        bubbles: true,
        data: value,
        inputType
      })
    );
  } catch {
    target.dispatchEvent(new Event('input', { bubbles: true }));
  }

  target.dispatchEvent(new Event('change', { bubbles: true }));
}

export function injectText(adapter: BaseSiteAdapter, text: string) {
  const target = adapter.getQueryInput();
  if (!target) return false;

  if (target instanceof HTMLTextAreaElement || target instanceof HTMLInputElement) {
    target.focus();
    setNativeValue(target, text);
    dispatchInputLikeEvents(target, text, 'insertText');
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
    }
    dispatchInputLikeEvents(target, text, 'insertText');
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
    setNativeValue(target, next);
    dispatchInputLikeEvents(target, next, 'insertText');
    return true;
  }

  if (target.isContentEditable) {
    target.focus();
    const existing = target.textContent || '';
    const next = existing ? `${existing}\n${suffix}` : suffix;
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      const range = document.createRange();
      range.selectNodeContents(target);
      range.collapse(false);
      selection.addRange(range);
    }

    const success = document.execCommand('insertText', false, existing ? `\n${suffix}` : suffix);
    if (!success) target.textContent = next;
    dispatchInputLikeEvents(target, next, 'insertText');
    return true;
  }

  return false;
}
