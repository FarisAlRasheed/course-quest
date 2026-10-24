# 05. Quality rules: verify, flag, test

Students will trust this site the night before an exam. A wrong model answer is worse than no answer.

## Verify every solution
- **Trace on the question's own examples.** Run each written solution by hand against every example in the question and against edge cases the exam names (empty input, one element, invalid parameter).
- **Execute code when possible.** If the course language is runnable (Python, Java, JS, C...), write the snippets to the scratchpad and run or compile them with `Bash`. For data-structure courses, write a tiny harness with a simple implementation of the course's ADT. Do this for at least every written solution and every trace question.
- **Compute every numeric or symbolic answer** you put in a quiz (evaluate the expression, count the loop iterations, simplify the formula). Check the answer index.
- **Cross-check against marked papers** and against recurring versions of the same question.
- **Respect the exam's restrictions** in the solution (forbidden helpers, allowed API only).
- If two defensible answers exist, say so in `w` and name which one the exam key chose.

## Be honest about uncertainty
- Anything read from a blurry photo, any key you inferred, any question whose answer you could not verify: list it in `analysis.md` under "Uncertain" and tell the user in the final message. Never present a guess as an exam key.
- Do not claim the site predicts marks. The header score is "readiness marks", derived from the user's own progress.
- Do not invent exam content. "Seen in" tags only for papers you actually read.

## Content hygiene
- Strings are template literals: no backticks or `${` inside content. HTML entities for `<`, `>` and `&` in HTML fields (`&lt;`, `&gt;`, `&amp;`); raw text in `code`, `sol`, `fig` values.
- `build.js` validates ids, answer indexes, missing explanations, speedrun indexes, mock buckets and figure kinds. Fix every ERROR; read every warning.
- Keep a topic's `points` order stable once the speedrun refers to indexes.

## Testing the built page
1. `node assets/engine/build.js <project>`: must print counts and "wrote ...index.html" with no ERROR.
2. Serve `dist/` (`python -m http.server <port> --bind 127.0.0.1` in the background) and open it with `preview_start` using the `url` option. Local `file://` pages cannot be driven.
3. Check the console (`read_console_messages` with `onlyErrors`).
4. Drive it with `javascript_tool`: open every route, answer a quiz question, rate a written answer, run the speedrun to the end (`[data-act="srnext"]` sixteen times), check the "left" counts.
5. **Phone overflow**: create a 375 px wide iframe for each route and compare `contentDocument.documentElement.scrollWidth` with 360. Wrap long inline code (`overflow-wrap:anywhere`) and put wide figures and code boxes in their own scroll container.
6. **Dark mode**: `resize_window` with `colorScheme:'dark'`, screenshot a topic and the quiz.
7. Finish animations before screenshots (`document.getAnimations().forEach(a => a.finish())`).
8. Stop the server and close the tab when done. Reset the viewport (`resize_window` preset `desktop`).

## Environment gotchas seen in practice
- The Read tool cannot render PDFs without poppler: use `pdftotext`.
- Screenshots are capped at ~800 px wide; scroll max is 10 ticks per call.
- `browser_batch` actions fail if no screenshot exists yet when you use `scroll` with a coordinate: take a small screenshot first.
- A hash change on a page can reload mid-script and cut a `javascript_tool` run; navigate first, then run scripts.
- Windows paths with non-ASCII user names: use the 8.3 scratchpad path for temp files and quote paths in `Bash`.
