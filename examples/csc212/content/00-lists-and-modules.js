const MODS = [
  {id:'lists',  name:'Lists',  sub:'ADT List, linked, array, doubly linked'},
  {id:'queues', name:'Queues', sub:'Queue, circular array, priority queue, deque'},
  {id:'stacks', name:'Stacks', sub:'Stack ADT, balanced symbols, postfix'},
  {id:'perf',   name:'Performance Analysis', sub:'Big-O, frequency counting, loop patterns'},
  {id:'past',   name:'Past-paper patterns', sub:'The real questions, Spring 2026 back to 2021'},
  {id:'found',  name:'Foundations', sub:'Generics, recursion, ADT basics', noBoss:true}
];
const TOPICS = [];

/* ============================ LISTS ============================ */
TOPICS.push({
id:'l1', mod:'lists', title:'The List ADT and the current cursor', odds:'high', time:'12 min',
idea:`A List is a line of elements with a <b>head</b> and a hidden <b>current</b> cursor. Every operation is defined relative to <code>current</code>. A <i>user</i> of the ADT can only call the interface methods; only the <i>implementer</i> can touch <code>head</code>, <code>next</code> and the array.`,
points:[
 `<b>Specification vs implementation.</b> The spec says <i>what</i> each operation does. The representation (nodes or array) says <i>how</i>. Exam wording "user of the ADT" means you may only call <code>findFirst, findNext, retrieve, update, insert, remove, full, empty, last</code>.`,
 `<b>insert(e)</b> creates a new element <u>after</u> current and the new element <u>becomes current</u>. On an empty list it also becomes the head.`,
 `<b>remove()</b> deletes current. The successor becomes current; if there is no successor, current goes to the <u>first</u> element. If the list becomes empty, current is null.`,
 `<b>"requires" lines are your job.</b> <code>retrieve</code> needs a non-empty list, <code>findNext</code> needs current not last, <code>insert</code> needs a non-full list.`,
 `<b>Doubly linked list</b> adds <code>findPrevious()</code> and <code>first()</code>.`
],
fig:[
 {kind:'chain', cap:'A list has a head and a current cursor', nodes:['A','B','C','D'], head:0, cur:1},
 {kind:'chain', cap:'insert(X): X is placed after current and becomes current', nodes:['A','B','X','C','D'], head:0, cur:2, fresh:[2]},
 {kind:'chain', cap:'remove() on the last element D: current wraps to the first element', nodes:['A','B','C'], head:0, cur:0}
],
code:`public interface List<T> {
  void findFirst();
  void findNext();
  T    retrieve();
  void update(T e);
  void insert(T e);
  void remove();
  boolean full();
  boolean empty();
  boolean last();
}

// Standard traversal as a USER of the ADT
if (!l.empty()) {
  l.findFirst();
  while (!l.last()) {
    // use l.retrieve()
    l.findNext();
  }
  // use l.retrieve() once more: the LAST element
}`,
traps:[
 `The loop <code>while(!l.last())</code> stops <u>before</u> processing the last element. Handle it after the loop (or use an explicit break pattern).`,
 `Calling <code>last()</code>, <code>retrieve()</code> or <code>findFirst()</code> on an empty list breaks the "requires" rule. Check <code>empty()</code> first.`,
 `After <code>insert</code>, current moved. Do not assume it still points where it did.`
],
quiz:[
 {q:`List A, B, C with current on B. After <code>insert(X)</code>, what is the list and where is current?`, o:[`A B X C, current on B`,`A X B C, current on X`,`A B X C, current on X`,`A B C X, current on X`], a:2, w:`insert places the new element <b>after</b> current, and the new element becomes current.`},
 {q:`List A, B, C, D with current on D (the last). After <code>remove()</code>, where is current?`, o:[`null`,`C`,`On A (the first element)`,`Still on D`], a:2, w:`No successor exists, so the spec says the <b>first</b> element becomes current.`},
 {q:`A user writes: <pre class="code">l.findFirst();\nwhile (!l.last()) {\n  print(l.retrieve());\n  l.findNext();\n}</pre>What is wrong?`, o:[`It crashes on a non-empty list`,`It never prints the last element`,`It prints every element twice`,`Nothing, it is correct`], a:1, w:`The loop exits as soon as current is last, before printing it. Add one more <code>print(l.retrieve())</code> after the loop.`},
 {q:`Which of these can a <i>user</i> of the List ADT do?`, o:[`Read <code>head</code> directly`,`Follow <code>current.next</code>`,`Call <code>findNext()</code> and <code>retrieve()</code>`,`Index the internal array`], a:2, w:`A user only sees the interface methods. Head, next and the array belong to the implementer.`}
],
drills:[
 {id:'l1d1', src:'Lecture 8-10 · search', bucket:'list', time:'6 min', title:'search: is e in the list?',
  q:`Write <code>public static &lt;T&gt; boolean search(List&lt;T&gt; l, T e)</code> as a <b>user of the List ADT</b>. The list may be empty. Return true if <code>e</code> is in the list.`,
  idea:`Standard traversal with the "last element" trap. Tests whether you remember that <code>while(!l.last())</code> skips the last element and that an empty list must be handled first.`,
  steps:[`Empty list? Return false immediately.`,`<code>findFirst()</code>, then loop <code>while (!l.last())</code>: compare <code>retrieve()</code> with <code>e</code>, return true on a match, otherwise <code>findNext()</code>.`,`After the loop current is the last element: compare once more and return that result.`],
  sol:`public static <T> boolean search(List<T> l, T e) {
  if (l.empty()) return false;
  l.findFirst();
  while (!l.last()) {
    if (l.retrieve().equals(e)) return true;
    l.findNext();
  }
  return l.retrieve().equals(e);   // the last element
}`,
  traps:[`Use <code>.equals</code>, not <code>==</code>, for generic objects.`,`Do not forget the last element.`]},
 {id:'l1d2', src:'Problem set 3.1.3', bucket:'list', time:'9 min', title:'commonE: elements present in both lists',
  q:`Write <code>public static &lt;T&gt; void commonE(List&lt;T&gt; l1, List&lt;T&gt; l2, List&lt;T&gt; cl)</code>, a user of the ADT. It inserts into the empty list <code>cl</code> every element of <code>l1</code> that also appears in <code>l2</code>, in the order of <code>l1</code>. Example: l1 = A, B, C, F, M, D and l2 = R, M, W, F gives cl = F, M.`,
  idea:`Reuse a helper you already wrote (<code>search</code>) inside a traversal. Also tests how <code>insert</code> behaves: inserting after current each time <u>appends</u> to the end, because current is always the last inserted element.`,
  steps:[`If either list is empty, return.`,`Traverse l1 with the "process then check last" shape. Use a loop that processes the element and then breaks if <code>last()</code>.`,`For each element call <code>search(l2, e)</code>. If true, <code>cl.insert(e)</code>.`,`No extra work needed to keep order: each insert lands after the previous one.`],
  sol:`public static <T> void commonE(List<T> l1, List<T> l2, List<T> cl) {
  if (l1.empty() || l2.empty()) return;
  l1.findFirst();
  while (true) {
    T e = l1.retrieve();
    if (search(l2, e)) cl.insert(e);
    if (l1.last()) break;
    l1.findNext();
  }
}`,
  traps:[`Calling <code>search(l2, e)</code> moves l2's current. That is fine here, because <code>search</code> starts with <code>findFirst()</code> every time.`]}
]});

