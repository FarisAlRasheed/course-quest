---
name: course-quest
description: Turn a folder of course materials (slides, tutorials, problem sets, practice and past exams) into a gamified, shareable revision website with a content tree, quizzes, exam-style written questions with answering methods, drawn figures, live visualizers and a speedrun track. Interviews the user, analyses past exams, shows design options, then builds, tests and publishes. Use when a student wants to study or revise a course from their own resources.
---

# Course Quest: build a revision website from a course folder

You are building a study tool for a real student with a real exam. The quality bar is high: they will trust it the night before. Follow the phases in order. Do not skip the interview, the exam analysis or the design choice.

Paths below are relative to this skill's folder (the folder that contains this `SKILL.md`). Read the reference file named in each phase before doing that phase.

## What you produce
1. `analysis.md` in the project folder: decisions, syllabus facts, vocabulary, exam anatomy, frequency table, uncertain items.
2. A design-options page (Artifact) with four distinct worlds; the user picks or mixes.
3. A single-file website (`dist/index.html`, published as an Artifact):
   - a **chain map** of topics (ordered by the user's priority), each with idea, key points, drawn figures, quizzes, and written questions with the hint ladder (what it tests, how to attack it, model answer);
   - the exam's own **question slots** as a header score box of readiness marks;
   - a **Past-paper patterns** chapter with the real questions;
   - a **speedrun track** built from exam frequency, with coverage tracking and a hand-off to the main track that shows only what is left;
   - **live visualizers**, pop quizzes, a **mock paper** in the exam's shape, stamps and streaks;
   - animations that make it feel alive, themes for light and dark, phone and laptop layouts.

## Tools you need
`Bash` (pdftotext, python, node), `Glob`/`Grep`/`Read`/`Write`/`Edit`, `AskUserQuestion`, the **Artifact** tool, and a **browser** (built-in browser pane or Claude in Chrome) for Drive links and for testing. If something is missing, say so and use the closest alternative.

---

## Phase 0: Orient (2 minutes)
- Work in the folder the user opened. Create `course-quest/` inside it for your files (`analysis.md`, `_text/`, `site/`). Never modify the user's resources.
- Make a short task list and keep it updated.

## Phase 1: Inventory and first read  ->  `references/02-sources.md`
- Glob the folder, classify files, extract text (`pdftotext -layout`), read the syllabus, skim headings of every lecture.
- Note the course's own vocabulary and API (names of operations, symbols, notation). The site must use them.
- Do **not** start writing site content yet.

## Phase 2: Interview  ->  `references/01-interview.md`
- Batch 1 (goal, time, language, devices and sharing) right after the inventory. Batch 2 (exam format, past papers location, fears, learning style). Use `AskUserQuestion`, at most four questions per call.
- If past papers are in a Drive link or another folder, get the location now.
- Restate your understanding in two lines. Save decisions in `analysis.md`.

## Phase 3: Analyse the exams  ->  `references/02-sources.md` sections 4 to 7
- Read the most recent papers fully and older ones for question types (photos and scans: view page by page in the browser; do not download without an explicit yes).
- Build the **exam anatomy table** and the **frequency table**; list verbatim repeats and restrictions; mark uncertain readings.
- Show the user a compact summary (the four or five exam slots, marks, formats, what repeats) and ask if it matches their experience.

## Phase 4: Ideas and design options  ->  `references/01-interview.md` batch 3 and `references/04-design.md`
1. Ask for the user's ideas for the site; propose 3 or 4 of your own drawn from the course (visualizers that would help, a speedrun, a mock paper, a formula sheet, a glossary). Add the ones they like to the plan.
2. Build the design-options page from `assets/templates/design-options.template.html`, adapted to **this** course (real topic, real figure, real quiz question, the course's own vocabulary). Four worlds that are truly different and specific to the subject; never generic.
3. Publish it as an Artifact (use the `artifact-design` skill rules if loaded) and ask the user to pick or mix (for example "A with C's figures"). Do not build the site before they choose.

## Phase 5: Plan the content  ->  `references/03-content.md`
- Write the topic list (chapters in the user's priority order, then Past-paper patterns, then low-odds/foundations) with `odds` from the frequency table.
- Map exam slots to topics (`COURSE.questions`).
- Choose the speedrun order (core 12 or so, bonus 3 to 5) and `SR_MIN`.
- Show the plan in a compact list and let the user adjust (one round, not a negotiation).

## Phase 6: Write and verify the content  ->  `references/03-content.md` and `references/05-quality.md`
- Set up the project: copy `assets/engine/` into `course-quest/site/`, copy the two templates (`course.config.js`, `content/00-...js`), fill them. Use `examples/csc212/` as the quality reference (read at least two of its topic files first).
- Write content in several files (about 5 to 8 topics per file) so each write stays manageable. Use real past-paper questions verbatim, with sources. Draw figures with `fig` wherever structure exists.
- **Verify every written solution and every computed answer** by tracing and, where the language allows, by running code. Record anything you cannot verify as uncertain.
- For large courses you may parallelise with subagents (one per chapter) only if the user asks for subagents or sessions; otherwise write inline.

## Phase 7: Build, test, iterate  ->  `references/06-engine.md` and `references/05-quality.md`
- `node course-quest/site/build.js course-quest/site` (adjust path). Fix every ERROR; read warnings.
- Port the chosen design into `head.html` tokens and components if it differs from the default booklet-and-chain look.
- Serve `dist/`, open with the browser pane, check console errors, drive every route, run the speedrun to the end, check phone overflow in a 375 px iframe, check dark mode, finish animations before screenshots.
- Fix what you find. One look and one repair pass is enough; do not loop.

## Phase 8: Publish and hand over
- Publish `dist/index.html` with the Artifact tool (`icon`: one generic word; `description`: one sentence). Keep the same URL for updates.
- Final message (short): the link; what is inside (counts); how the speedrun works; **what to double-check** (every item from "Uncertain" in `analysis.md`: unclear photo readings, solutions you could not verify, ambiguous exam keys); sharing note (private until they share it; progress lives in each person's browser); offer one concrete next step (more questions for their weakest topic).
- Never claim the score box predicts marks.

---

## Rules that always apply
- **Ask, do not assume**: exam format, scope, language, and taste come from the user.
- **Source of truth**: use the course's own names, notation and question style. Quote real exam wording; tag the paper.
- **No unverified answers**: trace or run before you publish. Flag the rest.
- **No download without a yes**: viewing files in the browser is fine; downloading is not unless the user says yes.
- **Respect the user's time**: say a short status line when a step takes long; keep chat messages brief; put detail in files and in the site.
- **Design**: specific to the subject, calm, adult, accessible; options before building; one choice from the user.
- **Do not publish what you have not seen**: read the whole file before publishing; never publish content that impersonates a person or organisation.
- **Scope discipline**: do the course the user asked for; do not add other courses' material.

## Folder map
```
SKILL.md
references/01-interview.md   questions to ask, in batches
references/02-sources.md     reading folders, PDFs, photos, Drive; exam analysis template
references/03-content.md     content structure, quiz and written-question rules, speedrun building
references/04-design.md      design options process, anti-slop rules, worlds, animations
references/05-quality.md     verification, honesty, testing checklist, environment gotchas
references/06-engine.md      engine files, build, figure kinds, visualizers, extending
assets/engine/               head.html, app.js, build.js   (the reusable site engine)
assets/templates/            course.config.template.js, content.template.js, design-options.template.html
examples/csc212/             a finished worked example (config + content for a Data Structures midterm)
```

## Install and run
Copy this folder to `~/.claude/skills/course-quest/` (or `<project>/.claude/skills/course-quest/`). Open a terminal in the folder with the course files and ask Claude to use the `course-quest` skill (or type `/course-quest`).
