import { useState, useEffect, useCallback, useRef } from "react";

// ============================================================
// DESIGN TOKENS — Academic / Editorial aesthetic
// Playfair Display (display) + Lora (body)
// Palette: Deep Ink (#1a1a2e), Parchment (#f5f0e8), Gold (#c9a84c)
// ============================================================

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --ink: #1a1a2e;
    --ink-light: #2d2d4a;
    --ink-faint: #4a4a6a;
    --parchment: #f5f0e8;
    --parchment-dark: #ede7d5;
    --parchment-deeper: #e0d8c4;
    --gold: #c9a84c;
    --gold-light: #e8c76b;
    --gold-pale: #f5e6b8;
    --crimson: #9b2335;
    --emerald: #1a6b4a;
    --sapphire: #1a3d6b;
    --white: #fefcf8;
    --shadow-sm: 0 1px 3px rgba(26,26,46,0.08), 0 1px 2px rgba(26,26,46,0.06);
    --shadow-md: 0 4px 12px rgba(26,26,46,0.12), 0 2px 4px rgba(26,26,46,0.08);
    --shadow-lg: 0 8px 32px rgba(26,26,46,0.16), 0 4px 8px rgba(26,26,46,0.08);
    --radius: 4px;
    --radius-lg: 8px;
    --font-display: 'Playfair Display', Georgia, serif;
    --font-body: 'Lora', Georgia, serif;
    --font-mono: 'JetBrains Mono', monospace;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: var(--font-body);
    background: var(--parchment);
    color: var(--ink);
    min-height: 100vh;
    line-height: 1.7;
  }

  .cm-app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--parchment);
  }

  /* ── HEADER ── */
  .cm-header {
    background: var(--ink);
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .cm-logo {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 700;
    color: var(--gold);
    letter-spacing: 0.03em;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .cm-logo-icon { font-size: 26px; }
  .cm-header-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .cm-streak {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--gold-light);
    background: rgba(201,168,76,0.15);
    padding: 4px 10px;
    border-radius: 20px;
    border: 1px solid rgba(201,168,76,0.3);
  }

  /* ── NAV TABS ── */
  .cm-nav {
    background: var(--ink-light);
    display: flex;
    gap: 0;
    padding: 0 24px;
    border-bottom: 1px solid rgba(201,168,76,0.2);
  }
  .cm-nav-btn {
    padding: 14px 24px;
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    color: rgba(245,240,232,0.5);
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .cm-nav-btn:hover { color: var(--parchment); }
  .cm-nav-btn.active {
    color: var(--gold);
    border-bottom-color: var(--gold);
  }

  /* ── MAIN CONTENT ── */
  .cm-main {
    flex: 1;
    padding: 32px 24px;
    max-width: 1100px;
    margin: 0 auto;
    width: 100%;
  }

  /* ── EMPTY STATE ── */
  .cm-empty {
    text-align: center;
    padding: 80px 40px;
  }
  .cm-empty-icon { font-size: 64px; margin-bottom: 24px; opacity: 0.5; }
  .cm-empty h2 {
    font-family: var(--font-display);
    font-size: 28px;
    color: var(--ink-faint);
    margin-bottom: 12px;
  }
  .cm-empty p { color: var(--ink-faint); margin-bottom: 32px; max-width: 480px; margin-left: auto; margin-right: auto; }

  /* ── IMPORT ZONE ── */
  .cm-import-zone {
    border: 2px dashed var(--parchment-deeper);
    border-radius: var(--radius-lg);
    padding: 48px 32px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    background: var(--white);
    max-width: 480px;
    margin: 0 auto;
  }
  .cm-import-zone:hover {
    border-color: var(--gold);
    background: var(--gold-pale);
  }
  .cm-import-zone p { color: var(--ink-faint); font-size: 14px; margin-top: 8px; }
  .cm-import-zone h3 { font-family: var(--font-display); font-size: 18px; color: var(--ink); }

  /* ── BUTTONS ── */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: var(--radius);
    font-family: var(--font-body);
    font-size: 14px;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
    letter-spacing: 0.02em;
    font-weight: 500;
  }
  .btn-primary {
    background: var(--gold);
    color: var(--ink);
  }
  .btn-primary:hover { background: var(--gold-light); transform: translateY(-1px); box-shadow: var(--shadow-md); }
  .btn-outline {
    background: transparent;
    color: var(--ink);
    border: 1.5px solid var(--ink-faint);
  }
  .btn-outline:hover { border-color: var(--ink); background: var(--parchment-dark); }
  .btn-ghost {
    background: transparent;
    color: var(--ink-faint);
    padding: 6px 12px;
  }
  .btn-ghost:hover { color: var(--ink); background: var(--parchment-dark); }
  .btn-danger {
    background: var(--crimson);
    color: white;
  }
  .btn-danger:hover { opacity: 0.85; }
  .btn-sm { padding: 6px 14px; font-size: 13px; }

  /* ── FILE CHIPS ── */
  .cm-file-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 32px;
  }
  .cm-file-chip {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--white);
    border: 1.5px solid var(--parchment-deeper);
    padding: 8px 14px;
    border-radius: 20px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    color: var(--ink-faint);
  }
  .cm-file-chip.active {
    border-color: var(--gold);
    background: var(--gold-pale);
    color: var(--ink);
  }
  .cm-file-chip:hover { border-color: var(--ink-faint); color: var(--ink); }
  .cm-file-chip-count {
    background: var(--parchment-deeper);
    color: var(--ink-faint);
    font-family: var(--font-mono);
    font-size: 11px;
    padding: 1px 7px;
    border-radius: 10px;
  }
  .cm-file-chip.active .cm-file-chip-count {
    background: var(--gold);
    color: var(--ink);
  }

  /* ── LESSON LIST ── */
  .cm-lesson-grid {
    display: grid;
    gap: 12px;
  }
  .cm-lesson-card {
    background: var(--white);
    border: 1.5px solid var(--parchment-deeper);
    border-radius: var(--radius-lg);
    padding: 20px 24px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .cm-lesson-card:hover {
    border-color: var(--gold);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }
  .cm-lesson-card.read { border-left: 4px solid var(--emerald); }
  .cm-lesson-status {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
    background: var(--parchment-dark);
  }
  .cm-lesson-status.done { background: rgba(26,107,74,0.1); }
  .cm-lesson-info { flex: 1; }
  .cm-lesson-id {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--ink-faint);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 2px;
  }
  .cm-lesson-title {
    font-family: var(--font-display);
    font-size: 17px;
    color: var(--ink);
    line-height: 1.3;
  }
  .cm-lesson-meta {
    font-size: 12px;
    color: var(--ink-faint);
    margin-top: 4px;
  }
  .cm-lesson-score {
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--emerald);
    font-weight: 500;
  }

  /* ── READING VIEW ── */
  .cm-reader {
    max-width: 720px;
    margin: 0 auto;
  }
  .cm-reader-header {
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--parchment-deeper);
  }
  .cm-breadcrumb {
    font-size: 13px;
    color: var(--ink-faint);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .cm-breadcrumb-link {
    cursor: pointer;
    color: var(--gold);
    text-decoration: none;
  }
  .cm-breadcrumb-link:hover { text-decoration: underline; }
  .cm-reader-title {
    font-family: var(--font-display);
    font-size: 36px;
    line-height: 1.2;
    color: var(--ink);
    margin-bottom: 16px;
  }
  .cm-reader-actions { display: flex; gap: 10px; align-items: center; }
  .cm-read-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(26,107,74,0.1);
    color: var(--emerald);
    border: 1px solid rgba(26,107,74,0.2);
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
  }
  .cm-reader-body {
    font-size: 17px;
    line-height: 1.85;
    color: var(--ink);
  }
  .cm-reader-body p {
    margin-bottom: 24px;
    text-align: justify;
  }
  .cm-reader-body p:first-child::first-letter {
    font-family: var(--font-display);
    font-size: 64px;
    font-weight: 700;
    float: left;
    line-height: 0.8;
    margin-right: 8px;
    margin-top: 8px;
    color: var(--gold);
  }

  /* ── MEMO / FLASH CARDS ── */
  .cm-memo-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
  .cm-memo-card {
    background: var(--white);
    border: 1.5px solid var(--parchment-deeper);
    border-radius: var(--radius-lg);
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    perspective: 1000px;
    min-height: 120px;
    display: flex;
    align-items: center;
  }
  .cm-memo-card-inner {
    width: 100%;
    transition: transform 0.5s;
    transform-style: preserve-3d;
    position: relative;
    min-height: 80px;
  }
  .cm-memo-card.flipped .cm-memo-card-inner {
    transform: rotateY(180deg);
  }
  .cm-memo-front, .cm-memo-back {
    width: 100%;
    backface-visibility: hidden;
  }
  .cm-memo-back {
    position: absolute;
    top: 0;
    transform: rotateY(180deg);
  }
  .cm-memo-num {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--gold);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 6px;
  }
  .cm-memo-text {
    font-size: 15px;
    line-height: 1.5;
    color: var(--ink);
  }
  .cm-memo-back .cm-memo-text { color: var(--sapphire); font-style: italic; }
  .cm-memo-hint { font-size: 11px; color: var(--ink-faint); margin-top: 8px; }

  /* ── QUIZ ── */
  .cm-quiz-setup {
    max-width: 600px;
    margin: 0 auto;
  }
  .cm-quiz-setup h2 {
    font-family: var(--font-display);
    font-size: 28px;
    margin-bottom: 24px;
    color: var(--ink);
  }
  .cm-form-group { margin-bottom: 20px; }
  .cm-label {
    display: block;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--ink-faint);
    margin-bottom: 8px;
    font-family: var(--font-mono);
  }
  .cm-select {
    width: 100%;
    padding: 10px 14px;
    background: var(--white);
    border: 1.5px solid var(--parchment-deeper);
    border-radius: var(--radius);
    font-family: var(--font-body);
    font-size: 15px;
    color: var(--ink);
    cursor: pointer;
    transition: border-color 0.2s;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%234a4a6a' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 40px;
  }
  .cm-select:focus { outline: none; border-color: var(--gold); }

  .cm-difficulty-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  .cm-diff-btn {
    padding: 12px;
    background: var(--white);
    border: 1.5px solid var(--parchment-deeper);
    border-radius: var(--radius);
    cursor: pointer;
    text-align: center;
    transition: all 0.2s;
  }
  .cm-diff-btn:hover { border-color: var(--gold); }
  .cm-diff-btn.active {
    background: var(--gold-pale);
    border-color: var(--gold);
  }
  .cm-diff-btn strong { display: block; font-size: 14px; color: var(--ink); margin-bottom: 2px; }
  .cm-diff-btn span { font-size: 12px; color: var(--ink-faint); }

  /* ── QUIZ QUESTION ── */
  .cm-quiz-view {
    max-width: 680px;
    margin: 0 auto;
  }
  .cm-quiz-progress {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
  }
  .cm-progress-bar {
    flex: 1;
    height: 6px;
    background: var(--parchment-deeper);
    border-radius: 3px;
    overflow: hidden;
  }
  .cm-progress-fill {
    height: 100%;
    background: var(--gold);
    border-radius: 3px;
    transition: width 0.4s ease;
  }
  .cm-progress-text {
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--ink-faint);
    white-space: nowrap;
  }
  .cm-timer {
    font-family: var(--font-mono);
    font-size: 14px;
    font-weight: 500;
    color: var(--crimson);
    background: rgba(155,35,53,0.08);
    padding: 4px 10px;
    border-radius: 4px;
  }
  .cm-question-card {
    background: var(--white);
    border: 1.5px solid var(--parchment-deeper);
    border-radius: var(--radius-lg);
    padding: 32px;
    margin-bottom: 20px;
    box-shadow: var(--shadow-sm);
  }
  .cm-question-source {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--ink-faint);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 12px;
  }
  .cm-question-text {
    font-family: var(--font-display);
    font-size: 20px;
    line-height: 1.4;
    color: var(--ink);
  }
  .cm-options-grid {
    display: grid;
    gap: 10px;
  }
  .cm-option {
    padding: 14px 18px;
    background: var(--white);
    border: 1.5px solid var(--parchment-deeper);
    border-radius: var(--radius);
    cursor: pointer;
    text-align: left;
    font-family: var(--font-body);
    font-size: 15px;
    color: var(--ink);
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .cm-option:hover:not(:disabled) {
    border-color: var(--gold);
    background: var(--gold-pale);
  }
  .cm-option:disabled { cursor: not-allowed; }
  .cm-option.correct { background: rgba(26,107,74,0.08); border-color: var(--emerald); color: var(--emerald); }
  .cm-option.wrong { background: rgba(155,35,53,0.08); border-color: var(--crimson); color: var(--crimson); }
  .cm-option-letter {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--parchment-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 500;
    flex-shrink: 0;
  }
  .cm-option.correct .cm-option-letter { background: var(--emerald); color: white; }
  .cm-option.wrong .cm-option-letter { background: var(--crimson); color: white; }

  .cm-explanation {
    background: rgba(26,61,107,0.05);
    border-left: 3px solid var(--sapphire);
    border-radius: 0 var(--radius) var(--radius) 0;
    padding: 16px 20px;
    margin-top: 16px;
    font-size: 14px;
    line-height: 1.6;
    color: var(--ink-faint);
    font-style: italic;
  }
  .cm-explanation strong { color: var(--sapphire); font-style: normal; display: block; margin-bottom: 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; }

  /* ── QUIZ RESULTS ── */
  .cm-results {
    max-width: 560px;
    margin: 0 auto;
    text-align: center;
  }
  .cm-score-circle {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    border: 6px solid var(--gold);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto 32px;
    background: var(--white);
    box-shadow: var(--shadow-lg);
  }
  .cm-score-num {
    font-family: var(--font-display);
    font-size: 42px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1;
  }
  .cm-score-denom { font-size: 13px; color: var(--ink-faint); font-family: var(--font-mono); }
  .cm-results h2 { font-family: var(--font-display); font-size: 28px; margin-bottom: 12px; }
  .cm-results p { color: var(--ink-faint); margin-bottom: 28px; }
  .cm-results-btns { display: flex; justify-content: center; gap: 12px; }

  /* ── STATS BAR ── */
  .cm-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 32px;
  }
  .cm-stat-card {
    background: var(--white);
    border: 1.5px solid var(--parchment-deeper);
    border-radius: var(--radius-lg);
    padding: 20px;
    text-align: center;
  }
  .cm-stat-num {
    font-family: var(--font-display);
    font-size: 32px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1;
    margin-bottom: 4px;
  }
  .cm-stat-label { font-size: 12px; color: var(--ink-faint); text-transform: uppercase; letter-spacing: 0.06em; font-family: var(--font-mono); }

  /* ── IMPORT BAR ── */
  .cm-import-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--white);
    border: 1.5px solid var(--parchment-deeper);
    border-radius: var(--radius-lg);
    padding: 14px 20px;
    margin-bottom: 24px;
    box-shadow: var(--shadow-sm);
  }
  .cm-import-bar span { flex: 1; color: var(--ink-faint); font-size: 14px; }

  /* ── SECTION TITLE ── */
  .cm-section-title {
    font-family: var(--font-display);
    font-size: 24px;
    color: var(--ink);
    margin-bottom: 8px;
  }
  .cm-section-subtitle { color: var(--ink-faint); font-size: 14px; margin-bottom: 24px; }

  .cm-divider { border: none; border-top: 1px solid var(--parchment-deeper); margin: 24px 0; }

  /* ── TOAST ── */
  .cm-toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: var(--ink);
    color: var(--parchment);
    padding: 12px 20px;
    border-radius: var(--radius);
    font-size: 14px;
    box-shadow: var(--shadow-lg);
    z-index: 999;
    animation: slideIn 0.3s ease;
    border-left: 3px solid var(--gold);
  }
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 640px) {
    .cm-main { padding: 20px 16px; }
    .cm-reader-title { font-size: 26px; }
    .cm-stats { grid-template-columns: repeat(2, 1fr); }
    .cm-memo-grid { grid-template-columns: 1fr; }
    .cm-difficulty-grid { grid-template-columns: 1fr; }
    .cm-nav-btn { padding: 12px 14px; font-size: 12px; }
  }
