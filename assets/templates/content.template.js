/* content/00-modules-and-topics.js
   First content file: defines MODS and TOPICS, then pushes topics. Later files (10-..., 20-...) only push more topics.
   The LAST file (90-speedrun.js) defines the speedrun (see the bottom of this file for its shape).
   Rules: strings are template literals (backticks). Never write a backtick or ${ inside content. HTML is allowed in
   idea / points / q / o / w / traps / steps (use <code>, <b>, <u>, &lt; &gt; &amp;). Code in `code` and `sol` is RAW text. */

const MODS = [                                   // chapters of the chain, in study order
  {id:'m1', name:'Chapter one', sub:'one line saying what it covers'},
  {id:'past', name:'Past-paper patterns', sub:'The real questions, newest first', noBoss:false}   // noBoss:true hides its pop quiz
];
const TOPICS = [];

TOPICS.push({
id:'t1',                 // short unique id, used in config and the speedrun
mod:'m1',                // one of MODS ids
title:'Topic title',     // as a student would say it
odds:'high',             // 'high' | 'med' | 'low': how likely it is in the exam (from past-paper frequency)
time:'12 min',           // honest reading time
seen:'Sp26 · Fa25',      // OPTIONAL: past exams where it appeared
idea:`The whole topic in two or three sentences. This is the "note" box at the top of the page.`,
points:[                 // key points, each 1 to 3 sentences. Index matters: the speedrun refers to them by position.
 `<b>Rule or fact.</b> Explanation with <code>inline code</code>.`,
 `Second point.`
],
fig:[                    // OPTIONAL figures drawn as nodes and pointers. Kinds: chain, dll, array, stack, stacks, steps
 {kind:'chain', cap:'caption', nodes:['A','B','C'], head:0, cur:1, tags:{2:'tail'}, fresh:[]},
 {kind:'array', cap:'caption', cells:['5','8','7','',''], cur:1, tags:{0:'head'}, fresh:[], moved:[]},
 {kind:'stack', cap:'caption', items:['A','B','C'], next:['A','B','C','D']},          // bottom to top, before and after
 {kind:'stacks', cap:'caption', steps:[{t:'7', s:['7']}, {t:'2', s:['7','2']}]},     // one small stack per step
 {kind:'steps', cap:'caption', steps:['first move','second move']}                   // numbered moves
],
table:{head:['Operation','A','B'], rows:[['op1','O(1)|g','O(n)|b']]},   // OPTIONAL. suffix |g green, |b red
viz:'llins',             // OPTIONAL visualizer id: qcycle | postfix | llins | circq (or one you add to the engine)
codeLang:'text',         // OPTIONAL: 'text' turns off Java-style highlighting
code:`// code or formulas worth memorising (RAW text, shown in a numbered exam-style box)`,
traps:[                  // "Exam traps": mistakes that cost marks
 `The classic mistake and why it is wrong.`
],
quiz:[                   // 3 to 6 questions. o = options, a = index of the right one, w = why (always explain)
 {q:`Question text?`, o:[`Option one`,`Option two`,`Option three`,`Option four`], a:1, w:`Why option two is right and the common wrong pick fails.`}
 // Put "None of the above" LAST in o: the engine keeps it last when it shuffles.
],
drills:[                 // written / long-form exam questions
 {id:'t1d1',            // unique across the whole site
  real:true,            // true only if it is a REAL past-paper question; the mock paper prefers these
  src:'Spring 2026 · Q2 (25)',   // where it comes from
  bucket:'bucketA',     // groups drills for the mock paper (matches COURSE.mock.parts[].buckets)
  time:'10 min', title:'Short name',
  q:`The question exactly as the exam words it (HTML allowed, <pre class="code"> for code).`,
  idea:`What the question is really testing (1 to 3 sentences).`,
  steps:[`Step 1 of the best answering procedure.`,`Step 2.`],       // 3 to 6 steps: the method, not the answer
  lang:'text',          // OPTIONAL: 'text' for traces and tables, omit for Java-like code
  sol:`model answer as it would look on the answer sheet`,           // RAW text, verified (see references/05-quality.md)
  traps:[`What loses marks here.`]}
]});

/* ---------- content/90-speedrun.js (last file) ----------
const SR_ORDER = ['t1','t3'];                  // topic ids in exam-frequency order; ~12 core + 3 to 5 bonus
const SR_CORE = 12;                            // cards before this index are "core", the rest "bonus lap"
const SR_MIN  = {t1:9, t3:12};                 // honest minutes per card
const SR_WHY  = {t1:'Question 1 in every paper', t3:'Question 2 in every paper'};
const SR = {                                   // per card: key-point indexes, quiz indexes, written-question ids
  t1:{p:[0,1], q:[0,1,2], d:['t1d1']},
  t3:{p:[0,1,2], q:[0,1], d:[]}
};
TOPICS.forEach(t => { t.sr = SR[t.id] || null; });
const VIZ_MAP = {t1:'llins'};                  // OPTIONAL: attach visualizers by topic id
TOPICS.forEach(t => { if (!t.viz && VIZ_MAP[t.id]) t.viz = VIZ_MAP[t.id]; });
*/