TOPICS.push({
id:'l2', mod:'lists', title:'Linked list implementation', odds:'high', time:'15 min',
idea:`<code>LinkedList</code> keeps <code>head</code> and <code>current</code> pointers over <code>Node(data, next)</code>. Almost everything is O(1). The only work is <code>insert</code> (relink three pointers in the right order) and <code>remove</code> (needs the <u>predecessor</u>, so it is O(n)).`,
points:[
 `<b>Cheap operations:</b> <code>empty: head==null</code>, <code>last: current.next==null</code>, <code>full: false</code>, <code>findFirst: current=head</code>, <code>findNext: current=current.next</code>, <code>retrieve/update: current.data</code>.`,
 `<b>insert (non-empty):</b> save <code>tmp = current.next</code>, hang the new node on <code>current.next</code>, move current to it, and set its <code>next = tmp</code>. Order matters: if you overwrite <code>current.next</code> before saving it you lose the rest of the list.`,
 `<b>remove has two cases.</b> If current is the head: <code>head = head.next</code>. Otherwise walk from head until <code>tmp.next == current</code>, then <code>tmp.next = current.next</code>. Finally current becomes the successor, or head if there is none.`,
 `Why O(n)? A singly linked node has no pointer back, so finding the predecessor needs a scan.`
],
fig:[
 {kind:'chain', cap:'Before: current is on B', nodes:['A','B','C'], head:0, cur:1},
 {kind:'steps', cap:'insert(X) in four moves, in this order', steps:['tmp = current.next   (tmp points to C)','current.next = new node X','current = current.next   (current is X)','current.next = tmp   (X points to C)']},
 {kind:'chain', cap:'After', nodes:['A','B','X','C'], head:0, cur:2, fresh:[2]}
],
code:`public void insert(T val) {
  Node<T> tmp;
  if (empty()) {
    current = head = new Node<T>(val);
  } else {
    tmp = current.next;
    current.next = new Node<T>(val);
    current = current.next;
    current.next = tmp;
  }
}

public void remove() {
  if (current == head) {
    head = head.next;
  } else {
    Node<T> tmp = head;
    while (tmp.next != current)
      tmp = tmp.next;
    tmp.next = current.next;
  }
  if (current.next == null) current = head;
  else current = current.next;
}`,
traps:[
 `Forgetting the empty-list case in <code>insert</code> (current is null, so <code>current.next</code> crashes).`,
 `In <code>remove</code> the loop condition is <code>tmp.next != current</code>. Stopping <u>at</u> the predecessor is the whole trick.`,
 `Setting current only at the end of <code>remove</code>: it still holds the removed node until then, which is why <code>current.next</code> is still readable.`
],
quiz:[
 {q:`Why is <code>remove()</code> O(n) in a singly linked list but <code>insert()</code> is O(1)?`, o:[`remove has to shift elements`,`remove needs the predecessor of current, which requires a scan from head`,`insert never changes pointers`,`remove allocates memory`], a:1, w:`Insert only uses current and current.next. Remove must rewire the node <i>before</i> current, and a node cannot reach backwards.`},
 {q:`In <code>insert</code> (non-empty), what goes wrong if you write <code>current.next = new Node(val); current = current.next;</code> without first saving <code>tmp = current.next</code>?`, o:[`Nothing, it still works`,`A compile error`,`The elements after the insertion point become unreachable`,`The new node is not created`], a:2, w:`The old <code>current.next</code> was the only link to the rest of the list. Overwriting it without saving it loses that tail.`},
 {q:`What does <code>full()</code> return for the linked list?`, o:[`size == maxsize`,`head == null`,`Always false`,`current == null`], a:2, w:`A linked list grows with each new node, so the course implementation returns false.`},
 {q:`List A, B, C, D with current on C. After <code>remove()</code> the list and current are:`, o:[`A B D, current on D`,`A B D, current on B`,`A B D, current on A`,`A B C, current on C`], a:0, w:`C is removed, and its successor D becomes current.`}
],
drills:[
 {id:'l2d1', src:'Lecture 8-10 · implementer', bucket:'list', time:'10 min', title:'Write insert and remove from memory',
  q:`As an <b>implementer</b> of <code>LinkedList&lt;T&gt;</code> (fields <code>head</code>, <code>current</code>, class <code>Node&lt;T&gt;</code> with <code>data</code> and <code>next</code>), write <code>insert(T val)</code> and <code>remove()</code> following the ADT specification.`,
  idea:`The classic pointer drill. Tests the exact spec behavior: insert goes after current and becomes current; remove moves current to the successor, or to head if no successor exists.`,
  steps:[`Draw a 3-node list with head and current before writing code.`,`insert: handle empty (set both head and current), else save, link, move current, reattach.`,`remove: split on <code>current == head</code>. Find the predecessor for the other case.`,`End with the current rule: successor if present, else head.`],
  sol:`public void insert(T val) {
  if (empty()) {
    current = head = new Node<T>(val);
  } else {
    Node<T> tmp = current.next;
    current.next = new Node<T>(val);
    current = current.next;
    current.next = tmp;
  }
}

public void remove() {
  if (current == head) {
    head = head.next;
  } else {
    Node<T> p = head;
    while (p.next != current) p = p.next;
    p.next = current.next;
  }
  current = (current.next == null) ? head : current.next;
}`,
  traps:[`If the list had one element, after <code>remove</code> head is null and current becomes null too. That matches the spec ("empty list: current is null").`]}
]});

