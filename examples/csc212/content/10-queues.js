/* ============================ QUEUES ============================ */
TOPICS.push({
id:'q1', mod:'queues', title:'Queue ADT and linked queue', odds:'high', time:'10 min',
idea:`A queue is <b>FIFO</b>: elements enter at the <b>tail</b> and leave from the <b>head</b>. The interface has four operations: <code>enqueue, serve, length, full</code>. The linked version keeps <code>head</code>, <code>tail</code> and <code>size</code>, so everything is O(1).`,
points:[
 `<b>enqueue(e):</b> add at the tail. <b>serve():</b> remove and return the head element. <b>length():</b> number of elements. <b>full():</b> always false for the linked version.`,
 `<code>enqueue</code> has two cases: empty queue (head = tail = new node) or not (<code>tail.next = new node; tail = tail.next</code>).`,
 `<code>serve</code> saves <code>head.data</code>, moves <code>head</code>, decrements size, and when the queue becomes empty it must also set <code>tail = null</code>.`,
 `<b>You cannot look at the head without removing it.</b> The ADT has no peek. To "enquire", serve it and cycle the queue (see the next topics).`
],
fig:[
 {kind:'chain', cap:'serve() takes from the head; enqueue(D) adds after the tail', nodes:['A','B','C'], tags:{0:'head',2:'tail'}},
 {kind:'chain', cap:'After serve() then enqueue(D)', nodes:['B','C','D'], tags:{0:'head',2:'tail'}, fresh:[2]}
],
code:`public interface Queue<T> {
  T serve();
  void enqueue(T e);
  int length();
  boolean full();
}

public void enqueue(T e) {
  if (tail == null) {
    head = tail = new Node<T>(e);
  } else {
    tail.next = new Node<T>(e);
    tail = tail.next;
  }
  size++;
}

public T serve() {
  T x = head.data;
  head = head.next;
  size--;
  if (size == 0) tail = null;
  return x;
}`,
traps:[
 `Forgetting <code>tail = null</code> in <code>serve</code> when the last element leaves. The next <code>enqueue</code> would then append to a dead node.`,
 `Mixing up where elements enter and leave: in = tail, out = head.`
],
quiz:[
 {q:`Start empty. Operations: enqueue A, enqueue B, enqueue C, serve, enqueue D, serve. What did the <i>last</i> serve return and what is left?`, o:[`A; B C D remain`,`B; C D remain`,`C; B D remain`,`D; A B C remain`], a:1, w:`First serve returns A. Queue is B C D. The second serve returns B, leaving C D.`},
 {q:`Which pointer changes in <code>enqueue</code> on a non-empty linked queue?`, o:[`<code>head</code>`,`<code>tail</code>`,`Both`,`Neither`], a:1, w:`Only the tail moves to the new node (head stays on the first element).`},
 {q:`Why does <code>serve()</code> set <code>tail = null</code> when the queue empties?`, o:[`To free the head`,`So the next enqueue sees an empty queue and sets head and tail correctly`,`It is optional`,`Because tail.next must be null`], a:1, w:`<code>enqueue</code> tests <code>tail == null</code> to decide whether the queue is empty.`},
 {q:`Complexity of enqueue and serve on the linked queue?`, o:[`O(n), O(1)`,`O(1), O(n)`,`O(1), O(1)`,`O(n), O(n)`], a:2, w:`Both operations touch only head or tail.`}
],
drills:[
 {id:'q1d1', src:'Lecture 12-14 · enquiry', bucket:'queue', time:'7 min', title:'enquiry: read the head without losing it',
  q:`As a <b>user of the Queue ADT</b>, write <code>public static &lt;T&gt; T enquiry(Queue&lt;T&gt; q)</code> that returns the head element but leaves the queue exactly as it was. Then write the one-line versions as a <i>member</i> of <code>LinkedQueue</code> and <code>ArrayQueue</code>.`,
  idea:`The cycle trick. The queue has no peek, so remove-and-re-add every element so it comes back in the same order. The member versions show why implementers do not need it.`,
  steps:[`Serve the first element and keep it in a variable.`,`Put it back with enqueue. It is now at the tail.`,`Rotate the other <code>length()-1</code> elements, so the first goes back to the front.`,`Return the saved value.`],
  sol:`public static <T> T enquiry(Queue<T> q) {
  T data = q.serve();
  q.enqueue(data);
  for (int i = 0; i < q.length() - 1; i++)
    q.enqueue(q.serve());
  return data;
}

// member of LinkedQueue
public T enquiry() { return head.data; }
// member of ArrayQueue
public T enquiry() { return nodes[head]; }`,
  traps:[`Rotating <code>length()-1</code> times, not <code>length()</code>. One element is already at the tail.`]}
]});

