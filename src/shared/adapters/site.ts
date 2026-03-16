import { ChatGPTAdapter } from './ChatGPTAdapter';
import { GeminiAdapter } from './GeminiAdapter';
import { KimiAdapter } from './KimiAdapter';
import type { BaseSiteAdapter } from './BaseSiteAdapter';

export function createAdapterForHost(host: string): BaseSiteAdapter | null {
  if (host.includes('openai.com') || host.includes('chatgpt.com') || host.includes('chat.openai.com')) {
    return new ChatGPTAdapter();
  }
  if (host.includes('gemini.google.com')) {
    return new GeminiAdapter();
  }
  if (host.includes('kimi.moonshot.cn') || host.includes('kimi.ai') || host.includes('kimi.com')) {
    return new KimiAdapter();
  }
  return null;
}
