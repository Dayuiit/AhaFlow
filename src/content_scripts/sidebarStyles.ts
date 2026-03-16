export const sidebarStyles = `
:host {
  all: initial;
}

:root {
  --aha-font: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;

  /* 浅色主题 */
  --bg-glass: rgba(255, 255, 255, 0.65);
  --bg-glass-heavy: rgba(255, 255, 255, 0.85);
  --bg-card: rgba(255, 255, 255, 0.6);
  --bg-hover: rgba(0, 0, 0, 0.05);
  --border-color: rgba(0, 0, 0, 0.08);
  --border-highlight: rgba(255, 255, 255, 0.8);
  --text-main: #1d1d1f;
  --text-sub: #86868b;
  --shadow-base: 0 10px 40px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0,0,0,0.05);

  /* AhaFlow 品牌色 */
  --brand-blue: #007aff;
  --brand-gradient: linear-gradient(135deg, #00c6ff, #0072ff, #8a2387);
  --brand-glow: rgba(0, 114, 255, 0.2);

  --transition-spring: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.15);
  --transition-smooth: all 0.25s ease;
}

.aha-shell[data-theme="dark"] {
  /* 深色主题 */
  --bg-glass: rgba(30, 30, 32, 0.65);
  --bg-glass-heavy: rgba(30, 30, 32, 0.85);
  --bg-card: rgba(44, 44, 46, 0.6);
  --bg-hover: rgba(255, 255, 255, 0.08);
  --border-color: rgba(255, 255, 255, 0.08);
  --border-highlight: rgba(255, 255, 255, 0.15);
  --text-main: #f5f5f7;
  --text-sub: #a1a1a6;
  --shadow-base: 0 10px 40px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0,0,0,0.2);
  --brand-glow: rgba(0, 198, 255, 0.15);
}

.aha-shell {
  position: fixed;
  display: flex;
  align-items: center;
  gap: 16px;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  align-items: center;
  z-index: 999999;
  font-family: var(--aha-font);
}

.aha-trigger {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background: var(--bg-glass);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-highlight);
  box-shadow: var(--shadow-base), 0 0 20px var(--brand-glow);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: var(--transition-spring);
  position: relative;
  overflow: hidden;
}

.aha-trigger:hover {
  transform: scale(1.08);
  box-shadow: var(--shadow-base), 0 0 30px var(--brand-glow);
}

.aha-trigger::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: var(--brand-gradient);
  z-index: 0;
  opacity: 0.8;
  animation: spin 4s linear infinite;
  border-radius: 50%;
}

.aha-trigger-inner {
  position: absolute;
  inset: 2px;
  background: var(--bg-glass);
  border-radius: 50%;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--text-main);
}

@keyframes spin { 100% { transform: rotate(360deg); } }

.aha-panel {
  width: 380px;
  height: 85vh;
  max-height: 800px;
  background: var(--bg-glass);
  backdrop-filter: blur(30px) saturate(200%);
  -webkit-backdrop-filter: blur(30px) saturate(200%);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  box-shadow: var(--shadow-base);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;

  opacity: 0;
  transform: translateX(40px) scale(0.95);
  pointer-events: none;
  transition: var(--transition-spring);
}

.aha-shell.is-open .aha-panel {
  opacity: 1;
  transform: translateX(0) scale(1);
  pointer-events: auto;
}

.aha-shell.is-open .aha-trigger {
  transform: scale(0.8) translateX(20px);
  opacity: 0;
  pointer-events: none;
}

.aha-header {
  padding: 16px 20px 12px;
  border-bottom: 1px solid var(--border-color);
}

.aha-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.aha-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 18px;
  color: var(--text-main);
  letter-spacing: -0.5px;
}

.aha-logo svg {
  width: 18px;
  height: 18px;
  fill: url(#brandGrad);
}

.aha-subtle {
  font-weight: 600;
  font-size: 12px;
  color: var(--text-sub);
  margin-left: 6px;
}

.aha-top-actions {
  display: flex;
  gap: 12px;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: var(--text-sub);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: var(--transition-smooth);
  font-family: var(--aha-font);
}

.icon-btn:hover {
  background: var(--bg-hover);
  color: var(--text-main);
}

.aha-segmented {
  background: var(--bg-hover);
  border-radius: 12px;
  padding: 4px;
  display: flex;
  position: relative;
}

.aha-seg-btn {
  flex: 1;
  text-align: center;
  padding: 6px 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-sub);
  cursor: pointer;
  border-radius: 8px;
  z-index: 1;
  transition: var(--transition-smooth);
}

.aha-seg-btn.active { color: var(--text-main); }

.aha-seg-indicator {
  position: absolute;
  top: 4px;
  bottom: 4px;
  width: calc(50% - 4px);
  background: var(--bg-glass-heavy);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 0;
  transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.aha-view-container { flex: 1; position: relative; overflow: hidden; }

.aha-view {
  position: absolute;
  inset: 0;
  padding: 20px;
  overflow-y: auto;
  transition: transform 0.4s ease, opacity 0.4s ease;
}

.aha-view::-webkit-scrollbar { width: 4px; }
.aha-view::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 4px; }

#view-flow { transform: translateX(0); opacity: 1; z-index: 2; }
#view-actions { transform: translateX(100%); opacity: 0; z-index: 1; }
.show-actions #view-flow { transform: translateX(-100%); opacity: 0; }
.show-actions #view-actions { transform: translateX(0); opacity: 1; z-index: 2; }
.show-actions .aha-seg-indicator { transform: translateX(100%); }

.timeline-line {
  position: absolute;
  left: 29px;
  top: 24px;
  bottom: 24px;
  width: 2px;
  background: linear-gradient(to bottom, var(--border-color), transparent);
  z-index: 0;
}

.aha-content { display: none; }

.aha-node {
  position: relative;
  z-index: 1;
  margin-bottom: 20px;
  padding-left: 28px;
}

.aha-node::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 6px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--text-main);
  box-shadow: 0 0 10px var(--brand-glow);
  border: 2px solid var(--bg-glass);
}

.node-meta {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-sub);
  margin-bottom: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.node-source { display: flex; align-items: center; gap: 4px; }

.node-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 14px;
  font-size: 13px;
  color: var(--text-main);
  line-height: 1.6;
  transition: var(--transition-smooth);
  position: relative;
  cursor: grab;
}

.node-card:hover {
  border-color: var(--border-highlight);
  box-shadow: 0 8px 24px rgba(0,0,0,0.05);
}

/* 引用按钮（悬浮出现） */
.btn-quote {
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 6px 12px;
  background: var(--brand-blue);
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  opacity: 0;
  transform: translateY(5px);
  transition: var(--transition-smooth);
  box-shadow: 0 4px 10px rgba(0,122,255,0.3);
  display: flex;
  align-items: center;
  gap: 4px;
}
.node-card:hover .btn-quote { opacity: 1; transform: translateY(0); }
.btn-quote:hover { transform: scale(1.05) !important; }

/* Actions */
.aha-actions-hint { font-size: 13px; color: var(--text-sub); margin-bottom: 16px; }
.action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.action-btn {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 16px 12px;
  text-align: left;
  cursor: pointer;
  transition: var(--transition-smooth);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.action-btn:hover {
  background: var(--bg-hover);
  border-color: var(--border-highlight);
  transform: translateY(-2px);
}
.action-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: var(--bg-glass-heavy);
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--brand-blue);
}
.action-title { font-weight: 600; font-size: 14px; color: var(--text-main); }
.action-desc { font-size: 11px; color: var(--text-sub); line-height: 1.3; }

/* Toast */
.aha-toast {
  position: fixed;
  top: 40px;
  left: 50%;
  transform: translate(-50%, -20px);
  background: var(--bg-glass-heavy);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  box-shadow: var(--shadow-base);
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0;
  pointer-events: none;
  transition: var(--transition-spring);
  z-index: 9999999;
}
.aha-toast.show { opacity: 1; transform: translate(-50%, 0); }

.omni-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000000;
}

.omni-modal {
  width: min(380px, 92vw);
  max-height: 80vh;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  box-shadow: var(--shadow-base);
  backdrop-filter: blur(24px) saturate(200%);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: var(--transition-spring);
}

.omni-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 600;
}

.omni-field {
  display: grid;
  gap: 8px;
}

.omni-input,
.omni-textarea {
  width: 100%;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  padding: 8px 10px;
  font-size: 12px;
  background: var(--bg-card);
  color: var(--text-main);
}

.omni-textarea {
  min-height: 90px;
  resize: vertical;
}

.omni-persona-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
}
`;