TOPICS.push({
id:'q2', mod:'queues', title:'Circular array queue and member methods', odds:'high', time:'14 min',
idea:`The array queue uses <code>head</code> and <code>tail</code> indices that <b>wrap around</b> with modulo, plus a <code>size</code> counter. Wrap-around avoids shifting, which keeps both <code>enqueue</code> and <code>serve</code> O(1).`,
points:[
 `<b>enqueue:</b> <code>nodes[tail] = e; tail = (tail + 1) % maxsize; size++</code>. <b>serve:</b> <code>e = nodes[head]; head = (head + 1) % maxsize; size--</code>.`,
 `<code>tail</code> is the <u>next free slot</u>, <code>head</code> is the oldest element.`,
 `<code>full: size == maxsize</code>, <code>length: size</code>. The counter exists because <code>head == tail</code> is true for both an empty and a full queue.`,
 `<b>Member method costs:</b> in the array queue, removing the first k elements is just <code>head = (head + k) % maxsize; size -= k;</code> which is O(1). In the linked queue you must walk k nodes: O(k).`
],
fig:[
 {kind:'array', cap:'maxsize = 4. Three elements, tail has wrapped to index 0', cells:['','B','C','D'], tags:{1:'head',0:'tail'}},
 {kind:'array', cap:'enqueue(E): nodes[0] = E, tail = (0 + 1) % 4 = 1. The queue is full', cells:['E','B','C','D'], tags:{1:'head = tail'}, fresh:[0]}
],
code:`public void enqueue(T e) {
  nodes[tail] = e;
  tail = (tail + 1) % maxsize;
  size++;
}

public T serve() {
  T e = nodes[head];
  head = (head + 1) % maxsize;
  size--;
  return e;
}

// member methods
public void remove(int k) {            // ArrayQueue: O(1)
  head = (head + k) % maxsize;
  size -= k;
}`,
traps:[
 `Writing <code>tail++</code> without <code>% maxsize</code>: index out of bounds at the end of the array.`,
 `Computing size from head and tail only: ambiguous when they are equal.`
],
quiz:[
 {q:`<code>maxsize = 5</code>, <code>tail = 4</code>. After one <code>enqueue</code>, tail is:`, o:[`5`,`0`,`4`,`1`], a:1, w:`(4 + 1) % 5 = 0: the tail wraps to the start of the array.`},
 {q:`Why does the course implementation keep a <code>size</code> field?`, o:[`To speed up serve`,`Because <code>head == tail</code> cannot tell an empty queue from a full one`,`To store the max size`,`It does not, it uses head and tail only`], a:1, w:`When the queue fills, tail wraps and meets head again.`},
 {q:`<code>maxsize = 4</code>, head = 2, size = 3. Where will the next <code>enqueue</code> write, and what is the new tail?`, o:[`Index 5, tail 6`,`Index 1, tail 2`,`Index 0, tail 1`,`Index 3, tail 0`], a:1, w:`Elements occupy indices 2, 3, 0, so the next free slot is index 1; tail = (1+1)%4 = 2 (which equals head only because the queue is now full).`},
 {q:`Removing the first k elements from an <code>ArrayQueue</code> can be done in:`, o:[`O(k)`,`O(n)`,`O(1)`,`O(k²)`], a:2, w:`Just advance head by k (mod maxsize) and subtract k from size.`}
],
drills:[
 {id:'q2d1', src:'Problem set 4.2.3-4.2.4', bucket:'queue', time:'8 min', title:'remove(k) in both queues',
  q:`Write <code>void remove(int k)</code>, which removes the first k elements (k is valid), as a member of (a) <code>LinkedQueue</code>, running in O(k), and (b) <code>ArrayQueue</code>, running in O(1).`,
  idea:`Choose the algorithm that matches the required complexity: walk k nodes versus jump an index.`,
  steps:[`Linked: advance head k times; fix size; if the queue became empty set tail to null.`,`Array: move head k places with modulo; subtract k from size. No loop.`],
  sol:`// LinkedQueue  O(k)
public void remove(int k) {
  for (int i = 0; i < k; i++)
    head = head.next;
  size -= k;
  if (size == 0) tail = null;
}

// ArrayQueue  O(1)
public void remove(int k) {
  head = (head + k) % maxsize;
  size -= k;
}`,
  traps:[`Linked: forgetting <code>tail = null</code> when everything is removed.`]},
 {id:'q2d2', src:'Problem set 4.2.1', bucket:'queue', time:'9 min', title:'reverse() for LinkedQueue',
  q:`Write <code>public void reverse()</code>, a member of <code>LinkedQueue</code>, which reverses the order of the elements in place.`,
  idea:`Reverse the next-pointers while walking once (the three-pointer technique), then swap the roles of head and tail.`,
  steps:[`The old head will be the new tail, so set <code>tail = head</code> first.`,`Walk with <code>prev</code> and <code>p</code>: save <code>p.next</code>, point <code>p.next</code> backwards, advance.`,`At the end <code>prev</code> is the new head.`],
  sol:`public void reverse() {
  Node<T> prev = null, p = head;
  tail = head;
  while (p != null) {
    Node<T> nx = p.next;
    p.next = prev;
    prev = p;
    p = nx;
  }
  head = prev;
}`,
  traps:[`Losing the rest of the list by writing <code>p.next = prev</code> before saving <code>p.next</code>.`]}
]});

