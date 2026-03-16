import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { sidebarStyles } from './sidebarStyles';
import { createAdapterForHost } from '../shared/adapters/site';
import type { BaseSiteAdapter } from '../shared/adapters/BaseSiteAdapter';
import type { IndexItem } from '../shared/adapters/types';
import { ObserverService } from '../shared/observer/ObserverService';
import { createMeshChannel, type MeshSummary } from '../shared/mesh/channel';
import { summarizeMessages } from '../shared/mesh/summarize';
import { buildIndex } from '../shared/mesh/indexing';
import { injectText } from '../shared/injection/inject';
import { meshDB } from '../shared/storage/db';
import { loadPersonas, loadPrefs, savePersonas, savePrefs, type Persona } from '../shared/storage/persona';
import { getDictionary, getDefaultLanguage, type LanguageCode } from '../shared/i18n';

type Prefs = {
  focusMode: boolean;
  language: LanguageCode;
  collapsed: boolean;
};

// 默认面板收起，点击悬浮按钮后再展开
const defaultPrefs: Prefs = { focusMode: false, language: getDefaultLanguage(), collapsed: true };

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
  } else if (host.includes('gemini.google.com')) {
    css = `aside, [role="navigation"], nav { display: none !important; }`;
  } else if (host.includes('kimi')) {
    css = `aside, [role="navigation"], nav { display: none !important; }`;
  }

  style.textContent = css;
}