`;

// ============================================================
// PARSER — Converts .txt file content to lesson array
// ============================================================
function parseFile(content, fileName) {
  try {
    const lessons = JSON.parse(content);
    if (!Array.isArray(lessons)) throw new Error("Not an array");
    return lessons.map(l => ({ ...l, _source: fileName }));
  } catch {
    throw new Error(`Erreur de parsing dans "${fileName}". Vérifiez que le fichier contient un JSON valide (tableau d'objets leçons).`);
  }
}

// ============================================================
// SM-2 SIMPLIFIED — Spaced Repetition Algorithm
// easeFactor: 1 = easy (ask rarely), 0 = hard (ask often)
// ============================================================
function updateSM2(prev = {}, correct) {
  const factor = prev.factor ?? 0.5;
  const newFactor = correct
    ? Math.min(1, factor + 0.1)
    : Math.max(0, factor - 0.2);
  return {
    factor: newFactor,
    correct: (prev.correct ?? 0) + (correct ? 1 : 0),
    total: (prev.total ?? 0) + 1,
    lastSeen: Date.now(),
  };
}

// ============================================================
// STORAGE HELPERS
// ============================================================
const STORAGE_KEY = "culturemaster_v2";

function loadData() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {
      lessons: [], read: {}, scores: {}, streak: 0, lastStudyDay: null
    };
  } catch { return { lessons: [], read: {}, scores: {}, streak: 0, lastStudyDay: null }; }
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

