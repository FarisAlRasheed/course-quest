# 04. Design options and the site's visual language

The user chooses the look. Always show options first. The previous user rejected a generic design as "AI slop", so the bar is: every option must be specific to the subject and the exam, and must be usable and calm for long study sessions.

## Process
1. Pick **four complete "worlds"** that are truly different. Each world = palette, type pairing, shape language, one signature interaction, one signature animation.
2. Build one page (`assets/templates/design-options.template.html` shows the structure): a picker, then a full-width preview of the selected world. The **same screen in every world**: a topic with its key idea and a figure or code, one interactive quiz question with feedback, a progress strip, a speedrun chip.
3. Publish it as an Artifact (private) and ask the user to pick, or to mix two ("A and C"). A mix is normal: merge the structure of one with the figures or palette of another.
4. Do not build the full site before the user picks.

## Anti-slop rules (from user feedback)
- Avoid: warm cream plus serif plus terracotta; near-black plus one acid accent; purple-to-blue gradients; Inter or Space Grotesk as the "safe" face; emoji as markers; everything centred; identical rounded cards with soft shadows.
- A world must contain at least one thing only this subject would have (a real answer-sheet header, node-and-pointer diagrams, a lab notebook margin, a staff-and-notes progress bar...).
- Typography carries personality. Pair deliberately; set a scale; use Google Fonts only (the Artifact CSP allows nothing else) with real fallbacks.
- Structure must encode something true: number things only if they are a sequence.
- Both light and dark themes with tokens; set `body` background explicitly; focus rings visible; `prefers-reduced-motion` respected; phone width works.
- University students: playful is fine, childish is not. No mascots, no confetti.

## The four worlds used for CSC 212 (reuse or replace)
- **A. Exam Booklet**: graph paper, print serif, blue ballpoint for the student's marks, red teacher pen; numbered code box; circled A to E; header score box that fills with readiness marks. Signature animation: the red pen circling a correct answer.
- **B. Night Desk**: calm dark, lamp glow, slow soft feedback, progress as moon phases, quiet focus ring. No harsh red.
- **C. Linked Path**: progress as a linked list of nodes `[data|pointer]`, a coral "current" tag that moves, speedrun as a bypass pointer. Signature: figures drawn as nodes and arrows.
- **D. Ink and Seal**: stone paper, hairlines, a brush-circle that closes with mastery, one red seal stamp for correct answers.
The chosen build was **A + C**: booklet surface and answer-sheet vocabulary with the node-and-pointer map and figures.

## Inventing worlds for another subject
Ask: what physical object does a student of this subject use? What marks a correct answer there? Examples: chemistry lab notebook (ruled margin, red-ink corrections, reaction arrows as figures); maths exam script (squared paper, working lines, tick and cross); biology field guide (specimen plates, labelled diagrams); law casebook (annotations, statute margin); history timeline (a horizontal rail of dated nodes); language course (flashcards on a corkboard). Draw the course's *own* diagrams as the figure style, not generic icons.

## Animation inventory (the "live" feel; keep each purposeful)
- Chain arrows draw in, staggered; a cursor tag flies to the next topic.
- A finished topic fills with ink.
- Correct answer: pen draws a circle then a tick; wrong: strike through, correct one circled after a delay.
- Header marks write themselves in when the readiness changes.
- Answer-sheet lines appear one by one like being written.
- Speedrun: dots on a marching dashed line; a stamp slams at completion.
- Visualizers (step buttons) animate state changes.
All animations are CSS; disable under `prefers-reduced-motion`.

## Headless testing note
The preview pane throttles animations. Before taking a screenshot, finish them: `document.getAnimations().forEach(a => a.finish())`.