TOPICS.push({
id:'q3', mod:'queues', title:'User-of-ADT queue methods: the cycle trick', odds:'high', time:'16 min',
idea:`Almost every "user of the Queue ADT" question uses one idea: <b>serve each of the <code>n</code> elements once and enqueue it back (or not)</b>. After exactly <code>n</code> rounds the queue is back in its original order, with whatever you filtered, swapped or inspected along the way.`,
points:[
 `<b>Fix n first:</b> <code>int n = q.length();</code> and loop <code>for (i &lt; n)</code>. If you test <code>q.length()</code> in the loop condition while enqueuing back, the loop never ends.`,
 `<b>Keep the queue unchanged</b> when asked: re-enqueue every element, and never return early before the cycle is complete.`,
 `<b>Filtering</b> (remove an element): re-enqueue only the ones you want to keep.`,
 `<b>Needs a second structure?</b> A stack reverses; a second queue copies. Check whether "no auxiliary data structures" is stated.`,
 `<b>Priority queues cannot be cycled this way</b> (see the PQ topic).`
],
code:`int n = q.length();
for (int i = 0; i < n; i++) {
  T x = q.serve();
  // decide: inspect, modify, or skip
  q.enqueue(x);            // put back (omit to delete)
}`,
traps:[
 `Early <code>return false</code> inside the cycle: the queue is left half-rotated. Remember the result in a flag and finish the loop.`,
 `Using <code>q.length()</code> as the loop bound after elements have been removed.`
],
quiz:[
 {q:`After <code>int n = q.length(); for(i&lt;n){ q.enqueue(q.serve()); }</code> the queue is:`, o:[`Reversed`,`Empty`,`In its original order`,`Rotated by one`], a:2, w:`Each of the n elements is served and re-enqueued exactly once, so the original order returns.`},
 {q:`Why must n be stored before the loop?`, o:[`length() is slow`,`Elements are re-enqueued, but deletions change length(), so the bound would shift`,`It is a Java rule`,`To avoid null`], a:1, w:`When you drop elements the length shrinks during the loop; the stored n keeps the number of rounds equal to the original size.`},
 {q:`A method that checks "is the queue sorted?" returns false as soon as it sees a violation, without finishing the cycle. What is the consequence?`, o:[`None`,`The queue remains in rotated order, which breaks "must not change"`,`A compile error`,`The method returns true`], a:1, w:`The unserved remainder never gets re-enqueued correctly, so the order is damaged.`},
 {q:`To delete the first occurrence of e while keeping the rest in order (queue only, no extras) you:`, o:[`Serve everything into a stack`,`Cycle n times, skipping e once with a flag`,`Call remove on the ADT`,`Enqueue e twice`], a:1, w:`A boolean <code>found</code> flag lets you skip exactly one match.`}
],
drills:[
 {id:'q3d1', src:'Problem set 4.1.7', bucket:'queue', time:'7 min', title:'removeElement(q, e)',
  q:`Write <code>public static &lt;T&gt; void removeElement(Queue&lt;T&gt; q, T e)</code>: delete e from the queue while keeping the order of the others. No auxiliary data structures. (Delete the first occurrence.)`,
  idea:`The basic cycle with a skip. Establishes the template for the rest of the queue questions.`,
  steps:[`<code>n = q.length()</code>, <code>found = false</code>.`,`Each round: serve x. If <code>!found &amp;&amp; x.equals(e)</code>, set found and do not re-enqueue; otherwise re-enqueue.`],
  sol:`public static <T> void removeElement(Queue<T> q, T e) {
  int n = q.length();
  boolean found = false;
  for (int i = 0; i < n; i++) {
    T x = q.serve();
    if (!found && x.equals(e)) found = true;
    else q.enqueue(x);
  }
}`,
  traps:[`For "all occurrences", drop the flag.`]},
 {id:'q3d2', src:'Problem set 4.1.14', bucket:'queue', time:'9 min', title:'isOrdered(q): queue unchanged',
  q:`Write <code>public static boolean isOrdered(Queue&lt;Integer&gt; q)</code> for a non-empty queue: true iff the elements are in non-decreasing order from head to tail. The queue must be unchanged afterwards. Example: 1, 3, 5, 5, 10 gives true.`,
  idea:`Cycle with a "previous" variable. The trap is the early exit: you must finish the cycle to restore the order.`,
  steps:[`n = length. Serve the first element, re-enqueue it, remember it as <code>prev</code>.`,`For the remaining n-1 rounds: serve x, compare with prev, re-enqueue x, update prev. Record a violation in <code>ok</code> but do not return.`,`Return ok after the loop.`],
  sol:`public static boolean isOrdered(Queue<Integer> q) {
  int n = q.length();
  int prev = q.serve();
  q.enqueue(prev);
  boolean ok = true;
  for (int i = 1; i < n; i++) {
    int x = q.serve();
    if (x < prev) ok = false;
    prev = x;
    q.enqueue(x);
  }
  return ok;
}`,
  traps:[`Early return = broken queue.`]},
 {id:'q3d3', src:'Problem set 4.1.11', bucket:'queue', time:'9 min', title:'swapAdj(q): swap adjacent pairs',
  q:`Write <code>public static &lt;T&gt; void swapAdj(Queue&lt;T&gt; q)</code> that swaps each pair of adjacent elements. A leftover last element (odd length) stays. Example: A, B, C, D, E becomes B, A, D, C, E.`,
  idea:`Serve two, enqueue them in reverse order. Two local variables are the only "extra storage" you need.`,
  steps:[`n = length, i = 0.`,`While <code>i + 1 &lt; n</code>: serve a, serve b, enqueue b, enqueue a, i += 2.`,`If one element is left (<code>i &lt; n</code>), cycle it back unchanged.`],
  sol:`public static <T> void swapAdj(Queue<T> q) {
  int n = q.length();
  int i = 0;
  while (i + 1 < n) {
    T a = q.serve();
    T b = q.serve();
    q.enqueue(b);
    q.enqueue(a);
    i += 2;
  }
  if (i < n) q.enqueue(q.serve());
}`,
  traps:[`Forgetting the odd leftover element, which would vanish from the queue.`]},
 {id:'q3d4', src:'Problem set 4.1.3', bucket:'queue', time:'10 min', title:'isReverse(q1, q2)',
  q:`Write <code>public static &lt;T&gt; boolean isReverse(Queue&lt;T&gt; q1, Queue&lt;T&gt; q2)</code>: true iff q1's elements are exactly q2's in reverse order. Both queues must be unchanged.`,
  idea:`A stack naturally reverses. Push all of q1 (cycling it), then compare while cycling q2 and popping.`,
  steps:[`If lengths differ, return false.`,`Cycle q1: push every element onto a stack and enqueue it back.`,`Cycle q2: for each element compare with <code>st.pop()</code>, remember a mismatch, enqueue it back.`],
  sol:`public static <T> boolean isReverse(Queue<T> q1, Queue<T> q2) {
  if (q1.length() != q2.length()) return false;
  int n = q1.length();
  Stack<T> st = new LinkedStack<T>();
  for (int i = 0; i < n; i++) {
    T x = q1.serve();
    st.push(x);
    q1.enqueue(x);
  }
  boolean ok = true;
  for (int i = 0; i < n; i++) {
    T y = q2.serve();
    q2.enqueue(y);
    if (!st.pop().equals(y)) ok = false;
  }
  return ok;
}`,
  traps:[]},
 {id:'q3d5', src:'Tutorial 4 · P1', bucket:'queue', time:'10 min', title:'split(q, oq, eq)',
  q:`Write the <b>recursive</b> static method <code>split(Queue&lt;T&gt; q, Queue&lt;T&gt; oq, Queue&lt;T&gt; eq)</code>. Elements in odd positions (1st, 3rd, ...) go into oq, even positions into eq. q must be unchanged at the end. Example: (A, B, C, D, E) gives oq = (A, C, E), eq = (B, D).`,
  idea:`Recursion over the queue with a counter, using the cycle trick for restoring q. Because the signature has no counter, write a private helper that carries the position.`,
  steps:[`Public method: compute <code>n = q.length()</code> and call <code>helper(q, oq, eq, 0, n)</code>.`,`Helper base case: <code>i == n</code>, return.`,`Otherwise serve x, add it to oq if i is even (1st, 3rd...) else to eq, enqueue x back, recurse with <code>i + 1</code>.`],
  sol:`public static <T> void split(Queue<T> q, Queue<T> oq, Queue<T> eq) {
  splitRec(q, oq, eq, 0, q.length());
}
private static <T> void splitRec(Queue<T> q, Queue<T> oq,
                                 Queue<T> eq, int i, int n) {
  if (i == n) return;
  T x = q.serve();
  if (i % 2 == 0) oq.enqueue(x);   // positions 1st, 3rd, ...
  else            eq.enqueue(x);
  q.enqueue(x);                    // restore as we go
  splitRec(q, oq, eq, i + 1, n);
}`,
  traps:[`Index 0 is the <u>1st</u> element, so even <code>i</code> means odd position.`]}
]});

