import { useState, useEffect, useCallback, useRef } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
  :root{--ink:#1a1a2e;--ink-l:#2d2d4a;--ink-f:#4a4a6a;--parch:#f5f0e8;--parch-d:#ede7d5;--parch-dd:#e0d8c4;--gold:#c9a84c;--gold-l:#e8c76b;--gold-p:#f5e6b8;--crim:#9b2335;--em:#1a6b4a;--sap:#1a3d6b;--wht:#fefcf8;--sh-sm:0 1px 3px rgba(26,26,46,.08);--sh-md:0 4px 12px rgba(26,26,46,.12);--sh-lg:0 8px 32px rgba(26,26,46,.16);--r:4px;--rl:8px;--fd:'Playfair Display',Georgia,serif;--fb:'Lora',Georgia,serif;--fm:'JetBrains Mono',monospace}
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:var(--fb);background:var(--parch);color:var(--ink);min-height:100vh;line-height:1.7}
  .app{min-height:100vh;display:flex;flex-direction:column}
  .hdr{background:var(--ink);padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:60px;box-shadow:0 2px 8px rgba(0,0,0,.3);position:sticky;top:0;z-index:100}
  .logo{font-family:var(--fd);font-size:20px;font-weight:700;color:var(--gold);display:flex;align-items:center;gap:10px}
  .hdr-right{display:flex;align-items:center;gap:10px}
  .badge{font-family:var(--fm);font-size:11px;color:var(--gold-l);background:rgba(201,168,76,.15);padding:3px 10px;border-radius:12px;border:1px solid rgba(201,168,76,.3);white-space:nowrap}
  .nav{background:var(--ink-l);display:flex;padding:0 24px;border-bottom:1px solid rgba(201,168,76,.2);overflow-x:auto}
  .nb{padding:12px 18px;background:none;border:none;border-bottom:3px solid transparent;color:rgba(245,240,232,.45);font-family:var(--fb);font-size:13px;cursor:pointer;transition:all .2s;letter-spacing:.04em;text-transform:uppercase;display:flex;align-items:center;gap:7px;white-space:nowrap;flex-shrink:0}
  .nb:hover{color:var(--parch)} .nb.on{color:var(--gold);border-bottom-color:var(--gold)}
  .main{flex:1;padding:28px 24px;max-width:1100px;margin:0 auto;width:100%}
  .btn{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;border-radius:var(--r);font-family:var(--fb);font-size:13px;cursor:pointer;border:none;transition:all .2s;font-weight:500}
  .bp{background:var(--gold);color:var(--ink)} .bp:hover{background:var(--gold-l);transform:translateY(-1px)}
  .bo{background:transparent;color:var(--ink);border:1.5px solid var(--ink-f)} .bo:hover{border-color:var(--ink);background:var(--parch-d)}
  .bg{background:transparent;color:var(--ink-f);padding:6px 12px} .bg:hover{color:var(--ink);background:var(--parch-d)}
  .bs{padding:6px 13px;font-size:12px}
  .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:24px}
  .sc{background:var(--wht);border:1.5px solid var(--parch-dd);border-radius:var(--rl);padding:18px;text-align:center}
  .sn{font-family:var(--fd);font-size:28px;font-weight:700;line-height:1;margin-bottom:3px}
  .sl{font-size:11px;color:var(--ink-f);text-transform:uppercase;letter-spacing:.06em;font-family:var(--fm)}
  .chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:22px}
  .chip{display:flex;align-items:center;gap:7px;background:var(--wht);border:1.5px solid var(--parch-dd);padding:7px 13px;border-radius:20px;font-size:13px;cursor:pointer;transition:all .2s;color:var(--ink-f)}
  .chip.on{border-color:var(--gold);background:var(--gold-p);color:var(--ink)} .chip:hover{border-color:var(--ink-f);color:var(--ink)}
  .chip-n{background:var(--parch-d);color:var(--ink-f);font-family:var(--fm);font-size:10px;padding:1px 7px;border-radius:10px}
  .chip.on .chip-n{background:var(--gold);color:var(--ink)}
  .lg{display:grid;gap:10px}
  .lc{background:var(--wht);border:1.5px solid var(--parch-dd);border-radius:var(--rl);padding:18px 22px;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:14px}
  .lc:hover{border-color:var(--gold);box-shadow:var(--sh-md);transform:translateY(-1px)} .lc.rd{border-left:4px solid var(--em)}
  .lst{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;background:var(--parch-d)}
  .lst.ok{background:rgba(26,107,74,.1)} .li{flex:1;min-width:0}
  .lid{font-family:var(--fm);font-size:10px;color:var(--ink-f);text-transform:uppercase;letter-spacing:.1em;margin-bottom:2px}
  .lt{font-family:var(--fd);font-size:16px;color:var(--ink);line-height:1.3}
  .lm{font-size:12px;color:var(--ink-f);margin-top:3px}
  .tag{display:inline-block;padding:2px 9px;border-radius:12px;font-size:11px;font-family:var(--fm);background:rgba(26,107,74,.1);color:var(--em)}
  .reader{max-width:720px;margin:0 auto}
  .bc{font-size:12px;color:var(--ink-f);margin-bottom:14px;display:flex;align-items:center;gap:6px}
  .bl{cursor:pointer;color:var(--gold)} .bl:hover{text-decoration:underline}
  .rtitle{font-family:var(--fd);font-size:34px;line-height:1.2;color:var(--ink);margin-bottom:16px}
  .rack{display:flex;gap:10px;align-items:center;margin-bottom:28px;padding-bottom:22px;border-bottom:1px solid var(--parch-dd);flex-wrap:wrap}
  .rbadge{display:inline-flex;align-items:center;gap:6px;background:rgba(26,107,74,.1);color:var(--em);border:1px solid rgba(26,107,74,.2);padding:5px 12px;border-radius:20px;font-size:12px}
  .rbody{font-size:17px;line-height:1.85;color:var(--ink)} .rbody p{margin-bottom:22px;text-align:justify}
  .rbody p:first-child::first-letter{font-family:var(--fd);font-size:60px;font-weight:700;float:left;line-height:.8;margin-right:8px;margin-top:8px;color:var(--gold)}
  .mg{display:grid;gap:10px;grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}
  .mc{background:var(--wht);border:1.5px solid var(--parch-dd);border-radius:var(--rl);padding:16px;cursor:pointer;transition:all .2s;min-height:90px;display:flex;align-items:center}
  .mc:hover{border-color:var(--gold)} .mc.fl{background:var(--gold-p);border-color:var(--gold)}
  .mc-inner{width:100%;transition:transform .5s;transform-style:preserve-3d;position:relative;min-height:70px}
  .mc.fl .mc-inner{transform:rotateY(180deg)}
  .mc-f,.mc-b{width:100%;backface-visibility:hidden} .mc-b{position:absolute;top:0;transform:rotateY(180deg)}
  .mn{font-family:var(--fm);font-size:10px;color:var(--gold);text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px}
  .mt{font-size:14px;line-height:1.5;color:var(--ink)} .mc.fl .mc-b .mt{color:var(--sap);font-style:italic}
  .mh{font-size:10px;color:var(--ink-f);margin-top:7px}
  .qsetup{max-width:580px;margin:0 auto} .qlabel{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-f);margin-bottom:7px;font-family:var(--fm)} .qgroup{margin-bottom:18px}
  .qsel{width:100%;padding:10px 14px;background:var(--wht);border:1.5px solid var(--parch-dd);border-radius:var(--r);font-family:var(--fb);font-size:14px;color:var(--ink);cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%234a4a6a' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:36px}
  .qsel:focus{outline:none;border-color:var(--gold)}
  .dg{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
  .db{padding:12px;background:var(--wht);border:1.5px solid var(--parch-dd);border-radius:var(--r);cursor:pointer;text-align:center;transition:all .2s}
  .db:hover{border-color:var(--gold)} .db.on{background:var(--gold-p);border-color:var(--gold)}
  .db strong{display:block;font-size:13px;color:var(--ink);margin-bottom:2px} .db span{font-size:11px;color:var(--ink-f)}
  .qview{max-width:660px;margin:0 auto}
  .qprog{display:flex;align-items:center;gap:14px;margin-bottom:22px}
  .pb{flex:1;height:5px;background:var(--parch-dd);border-radius:3px;overflow:hidden}
  .pf{height:100%;background:var(--gold);border-radius:3px;transition:width .4s ease}
  .pt{font-family:var(--fm);font-size:12px;color:var(--ink-f)}
  .timer{font-family:var(--fm);font-size:13px;font-weight:500;color:var(--crim);background:rgba(155,35,53,.08);padding:4px 10px;border-radius:4px}
  .qcard{background:var(--wht);border:1.5px solid var(--parch-dd);border-radius:var(--rl);padding:28px;margin-bottom:18px;box-shadow:var(--sh-sm)}
  .qsrc{font-family:var(--fm);font-size:10px;color:var(--ink-f);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px}
  .qtext{font-family:var(--fd);font-size:19px;line-height:1.4;color:var(--ink)}
  .og{display:grid;gap:9px}
  .opt{padding:13px 16px;background:var(--wht);border:1.5px solid var(--parch-dd);border-radius:var(--r);cursor:pointer;text-align:left;font-family:var(--fb);font-size:14px;color:var(--ink);transition:all .15s;display:flex;align-items:center;gap:11px}
  .opt:hover:not(:disabled){border-color:var(--gold);background:var(--gold-p)} .opt:disabled{cursor:not-allowed}
  .opt.ok{background:rgba(26,107,74,.08);border-color:var(--em);color:var(--em)} .opt.ng{background:rgba(155,35,53,.08);border-color:var(--crim);color:var(--crim)}
  .ol{width:26px;height:26px;border-radius:50%;background:var(--parch-d);display:flex;align-items:center;justify-content:center;font-family:var(--fm);font-size:11px;flex-shrink:0}
  .opt.ok .ol{background:var(--em);color:#fff} .opt.ng .ol{background:var(--crim);color:#fff}
  .expl{background:rgba(26,61,107,.05);border-left:3px solid var(--sap);border-radius:0 4px 4px 0;padding:14px 18px;margin-top:14px;font-size:13px;line-height:1.6;color:var(--ink-f);font-style:italic}
  .expl strong{color:var(--sap);font-style:normal;display:block;margin-bottom:4px;font-size:11px;text-transform:uppercase;letter-spacing:.06em}
  .res{max-width:520px;margin:0 auto;text-align:center;padding:20px 0}
  .rcirc{width:130px;height:130px;border-radius:50%;border:6px solid var(--gold);display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0 auto 28px;background:var(--wht);box-shadow:var(--sh-lg)}
  .rnum{font-family:var(--fd);font-size:40px;font-weight:700;color:var(--ink);line-height:1} .rdenom{font-size:12px;color:var(--ink-f);font-family:var(--fm)}
  .rbtns{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:20px}
  .empty{text-align:center;padding:70px 32px} .empty-icon{font-size:56px;margin-bottom:20px;opacity:.5}
  .empty h2{font-family:var(--fd);font-size:26px;color:var(--ink-f);margin-bottom:10px} .empty p{color:var(--ink-f);margin-bottom:28px;max-width:460px;margin-left:auto;margin-right:auto;font-size:15px}
  .ibar{display:flex;align-items:center;gap:10px;background:var(--wht);border:1.5px solid var(--parch-dd);border-radius:var(--rl);padding:12px 18px;margin-bottom:20px}
  .ibar span{flex:1;color:var(--ink-f);font-size:13px}
  .izone{border:2px dashed var(--parch-dd);border-radius:var(--rl);padding:44px 28px;text-align:center;cursor:pointer;transition:all .2s;background:var(--wht);max-width:460px;margin:0 auto}
  .izone:hover{border-color:var(--gold);background:var(--gold-p)} .izone h3{font-family:var(--fd);font-size:17px;margin-bottom:6px} .izone p{color:var(--ink-f);font-size:13px}
  .stitle{font-family:var(--fd);font-size:22px;color:var(--ink);margin-bottom:6px} .ssub{font-size:13px;color:var(--ink-f);margin-bottom:22px}
  .divider{border:none;border-top:1px solid var(--parch-dd);margin:22px 0}
  .toast{position:fixed;bottom:22px;right:22px;background:var(--ink);color:var(--parch);padding:12px 18px;border-radius:var(--r);font-size:13px;box-shadow:var(--sh-lg);z-index:999;animation:slideIn .3s ease;border-left:3px solid var(--gold)}
  @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
  .panel{background:var(--wht);border:1.5px solid var(--parch-dd);border-radius:var(--rl);padding:24px;margin-bottom:20px;box-shadow:var(--sh-sm)}
  .panel h3{font-family:var(--fd);font-size:18px;margin-bottom:6px} .panel p{font-size:13px;color:var(--ink-f);margin-bottom:16px;line-height:1.6}
  .panel-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
  .info-box{background:var(--gold-p);border:1px solid rgba(201,168,76,.4);border-radius:var(--r);padding:12px 16px;font-size:13px;color:var(--ink);margin-bottom:16px;line-height:1.6}
  .info-box strong{display:block;margin-bottom:3px;font-size:12px;font-family:var(--fm);text-transform:uppercase;letter-spacing:.06em;color:#7a5c00}
  .todo-list{display:grid;gap:10px;margin-top:16px}
  .todo-item{background:var(--wht);border:1.5px solid var(--parch-dd);border-radius:var(--rl);padding:14px 18px;display:flex;align-items:flex-start;gap:12px;transition:all .2s}
  .todo-item.done{opacity:.6}
  .todo-cb{width:20px;height:20px;border-radius:4px;border:2px solid var(--parch-dd);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;margin-top:1px;transition:all .2s;background:var(--wht)}
  .todo-cb.checked{background:var(--em);border-color:var(--em)}
  .todo-text{flex:1;font-size:14px;line-height:1.5;color:var(--ink)} .todo-item.done .todo-text{text-decoration:line-through;color:var(--ink-f)}
  .todo-del{background:none;border:none;cursor:pointer;color:var(--ink-f);font-size:16px;padding:0 4px;opacity:0;transition:opacity .2s}
  .todo-item:hover .todo-del{opacity:1}
  .todo-input-row{display:flex;gap:8px;margin-bottom:16px}
  .todo-input{flex:1;padding:10px 14px;background:var(--wht);border:1.5px solid var(--parch-dd);border-radius:var(--r);font-family:var(--fb);font-size:14px;color:var(--ink)}
  .todo-input:focus{outline:none;border-color:var(--gold)}
  .todo-meta{font-family:var(--fm);font-size:10px;color:var(--ink-f);margin-top:4px}
  .todo-p-btn{padding:4px 10px;border-radius:10px;font-size:12px;border:1px solid;cursor:pointer;background:none;transition:all .2s}
  .todo-cat{padding:5px 12px;border-radius:14px;font-size:12px;cursor:pointer;border:1.5px solid var(--parch-dd);background:var(--wht);color:var(--ink-f);transition:all .2s;font-family:var(--fm)}
  .todo-cat.on{border-color:var(--gold);background:var(--gold-p);color:var(--ink)}
  .progress-section{margin-bottom:20px} .progress-label{display:flex;justify-content:space-between;font-size:12px;color:var(--ink-f);margin-bottom:6px;font-family:var(--fm)}
  .progress-track{height:8px;background:var(--parch-dd);border-radius:4px;overflow:hidden}
  .progress-fill{height:100%;background:linear-gradient(90deg,var(--gold),var(--em));border-radius:4px;transition:width .5s ease}
  .score-row{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--parch-dd);font-size:13px} .score-row:last-child{border:none}
  .score-bar-wrap{flex:1;height:6px;background:var(--parch-dd);border-radius:3px;overflow:hidden} .score-bar{height:100%;background:var(--gold);border-radius:3px}
  .score-pct{font-family:var(--fm);font-size:12px;color:var(--ink-f);width:40px;text-align:right}
  @media(max-width:640px){.main{padding:18px 14px}.stats{grid-template-columns:repeat(2,1fr)}.mg{grid-template-columns:1fr}.dg{grid-template-columns:1fr}.hdr{padding:0 14px}.nav{padding:0 10px}.rtitle{font-size:26px}}
`;

function parseFile(content, fileName) {
  try {
    const lessons = JSON.parse(content);
    if (!Array.isArray(lessons)) throw new Error("Le fichier doit contenir un tableau JSON.");
    return lessons.map(l => ({ ...l, _source: fileName }));
  } catch (e) { throw new Error(`Erreur dans "${fileName}" : ${e.message}`); }
}

function updateSM2(prev = {}, correct) {
  return { factor: correct ? Math.min(1,(prev.factor??.5)+.1) : Math.max(0,(prev.factor??.5)-.2), correct:(prev.correct??0)+(correct?1:0), total:(prev.total??0)+1, lastSeen:Date.now() };
}

const KEY = "culturemaster_v3";
function fresh() { return { lessons:[], read:{}, scores:{}, streak:0, lastStudyDay:null, todoItems:[], quizHistory:[], notes:{} }; }
function loadData() { try { return JSON.parse(localStorage.getItem(KEY)) ?? fresh(); } catch { return fresh(); } }
function saveData(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {} }

function exportProgress(data) {
  const payload = { version:3, exportedAt:new Date().toISOString(), read:data.read, scores:data.scores, streak:data.streak, lastStudyDay:data.lastStudyDay, todoItems:data.todoItems, quizHistory:data.quizHistory, notes:data.notes, lessonSources:[...new Set(data.lessons.map(l=>l._source))] };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download=`culturemaster_progression_${new Date().toISOString().slice(0,10)}.json`; a.click();
  URL.revokeObjectURL(url);
}

function importProgress(content, currentData) {
  const p = JSON.parse(content);
  if (!p.version || !p.read) throw new Error("Fichier invalide.");
  return { ...currentData, read:p.read??{}, scores:p.scores??{}, streak:p.streak??0, lastStudyDay:p.lastStudyDay??null, todoItems:p.todoItems??[], quizHistory:p.quizHistory??[], notes:p.notes??{} };
}

function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return <div className="toast">{msg}</div>;
}

function ImportZone({ onImport }) {
  const [drag, setDrag] = useState(false); const ref = useRef();
  const handle = f => { if (!f || !f.name.endsWith(".txt")) return; const r = new FileReader(); r.onload = e => onImport(e.target.result, f.name); r.readAsText(f); };
  return (
    <div className={`izone${drag?" on":""}`} onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);handle(e.dataTransfer.files[0])}} onClick={()=>ref.current?.click()}>
      <input ref={ref} type="file" accept=".txt" style={{display:"none"}} onChange={e=>handle(e.target.files[0])} />
      <div style={{fontSize:"38px",marginBottom:"10px"}}>📂</div>
      <h3>Glissez un fichier .txt ici</h3>
      <p>ou cliquez pour parcourir</p>
    </div>
  );
}

function NoteEditor({ lessonId, notes, onChange }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(notes[lessonId] ?? "");
  const save = () => { onChange(lessonId, val); setEditing(false); };
  if (!editing) return (
    <div style={{marginTop:"18px"}}>
      <div style={{fontSize:"12px",fontFamily:"var(--fm)",textTransform:"uppercase",letterSpacing:".06em",color:"var(--ink-f)",marginBottom:"8px"}}>📝 Mes notes</div>
      <div onClick={()=>setEditing(true)} style={{padding:"12px 16px",background:"var(--gold-p)",border:"1.5px dashed rgba(201,168,76,.5)",borderRadius:"var(--r)",cursor:"pointer",fontSize:"14px",color:val?"var(--ink)":"var(--ink-f)",minHeight:"60px",lineHeight:"1.6",whiteSpace:"pre-wrap"}}>
        {val || "Cliquez pour ajouter vos notes personnelles sur cette leçon…"}
      </div>
    </div>
  );
  return (
    <div style={{marginTop:"18px"}}>
      <div style={{fontSize:"12px",fontFamily:"var(--fm)",textTransform:"uppercase",letterSpacing:".06em",color:"var(--ink-f)",marginBottom:"8px"}}>📝 Mes notes</div>
      <textarea autoFocus value={val} onChange={e=>setVal(e.target.value)} placeholder="Vos notes, associations d'idées, points à retenir…" style={{width:"100%",minHeight:"120px",padding:"12px 16px",background:"var(--wht)",border:"1.5px solid var(--gold)",borderRadius:"var(--r)",fontFamily:"var(--fb)",fontSize:"14px",color:"var(--ink)",resize:"vertical",lineHeight:"1.7",outline:"none"}} />
      <div style={{display:"flex",gap:"8px",marginTop:"8px"}}>
        <button className="btn bp bs" onClick={save}>💾 Sauvegarder</button>
        <button className="btn bg bs" onClick={()=>{setVal(notes[lessonId]??"");setEditing(false);}}>Annuler</button>
      </div>
    </div>
  );
}

function LearnTab({ lessons, read, notes, onMarkRead, onImport, onNoteChange }) {
  const [activeFile, setActiveFile] = useState("all");
  const [reading, setReading] = useState(null);
  const files = [...new Set(lessons.map(l=>l._source))];
  const filtered = activeFile==="all" ? lessons : lessons.filter(l=>l._source===activeFile);
  const readCount = Object.keys(read).length;

  if (reading) {
    const lesson = lessons.find(l=>l.ID===reading);
    if (!lesson) { setReading(null); return null; }
    const paragraphs = lesson.Contenu.split("\n\n").filter(Boolean);
    return (
      <div className="reader">
        <div className="bc"><span className="bl" onClick={()=>setReading(null)}>← Bibliothèque</span><span>›</span><span>{lesson._source?.replace(".txt","").replace(/_/g," ")}</span></div>
        <h1 className="rtitle">{lesson.Titre}</h1>
        <div className="rack">
          {read[lesson.ID] ? <span className="rbadge">✓ Leçon lue</span> : <button className="btn bp" onClick={()=>onMarkRead(lesson.ID)}>✓ Marquer comme lue</button>}
          <span style={{padding:"5px 11px",borderRadius:"12px",fontSize:"11px",fontFamily:"var(--fm)",background:"rgba(201,168,76,.12)",color:"#8a6a10",border:"1px solid rgba(201,168,76,.3)"}}>{lesson.Memo?.length} points clés · {lesson.Quiz?.length} questions</span>
        </div>
        <div className="rbody">{paragraphs.map((p,i)=><p key={i}>{p}</p>)}</div>
        <NoteEditor lessonId={lesson.ID} notes={notes} onChange={onNoteChange} />
      </div>
    );
  }

  if (lessons.length===0) return (
    <div className="empty"><div className="empty-icon">📚</div><h2>Votre bibliothèque est vide</h2><p>Importez un fichier <code>.txt</code> de leçons pour commencer.</p><ImportZone onImport={onImport} /></div>
  );

  return (
    <div>
      <div className="ibar">
        <span>📂 {lessons.length} leçon{lessons.length>1?"s":""} · {readCount} lue{readCount>1?"s":""}</span>
        <label className="btn bo bs" style={{cursor:"pointer"}}>+ Importer<input type="file" accept=".txt" multiple style={{display:"none"}} onChange={e=>{Array.from(e.target.files).forEach(f=>{const r=new FileReader();r.onload=ev=>onImport(ev.target.result,f.name);r.readAsText(f)});e.target.value=""}} /></label>
      </div>
      <div className="stats">
        <div className="sc"><div className="sn">{lessons.length}</div><div className="sl">Leçons</div></div>
        <div className="sc"><div className="sn" style={{color:"var(--em)"}}>{readCount}</div><div className="sl">Lues</div></div>
        <div className="sc"><div className="sn">{lessons.length>0?Math.round((readCount/lessons.length)*100):0}%</div><div className="sl">Progression</div></div>
      </div>
      {lessons.length>0 && (<div className="progress-section"><div className="progress-label"><span>Avancement global</span><span>{readCount}/{lessons.length}</span></div><div className="progress-track"><div className="progress-fill" style={{width:`${lessons.length?(readCount/lessons.length)*100:0}%`}} /></div></div>)}
      {files.length>1 && (<div className="chips"><div className={`chip ${activeFile==="all"?"on":""}`} onClick={()=>setActiveFile("all")}>📚 Tout <span className="chip-n">{lessons.length}</span></div>{files.map(f=><div key={f} className={`chip ${activeFile===f?"on":""}`} onClick={()=>setActiveFile(f)}>{f.replace(".txt","").replace(/_/g," ")}<span className="chip-n">{lessons.filter(l=>l._source===f).length}</span></div>)}</div>)}
      <div className="lg">
        {filtered.map(l=>{
          const isRead=!!read[l.ID]; const hasNote=!!notes[l.ID];
          return (<div key={l.ID} className={`lc ${isRead?"rd":""}`} onClick={()=>setReading(l.ID)}><div className={`lst ${isRead?"ok":""}`}>{isRead?"✓":"○"}</div><div className="li"><div className="lid">{l.ID} · {l._source?.replace(".txt","").replace(/_/g," ")}</div><div className="lt">{l.Titre}</div><div className="lm">{l.Memo?.length??0} points clés · {l.Quiz?.length??0} questions{hasNote?" · 📝 note":""}</div></div>{isRead&&<span className="tag">✓</span>}</div>);
        })}
      </div>
    </div>
  );
}

function ReviseTab({ lessons }) {
  const [activeLesson, setActiveLesson] = useState(null);
  const [flipped, setFlipped] = useState({});
  if (lessons.length===0) return (<div className="empty"><div className="empty-icon">🃏</div><h2>Aucune leçon chargée</h2><p>Importez des leçons depuis l'onglet Apprendre.</p></div>);
  const lesson = activeLesson ? lessons.find(l=>l.ID===activeLesson) : null;
  if (!lesson) return (<><h2 className="stitle">Révision par fiches</h2><p className="ssub">Choisissez une leçon pour réviser ses points clés.</p><div className="lg">{lessons.map(l=>(<div key={l.ID} className="lc" onClick={()=>{setActiveLesson(l.ID);setFlipped({})}}><div className="lst">🃏</div><div className="li"><div className="lid">{l.ID}</div><div className="lt">{l.Titre}</div><div className="lm">{l.Memo?.length??0} fiches</div></div></div>))}</div></>);
  return (
    <>
      <div className="bc"><span className="bl" onClick={()=>setActiveLesson(null)}>← Retour</span><span>›</span><span>{lesson.Titre}</span></div>
      <h2 className="stitle">{lesson.Titre}</h2><p className="ssub">{lesson.Memo?.length} points clés · Cliquez pour retourner</p>
      <div className="mg">{(lesson.Memo??[]).map((item,i)=>(<div key={i} className={`mc ${flipped[i]?"fl":""}`} onClick={()=>setFlipped(f=>({...f,[i]:!f[i]}))}><div className="mc-inner"><div className="mc-f"><div className="mn">Point {i+1}/{lesson.Memo.length}</div><div className="mt">{item}</div><div className="mh">Cliquer pour retourner ↻</div></div><div className="mc-b"><div className="mn">📖 {lesson.Titre}</div><div className="mt">{item}</div></div></div></div>))}</div>
      <div style={{marginTop:"22px",display:"flex",gap:"10px"}}><button className="btn bo" onClick={()=>setFlipped({})}>Réinitialiser</button><button className="btn bg" onClick={()=>setActiveLesson(null)}>← Retour</button></div>
    </>
  );
}

const DIFF={easy:{label:"Détendu",desc:"4 choix, pas de timer",time:null},normal:{label:"Normal",desc:"4 choix, 30 secondes",time:30},hard:{label:"Expert",desc:"4 choix, 15 secondes",time:15}};

function QuizTab({ lessons, scores, quizHistory, onUpdateScore, onAddHistory }) {
  const [phase, setPhase] = useState("setup");
  const [cfg, setCfg] = useState({scope:"all",lessonId:"",difficulty:"normal"});
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [session, setSession] = useState([]);
  const [timer, setTimer] = useState(null);
  const timerRef = useRef();

  const buildQs = useCallback(()=>{
    let pool=[];
    if(cfg.scope==="lesson"&&cfg.lessonId){const l=lessons.find(x=>x.ID===cfg.lessonId);pool=(l?.Quiz??[]).map(q=>({...q,_lesson:l.Titre,_lid:l.ID}));}
    else{pool=lessons.flatMap(l=>(l.Quiz??[]).map(q=>({...q,_lesson:l.Titre,_lid:l.ID})));}
    pool.sort((a,b)=>{const sa=scores[`${a._lid}::${a.Texte}`]?.factor??.5;const sb=scores[`${b._lid}::${b.Texte}`]?.factor??.5;return(sa-sb)+(Math.random()-.5)*.2;});
    return pool.slice(0,Math.min(10,pool.length));
  },[cfg,lessons,scores]);

  const start=()=>{const qs=buildQs();if(!qs.length)return;setQuestions(qs);setIdx(0);setAnswered(null);setSession([]);setTimer(DIFF[cfg.difficulty].time);setPhase("playing");};

  useEffect(()=>{
    if(phase!=="playing"||answered!==null){clearInterval(timerRef.current);return;}
    const max=DIFF[cfg.difficulty].time; if(!max)return;
    setTimer(max);
    timerRef.current=setInterval(()=>setTimer(t=>{if(t<=1){clearInterval(timerRef.current);handleAnswer(-1);return 0;}return t-1;}),1000);
    return()=>clearInterval(timerRef.current);
  },[idx,phase,answered]);

  const handleAnswer=(optIdx)=>{
    clearInterval(timerRef.current);const q=questions[idx];const correct=optIdx===q.RéponseCorrecte;
    setAnswered(optIdx);onUpdateScore(`${q._lid}::${q.Texte}`,correct);setSession(s=>[...s,{correct,lesson:q._lesson}]);
  };

  const next=()=>{
    if(idx+1>=questions.length){
      const c=session.filter(s=>s.correct).length;const t=questions.length;
      onAddHistory({date:new Date().toISOString(),correct:c,total:t,scope:cfg.scope==="lesson"?(lessons.find(l=>l.ID===cfg.lessonId)?.Titre??"Leçon"):"Global"});
      setPhase("results");
    }else{setIdx(i=>i+1);setAnswered(null);}
  };

  if(lessons.length===0)return(<div className="empty"><div className="empty-icon">🎯</div><h2>Aucune leçon chargée</h2><p>Importez des leçons pour lancer un quiz.</p></div>);

  if(phase==="results"){
    const correct=session.filter(s=>s.correct).length;const total=questions.length;const pct=Math.round((correct/total)*100);
    const msg=pct>=80?"Excellent ! 🏆":pct>=50?"Bon effort ! 📈":"À réviser 💪";
    return(
      <div className="res">
        <div className="rcirc"><div className="rnum">{correct}</div><div className="rdenom">/{total}</div></div>
        <h2 className="stitle">{msg}</h2><p style={{color:"var(--ink-f)",marginBottom:"16px"}}>{pct}% de réponses correctes</p>
        {quizHistory.length>0&&(<div style={{marginBottom:"20px"}}><div style={{fontSize:"12px",fontFamily:"var(--fm)",color:"var(--ink-f)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:"10px"}}>Historique récent</div>{quizHistory.slice(-5).reverse().map((h,i)=>(<div key={i} className="score-row"><span style={{fontSize:"12px",color:"var(--ink-f)",width:"80px",flexShrink:0}}>{new Date(h.date).toLocaleDateString("fr")}</span><span style={{flex:1,fontSize:"13px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.scope}</span><div className="score-bar-wrap"><div className="score-bar" style={{width:`${Math.round((h.correct/h.total)*100)}%`}} /></div><span className="score-pct">{Math.round((h.correct/h.total)*100)}%</span></div>))}</div>)}
        <div className="rbtns"><button className="btn bp" onClick={start}>Rejouer</button><button className="btn bo" onClick={()=>setPhase("setup")}>Configuration</button></div>
      </div>
    );
  }

  if(phase==="playing"&&questions.length>0){
    const q=questions[idx];const timeLim=DIFF[cfg.difficulty].time;
    return(
      <div className="qview">
        <div className="qprog"><div className="pb"><div className="pf" style={{width:`${((idx+1)/questions.length)*100}%`}} /></div><div className="pt">{idx+1}/{questions.length}</div>{timeLim&&answered===null&&<div className="timer">⏱ {timer}s</div>}</div>
        <div className="qcard"><div className="qsrc">{q._lesson}</div><div className="qtext">{q.Texte}</div></div>
        <div className="og">{q.Options.map((opt,i)=>{let cls="";if(answered!==null){if(i===q.RéponseCorrecte)cls="ok";else if(i===answered)cls="ng";}return(<button key={i} className={`opt ${cls}`} disabled={answered!==null} onClick={()=>handleAnswer(i)}><span className="ol">{String.fromCharCode(65+i)}</span>{opt}</button>);})}</div>
        {answered!==null&&(<><div className="expl"><strong>📖 Explication</strong>{q.Explication}</div><div style={{marginTop:"14px",textAlign:"right"}}><button className="btn bp" onClick={next}>{idx+1>=questions.length?"Résultats →":"Suivant →"}</button></div></>)}
      </div>
    );
  }

  const withQuiz=lessons.filter(l=>l.Quiz?.length>0);
  return(
    <div className="qsetup">
      <h2 className="stitle">Configuration du Quiz</h2>
      <div className="qgroup"><label className="qlabel">Périmètre</label><select className="qsel" value={cfg.scope} onChange={e=>setCfg(c=>({...c,scope:e.target.value,lessonId:""}))}>><option value="all">Toutes les leçons</option><option value="lesson">Une leçon spécifique</option></select></div>
      {cfg.scope==="lesson"&&(<div className="qgroup"><label className="qlabel">Leçon</label><select className="qsel" value={cfg.lessonId} onChange={e=>setCfg(c=>({...c,lessonId:e.target.value}))}><option value="">— Choisir —</option>{withQuiz.map(l=><option key={l.ID} value={l.ID}>{l.Titre} ({l.Quiz.length} q.)</option>)}</select></div>)}
      <div className="qgroup"><label className="qlabel">Difficulté</label><div className="dg">{Object.entries(DIFF).map(([key,d])=>(<div key={key} className={`db ${cfg.difficulty===key?"on":""}`} onClick={()=>setCfg(c=>({...c,difficulty:key}))}><strong>{d.label}</strong><span>{d.desc}</span></div>))}</div></div>
      <hr className="divider" /><p style={{fontSize:"13px",color:"var(--ink-f)",marginBottom:"16px"}}>💡 Les questions les plus souvent ratées apparaissent en priorité (algorithme SM-2).</p>
      <button className="btn bp" style={{width:"100%",justifyContent:"center",padding:"13px",fontSize:"15px"}} onClick={start} disabled={cfg.scope==="lesson"&&!cfg.lessonId}>Lancer le Quiz →</button>
    </div>
  );
}

const CATS=["📚 Histoire","🌍 Géographie","🧬 Sciences","🎨 Culture","💡 Idée","⚡ Urgent"];
const PRIOS=[{key:"high",label:"🔴 Haute",color:"var(--crim)"},{key:"medium",label:"🟡 Normale",color:"#a07010"},{key:"low",label:"🟢 Basse",color:"var(--em)"}];

function TodoTab({ items, onUpdate }) {
  const [input, setInput] = useState("");
  const [prio, setPrio] = useState("medium");
  const [cat, setCat] = useState("");
  const [filter, setFilter] = useState("all");

  const add=()=>{if(!input.trim())return;onUpdate([{id:Date.now(),text:input.trim(),done:false,priority:prio,category:cat,createdAt:new Date().toISOString()},...items]);setInput("");};
  const toggle=id=>onUpdate(items.map(i=>i.id===id?{...i,done:!i.done}:i));
  const del=id=>onUpdate(items.filter(i=>i.id!==id));
  const filtered=filter==="all"?items:filter==="done"?items.filter(i=>i.done):filter==="todo"?items.filter(i=>!i.done):items.filter(i=>i.category===filter);
  const doneCount=items.filter(i=>i.done).length;

  return(
    <div>
      <h2 className="stitle">💡 Idées de leçons</h2>
      <p className="ssub">Notez vos idées de leçons à créer, sujets à explorer ou rappels de révision.</p>
      <div className="panel">
        <h3 style={{marginBottom:"12px",fontFamily:"var(--fd)",fontSize:"16px"}}>Nouvelle idée</h3>
        <div className="todo-input-row"><input className="todo-input" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="Ex: Leçon sur la Renaissance italienne…" /><button className="btn bp" onClick={add} disabled={!input.trim()}>Ajouter</button></div>
        <div style={{display:"flex",gap:"16px",flexWrap:"wrap"}}>
          <div><div style={{fontSize:"11px",fontFamily:"var(--fm)",color:"var(--ink-f)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:"6px"}}>Priorité</div><div style={{display:"flex",gap:"6px"}}>{PRIOS.map(p=>(<button key={p.key} className="todo-p-btn" style={{borderColor:p.color,color:prio===p.key?"#fff":p.color,background:prio===p.key?p.color:"transparent"}} onClick={()=>setPrio(p.key)}>{p.label}</button>))}</div></div>
          <div><div style={{fontSize:"11px",fontFamily:"var(--fm)",color:"var(--ink-f)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:"6px"}}>Catégorie</div><div style={{display:"flex",gap:"5px",flexWrap:"wrap"}}>{CATS.map(c=>(<button key={c} className={`todo-cat ${cat===c?"on":""}`} onClick={()=>setCat(cat===c?"":c)}>{c}</button>))}</div></div>
        </div>
      </div>
      {items.length>0&&(<div className="progress-section"><div className="progress-label"><span>Idées traitées</span><span>{doneCount}/{items.length}</span></div><div className="progress-track"><div className="progress-fill" style={{width:`${items.length?(doneCount/items.length)*100:0}%`}} /></div></div>)}
      <div className="chips">{[["all","Tout"],["todo","À faire"],["done","Fait"]].map(([k,l])=>(<div key={k} className={`chip ${filter===k?"on":""}`} onClick={()=>setFilter(k)}>{l} <span className="chip-n">{k==="all"?items.length:k==="done"?doneCount:items.length-doneCount}</span></div>))}{CATS.map(c=>(<div key={c} className={`chip ${filter===c?"on":""}`} onClick={()=>setFilter(filter===c?"all":c)}>{c} <span className="chip-n">{items.filter(i=>i.category===c).length}</span></div>))}</div>
      {filtered.length===0?(<div style={{textAlign:"center",padding:"40px",color:"var(--ink-f)"}}><div style={{fontSize:"40px",marginBottom:"12px"}}>✨</div><div>Aucune idée ici. Ajoutez-en une ci-dessus !</div></div>):(
        <div className="todo-list">{filtered.sort((a,b)=>{const po={high:0,medium:1,low:2};if(a.done!==b.done)return a.done?1:-1;return(po[a.priority]??1)-(po[b.priority]??1);}).map(item=>{const p=PRIOS.find(p=>p.key===item.priority);return(<div key={item.id} className={`todo-item ${item.done?"done":""}`}><div className={`todo-cb ${item.done?"checked":""}`} onClick={()=>toggle(item.id)}>{item.done&&<span style={{color:"#fff",fontSize:"12px"}}>✓</span>}</div><div style={{flex:1}}><div className="todo-text">{item.text}</div><div style={{display:"flex",gap:"8px",marginTop:"5px",flexWrap:"wrap",alignItems:"center"}}>{item.category&&<span style={{fontSize:"11px",fontFamily:"var(--fm)",color:"var(--ink-f)",background:"var(--parch-d)",padding:"2px 7px",borderRadius:"10px"}}>{item.category}</span>}{p&&<span style={{fontSize:"11px",color:p.color,fontFamily:"var(--fm)"}}>{p.label}</span>}<span className="todo-meta">{new Date(item.createdAt).toLocaleDateString("fr")}</span></div></div><button className="todo-del" onClick={()=>del(item.id)}>✕</button></div>);})}</div>
      )}
    </div>
  );
}

function SaveTab({ data, lessons, onImportProgress, showToast }) {
  const progRef = useRef();
  const handleProgImport=f=>{if(!f)return;const r=new FileReader();r.onload=e=>{try{const updated=importProgress(e.target.result,data);onImportProgress(updated);showToast("✓ Progression importée !");}catch(err){showToast(`✗ ${err.message}`);}};r.readAsText(f);};
  const readCount=Object.keys(data.read).length;
  const totalQ=Object.values(data.scores).reduce((s,v)=>s+(v.total??0),0);
  const totalC=Object.values(data.scores).reduce((s,v)=>s+(v.correct??0),0);
  const pct=totalQ>0?Math.round((totalC/totalQ)*100):0;
  const sources=[...new Set(lessons.map(l=>l._source))];
  return(
    <div>
      <h2 className="stitle">💾 Sauvegarde & Progression</h2>
      <p className="ssub">Exportez votre progression pour la sauvegarder sur votre cloud ou la transférer entre appareils.</p>
      <div className="stats"><div className="sc"><div className="sn">{readCount}</div><div className="sl">Leçons lues</div></div><div className="sc"><div className="sn">{totalQ}</div><div className="sl">Questions</div></div><div className="sc"><div className="sn" style={{color:pct>=70?"var(--em)":pct>=40?"#a07010":"var(--crim)"}}>{pct}%</div><div className="sl">Score global</div></div></div>
      {data.quizHistory?.length>0&&(<div className="panel"><h3>📊 Historique des quiz</h3><p>Vos dernières sessions</p>{data.quizHistory.slice(-8).reverse().map((h,i)=>(<div key={i} className="score-row"><span style={{fontSize:"12px",color:"var(--ink-f)",width:"75px",flexShrink:0}}>{new Date(h.date).toLocaleDateString("fr")}</span><span style={{flex:1,fontSize:"13px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.scope}</span><div className="score-bar-wrap"><div className="score-bar" style={{width:`${Math.round((h.correct/h.total)*100)}%`}} /></div><span className="score-pct">{h.correct}/{h.total}</span></div>))}</div>)}
      <div className="panel">
        <h3>📤 Exporter ma progression</h3>
        <p>Télécharge un fichier <code>.json</code> avec votre progression complète : leçons lues, scores, notes personnelles, liste d'idées. Sauvegardez-le sur Google Drive / iCloud / Dropbox.</p>
        <div className="info-box"><strong>Ce fichier contient</strong>{readCount} leçon{readCount!==1?"s":""} lue{readCount!==1?"s":""} · {totalQ} réponses · {Object.values(data.notes??{}).filter(Boolean).length} notes · {(data.todoItems??[]).length} idées</div>
        <div className="panel-row"><button className="btn bp" onClick={()=>exportProgress(data)}>⬇ Télécharger la progression (.json)</button></div>
      </div>
      <div className="panel">
        <h3>📥 Importer une progression</h3>
        <p>Rechargez un fichier exporté précédemment. Vos leçons chargées sont conservées — seule la progression est mise à jour.</p>
        <div className="info-box" style={{background:"rgba(155,35,53,.06)",borderColor:"rgba(155,35,53,.2)"}}><strong style={{color:"var(--crim)"}}>⚠ Attention</strong>L'import écrasera votre progression actuelle. Exportez d'abord si besoin.</div>
        <div className="panel-row"><label className="btn bo" style={{cursor:"pointer"}}>⬆ Importer une progression (.json)<input ref={progRef} type="file" accept=".json" style={{display:"none"}} onChange={e=>{handleProgImport(e.target.files[0]);e.target.value="";}} /></label></div>
      </div>
      <div className="panel">
        <h3>☁️ Synchronisation cloud (méthode recommandée)</h3>
        <ol style={{paddingLeft:"20px",lineHeight:"2",fontSize:"14px",color:"var(--ink-f)"}}>
          <li>Exportez votre progression (bouton ci-dessus)</li>
          <li>Placez le <code>.json</code> dans Google Drive / iCloud / Dropbox</li>
          <li>Sur l'autre appareil, importez vos fichiers <code>.txt</code> de leçons</li>
          <li>Importez votre <code>.json</code> de progression</li>
        </ol>
        <div style={{marginTop:"14px",padding:"12px 16px",background:"var(--parch-d)",borderRadius:"var(--r)",fontSize:"13px",color:"var(--ink-f)"}}>💡 <strong>Astuce :</strong> Les fichiers <code>.txt</code> de leçons ne changent pas — seul le <code>.json</code> de progression doit être synchronisé.</div>
      </div>
      {sources.length>0&&(<div className="panel"><h3>📂 Fichiers chargés cette session</h3><p>Rechargez-les à chaque visite (ils ne sont pas sauvegardés dans le <code>.json</code> de progression).</p>{sources.map(s=>(<div key={s} className="score-row"><span style={{fontSize:"14px"}}>📄</span><span style={{flex:1,fontSize:"13px"}}>{s}</span><span className="tag">{lessons.filter(l=>l._source===s).length} leçons</span></div>))}</div>)}
    </div>
  );
}

export default function CultureMaster() {
  const [data, setData] = useState(loadData);
  const [tab, setTab] = useState("learn");
  const [toast, setToast] = useState(null);
  const showToast=msg=>setToast(msg);
  const persist=d=>{saveData(d);setData(d);};
  const handleImport=(content,fileName)=>{try{const n=parseFile(content,fileName);const e=data.lessons.filter(l=>l._source!==fileName);persist({...data,lessons:[...e,...n]});showToast(`✓ ${n.length} leçon(s) depuis "${fileName}"`);}catch(err){showToast(`✗ ${err.message}`);}};
  const handleMarkRead=id=>{persist({...data,read:{...data.read,[id]:Date.now()}});showToast("✓ Leçon marquée comme lue");};
  const handleUpdateScore=(key,correct)=>persist({...data,scores:{...data.scores,[key]:updateSM2(data.scores[key],correct)}});
  const handleAddHistory=entry=>persist({...data,quizHistory:[...(data.quizHistory??[]),entry].slice(-50)});
  const handleNoteChange=(id,text)=>persist({...data,notes:{...data.notes,[id]:text}});
  const handleTodoUpdate=items=>persist({...data,todoItems:items});
  const handleImportProgress=updated=>persist(updated);
  const totalQ=Object.values(data.scores).reduce((s,v)=>s+(v.total??0),0);
  const todoLeft=(data.todoItems??[]).filter(i=>!i.done).length;
  const TABS=[{id:"learn",label:"Apprendre",icon:"📖"},{id:"revise",label:"Réviser",icon:"🃏"},{id:"quiz",label:"Quiz",icon:"🎯"},{id:"todo",label:"Idées",icon:"💡",badge:todoLeft||null},{id:"save",label:"Sauvegarder",icon:"💾"}];
  return(
    <><style>{STYLES}</style>
    <div className="app">
      <header className="hdr">
        <div className="logo">🏛 CultureMaster</div>
        <div className="hdr-right"><div className="badge">📚 {data.lessons.length} leçons</div><div className="badge">✎ {totalQ} rép.</div></div>
      </header>
      <nav className="nav">{TABS.map(t=>(<button key={t.id} className={`nb ${tab===t.id?"on":""}`} onClick={()=>setTab(t.id)}>{t.icon} {t.label}{t.badge?<span style={{background:"var(--crim)",color:"#fff",borderRadius:"10px",padding:"1px 6px",fontSize:"10px",fontFamily:"var(--fm)"}}>{t.badge}</span>:null}</button>))}</nav>
      <main className="main">
        {tab==="learn"&&<LearnTab lessons={data.lessons} read={data.read} notes={data.notes??{}} onMarkRead={handleMarkRead} onImport={handleImport} onNoteChange={handleNoteChange}/>}
        {tab==="revise"&&<ReviseTab lessons={data.lessons}/>}
        {tab==="quiz"&&<QuizTab lessons={data.lessons} scores={data.scores} quizHistory={data.quizHistory??[]} onUpdateScore={handleUpdateScore} onAddHistory={handleAddHistory}/>}
        {tab==="todo"&&<TodoTab items={data.todoItems??[]} onUpdate={handleTodoUpdate}/>}
        {tab==="save"&&<SaveTab data={data} lessons={data.lessons} onImportProgress={handleImportProgress} showToast={showToast}/>}
      </main>
      {toast&&<Toast msg={toast} onDone={()=>setToast(null)}/>}
    </div></>
  );
}