TOPICS.push({
id:'l3', mod:'lists', title:'Array list implementation', odds:'med', time:'10 min',
idea:`<code>ArrayList</code> stores elements in <code>nodes[0..size-1]</code> and <code>current</code> is an <u>index</u> (-1 when empty). Moving is free, but <code>insert</code> and <code>remove</code> must <b>shift</b> elements, which costs O(n).`,
points:[
 `Fields: <code>maxsize, size, current, nodes[]</code>. Constructor sets <code>size=0, current=-1</code>.`,
 `<code>full: size==maxsize</code>, <code>empty: size==0</code>, <code>last: current==size-1</code>, <code>findFirst: current=0</code>, <code>findNext: current++</code>.`,
 `<b>insert:</b> shift everything after current one slot to the right (loop from the end backwards), place the value at <code>current+1</code>, increase current and size.`,
 `<b>remove:</b> shift everything after current one slot to the left (loop forward), decrease size. Then: size 0 gives <code>current=-1</code>; if current now equals size (removed the last) then <code>current=0</code>.`,
 `Unlike the linked list, the array is <u>bounded</u>, so <code>full()</code> can be true and insert has a real precondition.`
],
fig:[
 {kind:'array', cap:'size = 3, current = 1', cells:['5','8','7','',''], cur:1},
 {kind:'array', cap:'insert(6): 7 shifts right, 6 is written at current + 1, then current = 2 and size = 4', cells:['5','8','6','7',''], cur:2, fresh:[2], moved:[3]}
],
code:`public void insert(T val) {
  for (int i = size - 1; i > current; --i)
    nodes[i + 1] = nodes[i];
  nodes[++current] = val;
  size++;
}

public void remove() {
  for (int i = current + 1; i < size; i++)
    nodes[i - 1] = nodes[i];
  size--;
  if (size == 0)            current = -1;
  else if (current == size) current = 0;
}`,
traps:[
 `The shift loop in <code>insert</code> runs <u>backwards</u>. Running it forward overwrites elements.`,
 `Remove at the last index: after <code>size--</code>, <code>current == size</code>, so current wraps to 0 (the first element), matching the spec.`
],
quiz:[
 {q:`Array list [5, 8, 7], current on index 1 (value 8). After <code>insert(6)</code> the content and current index are:`, o:[`[5,6,8,7], current 1`,`[5,8,6,7], current 2`,`[5,8,7,6], current 3`,`[6,5,8,7], current 0`], a:1, w:`The new value goes at index current+1 = 2, 7 shifts to index 3, and current becomes 2.`},
 {q:`Array list [5, 8, 7] with current on index 2 (last). After <code>remove()</code>, current is:`, o:[`2`,`1`,`0`,`-1`], a:2, w:`size becomes 2 and equals current, so the code sets current = 0 (first element).`},
 {q:`Which operation is O(1) in the array list but O(n) in the singly linked list?`, o:[`insert`,`findPrevious`,`findNext`,`empty`], a:1, w:`In the array, <code>findPrevious</code> is just <code>current--</code>. In a singly linked list you must scan from head.`},
 {q:`Which direction must the shifting loop run in <code>insert</code>?`, o:[`Forward from current+1`,`Backward from size-1 down to current+1`,`Either, it does not matter`,`No shifting is needed`], a:1, w:`Going backward copies each element into an already-vacated slot. Going forward would overwrite values before copying them.`}
],
drills:[
 {id:'l3d1', src:'Lecture 8-10 · trace', bucket:'list', time:'7 min', title:'Trace an array list',
  q:`An <code>ArrayList</code> holds [A, B, C, D] with current on index 1. Show the content, <code>size</code> and <code>current</code> after each step, in order: (1) <code>insert('X')</code> (2) <code>findNext()</code> (3) <code>remove()</code> (4) <code>findFirst(); remove()</code>.`,
  idea:`Pure mechanics of shifting and the current rules. Exams give a small state and ask for the state after a few calls.`,
  steps:[`Write the array as boxes with indices above them. Keep size and current beside it.`,`insert: shift right, write at current+1, current++, size++.`,`remove: shift left over current, size--, then apply the two current rules.`],
  lang:'text',
  sol:`start          [A B C D]  size 4  current 1 (B)
(1) insert X   [A B X C D]  size 5  current 2 (X)
(2) findNext   [A B X C D]  size 5  current 3 (C)
(3) remove     [A B X D]    size 4  current 3 (D)   (D slid into index 3)
(4) findFirst  current 0 (A); remove
               [B X D]      size 3  current 0 (B)`,
  traps:[`After removing a middle element, current keeps the same <u>index</u>, which now holds the successor.`]}
]});

