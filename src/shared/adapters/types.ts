export type ChatSource = 'ChatGPT' | 'Gemini' | 'Kimi' | 'Qwen' | 'Doubao' | 'DeepSeek';

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type ChatElement = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  element: Element;
};

export type ChatMessageElement = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  element: Element;
};

export type IndexItem = {
  id: string;
  type: 'heading' | 'code' | 'table';
  title: string;
  element: Element;
};
