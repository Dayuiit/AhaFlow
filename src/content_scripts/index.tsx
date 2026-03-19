import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { sidebarStyles } from './sidebarStyles';
import { createAdapterForHost } from '../shared/adapters/site';
import type { BaseSiteAdapter } from '../shared/adapters/BaseSiteAdapter';
import type { ChatElement } from '../shared/adapters/types';
import { ObserverService } from '../shared/observer/ObserverService';
import { createMeshChannel, type MeshSummary } from '../shared/mesh/channel';
import { summarizeMessages } from '../shared/mesh/summarize';
import { appendText, injectText } from '../shared/injection/inject';
import { loadPersonas, savePersonas, loadPrefs, savePrefs, type Persona } from '../shared/storage/persona';
import { getDictionary, getDefaultLanguage, type LanguageCode } from '../shared/i18n';

type Prefs = {
  focusMode: boolean;
  language: LanguageCode;
  theme: 'light' | 'dark';
  liquidGlass: boolean;
};

type TimelineItem = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  element: Element;
  weight: number;
};

function getDefaultTheme(): Prefs['theme'] {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const defaultPrefs: Prefs = {
  focusMode: false,
  language: getDefaultLanguage(),
  theme: getDefaultTheme(),
  liquidGlass: true
};

let cachedPersonas: Persona[] = [];

function installSlashCommands(adapter: BaseSiteAdapter, personas: Persona[]) {
  cachedPersonas = personas;
  const input = adapter.getQueryInput();
  if (!input || input.getAttribute('data-omni-slash') === '1') return;

  input.setAttribute('data-omni-slash', '1');
  input.addEventListener('input', () => {
    const list = cachedPersonas;
    if (list.length === 0) return;

    if (input instanceof HTMLTextAreaElement || input instanceof HTMLInputElement) {
      const value = input.value;
      if (!value.startsWith('/')) return;
      const match = value.slice(1).split(/\s/)[0];
      const persona = list.find((p) => p.name.toLowerCase() === match.toLowerCase());
      if (!persona) return;
      const rest = value.slice(1 + match.length).trimStart();
      input.value = `${persona.prompt}${rest ? `\n${rest}` : ''}`;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    }

    if (input.getAttribute('contenteditable') === 'true') {
      const value = input.textContent || '';
      if (!value.startsWith('/')) return;
      const match = value.slice(1).split(/\s/)[0];
      const persona = list.find((p) => p.name.toLowerCase() === match.toLowerCase());
      if (!persona) return;
      const rest = value.slice(1 + match.length).trimStart();
      input.textContent = `${persona.prompt}${rest ? `\n${rest}` : ''}`;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
}

function applyFocusMode(adapter: BaseSiteAdapter, enabled: boolean) {
  const styleId = 'omni-focus-style';
  let style = document.getElementById(styleId) as HTMLStyleElement | null;
  if (!enabled) {
    style?.remove();
    return;
  }

  if (!style) {
    style = document.createElement('style');
    style.id = styleId;
    document.head.appendChild(style);
  }

  const host = location.host;
  let css = '';
  if (host.includes('openai.com') || host.includes('chatgpt.com')) {
    css = `nav[aria-label], aside { display: none !important; }`;
  } else if (host.includes('claude.ai')) {
    css = `aside, nav, [data-testid="chat-history"], [data-testid="conversation-sidebar"] { display: none !important; }`;
  } else if (host.includes('gemini.google.com')) {
    css = `aside, [role="navigation"], nav { display: none !important; }`;
  } else if (host.includes('kimi')) {
    css = `aside, [role="navigation"], nav { display: none !important; }`;
  } else if (host.includes('qwen') || host.includes('tongyi') || host.includes('aliyun')) {
    css = `aside, [role="navigation"], nav { display: none !important; }`;
  } else if (host.includes('doubao')) {
    css = `aside, [role="navigation"], nav { display: none !important; }`;
  } else if (host.includes('deepseek')) {
    css = `aside, [role="navigation"], nav { display: none !important; }`;
  }

  style.textContent = css;
}

function clampWeight(content: string) {
  const base = content.length / 80;
  return Math.min(4, Math.max(0.5, base));
}

function snippet(text: string, len = 30) {
  return text.length > len ? `${text.slice(0, len)}…` : text;
}

function tagType(text: string) {
  if (/```|<code>|\bfunction\b|=>|\bconst\b/.test(text)) return 'code';
  if (/\|.+\|/.test(text) || /\btable\b/i.test(text)) return 'table';
  return 'text';
}

function Sidebar() {
  const adapter = useMemo(() => createAdapterForHost(location.host), []);
  const [summaries, setSummaries] = useState<MeshSummary | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState<'flow' | 'actions'>('flow');
  const [toast, setToast] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const [settingsClosing, setSettingsClosing] = useState(false);
  const [personaName, setPersonaName] = useState('');
  const [personaPrompt, setPersonaPrompt] = useState('');
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [pillVisible, setPillVisible] = useState(false);
  const [pillOpen, setPillOpen] = useState(false);
  const [pillPos, setPillPos] = useState({ left: 0, top: 0 });
  const [editingPersonaId, setEditingPersonaId] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const debugPeek = false;
  const toastTimer = useRef<number | null>(null);
  const pillRef = useRef<HTMLDivElement | null>(null);
  const pillInteractingRef = useRef(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const dict = getDictionary(prefs.language);
  const t = (key: keyof typeof dict) => dict[key];

  useEffect(() => {
    loadPersonas().then((data) => {
      setPersonas(data);
      if (adapter) installSlashCommands(adapter, data);
    });
    loadPrefs(defaultPrefs).then((data) => {
      const merged = { ...defaultPrefs, ...data } as Prefs;
      setPrefs(merged);
      if (adapter) applyFocusMode(adapter, merged.focusMode);
    });

    const onChange = () => {
      loadPersonas().then((data) => {
        setPersonas(data);
        if (adapter) installSlashCommands(adapter, data);
      });
      loadPrefs(defaultPrefs).then((data) => {
        const merged = { ...defaultPrefs, ...data } as Prefs;
        setPrefs(merged);
        if (adapter) applyFocusMode(adapter, merged.focusMode);
      });
    };

    chrome.storage.onChanged.addListener(onChange);
    return () => chrome.storage.onChanged.removeListener(onChange);
  }, [adapter]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const syncTheme = () => {
      chrome.storage.local.get(['prefs'], (result) => {
        const prefsFromStorage = result?.prefs as Partial<Prefs> | undefined;
        if (prefsFromStorage?.theme) return;
        setPrefs((prev) => ({ ...prev, theme: media.matches ? 'dark' : 'light' }));
      });
    };
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', syncTheme);
      return () => media.removeEventListener('change', syncTheme);
    }
    media.addListener(syncTheme);
    return () => media.removeListener(syncTheme);
  }, []);

  useEffect(() => {
    if (!adapter) return;
    const observer = new ObserverService();
    const channel = createMeshChannel();

    channel.onmessage = (event) => {
      setSummaries(event.data as MeshSummary);
    };

    observer.start(adapter, ({ history }) => {
      const items = summarizeMessages(history, 3);
      const summary: MeshSummary = {
        source: adapter.getSource(),
        items,
        updatedAt: Date.now()
      };
      channel.postMessage(summary);
      setSummaries(summary);
      installSlashCommands(adapter, personas);

      const elements = adapter.getChatMessageElements();
      const sliced = elements.slice(-24);
      setTimeline(
        sliced.map((item, idx) => ({
          id: `${idx}-${item.role}`,
          role: item.role,
          content: item.content,
          element: item.element,
          weight: clampWeight(item.content)
        }))
      );
    });

    return () => {
      observer.stop();
      channel.close();
    };
  }, [adapter, personas]);


  useEffect(() => {
    if (!adapter) return;
    const input = () => adapter.getQueryInput();

    const updatePosition = () => {
      const target = input();
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const left = rect.left - 16;
      const top = rect.bottom - 12 - 32;
      setPillPos({ left, top });
    };

    const handleFocusIn = (event: FocusEvent) => {
      const target = input();
      if (!target) return;
      if (event.target === target || target.contains(event.target as Node)) {
        setPillVisible(true);
        updatePosition();
      }
    };

    const handleFocusOut = (event: FocusEvent) => {
      const target = input();
      if (!target) return;
      if (pillInteractingRef.current) return;
      if (pillRef.current?.contains(event.relatedTarget as Node)) return;
      if (event.target === target || target.contains(event.target as Node)) {
        if (!pillOpen) setPillVisible(false);
      }
    };

    const handleGlobalMouseDown = (event: MouseEvent) => {
      if (pillRef.current && pillRef.current.contains(event.target as Node)) return;
      setPillOpen(false);
    };

    const handleViewportUpdate = () => {
      if (pillVisible || pillOpen) updatePosition();
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    document.addEventListener('mousedown', handleGlobalMouseDown);
    window.addEventListener('resize', handleViewportUpdate);
    window.addEventListener('scroll', handleViewportUpdate, true);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
      document.removeEventListener('mousedown', handleGlobalMouseDown);
      window.removeEventListener('resize', handleViewportUpdate);
      window.removeEventListener('scroll', handleViewportUpdate, true);
    };
  }, [adapter, pillOpen, pillVisible]);

  useEffect(() => {
    setScrollOffset((prev) => clampScroll(prev));
  }, [timeline.length]);

  if (!adapter) return null;

  const showToast = (message: string) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(''), 2500);
  };

  const updatePeekFromIndex = (index: number, target?: HTMLElement | null) => {
    const node = target || nodeRefs.current[index];
    const sidebar = sidebarRef.current;
    if (!node || !sidebar) return;
    const rect = node.getBoundingClientRect();
    const sidebarRect = sidebar.getBoundingClientRect();
    const top = rect.top + rect.height / 2;
    const left = sidebarRect.left - 16;
    const tooltipWidth = 260;
    const margin = 12;
    const maxLeft = window.innerWidth - margin;
    const minLeft = tooltipWidth + margin;
    const clampedLeft = Math.min(Math.max(left, minLeft), maxLeft);
    const clampedTop = Math.min(Math.max(top, margin), window.innerHeight - margin);
    setPeekPos({ top: clampedTop, left: clampedLeft });
    setPeekItem(timeline[index] || null);
  };

  const resetPersonaEditor = () => {
    setEditingPersonaId(null);
    setPersonaName('');
    setPersonaPrompt('');
  };

  const openSettingsPanel = () => {
    setSettingsClosing(false);
    setShowSettings(true);
  };

  const closeSettingsPanel = (resetEditor = true) => {
    setSettingsClosing(true);
    window.setTimeout(() => {
      setShowSettings(false);
      setSettingsClosing(false);
      if (resetEditor) resetPersonaEditor();
    }, 340);
  };

  const injectSummary = (text: string) => {
    injectText(adapter, text);
    const msg = text.length > 60 ? `${text.slice(0, 60)}…` : text;
    showToast(msg);
  };

  const focusInputEnd = () => {
    const target = adapter.getQueryInput();
    if (!target) return;
    target.focus();

    if (target instanceof HTMLTextAreaElement || target instanceof HTMLInputElement) {
      const length = target.value.length;
      target.setSelectionRange(length, length);
      return;
    }

    if (target.isContentEditable) {
      const selection = window.getSelection();
      if (!selection) return;
      selection.removeAllRanges();
      const range = document.createRange();
      range.selectNodeContents(target);
      range.collapse(false);
      selection.addRange(range);
    }
  };

  const flashInput = () => {
    const target = adapter.getQueryInput();
    if (!target) return;
    const el = target as HTMLElement;
    const prevShadow = el.style.boxShadow;
    const prevBorder = el.style.borderColor;
    el.style.boxShadow = '0 0 24px rgba(191, 90, 242, 0.3), inset 0 0 12px rgba(191, 90, 242, 0.1)';
    el.style.borderColor = '#bf5af2';
    window.setTimeout(() => {
      el.style.boxShadow = prevShadow;
      el.style.borderColor = prevBorder;
    }, 600);
  };

  const toggleTheme = async () => {
    const next = { ...prefs, theme: prefs.theme === 'dark' ? 'light' : 'dark' };
    setPrefs(next);
    await savePrefs(next);
  };

  const toggleLiquidGlass = async () => {
    const next = { ...prefs, liquidGlass: !prefs.liquidGlass };
    setPrefs(next);
    await savePrefs(next);
  };

  const toggleFocus = async () => {
    const next = { ...prefs, focusMode: !prefs.focusMode };
    setPrefs(next);
    await savePrefs(next);
    applyFocusMode(adapter, next.focusMode);
    showToast(next.focusMode ? t('actionFocus') : t('focus'));
  };

  const toggleLanguage = async () => {
    const nextLang: LanguageCode = prefs.language === 'zh-CN' ? 'en-US' : 'zh-CN';
    const next = { ...prefs, language: nextLang };
    setPrefs(next);
    await savePrefs(next);
    showToast(t('actionLanguage'));
  };

  const savePersonaEntry = async () => {
    if (!personaName.trim() || !personaPrompt.trim()) return;
    const name = personaName.trim();
    const prompt = personaPrompt.trim();

    if (editingPersonaId) {
      const next = personas.map((persona) =>
        persona.id === editingPersonaId ? { ...persona, name, prompt } : persona
      );
      await savePersonas(next);
      setPersonas(next);
      resetPersonaEditor();
      return;
    }

    const next = [...personas, { id: crypto.randomUUID(), name, prompt }];
    await savePersonas(next);
    setPersonas(next);
    resetPersonaEditor();
    closeSettingsPanel(false);
  };

  const removePersona = async (id: string) => {
    const next = personas.filter((p) => p.id !== id);
    await savePersonas(next);
    setPersonas(next);
  };

  const movePersona = async (id: string, direction: 'up' | 'down') => {
    const index = personas.findIndex((p) => p.id === id);
    if (index === -1) return;
    const next = [...personas];
    const [item] = next.splice(index, 1);
    const nextIndex =
      direction === 'up' ? Math.max(0, index - 1) : Math.min(next.length, index + 1);
    next.splice(nextIndex, 0, item);
    await savePersonas(next);
    setPersonas(next);
  };

  const movePersonaToTop = async (id: string) => {
    const index = personas.findIndex((p) => p.id === id);
    if (index <= 0) return;
    const next = [...personas];
    const [item] = next.splice(index, 1);
    next.unshift(item);
    await savePersonas(next);
    setPersonas(next);
  };

  const beginEditPersona = (persona: Persona) => {
    setEditingPersonaId(persona.id);
    setPersonaName(persona.name);
    setPersonaPrompt(persona.prompt);
    openSettingsPanel();
  };

  const latestPins = useMemo(() => {
    const items = summaries?.items ?? [];
    return items.slice(-2).reverse();
  }, [summaries]);

  const showPill = pillVisible || pillOpen;

  const clampScroll = (offset: number) => {
    const track = trackRef.current;
    const scroll = scrollRef.current;
    if (!track || !scroll) return 0;
    const max = Math.max(0, scroll.scrollHeight - track.clientHeight);
    return Math.min(Math.max(0, offset), max);
  };

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        ticking = false;
        if (timeline.length === 0) return;
        let bestIndex = 0;
        let bestDistance = Number.POSITIVE_INFINITY;
        for (let i = 0; i < timeline.length; i++) {
          const el = timeline[i].element as HTMLElement;
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          const distance = Math.abs(rect.top);
          if (rect.top <= 120 && distance < bestDistance) {
            bestDistance = distance;
            bestIndex = i;
          }
        }
        setSelectedIndex(bestIndex);
      });
    };
    window.addEventListener('scroll', handleScroll, true);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [timeline]);

  const renderPinIcon = (text: string) => {
    const type = tagType(text);
    if (type === 'code') {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      );
    }
    if (type === 'table') {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="3" y1="15" x2="21" y2="15"></line>
          <line x1="9" y1="3" x2="9" y2="21"></line>
          <line x1="15" y1="3" x2="15" y2="21"></line>
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    );
  };

  return (
    <div className="aha-root" data-theme={prefs.theme} data-liquid-glass={prefs.liquidGlass ? 'on' : 'off'}>
      <svg style={{ width: 0, height: 0, position: 'absolute' }}>
        <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00c6ff" />
          <stop offset="100%" stopColor="#8a2387" />
        </linearGradient>
      </svg>

      <div id="ahaflow-container" className={isOpen ? 'is-open' : ''}>
        <div className={`aha-panel ${activeView === 'actions' ? 'show-actions' : ''}`}>
          <div className="aha-header">
            <div className="aha-top-bar">
              <div className="aha-logo">
                <svg viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                {t('brand')}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="icon-btn" onClick={toggleTheme} title={t('language')}>
                  {prefs.theme === 'dark' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                  )}
                </button>
                <button
                  className={`icon-btn ${prefs.liquidGlass ? 'is-active' : ''}`}
                  onClick={toggleLiquidGlass}
                  title={t('liquidGlass')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3c4.2 0 7 2.8 7 7 0 5.5-5 9-7 11-2-2-7-5.5-7-11 0-4.2 2.8-7 7-7Z" />
                    <path d="M9 10.5c.9-1.8 2.3-2.7 4.2-3" />
                  </svg>
                </button>
                <button className="icon-btn" onClick={() => setIsOpen(false)} title={t('collapse')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
            <div className="aha-segmented" id="segment-control">
              <div className="aha-seg-indicator" />
              <div
                className={`aha-seg-btn ${activeView === 'flow' ? 'active' : ''}`}
                onClick={() => setActiveView('flow')}
              >
                {t('tabFlow')}
              </div>
              <div
                className={`aha-seg-btn ${activeView === 'actions' ? 'active' : ''}`}
                onClick={() => setActiveView('actions')}
              >
                {t('tabActions')}
              </div>
            </div>
          </div>

          <div className="aha-view-container" id="view-container">
            <div className="aha-view" id="view-flow">
              <div className="timeline-line" />
              {summaries?.items?.length ? (
                summaries.items.map((item, idx) => (
                  <div className="aha-node" key={`${idx}-${item}`}>
                    <div className="node-meta">
                      <span className="node-source">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                        {summaries.source}
                      </span>
                      <span>{t('justNow')}</span>
                    </div>
                    <div className="node-card">
                      {item}
                      <button className="btn-quote" onClick={() => injectSummary(item)}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 10 4 15 9 20" /><path d="M20 4v7a4 4 0 0 1-4 4H4" /></svg>
                        {t('quote')}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="aha-node">
                  <div className="node-meta">
                    <span className="node-source">{t('contextMesh')}</span>
                    <span>{t('justNow')}</span>
                  </div>
                  <div className="node-card">{t('emptyFlow')}</div>
                </div>
              )}
            </div>

            <div className="aha-view" id="view-actions">
              <div style={{ fontSize: '13px', color: 'var(--text-sub)', marginBottom: '16px' }}>
                {t('actionsIntro')}
              </div>
              <div className="action-grid">
                <div className="action-btn" onClick={() => injectSummary('请深度提炼当前对话的核心论点与结论。')}>
                  <div className="action-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="3" y2="18" /></svg>
                  </div>
                  <div>
                    <div className="action-title">{t('actionSummarize')}</div>
                    <div className="action-desc">{t('actionSummarizeDesc')}</div>
                  </div>
                </div>

                <div className="action-btn" onClick={() => injectSummary('请将上文翻译为中英双语对照。')}>
                  <div className="action-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6" /></svg>
                  </div>
                  <div>
                    <div className="action-title">{t('actionTranslate')}</div>
                    <div className="action-desc">{t('actionTranslateDesc')}</div>
                  </div>
                </div>

                <div className="action-btn" onClick={() => injectSummary('请对上面的代码进行 Code Review，指出潜在问题与改进点。')}>
                  <div className="action-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
                  </div>
                  <div>
                    <div className="action-title">{t('actionReview')}</div>
                    <div className="action-desc">{t('actionReviewDesc')}</div>
                  </div>
                </div>

                <div className="action-btn" onClick={() => injectSummary('请将上面的需求整理成结构化系统提示词。')}>
                  <div className="action-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  </div>
                  <div>
                    <div className="action-title">{t('actionPrompt')}</div>
                    <div className="action-desc">{t('actionPromptDesc')}</div>
                  </div>
                </div>

                <div className="action-btn" onClick={toggleFocus}>
                  <div className="action-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
                  </div>
                  <div>
                    <div className="action-title">{t('actionFocus')}</div>
                    <div className="action-desc">{t('actionFocusDesc')}</div>
                  </div>
                </div>

                <div className="action-btn" onClick={toggleLanguage}>
                  <div className="action-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6" /></svg>
                  </div>
                  <div>
                    <div className="action-title">{t('actionLanguage')}</div>
                    <div className="action-desc">{t('actionLanguageDesc')}</div>
                  </div>
                </div>
              </div>

              <div className="aha-section-title">
                <span>{t('rolePrompts')}</span>
                <button
                  className="aha-icon-plus"
                  onClick={() => {
                    resetPersonaEditor();
                    openSettingsPanel();
                  }}
                  title={t('settings')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>
              <div className="aha-persona-list">
                {personas.length ? (
                  personas.map((persona) => (
                    <div
                      key={persona.id}
                      className="aha-persona-item"
                      onClick={() => appendText(adapter, persona.prompt)}
                    >
                      <span className="persona-name">{persona.name}</span>
                      <div className="persona-actions">
                        <button
                          className="persona-action"
                          title={t('edit')}
                          onClick={(event) => {
                            event.stopPropagation();
                            beginEditPersona(persona);
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                        </button>
                        <button
                          className="persona-action"
                          title={t('moveTop')}
                          onClick={(event) => {
                            event.stopPropagation();
                            movePersonaToTop(persona.id);
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 6.5h10" />
                            <path d="M12 17V8" />
                            <path d="M9.5 10.5 12 8l2.5 2.5" />
                          </svg>
                        </button>
                        <button
                          className="persona-action"
                          title={t('moveUp')}
                          onClick={(event) => {
                            event.stopPropagation();
                            movePersona(persona.id, 'up');
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 14.5 12 10.5 16 14.5" />
                          </svg>
                        </button>
                        <button
                          className="persona-action"
                          title={t('moveDown')}
                          onClick={(event) => {
                            event.stopPropagation();
                            movePersona(persona.id, 'down');
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 9.5 12 13.5 16 9.5" />
                          </svg>
                        </button>
                        <button
                          className="persona-action delete"
                          title={t('remove')}
                          onClick={(event) => {
                            event.stopPropagation();
                            removePersona(persona.id);
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="M6 6l1 14h10l1-14" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="aha-persona-item">{t('roleEmpty')}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          ref={sidebarRef}
          className="ahaflow-sidebar"
          onClick={() => setIsOpen(true)}
            onMouseLeave={() => {
              setIsTrackHovering(false);
              setHoveredIndex(null);
              setPeekItem(null);
              setPeekPos(null);
            }}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter') setIsOpen(true);
          }}
        >
          <div className="global-pins">
            {latestPins.map((item, idx) => (
              <div
                className="pin-node"
                key={`pin-${idx}`}
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveView('flow');
                  setIsOpen(true);
                }}
              >
                {renderPinIcon(item)}
                <div className="peek">
                  <div className="peek-meta">
                    <div className="peek-source">{summaries?.source || 'AhaFlow'}</div>
                  </div>
                  "{snippet(item, 40)}"
                </div>
              </div>
            ))}
          </div>

          <div
            className="fluid-track"
            ref={trackRef}
            onWheel={(event) => {
              const track = trackRef.current;
              const scroll = scrollRef.current;
              if (!track || !scroll) return;
              const max = Math.max(0, scroll.scrollHeight - track.clientHeight);
              if (max <= 0) return;
              const next = clampScroll(scrollOffset + event.deltaY);
              const willScroll = next !== scrollOffset;
              if (willScroll) {
                event.preventDefault();
                setScrollOffset(next);
              }
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="fluid-track-scroll"
              ref={scrollRef}
              style={{ transform: `translateY(-${scrollOffset}px)` }}
            >
              {timeline.map((item, idx) => {
                return (
                <div
                  className={`fluid-node ${selectedIndex === idx ? 'is-selected' : ''}`}
                  key={item.id}
                  data-index={idx}
                  style={{ ['--base-weight' as any]: item.weight }}
                  onClick={() => {
                    setSelectedIndex(idx);
                    item.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                >
                  <div className={`dot ${item.role === 'user' ? 'user' : 'ai'}`} />
                  <div className="peek">
                    <div className="peek-meta">
                      <div className="peek-source">{item.role === 'user' ? 'USER' : 'AI'}</div>
                    </div>
                    "{snippet(item.content)}"
                  </div>
                  <div className="fluid-line" />
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div
        ref={pillRef}
        className={`aha-pill-anchor ${showPill ? 'is-visible' : ''} ${pillOpen ? 'menu-open' : ''}`}
        style={{ left: `${pillPos.left}px`, top: `${pillPos.top}px` }}
      >
        <div
          className="aha-pill-trigger"
          onMouseDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
            pillInteractingRef.current = true;
            window.setTimeout(() => {
              pillInteractingRef.current = false;
            }, 0);
          }}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setPillOpen((open) => !open);
            setPillVisible(true);
          }}
          title={t('rolePrompts')}
        >
          <svg className="aha-pill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18h6" />
            <path d="M10 21h4" />
            <path d="M8.8 14.8C7.7 13.9 7 12.5 7 11a5 5 0 1 1 10 0c0 1.5-.7 2.9-1.8 3.8-.7.6-1.2 1.2-1.2 2.2h-4c0-1-.5-1.6-1.2-2.2Z" />
            <path d="M12 4.5V6" />
            <path d="M8.6 7.1 9.5 8" />
            <path d="M15.4 7.1 14.5 8" />
          </svg>
          <span className="aha-pill-text">{t('rolePrompts')}</span>
        </div>
        <div className="aha-role-menu">
          <div className="aha-role-menu-header">
            <div className="aha-role-menu-title">{t('rolePrompts')}</div>
            <button
              className="aha-role-menu-add"
              title={t('managePersonas')}
              onMouseDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setPillOpen(false);
                resetPersonaEditor();
                openSettingsPanel();
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            </button>
          </div>
          {personas.length ? (
            personas.map((persona) => (
              <div
                className="aha-role-item"
                key={`pill-${persona.id}`}
                onMouseDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  pillInteractingRef.current = true;
                  window.setTimeout(() => {
                    pillInteractingRef.current = false;
                  }, 0);
                }}
                onClick={() => {
                  setPillOpen(false);
                  appendText(adapter, persona.prompt);
                  focusInputEnd();
                  flashInput();
                }}
              >
                <div className="aha-role-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                </div>
                <div className="aha-role-info">
                  <span className="aha-role-title">{persona.name}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="aha-role-item">
              <div className="aha-role-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </div>
              <div className="aha-role-info">
                <span className="aha-role-title">{t('roleEmpty')}</span>
                <span className="aha-role-desc">{t('openSettings')}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div id="aha-toast" className={toast ? 'show' : ''}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#34c759' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <span id="toast-msg">{toast || t('quoteContext')}</span>
      </div>

      {showSettings ? (
        <div
          className={`aha-settings-modal ${settingsClosing ? 'is-closing' : 'is-open'}`}
          onClick={() => {
            closeSettingsPanel();
          }}
        >
          <div
            className={`aha-settings-panel ${settingsClosing ? 'is-closing' : 'is-open'}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="aha-top-bar">
              <div className="aha-logo">
                <svg viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                {t('managePersonas')}
              </div>
              <button
                className="icon-btn"
                onClick={() => {
                  closeSettingsPanel();
                }}
                title={t('close')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="aha-row">
              <input
                className="aha-input"
                placeholder={t('namePlaceholder')}
                value={personaName}
                onChange={(event) => setPersonaName(event.target.value)}
              />
            </div>
            <div className="aha-row">
              <textarea
                className="aha-textarea"
                placeholder={t('promptPlaceholder')}
                value={personaPrompt}
                onChange={(event) => setPersonaPrompt(event.target.value)}
              />
            </div>
            <div className="aha-row">
              <button className="btn-quote" style={{ position: 'static', opacity: 1, transform: 'none' }} onClick={savePersonaEntry}>
                {editingPersonaId ? t('update') : t('add')}
              </button>
              <button
                className="btn-quote"
                style={{ position: 'static', opacity: 1, transform: 'none' }}
                onClick={() => {
                  closeSettingsPanel();
                }}
              >
                {t('close')}
              </button>
            </div>
            <div className="aha-row" style={{ flexWrap: 'wrap' }} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function mountSidebar() {
  const existing = document.getElementById('omni-mesh-host');
  if (existing) return;

  const host = document.createElement('div');
  host.id = 'omni-mesh-host';
  document.documentElement.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });
  const style = document.createElement('style');
  style.textContent = sidebarStyles;
  shadow.appendChild(style);

  const mount = document.createElement('div');
  shadow.appendChild(mount);

  createRoot(mount).render(<Sidebar />);
}

function boot() {
  mountSidebar();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
