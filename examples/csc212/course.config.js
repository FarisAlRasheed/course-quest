/* Worked example: the CSC 212 (Data Structures, King Saud University) midterm site. */
const COURSE = {
  id: 'csc212quest',                       // localStorage key prefix: unique per course
  brand: 'CSC 212 Quest',                  // header title and tab suffix
  sub: 'Midterm · King Saud University',   // small line under the brand
  title: 'CSC 212 Midterm Quest',          // <title> and home tab title (2 to 4 words)
  kicker: 'Fall 2026 · Data Structures CSC 212',
  lede: 'Built from your lectures and from the real midterms (Spring 2026 back to 2021). Every paper has the same four questions, so the site is organised around them.',
  dates: [                                  // countdown chips on the home desk
    {label: 'Quiz 2',  ymd: '2026-10-25', when: 'Sun Oct 25'},
    {label: 'Midterm', ymd: '2026-10-26', when: 'Mon Oct 26'}
  ],
  /* The exam's question slots. They drive the score box in the header (readiness marks) and the "four questions" card.
     topics = ids of the topics that prepare you for that slot. */
  questions: [
    {n: 'Q1', max: 15, name: 'Big-O and frequencies',          note: '15 marks, circle-one + a table · every paper', topics: ['p1','p2','p3','pp4']},
    {n: 'Q2', max: 25, name: 'Queue method, by hand',          note: '25 marks, written · every paper',              topics: ['q1','q2','q3','q4','pp1']},
    {n: 'Q3', max: 30, name: 'Circle-one block',               note: '30 marks, six claims · every paper',           topics: ['l1','l3','l4','s1','s2','s3','pp3','pp5','f1','f2','f3']},
    {n: 'Q4', max: 30, name: 'List method or class, by hand',  note: '30 marks, written · every paper',             topics: ['l2','l5','l6','l7','l8','s4','pp2']}
  ],
  circleTopics: ['pp3', 'pp4'],             // topics whose quiz questions form the "exam-style circle-one block"
  mock: {                                   // mock paper: one entry per exam question, in order
    minutes: 90,
    parts: [
      {label: 'Question 1 (15 marks): Big-O',                    buckets: ['pa']},
      {label: 'Question 2 (25 marks): queue method',             buckets: ['queue']},
      {label: 'Question 3 (30 marks): circle one answer',        kind: 'mcq'},
      {label: 'Question 4 (30 marks): list method or class',     buckets: ['list']}
    ]
  }
};
