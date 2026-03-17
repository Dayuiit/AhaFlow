export const sidebarStyles = `
:host {
  all: initial;
}

.aha-root {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
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
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 999999;
  display: flex;
  align-items: center;
  gap: 16px;
}

.aha-trigger {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background: var(--bg-glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 0.5px solid var(--border-highlight);
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
}

.aha-trigger::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: var(--brand-gradient);
  z-index: 0;
  opacity: 0.8;
  animation: aha-spin 4s linear infinite;
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
  background: var(--bg-glass);
  backdrop-filter: blur(30px) saturate(200%);
  border: 0.5px solid var(--border-color);
  border-radius: 24px;
  box-shadow: var(--shadow-base);
  display: flex;
  flex-direction: column;
  opacity: 0;
  transform: translateX(40px) scale(0.95);
  pointer-events: none;
  transition: var(--transition-spring);
  overflow: hidden;
  position: relative;
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
  border: none;
  background: transparent;
  color: var(--text-sub);
  cursor: pointer;
  transition: var(--transition-smooth);
  display: flex;
  justify-content: center;
  align-items: center;
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

.aha-seg-btn.active {
  color: var(--text-main);
}

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
  background: var(--bg-card);
  border: 0.5px solid var(--border-color);
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
  background: var(--bg-card);
  border: 0.5px solid var(--border-color);
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
  background: var(--bg-card);
  border: 0.5px solid var(--border-color);
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
  background: var(--bg-hover);
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
  background: transparent;
  color: var(--text-sub);
  width: 26px;
  height: 26px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s linear, color 0.2s linear;
}

.persona-action:hover {
  background: var(--bg-hover);
  color: var(--text-main);
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
  background: var(--bg-glass-heavy);
  backdrop-filter: blur(20px);
  border: 0.5px solid var(--border-color);
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

#aha-toast.show {
  opacity: 1;
  transform: translate(-50%, 0);
}

.aha-settings-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000000;
}

.aha-settings-panel {
  width: min(420px, 92vw);
  max-height: 80vh;
  background: var(--bg-glass);
  border: 0.5px solid var(--border-color);
  border-radius: 24px;
  box-shadow: var(--shadow-base);
  backdrop-filter: blur(30px) saturate(180%);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 60vh;
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
  overflow: hidden;
}

.fluid-track-scroll {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  overflow-x: visible;
  padding: 4px 0 6px;
  scrollbar-width: none;
}

.fluid-track-scroll::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.fluid-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex: var(--base-weight);
  min-height: 28px;
  padding: 2px 0;
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
  width: 10px;
  height: 10px;
  border-radius: 8px;
  margin: 6px 0;
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

.fluid-track.is-hovering .fluid-node .dot {
  opacity: 0.2;
  filter: brightness(0.6);
  box-shadow: none;
}

.fluid-track.is-hovering .fluid-line {
  opacity: 0.1;
}

.fluid-node.is-near .dot {
  height: 14px;
  border-radius: 999px;
  opacity: 0.7;
  border-color: rgba(255,255,255,0.5);
  box-shadow: 0 0 8px currentColor;
  filter: brightness(1.1);
}

.fluid-node.is-active .dot {
  height: 24px;
  border-radius: 999px;
  transform: scale(1.25);
  opacity: 1;
  border-color: #ffffff;
  box-shadow: 0 0 16px currentColor, 0 0 32px currentColor;
  filter: brightness(1.6) saturate(1.2);
  z-index: 10;
}

.peek {
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%) translateX(5px);
  background: var(--peek-bg);
  backdrop-filter: blur(15px);
  border: 1px solid var(--border-highlight);
  border-radius: 14px;
  padding: 12px 16px;
  width: max-content;
  max-width: 240px;
  font-size: 13px;
  opacity: 0;
  pointer-events: none;
  transition: var(--spring-morph);
  box-shadow: 0 10px 40px rgba(0,0,0,0.6);
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

.timeline-peek {
  position: fixed;
  transform: translate(-100%, -50%);
  background: var(--peek-card-bg);
  backdrop-filter: blur(15px);
  border: 1px solid var(--peek-card-border);
  border-radius: 18px;
  padding: 16px 18px;
  width: 260px;
  max-width: 320px;
  font-size: 14px;
  pointer-events: none;
  transition: var(--spring-morph);
  box-shadow: var(--peek-card-shadow);
  color: var(--text-main);
  z-index: 10000000;
  line-height: 1.5;
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
  background: var(--pill-bg);
  border: 1px solid var(--pill-border);
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
  backdrop-filter: blur(10px);
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
  box-shadow: 0 4px 15px rgba(191, 90, 242, 0.2);
}

.aha-pill-icon {
  width: 16px;
  height: 16px;
  color: var(--text-main);
  flex-shrink: 0;
  transition: color 0.2s;
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
  left: -46px;
  bottom: 56px;
  width: 220px;
  background: var(--pill-menu-bg);
  backdrop-filter: blur(30px) saturate(200%);
  border: 1px solid var(--pill-menu-border);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05);
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  opacity: 0;
  transform: translateY(10px) scale(0.95);
  pointer-events: none;
  transition: var(--spring-pop);
  transform-origin: bottom left;
}

.aha-pill-anchor.menu-open .aha-role-menu {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

.aha-role-menu-title {
  font-size: 11px;
  color: #666;
  font-weight: 600;
  text-transform: uppercase;
  padding: 4px 8px 8px;
}

.aha-role-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: var(--transition-smooth);
  background: transparent;
  border: 1px solid transparent;
}

.aha-role-item:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.1);
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
`;
