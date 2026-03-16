import type { ChatSource } from '../adapters/types';

export type MeshSummary = {
  source: ChatSource;
  items: string[];
  updatedAt: number;
};

export const MESH_CHANNEL = 'omnichat-mesh';

export function createMeshChannel() {
  return new BroadcastChannel(MESH_CHANNEL);
}