TOPICS.push({
id:'l4', mod:'lists', title:'Comparing implementations (complexity)', odds:'high', time:'8 min',
idea:`Memorize this one table. The shape is: array = cheap navigation, expensive insert/remove; linked = cheap insert, expensive going backwards and remove; doubly linked = cheap everything except random access.`,
points:[
 `<b>Why the DLL wins:</b> two pointers per node let you reach the predecessor in O(1), so both <code>findPrevious</code> and <code>remove</code> drop to O(1).`,
 `<b>Space:</b> array wastes unused slots up to <code>maxsize</code> and is bounded. Linked/DLL use extra memory per node (1 or 2 pointers) but have no fixed limit.`,
 `A <u>user</u> method such as <code>moveToEnd</code> costs whatever the ADT's operations cost, summed over how many calls it makes.`
],
table:{head:['Operation','Array','Linked','Doubly linked'],rows:[
 ['empty / full / last','O(1)','O(1)','O(1)'],
 ['findFirst / findNext','O(1)','O(1)','O(1)'],
 ['findPrevious','O(1)|g','O(n)|b','O(1)|g'],
 ['retrieve / update','O(1)','O(1)','O(1)'],
 ['insert (after current)','O(n)|b','O(1)|g','O(1)|g'],
 ['remove (current)','O(n)|b','O(n)|b','O(1)|g'],
 ['find last element','O(1)','O(n)','O(n) (no tail)']
]},
quiz:[
 {q:`Fastest implementation of <code>remove()</code> (current element):`, o:[`Array list`,`Singly linked list`,`Doubly linked list`,`All equal`], a:2, w:`DLL reaches both neighbours directly: O(1). Linked needs a scan for the predecessor, array needs a shift.`},
 {q:`An application inserts in the middle very often and never moves backwards. Best choice?`, o:[`Array list`,`Linked list`,`Both are the same`,`Neither, use a queue`], a:1, w:`Linked insert is O(1) after current; array insert shifts O(n). Backward movement is not needed, so no DLL required.`},
 {q:`Complexity of <code>findPrevious()</code> in the three implementations (array, linked, DLL)?`, o:[`O(1), O(n), O(1)`,`O(n), O(n), O(1)`,`O(1), O(1), O(1)`,`O(n), O(1), O(1)`], a:0, w:`Array: current--. Linked: scan from head. DLL: current.previous.`},
 {q:`Which statement about space is correct?`, o:[`A linked list needs no memory per element`,`A doubly linked list stores one pointer per node`,`An array list may waste space, a linked list pays for pointers`,`Array lists have no size limit`], a:2, w:`Arrays reserve <code>maxsize</code> slots up front; linked nodes carry pointer overhead.`}
],
drills:[
 {id:'l4d1', src:'Lecture 11 · FindPrevious', bucket:'list', time:'8 min', title:'findPrevious / findLast in each implementation',
  q:`Write <code>findPrevious()</code> for (a) <code>ArrayList</code>, (b) singly <code>LinkedList</code>, (c) <code>DoubleLinkedList</code>. Assume current is not the first element. Then write <code>findLast()</code> for the DLL, and state the cost of each.`,
  idea:`Directly tests the complexity table: the same operation has three different implementations and three different costs.`,
  steps:[`Array: current is an index, so subtract one.`,`Singly linked: start at head and stop on the node whose <code>next</code> is current.`,`DLL: follow the <code>previous</code> field.`,`findLast: walk <code>next</code> until null.`],
  sol:`// (a) ArrayList            O(1)
public void findPrevious() { current--; }

// (b) LinkedList           O(n)
public void findPrevious() {
  Node<T> p = head;
  while (p.next != current) p = p.next;
  current = p;
}

// (c) DoubleLinkedList     O(1)
public void findPrevious() { current = current.previous; }

// findLast, DoubleLinkedList   O(n)
public void findLast() {
  while (current.next != null) current = current.next;
}`,
  traps:[]}
]});

