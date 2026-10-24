# course-quest

A Claude Code skill that turns a folder of course materials (slides, tutorials, problem sets, practice and past exams) into a gamified revision website.

The skill interviews you, analyses the past exams, shows four design options, then builds, tests and publishes a single-file site with:

- a chain map of topics in your priority order, with drawn figures (nodes, arrays, stacks)
- quizzes, and written exam questions with a hint ladder: what it tests, how to attack it, model answer
- the exam's own question slots as a header score box of readiness marks
- a "past-paper patterns" chapter with the real questions
- a speedrun track built from exam frequency, with a hand-off to the main track that shows only what is left
- live visualizers, pop quizzes, a mock paper, light and dark themes, phone and laptop layouts

## Install

```bash
git clone https://github.com/FarisAlRasheed/course-quest ~/.claude/skills/course-quest
```

On Windows use `%USERPROFILE%\.claude\skills\course-quest`. To install for one project only, clone into `<project>/.claude/skills/course-quest`.

## Use

Open a terminal in the folder that holds your course files, start Claude Code, and type `/course-quest`.

## Requirements

Claude Code with the Artifact tool and a browser tool, `node`, `python`, and `pdftotext` (poppler) for reading PDFs.

## Layout

```
SKILL.md                  the workflow
references/               guides: interview, sources, content, design, quality, engine
assets/engine/            reusable site engine (head.html, app.js, build.js)
assets/templates/         config, content and design-options templates
examples/csc212/          a worked example (Data Structures midterm)
```

Build an example locally: `node assets/engine/build.js examples/csc212` then open `examples/csc212/dist/index.html`.

## Note on the example

`examples/csc212/` contains questions modelled on past university exams. Replace it with your own course material if you fork this for public use.

## License

MIT
