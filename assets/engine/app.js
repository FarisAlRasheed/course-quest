/* ============================ APP ============================ */
(function(){
'use strict';
const $ = (s, r) => (r || document).querySelector(s);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const KEY = COURSE.id + '.v1', THEME_KEY = COURSE.id + '.theme';
const DEF = () => ({seen:{}, quiz:{}, qxp:{}, drill:{}, dxp:{}, best:{}, streak:{day:'',n:0}, closed:{}, badges:{}, onlyLeft:false, sr:{i:0, cards:{}, done:false, t:0}});
let S;
try { S = Object.assign(DEF(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch(e) { S = DEF(); }
if (!S.sr) S.sr = DEF().sr;
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e) {} };
const ODDS = {high:'HIGH', med:'MED', low:'LOW'};
const LETTERS = 'ABCDEF';
const byId = id => TOPICS.find(t => t.id === id);
const modOf = id => MODS.find(m => m.id === id);
const dayKey = d => d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
const QCELLS = COURSE.questions;   // exam questions: {n, max, name, note, topics:[topic ids]}

/* ---------- stable option shuffle ---------- */
function hash(s){ let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed){ return function(){ seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
TOPICS.forEach(t => t.quiz.forEach(q => {
  const last = /^None/.test(String(q.o[q.o.length - 1]).replace(/<[^>]+>/g,'')) ? q.o.length - 1 : -1;   // keep "None of the above" last
  const r = rng(hash(q.q)), idx = q.o.map((_, i) => i).filter(i => i !== last);
  for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  if (last >= 0) idx.push(last);
  q.o = idx.map(i => q.o[i]); q.a = idx.indexOf(q.a);
}));

/* ---------- streak / toast ---------- */
function touchStreak(){
  const now = new Date(), today = dayKey(now);
  if (S.streak.day === today) return;
  const y = new Date(now); y.setDate(y.getDate() - 1);
  S.streak.n = (S.streak.day === dayKey(y)) ? S.streak.n + 1 : 1; S.streak.day = today;
}
let toastT;
function toast(msg){ const el = $('#toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2300); }

/* ---------- stats and coverage ---------- */
function tstats(t){
  const qa = S.quiz[t.id] || {}, pn = (t.points || []).length, qn = t.quiz.length, dn = t.drills.length;
  let qok = 0, qdone = 0, qbad = 0, dgot = 0, dretry = 0, seen = 0;
  t.quiz.forEach((_, i) => { if (qa[i]) { qdone++; if (qa[i].ok) qok++; else qbad++; } });
  t.drills.forEach(d => { const v = S.drill[d.id]; if (v === 'got') dgot++; else if (v === 'retry') dretry++; });
  for (let i = 0; i < pn; i++) if (S.seen[t.id + ':' + i]) seen++;
  const wq = qn ? .45 : 0, wd = dn ? .45 : 0, wp = pn ? .10 : 0, sw = wq + wd + wp || 1;
  const p = Math.round(100 * ((qn ? wq * qok / qn : 0) + (dn ? wd * dgot / dn : 0) + (pn ? wp * seen / pn : 0)) / sw);
  const left = (pn - seen) + (qn - qdone) + (dn - dgot - dretry);
  return {p, qok, qdone, qbad, qn, dgot, dretry, dn, pn, seen, left, started: !!(seen || qdone || dgot || dretry), mastered: p >= 80};
}
function modStats(m){
  const ts = TOPICS.filter(t => t.mod === m.id), st = ts.map(tstats);
  return {n: ts.length, done: st.filter(s => s.mastered).length, p: Math.round(st.reduce((a, s) => a + s.p, 0) / (ts.length || 1))};
}
function qcell(c){ const ps = c.topics.map(id => byId(id)).filter(Boolean).map(t => tstats(t).p); return Math.round(10 * c.max * (ps.reduce((a, b) => a + b, 0) / (ps.length || 1)) / 100) / 10; }
function totalLeft(){ return TOPICS.reduce((a, t) => a + Math.max(0, tstats(t).left), 0); }
function nextTopic(){ return TOPICS.find(t => !tstats(t).mastered) || null; }

/* ---------- stamps ---------- */
function stamps(){
  const b = [{id:'first', name:'First mark', on: Object.values(S.quiz).some(o => Object.values(o).some(a => a.ok))}];
  MODS.forEach(m => { const ms = modStats(m); b.push({id:'m-' + m.id, name: m.name + ' cleared', on: ms.n > 0 && ms.done === ms.n}); });
  b.push({id:'sr', name:'Speedrun complete', on: !!S.sr.done});
  b.push({id:'w10', name:'10 written answers', on: Object.values(S.drill).filter(v => v === 'got').length >= 10});
  b.push({id:'boss', name:'Pop quiz 8/10', on: Object.values(S.best).some(v => v >= 8)});
  b.push({id:'st3', name:'3-day streak', on: S.streak.n >= 3});
  return b;
}
function checkStamps(){ stamps().forEach(b => { if (b.on && !S.badges[b.id]) { S.badges[b.id] = 1; setTimeout(() => toast('Stamp earned: ' + b.name), 1500); } }); save(); }

/* ---------- code rendering ---------- */
const KW = new Set('public private static void return if else for while new class interface implements extends this null true false break continue final do int boolean char double long'.split(' '));
function hl(src){
  const re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|\b([A-Za-z_]\w*)\b/g;
  let out = '', last = 0, m;
  while ((m = re.exec(src))) {
    out += esc(src.slice(last, m.index));
    if (m[1]) out += '<span class="c">' + esc(m[1]) + '</span>';
    else if (m[2]) out += '<span class="s">' + esc(m[2]) + '</span>';
    else out += KW.has(m[3]) ? '<span class="k">' + m[3] + '</span>' : esc(m[3]);
    last = re.lastIndex;
  }
  return out + esc(src.slice(last));
}
function cbox(src, lang){
  const n = src.split('\n').length;
  return '<div class="cbox"><ol>' + Array.from({length: n}, (_, i) => '<li>' + (i + 1) + '</li>').join('') + '</ol><pre tabindex="0">' + (lang === 'text' ? esc(src) : hl(src)) + '</pre></div>';
}
function sheetBox(src, lang){
  const lines = src.split('\n');
  return '<div class="cbox blue"><ol>' + lines.map((_, i) => '<li>' + (i + 1) + '</li>').join('') + '</ol><ul class="lines ansl" tabindex="0">' +
    lines.map((l, i) => '<li style="--n:' + Math.min(i, 40) + '">' + (lang === 'text' ? esc(l) : hl(l)) + '&nbsp;</li>').join('') + '</ul></div>';
}

/* ---------- figures: nodes and pointers ---------- */
function ftags(sc, n){
  const t = {}; const add = (i, l, r) => { if (i == null || i < 0 || i >= n) return; t[i] = t[i] || {l: [], r: false}; t[i].l.push(l); if (r) t[i].r = true; };
  if (sc.tags) Object.keys(sc.tags).forEach(k => add(+k, sc.tags[k], /current/.test(sc.tags[k])));
  add(sc.head, 'head'); add(sc.cur, 'current', true);
  return t;
}
function chainFig(sc){
  const nodes = sc.nodes, dll = sc.kind === 'dll', tg = ftags(sc, nodes.length);
  let h = '<div class="frow">';
  if (dll) h += '<span class="fnull">null</span><div class="far two" style="--i:0"></div>';
  nodes.forEach((d, i) => {
    const t = tg[i], fresh = (sc.fresh || []).indexOf(i) >= 0;
    h += '<div class="fn' + (dll ? ' dll' : '') + (sc.cur === i ? ' cur' : '') + (fresh ? ' fresh' : '') + '" style="--i:' + i + '">' +
      (t ? '<span class="ftag' + (t.r ? ' r' : '') + '">' + t.l.join(' / ') + '</span>' : '') +
      (dll ? '<span class="q l"></span>' : '') + '<span class="d">' + esc(d) + '</span><span class="q"></span></div>';
    if (i < nodes.length - 1) h += '<div class="far' + (dll ? ' two' : '') + '" style="--i:' + (i + 1) + '"></div>';
  });
  h += '<div class="far' + (dll ? ' two' : '') + '" style="--i:' + nodes.length + '"></div><span class="fnull">null</span></div>';
  return h;
}
function arrayFig(sc){
  const tg = ftags(sc, sc.cells.length);
  return '<div class="cells">' + sc.cells.map((c, i) => {
    const t = tg[i];
    return '<div class="cell' + (sc.cur === i ? ' cur' : '') + ((sc.fresh || []).indexOf(i) >= 0 ? ' fresh' : '') + ((sc.moved || []).indexOf(i) >= 0 ? ' moved' : '') + '" style="--i:' + i + '">' +
      (t ? '<span class="ftag' + (t.r ? ' r' : '') + '">' + t.l.join(' / ') + '</span>' : '') + esc(c) + '<span class="ix">' + i + '</span></div>';
  }).join('') + '</div>';
}
function vcol(items, label){
  return '<div class="col"><div class="vstack">' + items.map((x, i) => '<div class="vbox' + (i === items.length - 1 ? ' top' : '') + '" style="animation-delay:' + i * 70 + 'ms">' +
    (i === items.length - 1 ? '<span class="ftag r">top</span>' : '') + esc(x) + '</div>').join('') + '</div><div class="vbase"></div>' + (label ? '<div class="fcap" style="margin:6px 0 0">' + label + '</div>' : '') + '</div>';
}
function stackFig(sc){
  return '<div class="stk">' + vcol(sc.items, 'before') + '<span class="fnull" style="align-self:center">&rarr;</span>' + vcol(sc.next, 'after') + '</div>';
}
function stacksFig(sc){
  return '<div class="stk">' + sc.steps.map(s => '<div class="col"><span class="tk">' + esc(s.t) + '</span><div class="vstack">' +
    s.s.map((x, i) => '<div class="vbox" style="animation-delay:' + i * 50 + 'ms">' + esc(x) + '</div>').join('') + '</div><div class="vbase" style="width:62px"></div></div>').join('') + '</div>';
}
function figHTML(scenes){
  return '<div class="fig">' + scenes.map(sc => '<div class="scene"><div class="fcap">' + esc(sc.cap || '') + '</div>' +
    (sc.kind === 'chain' || sc.kind === 'dll' ? chainFig(sc) : sc.kind === 'array' ? arrayFig(sc) : sc.kind === 'stack' ? stackFig(sc) :
     sc.kind === 'stacks' ? stacksFig(sc) : '<ol class="stepsl">' + sc.steps.map(s => '<li>' + esc(s) + '</li>').join('') + '</ol>') + '</div>').join('') + '</div>';
}

/* ---------- visualizers ---------- */
const VZ = {};
const node = (d, o) => '<div class="fn' + (o && o.cur ? ' cur' : '') + (o && o.fresh ? ' fresh' : '') + '" style="--i:' + ((o && o.i) || 0) + '">' + ((o && o.tag) ? '<span class="ftag' + (o.r ? ' r' : '') + '">' + o.tag + '</span>' : '') + '<span class="d">' + esc(d) + '</span><span class="q"></span></div>';
const arrow = i => '<div class="far" style="--i:' + (i || 0) + '"></div>';
function vzInit(k){
  if (k === 'qcycle') VZ.qcycle = {q:['A','B','C','D','E'], hand:null, i:0, n:5, drop:false, msg:'Press Step. Each round serves the head, holds it, then decides.'};
  if (k === 'postfix') VZ.postfix = VZ.postfix ? Object.assign(VZ.postfix, {pos:0, st:[], msg:'Press Step to read the next token.'}) : {text:'7 2 3 * + 4 5 + -', pos:0, st:[], msg:'Press Step to read the next token.'};
  if (k === 'llins') VZ.llins = {items:['A','B','C'], cur:1, next:0, msg:'The list is A, B, C with current on B. Try insert, remove and findNext.', fresh:-1};
  if (k === 'circq') VZ.circq = {max:5, a:['','','','',''], head:0, tail:0, size:0, next:0, msg:'maxsize = 5. Enqueue until it wraps, then serve and enqueue again.', fresh:-1};
}
function vzHTML(k){
  if (!VZ[k]) vzInit(k);
  const s = VZ[k]; let h = '<div class="vz" id="vz-' + k + '" data-viz="' + k + '">';
  if (k === 'qcycle'){
    const done = s.i >= s.n && s.hand === null;
    h += '<div class="vz-h"><span>Cycle trick on a queue, n = ' + s.n + '</span><span>round ' + Math.min(s.i + (s.hand ? 1 : 0), s.n) + ' / ' + s.n + '</span></div><div class="frow">' +
      (s.q.length ? s.q.map((x, i) => (i ? arrow(i) : '') + node(x, {tag: i === 0 ? 'head' : (i === s.q.length - 1 ? 'tail' : ''), i: 0})).join('') : '<span class="fnull">empty</span>') + '</div>' +
      '<div class="vz-hand"><span>in hand (served):</span>' + (s.hand ? node(s.hand, {cur: true}) : '<span>nothing</span>') + '</div>' +
      '<div class="vz-ctl"><button class="btn red" data-viz-do="step"' + (done ? ' disabled' : '') + '>Step</button><button class="btn ghost" data-viz-do="reset">Reset</button><button class="btn ghost" data-viz-do="drop">' + (s.drop ? 'Mode: drop C' : 'Mode: keep all') + '</button></div>';
  } else if (k === 'postfix'){
    const toks = s.text.trim().split(/\s+/).filter(Boolean);
    h += '<div class="vz-h"><span>Postfix evaluator</span><span>stack grows upward</span></div><div class="toks">' + toks.map((t, i) => '<span class="tkn' + (i === s.pos ? ' on' : i < s.pos ? ' past' : '') + '">' + esc(t) + '</span>').join('') + '</div>' +
      '<div class="stk"><div class="col">' + (s.st.length ? '' : '') + '<div class="vstack">' + s.st.map((x, i) => '<div class="vbox' + (i === s.st.length - 1 ? ' top' : '') + '">' + (i === s.st.length - 1 ? '<span class="ftag r">top</span>' : '') + esc(x) + '</div>').join('') + '</div><div class="vbase"></div></div></div>' +
      '<div class="vz-ctl"><input type="text" id="vz-pf-in" value="' + esc(s.text) + '" aria-label="Postfix expression"><button class="btn red" data-viz-do="step"' + (s.pos >= toks.length ? ' disabled' : '') + '>Step</button><button class="btn ghost" data-viz-do="all">Run all</button><button class="btn ghost" data-viz-do="reset">Reset</button></div>' +
      '<div class="vz-ctl"><button class="pill" data-viz-do="ex1">Example: 7 5 2 * 8 - *</button><button class="pill" data-viz-do="ex2">Example with &lt; &gt; ||</button></div>';
  } else if (k === 'llins'){
    h += '<div class="vz-h"><span>Linked list: insert and remove after / at current</span></div><div class="frow">' +
      (s.items.length ? s.items.map((x, i) => (i ? arrow(i) : '') + node(x, {cur: i === s.cur, fresh: i === s.fresh, tag: (i === 0 ? 'head' : '') + (i === 0 && i === s.cur ? ' / ' : '') + (i === s.cur ? 'current' : ''), r: i === s.cur, i: 0})).join('') + arrow(0) + '<span class="fnull">null</span>' : '<span class="fnull">empty list: head = current = null</span>') + '</div>' +
      '<div class="vz-ctl"><button class="btn red" data-viz-do="ins">insert(' + 'NMXYZW'[s.next % 6] + ')</button><button class="btn" data-viz-do="rem"' + (s.items.length ? '' : ' disabled') + '>remove()</button><button class="btn ghost" data-viz-do="next"' + (s.items.length && s.cur < s.items.length - 1 ? '' : ' disabled') + '>findNext()</button><button class="btn ghost" data-viz-do="first"' + (s.items.length ? '' : ' disabled') + '>findFirst()</button><button class="btn ghost" data-viz-do="reset">Reset</button></div>';
  } else if (k === 'circq'){
    const full = s.size === s.max;
    h += '<div class="vz-h"><span>Circular array queue, maxsize = ' + s.max + '</span><span>size = ' + s.size + (full ? ' (full)' : s.size === 0 ? ' (empty)' : '') + '</span></div><div class="cells">' +
      s.a.map((c, i) => { const tg = [i === s.head ? 'head' : '', i === s.tail ? 'tail' : ''].filter(Boolean).join(' / '); return '<div class="cell' + (i === s.fresh ? ' fresh' : '') + '" style="--i:' + i + '">' + (tg ? '<span class="ftag' + (i === s.tail ? ' r' : '') + '">' + tg + '</span>' : '') + esc(c) + '<span class="ix">' + i + '</span></div>'; }).join('') + '</div>' +
      '<div class="vz-ctl" style="margin-top:28px"><button class="btn red" data-viz-do="enq"' + (full ? ' disabled' : '') + '>enqueue(' + 'ABCDEFGHJK'[s.next % 10] + ')</button><button class="btn" data-viz-do="serve"' + (s.size ? '' : ' disabled') + '>serve()</button><button class="btn ghost" data-viz-do="reset">Reset</button></div>';
  }
  return h + '<div class="vz-msg">' + s.msg + '</div></div>';
}
function evalTok(s, tk){
  const isNum = /^-?\d+$/.test(tk), isBool = tk === 'T' || tk === 'F';
  if (isNum || isBool){ s.st.push(tk); return 'push ' + tk; }
  if (s.st.length < 2) return 'not enough operands for ' + tk;
  const b = s.st.pop(), a = s.st.pop(), n = x => x === 'T' ? 1 : x === 'F' ? 0 : +x, B = x => x ? 'T' : 'F'; let r;
  switch (tk){
    case '+': r = n(a) + n(b); break; case '-': r = n(a) - n(b); break; case '*': r = n(a) * n(b); break;
    case '/': r = n(b) === 0 ? 0 : Math.trunc(n(a) / n(b)); break; case '%': r = n(b) === 0 ? 0 : n(a) % n(b); break;
    case '<': r = B(n(a) < n(b)); break; case '>': r = B(n(a) > n(b)); break; case '==': r = B(n(a) === n(b)); break;
    case '!=': r = B(n(a) !== n(b)); break; case '&&': r = B(n(a) && n(b)); break; case '||': r = B(n(a) || n(b)); break;
    default: s.st.push(a, b); return 'unknown token ' + tk;
  }
  s.st.push(String(r)); return 'pop ' + b + ' (right), pop ' + a + ' (left): ' + a + ' ' + tk + ' ' + b + ' = ' + r + ', push ' + r;
}
function vzDo(k, act){
  if (!VZ[k]) vzInit(k); const s = VZ[k];
  if (act === 'reset'){ if (k === 'postfix'){ const inp = $('#vz-pf-in'); if (inp) s.text = inp.value; } vzInit(k); }
  else if (k === 'qcycle'){
    if (act === 'drop'){ s.drop = !s.drop; vzInit('qcycle'); VZ.qcycle.drop = s.drop; VZ.qcycle.msg = s.drop ? 'Mode: drop C. C will be served but not enqueued back.' : 'Mode: keep all.'; }
    else if (act === 'step'){
      if (s.hand === null){ if (s.i < s.n){ s.hand = s.q.shift(); s.msg = 'serve() returns ' + s.hand + '. It is in hand now.'; } }
      else { if (s.drop && s.hand === 'C'){ s.msg = 'C matches: skip it, do NOT enqueue it back.'; } else { s.q.push(s.hand); s.msg = 'enqueue(' + s.hand + '): it goes to the tail.'; } s.hand = null; s.i++;
        if (s.i >= s.n) s.msg += ' n rounds done: ' + (s.drop ? 'C is gone, the rest kept their order.' : 'the queue is back in its original order.'); }
    }
  } else if (k === 'postfix'){
    const inp = $('#vz-pf-in'); if (inp && inp.value !== s.text){ s.text = inp.value; s.pos = 0; s.st = []; }
    const toks = s.text.trim().split(/\s+/).filter(Boolean);
    if (act === 'ex1'){ s.text = '7 5 2 * 8 - *'; s.pos = 0; s.st = []; s.msg = 'Loaded. Press Step.'; }
    else if (act === 'ex2'){ s.text = '9 3 1 5 - * 8 4 3 / 1 + - + < 25 5 % 0 > ||'; s.pos = 0; s.st = []; s.msg = 'Loaded. T = true, F = false.'; }
    else if (act === 'step' && s.pos < toks.length){ s.msg = evalTok(s, toks[s.pos]); s.pos++; if (s.pos >= toks.length) s.msg += '. Done: the answer is the top of the stack.'; }
    else if (act === 'all'){ while (s.pos < toks.length){ s.msg = evalTok(s, toks[s.pos]); s.pos++; } s.msg = 'Finished. Result: ' + s.st.join(' '); }
  } else if (k === 'llins'){
    s.fresh = -1;
    if (act === 'ins'){ const v = 'NMXYZW'[s.next++ % 6]; if (!s.items.length){ s.items = [v]; s.cur = 0; } else { s.items.splice(s.cur + 1, 0, v); s.cur++; } s.fresh = s.cur; s.msg = 'insert(' + v + '): new node after current, and it becomes current.'; }
    else if (act === 'rem'){ const rm = s.items.splice(s.cur, 1)[0]; if (!s.items.length){ s.cur = -1; s.msg = 'remove(): list is empty, current = null.'; } else if (s.cur < s.items.length){ s.msg = 'remove() deletes ' + rm + '. Its successor ' + s.items[s.cur] + ' becomes current.'; } else { s.cur = 0; s.msg = 'remove() deletes the last element ' + rm + '. No successor, so current goes to the first element.'; } }
    else if (act === 'next'){ s.cur++; s.msg = 'findNext(): current moves one node forward.'; }
    else if (act === 'first'){ s.cur = 0; s.msg = 'findFirst(): current = head.'; }
  } else if (k === 'circq'){
    s.fresh = -1;
    if (act === 'enq' && s.size < s.max){ const v = 'ABCDEFGHJK'[s.next++ % 10]; const old = s.tail; s.a[s.tail] = v; s.tail = (s.tail + 1) % s.max; s.size++; s.fresh = old; s.msg = 'nodes[' + old + '] = ' + v + '; tail = (' + old + ' + 1) % ' + s.max + ' = ' + s.tail + '; size = ' + s.size + '.'; }
    else if (act === 'serve' && s.size){ const old = s.head, v = s.a[s.head]; s.a[s.head] = ''; s.head = (s.head + 1) % s.max; s.size--; s.msg = 'serve() returns ' + v + '; head = (' + old + ' + 1) % ' + s.max + ' = ' + s.head + '; size = ' + s.size + '.'; }
  }
  const el = $('#vz-' + k); if (el){ const tmp = document.createElement('div'); tmp.innerHTML = vzHTML(k); el.replaceWith(tmp.firstChild); }
}

/* ---------- header bar ---------- */
let lastCells = null;
function renderBar(){
  const vals = QCELLS.map(qcell), total = Math.round(vals.reduce((a, b) => a + b, 0) * 10) / 10;
  const all = vals.concat([total]);
  const ch = lastCells ? all.map((v, i) => v !== lastCells[i]) : all.map(() => false);
  lastCells = all;
  $('#bar').innerHTML = '<button class="brand" data-go="home" aria-label="Home"><b>' + esc(COURSE.brand) + '</b><small>' + esc(COURSE.sub) + '</small></button>' +
    '<div class="score" title="Readiness marks, not a prediction">' + QCELLS.map((c, i) => '<div class="' + (ch[i] ? 'wr' : '') + '">' + c.n + '<em>' + vals[i] + '<small>/' + c.max + '</small></em></div>').join('') +
    '<div class="' + (ch[4] ? 'wr' : '') + '">Total<em>' + total + '<small>/100</small></em></div></div>' +
    '<div class="tools"><span class="chipk" title="Days in a row you studied">' + S.streak.n + '-day streak</span><button class="iconbtn" data-act="theme" aria-label="Switch light or dark theme"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/></svg></button></div>';
}

/* ---------- the chain (map) ---------- */
let prevDone = null, chainAnimated = false;
function renderChain(){
  const done = {}; TOPICS.forEach(t => { done[t.id] = tstats(t).mastered; });
  const nxt = nextTopic();
  let h = '<div class="mini-tools"><span>chain of ' + TOPICS.length + ' topics</span><button class="sw" data-act="onlyleft" aria-pressed="' + S.onlyLeft + '"><i></i>only what is left</button></div><div class="headtag">head</div>';
  let k = 0;
  MODS.forEach(m => {
    const ms = modStats(m), closed = !!S.closed[m.id];
    h += '<section class="chap' + (closed ? ' closed' : '') + '"><button class="chap-h" data-act="togmod" data-id="' + m.id + '" aria-expanded="' + !closed + '"><h3>' + esc(m.name) + '</h3><small>' + ms.done + '/' + ms.n + '</small></button><p class="chap-s">' + esc(m.sub) + '</p><ul class="chain">';
    TOPICS.filter(t => t.mod === m.id).forEach(t => {
      const s = tstats(t), hide = S.onlyLeft && s.left <= 0 && s.mastered;
      const inkin = prevDone && !prevDone[t.id] && done[t.id];
      h += '<li style="--i:' + (k++ % 14) + (hide ? ';display:none' : '') + '"><a class="nd' + (s.mastered ? ' done' : '') + (nxt && nxt.id === t.id ? ' cur' : '') + (inkin ? ' inkin' : '') + '" href="#' + t.id + '" data-go="' + t.id + '"' + (cur === t.id ? ' aria-current="page"' : '') + '>' +
        (t.sr ? '<span class="sr">SR</span>' : '') + '<span class="t"><b>' + esc(t.title) + '</b><span>' + (s.mastered ? 'done' : s.left + ' left') + ' &middot; ' + t.time + (t.odds === 'high' ? '<span class="odds">HIGH</span>' : '') + '</span></span><span class="p"></span></a></li>';
    });
    h += '</ul><div class="boss"><a class="pill" href="#boss-' + m.id + '" data-go="boss-' + m.id + '">Pop quiz <em>10 Qs' + (S.best[m.id] != null ? ' &middot; best ' + S.best[m.id] : '') + '</em></a></div></section>';
  });
  h += '<div class="nulltag">null</div><div class="boss" style="margin-top:14px">' + ((COURSE.circleTopics || []).length ? '<a class="pill" href="#boss-exam" data-go="boss-exam">Exam-style circle-one block <em>6 Qs</em></a>' : '') + (COURSE.mock ? '<a class="pill" href="#mock" data-go="mock">Mock paper <em>' + COURSE.mock.minutes + ' min</em></a>' : '') + '</div>';
  prevDone = done;
  const host = $('#chainHost'), keep = $('#tree').scrollTop;
  host.innerHTML = h; $('#tree').scrollTop = keep;
  setTimeout(placeCursor, 40);
}
function placeCursor(){
  const c = $('#cursor'), inner = $('#treeInner'), nxt = nextTopic(); if (!nxt) { c.style.transform = 'translateY(-100px)'; return; }
  const a = $('#chainHost [data-go="' + nxt.id + '"]'); if (!a || !a.offsetParent) { c.style.transform = 'translateY(-100px)'; return; }
  const y = a.getBoundingClientRect().top - inner.getBoundingClientRect().top + 10;
  c.style.transform = 'translateY(' + Math.round(y) + 'px)';
}
function centerTree(){
  const tr = $('#tree'), a = tr.querySelector('[aria-current]');
  if (a && tr.scrollHeight > tr.clientHeight) tr.scrollTop = a.getBoundingClientRect().top - tr.getBoundingClientRect().top + tr.scrollTop - tr.clientHeight / 2;
}

/* ---------- desk (home) ---------- */
function daysTo(ymd){ const p = ymd.split('-').map(Number), t = new Date(p[0], p[1]-1, p[2]), n = new Date(); return Math.round((t - new Date(n.getFullYear(), n.getMonth(), n.getDate())) / 86400000); }
function countdown(label, ymd, when){ const d = daysTo(ymd); return '<span class="chipk">' + label + ' &middot; ' + when + ' &middot; <b style="color:var(--red)">' + (d > 1 ? 'in ' + d + ' days' : d === 1 ? 'tomorrow' : d === 0 ? 'today' : 'done') + '</b></span>'; }
function srStats(){ const n = SR_ORDER.length, done = SR_ORDER.filter(id => S.sr.cards[id]).length; return {n, done, min: SR_ORDER.reduce((a, id) => a + SR_MIN[id], 0)}; }
function hm(min){ return Math.floor(min / 60) + 'h ' + String(min % 60).padStart(2, '0') + 'm'; }
function renderDesk(){
  const nt = nextTopic(), sr = srStats(), left = totalLeft(), vals = QCELLS.map(qcell);
  const weak = []; TOPICS.forEach(t => { const s = tstats(t); if (s.qbad || s.dretry) weak.push({t, s}); });
  weak.sort((a, b) => (b.s.qbad + b.s.dretry) - (a.s.qbad + a.s.dretry));
  let h = '<div class="sheet-card"><div class="kicker">' + esc(COURSE.kicker) + '</div><h2>Choose your track</h2>' +
    '<p class="lede">' + COURSE.lede + '</p>' +
    '<div class="chips row" style="margin-top:12px">' + (COURSE.dates || []).map(d => countdown(d.label, d.ymd, d.when)).join('') + '</div>' +
    '<div class="tracks"><a class="track fast" href="#sr" data-go="sr"><div class="kicker" style="margin:0">Gray area? Start here</div><h3>Speedrun</h3><p>' + sr.n + ' cards, ordered by how often each idea appears in past papers. About ' + hm(sr.min) + ' (12 core + 4 bonus). Nothing important is left out: whatever it skips waits in the main track.</p>' +
    '<div class="bar2"><i style="width:' + Math.round(100 * sr.done / sr.n) + '%"></i></div><span class="mono small muted">' + sr.done + ' / ' + sr.n + ' cards</span><span class="go">' + (S.sr.done ? 'Lap complete. Review' : sr.done ? 'Resume card ' + (nextSrIndex() + 1) : 'Start the lap') + ' &rarr;</span></a>' +
    '<a class="track" href="#' + (nt ? nt.id : 'mock') + '" data-go="' + (nt ? nt.id : 'mock') + '"><div class="kicker" style="margin:0">Full coverage</div><h3>Main track</h3><p>All ' + TOPICS.length + ' topics: ideas, figures, quizzes and written answers. ' + (S.sr.done ? 'Speedrun is done, so this shows only what is left: <b>' + left + ' items</b>.' : 'Switch on "only what is left" after your speedrun.') + '</p>' +
    '<div class="bar2"><i style="width:' + Math.round(100 * (TOPICS.reduce((a, t) => a + tstats(t).p, 0) / TOPICS.length / 100)) + '%"></i></div><span class="mono small muted">' + left + ' items left in total</span><span class="go">' + (nt ? 'Continue: ' + esc(nt.title) : 'Take the mock paper') + ' &rarr;</span></a></div></div>';
  h += '<div class="grid2"><div class="sheet-card" style="margin:0"><div class="kicker">Where the marks are</div><h2>The four questions</h2><div class="marks">' +
    QCELLS.map((c, i) => '<div class="mk"><b>' + c.n + '</b><div class="nm">' + c.name + '<small>' + c.note + '</small><div class="bar2" style="margin-top:5px"><i style="width:' + Math.round(100 * vals[i] / c.max) + '%"></i></div></div><span class="v">' + vals[i] + '/' + c.max + '</span></div>').join('') + '</div></div>' +
    '<div class="sheet-card weak" style="margin:0"><div class="kicker">Redo these</div><h2>Weak spots</h2>' + (weak.length ? weak.slice(0, 6).map(w => '<a href="#' + w.t.id + '" data-go="' + w.t.id + '">' + esc(w.t.title) + '<br><span>' + (w.s.qbad ? w.s.qbad + ' missed' : '') + (w.s.qbad && w.s.dretry ? ' &middot; ' : '') + (w.s.dretry ? w.s.dretry + ' marked another pass' : '') + '</span></a>').join('') : '<p class="muted small">Nothing flagged yet. Missed answers and written questions you mark "another pass" will appear here.</p>') + '</div></div>' +
    '<div class="sheet-card" style="margin-top:16px"><div class="kicker">Rubber stamps</div><div class="stamps">' + stamps().map(b => '<span class="stamp' + (b.on ? ' on' : '') + '">' + esc(b.name) + '</span>').join('') + '</div></div>';
  return h;
}

/* ---------- topic page ---------- */
let cur = 'home', tab = 'learn';
const QP = {}, REV = {}, SHOWCOV = {};
function tableHTML(tb){
  return '<div class="tablewrap"><table class="t"><thead><tr>' + tb.head.map(c => '<th>' + c + '</th>').join('') + '</tr></thead><tbody>' +
    tb.rows.map(r => '<tr>' + r.map(c => { const p = String(c).split('|'); return '<td' + (p[1] === 'g' ? ' class="good"' : p[1] === 'b' ? ' class="badc"' : '') + '>' + p[0] + '</td>'; }).join('') + '</tr>').join('') + '</tbody></table></div>';
}
function pointsHTML(t, idxs, filter){
  const list = (idxs || (t.points || []).map((_, i) => i)); if (!list.length) return '';
  const unseen = list.filter(i => !S.seen[t.id + ':' + i]);
  const hideCov = filter && S.onlyLeft && !SHOWCOV[t.id] && unseen.length < list.length;
  const shown = hideCov ? unseen : list;
  let h = '<div class="sec">Key points</div>';
  if (hideCov) h += '<p class="muted small" style="margin:0 0 10px">' + (list.length - unseen.length) + ' covered in your speedrun are hidden. <button class="btn ghost" style="padding:3px 8px;font-size:11px" data-act="showcov" data-t="' + t.id + '">Show them</button></p>';
  if (!shown.length) return h + '<p class="muted small">All key points here are covered.</p>';
  return h + '<ol class="pts" style="list-style:none">' + shown.map(i => '<li' + (S.seen[t.id + ':' + i] ? ' class="seen"' : '') + '>' + t.points[i] + '</li>').join('') + '</ol>';
}
function learnBody(t, o){
  o = o || {}; const idxs = o.idxs || null;
  let h = '<div class="note"><p>' + t.idea + '</p></div>';
  if (t.fig) h += '<div class="sec">Picture it</div>' + figHTML(t.fig);
  h += pointsHTML(t, idxs, !o.sr);
  if (t.table) h += '<div class="sec">Cheat table</div>' + tableHTML(t.table);
  if (t.viz) h += '<div class="sec">Try it</div>' + vzHTML(t.viz);
  if (t.code) h += '<div class="sec">Code to know</div>' + cbox(t.code, t.codeLang);
  if (t.traps && t.traps.length) h += '<div class="callout"><h4>Exam traps</h4><ul>' + t.traps.map(x => '<li>' + x + '</li>').join('') + '</ul></div>';
  return h;
}
function learnHTML(t){
  const i = TOPICS.indexOf(t), nx = TOPICS[i + 1];
  return learnBody(t) + '<div class="cta-row"><button class="btn red" data-act="readgo">' + (tstats(t).seen >= tstats(t).pn ? 'Go to the quiz' : 'Got it. Quiz me') + '</button>' +
    (t.drills.length ? '<button class="btn ghost" data-act="tab" data-tab="drills">Skip to written answers</button>' : '') +
    (nx ? '<a class="btn ghost" href="#' + nx.id + '" data-go="' + nx.id + '">Next: ' + esc(nx.title) + '</a>' : '') + '</div>';
}

/* quiz */
const PEN_D = {strike:'M2,22 C30,16 70,26 98,18', circle:'M5,22 C4,6 38,2 62,3 C93,5 99,18 95,28 C89,41 40,42 12,35 C1,32 1,17 11,10'};
function penPath(kind){
  return '<svg class="pen' + (kind === 'strike' ? ' strike' : ' LATE') + '" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" data-k="' + kind + '"/></svg>';
}
function fitPens(root){
  (root || document).querySelectorAll('svg.pen').forEach(svg => {
    const r = svg.getBoundingClientRect(), w = Math.max(10, r.width), h = Math.max(10, r.height), p = svg.firstElementChild;
    svg.setAttribute('viewBox', '0 0 ' + w.toFixed(1) + ' ' + h.toFixed(1));
    p.setAttribute('d', PEN_D[p.dataset.k].replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, x, y) => (x * w / 100).toFixed(1) + ',' + (y * h / 40).toFixed(1)));
  });
}
function quizHTML(t, ctx, idxs){
  const list = idxs || t.quiz.map((_, i) => i), key = t.id + '|' + ctx, qa = S.quiz[t.id] || {};
  let pos = QP[key]; if (pos == null) { pos = 0; while (pos < list.length && qa[list[pos]]) pos++; QP[key] = pos; }
  const dots = '<div class="qprog">' + list.map((qi, k) => '<i class="' + (k === pos ? 'cur ' : '') + (qa[qi] ? (qa[qi].ok ? 'ok' : 'no') : '') + '"></i>').join('') + '</div>';
  const data = 'id="qz-' + t.id + '-' + ctx + '" data-t="' + t.id + '" data-ctx="' + ctx + '"';
  if (pos >= list.length) {
    const ok = list.filter(qi => qa[qi] && qa[qi].ok).length;
    return '<div class="qwrap" ' + data + '>' + dots + '<div class="scorebig"><div class="big">' + ok + '/' + list.length + '</div><p>' + (ok === list.length ? 'Full marks on this set.' : ok >= list.length - 1 ? 'One slip. Read its note again.' : 'Review the idea, then retake.') + '</p></div>' +
      '<div class="qnav" style="justify-content:center"><button class="btn ghost" data-act="retake" data-t="' + t.id + '" data-ctx="' + ctx + '">Retake</button>' + (ctx === 'main' && t.drills.length ? '<button class="btn red" data-act="tab" data-tab="drills">Written answers</button>' : '') + '</div></div>';
  }
  const qi = list[pos], q = t.quiz[qi], a = qa[qi];
  let h = '<div class="qwrap" ' + data + '>' + dots + '<div class="qn">Question ' + (pos + 1) + ' of ' + list.length + '</div><div class="q">' + q.q + '</div><div class="opts">';
  q.o.forEach((o, k) => {
    let extra = '', cls = 'opt';
    if (a) {
      if (k === q.a) extra = penPath('circle').replace('LATE', a.ok ? '' : 'late') + '<span class="tick">&#10003;</span>';
      else if (k === a.pick) { extra = penPath('strike'); cls += ' no'; }
    }
    h += '<button class="' + cls + '" data-act="pick" data-t="' + t.id + '" data-ctx="' + ctx + '" data-qi="' + qi + '" data-i="' + k + '"' + (a ? ' disabled' : '') + '><span class="l">' + LETTERS[k] + '</span><span class="tx">' + o + '</span>' + extra + '</button>';
  });
  h += '</div>';
  if (a) h += '<div class="why ' + (a.ok ? '' : 'no') + '"><b class="v">' + (a.ok ? 'Correct. +1 mark' : 'Not quite. The answer is ' + LETTERS[q.a]) + '</b>' + q.w + '</div>';
  h += '<div class="qnav"><button class="btn ghost" data-act="qnav" data-t="' + t.id + '" data-ctx="' + ctx + '" data-d="-1"' + (pos === 0 ? ' disabled' : '') + '>Back</button><button class="btn" data-act="qnav" data-t="' + t.id + '" data-ctx="' + ctx + '" data-d="1"' + (a ? '' : ' disabled') + '>' + (pos === list.length - 1 ? 'See score' : 'Next') + '</button></div></div>';
  return h;
}

/* written answers */
function drillCard(d, exam){
  const r = REV[d.id] || {}, v = S.drill[d.id], all = exam && r.all;
  let h = '<div class="drill" id="dr-' + d.id + '"><div class="drill-h"><h3>' + esc(d.title) + '</h3>' + (d.real ? '<span class="tag hot">real paper</span>' : '') + '<span class="tag">' + esc(d.src) + '</span><span class="tag">' + d.time + '</span>' +
    (v === 'got' ? '<span class="tag ok">nailed</span>' : v === 'retry' ? '<span class="tag retry">another pass</span>' : '') + '</div><div class="drill-b"><div class="q">' + d.q + '</div>';
  if (exam && !all) h += '<div class="reveal"><button class="rbtn" data-act="exreveal" data-id="' + d.id + '">Check my answer</button></div>';
  else {
    if (!exam) h += '<div class="reveal"><button class="rbtn" data-act="rev" data-id="' + d.id + '" data-k="idea" aria-pressed="' + !!r.idea + '"><i>1</i>What is it testing?</button>' +
      '<button class="rbtn" data-act="rev" data-id="' + d.id + '" data-k="steps" aria-pressed="' + !!r.steps + '"><i>2</i>How to attack it</button>' +
      '<button class="rbtn" data-act="rev" data-id="' + d.id + '" data-k="sol" aria-pressed="' + !!r.sol + '"><i>3</i>Model answer</button></div>';
    if (exam || r.idea) h += '<div class="panel"><h4>The idea</h4>' + d.idea + '</div>';
    if (exam || r.steps) h += '<div class="panel"><h4>Best answering procedure</h4><ol class="steps">' + d.steps.map(s => '<li>' + s + '</li>').join('') + '</ol></div>';
    if (exam || r.sol) {
      h += '<div class="panel"><h4>Model answer, as it would look on the answer sheet</h4>' + sheetBox(d.sol, d.lang) +
        (d.traps && d.traps.length ? '<div class="callout"><h4>Watch out</h4><ul>' + d.traps.map(x => '<li>' + x + '</li>').join('') + '</ul></div>' : '') + '</div>' +
        '<div class="rate"><button class="btn red" data-act="rate" data-id="' + d.id + '" data-v="got">I would have got this</button><button class="btn ghost" data-act="rate" data-id="' + d.id + '" data-v="retry">Need another pass</button></div>';
    }
  }
  return h + '</div></div>';
}
function drillsHTML(t){
  if (!t.drills.length) return '<div class="note"><p class="muted">No long written question for this topic. The quiz covers it.</p></div>';
  const list = t.drills.filter(d => !(S.onlyLeft && S.drill[d.id] === 'got'));
  return '<p class="muted small" style="margin:0 0 14px">Write the answer on paper first, like in the exam. Then open the three hints in order: what it tests, how to attack it, the model answer.</p>' + (list.length ? list.map(d => drillCard(d, false)).join('') : '<div class="note"><p>All written answers here are done. Nice.</p></div>');
}
function pageHead(t, label){
  const m = modOf(t.mod), s = tstats(t);
  return '<div class="qline"><span>' + esc(label) + '</span><i></i><b>' + esc(m.name) + '</b></div><h1>' + esc(t.title) + '</h1><div class="meta"><span class="tag ' + (t.odds === 'high' ? 'hot' : '') + '">' + ODDS[t.odds] + ' odds</span><span class="tag">' + t.time + '</span>' +
    (t.seen ? '<span class="tag">seen: ' + esc(t.seen) + '</span>' : '') + (t.sr ? '<span class="tag hot">in speedrun</span>' : '') + (s.mastered ? '<span class="tag ok">done</span>' : '<span class="tag">' + s.left + ' left</span>') + '</div>';
}
function renderTopic(t){
  const i = TOPICS.indexOf(t), s = tstats(t);
  const tb = (k, label, extra) => '<button class="tab" role="tab" data-act="tab" data-tab="' + k + '" aria-selected="' + (tab === k) + '">' + label + (extra ? '<small>' + extra + '</small>' : '') + '</button>';
  const body = tab === 'quiz' ? quizHTML(t, 'main', null) : tab === 'drills' ? drillsHTML(t) : learnHTML(t);
  return '<a class="back" href="#home" data-go="home">&larr; back to the chain</a><div class="paper">' + pageHead(t, 'Topic ' + (i + 1)) +
    '<div class="tabs" role="tablist">' + tb('learn', 'A. Learn') + tb('quiz', 'B. Circle the answer', s.qok + '/' + s.qn) + tb('drills', 'C. Write it', s.dn ? s.dgot + '/' + s.dn : '') + '</div><div id="tabbody">' + body + '</div></div>';
}

/* ---------- speedrun ---------- */
function nextSrIndex(){ const i = SR_ORDER.findIndex(id => !S.sr.cards[id]); return i < 0 ? SR_ORDER.length - 1 : i; }
function lapHTML(idx){
  const n = SR_ORDER.length, pct = n > 1 ? 100 * idx / (n - 1) : 0;
  return '<div class="lap"><div class="lap-line"></div><div class="lap-fill" style="width:calc((100% - 24px)*' + (pct / 100).toFixed(3) + ')"></div><div class="dots">' +
    SR_ORDER.map((id, i) => '<button class="dot' + (S.sr.cards[id] ? ' done' : '') + (i === idx ? ' cur' : '') + (i >= SR_CORE ? ' bonus' : '') + '" data-act="srjump" data-i="' + i + '" title="' + esc(byId(id).title) + '" aria-label="Card ' + (i + 1) + '">' + (S.sr.cards[id] ? '&#10003;' : i + 1) + '</button>').join('') + '</div></div>';
}
function fmtT(sec){ return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'); }
function renderSpeedrun(){
  if (S.sr.done && cur === 'srdone') return renderSrDone();
  const idx = Math.max(0, Math.min(SR_ORDER.length - 1, S.sr.i)), id = SR_ORDER[idx], t = byId(id), c = t.sr;
  const bonus = idx >= SR_CORE;
  let h = '<a class="back" href="#home" data-go="home">&larr; back to the chain</a><div class="paper">' +
    '<div class="qline"><span>Speedrun &middot; card ' + (idx + 1) + ' of ' + SR_ORDER.length + '</span><i></i><b>' + (bonus ? 'bonus lap' : 'core') + '</b></div>' + lapHTML(idx) +
    '<h1>' + esc(t.title) + '</h1><div class="meta"><span class="tag hot">' + esc(SR_WHY[id]) + '</span><span class="tag">about ' + SR_MIN[id] + ' min</span>' + (t.seen ? '<span class="tag">seen: ' + esc(t.seen) + '</span>' : '') + '</div>' +
    '<div class="lapinfo"><span>Lap time <b id="srclock">' + fmtT(S.sr.t) + '</b></span><span>Saved automatically on this device</span></div>';
  h += '<div class="sec">1. The idea and the must-know points</div>' + learnBody(t, {idxs: c.p, sr: true});
  if (c.q.length) h += '<div class="sec">2. Quick check</div>' + quizHTML(t, 'sr', c.q);
  if (c.d.length) h += '<div class="sec">3. Written answer' + (c.d.length > 1 ? 's' : '') + '</div>' + c.d.map(did => { const d = t.drills.find(x => x.id === did); return d ? drillCard(d, false) : ''; }).join('');
  h += '<div class="cta-row"><button class="btn ghost" data-act="srprev"' + (idx === 0 ? ' disabled' : '') + '>Previous card</button><button class="btn red" data-act="srnext">' + (idx === SR_ORDER.length - 1 ? 'Finish the lap' : 'Card done. Next') + ' &rarr;</button></div></div>';
  return h;
}
function srFinishCard(id){
  const t = byId(id); S.sr.cards[id] = 1;
  (t.sr.p || []).forEach(i => { S.seen[id + ':' + i] = 1; });
  save();
}
function renderSrDone(){
  const left = totalLeft(), tl = TOPICS.map(t => ({t, s: tstats(t)}));
  const lp = tl.reduce((a, x) => a + (x.s.pn - x.s.seen), 0), lq = tl.reduce((a, x) => a + (x.s.qn - x.s.qdone), 0), ld = tl.reduce((a, x) => a + (x.s.dn - x.s.dgot - x.s.dretry), 0);
  const nT = tl.filter(x => x.s.left > 0).length;
  return '<a class="back" href="#home" data-go="home">&larr; back to the chain</a><div class="paper"><div class="qline"><span>Speedrun</span><i></i><b>lap time ' + fmtT(S.sr.t) + '</b></div>' +
    '<div class="bigstamp">SPEEDRUN COMPLETE</div><h1>You covered the high-frequency core.</h1>' +
    '<p>Every point, quiz question and written answer you saw is saved. Here is exactly what the main track still holds for you, and nothing that you already did:</p>' +
    '<div class="left-grid"><div><b>' + lp + '</b><span>key points</span></div><div><b>' + lq + '</b><span>quiz questions</span></div><div><b>' + ld + '</b><span>written answers</span></div><div><b>' + nT + '</b><span>topics touched</span></div></div>' +
    '<p class="muted">Time left? Continue below. The main track will hide what you covered and show only the rest, in the same order.</p>' +
    '<div class="cta-row"><button class="btn red" data-act="srcontinue">Continue main track: only what is left (' + left + ')</button><a class="btn ghost" href="#mock" data-go="mock">Take a mock paper first</a><button class="btn ghost" data-act="srjump" data-i="0">Review the speedrun</button></div></div>';
}

/* ---------- pop quiz ---------- */
let B = null;
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
function startBoss(modId){
  let topics, N = 10;
  if (modId === 'all') topics = TOPICS.filter(t => !(modOf(t.mod) || {}).noBoss);
  else if (modId === 'exam') { topics = (COURSE.circleTopics || []).map(byId).filter(Boolean); N = 6; }
  else topics = TOPICS.filter(t => t.mod === modId);
  let pool = []; topics.forEach(t => t.quiz.forEach(q => pool.push({q, tid: t.id})));
  pool = shuffle(pool).slice(0, N).map(x => { const none = /^None/.test(String(x.q.o[x.q.o.length - 1]).replace(/<[^>]+>/g, '')); const lastI = none ? x.q.o.length - 1 : -1;
    const perm = shuffle(x.q.o.map((_, i) => i).filter(i => i !== lastI)); if (none) perm.push(lastI);
    return {text: x.q.q, w: x.q.w, o: perm.map(i => x.q.o[i]), a: perm.indexOf(x.q.a), tid: x.tid, pick: null}; });
  B = {mod: modId, qs: pool, i: 0, t0: Date.now(), done: false};
}
function bossHTML(){
  const label = B.mod === 'all' ? 'Final pop quiz: everything' : B.mod === 'exam' ? 'Exam-style circle-one block' : 'Pop quiz: ' + modOf(B.mod).name;
  let h = '<a class="back" href="#home" data-go="home">&larr; back to the chain</a><div class="paper"><div class="qline"><span>' + esc(label) + '</span><i></i><b>shuffled</b></div><h1>' + esc(label) + '</h1>';
  if (B.done) {
    const score = B.qs.filter(q => q.pick === q.a).length, miss = [...new Set(B.qs.filter(q => q.pick !== q.a).map(q => q.tid))], secs = Math.round((B.end - B.t0) / 1000);
    return h + '<div class="scorebig"><div class="big">' + score + '/' + B.qs.length + '</div><p>' + (score >= B.qs.length * .8 ? 'Passed with marks to spare.' : score >= B.qs.length * .5 ? 'Decent. Hit the topics below and go again.' : 'Not yet. Study the topics below, then retry.') + ' Time ' + fmtT(secs) + '.</p></div>' +
      (miss.length ? '<div class="sec">Review these</div><div class="weak">' + miss.map(id => '<a href="#' + id + '" data-go="' + id + '">' + esc(byId(id).title) + '</a>').join('') + '</div>' : '') +
      '<div class="cta-row" style="justify-content:center"><button class="btn red" data-act="bstart" data-mod="' + B.mod + '">Go again</button><button class="btn ghost" data-go="home">Back to the chain</button></div></div>';
  }
  const q = B.qs[B.i], ans = q.pick != null;
  h += '<div class="qwrap"><div class="qprog">' + B.qs.map((x, k) => '<i class="' + (k === B.i ? 'cur ' : '') + (x.pick != null ? (x.pick === x.a ? 'ok' : 'no') : '') + '"></i>').join('') + '</div><div class="qn">' + esc(byId(q.tid).title) + '</div><div class="q">' + q.text + '</div><div class="opts">';
  q.o.forEach((o, k) => {
    let extra = '', cls = 'opt';
    if (ans) { if (k === q.a) extra = penPath('circle').replace('LATE', q.pick === q.a ? '' : 'late') + '<span class="tick">&#10003;</span>'; else if (k === q.pick) { extra = penPath('strike'); cls += ' no'; } }
    h += '<button class="' + cls + '" data-act="bpick" data-i="' + k + '"' + (ans ? ' disabled' : '') + '><span class="l">' + LETTERS[k] + '</span><span class="tx">' + o + '</span>' + extra + '</button>';
  });
  h += '</div>' + (ans ? '<div class="why ' + (q.pick === q.a ? '' : 'no') + '"><b class="v">' + (q.pick === q.a ? 'Correct' : 'Not quite. The answer is ' + LETTERS[q.a]) + '</b>' + q.w + '</div>' : '') +
    '<div class="qnav"><span class="muted small mono">Question ' + (B.i + 1) + ' of ' + B.qs.length + '</span><button class="btn" data-act="bnext"' + (ans ? '' : ' disabled') + '>' + (B.i === B.qs.length - 1 ? 'Finish' : 'Next') + '</button></div></div></div>';
  return h;
}

/* ---------- mock paper ---------- */
let M = null, timerId = null;
function pickReal(buckets){
  let pool = []; TOPICS.forEach(t => t.drills.forEach(d => { if (d.real && buckets.indexOf(d.bucket) >= 0) pool.push(d); }));
  if (!pool.length) TOPICS.forEach(t => t.drills.forEach(d => { if (buckets.indexOf(d.bucket) >= 0) pool.push(d); }));
  return pool[Math.floor(Math.random() * pool.length)];
}
function newMock(){
  const parts = COURSE.mock.parts;
  M = {qs: parts.map(p => p.kind === 'mcq' ? null : pickReal(p.buckets)), left: COURSE.mock.minutes * 60, run: false};
  M.qs.forEach(d => { if (d) REV[d.id] = {}; }); clearInterval(timerId); timerId = null;
}
function mockHTML(){
  const names = COURSE.mock.parts.map(p => p.label);
  let h = '<a class="back" href="#home" data-go="home">&larr; back to the chain</a><div class="paper"><div class="qline"><span>Mock paper</span><i></i><b>exam-shaped questions</b></div><div class="row" style="justify-content:space-between"><h1>Mock paper</h1><span class="timer" id="timer">' + fmtT(M.left) + '</span></div>' +
    '<p class="muted">Questions in the exam shape (real past-paper questions where available). Write on paper. Press "Check my answer" only when you are done with that question.</p><div class="row" style="margin-bottom:10px">' + (M.run ? '' : '<button class="btn red" data-act="mockstart">Start the clock</button>') + '<button class="btn ghost" data-act="mockreroll">New paper</button></div>';
  M.qs.forEach((d, i) => { h += '<div class="sec">' + names[i] + '</div>' + (d ? drillCard(d, true) : '<div class="note"><p>A block of circle-one questions.</p><div class="cta-row" style="margin-top:10px"><a class="btn red" href="#boss-exam" data-go="boss-exam">Start the circle-one block</a></div></div>'); });
  return h + '</div>';
}
function tick(){ if (!M || !M.run) return; M.left = Math.max(0, M.left - 1); const el = $('#timer'); if (el) { el.textContent = fmtT(M.left); el.classList.toggle('low', M.left < 600); } if (M.left === 0) { clearInterval(timerId); toast('Time is up'); } }

/* ---------- routing / render ---------- */
let lastCur = null, srTick = null;
function render(){
  document.body.classList.toggle('on-topic', cur !== 'home');
  renderBar(); renderChain();
  const main = $('#main'); let t;
  if (cur === 'home') { main.innerHTML = renderDesk(); document.title = COURSE.title; }
  else if (cur === 'sr' || cur === 'srdone') { main.innerHTML = renderSpeedrun(); document.title = 'Speedrun · ' + COURSE.brand; }
  else if (cur === 'mock') { if (!M) newMock(); main.innerHTML = mockHTML(); }
  else if (cur.indexOf('boss-') === 0) { if (!B || B.mod !== cur.slice(5)) startBoss(cur.slice(5)); main.innerHTML = bossHTML(); }
  else if ((t = byId(cur))) { main.innerHTML = renderTopic(t); document.title = t.title + ' · ' + COURSE.brand; }
  else { cur = 'home'; render(); return; }
  clearInterval(srTick);
  if (cur === 'sr') srTick = setInterval(() => { S.sr.t++; const el = $('#srclock'); if (el) el.textContent = fmtT(S.sr.t); if (S.sr.t % 15 === 0) save(); }, 1000);
  fitPens();
  if (cur !== lastCur) { lastCur = cur; centerTree(); }
}
function go(r, keepTab){
  if (r.indexOf('boss-') === 0 && cur !== r) B = null;
  if (r === 'sr' && S.sr.done && cur !== 'srdone') { /* review mode keeps done page available via srjump */ }
  cur = r; if (!keepTab) tab = 'learn';
  try { history.replaceState(null, '', '#' + r); } catch(e) {}
  render(); window.scrollTo(0, 0);
}
function refreshTab(){ const t = byId(cur); if (!t) return; const y = window.scrollY; $('#main').innerHTML = renderTopic(t); renderChain(); renderBar(); window.scrollTo(0, y); }
function refreshSr(){ const y = window.scrollY; $('#main').innerHTML = renderSpeedrun(); renderChain(); renderBar(); window.scrollTo(0, y); }
function refreshQuiz(tid, ctx){
  const t = byId(tid), el = document.getElementById('qz-' + tid + '-' + ctx); if (!el) return;
  const tmp = document.createElement('div'); tmp.innerHTML = quizHTML(t, ctx, ctx === 'sr' ? t.sr.q : null); const nw = tmp.firstChild; el.replaceWith(nw); fitPens(nw);
  renderBar(); renderChain();
}
function refreshDrill(id){
  const el = document.getElementById('dr-' + id); if (!el) return; let d = null; TOPICS.forEach(t => t.drills.forEach(x => { if (x.id === id) d = x; }));
  const tmp = document.createElement('div'); tmp.innerHTML = drillCard(d, cur === 'mock'); el.replaceWith(tmp.firstChild);
}

/* ---------- events ---------- */
document.addEventListener('click', e => {
  const vz = e.target.closest('[data-viz-do]');
  if (vz) { const host = vz.closest('[data-viz]'); vzDo(host.dataset.viz, vz.dataset.vizDo); return; }
  const el = e.target.closest('[data-go],[data-act]'); if (!el) return;
  if (el.dataset.go && !el.dataset.act) { e.preventDefault(); go(el.dataset.go); return; }
  const act = el.dataset.act, t = byId(el.dataset.t || cur);
  if (act === 'theme') {
    const root = document.documentElement, dark = root.dataset.theme === 'dark' || (!root.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
    root.dataset.theme = dark ? 'light' : 'dark'; try { localStorage.setItem(THEME_KEY, root.dataset.theme); } catch(x) {}
  } else if (act === 'togmod') { S.closed[el.dataset.id] = !S.closed[el.dataset.id]; save(); renderChain(); }
  else if (act === 'onlyleft') { S.onlyLeft = !S.onlyLeft; save(); renderChain(); if (byId(cur)) refreshTab(); else if (cur === 'home') $('#main').innerHTML = renderDesk(); }
  else if (act === 'showcov') { SHOWCOV[el.dataset.t] = true; refreshTab(); }
  else if (act === 'tab') { tab = el.dataset.tab; refreshTab(); }
  else if (act === 'readgo') { (t.points || []).forEach((_, i) => { S.seen[t.id + ':' + i] = 1; }); save(); tab = 'quiz'; checkStamps(); refreshTab(); window.scrollTo(0, 0); }
  else if (act === 'pick') {
    const qi = +el.dataset.qi, q = t.quiz[qi], k = +el.dataset.i; S.quiz[t.id] = S.quiz[t.id] || {};
    if (S.quiz[t.id][qi]) return; const ok = k === q.a; S.quiz[t.id][qi] = {ok, pick: k};
    if (ok && !S.qxp[t.id + '_' + qi]) { S.qxp[t.id + '_' + qi] = 1; toast('+1 mark'); }
    save(); checkStamps(); refreshQuiz(t.id, el.dataset.ctx);
  } else if (act === 'qnav') {
    const ctx = el.dataset.ctx, list = ctx === 'sr' ? t.sr.q : t.quiz.map((_, i) => i), key = t.id + '|' + ctx;
    QP[key] = Math.max(0, Math.min(list.length, QP[key] + (+el.dataset.d))); refreshQuiz(t.id, ctx);
  } else if (act === 'retake') { const ctx = el.dataset.ctx, list = ctx === 'sr' ? t.sr.q : t.quiz.map((_, i) => i); list.forEach(i => { if (S.quiz[t.id]) delete S.quiz[t.id][i]; }); QP[t.id + '|' + ctx] = 0; save(); refreshQuiz(t.id, ctx); }
  else if (act === 'rev') { REV[el.dataset.id] = REV[el.dataset.id] || {}; REV[el.dataset.id][el.dataset.k] = !REV[el.dataset.id][el.dataset.k]; refreshDrill(el.dataset.id); }
  else if (act === 'exreveal') { REV[el.dataset.id] = {all: true}; refreshDrill(el.dataset.id); }
  else if (act === 'rate') {
    const id = el.dataset.id, v = el.dataset.v; S.drill[id] = v;
    if (v === 'got' && !S.dxp[id]) { S.dxp[id] = 1; toast('+5 marks'); } else toast(v === 'got' ? 'Marked as nailed' : 'Flagged for another pass');
    save(); checkStamps(); refreshDrill(id); renderBar(); renderChain();
  } else if (act === 'bstart') { startBoss(el.dataset.mod); render(); window.scrollTo(0, 0); }
  else if (act === 'bpick') { const q = B.qs[B.i]; if (q.pick != null) return; q.pick = +el.dataset.i; $('#main').innerHTML = bossHTML(); fitPens(); }
  else if (act === 'bnext') {
    if (B.i < B.qs.length - 1) B.i++;
    else { B.done = true; B.end = Date.now(); const score = B.qs.filter(q => q.pick === q.a).length, prev = S.best[B.mod] || 0; if (score > prev) { S.best[B.mod] = score; save(); } checkStamps(); }
    $('#main').innerHTML = bossHTML(); renderChain(); window.scrollTo(0, 0);
  }
  else if (act === 'mockstart') { M.run = true; clearInterval(timerId); timerId = setInterval(tick, 1000); $('#main').innerHTML = mockHTML(); }
  else if (act === 'mockreroll') { newMock(); $('#main').innerHTML = mockHTML(); window.scrollTo(0, 0); }
  else if (act === 'srnext') {
    const id = SR_ORDER[S.sr.i]; srFinishCard(id);
    if (SR_ORDER.every(x => S.sr.cards[x])) { S.sr.done = true; save(); checkStamps(); cur = 'srdone'; try { history.replaceState(null, '', '#sr'); } catch(x) {} render(); window.scrollTo(0, 0); return; }
    let n = S.sr.i + 1; if (n >= SR_ORDER.length || false) n = SR_ORDER.findIndex(x => !S.sr.cards[x]); S.sr.i = n; save(); QP[SR_ORDER[n] + '|sr'] = undefined; refreshSr(); window.scrollTo(0, 0);
  }
  else if (act === 'srprev') { S.sr.i = Math.max(0, S.sr.i - 1); save(); refreshSr(); window.scrollTo(0, 0); }
  else if (act === 'srjump') { S.sr.i = +el.dataset.i; save(); if (cur !== 'sr') { cur = 'sr'; try { history.replaceState(null, '', '#sr'); } catch(x) {} render(); } else refreshSr(); window.scrollTo(0, 0); }
  else if (act === 'srcontinue') { S.onlyLeft = true; save(); const nt = TOPICS.find(x => tstats(x).left > 0); go(nt ? nt.id : 'home'); }
});
document.addEventListener('input', e => { if (e.target.id === 'vz-pf-in' && VZ.postfix) { VZ.postfix.text = e.target.value; VZ.postfix.pos = 0; VZ.postfix.st = []; } });
window.addEventListener('hashchange', () => { const r = location.hash.slice(1) || 'home'; if (r !== cur && (byId(r) || ['home','sr','mock'].includes(r) || r.indexOf('boss-') === 0)) { if (r.indexOf('boss-') === 0) B = null; cur = r; tab = 'learn'; render(); } });
window.addEventListener('resize', () => setTimeout(() => { placeCursor(); fitPens(); }, 100));

/* ---------- boot ---------- */
try { const th = localStorage.getItem(THEME_KEY); if (th === 'dark' || th === 'light') document.documentElement.dataset.theme = th; } catch(e) {}
touchStreak(); save();
const h0 = location.hash.slice(1);
if (h0 && (byId(h0) || ['sr','mock'].includes(h0) || h0.indexOf('boss-') === 0)) cur = h0;
S.sr.i = Math.min(S.sr.i, SR_ORDER.length - 1);
if (cur === 'sr' && S.sr.done && S.sr.i === 0 && SR_ORDER.every(x => S.sr.cards[x]) && false) cur = 'srdone';
render(); checkStamps();
})();
</script>