TOPICS.push({
id:'l5', mod:'lists', title:'Doubly linked list', odds:'high', time:'14 min',
idea:`Each node has <code>previous</code> and <code>next</code>. That makes <code>findPrevious</code> and <code>remove</code> O(1), but every insert/delete must keep <u>both</u> directions consistent, and the first and last nodes have a null on one side.`,
points:[
 `<code>first()</code> is <code>current.previous == null</code>; <code>last()</code> is <code>current.next == null</code>.`,
 `<b>insert (non-empty)</b> needs four link updates: new.next, new.previous, the old next's previous (only if it exists), and current.next.`,
 `<b>remove</b> needs: successor's previous (if any), predecessor's next (if any, else head moves), then move current.`,
 `Always guard against null at the ends. That is where marks are lost.`
],
fig:[
 {kind:'dll', cap:'Doubly linked: every node has previous and next', nodes:['A','B','C'], head:0, cur:1},
 {kind:'steps', cap:'insert(X) with current on B', steps:['X.next = B.next   (C)','X.previous = B','C.previous = X   (only if C exists)','B.next = X','current = X']},
 {kind:'dll', cap:'After', nodes:['A','B','X','C'], head:0, cur:2, fresh:[2]}
],
code:`public void insert(T val) {
  Node<T> tmp = new Node<T>(val);
  if (empty()) {
    current = head = tmp;
  } else {
    tmp.next = current.next;
    tmp.previous = current;
    if (current.next != null)
      current.next.previous = tmp;
    current.next = tmp;
    current = tmp;
  }
}

public void remove() {
  if (current.next != null)
    current.next.previous = current.previous;
  if (current.previous != null)
    current.previous.next = current.next;
  else
    head = current.next;
  current = (current.next == null) ? head : current.next;
}`,
traps:[
 `Updating only <code>next</code> pointers. A DLL has twice the links, so a forgotten <code>previous</code> silently corrupts backward traversal.`,
 `Dereferencing <code>current.next.previous</code> when current is the last node.`,
 `Removing the head: no predecessor exists, so <code>head</code> itself must move.`
],
quiz:[
 {q:`In DLL <code>insert</code>, which statement must be guarded by a null check?`, o:[`<code>tmp.next = current.next</code>`,`<code>tmp.previous = current</code>`,`<code>current.next.previous = tmp</code>`,`<code>current = tmp</code>`], a:2, w:`If current is the last node, <code>current.next</code> is null and <code>.previous</code> would throw a NullPointerException.`},
 {q:`Removing the <b>head</b> node of a DLL. What must change?`, o:[`Only <code>head.next</code>`,`<code>head</code> moves to the successor and the successor's <code>previous</code> becomes null`,`Nothing, the head stays`,`Only <code>current</code>`], a:1, w:`No node precedes the head, so you update <code>head</code> and the new head's <code>previous</code>.`},
 {q:`How many pointer fields change when inserting into the <i>middle</i> of a DLL (not counting current)?`, o:[`1`,`2`,`4`,`6`], a:2, w:`New node: next and previous (2). Neighbours: current.next and old-next.previous (2). Four in total.`},
 {q:`Cost of <code>remove()</code> in a DLL vs a singly linked list?`, o:[`O(1) vs O(n)`,`O(n) vs O(1)`,`O(1) vs O(1)`,`O(n) vs O(n)`], a:0, w:`The DLL has direct access to the predecessor.`}
],
drills:[
 {id:'l5d1', src:'Practice exam Q3 · variant', bucket:'list', time:'12 min', title:'rotateLeft(k) on a DoubleLinkedList',
  q:`Write <code>public void rotateLeft(int k)</code>, a member of <code>DoubleLinkedList</code>, that moves the first <code>k</code> elements to the end, keeping their order. Assume at least 2 elements and <code>0 &le; k &le; size</code>. Do not call other methods or use auxiliary data structures. Example: 10, 20, 30, 40, 50 after <code>rotateLeft(2)</code> becomes 30, 40, 50, 10, 20.`,
  idea:`A "relink without allocating" question, the same family as <code>rotateRight</code>. It tests whether you can find the cut point and rewire the two ends of a doubly linked list.`,
  steps:[`Walk to the tail and count the nodes (n).`,`Edge cases: <code>k == 0</code> or <code>k == n</code> means no change.`,`Find the new head: the node at index k. Its <code>previous</code> is the new tail.`,`Connect the old tail to the old head in both directions, then cut at the new tail/new head and update <code>head</code>.`],
  sol:`public void rotateLeft(int k) {
  Node<T> tail = head;
  int n = 1;
  while (tail.next != null) { tail = tail.next; n++; }
  if (k == 0 || k == n) return;

  Node<T> newHead = head;
  for (int i = 0; i < k; i++) newHead = newHead.next;
  Node<T> newTail = newHead.previous;

  tail.next = head;          // old tail -> old head
  head.previous = tail;
  newTail.next = null;       // cut
  newHead.previous = null;
  head = newHead;
}`,
  traps:[`Cutting before joining the ends can lose the old tail. Join first, then cut.`,`Remember <code>newHead.previous = null</code> (backward link), not just <code>newTail.next = null</code>.`]},
 {id:'l5d2', src:'Tutorial 3 · P4', bucket:'list', time:'8 min', title:'reverseCopy: copy backwards into l2',
  q:`Write <code>public static &lt;T&gt; void reverseCopy(DoubleLinkedList&lt;T&gt; l1, DoubleLinkedList&lt;T&gt; l2)</code>, a <b>user of the DLL</b>. Copy the elements of l1 into the empty list l2 in reverse order. l1's content must not change. Example: l1 = A, B, C, D gives l2 = D, C, B, A.`,
  idea:`Because the user may call <code>findPrevious()</code>, walk l1 <u>backwards</u>. Each <code>l2.insert</code> lands after the previous one, so you append in the order you visit.`,
  steps:[`If l1 is empty, return.`,`Go to the last element of l1 (<code>findFirst</code>, then <code>findNext</code> until <code>last()</code>).`,`Loop: insert <code>l1.retrieve()</code> into l2, stop if <code>l1.first()</code>, else <code>l1.findPrevious()</code>.`],
  sol:`public static <T> void reverseCopy(DoubleLinkedList<T> l1,
                                   DoubleLinkedList<T> l2) {
  if (l1.empty()) return;
  l1.findFirst();
  while (!l1.last()) l1.findNext();
  while (true) {
    l2.insert(l1.retrieve());
    if (l1.first()) break;
    l1.findPrevious();
  }
}`,
  traps:[`Checking <code>first()</code> <u>after</u> inserting. Check before moving, or the first element is skipped.`]},
 {id:'l5d3', src:'Tutorial 3 · P3', bucket:'list', time:'10 min', title:'removeBetween(e1, e2)',
  q:`Write <code>public void removeBetween(T e1, T e2)</code>, a member of <code>DoubleLinkedList</code>. It removes every element strictly between e1 and e2 (e1 comes first). If e1 or e2 is missing, nothing changes. Elements are unique. Do not call other methods or use auxiliary data structures. Example: A, B, C, D, E, F with <code>removeBetween('B','E')</code> gives A, B, E, F.`,
  idea:`Find two anchor nodes, then do <u>one</u> splice instead of deleting node by node. Efficient, and the "no methods" rule tells you to work with raw pointers.`,
  steps:[`Find the node p holding e1. If not found, return.`,`Starting from <code>p.next</code>, find the node q holding e2. If not found, return.`,`Splice: <code>p.next = q; q.previous = p;</code> The middle nodes are now unreachable.`,`Mention: if <code>current</code> may point into the removed part, reset it (for example <code>current = head</code>).`],
  sol:`public void removeBetween(T e1, T e2) {
  Node<T> p = head;
  while (p != null && !p.data.equals(e1)) p = p.next;
  if (p == null) return;

  Node<T> q = p.next;
  while (q != null && !q.data.equals(e2)) q = q.next;
  if (q == null) return;

  p.next = q;
  q.previous = p;
}`,
  traps:[`Search for e2 <u>after</u> p, otherwise an e2 that appears before e1 is mistakenly accepted.`,`Update <u>both</u> links of the splice.`]}
]});

