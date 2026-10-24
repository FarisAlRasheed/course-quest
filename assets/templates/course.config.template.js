/* course.config.js  (project root). Fill every field. See examples/csc212/course.config.js for a finished one. */
const COURSE = {
  id: 'mycourse-quest',                 // unique localStorage prefix, lowercase, no spaces
  brand: 'COURSE 101 Quest',            // header title and tab suffix
  sub: 'Midterm · University name',     // small line under the brand
  title: 'COURSE 101 Midterm Quest',    // page <title>: a name of 2 to 4 words, no colon or dash explainer
  kicker: 'Fall 2026 · Course name',    // small line above "Choose your track"
  lede: 'One or two sentences on what the site is built from (lectures, tutorials, past papers) and how it is organised.',
  dates: [                               // countdown chips (optional, may be empty)
    {label: 'Midterm', ymd: '2026-10-26', when: 'Mon Oct 26'}
  ],
  /* The exam's question slots. They drive the header score box ("readiness marks") and the "four questions" card.
     Use the real slots and marks from the past papers. topics = ids of topics that prepare for that slot.
     max values should add up to the exam total (100 is typical). */
  questions: [
    {n: 'Q1', max: 20, name: 'Short name of the slot', note: '20 marks, circle-one', topics: ['t1','t2']},
    {n: 'Q2', max: 30, name: 'Short name of the slot', note: '30 marks, written',    topics: ['t3']}
  ],
  circleTopics: [],   // ids of topics whose quiz forms the "exam-style circle-one block" (leave [] to hide)
  mock: {             // mock paper (omit the whole key to hide it). One part per exam question, in exam order.
    minutes: 90,
    parts: [
      {label: 'Question 1 (20 marks): ...', buckets: ['bucketA']},   // picks a real drill whose bucket matches
      {label: 'Question 2 (30 marks): ...', kind: 'mcq'}              // 'mcq' links to the circle-one block
    ]
  }
};
