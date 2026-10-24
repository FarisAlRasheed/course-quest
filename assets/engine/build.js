#!/usr/bin/env node
/* Course Quest builder.
   Usage:  node build.js <project-dir>
   <project-dir> must contain:  course.config.js   (defines const COURSE = {...})
                                content/*.js       (sorted by file name; first file defines MODS and TOPICS)
   Output: <project-dir>/dist/index.html  (single file, ready to publish as an Artifact)
   Also runs the content validator and a JavaScript syntax check. Exit code 1 on any error. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.resolve(process.argv[2] || '.');
const engine = __dirname;
const read = p => fs.readFileSync(p, 'utf8');

const configText = read(path.join(root, 'course.config.js'));
const cdir = path.join(root, 'content');
const files = fs.readdirSync(cdir).filter(f => f.endsWith('.js')).sort();
const contentText = files.map(f => '/* ===== ' + f + ' ===== */\n' + read(path.join(cdir, f))).join('\n');
const appText = read(path.join(engine, 'app.js')).replace(/\n<\/script>\s*$/, '\n');

/* ---------- syntax check ---------- */
const all = configText + '\n' + contentText + '\n' + appText;
try { new vm.Script(all, {filename: 'bundle.js'}); }
catch (e) { console.error('SYNTAX ERROR:', e.message); process.exit(1); }

/* ---------- content validation ---------- */
const ctx = {};
try { vm.runInNewContext(configText + '\n' + contentText + '\n;this.OUT={COURSE,MODS,TOPICS,SR_ORDER:typeof SR_ORDER!=="undefined"?SR_ORDER:[],SR_MIN:typeof SR_MIN!=="undefined"?SR_MIN:{},SR_WHY:typeof SR_WHY!=="undefined"?SR_WHY:{}};', ctx); }
catch (e) { console.error('CONTENT ERROR while evaluating config/content:', e.message); process.exit(1); }
const {COURSE, MODS, TOPICS, SR_ORDER, SR_MIN, SR_WHY} = ctx.OUT;
const errs = [], warns = [], ids = new Set();
['id','brand','sub','title','kicker','lede','questions'].forEach(k => { if (!COURSE[k]) errs.push('COURSE.' + k + ' missing'); });
(COURSE.questions || []).forEach(q => { ['n','max','name','note','topics'].forEach(k => { if (q[k] == null) errs.push('COURSE.questions[' + q.n + '].' + k + ' missing'); });
  (q.topics || []).forEach(id => { if (!TOPICS.find(t => t.id === id)) errs.push('question ' + q.n + ' refers to unknown topic ' + id); }); });
(COURSE.circleTopics || []).forEach(id => { if (!TOPICS.find(t => t.id === id)) errs.push('circleTopics: unknown topic ' + id); });
if (COURSE.mock) (COURSE.mock.parts || []).forEach((p, i) => { if (p.kind !== 'mcq' && !(p.buckets || []).length) errs.push('mock part ' + i + ' needs buckets'); });
let nq = 0, nd = 0, np = 0; const dist = {};
TOPICS.forEach(t => {
  if (ids.has(t.id)) errs.push('duplicate topic id ' + t.id); ids.add(t.id);
  ['id','mod','title','odds','time','idea','quiz','drills'].forEach(k => { if (t[k] == null) errs.push(t.id + ': missing ' + k); });
  if (!MODS.find(m => m.id === t.mod)) errs.push(t.id + ': unknown module ' + t.mod);
  if (!['high','med','low'].includes(t.odds)) errs.push(t.id + ': odds must be high, med or low');
  np += (t.points || []).length;
  (t.quiz || []).forEach((q, i) => { nq++;
    if (!(q.a >= 0 && q.a < q.o.length)) errs.push(t.id + ' quiz ' + i + ': bad answer index');
    if (!q.w) errs.push(t.id + ' quiz ' + i + ': missing explanation (w)');
    if (q.o.length < 3) warns.push(t.id + ' quiz ' + i + ': fewer than 3 options');
    dist[q.a] = (dist[q.a] || 0) + 1; });
  (t.drills || []).forEach(d => { nd++;
    ['id','src','bucket','title','q','idea','steps','sol'].forEach(k => { if (!d[k]) errs.push((d.id || t.id) + ': drill missing ' + k); });
    if (ids.has(d.id)) errs.push('duplicate drill id ' + d.id); ids.add(d.id); });
  if (t.fig) t.fig.forEach((f, i) => { if (!['chain','dll','array','stack','stacks','steps'].includes(f.kind)) errs.push(t.id + ' fig ' + i + ': unknown kind ' + f.kind); });
  if (t.sr) {
    (t.sr.p || []).forEach(i => { if (!t.points || i >= t.points.length) errs.push(t.id + ' sr: point index ' + i + ' out of range'); });
    (t.sr.q || []).forEach(i => { if (i >= t.quiz.length) errs.push(t.id + ' sr: quiz index ' + i + ' out of range'); });
    (t.sr.d || []).forEach(d => { if (!t.drills.find(x => x.id === d)) errs.push(t.id + ' sr: unknown drill ' + d); });
  }
});
if (!SR_ORDER.length) errs.push('SR_ORDER is empty: the speedrun needs at least a few cards');
SR_ORDER.forEach(id => { const t = TOPICS.find(x => x.id === id); if (!t) errs.push('SR_ORDER: unknown topic ' + id); else if (!t.sr) errs.push('SR_ORDER: topic ' + id + ' has no sr selection'); if (SR_MIN[id] == null) errs.push('SR_MIN missing ' + id); if (!SR_WHY[id]) errs.push('SR_WHY missing ' + id); });
const total = Object.values(dist).reduce((a, b) => a + b, 0);
Object.keys(dist).forEach(k => { if (total > 12 && dist[k] / total > 0.5) warns.push('answer position ' + 'ABCDEF'[k] + ' is the key for over half the quiz questions (the engine shuffles options, so this is only a warning)'); });
console.log('topics ' + TOPICS.length + ', key points ' + np + ', quiz questions ' + nq + ', written questions ' + nd + ', speedrun cards ' + SR_ORDER.length);
warns.forEach(w => console.log('warning: ' + w));
if (errs.length) { errs.forEach(e => console.error('ERROR: ' + e)); process.exit(1); }

/* ---------- assemble ---------- */
const head = read(path.join(engine, 'head.html')).replace('{{TITLE}}', COURSE.title.replace(/</g, '&lt;'));
const out = head + '\n' + all + '\n</script>\n';
fs.mkdirSync(path.join(root, 'dist'), {recursive: true});
fs.writeFileSync(path.join(root, 'dist', 'index.html'), out);
console.log('wrote ' + path.join(root, 'dist', 'index.html') + ' (' + Math.round(out.length / 1024) + ' KB)');
