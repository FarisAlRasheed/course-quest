# 03. Write the content

Schema and field-by-field comments: `assets/templates/content.template.js`. A complete, real example: `examples/csc212/content/`. Study two of its topics before writing (for instance `10-queues.js` and `40-past-papers.js`) so your quality matches.

## Structure of the site
1. **Chapters (MODS)** in study order, with the user's priority first (for example "lists to stacks first, then performance analysis").
2. **Topics** inside chapters. One topic = one idea a student can finish in 8 to 25 minutes.
3. **Past-paper patterns chapter**: one topic per exam slot (for example "Written Q2", "Circle-one block Q3"), containing the *real* questions, recurring traps and the real wording. These are the heart of the exam preparation.
4. **Foundations / low-odds chapter** at the end for prerequisites and older-scope material.

Typical size for a 10-lecture course: 20 to 30 topics, 100 to 130 key points, 100 to 120 quiz questions, 50 to 60 written questions. Do not pad: every item must earn its place.

## Every topic has
- **idea**: two or three sentences. The student should be able to say it back.
- **points** (3 to 7): the facts, rules and procedures. Bold the rule, then explain. Use the course's own names.
- **fig** (strongly preferred wherever something has structure): draw it with the engine's figure kinds (chain, dll, array, stack, stacks, steps), not with text art. Never describe a picture in prose when a figure exists. Add new figure kinds to the engine when the subject needs them (see `06-engine.md`).
- **table**: for comparisons and cheat sheets.
- **viz**: a live visualizer when a process unfolds step by step (state changes). Optional.
- **code**: only what must be memorised. Numbered exam-style box.
- **traps**: the mistakes that cost marks, from past papers and from your own tracing.
- **quiz** (3 to 6): see below.
- **drills** (written questions): 0 to 5.

## Quiz writing rules
- Mimic the exam's multiple-choice style: five options when the exam uses A to E, "None of the above" last.
- Every wrong option is a plausible mistake, not a joke. Every question has a **w** that says why the right one is right *and* why the tempting one fails.
- Use real past-paper questions verbatim wherever possible, tagged with the semester in bold at the start (`<b>Spring 2026.</b>`).
- The engine shuffles options deterministically (so the key is not always B). You do not need to balance them by hand.

## Written-question (drill) rules
A drill has: the question as the exam words it, **what it is testing**, the **best answering procedure** (a method, 3 to 6 steps), the **model answer** in answer-sheet form, and **traps**.
- `src` names the paper and slot. `real:true` only for real past-paper questions (the mock paper draws from these).
- `bucket` groups drills by exam slot for the mock paper.
- Model answers must be **verified** (see `05-quality.md`). Prefer the shortest correct solution that uses only what the exam allows (the allowed API, no forbidden helpers). If an exam forbids something, the solution must comply.
- When the exam is handwritten, write the solution the way a student would on paper: compact, commented only where it earns marks.

## Speedrun (90-speedrun.js)
A curated **view** over the main content, not new content. The engine shows the same text, so nothing is rewritten or lost; coverage is tracked per item.
1. Rank topics by exam frequency (from `analysis.md`). The first 12 or so are **core**; add 3 to 5 **bonus** cards.
2. For each card choose the minimum that still teaches the idea: `p` (point indexes), `q` (quiz indexes), `d` (written-question ids, one or two).
3. Past-paper-pattern topics usually take almost everything.
4. `SR_MIN` is honest minutes; the total (about 2.5 to 3 hours for a full course) is shown on the home page.
5. After the lap the user sees what is left and can continue the main track in "only what is left" mode.
6. Everything not in the speedrun must exist in the main track. If a point is important enough to matter, it belongs in a speedrun card.

## Exam slots (COURSE.questions)
Map each exam question slot to the topics that prepare for it. Marks come from the real paper. The header score box shows readiness marks per slot, so these must match the real exam, otherwise the box misleads.

## Language and tone
Write for a smart tired student, in the exam's language. Short sentences. No filler, no praise, no emojis. Avoid "not X but Y" constructions and dashes as asides. State what to do.