// ============================================================
// TOAST COMPONENT
// ============================================================
function Toast({ msg, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);
  return <div className="cm-toast">{msg}</div>;
}

// ============================================================
// LEARN TAB
// ============================================================
function LearnTab({ lessons, read, onMarkRead, onImport }) {
  const [activeFile, setActiveFile] = useState("all");
  const [reading, setReading] = useState(null);

  const files = [...new Set(lessons.map(l => l._source))];
  const filtered = activeFile === "all" ? lessons : lessons.filter(l => l._source === activeFile);
  const readCount = Object.keys(read).length;

  if (reading) {
    const lesson = lessons.find(l => l.ID === reading);
    if (!lesson) { setReading(null); return null; }
    const paragraphs = lesson.Contenu.split("\n\n").filter(Boolean);
    return (
      <div className="cm-reader">
        <div className="cm-reader-header">
          <div className="cm-breadcrumb">
            <span className="cm-breadcrumb-link" onClick={() => setReading(null)}>← Bibliothèque</span>
            <span>›</span>
            <span>{lesson._source?.replace(".txt","")}</span>
          </div>
          <h1 className="cm-reader-title">{lesson.Titre}</h1>
          <div className="cm-reader-actions">
            {read[lesson.ID]
              ? <span className="cm-read-badge">✓ Leçon lue</span>
              : <button className="btn btn-primary" onClick={() => onMarkRead(lesson.ID)}>✓ Marquer comme lue</button>
            }
          </div>
        </div>
        <div className="cm-reader-body">
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="cm-empty">
        <div className="cm-empty-icon">📚</div>
        <h2>Votre bibliothèque est vide</h2>
        <p>Importez un fichier <code>.txt</code> de leçons pour commencer. Chaque fichier correspond à un domaine (ex: Histoire_France.txt).</p>
        <ImportZone onImport={onImport} />
      </div>
    );
  }

  return (
    <div>
      <div className="cm-import-bar">
        <span>📂 {lessons.length} leçon{lessons.length > 1 ? "s" : ""} chargée{lessons.length > 1 ? "s" : ""}</span>
        <label className="btn btn-outline btn-sm" style={{cursor:"pointer"}}>
          + Importer
          <input type="file" accept=".txt" style={{display:"none"}} onChange={e => {
            const f = e.target.files[0]; if (!f) return;
            const reader = new FileReader();
            reader.onload = ev => onImport(ev.target.result, f.name);
            reader.readAsText(f);
            e.target.value = "";
          }} />
        </label>
      </div>

      <div className="cm-stats">
        <div className="cm-stat-card">
          <div className="cm-stat-num">{lessons.length}</div>
          <div className="cm-stat-label">Leçons totales</div>
        </div>
        <div className="cm-stat-card">
          <div className="cm-stat-num" style={{color:"var(--emerald)"}}>{readCount}</div>
          <div className="cm-stat-label">Lues</div>
        </div>
        <div className="cm-stat-card">
          <div className="cm-stat-num">{lessons.length - readCount}</div>
          <div className="cm-stat-label">À lire</div>
        </div>
      </div>

      {files.length > 1 && (
        <div className="cm-file-list">
          <div className={`cm-file-chip ${activeFile === "all" ? "active" : ""}`} onClick={() => setActiveFile("all")}>
            📚 Tout <span className="cm-file-chip-count">{lessons.length}</span>
          </div>
          {files.map(f => (
            <div key={f} className={`cm-file-chip ${activeFile === f ? "active" : ""}`} onClick={() => setActiveFile(f)}>
              {f.replace(".txt","").replace("_"," ")}
              <span className="cm-file-chip-count">{lessons.filter(l => l._source === f).length}</span>
            </div>
          ))}
        </div>
      )}

      <div className="cm-lesson-grid">
        {filtered.map(l => {
          const isRead = !!read[l.ID];
          return (
            <div key={l.ID} className={`cm-lesson-card ${isRead ? "read" : ""}`} onClick={() => setReading(l.ID)}>
              <div className={`cm-lesson-status ${isRead ? "done" : ""}`}>
                {isRead ? "✓" : "○"}
              </div>
              <div className="cm-lesson-info">
                <div className="cm-lesson-id">{l.ID} · {l._source?.replace(".txt","")}</div>
                <div className="cm-lesson-title">{l.Titre}</div>
                <div className="cm-lesson-meta">{l.Memo?.length ?? 0} points clés · {l.Quiz?.length ?? 0} questions</div>
              </div>
              {isRead && <span className="cm-lesson-score">✓ Lu</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// REVISE TAB — Flash Cards with flip animation
// ============================================================
function ReviseTab({ lessons }) {
  const [activeLesson, setActiveLesson] = useState(null);
  const [flipped, setFlipped] = useState({});

  if (lessons.length === 0) return (
    <div className="cm-empty"><div className="cm-empty-icon">🃏</div><h2>Aucune leçon chargée</h2><p>Importez des leçons depuis l'onglet Apprendre.</p></div>
  );

  const lesson = activeLesson ? lessons.find(l => l.ID === activeLesson) : null;
  const memoItems = lesson?.Memo ?? [];

  return (
    <div>
      {!activeLesson ? (
        <>
          <h2 className="cm-section-title">Révision par fiches</h2>
          <p className="cm-section-subtitle">Choisissez une leçon pour réviser ses points clés. Cliquez sur une fiche pour la retourner.</p>
          <div className="cm-lesson-grid">
            {lessons.map(l => (
              <div key={l.ID} className="cm-lesson-card" onClick={() => { setActiveLesson(l.ID); setFlipped({}); }}>
                <div className="cm-lesson-status">🃏</div>
                <div className="cm-lesson-info">
                  <div className="cm-lesson-id">{l.ID}</div>
                  <div className="cm-lesson-title">{l.Titre}</div>
                  <div className="cm-lesson-meta">{l.Memo?.length ?? 0} fiches de révision</div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="cm-breadcrumb" style={{marginBottom:"20px"}}>
            <span className="cm-breadcrumb-link" onClick={() => setActiveLesson(null)}>← Retour</span>
            <span>›</span>
            <span>{lesson.Titre}</span>
          </div>
          <h2 className="cm-section-title">{lesson.Titre}</h2>
          <p className="cm-section-subtitle">{memoItems.length} points clés · Cliquez pour retourner les fiches</p>
          <div className="cm-memo-grid">
            {memoItems.map((item, i) => (
              <div
                key={i}
                className={`cm-memo-card ${flipped[i] ? "flipped" : ""}`}
                onClick={() => setFlipped(f => ({ ...f, [i]: !f[i] }))}
              >
                <div className="cm-memo-card-inner">
                  <div className="cm-memo-front">
                    <div className="cm-memo-num">Point {i + 1}/{memoItems.length}</div>
                    <div className="cm-memo-text">{item}</div>
                    <div className="cm-memo-hint">Cliquez pour voir le contexte ↻</div>
                  </div>
                  <div className="cm-memo-back">
                    <div className="cm-memo-num">📖 Tiré de : {lesson.Titre}</div>
                    <div className="cm-memo-text">{item}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop:"24px", display:"flex", gap:"10px"}}>
            <button className="btn btn-outline" onClick={() => setFlipped({})}>Retourner toutes</button>
            <button className="btn btn-ghost" onClick={() => setActiveLesson(null)}>← Retour</button>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// QUIZ TAB
// ============================================================
function QuizTab({ lessons, scores, onUpdateScore }) {
  const [phase, setPhase] = useState("setup"); // setup | playing | results
  const [config, setConfig] = useState({ scope: "all", lessonId: "", difficulty: "normal" });
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [sessionScores, setSessionScores] = useState([]);
  const [timer, setTimer] = useState(null);
  const timerRef = useRef(null);

  const DIFFICULTY = {
    easy: { label: "Détendu", desc: "4 choix, pas de timer", time: null },
    normal: { label: "Normal", desc: "4 choix, 30 secondes", time: 30 },
    hard: { label: "Expert", desc: "4 choix, 15 secondes", time: 15 },
  };

  const buildQuestions = useCallback(() => {
    let pool = [];
    if (config.scope === "lesson" && config.lessonId) {
      const l = lessons.find(l => l.ID === config.lessonId);
      pool = (l?.Quiz ?? []).map(q => ({ ...q, _lesson: l.Titre, _lid: l.ID }));
    } else {
      pool = lessons.flatMap(l => (l.Quiz ?? []).map(q => ({ ...q, _lesson: l.Titre, _lid: l.ID })));
    }
    // SM-2: sort by difficulty (least-known first) with randomness
    pool.sort((a, b) => {
      const sa = scores[`${a._lid}::${a.Texte}`]?.factor ?? 0.5;
      const sb = scores[`${b._lid}::${b.Texte}`]?.factor ?? 0.5;
      return (sa - sb) + (Math.random() - 0.5) * 0.2;
    });
    return pool.slice(0, Math.min(10, pool.length));
  }, [config, lessons, scores]);

  const startQuiz = () => {
    const qs = buildQuestions();
    if (qs.length === 0) return;
    setQuestions(qs);
    setCurrent(0);
    setAnswered(null);
    setSessionScores([]);
    const t = DIFFICULTY[config.difficulty].time;
    setTimer(t);
    setPhase("playing");
  };

  // Timer countdown
  useEffect(() => {
    if (phase !== "playing" || answered !== null) { clearInterval(timerRef.current); return; }
    const max = DIFFICULTY[config.difficulty].time;
    if (!max) return;
    setTimer(max);
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleAnswer(-1); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [current, phase, answered]);

  const handleAnswer = (optIdx) => {
    clearInterval(timerRef.current);
    const q = questions[current];
    const correct = optIdx === q.RéponseCorrecte;
    setAnswered(optIdx);
    const key = `${q._lid}::${q.Texte}`;
    onUpdateScore(key, correct);
    setSessionScores(ss => [...ss, { correct, q }]);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setPhase("results");
    } else {
      setCurrent(c => c + 1);
      setAnswered(null);
      clearInterval(timerRef.current);
    }
  };

  if (lessons.length === 0) return (
    <div className="cm-empty"><div className="cm-empty-icon">🎯</div><h2>Aucune leçon chargée</h2><p>Importez des leçons pour lancer un quiz.</p></div>
  );

  if (phase === "results") {
    const correct = sessionScores.filter(s => s.correct).length;
    const pct = Math.round((correct / sessionScores.length) * 100);
    const msg = pct >= 80 ? "Excellent travail ! 🏆" : pct >= 50 ? "Bon effort, continuez ! 📈" : "À réviser davantage. 💪";
    return (
      <div className="cm-results">
        <div className="cm-score-circle">
          <div className="cm-score-num">{correct}</div>
          <div className="cm-score-denom">/{sessionScores.length}</div>
        </div>
        <h2 className="cm-section-title">{msg}</h2>
        <p>{pct}% de réponses correctes</p>
        <div className="cm-results-btns">
          <button className="btn btn-primary" onClick={startQuiz}>Rejouer</button>
          <button className="btn btn-outline" onClick={() => setPhase("setup")}>Configuration</button>
        </div>
      </div>
    );
  }

  if (phase === "playing" && questions.length > 0) {
    const q = questions[current];
    const timeLim = DIFFICULTY[config.difficulty].time;
    return (
      <div className="cm-quiz-view">
        <div className="cm-quiz-progress">
          <div className="cm-progress-bar"><div className="cm-progress-fill" style={{width: `${((current+1)/questions.length)*100}%`}} /></div>
          <div className="cm-progress-text">{current + 1} / {questions.length}</div>
          {timeLim && answered === null && <div className="cm-timer">⏱ {timer}s</div>}
        </div>
        <div className="cm-question-card">
          <div className="cm-question-source">{q._lesson}</div>
          <div className="cm-question-text">{q.Texte}</div>
        </div>
        <div className="cm-options-grid">
          {q.Options.map((opt, i) => {
            let cls = "";
            if (answered !== null) {
              if (i === q.RéponseCorrecte) cls = "correct";
              else if (i === answered) cls = "wrong";
            }
            return (
              <button
                key={i}
                className={`cm-option ${cls}`}
                disabled={answered !== null}
                onClick={() => handleAnswer(i)}
              >
                <span className="cm-option-letter">{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            );
          })}
        </div>
        {answered !== null && (
          <>
            <div className="cm-explanation">
              <strong>📖 Explication</strong>
              {q.Explication}
            </div>
            <div style={{marginTop:"16px", textAlign:"right"}}>
              <button className="btn btn-primary" onClick={handleNext}>
                {current + 1 >= questions.length ? "Voir les résultats →" : "Question suivante →"}
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Setup phase
  const allLessonsWithQuiz = lessons.filter(l => l.Quiz?.length > 0);
  return (
    <div className="cm-quiz-setup">
      <h2 className="cm-section-title">Configuration du Quiz</h2>
      <div className="cm-form-group">
        <label className="cm-label">Périmètre</label>
        <select className="cm-select" value={config.scope} onChange={e => setConfig(c => ({...c, scope: e.target.value, lessonId: ""}))}>
          <option value="all">Toutes les leçons (mode global)</option>
          <option value="lesson">Une leçon spécifique</option>
        </select>
      </div>
      {config.scope === "lesson" && (
        <div className="cm-form-group">
          <label className="cm-label">Leçon</label>
          <select className="cm-select" value={config.lessonId} onChange={e => setConfig(c => ({...c, lessonId: e.target.value}))}>
            <option value="">— Choisir une leçon —</option>
            {allLessonsWithQuiz.map(l => <option key={l.ID} value={l.ID}>{l.Titre} ({l.Quiz.length} q.)</option>)}
          </select>
        </div>
      )}
      <div className="cm-form-group">
        <label className="cm-label">Difficulté</label>
        <div className="cm-difficulty-grid">
          {Object.entries(DIFFICULTY).map(([key, d]) => (
            <div key={key} className={`cm-diff-btn ${config.difficulty === key ? "active" : ""}`} onClick={() => setConfig(c => ({...c, difficulty: key}))}>
              <strong>{d.label}</strong>
              <span>{d.desc}</span>
            </div>
          ))}
        </div>
      </div>
      <hr className="cm-divider" />
      <p style={{fontSize:"13px", color:"var(--ink-faint)", marginBottom:"16px"}}>
        💡 Les questions difficiles (souvent ratées) apparaîtront en priorité grâce à l'algorithme de répétition espacée.
      </p>
      <button
        className="btn btn-primary"
        style={{width:"100%", justifyContent:"center", padding:"14px"}}
        onClick={startQuiz}
        disabled={config.scope === "lesson" && !config.lessonId}
      >
        Lancer le Quiz →
      </button>
    </div>
  );
}

// ============================================================
// IMPORT ZONE
// ============================================================
function ImportZone({ onImport }) {
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file || !file.name.endsWith(".txt")) return;
    const reader = new FileReader();
    reader.onload = e => onImport(e.target.result, file.name);
    reader.readAsText(file);
  };

  return (
    <div
      className="cm-import-zone"
      style={{borderColor: dragging ? "var(--gold)" : undefined}}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
      onClick={() => fileRef.current?.click()}
    >
      <input ref={fileRef} type="file" accept=".txt" style={{display:"none"}} onChange={e => handleFile(e.target.files[0])} />
      <div style={{fontSize:"40px", marginBottom:"12px"}}>📂</div>
      <h3>Glissez un fichier .txt ici</h3>
      <p>ou cliquez pour parcourir vos fichiers</p>
    </div>
  );
}

// ============================================================
// APP ROOT
// ============================================================
export default function CultureMaster() {
  const [data, setData] = useState(loadData);
  const [tab, setTab] = useState("learn");
  const [toast, setToast] = useState(null);

  const showToast = (msg) => setToast(msg);

  const persistData = (newData) => {
    saveData(newData);
    setData(newData);
  };

  const handleImport = (content, fileName) => {
    try {
      const newLessons = parseFile(content, fileName);
      // Remove old lessons from same file, add new
      const existing = data.lessons.filter(l => l._source !== fileName);
      persistData({ ...data, lessons: [...existing, ...newLessons] });
      showToast(`✓ ${newLessons.length} leçon(s) chargée(s) depuis "${fileName}"`);
    } catch (err) {
      showToast(`✗ ${err.message}`);
    }
  };

  const handleMarkRead = (id) => {
    persistData({ ...data, read: { ...data.read, [id]: Date.now() } });
    showToast("✓ Leçon marquée comme lue");
  };

  const handleUpdateScore = (key, correct) => {
    const updated = updateSM2(data.scores[key], correct);
    persistData({ ...data, scores: { ...data.scores, [key]: updated } });
  };

  const totalQuestions = Object.values(data.scores).reduce((s, v) => s + (v.total ?? 0), 0);
  const streak = data.streak ?? 0;

  const tabs = [
    { id: "learn", label: "Apprendre", icon: "📖" },
    { id: "revise", label: "Réviser", icon: "🃏" },
    { id: "quiz", label: "Quiz", icon: "🎯" },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="cm-app">
        <header className="cm-header">
          <div className="cm-logo">
            <span className="cm-logo-icon">🏛</span>
            CultureMaster
          </div>
          <div className="cm-header-right">
            {streak > 0 && (
              <div className="cm-streak">🔥 {streak} jour{streak > 1 ? "s" : ""}</div>
            )}
            <div className="cm-streak" style={{borderColor:"rgba(245,240,232,0.2)"}}>
              ✎ {totalQuestions} rép.
            </div>
          </div>
        </header>

        <nav className="cm-nav">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`cm-nav-btn ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </nav>

        <main className="cm-main">
          {tab === "learn" && (
            <LearnTab
              lessons={data.lessons}
              read={data.read}
              onMarkRead={handleMarkRead}
              onImport={handleImport}
            />
          )}
          {tab === "revise" && <ReviseTab lessons={data.lessons} />}
          {tab === "quiz" && (
            <QuizTab
              lessons={data.lessons}
              scores={data.scores}
              onUpdateScore={handleUpdateScore}
            />
          )}
        </main>

        {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      </div>
    </>
  );
}