TOPICS.push({
id:'q4', mod:'queues', title:'Priority queue and deque', odds:'med', time:'14 min',
idea:`In a priority queue the <b>highest priority leaves first</b>. The linked version is kept <u>sorted by decreasing priority</u>: <code>serve</code> is O(1) (take the head) but <code>enqueue</code> is O(n) (find the position). A deque supports insert and remove at both ends.`,
points:[
 `<b>PQ enqueue(e, p):</b> if the queue is empty or <code>p &gt; head.priority</code>, insert at the front. Otherwise walk while <code>p &lt;= current.priority</code> and insert before the first lower priority. Equal priorities: the new element goes <u>after</u> existing ones (FIFO among equals).`,
 `<b>serve</b> returns a <code>PQElement</code> with fields <code>data</code> and <code>p</code> (priority), and removes the head.`,
 `<b>You cannot cycle a PQ like a plain queue.</b> Serving and re-enqueueing an element puts it back at its priority position (often the front), so you may serve the same element again. Move elements through a <u>temporary</u> structure.`,
 `<b>Deque:</b> <code>addFirst, addLast, removeFirst, removeLast, getFirst, getLast, size, empty</code>. With a doubly linked list or a circular array all are O(1); with a singly linked list <code>removeLast</code> is O(n).`
],
table:{head:['Operation','Queue (linked / array)','Priority queue (linked / array)'],rows:[
 ['full / length','O(1)','O(1)'],
 ['enqueue','O(1)|g','O(n)|b'],
 ['serve','O(1)','O(1)']
]},
code:`public void enqueue(T e, int pty) {
  PQNode<T> tmp = new PQNode<T>(e, pty);
  if (size == 0 || pty > head.priority) {
    tmp.next = head;
    head = tmp;
  } else {
    PQNode<T> p = head, q = null;
    while (p != null && pty <= p.priority) {
      q = p;
      p = p.next;
    }
    tmp.next = p;
    q.next = tmp;
  }
  size++;
}`,
traps:[
 `Treating a PQ like a queue in cycle-based solutions.`,
 `Wrong tie-breaking: with equal priorities the new element goes <u>behind</u> the old ones.`
],
quiz:[
 {q:`Linked PQ contains (A,10), (B,5), (C,3). Where does <code>enqueue(D, 5)</code> go?`, o:[`Before A`,`Between A and B`,`Between B and C`,`After C`], a:2, w:`D has the same priority as B and arrives later, so it goes after B (FIFO among equals), before C.`},
 {q:`Complexity of <code>enqueue</code> and <code>serve</code> in the linked PQ?`, o:[`O(1), O(1)`,`O(n), O(1)`,`O(1), O(n)`,`O(n), O(n)`], a:1, w:`Enqueue must find the right position; serve takes the head.`},
 {q:`A user removes all elements with priority below p by serving each element and re-enqueueing the ones to keep, in the same PQ. What happens?`, o:[`It works like a queue`,`Kept elements return to the front and can be served again, so the loop is wrong`,`The PQ throws an exception`,`Priorities are lost`], a:1, w:`Re-enqueue places the element by priority, usually ahead of the remaining items. Use a temporary PQ and refill.`},
 {q:`In a <b>singly linked</b> deque with only a head pointer, which operation is O(n)?`, o:[`addFirst`,`removeFirst`,`removeLast`,`getFirst`], a:2, w:`removeLast must find the second last node. A doubly linked list makes it O(1).`}
],
drills:[
 {id:'q4d1', src:'Tutorial 4 · P3', bucket:'impl', time:'9 min', title:'remove(pq, p): drop every element below p',
  q:`Write <code>public static &lt;T&gt; void remove(PriorityQueue&lt;T&gt; pq, int p)</code> as a user of the ADT: remove every element whose priority is less than p. Example: [A,10], [D,8], [B,5], [E,3], [C,2] with p = 5 gives [A,10], [D,8], [B,5].`,
  idea:`The "do not cycle a PQ" trap. Use a temporary PQ: move the elements to keep into it, then move them back.`,
  steps:[`Create <code>tmp</code>, a new PQ.`,`While <code>pq.length() &gt; 0</code>: serve an element; if its priority is &ge; p, enqueue it into tmp.`,`While tmp is not empty: serve from tmp and enqueue back into pq.`],
  sol:`public static <T> void remove(PriorityQueue<T> pq, int p) {
  PriorityQueue<T> tmp = new LinkedPQ<T>();
  while (pq.length() > 0) {
    PQElement<T> e = pq.serve();
    if (e.p >= p) tmp.enqueue(e.data, e.p);
  }
  while (tmp.length() > 0) {
    PQElement<T> e = tmp.serve();
    pq.enqueue(e.data, e.p);
  }
}`,
  traps:[`Do not use n rounds of serve + enqueue on pq itself.`]},
 {id:'q4d2', src:'Problem set 4.4.3-4.4.4', bucket:'impl', time:'12 min', title:'removePr and lowestPr in LinkedPQ',
  q:`As members of <code>LinkedPQ&lt;T&gt;</code> (fields <code>head</code>, <code>size</code>, nodes <code>PQNode</code> with <code>priority</code> and <code>next</code>), write (a) <code>public void removePr(int pr)</code> that removes every element with priority pr, and (b) <code>public int lowestPr()</code> that returns the lowest priority. Do not call other methods or use auxiliary structures. Example: 2, 3, 5, 7, 7, 9, 9, 9 with <code>removePr(9)</code> gives 2, 3, 5, 7, 7.`,
  idea:`A sorted linked list deletion with a head special case, repeated. The lowest priority is simply the last node.`,
  steps:[`removePr: first drop matching nodes at the head (loop). Then scan with <code>p</code> and delete matching <code>p.next</code> nodes without advancing.`,`Decrease size for each removed node.`,`lowestPr: walk to the last node and return its priority.`],
  sol:`public void removePr(int pr) {
  while (head != null && head.priority == pr) {
    head = head.next;
    size--;
  }
  PQNode<T> p = head;
  while (p != null && p.next != null) {
    if (p.next.priority == pr) {
      p.next = p.next.next;
      size--;
    } else {
      p = p.next;
    }
  }
}

public int lowestPr() {
  PQNode<T> p = head;
  while (p.next != null) p = p.next;
  return p.priority;
}`,
  traps:[`Advancing <code>p</code> after a deletion skips the node that moved up.`,`Forgetting <code>size--</code>.`]}
]});
