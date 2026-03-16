export type Persona = {
  id: string;
  name: string;
  prompt: string;
};

const PERSONA_KEY = 'omni_personas';
const PREF_KEY = 'omni_prefs';

export async function loadPersonas(): Promise<Persona[]> {
  const data = await chrome.storage.local.get(PERSONA_KEY);
  return (data[PERSONA_KEY] as Persona[]) || [];
}

export async function savePersonas(personas: Persona[]) {
  await chrome.storage.local.set({ [PERSONA_KEY]: personas });
}

export async function loadPrefs<T extends object>(fallback: T): Promise<T> {
  const data = await chrome.storage.sync.get(PREF_KEY);
  return (data[PREF_KEY] as T) || fallback;
}

export async function savePrefs<T extends object>(prefs: T) {
  await chrome.storage.sync.set({ [PREF_KEY]: prefs });
}