TOPICS.push({
id:'l6', mod:'lists', title:'Writing methods as a user of the List ADT', odds:'high', time:'15 min',
idea:`With only <code>findFirst/findNext/retrieve/insert/remove/last/empty</code>, you build every algorithm from three moves: <b>walk</b> to a position, <b>take</b> an element out (retrieve + remove), <b>put</b> it somewhere (go to last + insert).`,
points:[
 `<b>Append = go to the last element, then <code>insert</code>.</b> Insert always goes after current.`,
 `<b>After <code>remove()</code>, current is already the successor.</b> Do <u>not</u> call <code>findNext()</code> again, or you skip an element.`,
 `<b>Removing the last element sends current back to the first.</b> A loop that does not notice this runs forever. Record <code>wasLast = l.last()</code> <u>before</u> removing.`,
 `<b>"No auxiliary data structures"</b> means do it in place with remove + insert. If a stack or queue is allowed, it often simplifies reverse-like questions.`,
 `<b>Index i</b> means <code>findFirst()</code> then <code>findNext()</code> i times.`
],
code:`// Move to index i
l.findFirst();
for (int k = 0; k < i; k++) l.findNext();

// Append e at the end
while (!l.last()) l.findNext();
l.insert(e);

// Delete while scanning (safe pattern)
boolean wasLast = l.last();
l.remove();                 // current is now the successor...
if (wasLast) return;        // ...or the head if we removed the last`,
traps:[
 `Walking to the last element of an <u>empty</u> list (after removing the only element). Guard with <code>if (!l.empty())</code>.`,
 `Forgetting that <code>insert</code> on a non-empty list needs a valid current.`
],
quiz:[
 {q:`A user loop removes elements equal to x. After <code>l.remove()</code> the next line is <code>l.findNext()</code>. What is the bug?`, o:[`remove already moved current to the successor, so one element is skipped`,`remove does not change current`,`findNext is illegal after remove`,`There is no bug`], a:0, w:`The successor is already current. Calling <code>findNext()</code> as well jumps over it.`},
 {q:`You remove the <i>last</i> element of a list inside a loop. Where is current afterwards?`, o:[`Past the end`,`null`,`On the first element`,`On the previous element`], a:2, w:`No successor exists, so current is the first element. A loop must detect this to avoid cycling forever.`},
 {q:`To append e at the end using only the ADT you:`, o:[`call <code>insert(e)</code> straight away`,`move to the last element, then call <code>insert(e)</code>`,`call <code>findFirst()</code> then <code>insert(e)</code>`,`call <code>update(e)</code>`], a:1, w:`Insert goes after current, so current must be last first.`},
 {q:`How do you go to index 3?`, o:[`<code>l.find(3)</code>`,`<code>findFirst()</code> then <code>findNext()</code> three times`,`<code>findNext()</code> four times`,`<code>retrieve(3)</code>`], a:1, w:`The ADT has no random access.`}
],
drills:[
 {id:'l6d1', src:'Tutorial 3 · P1.2', bucket:'list', time:'9 min', title:'reverse as a user of the List ADT',
  q:`Write <code>public static &lt;T&gt; void reverse(List&lt;T&gt; l)</code> as a <b>user of the List ADT</b>. Example: 20, 11, 44, 33 becomes 33, 44, 11, 20. You may use a <code>Stack</code>.`,
  idea:`A stack reverses order for free. The pattern is: copy out, clear, copy back.`,
  steps:[`If empty, return.`,`Traverse once, pushing every element onto a stack (include the last one).`,`Clear the list with <code>while(!l.empty()) l.remove();</code>`,`Pop each element and <code>insert</code> it: each insert goes after the previous, so the order is the pop order.`],
  sol:`public static <T> void reverse(List<T> l) {
  if (l.empty()) return;
  Stack<T> st = new LinkedStack<T>();
  l.findFirst();
  while (!l.last()) {
    st.push(l.retrieve());
    l.findNext();
  }
  st.push(l.retrieve());          // last element

  while (!l.empty()) l.remove();  // clear
  while (!st.empty()) l.insert(st.pop());
}`,
  traps:[`Missing the last element in the first loop.`,`Clearing by repeated <code>remove()</code> works because each remove shrinks the list until <code>empty()</code>.`]},
 {id:'l6d2', src:'Tutorial 3 · P2', bucket:'list', time:'8 min', title:'circularLeftShift(l, n)',
  q:`Write <code>circularLeftShift(List&lt;T&gt; l, int n)</code>, a user of the ADT, on a non-empty list. One left shift moves the first element to the end. Example: A, B, C, D, E with n = 2 gives C, D, E, A, B.`,
  idea:`Repeat a single shift n times. One shift = take the head out, walk to the end, insert it. A nice example of "take then put".`,
  steps:[`Loop n times.`,`<code>findFirst()</code>, save <code>e = retrieve()</code>, <code>remove()</code>.`,`If the list is not empty, walk to the last element. If it became empty, skip the walk.`,`<code>insert(e)</code>.`],
  sol:`public static <T> void circularLeftShift(List<T> l, int n) {
  for (int k = 0; k < n; k++) {
    l.findFirst();
    T e = l.retrieve();
    l.remove();
    if (!l.empty())
      while (!l.last()) l.findNext();
    l.insert(e);
  }
}`,
  traps:[`A one-element list becomes empty after <code>remove()</code>; calling <code>last()</code> on it would violate the spec.`]},
 {id:'l6d3', src:'Problem set 3.1.4', bucket:'list', time:'8 min', title:'moveToEnd(l, i)',
  q:`Write <code>moveToEnd(List&lt;T&gt; l, int i)</code>, a user of the ADT, with no auxiliary data structures. It moves the element at index i to the end. Example: a, c, d, b, r, x with i = 2 gives a, c, b, r, x, d.`,
  idea:`Same take-then-put move, but at an arbitrary index. Tests index walking and what current is after <code>remove</code>.`,
  steps:[`Walk to index i.`,`Save the element, <code>remove()</code>.`,`Walk to the last element (if the list is not empty). Removing the last element sent current to the head, but walking forward still works.`,`<code>insert</code> the saved element.`],
  sol:`public static <T> void moveToEnd(List<T> l, int i) {
  l.findFirst();
  for (int k = 0; k < i; k++) l.findNext();
  T e = l.retrieve();
  l.remove();
  if (!l.empty())
    while (!l.last()) l.findNext();
  l.insert(e);
}`,
  traps:[]},
 {id:'l6d4', src:'Original · remove all', bucket:'list', time:'10 min', title:'removeAll(l, e) without skipping or cycling',
  q:`Write <code>removeAll(List&lt;T&gt; l, T e)</code>, a user of the ADT, that removes every occurrence of e. The list may be empty. Example: 2, 1, 3, 2, 4, 2 with e = 2 gives 1, 3, 4.`,
  idea:`The "delete while scanning" pattern. This is the question that punishes both mistakes from the notes: skipping the successor, and looping forever when the last element is removed.`,
  steps:[`Empty list: return. Otherwise <code>findFirst()</code>.`,`Loop while the list is not empty. If current matches: remember <code>wasLast = l.last()</code>, then <code>remove()</code>. If <code>wasLast</code>, the cursor wrapped to the head, so stop. Otherwise do <u>not</u> advance.`,`If it does not match: stop if last, else <code>findNext()</code>.`],
  sol:`public static <T> void removeAll(List<T> l, T e) {
  if (l.empty()) return;
  l.findFirst();
  while (!l.empty()) {
    if (l.retrieve().equals(e)) {
      boolean wasLast = l.last();
      l.remove();              // current = successor (or head)
      if (wasLast) return;     // wrapped around: finished
    } else {
      if (l.last()) return;
      l.findNext();
    }
  }
}`,
  traps:[`No <code>findNext()</code> after a successful remove.`,`Stop when the removed element was the last one.`]}
]});

