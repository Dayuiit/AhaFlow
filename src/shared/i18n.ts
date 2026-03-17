export type LanguageCode = 'zh-CN' | 'en-US';

export type I18nKey =
  | 'brand'
  | 'tabFlow'
  | 'tabActions'
  | 'actionsIntro'
  | 'actionSummarize'
  | 'actionSummarizeDesc'
  | 'actionTranslate'
  | 'actionTranslateDesc'
  | 'actionReview'
  | 'actionReviewDesc'
  | 'actionPrompt'
  | 'actionPromptDesc'
  | 'actionFocus'
  | 'actionFocusDesc'
  | 'actionLanguage'
  | 'actionLanguageDesc'
  | 'rolePrompts'
  | 'roleEmpty'
  | 'justNow'
  | 'minutesAgo'
  | 'quote'
  | 'emptyFlow'
  | 'site'
  | 'lastSync'
  | 'contextMesh'
  | 'smartIndex'
  | 'personas'
  | 'settings'
  | 'managePersonas'
  | 'openSettings'
  | 'addPersona'
  | 'add'
  | 'update'
  | 'edit'
  | 'moveTop'
  | 'moveUp'
  | 'moveDown'
  | 'remove'
  | 'namePlaceholder'
  | 'promptPlaceholder'
  | 'exportJson'
  | 'importJson'
  | 'close'
  | 'waitingSummaries'
  | 'noIndex'
  | 'noPersonas'
  | 'quoteContext'
  | 'focus'
  | 'language'
  | 'collapse'
  | 'expand';

type Dict = Record<I18nKey, string>;

const ZH: Dict = {
  brand: 'AhaFlow',
  tabFlow: '灵感流 (Flow)',
  tabActions: '预设术 (Actions)',
  actionsIntro: '一键执行预设指令，免去重复输入框打字。',
  actionSummarize: '深度提炼',
  actionSummarizeDesc: '提取当前页面的核心论点和结论',
  actionTranslate: '双语对照',
  actionTranslateDesc: '将选中的上下文进行专业级翻译',
  actionReview: 'Code Review',
  actionReviewDesc: '找出代码中的潜在 Bug 和优化点',
  actionPrompt: '转为 Prompt',
  actionPromptDesc: '将普通描述转化为结构化系统指令',
  actionFocus: '专注模式',
  actionFocusDesc: '一键隐藏干扰元素，保留对话核心',
  actionLanguage: '切换语言',
  actionLanguageDesc: '在中英文界面间快速切换',
  rolePrompts: '预设角色',
  roleEmpty: '暂无角色，可在设置中添加。',
  justNow: '刚刚',
  minutesAgo: '分钟前',
  quote: '引用',
  emptyFlow: '暂无跨站记录，等待新的摘要…',
  site: '站点',
  lastSync: '最近同步',
  contextMesh: '上下文网格',
  smartIndex: '智能索引',
  personas: '角色',
  settings: '设置',
  managePersonas: '角色管理',
  openSettings: '打开设置以新增角色。',
  addPersona: '添加角色',
  add: '添加',
  update: '更新',
  edit: '编辑',
  moveTop: '置顶',
  moveUp: '上移',
  moveDown: '下移',
  remove: '移除',
  namePlaceholder: '角色名称',
  promptPlaceholder: '角色提示词',
  exportJson: '导出 JSON',
  importJson: '导入 JSON',
  close: '关闭',
  waitingSummaries: '等待跨标签摘要…',
  noIndex: '未检测到标题/代码/表格。',
  noPersonas: '暂无角色。',
  quoteContext: '引用上文',
  focus: '专注',
  language: '语言',
  collapse: '收起',
  expand: '展开'
};

const EN: Dict = {
  brand: 'AhaFlow',
  tabFlow: 'Inspiration Flow',
  tabActions: 'Actions',
  actionsIntro: 'Run preset instructions without retyping them.',
  actionSummarize: 'Deep Summarize',
  actionSummarizeDesc: 'Extract key points and conclusions from the page',
  actionTranslate: 'Bilingual Mode',
  actionTranslateDesc: 'Translate selected context into bilingual output',
  actionReview: 'Code Review',
  actionReviewDesc: 'Find potential bugs and optimization points',
  actionPrompt: 'Convert to Prompt',
  actionPromptDesc: 'Turn plain text into a structured system prompt',
  actionFocus: 'Focus Mode',
  actionFocusDesc: 'Hide distractions and keep the core conversation',
  actionLanguage: 'Switch Language',
  actionLanguageDesc: 'Toggle between Chinese and English UI',
  rolePrompts: 'Role Prompts',
  roleEmpty: 'No personas yet. Add in settings.',
  justNow: 'Just now',
  minutesAgo: 'min ago',
  quote: 'Quote',
  emptyFlow: 'No cross-site records yet. Waiting for new summaries…',
  site: 'Site',
  lastSync: 'Last sync',
  contextMesh: 'Context Mesh',
  smartIndex: 'Smart Index',
  personas: 'Personas',
  settings: 'Settings',
  managePersonas: 'Persona Manager',
  openSettings: 'Open settings to add personas.',
  addPersona: 'Add Persona',
  add: 'Add',
  update: 'Update',
  edit: 'Edit',
  moveTop: 'Pin to Top',
  moveUp: 'Move Up',
  moveDown: 'Move Down',
  remove: 'Remove',
  namePlaceholder: 'Persona name',
  promptPlaceholder: 'Persona prompt',
  exportJson: 'Export JSON',
  importJson: 'Import JSON',
  close: 'Close',
  waitingSummaries: 'Waiting for cross-tab summaries…',
  noIndex: 'No headings/code/table detected.',
  noPersonas: 'No personas yet.',
  quoteContext: 'Quote Context',
  focus: 'Focus',
  language: 'Language',
  collapse: 'Collapse',
  expand: 'Expand'
};

export function getDefaultLanguage(): LanguageCode {
  const lang = navigator.language || 'en-US';
  if (lang.toLowerCase().startsWith('zh')) return 'zh-CN';
  return 'en-US';
}

export function getDictionary(lang: LanguageCode): Dict {
  return lang === 'zh-CN' ? ZH : EN;
}