function Sidebar() {
  const adapter = useMemo(() => createAdapterForHost(location.host), []);
  const [summaries, setSummaries] = useState<MeshSummary | null>(null);
  const [indexItems, setIndexItems] = useState<IndexItem[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [personaName, setPersonaName] = useState('');
  const [personaPrompt, setPersonaPrompt] = useState('');
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);
  const [lastSync, setLastSync] = useState<number | null>(null);
  const [version, setVersion] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeView, setActiveView] = useState<'flow' | 'actions'>('flow');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastVisible, setToastVisible] = useState(false);

  const dict = getDictionary(prefs.language);
  const t = (key: keyof typeof dict) => dict[key];

  useEffect(() => {
    loadPersonas().then((data) => {
      setPersonas(data);
      if (adapter) installSlashCommands(adapter, data);
    });
    loadPrefs(defaultPrefs).then((data) => {
      setPrefs(data);
      if (adapter) applyFocusMode(adapter, data.focusMode);
    });

    const onChange = () => {
      loadPersonas().then((data) => {
        setPersonas(data);
        if (adapter) installSlashCommands(adapter, data);
      });
      loadPrefs(defaultPrefs).then((data) => {
        setPrefs(data);
        if (adapter) applyFocusMode(adapter, data.focusMode);
      });
    };

    chrome.storage.onChanged.addListener(onChange);
    return () => chrome.storage.onChanged.removeListener(onChange);
  }, [adapter]);

  useEffect(() => {
    const prefersDark =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    let next: 'dark' | 'light' = prefersDark ? 'dark' : 'light';
    try {
      const saved = localStorage.getItem('ahaflow-theme');
      if (saved === 'dark' || saved === 'light') next = saved;
    } catch {
      // ignore
    }
    setTheme(next);
  }, []);

  useEffect(() => {
    try {
      const manifest = chrome.runtime.getManifest();
      setVersion(manifest.version);
    } catch {
      setVersion('');
    }
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
      setLastSync(summary.updatedAt);

      const root = adapter.getChatContainer();
      setIndexItems(buildIndex(root));

      installSlashCommands(adapter, personas);

      if (history.length > 0) {
        meshDB.sessions.put({
          sessionId: adapter.getSessionId(),
          source: adapter.getSource(),
          title: document.title || adapter.getSessionId(),
          lastUpdated: summary.updatedAt,
          messages: history.map((msg) => ({
            role: msg.role === 'system' ? 'assistant' : msg.role,
            content: msg.content,
            type: 'text'
          }))
        });
      }
    });

    return () => {
      observer.stop();
      channel.close();
    };
  }, [adapter, personas]);

  if (!adapter) return null;

  const injectSummary = () => {
    if (!summaries || summaries.items.length === 0) return;
    injectText(adapter, summaries.items.join('\n'));
  };

  const injectPersona = (persona: Persona) => {
    injectText(adapter, persona.prompt);
  };

  const toggleFocus = async () => {
    const next = { ...prefs, focusMode: !prefs.focusMode };
    setPrefs(next);
    await savePrefs(next);
    applyFocusMode(adapter, next.focusMode);
  };

  const toggleLanguage = async () => {
    const nextLang: LanguageCode = prefs.language === 'zh-CN' ? 'en-US' : 'zh-CN';
    const next = { ...prefs, language: nextLang };
    setPrefs(next);
    await savePrefs(next);
  };

  const toggleCollapsed = async () => {
    const next = { ...prefs, collapsed: !prefs.collapsed };
    setPrefs(next);
    await savePrefs(next);
  };

  const addPersona = async () => {
    if (!personaName.trim() || !personaPrompt.trim()) return;
    const next = [
      ...personas,
      { id: crypto.randomUUID(), name: personaName.trim(), prompt: personaPrompt.trim() }
    ];
    await savePersonas(next);
    setPersonas(next);
    setPersonaName('');
    setPersonaPrompt('');
  };

  const removePersona = async (id: string) => {
    const next = personas.filter((p) => p.id !== id);
    await savePersonas(next);
    setPersonas(next);
  };

  const exportPersonas = () => {
    const payload = { personas, prefs };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'omni-personas.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importPersonas = async (file: File | null) => {
    if (!file) return;
    const text = await file.text();
    try {
      const data = JSON.parse(text) as { personas?: Persona[]; prefs?: Prefs } | Persona[];
      if (Array.isArray(data)) {
        await savePersonas(data);
        setPersonas(data);
        return;
      }
      if (data.personas && Array.isArray(data.personas)) {
        await savePersonas(data.personas);
        setPersonas(data.personas);
      }
      if (data.prefs) {
        await savePrefs(data.prefs);
        setPrefs(data.prefs);
      }
    } catch {
      // ignore invalid JSON
    }
  };

  const openPanel = () => {
    if (!prefs.collapsed) return;
    void toggleCollapsed();
  };

  const closePanel = () => {
    if (prefs.collapsed) return;
    void toggleCollapsed();
  };

  const setThemeAndPersist = (next: 'dark' | 'light') => {
    setTheme(next);
    try {
      localStorage.setItem('ahaflow-theme', next);
    } catch {
      // ignore
    }
  };

  const displayThemeIcon = theme === 'dark' ? 'sun' : 'moon';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    window.setTimeout(() => setToastVisible(false), 2500);
  };

  const quoteItem = (text: string) => {
    injectText(adapter, text);
    showToast('已引用记录到输入框');
  };

  return (
    <div className={`aha-shell${prefs.collapsed ? '' : ' is-open'}`} data-theme={theme} id="ahaflow-container">
      <svg style={{ width: 0, height: 0, position: 'absolute' }}>
        <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00c6ff" />
          <stop offset="100%" stopColor="#8a2387" />
        </linearGradient>
      </svg>

      <div className={`aha-panel`}>
        <div className="aha-header">
          <div className="aha-top-bar">
            <div className="aha-logo">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>{' '}
              AhaFlow
              {version ? <span className="aha-subtle"> v{version}</span> : null}
            </div>
            <div className="aha-top-actions">
              <button className="icon-btn" type="button" title="切换深浅主题" onClick={() => setThemeAndPersist(theme === 'dark' ? 'light' : 'dark')}>
                {displayThemeIcon === 'sun' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
              <button className="icon-btn" type="button" title="收起面板" onClick={closePanel}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="aha-segmented" id="segment-control">
            <div className="aha-seg-indicator" />
            <div className={`aha-seg-btn${activeView === 'flow' ? ' active' : ''}`} data-target="flow" onClick={() => setActiveView('flow')}>
              灵感流 (Flow)
            </div>
            <div
              className={`aha-seg-btn${activeView === 'actions' ? ' active' : ''}`}
              data-target="actions"
              onClick={() => setActiveView('actions')}
            >
              预设术 (Actions)
            </div>
          </div>
        </div>

        <div className={`aha-view-container${activeView === 'actions' ? ' show-actions' : ''}`} id="view-container">
          <div className="aha-view" id="view-flow">
            <div className="timeline-line" />

            {(summaries?.items?.length ? summaries.items : []).map((item, idx) => (
              <div className="aha-node" key={`${idx}-${item}`}>
                <div className="node-meta">
                  <span className="node-source">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    {adapter.getSource()}
                  </span>
                  <span>{lastSync ? new Date(lastSync).toLocaleTimeString() : ''}</span>
                </div>
                <div className="node-card">
                  {item}
                  <button className="btn-quote" type="button" onClick={() => quoteItem(item)}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 10 4 15 9 20" />
                      <path d="M20 4v7a4 4 0 0 1-4 4H4" />
                    </svg>{' '}
                    引用
                  </button>
                </div>
              </div>
            ))}

            <div className="aha-node">
              <div className="node-meta">
                <span className="node-source">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  当前提取的上下文
                </span>
                <span>刚刚</span>
              </div>
              <div className="node-card" style={{ borderColor: 'var(--border-highlight)' }}>
                {indexItems.length ? `索引条目：${indexItems.slice(0, 8).map((x) => x.title).join(' / ')}` : t('noIndex')}
                <button className="btn-quote" type="button" onClick={() => showToast('已成功注入当前上下文')}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 10 4 15 9 20" />
                    <path d="M20 4v7a4 4 0 0 1-4 4H4" />
                  </svg>{' '}
                  引用
                </button>
              </div>
            </div>
          </div>

          <div className="aha-view" id="view-actions">
            <div className="aha-actions-hint">一键执行预设指令，免去重复输入框打字。</div>
            <div className="action-grid">
              {personas.map((persona) => (
                <div
                  key={persona.id}
                  className="action-btn"
                  onClick={() => {
                    injectPersona(persona);
                    showToast(`已执行：${persona.name}`);
                  }}
                >
                  <div className="action-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <div>
                    <div className="action-title">{persona.name}</div>
                    <div className="action-desc">使用该角色的预设提示词快速注入</div>
                  </div>
                </div>
              ))}

              <div className="action-btn" onClick={() => showToast('已执行：深度总结当前对话')}>
                <div className="action-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="21" y1="10" x2="3" y2="10" />
                    <line x1="21" y1="6" x2="3" y2="6" />
                    <line x1="21" y1="14" x2="3" y2="14" />
                    <line x1="21" y1="18" x2="3" y2="18" />
                  </svg>
                </div>
                <div>
                  <div className="action-title">深度提炼</div>
                  <div className="action-desc">提取当前页面的核心论点和结论</div>
                </div>
              </div>

              <div className="action-btn" onClick={() => showToast('已执行：中英双语互译')}>
                <div className="action-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6" />
                  </svg>
                </div>
                <div>
                  <div className="action-title">双语对照</div>
                  <div className="action-desc">将选中的上下文进行专业级翻译</div>
                </div>
              </div>

              <div className="action-btn" onClick={() => showToast('已执行：代码审查 (Code Review)')}>
                <div className="action-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <div>
                  <div className="action-title">Code Review</div>
                  <div className="action-desc">找出代码中的潜在 Bug 和优化点</div>
                </div>
              </div>

              <div className="action-btn" onClick={() => showToast('已生成：结构化提示词')}>
                <div className="action-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <div>
                  <div className="action-title">转为 Prompt</div>
                  <div className="action-desc">将普通描述转化为结构化系统指令</div>
                </div>
              </div>

              <div className="action-btn" onClick={() => setShowSettings(true)}>
                <div className="action-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1.51-1H10.6A2 2 0 0 1 12 1a2 2 0 0 1 2 2v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </div>
                <div>
                  <div className="action-title">{t('settings')}</div>
                  <div className="action-desc">管理 Personas / 导入导出</div>
                </div>
              </div>

              <div className="action-btn" onClick={toggleLanguage}>
                <div className="action-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 5h12M7 2h1M5 8l6 6M4 14l6-6 2-3M14 18h6" />
                  </svg>
                </div>
                <div>
                  <div className="action-title">{t('language')}</div>
                  <div className="action-desc">切换中英文显示</div>
                </div>
              </div>

              <div className="action-btn" onClick={toggleFocus}>
                <div className="action-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 15l4-8-8 4 4 8z" />
                  </svg>
                </div>
                <div>
                  <div className="action-title">{t('focus')}</div>
                  <div className="action-desc">切换专注模式</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="aha-trigger" id="aha-trigger" title="展开 AhaFlow" onClick={openPanel}>
        <div className="aha-trigger-inner">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="url(#brandGrad)" aria-hidden="true">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>

      <div className={`aha-toast${toastVisible ? ' show' : ''}`} id="aha-toast" aria-live="polite">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: '#34c759' }}
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <span id="toast-msg">{toastMessage || '已成功注入当前上下文'}</span>
      </div>
      {showSettings ? (
        <div className="omni-backdrop" onClick={() => setShowSettings(false)}>
          <div className="omni-modal" onClick={(event) => event.stopPropagation()}>
            <div className="omni-modal-header">
              <span>{t('settings')}</span>
              <button className="omni-pill" type="button" onClick={() => setShowSettings(false)}>
                {t('close')}
              </button>
            </div>
            <div className="omni-section-title">{t('managePersonas')}</div>
            <div className="omni-list">
              {personas.length ? (
                personas.map((persona) => (
                  <div className="omni-persona-item" key={persona.id}>
                    <div>{persona.name}</div>
                    <button className="omni-link" type="button" onClick={() => removePersona(persona.id)}>
                      {t('remove')}
                    </button>
                  </div>
                ))
              ) : (
                <div className="omni-muted">{t('noPersonas')}</div>
              )}
            </div>
            <div className="omni-field">
              <input
                className="omni-input"
                placeholder={t('namePlaceholder')}
                value={personaName}
                onChange={(e) => setPersonaName(e.target.value)}
              />
              <textarea
                className="omni-textarea"
                placeholder={t('promptPlaceholder')}
                value={personaPrompt}
                onChange={(e) => setPersonaPrompt(e.target.value)}
              />
              <button className="omni-button" type="button" onClick={addPersona}>
                {t('addPersona')}
              </button>
            </div>
            <div className="omni-row">
              <button className="omni-button secondary" type="button" onClick={exportPersonas}>
                {t('exportJson')}
              </button>
              <label className="omni-button" htmlFor="omni-import">
                {t('importJson')}
                <input
                  id="omni-import"
                  type="file"
                  accept="application/json"
                  style={{ display: 'none' }}
                  onChange={(e) => importPersonas(e.target.files?.[0] || null)}
                />
              </label>
            </div>
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