TOPICS.push({
id:'l7', mod:'lists', title:'Member methods: pointer surgery', odds:'high', time:'18 min',
idea:`"Member of the class" means you work directly on <code>head</code>, <code>next</code>, <code>previous</code>. The exam usually adds "do not call other methods" and "no auxiliary structures". The marks are in choosing the right stopping node and relinking in a safe order.`,
points:[
 `<b>Five-step routine.</b> (1) Draw before and after. (2) Name the nodes you need (<code>p</code>, <code>q</code>). (3) Loop to reach them. Stop at the <i>predecessor</i> when you will modify its <code>next</code>. (4) Relink, new node first. (5) Fix <code>head</code> and <code>current</code>, and test empty, one node, head and tail cases.`,
 `<b>Safe order for inserting n after p:</b> <code>n.next = p.next; p.next = n;</code> (reverse order loses the tail).`,
 `<b>Loop conditions:</b> use <code>p != null</code> to visit all nodes, <code>p.next != null</code> to stop on the last node, <code>p.next != target</code> to stop on the predecessor.`,
 `<b>"Trace the mystery method"</b> questions: run the code on paper with a picture of the nodes; track every pointer variable in a small table.`
],
traps:[
 `Dereferencing <code>p.next.next</code> without checking <code>p.next</code>.`,
 `Forgetting that the head has no predecessor: handle <code>i == 0</code> separately.`,
 `Leaving <code>current</code> pointing at a node you just unlinked.`
],
quiz:[
 {q:`To insert node n <i>after</i> p in a singly linked list, the safe statement order is:`, o:[`<code>p.next = n; n.next = p.next;</code>`,`<code>n.next = p.next; p.next = n;</code>`,`<code>n.next = p; p.next = n;</code>`,`Any order works`], a:1, w:`Hook n to the rest first, then expose n. Reversed, <code>n.next = p.next</code> would point n to itself.`},
 {q:`You want to delete node t (not the head) from a singly linked list. The loop should stop when:`, o:[`<code>p == t</code>`,`<code>p.next == t</code>`,`<code>p.next == null</code>`,`<code>p == null</code>`], a:1, w:`You need the predecessor so you can write <code>p.next = t.next</code>.`},
 {q:`<code>while (p.next != null) p = p.next;</code> leaves p on:`, o:[`null`,`The last node`,`The second last node`,`The head`], a:1, w:`The loop stops as soon as p has no next: p is the last node.`},
 {q:`Which special case does <code>insertBefore(e, i)</code> on a singly linked list need that <code>insertAfter</code> does not?`, o:[`Empty list`,`i = 0 (insert before the head)`,`The last position`,`None`], a:1, w:`Inserting before index 0 changes <code>head</code>; for i &gt; 0 you stop at index i-1.`}
],
drills:[
 {id:'l7d1', src:'Problem set 3.2.4', bucket:'list', time:'9 min', title:'insertBefore(e, i) on LinkedList',
  q:`As a member of <code>LinkedList&lt;T&gt;</code> write <code>public void insertBefore(T e, int i)</code> that inserts e before index i (0-based, i valid). Do not call other methods or use auxiliary structures. Example: A, B, C, D, E with <code>insertBefore('N', 4)</code> gives A, B, C, D, N, E. The new element becomes current.`,
  idea:`Classic "stop at the predecessor" with a separate head case.`,
  steps:[`Create the node.`,`If i == 0: attach to head and update <code>head</code>.`,`Otherwise walk i-1 steps from head to reach the predecessor p.`,`<code>n.next = p.next; p.next = n;</code> then set current.`],
  sol:`public void insertBefore(T e, int i) {
  Node<T> n = new Node<T>(e);
  if (i == 0) {
    n.next = head;
    head = n;
  } else {
    Node<T> p = head;
    for (int k = 0; k < i - 1; k++) p = p.next;
    n.next = p.next;
    p.next = n;
  }
  current = n;
}`,
  traps:[`Check the statement for what current should be after insertion. Here we follow the usual insert rule.`]},
 {id:'l7d2', src:'Problem set 3.2.6', bucket:'list', time:'8 min', title:'removeOddElems: delete positions 1, 3, 5...',
  q:`Write <code>public void removeOddElems()</code>, a member of <code>LinkedList</code>, that removes the elements at odd positions (first element is position 0). No other methods, no auxiliary structures. Example: A, B, C, D, E becomes A, C, E.`,
  idea:`A "skip-link" loop: stay on even nodes and unlink the node after them. One pass, O(n).`,
  steps:[`Start p at head.`,`While p and p.next exist: <code>p.next = p.next.next</code> (this drops the odd node), then <code>p = p.next</code> (the next even node).`,`Reset current so it is not left on a removed node.`],
  sol:`public void removeOddElems() {
  Node<T> p = head;
  while (p != null && p.next != null) {
    p.next = p.next.next;   // drop the odd node
    p = p.next;             // next even node
  }
  current = head;
}`,
  traps:[`Do not advance twice. After dropping one node, a single <code>p = p.next</code> lands on the next kept node.`]},
 {id:'l7d3', src:'Problem set 3.6.1', bucket:'list', time:'10 min', title:'Trace the mystery method (DLL)',
  q:`The method below is a member of <code>DoubleLinkedList</code>. Give the list after (a) <code>l.f(1)</code> (b) <code>l.f(0)</code> (c) <code>l.f(2)</code> (d) <code>l.f(5)</code>, each starting from A, B, C, D, E.
<pre class="code">public void f(int n) {
  Node&lt;T&gt; p = head, q;
  for (int i = 0; i &lt; n; i++)
    if (p.next != null) p = p.next;
  if (p != null &amp;&amp; p.next != null) {
    q = p;
    while (q.next != null) q = q.next;
    q.previous.next = null;
    q.previous = null;
    q.next = p;
    p.previous = q;
    head = q;
  }
}</pre>`,
  idea:`Tracing, not coding. Read the code as three phases: (1) move p forward n times without passing the last node, (2) find the last node q, (3) detach q and make it the new head, linked directly to p. Everything before p becomes unreachable.`,
  steps:[`Phase 1 first: where does p stop for each n?`,`If p is the last node (<code>p.next == null</code>), nothing happens.`,`Otherwise: q = last node. Cut q off, then <code>q.next = p</code>, <code>head = q</code>.`,`Write the resulting chain starting from the new head.`],
  lang:'text',
  sol:`(a) f(1): p = B, q = E   ->  E B C D
(b) f(0): p = A, q = E   ->  E A B C D
(c) f(2): p = C, q = E   ->  E C D
(d) f(5): p stops on E (p.next == null), no change -> A B C D E`,
  traps:[`In (a) and (c) the nodes before p vanish from the list: head jumps straight to q, whose next is p.`,`In (d) the loop cannot move p past the last node.`]}
]});

