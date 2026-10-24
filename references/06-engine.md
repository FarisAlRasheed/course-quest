# 06. The engine (assets/engine)

Files
- `head.html`: all CSS (design tokens, light and dark), the page shell and the opening `<script>` tag. `{{TITLE}}` is replaced by `COURSE.title`.
- `app.js`: the whole application, reads `COURSE`, `MODS`, `TOPICS`, `SR_*` from the content. Ends with `</script>`.
- `build.js`: validate and assemble `dist/index.html`. Usage: `node build.js <project-dir>`.

Project layout (create it next to the user's course files, in `course-quest/site/` or wherever the user prefers)
```
<project>/
  course.config.js        (from templates/course.config.template.js)
  content/00-....js       (first file: MODS + TOPICS)
  content/10-....js ...   (more topics)
  content/90-speedrun.js  (SR_ORDER, SR_CORE, SR_MIN, SR_WHY, SR, VIZ_MAP)
  dist/index.html         (build output: this is what you publish)
```
Copy the engine into the project (`assets/engine/*`) or call it by path; either works. Do not edit `app.js` unless you need a new figure kind or visualizer.

## What the engine provides
- Header score box = readiness marks per exam slot (from `COURSE.questions` and topic mastery).
- Home desk: track choice (speedrun and main), "where the marks are", weak spots, rubber-stamp badges, date chips.
- Chain map of topics with a flying "current" cursor, "only what is left" switch, per-chapter pop quizzes, exam-style circle-one block, mock paper.
- Topic page with three tabs: A. Learn, B. Circle the answer, C. Write it.
- Speedrun: lap bar, cards built from `SR`, coverage tracking, completion page with counts of what is left, hand-off to the main track.
- Progress is stored in `localStorage` (per viewer, per browser). State: answered quiz questions, rated written questions, seen key points, speedrun cards, streak.
- Mastery of a topic = 45% quiz correct, 45% written questions rated "got it", 10% key points seen (weights renormalise when a part is absent). 80% counts as done.

## Figure kinds (`fig`)
`chain` and `dll` (nodes, `head`, `cur`, `tags`, `fresh`), `array` (cells with index labels, `tags`, `cur`, `fresh`, `moved`), `stack` (before and after columns), `stacks` (a sequence of small stacks), `steps` (numbered moves).

## Visualizers (`viz`)
Built in: `qcycle` (queue cycle trick), `postfix` (postfix evaluator incl. relational and logical operators), `llins` (linked-list insert/remove with a current cursor), `circq` (circular-array queue). They are data-structure specific.

## Adding a new figure kind or visualizer (for other subjects)
1. **Figure**: add a case in `figHTML` and a render function that returns HTML using existing classes (`.fn`, `.far`, `.cell`, `.vbox`, `.ftag`) or new classes added to `head.html`. Add the kind name to the allowed list in `build.js`. Keep the draw-in animation (`animation-delay: calc(var(--i) * 70ms)`).
2. **Visualizer**: follow the pattern in `app.js`: an init state in `vzInit`, a `vzHTML` branch that renders from state, a `vzDo` branch handling `data-viz-do` actions, and a `viz:'name'` on the topic. Keep state in the `VZ` object and re-render only the widget.
3. Domain examples: a chemistry course might draw reaction arrows and energy diagrams (`steps` plus a new `reaction` kind); a maths course might add a `graph` kind (SVG axes) and a step-by-step algebra visualizer; a biology course might use labelled-diagram figures.
If a subject has no natural figure, use `table`, `steps` and good prose; do not fake diagrams.

## Customising looks
Everything visual is in `head.html` tokens (`:root` and the two dark blocks): colors, fonts, shadows. Changing a design world means changing tokens and a few component rules, not the app. If the user picked a different world from the design options, port its tokens and signature components into `head.html`.

## Publishing
Publish `dist/index.html` with the Artifact tool: `icon` one generic word, a one-sentence `description`, title comes from `<title>`. To update an artifact you already published, pass its `url`. Note that "shared with anyone with the link" artifacts update for everyone immediately and progress keys are per version of the page.
