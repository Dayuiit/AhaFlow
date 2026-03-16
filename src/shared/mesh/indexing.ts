import type { IndexItem } from '../adapters/types';

let counter = 0;

function makeId() {
  counter += 1;
  return `omni-index-${counter}`;
}

export function buildIndex(root: Element | null): IndexItem[] {
  if (!root) return [];

  const items: IndexItem[] = [];

  root.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((el) => {
    const title = el.textContent?.trim();
    if (!title) return;
    items.push({ id: makeId(), type: 'heading', title, element: el });
  });

  root.querySelectorAll('pre, code').forEach((el) => {
    const text = el.textContent?.trim();
    if (!text) return;
    const title = text.split('\n')[0].slice(0, 60);
    items.push({ id: makeId(), type: 'code', title, element: el });
  });

  root.querySelectorAll('table').forEach((el, idx) => {
    const title = `Table ${idx + 1}`;
    items.push({ id: makeId(), type: 'table', title, element: el });
  });

  return items.slice(0, 80);
}