TOPICS.push({
id:'l8', mod:'lists', title:'Recursion on lists', odds:'med', time:'12 min',
idea:`Two recursion shapes. On <b>nodes</b>: a private helper takes a <code>Node p</code> and recurses on <code>p.next</code>, with base case <code>p == null</code>; the public method just calls it with <code>head</code>. As a <b>user of the ADT</b>: current is the moving index; the base case is <code>l.last()</code> and you call <code>findNext()</code> before recursing.`,
points:[
 `<b>Pattern for node recursion:</b> base case, recurse on the rest, combine.`,
 `<b>Reversing recursively:</b> reverse the tail, then make the old second node point back to the first, and cut the first's <code>next</code>. Return the <u>new head</u> (the old last node).`,
 `The public wrapper is not recursive: <code>head = recReverse(head);</code>`,
 `User-of-ADT recursion changes <code>current</code> as a side effect. If the question says the list must be unchanged, plan how to restore it (for example <code>findFirst()</code> at the end).`
],
code:`private Node<T> recReverse(Node<T> p) {
  if (p == null || p.next == null) return p;     // base: 0 or 1 node
  Node<T> newHead = recReverse(p.next);          // reverse the rest
  p.next.next = p;                               // second node points back
  p.next = null;                                 // old first becomes last
  return newHead;
}
public void reverse() { head = recReverse(head); }`,
traps:[
 `Forgetting to set <code>p.next = null</code>: creates a cycle.`,
 `Forgetting to return the new head from every level.`
],
quiz:[
 {q:`In <code>recReverse</code>, what does the recursive call return?`, o:[`The old head`,`The new head of the reversed rest (the old last node)`,`null always`,`The node count`], a:1, w:`Every level passes the same new head upward; only the pointers around p change.`},
 {q:`Base case for a recursive method over <code>Node p</code> that processes every node:`, o:[`<code>p.next == null</code> only`,`<code>p == null</code>`,`<code>p == head</code>`,`<code>size == 0</code>`], a:1, w:`<code>p == null</code> handles the empty list and the end of every list. Use <code>p.next == null</code> only when you must process the last node specially.`},
 {q:`Recursive user-of-ADT method on a non-empty list: the base case is usually:`, o:[`<code>l.empty()</code>`,`<code>l.last()</code>`,`<code>l.first()</code>`,`<code>l.full()</code>`], a:1, w:`Each call handles current, then moves with <code>findNext()</code> and recurses until the last element.`}
],
drills:[
 {id:'l8d1', src:'Problem set 3.3.1', bucket:'list', time:'8 min', title:'Recursive reverse of a LinkedList',
  q:`Write a recursive method, member of <code>LinkedList</code>, that reverses the list (no auxiliary structures). Provide the private recursive method and the public wrapper.`,
  idea:`Recursion on the tail: trust that the call reverses the rest, then fix the two pointers around the current node.`,
  steps:[`Base case: empty list or single node returns p.`,`<code>newHead = recReverse(p.next)</code>.`,`<code>p.next.next = p</code> (now the second node points back); <code>p.next = null</code>.`,`Return newHead; the wrapper assigns <code>head</code>.`],
  sol:`private Node<T> recReverse(Node<T> p) {
  if (p == null || p.next == null) return p;
  Node<T> newHead = recReverse(p.next);
  p.next.next = p;
  p.next = null;
  return newHead;
}
public void reverse() { head = recReverse(head); }`,
  traps:[]},
 {id:'l8d2', src:'Problem set 3.4', bucket:'list', time:'9 min', title:'isSorted(List<Integer>) recursively',
  q:`Write a recursive method, user of the ADT, that returns true if a list of integers is sorted in increasing order (non-decreasing is fine). An empty list is sorted.`,
  idea:`Compare current with the next element, then recurse from the next position. Base case: current is last.`,
  steps:[`Empty: true. Otherwise <code>findFirst()</code> and call a recursive helper.`,`Helper: if <code>l.last()</code> return true. Read current, <code>findNext()</code>, read the next value.`,`Return <code>a &lt;= b &amp;&amp; helper(l)</code> (current is already on b for the next call).`],
  sol:`public static boolean isSorted(List<Integer> l) {
  if (l.empty()) return true;
  l.findFirst();
  return isSortedRec(l);
}
private static boolean isSortedRec(List<Integer> l) {
  if (l.last()) return true;
  int a = l.retrieve();
  l.findNext();
  int b = l.retrieve();
  return a <= b && isSortedRec(l);
}`,
  traps:[`The helper leaves current somewhere in the list. Restore with <code>findFirst()</code> if the question requires the list to be unchanged.`]}
]});
