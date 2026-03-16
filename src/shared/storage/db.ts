import Dexie, { type Table } from 'dexie';
import type { ChatSource } from '../adapters/types';

export interface MeshSessionRecord {
  sessionId: string;
  source: ChatSource;
  title: string;
  lastUpdated: number;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    type: 'text' | 'code' | 'summary';
  }>;
}

export class MeshDB extends Dexie {
  sessions!: Table<MeshSessionRecord, string>;

  constructor() {
    super('omnichat-mesh');
    this.version(1).stores({
      sessions: 'sessionId, source, lastUpdated'
    });
  }
}

export const meshDB = new MeshDB();
