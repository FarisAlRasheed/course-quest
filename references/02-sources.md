# 02. Read the sources and analyse the past exams

Goal: produce `analysis.md` in the project folder with (1) the syllabus facts, (2) the topic map with the exact vocabulary the course uses, (3) the exam anatomy from past papers, (4) recurring questions, (5) your uncertainties. Everything you write later is checked against this file.

## 1. Inventory
- `Glob **/*` the folder. Group files: syllabus, lectures/slides, tutorials, problem sets, practice exams, past papers, other.
- Ignore build output and the skill's own folders.

## 2. Extract text (do not use the Read tool for PDFs: it needs poppler)
```bash
mkdir -p course-quest/_text
for f in *.pdf; do pdftotext -layout "$f" "course-quest/_text/${f%.pdf}.txt"; done
```
- If `pdftotext` is missing, try `python -c "import pypdf"` (page by page), then `pdfplumber`. For `.pptx` use `python-pptx`; for `.docx` use `python-docx` or the docx skill.
- Slides repeat text because of animations. De-duplicate when skimming:
  `grep -v '^\s*$' file.txt | sed 's/  */ /g' | awk '!s[$0]++'`
- If a PDF yields little or no text, it is scanned or a photo: read it visually (section 4).
- Read headings first (`grep -nE "^[A-Z]"`), then the parts that define **interfaces, notation, naming conventions and worked examples**. The site must use the course's own names (method names, symbols, units, sign conventions), not generic textbook ones.

## 3. Syllabus facts
Exam dates and scope, grade weights, tutorial style, textbook, allowed aids. Note anything that conflicts with what the user said and ask.

## 4. Past papers: read like a student
Papers are often phone photos or scans. Read every page of the most recent two or three in full; skim older ones for question *types*.
- **Google Drive folder.** Open the link with the built-in browser (`preview_start` with a `url`, or `navigate`). The folder listing exposes file ids in the DOM: `[...document.querySelectorAll('[data-id]')]`. Open `https://drive.google.com/file/d/<id>/view` and read the PDF in the viewer. Viewing in the browser is fine; do **not** download files without the user's explicit yes (name the file, source and size when asking).
- **Legibility.** Screenshots are downscaled to ~800 px wide. Set the viewport to about 900x1000 (`resize_window`), scroll in steps of 7 to 9 ticks (max 10), and screenshot each step. A `browser_batch` of `scroll + screenshot` pairs is the fastest. The `zoom` action does not magnify, so rely on real page size.
- **Photos are noisy.** If an expression or option is unclear, cross-check it: evaluate the expression and compare with the answer key if the paper is marked, or with the other papers where the same question recurs. Write "as I read it" in `analysis.md` and tell the user at the end.
- **Marked papers** (handwritten keys, circled answers) are gold: copy the key into your notes, and check your own solutions against it.

## 5. Exam anatomy table (fill this for every paper)
| Paper | Q slot | Marks | Format (circle / written / fill-in) | What it asks | Recurs? |
|---|---|---|---|---|---|
Write one row per question per paper. Then summarise:
- the **slots** (usually 3 to 5) with typical marks and format; these become `COURSE.questions` and the header score box;
- **frequency**: each idea and how many papers it appears in; this orders the speedrun and sets `odds` per topic;
- **verbatim repeats** (the same expression, the same trap, the same statement). These are the most valuable single facts on the site. Put them in their own "past-paper patterns" topics and in the speedrun;
- **stable phrasing and restrictions** ("do not use additional data structures", "the list must not change"); teach them as exam vocabulary;
- **scope drift**: topics that appeared in older papers but not recently (mark them `odds:'low'` and say why).

## 6. Resources inside the folder
- **Tutorials and problem sets** show the university's question style. Copy their phrasing; keep their numbering in `src` (e.g. "Tutorial 3 · P2").
- **Practice exams with solutions** are ground truth for style and marks.
- Questions in the folder with no solution: write the solution yourself and verify it (see `05-quality.md`).

## 7. Output
`analysis.md` sections: Decisions (from the interview), Syllabus facts, Vocabulary and conventions, Topic map (ordered), Exam anatomy table, Frequency table, Verbatim repeats, Uncertain readings, Out-of-scope.
Show the user the exam anatomy and frequency table in chat (compact) before designing; it earns trust and corrects misreadings early.
