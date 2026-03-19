export const sidebarStyles = `
:host {
  all: initial;
}

.aha-root {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
  --glass-bg: linear-gradient(135deg, rgba(255, 255, 255, 0.74) 0%, rgba(245, 248, 255, 0.42) 100%);
  --glass-bg-strong: linear-gradient(135deg, rgba(255, 255, 255, 0.86) 0%, rgba(250, 252, 255, 0.58) 100%);
  --glass-border: rgba(255, 255, 255, 0.88);
  --glass-shadow:
    0 20px 40px rgba(0, 0, 0, 0.045),
    0 1px 3px rgba(0, 0, 0, 0.02),
    inset 0 1px 1px rgba(255, 255, 255, 1),
    inset 0 -1px 2px rgba(255, 255, 255, 0.32);
  --glass-highlight: linear-gradient(105deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.12) 24%, rgba(255,255,255,0) 42%);
  --bg-glass: rgba(255, 255, 255, 0.65);
  --bg-glass-heavy: rgba(255, 255, 255, 0.85);
  --bg-card: rgba(255, 255, 255, 0.6);
  --bg-hover: rgba(0, 0, 0, 0.05);
  --border-color: rgba(0, 0, 0, 0.08);
  --border-highlight: rgba(255, 255, 255, 0.8);
  --text-main: #1d1d1f;
  --text-sub: #86868b;
  --shadow-base: 0 10px 40px rgba(0, 0, 0, 0.08), 0 0.5px 3px rgba(0,0,0,0.05);
  --brand-blue: #007aff;
  --brand-gradient: linear-gradient(135deg, #00c6ff, #0072ff, #8a2387);
  --brand-glow: rgba(0, 114, 255, 0.2);
  --transition-spring: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.15);
  --transition-smooth: all 0.25s ease;
  --spring-pop: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.15);
  --pill-glow-purple: #bf5af2;
  --pill-glow-blue: #0a84ff;
  --pill-bg: rgba(30, 30, 32, 0.75);
  --pill-border: rgba(255, 255, 255, 0.1);
  --pill-menu-bg: rgba(30, 30, 32, 0.85);
  --pill-menu-border: rgba(255, 255, 255, 0.15);
}

.aha-root[data-theme="dark"] {
  --glass-bg: linear-gradient(135deg, rgba(62, 66, 78, 0.72) 0%, rgba(30, 33, 41, 0.5) 100%);
  --glass-bg-strong: linear-gradient(135deg, rgba(78, 83, 98, 0.82) 0%, rgba(33, 36, 45, 0.62) 100%);
  --glass-border: rgba(255, 255, 255, 0.18);
  --glass-shadow:
    0 18px 38px rgba(0, 0, 0, 0.32),
    0 1px 3px rgba(0, 0, 0, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    inset 0 -1px 2px rgba(255, 255, 255, 0.05);
  --glass-highlight: linear-gradient(105deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 22%, rgba(255,255,255,0) 40%);
  --bg-glass: rgba(30, 30, 32, 0.65);
  --bg-glass-heavy: rgba(30, 30, 32, 0.85);
  --bg-card: rgba(44, 44, 46, 0.6);
  --bg-hover: rgba(255, 255, 255, 0.08);
  --border-color: rgba(255, 255, 255, 0.08);
  --border-highlight: rgba(255, 255, 255, 0.15);
  --text-main: #f5f5f7;
  --text-sub: #a1a1a6;
  --shadow-base: 0 10px 40px rgba(0, 0, 0, 0.4), 0 0.5px 3px rgba(0,0,0,0.2);
  --brand-glow: rgba(0, 198, 255, 0.15);
  --pill-glow-purple: #bf5af2;
  --pill-glow-blue: #0a84ff;
  --pill-bg: rgba(30, 30, 32, 0.75);
  --pill-border: rgba(255, 255, 255, 0.1);
  --pill-menu-bg: rgba(30, 30, 32, 0.85);
  --pill-menu-border: rgba(255, 255, 255, 0.15);
}

.aha-root[data-theme="light"] {
  --pill-glow-purple: #8e45ff;
  --pill-glow-blue: #0a84ff;
  --pill-bg: rgba(255, 255, 255, 0.92);
  --pill-border: rgba(0, 0, 0, 0.08);
  --pill-menu-bg: rgba(255, 255, 255, 0.96);
  --pill-menu-border: rgba(0, 0, 0, 0.08);
}

#ahaflow-container {
  position: fixed;
  right: 15px;
  top: 52%;
  transform: translateY(-50%);
  z-index: 999999;
  display: flex;
  align-items: center;
  gap: 16px;
}

#ahaflow-container::before,
#ahaflow-container::after {
  content: '';
  position: absolute;
  border-radius: 999px;
  filter: blur(46px);
  pointer-events: none;
  z-index: -1;
}

#ahaflow-container::before {
  width: 140px;
  height: 140px;
  right: 140px;
  top: 6%;
  background: rgba(150, 220, 255, 0.22);
}

#ahaflow-container::after {
  width: 180px;
  height: 180px;
  right: 220px;
  bottom: 8%;
  background: rgba(255, 210, 120, 0.16);
}

.aha-trigger {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background: var(--glass-bg-strong);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow), 0 0 20px var(--brand-glow);
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
}

.aha-trigger::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--glass-highlight);
  z-index: 0;
  opacity: 1;
  border-radius: 50%;
}

.aha-trigger-inner {
  position: absolute;
  inset: 2px;
  background: linear-gradient(180deg, rgba(255,255,255,0.3), rgba(255,255,255,0.08));
  border-radius: 50%;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

@keyframes aha-spin {
  100% {
    transform: rotate(360deg);
  }
}

.aha-panel {
  width: 380px;
  height: 85vh;
  max-height: 800px;
  background: var(--glass-bg);
  backdrop-filter: blur(30px) saturate(185%);
  -webkit-backdrop-filter: blur(30px) saturate(185%);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  box-shadow: var(--glass-shadow);
  display: flex;
  flex-direction: column;
  opacity: 0;
  transform: translateX(40px) scale(0.95);
  pointer-events: none;
  transition: var(--transition-spring);
  overflow: hidden;
  position: relative;
}

.aha-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--glass-highlight);
  pointer-events: none;
}

#ahaflow-container.is-open .aha-panel {
  opacity: 1;
  transform: translateX(0) scale(1);
  pointer-events: auto;
}

#ahaflow-container.is-open .aha-trigger {
  transform: scale(0.8) translateX(20px);
  opacity: 0;
  pointer-events: none;
}

.aha-header {
  padding: 16px 20px 12px;
  border-bottom: 0.5px solid var(--border-color);
}

.aha-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.aha-logo {
  font-weight: 700;
  font-size: 18px;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 6px;
}

.aha-logo svg {
  width: 18px;
  fill: url(#brandGrad);
}

.icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 1px solid color-mix(in srgb, var(--glass-border) 84%, transparent);
  background: linear-gradient(180deg, rgba(255,255,255,0.32), rgba(255,255,255,0.08));
  color: var(--text-sub);
  cursor: pointer;
  transition: var(--transition-smooth);
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-btn:hover {
  background: linear-gradient(180deg, rgba(255,255,255,0.44), rgba(255,255,255,0.14));
  color: var(--text-main);
}

.icon-btn.is-active {
  color: var(--pill-glow-purple);
  border-color: color-mix(in srgb, var(--pill-glow-purple) 35%, var(--glass-border));
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.34), 0 6px 14px rgba(191, 90, 242, 0.12);
}

.aha-segmented {
  background: linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.06));
  border: 1px solid color-mix(in srgb, var(--glass-border) 72%, transparent);
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.26);
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

.aha-seg-btn.active {
  color: var(--text-main);
}

.aha-seg-indicator {
  position: absolute;
  top: 4px;
  bottom: 4px;
  width: calc(50% - 4px);
  background: var(--glass-bg-strong);
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--glass-border) 70%, transparent);
  box-shadow: 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.45);
  z-index: 0;
  transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.aha-view-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.aha-view {
  position: absolute;
  inset: 0;
  padding: 20px;
  overflow-y: auto;
  transition: transform 0.4s ease, opacity 0.4s ease;
}

.aha-view::-webkit-scrollbar {
  width: 4px;
}

.aha-view::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

#view-flow {
  transform: translateX(0);
  opacity: 1;
  z-index: 2;
}

#view-actions {
  transform: translateX(100%);
  opacity: 0;
  z-index: 1;
}

.aha-panel.show-actions #view-flow {
  transform: translateX(-100%);
  opacity: 0;
}

.aha-panel.show-actions #view-actions {
  transform: translateX(0);
  opacity: 1;
  z-index: 2;
}

.aha-panel.show-actions .aha-seg-indicator {
  transform: translateX(100%);
}

.timeline-line {
  position: absolute;
  left: 29px;
  top: 24px;
  bottom: 24px;
  width: 2px;
  background: linear-gradient(to bottom, var(--border-color), transparent);
  z-index: 0;
}

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

.node-source {
  display: flex;
  align-items: center;
  gap: 4px;
}

.node-card {
  background: linear-gradient(135deg, rgba(255,255,255,0.44), rgba(255,255,255,0.18));
  border: 1px solid color-mix(in srgb, var(--glass-border) 72%, transparent);
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

.node-card:hover .btn-quote {
  opacity: 1;
  transform: translateY(0);
}

.btn-quote:hover {
  transform: scale(1.05) !important;
}

.action-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.action-btn {
  background: linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.16));
  border: 1px solid color-mix(in srgb, var(--glass-border) 68%, transparent);
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
  background: linear-gradient(135deg, rgba(255,255,255,0.52), rgba(255,255,255,0.22));
  border-color: var(--border-highlight);
  transform: translateY(-2px);
}

.action-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(255,255,255,0.54), rgba(255,255,255,0.16));
  border: 1px solid color-mix(in srgb, var(--glass-border) 80%, transparent);
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--brand-blue);
}

.action-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-main);
}

.action-desc {
  font-size: 10.5px;
  color: var(--text-sub);
  line-height: 1.3;
}

.aha-section-title {
  margin: 20px 0 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-sub);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.aha-persona-list {
  display: grid;
  gap: 8px;
}

.aha-persona-item {
  background: linear-gradient(135deg, rgba(255,255,255,0.42), rgba(255,255,255,0.16));
  border: 1px solid color-mix(in srgb, var(--glass-border) 68%, transparent);
  border-radius: 14px;
  padding: 12px 14px;
  font-size: 13px;
  color: var(--text-main);
  cursor: pointer;
  transition: var(--transition-smooth);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.aha-persona-item:hover {
  background: linear-gradient(135deg, rgba(255,255,255,0.54), rgba(255,255,255,0.2));
  border-color: var(--border-highlight);
}

.persona-name {
  flex: 1;
}

.persona-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transform: translateX(10px);
  transition: transform 0.2s linear, opacity 0.2s linear;
}

.aha-persona-item:hover .persona-actions {
  opacity: 1;
  transform: translateX(0);
}

.persona-action {
  border: 0;
  background: color-mix(in srgb, var(--bg-card) 80%, transparent);
  color: var(--text-sub);
  width: 26px;
  height: 26px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--border-color) 88%, transparent);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
  transition: background 0.22s ease, color 0.22s ease, transform 0.22s ease, border-color 0.22s ease;
}

.persona-action:hover {
  background: color-mix(in srgb, var(--bg-hover) 86%, white 8%);
  color: var(--text-main);
  border-color: var(--border-highlight);
  transform: translateY(-1px);
}

.persona-action.delete {
  color: #ff3b30;
}

.persona-action.delete:hover {
  background: rgba(255, 59, 48, 0.12);
}

.aha-icon-plus {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 0.5px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-main);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.aha-icon-plus:hover {
  background: var(--bg-hover);
  border-color: var(--border-highlight);
}

#aha-toast {
  position: fixed;
  top: 40px;
  left: 50%;
  transform: translate(-50%, -20px);
  background: var(--glass-bg-strong);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  box-shadow: var(--glass-shadow);
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0;
  pointer-events: none;
  transition: var(--transition-spring);
  z-index: 9999999;
}

#aha-toast.show {
  opacity: 1;
  transform: translate(-50%, 0);
}

.aha-settings-modal {
  position: fixed;
  inset: 0;
  background: rgba(8, 10, 18, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000000;
  opacity: 0;
  transition: var(--transition-spring);
}

.aha-settings-modal.is-closing {
  opacity: 0;
}

.aha-settings-panel {
  width: min(420px, 92vw);
  max-height: 80vh;
  background: var(--glass-bg-strong);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  box-shadow: var(--glass-shadow);
  backdrop-filter: blur(34px) saturate(185%);
  -webkit-backdrop-filter: blur(34px) saturate(185%);
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  opacity: 0;
  transform: translateX(40px) scale(0.95);
  pointer-events: none;
  transition: var(--transition-spring);
}

.aha-settings-modal.is-open {
  opacity: 1;
}

.aha-settings-panel.is-open {
  opacity: 1;
  transform: translateX(0) scale(1);
  pointer-events: auto;
}

.aha-input,
.aha-textarea {
  width: 100%;
  border-radius: 12px;
  border: 0.5px solid var(--border-color);
  padding: 8px 10px;
  font-size: 12px;
  background: var(--bg-card);
  color: var(--text-main);
}

.aha-textarea {
  min-height: 90px;
  resize: vertical;
}

.aha-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.aha-link {
  color: var(--brand-blue);
  cursor: pointer;
  font-size: 12px;
}

/* Sidebar theme tokens */
.aha-root[data-theme="dark"] .ahaflow-sidebar {
  --bg-glass: rgba(30, 30, 32, 0.65);
  --bg-card: rgba(255, 255, 255, 0.08);
  --border-highlight: rgba(255, 255, 255, 0.15);
  --color-user: #00d2ff;
  --color-ai: #34d058;
  --color-pin: #ff9f0a;
  --text-main: #f5f5f7;
  --text-sub: #a1a1a6;
  --peek-bg: rgba(30, 30, 34, 0.95);
  --separator-line: rgba(255, 255, 255, 0.15);
  --dot-border: rgba(255, 255, 255, 0.3);
  --line-top: rgba(255, 255, 255, 0.3);
  --line-bottom: rgba(255, 255, 255, 0.05);
  --sidebar-bg: rgba(30, 30, 32, 0.65);
  --sidebar-border: rgba(255, 255, 255, 0.15);
  --pin-bg: rgba(255, 255, 255, 0.08);
  --pin-border: rgba(255, 255, 255, 0.05);
  --pin-hover-bg: rgba(255, 255, 255, 0.15);
  --peek-card-bg: rgba(30, 30, 34, 0.95);
  --peek-card-border: rgba(255, 255, 255, 0.15);
  --peek-card-shadow: 0 10px 30px rgba(0,0,0,0.35);
  --spring-morph: height 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 0.3s ease, background 0.3s ease, opacity 0.3s ease, filter 0.3s ease;
  --sidebar-shadow: 0 20px 40px rgba(0,0,0,0.5), inset 1px 1px 0 rgba(255,255,255,0.1);
}

.aha-root[data-theme="light"] .ahaflow-sidebar {
  --bg-glass: rgba(255, 255, 255, 0.75);
  --bg-card: rgba(0, 0, 0, 0.04);
  --border-highlight: rgba(0, 0, 0, 0.08);
  --color-user: #0a84ff;
  --color-ai: #34c759;
  --color-pin: #ff9f0a;
  --text-main: #1d1d1f;
  --text-sub: #6e6e73;
  --peek-bg: rgba(255, 255, 255, 0.96);
  --separator-line: rgba(0, 0, 0, 0.08);
  --dot-border: rgba(0, 0, 0, 0.08);
  --line-top: rgba(0, 0, 0, 0.12);
  --line-bottom: rgba(0, 0, 0, 0.04);
  --sidebar-bg: #ffffff;
  --sidebar-border: rgba(0, 0, 0, 0.06);
  --pin-bg: rgba(0, 0, 0, 0.04);
  --pin-border: rgba(0, 0, 0, 0.06);
  --pin-hover-bg: rgba(0, 0, 0, 0.06);
  --peek-card-bg: #ffffff;
  --peek-card-border: rgba(0, 0, 0, 0.08);
  --peek-card-shadow: 0 12px 28px rgba(0,0,0,0.12);
  --spring-morph: height 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 0.3s ease, background 0.3s ease, opacity 0.3s ease, filter 0.3s ease;
  --sidebar-shadow: 0 16px 28px rgba(0,0,0,0.12), inset 1px 1px 0 rgba(255,255,255,0.8);
}

/* =========================================
   Collapsed Sidebar (AhaFlow V10)
   ========================================= */
.ahaflow-sidebar {
  position: fixed;
  right: 15px;
  top: 52%;
  transform: translateY(-50%);
  width: 35px;
  height: 80vh;
  min-height: 440px;
  background: var(--sidebar-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--sidebar-border);
  border-radius: 20px;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: var(--sidebar-shadow);
  transition: var(--transition-spring);
}

#ahaflow-container.is-open .ahaflow-sidebar {
  opacity: 0;
  pointer-events: none;
  transform: translateY(-50%) translateX(20px);
}

.global-pins {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  width: 100%;
  padding-bottom: 12px;
  position: relative;
}

.global-pins::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 10px;
  right: 10px;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--separator-line), transparent);
}

.pin-node {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: var(--pin-bg);
  border: 1px solid var(--pin-border);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: var(--spring-morph);
  position: relative;
  color: var(--text-main);
}

.pin-node svg {
  width: 13px;
  height: 13px;
  opacity: 0.8;
  transition: var(--spring-morph);
}

.pin-node:hover {
  background: var(--pin-hover-bg);
  border-color: var(--color-pin);
  transform: scale(1.15);
  box-shadow: 0 4px 15px rgba(255, 159, 10, 0.4);
  filter: brightness(1.2);
}

.pin-node:hover svg {
  opacity: 1;
  color: var(--color-pin);
}

.fluid-track {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-top: 10px;
}

.fluid-track-scroll {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: visible;
  padding: 0;
  will-change: transform;
}

.fluid-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex: var(--base-weight);
  min-height: 22px;
  position: relative;
  cursor: pointer;
}

.fluid-node::before {
  content: '';
  position: absolute;
  inset: -2px -15px;
  z-index: 10;
}

.fluid-line {
  width: 2px;
  flex: 1;
  min-height: 4px;
  border-radius: 1px;
  opacity: 0.3;
  transition: var(--spring-morph);
  background: linear-gradient(to bottom, var(--line-top), var(--line-bottom));
}

.fluid-node:last-child .fluid-line {
  display: none;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 8px;
  margin: 4px 0;
  z-index: 2;
  border: 1.5px solid var(--dot-border);
  transition: var(--spring-morph);
  transform-origin: center;
  flex-shrink: 0;
}

.dot.user {
  background: var(--color-user);
  color: var(--color-user);
}

.dot.ai {
  background: var(--color-ai);
  color: var(--color-ai);
}

.fluid-track:hover .fluid-node .dot {
  opacity: 0.2;
  filter: brightness(0.6);
  box-shadow: none;
}

.fluid-track:hover .fluid-line {
  opacity: 0.1;
}

.fluid-track:hover .fluid-node:has(+ .fluid-node:hover) .dot,
.fluid-track:hover .fluid-node:hover + .fluid-node .dot {
  height: 14px;
  border-radius: 999px;
  opacity: 0.7;
  border-color: rgba(255,255,255,0.5);
  box-shadow: 0 0 8px currentColor;
  filter: brightness(1.1);
}

.fluid-track:hover .fluid-node:hover .dot {
  height: 24px;
  border-radius: 999px;
  transform: scale(1.25);
  opacity: 1;
  border-color: #ffffff;
  box-shadow: 0 0 16px currentColor, 0 0 32px currentColor;
  filter: brightness(1.6) saturate(1.2);
  z-index: 10;
}

.fluid-node.is-selected .dot {
  opacity: 1;
  border-color: rgba(255,255,255,0.7);
  box-shadow: 0 0 0 3px rgba(255,255,255,0.55), 0 0 10px currentColor, 0 0 18px currentColor;
  filter: brightness(1.2);
}

.peek {
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%) translateX(5px);
  background: var(--glass-bg-strong);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 14px;
  padding: 12px 16px;
  width: max-content;
  max-width: 240px;
  font-size: 13px;
  opacity: 0;
  pointer-events: none;
  transition: var(--spring-morph);
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.05),
    0 2px 8px rgba(0, 0, 0, 0.02),
    inset 0 1px 1px rgba(255, 255, 255, 0.95);
  color: var(--text-main);
  z-index: 20;
  line-height: 1.5;
}

.pin-node:hover .peek,
.fluid-node:hover .peek {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

.peek-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-size: 11px;
  font-weight: 600;
  opacity: 0.8;
}

.peek-source {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-pin);
}

.fluid-node .peek-source {
  color: var(--text-sub);
}


.timeline-peek[data-debug='true'] {
  outline: 2px solid #ffda00;
  box-shadow: 0 0 0 2px rgba(255,218,0,0.3), var(--peek-card-shadow);
  background: rgba(255, 218, 0, 0.08);
}

/* =========================================
   Input Pill & Micro Menu (AhaFlow V4)
   ========================================= */
.aha-pill-anchor {
  position: fixed;
  z-index: 9999999;
  pointer-events: none;
  opacity: 0;
  transition: var(--spring-pop);
}

.aha-pill-anchor.is-visible {
  opacity: 1;
  pointer-events: auto;
}

.aha-pill-trigger {
  position: absolute;
  left: 0;
  bottom: 0;
  background: var(--glass-bg-strong);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 32px;
  height: 32px;
  box-sizing: border-box;
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transform: scale(0.8) translateX(10px);
  transition: var(--spring-pop);
  backdrop-filter: blur(22px) saturate(180%);
  -webkit-backdrop-filter: blur(22px) saturate(180%);
  box-shadow: var(--glass-shadow);
}

.aha-pill-anchor.is-visible .aha-pill-trigger,
.aha-pill-anchor.menu-open .aha-pill-trigger {
  opacity: 1;
  pointer-events: auto;
  transform: scale(1) translateX(-46px);
}

.aha-pill-trigger:hover {
  width: 90px;
  border-color: var(--pill-glow-purple);
  box-shadow: var(--glass-shadow), 0 4px 15px rgba(191, 90, 242, 0.14);
}

.aha-pill-icon {
  width: 16px;
  height: 16px;
  color: var(--text-main);
  flex-shrink: 0;
  transition: color 0.2s;
  filter: drop-shadow(0 1px 1px rgba(255,255,255,0.35));
}

.aha-pill-trigger:hover .aha-pill-icon {
  color: var(--pill-glow-purple);
}

.aha-pill-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--pill-glow-purple);
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s 0.1s;
}

.aha-pill-trigger:hover .aha-pill-text {
  opacity: 1;
}

.aha-role-menu {
  position: absolute;
  left: 44px;
  bottom: -4px;
  width: 236px;
  background: var(--glass-bg-strong);
  backdrop-filter: blur(24px) saturate(185%);
  -webkit-backdrop-filter: blur(24px) saturate(185%);
  border: 1px solid var(--glass-border);
  border-radius: 18px;
  box-shadow: var(--glass-shadow);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  opacity: 0;
  transform: translateX(-10px) scale(0.96);
  pointer-events: none;
  transition: opacity 0.18s ease, transform 0.2s ease, box-shadow 0.2s ease;
  transform-origin: left center;
  overflow: hidden;
}

.aha-pill-anchor.menu-open .aha-role-menu {
  opacity: 1;
  transform: translateX(0) scale(1);
  pointer-events: auto;
}

.aha-role-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 2px 2px 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.aha-role-menu-title {
  font-size: 11px;
  color: color-mix(in srgb, var(--text-sub) 88%, white);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 4px 8px;
}

.aha-role-menu-add {
  width: 24px;
  height: 24px;
  border: 1px solid color-mix(in srgb, var(--glass-border) 84%, transparent);
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(255,255,255,0.28), rgba(255,255,255,0.08));
  color: var(--text-main);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.42);
  transition: var(--transition-smooth);
}

.aha-role-menu-add:hover {
  transform: scale(1.06);
  border-color: var(--pill-glow-purple);
  color: var(--pill-glow-purple);
}

.aha-role-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: var(--transition-smooth);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(10px);
}

.aha-role-item:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.14);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
  transform: translateX(4px) scale(1.01);
}

.aha-role-item:hover .aha-role-title {
  color: var(--pill-glow-purple);
}

.aha-role-item:hover .aha-role-icon {
  transform: scale(1.08);
  box-shadow: 0 10px 18px rgba(191, 90, 242, 0.18);
}

.aha-role-icon {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: rgba(191, 90, 242, 0.15);
  color: var(--pill-glow-purple);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.28s ease, background 0.28s ease;
}

.aha-role-item:nth-child(2) .aha-role-icon {
  background: rgba(10, 132, 255, 0.15);
  color: var(--pill-glow-blue);
}

.aha-role-info {
  display: flex;
  flex-direction: column;
}

.aha-role-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
}

.aha-role-desc {
  font-size: 11px;
  color: var(--text-sub);
  margin-top: 2px;
}

.aha-root[data-liquid-glass="off"] #ahaflow-container::before,
.aha-root[data-liquid-glass="off"] #ahaflow-container::after,
.aha-root[data-liquid-glass="off"] .aha-panel::before {
  display: none;
}

.aha-root[data-liquid-glass="off"] .aha-trigger {
  background: var(--bg-glass);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 0.5px solid var(--border-highlight);
  box-shadow: var(--shadow-base), 0 0 20px var(--brand-glow);
}

.aha-root[data-liquid-glass="off"] .aha-trigger::before {
  inset: -2px;
  background: var(--brand-gradient);
  opacity: 0.8;
}

.aha-root[data-liquid-glass="off"] .aha-trigger-inner {
  background: var(--bg-glass);
}

.aha-root[data-liquid-glass="off"] .aha-panel {
  background: var(--bg-glass);
  backdrop-filter: blur(30px) saturate(200%);
  -webkit-backdrop-filter: blur(30px) saturate(200%);
  border: 0.5px solid var(--border-color);
  box-shadow: var(--shadow-base);
}

.aha-root[data-liquid-glass="off"] .icon-btn {
  border: none;
  background: transparent;
  box-shadow: none;
}

.aha-root[data-liquid-glass="off"] .icon-btn:hover {
  background: var(--bg-hover);
}

.aha-root[data-liquid-glass="off"] .icon-btn.is-active {
  background: var(--bg-hover);
  border: 0.5px solid var(--border-color);
  box-shadow: none;
}

.aha-root[data-liquid-glass="off"] .aha-segmented {
  background: var(--bg-hover);
  border: none;
  box-shadow: none;
}

.aha-root[data-liquid-glass="off"] .aha-seg-indicator {
  background: var(--bg-glass-heavy);
  border: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.aha-root[data-liquid-glass="off"] .node-card,
.aha-root[data-liquid-glass="off"] .action-btn,
.aha-root[data-liquid-glass="off"] .aha-persona-item {
  background: var(--bg-card);
  border: 0.5px solid var(--border-color);
}

.aha-root[data-liquid-glass="off"] .action-btn:hover,
.aha-root[data-liquid-glass="off"] .aha-persona-item:hover {
  background: var(--bg-hover);
}

.aha-root[data-liquid-glass="off"] .action-icon {
  background: var(--bg-glass-heavy);
  border: none;
  box-shadow: none;
}

.aha-root[data-liquid-glass="off"] .persona-action {
  background: color-mix(in srgb, var(--bg-card) 80%, transparent);
  border: 1px solid color-mix(in srgb, var(--border-color) 88%, transparent);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
}

.aha-root[data-liquid-glass="off"] #aha-toast {
  background: var(--bg-glass-heavy);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 0.5px solid var(--border-color);
  box-shadow: var(--shadow-base);
}

.aha-root[data-liquid-glass="off"] .aha-settings-panel {
  background:
    linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.08)),
    color-mix(in srgb, var(--bg-glass-heavy) 96%, white 4%);
  border: 1px solid color-mix(in srgb, var(--border-highlight) 72%, white 10%);
  box-shadow:
    0 24px 46px rgba(0, 0, 0, 0.18),
    0 8px 24px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255,255,255,0.24);
}

.aha-root[data-liquid-glass="off"] .peek {
  background: var(--peek-bg);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid var(--border-highlight);
  box-shadow: 0 8px 20px rgba(0,0,0,0.28);
}

.aha-root[data-liquid-glass="off"] .aha-pill-trigger {
  background: var(--pill-bg);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: none;
}

.aha-root[data-liquid-glass="off"] .aha-pill-trigger:hover {
  box-shadow: 0 4px 15px rgba(191, 90, 242, 0.2);
}

.aha-root[data-liquid-glass="off"] .aha-role-menu {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.08)),
    color-mix(in srgb, var(--pill-menu-bg) 78%, transparent);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow:
    0 18px 44px rgba(6, 10, 22, 0.28),
    0 6px 20px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    inset 0 -1px 0 rgba(255, 255, 255, 0.04);
}

.aha-root[data-liquid-glass="off"] .aha-role-menu-add {
  background: color-mix(in srgb, var(--bg-card) 88%, transparent);
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow: none;
}
`;
