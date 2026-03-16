export type ChatSource = 'ChatGPT' | 'Gemini' | 'Kimi';

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type IndexItem = {
  id: string;
  type: 'heading' | 'code' | 'table';
  title: string;
  element: Element;
};
