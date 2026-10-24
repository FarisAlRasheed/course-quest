/* ============================ SPEEDRUN TRACK ============================ */
/* Each entry is a curated VIEW over the main content: p = key point indexes, q = quiz indexes, d = exam-question ids.
   Everything shown here is the same text as the main track, so nothing is lost; main track only shows what is left. */
const SR_ORDER = ['p1','p2','pp4','q1','q3','pp1','l1','l2','l7','pp2','s3','pp3','l5','s1','s4','l6'];
const SR_CORE = 12;
const SR_MIN = {p1:9,p2:9,pp4:10,q1:7,q3:12,pp1:18,l1:8,l2:9,l7:14,pp2:20,s3:12,pp3:14,l5:9,s1:6,s4:12,l6:10};
const SR_WHY = {
 p1:'Question 1 in every paper', p2:'Question 1: the frequency table', pp4:'Question 1: the real circle-one questions',
 q1:'Needed for every queue question', q3:'Question 2 in every paper', pp1:'Question 2: the real handwritten methods',
 l1:'Needed for every list question', l2:'The base of Question 4', l7:'Question 4: pointer work',
 pp2:'Question 4: the real methods and classes', s3:'Postfix in every Question 3', pp3:'Question 3: the real circle-one block',
 l5:'Doubly linked lists, bonus lap', s1:'Stack basics, bonus lap', s4:'Stack coding, bonus lap', l6:'User-of-ADT list methods, bonus lap'
};
const SR = {
 p1:{p:[0,1,2,3,4,5], q:[0,1,2,3,4,5], d:['p1d3']},
 p2:{p:[0,1,2,3,5], q:[0,1,2,3], d:['p2d1']},
 pp4:{p:[0,1,2,3], q:[0,1,4,5,6,8], d:['pp4d1']},
 q1:{p:[0,1,2,3], q:[0,1,2], d:[]},
 q3:{p:[0,1,2,3,4], q:[0,1,2,3], d:['q3d1','q3d2']},
 pp1:{p:[0,1,2,3], q:[0,1,2,3], d:['pp1d1','pp1d2','pp1d4']},
 l1:{p:[0,1,2,3], q:[0,1,2], d:['l1d1']},
 l2:{p:[0,1,2,3], q:[0,1,3], d:['l2d1']},
 l7:{p:[0,1,2], q:[0,1,2], d:['l7d1']},
 pp2:{p:[0,1,2,3,4], q:[0,1,2,3], d:['pp2d1','pp2d2']},
 s3:{p:[0,1,2,3,4], q:[0,1,2,3,4], d:['s3d2']},
 pp3:{p:[0,1,2,3], q:[0,1,2,3,4,5,6,7,8,9], d:['pp3d1']},
 l5:{p:[0,1,2,3], q:[0,1,2], d:['l5d3']},
 s1:{p:[0,1,2,3], q:[0,1,2], d:[]},
 s4:{p:[0,1,2], q:[0,1,2], d:['s4d1','s4d4']},
 l6:{p:[0,1,2], q:[0,1,2], d:['l6d4']}
};
TOPICS.forEach(t => { t.sr = SR[t.id] || null; });
const VIZ_MAP = {l1:'llins', l2:'llins', q1:'qcycle', q2:'circq', q3:'qcycle', s3:'postfix'};
TOPICS.forEach(t => { if (!t.viz && VIZ_MAP[t.id]) t.viz = VIZ_MAP[t.id]; });
