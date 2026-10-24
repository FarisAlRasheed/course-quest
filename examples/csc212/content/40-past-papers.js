/* ============================ EXAM PATTERNS (from the past papers) ============================ */
TOPICS.push({
id:'pp1', mod:'past', title:'Written Q2: queue methods', odds:'high', time:'25 min', seen:'Sp26 · Fa25 · Fa24 · Fa23 · Fa22 · Fa21',
idea:`Every recent midterm has a <b>25-mark queue method written by hand</b>. The ingredients never change: only <code>serve, enqueue, length, full</code>, the cycle trick, a counter or a flag, and sometimes a stack. Learn the shape once and you can write any of them.`,
points:[
 `<b>The real questions:</b> Spring 2026 <code>reverseK</code> (reverse the first k elements), Fall 2025 <code>moveAndRemove</code> (drop everything before x, return the count), Fall 2024 <code>replaceElements</code> (replace everything with x if x is missing), Fall 2023 <code>swapEnds</code> (swap first and last), Fall 2022 a queue built from <b>two stacks</b>.`,
 `<b>Five-step routine for the answer sheet:</b> (1) handle invalid input first (k out of range, fewer than 2 elements). (2) <code>int n = q.length();</code> before any loop. (3) decide what each round does: keep, drop, count, remember. (4) always finish the cycle so the queue is restored. (5) test your code on the example in the question.`,
 `<b>Fill-in-the-blank versions</b> appeared in 2021, 2023 and 2024: the same solution with blanks and five choices per line. Writing the full answer yourself first makes every blank easy.`,
 `<b>"Do not use additional data structures"</b> means the only memory you have is a few variables, so use the cycle trick or recursion. When a stack is allowed, it is the cleanest way to reverse.`
],
quiz:[
 {q:`<b>Fall 2023.</b> <code>swapEnds(q)</code> must swap the first and last elements, but the queue may be empty or hold one element. What is the first line of a correct answer?`, o:[`<code>T first = q.serve();</code>`,`<code>if (q.length() &lt; 2) return;</code>`,`<code>q.enqueue(q.serve());</code>`,`<code>int n = q.length() - 1;</code>`], a:1, w:`With fewer than two elements there is nothing to swap, and serving from an empty queue would break the precondition. Guard first.`},
 {q:`<b>Fall 2025.</b> <code>moveAndRemove(q, x)</code> (no duplicates) finds x, removes everything before it and returns how many were removed. If x is missing the queue must be unchanged and the method returns -1. After one full cycle you know <code>found</code> and <code>toRemove</code>. What next?`, o:[`Serve <code>toRemove</code> more times if found, otherwise return -1`,`Enqueue x again`,`Serve until the queue is empty`,`Return <code>q.length()</code>`], a:0, w:`The cycle restored the order, so the elements before x are at the front. Serving exactly <code>toRemove</code> of them leaves x at the head.`},
 {q:`<b>Fall 2024.</b> <code>replaceElements(q, x)</code>: if x is not in q, every element must become x. After the scan loop shows <code>found == false</code>, the replacement loop is:`, o:[`<code>for (i&lt;len) { q.enqueue(x); q.serve(); }</code>`,`<code>for (i&lt;len) { q.serve(); }</code>`,`<code>q.enqueue(x);</code> once`,`<code>while(!q.full()) q.enqueue(x);</code>`], a:0, w:`Each round adds x at the tail and removes one old element from the head. After len rounds all old elements are gone and len copies of x remain.`},
 {q:`In <code>reverseK(q, k)</code> using a stack, the order of the steps is:`, o:[`serve k into the stack, enqueue them back by popping, then rotate the other n-k elements`,`push all of q, then pop all`,`enqueue k elements, serve n-k`,`rotate n-k elements, then reverse the whole queue`], a:0, w:`Popping gives the k elements in reverse and puts them at the tail; the remaining n-k are still at the front, so rotate them behind.`}
],
viz:'qcycle',
drills:[
 {id:'pp1d1', real:true, src:'Spring 2026 · Q2 (25)', bucket:'queue', time:'12 min', title:'reverseK(q, k)',
  q:`As a <b>user</b> of the queue interface (<code>serve, enqueue, length, full</code> only), write <code>public static &lt;T&gt; void reverseK(Queue&lt;T&gt; q, int k)</code> that reverses the order of the first k elements and leaves the others in the same order. If k is invalid, q is unchanged. k is valid if it is in {1, ..., n}.<br>Example 1: q = 1,2,3,4,5,6,7,8,9 and k = 5 gives 5,4,3,2,1,6,7,8,9. Example 2: k = 12 leaves q unchanged.`,
  idea:`Reversal needs a stack (or recursion). The second half of the work is easy to forget: after the k elements are reversed at the tail, the untouched n-k elements must be rotated behind them.`,
  steps:[`Validate: if <code>k &lt; 1 || k &gt; n</code> return.`,`Serve k elements into a stack.`,`Pop the stack, enqueueing each: now the reversed k are at the tail.`,`Rotate the remaining n-k elements: serve each and enqueue it.`,`Check on the example: 1..9, k=5: after step 3 the queue is 6,7,8,9,5,4,3,2,1; rotating 4 elements gives 5,4,3,2,1,6,7,8,9.`],
  sol:`public static <T> void reverseK(Queue<T> q, int k) {
  int n = q.length();
  if (k < 1 || k > n) return;            // invalid k: unchanged
  Stack<T> st = new LinkedStack<T>();
  for (int i = 0; i < k; i++)
    st.push(q.serve());                  // first k into the stack
  while (!st.empty())
    q.enqueue(st.pop());                 // reversed k at the tail
  for (int i = 0; i < n - k; i++)
    q.enqueue(q.serve());                // rotate the other n-k behind
}

// If a stack is NOT allowed: recursion does the reversing
private static <T> void rev(Queue<T> q, int k) {
  if (k == 0) return;
  T x = q.serve();
  rev(q, k - 1);
  q.enqueue(x);
}
// reverseK: validate, rev(q, k), then rotate n-k elements as above`,
  traps:[`Forgetting the final rotation: you would get 6,7,8,9,5,4,3,2,1.`,`Using <code>q.length()</code> as a loop bound after the queue has shrunk. Store n first.`]},
 {id:'pp1d2', real:true, src:'Fall 2025 · Q2 (25)', bucket:'queue', time:'10 min', title:'moveAndRemove(q, x)',
  q:`As a user, write <code>public static &lt;T&gt; int moveAndRemove(Queue&lt;T&gt; q, T x)</code>. It searches for x. If x is found, it removes all elements <b>before</b> x and returns the number removed. Otherwise the queue is unchanged and it returns -1. No additional data structure; q has no duplicates.<br>Example 1: q = A,B,C,E,F,G and x = C returns 2 and q = C,E,F,G. Example 2: q = A,B,C,D,E and x = Y returns -1, q unchanged.`,
  idea:`A two-phase cycle: first cycle everything once to learn whether x exists and how many elements precede it, then (only if found) serve exactly that many.`,
  steps:[`Fix <code>length = q.length()</code>; set <code>toRemove = 0</code>, <code>found = false</code>.`,`Cycle all elements: serve e; if e equals x set found; else if not yet found, count it; enqueue e back.`,`If not found return -1.`,`Serve <code>toRemove</code> elements; return toRemove.`],
  sol:`public static <T> int moveAndRemove(Queue<T> q, T x) {
  int length = q.length();
  int toRemove = 0;
  boolean found = false;
  for (int i = 0; i < length; i++) {   // one full cycle
    T e = q.serve();
    if (e.equals(x))   found = true;
    else if (!found)   toRemove++;     // element before x
    q.enqueue(e);
  }
  if (!found) return -1;               // queue is already unchanged
  for (int i = 0; i < toRemove; i++)
    q.serve();                         // drop the elements before x
  return toRemove;
}`,
  traps:[`Counting elements <u>after</u> x as well: only count while <code>!found</code>.`,`Returning early inside the first loop leaves the queue rotated.`]},
 {id:'pp1d3', real:true, src:'Fall 2024 · Q2 (25)', bucket:'queue', time:'10 min', title:'replaceElements(q, x)',
  q:`As a user, write <code>public static &lt;T&gt; void replaceElements(Queue&lt;T&gt; q, T x)</code>. If x is <b>not</b> in q, replace all elements of q with x. Otherwise q stays unchanged. No additional data structures; q has no duplicates.<br>Example 1: q = A,B,D,E,F,G and x = C gives C,C,C,C,C,C. Example 2: q = A,B,C,D,E and x = E leaves q unchanged.`,
  idea:`Cycle once to search (which also restores the queue). Only if the search failed, run a second loop that pushes x in and drops the old element each round.`,
  steps:[`<code>len = q.length()</code>, <code>found = false</code>.`,`Cycle: serve e, compare with x, enqueue e back.`,`If not found: len rounds of <code>enqueue(x); serve();</code>.`],
  sol:`public static <T> void replaceElements(Queue<T> q, T x) {
  int len = q.length();
  boolean found = false;
  for (int i = 0; i < len; i++) {
    T e = q.serve();
    if (e.equals(x)) found = true;
    q.enqueue(e);
  }
  if (!found) {
    for (int i = 0; i < len; i++) {
      q.enqueue(x);
      q.serve();
    }
  }
}`,
  traps:[`Doing the replacement inside the first loop: you cannot know yet whether x exists.`]},
 {id:'pp1d4', real:true, src:'Fall 2023 · Q2 (25)', bucket:'queue', time:'8 min', title:'swapEnds(q)',
  q:`As a user, write <code>public static &lt;T&gt; void swapEnds(Queue&lt;T&gt; q)</code> that swaps the element in the first position with the element in the last position. The queue may be empty or have fewer than two elements.<br>Example 1: A,B,C,D,E,F becomes F,B,C,D,E,A. Example 2: 5,6,7,11,3,20 becomes 20,6,7,11,3,5.`,
  idea:`Hold the first element in a variable, rotate the middle so the last element comes to the front, then enqueue the held element. Three lines once you see it.`,
  steps:[`Guard: fewer than 2 elements, return.`,`Serve the first element and keep it.`,`Rotate <code>n-2</code> elements: the original last element is now at the head.`,`Enqueue the held first element at the tail.`],
  sol:`public static <T> void swapEnds(Queue<T> q) {
  int n = q.length();
  if (n < 2) return;
  T first = q.serve();
  for (int i = 0; i < n - 2; i++)
    q.enqueue(q.serve());      // middle moves behind; last comes to the front
  q.enqueue(first);
}`,
  traps:[`Rotating <code>n-1</code> times instead of <code>n-2</code>: the last element would end up behind the middle.`]},
 {id:'pp1d5', real:true, src:'Fall 2022 · Q2 (25)', bucket:'queue', time:'9 min', title:'A queue built from two stacks',
  q:`Complete <code>class QueueStack&lt;T&gt;</code>, which implements a queue (enqueue and serve) using two stacks <code>s1</code> and <code>s2</code> with only <code>push</code>, <code>pop</code> and <code>empty</code>. Write <code>enqueue(T x)</code> and <code>T serve()</code>. If the queue is empty, serve prints "Q is empty" and returns null.`,
  idea:`Keep the oldest element on top of s1. A new element must go to the <u>bottom</u> of s1, so move everything to s2, push the new one, then move everything back.`,
  steps:[`enqueue: pour s1 into s2 (reverses), push x onto the empty s1, pour s2 back (reverses again).`,`serve: if s1 is empty print the message and return null; otherwise pop s1.`],
  sol:`public void enqueue(T x) {
  while (!s1.empty()) s2.push(s1.pop());
  s1.push(x);
  while (!s2.empty()) s1.push(s2.pop());
}

public T serve() {
  if (s1.empty()) {
    System.out.println("Q is empty");
    return null;
  }
  return s1.pop();
}`,
  traps:[`Returning from serve without checking <code>empty()</code>: <code>pop</code> on an empty stack breaks.`]}
]});

TOPICS.push({
id:'pp2', mod:'past', title:'Written Q4: list methods and classes', odds:'high', time:'30 min', seen:'Sp26 · Fa25 · Fa24 · Fa23 · Fa21',
idea:`The last question (30-35 marks) is a <b>linked-list method or a small class</b>, written by hand on numbered lines, or as fill-in-the-blank with five choices per line. It is pure pointer work: walk with <code>p</code> (and a trailing <code>q</code> when you need the predecessor), relink, and keep the data members consistent.`,
points:[
 `<b>The real questions:</b> Spring 2026 <code>IntegerLinkedList.add</code> (sorted replacement, O(1) length), Fall 2025 <code>move_forward(e, d)</code>, Fall 2024 <code>longestSequenceItem()</code>, Fall 2023 merging two sorted lists, Fall 2021 <code>checkListEndsSymmetry</code> on a doubly linked list.`,
 `<b>"Define the attributes / the constructor" are separate marks.</b> A class that must give O(1) <code>length()</code> needs a <code>size</code> counter, updated in every insert and delete.`,
 `<b>Trailing pointer pattern:</b> <code>q = null; p = head; while (p != null &amp;&amp; !found) { q = p; p = p.next; }</code>. When you stop, q is the predecessor, which you need to unlink p. If q is null, p is the head.`,
 `<b>Edge cases that cost marks:</b> empty list, one element, the head, the last node, and "not found" returning the right boolean/-1.`,
 `<b>State what you must not change.</b> Several questions say the list or the <code>current</code> pointer must stay as it was. Then use local pointers only.`
],
quiz:[
 {q:`<b>Spring 2026.</b> <code>IntegerLinkedList</code> must offer <code>length()</code> in O(1) while <code>add</code> is O(n). The attributes you define are:`, o:[`<code>head</code> only`,`<code>head</code> and an <code>int size</code> counter`,`<code>head</code> and <code>tail</code> only`,`<code>current</code> only`], a:1, w:`Without a counter, length() would have to walk the list (O(n)). With a size field it is a single read.`},
 {q:`<b>Fall 2025.</b> <code>move_forward(e, d)</code> returns false when:`, o:[`d is negative, e is missing, or d goes beyond the last position`,`d is zero`,`e is the head`,`the list has one element`], a:0, w:`These are exactly the cases in the statement. For d = 0 the element is already where it should be, so the method succeeds.`},
 {q:`<b>Fall 2024.</b> In <code>longestSequenceItem</code>, which condition keeps the <u>first</u> item when two runs tie?`, o:[`<code>count &gt;= maxCount</code>`,`<code>count &gt; maxCount</code>`,`<code>count == maxCount</code>`,`<code>count != 0</code>`], a:1, w:`A strict greater-than only replaces the best run when a longer one appears, so earlier runs win ties.`},
 {q:`To unlink a node p that is <b>not</b> the head you need:`, o:[`only p`,`the predecessor q, then <code>q.next = p.next</code>`,`the tail`,`the node after p, then <code>p.next = null</code>`], a:1, w:`A singly linked node cannot reach backwards, so you carry the predecessor while walking.`}
],
drills:[
 {id:'pp2d1', real:true, src:'Spring 2026 · Q4 (30)', bucket:'list', time:'20 min', title:'IntegerLinkedList.add: replace the largest smaller value',
  q:`<code>IntegerNode</code> has <code>public int data; public IntegerNode next;</code> and a constructor <code>IntegerNode(int data)</code>. <code>IntegerList</code> has <code>int add(int v)</code> and <code>int length()</code>.<br><code>add(v)</code> works as follows. If the list already contains v, do nothing. Otherwise, if it contains a value smaller than v, <b>remove the largest value that is smaller than v</b> and insert v at its location. Otherwise insert v at the head. Return the number of elements after the insertion.<br>Example: list (3, 5, 7), <code>add(6)</code> removes 5 and inserts 6 at its location, giving (3, 6, 7) and returning 3.<br><b>Work to do:</b> define the attributes, the constructor, an O(n) <code>add</code>, and an O(1) <code>length()</code>.`,
  idea:`A guided class design. Three skills in one: choosing attributes (the counter for O(1) length), a single pass that tracks the best candidate and its predecessor, and splicing at the right place without changing the size when you replace.`,
  steps:[`Attributes: <code>head</code> and <code>size</code>. Constructor: head = null, size = 0.`,`Pass 1: if any node has data == v, return size.`,`Pass 2: track <code>best</code> (largest data &lt; v) and <code>bestPrev</code> (its predecessor) while walking with <code>prev</code>.`,`Build the new node. No smaller value: insert at head, size++. Otherwise put it where best was: <code>n.next = best.next</code>, link the predecessor (or head) to n. Size is unchanged (one out, one in).`,`<code>length()</code> returns size.`],
  sol:`public class IntegerLinkedList implements IntegerList {
  private IntegerNode head;
  private int size;

  public IntegerLinkedList() {
    head = null;
    size = 0;
  }

  public int add(int v) {
    IntegerNode p = head;
    while (p != null) {                       // already present?
      if (p.data == v) return size;
      p = p.next;
    }
    IntegerNode prev = null, best = null, bestPrev = null;
    p = head;
    while (p != null) {                       // largest value smaller than v
      if (p.data < v && (best == null || p.data > best.data)) {
        best = p;
        bestPrev = prev;
      }
      prev = p;
      p = p.next;
    }
    IntegerNode n = new IntegerNode(v);
    if (best == null) {                       // no smaller value: new head
      n.next = head;
      head = n;
      size++;
    } else {                                  // replace best by n
      n.next = best.next;
      if (bestPrev == null) head = n;
      else bestPrev.next = n;
    }
    return size;
  }

  public int length() { return size; }        // O(1)
}`,
  traps:[`Incrementing size when you replace a value: the count stays the same.`,`Forgetting the case where the value to replace is the head (<code>bestPrev == null</code>).`]},
 {id:'pp2d2', real:true, src:'Fall 2025 · Q4 (35)', bucket:'list', time:'18 min', title:'move_forward(e, d) in LinkedList',
  q:`As a member of <code>LinkedList&lt;T&gt;</code> (fields <code>head</code>, <code>current</code>; nodes with <code>data</code>, <code>next</code>), write <code>public boolean move_forward(T e, int d)</code>. It finds the <b>first</b> occurrence of e and moves it forward by d positions. It returns true on success. If d is negative, e is not found, or d goes beyond the last position, return false and leave the list unchanged. The <code>current</code> pointer must not change.<br>Example 1: ls = A,B,C,D,E: <code>move_forward('C', 2)</code> gives A,B,D,E,C. Example 2: <code>move_forward('D', 3)</code> returns false. Example 3: <code>move_forward('A', 3)</code> gives B,C,D,A,E.`,
  idea:`Three phases: find the node and its predecessor, find the target node d steps ahead (failing safely), then unlink and re-insert. All pointer work, no helper methods.`,
  steps:[`Reject negative d.`,`Walk with <code>p</code> and trailing <code>q</code> until p holds e. Not found: false.`,`Find <code>t</code>, the node d steps after p. If you run off the end while stepping: false (nothing has changed yet).`,`Unlink p: <code>q.next = p.next</code>, or move head if q is null.`,`Insert after t: <code>p.next = t.next; t.next = p;</code> Return true.`],
  sol:`public boolean move_forward(T e, int d) {
  if (d < 0) return false;
  Node<T> p = head, q = null;             // q trails p
  while (p != null && !p.data.equals(e)) {
    q = p;
    p = p.next;
  }
  if (p == null) return false;            // e not found
  Node<T> t = p;
  for (int i = 0; i < d; i++) {           // target: d nodes after p
    if (t.next == null) return false;     // beyond the last position
    t = t.next;
  }
  if (d == 0) return true;
  if (q == null) head = p.next;           // unlink p
  else           q.next = p.next;
  p.next = t.next;                        // insert p after t
  t.next = p;
  return true;                            // current is untouched
}`,
  traps:[`Unlinking before checking that the target exists: a failed call must leave the list unchanged.`,`Moving the head node: <code>q == null</code> means update <code>head</code>.`]},
 {id:'pp2d3', real:true, src:'Fall 2024 · Q4 (35)', bucket:'list', time:'12 min', title:'longestSequenceItem()',
  q:`As a member of <code>LinkedList&lt;T&gt;</code>, write <code>public T longestSequenceItem()</code> that returns the item with the longest sequence of <b>consecutive equal</b> items. If two items have the same longest sequence, return the one that occurs first. The list and the <code>current</code> pointer must not change; the list is not empty.<br>Example 1: A,A,A,C,C,B,C,C returns A (sequence of 3). Example 2: A,B,C,C,D,D returns C.`,
  idea:`One pass with a run counter. When the value changes, restart the counter; when the counter beats the best, remember the item. Strict "greater than" gives the first-wins tie rule.`,
  steps:[`Keep <code>compare</code> (value of the current run), <code>count</code>, <code>max</code>, <code>maxCount</code>.`,`For each node: same as compare, count++; else compare = data, count = 1.`,`If <code>count &gt; maxCount</code>, update max and maxCount.`,`Use a local pointer so <code>current</code> never moves.`],
  sol:`public T longestSequenceItem() {
  T max = head.data;
  int maxCount = 0, count = 0;
  T compare = null;
  Node<T> tmp = head;                  // local pointer: current untouched
  while (tmp != null) {
    if (compare != null && tmp.data.equals(compare)) {
      count++;
    } else {
      compare = tmp.data;
      count = 1;
    }
    if (count > maxCount) {            // strict: earlier run wins ties
      maxCount = count;
      max = compare;
    }
    tmp = tmp.next;
  }
  return max;
}`,
  traps:[`Using <code>&gt;=</code>: the last tied run would win instead of the first.`]},
 {id:'pp2d4', real:true, src:'Fall 2021 · Q3 (25)', bucket:'list', time:'12 min', title:'checkListEndsSymmetry(dl, k)',
  q:`As a <b>user</b> of <code>DoubleLinkedList</code>, write <code>public static &lt;T&gt; boolean checkListEndsSymmetry(DoubleLinkedList&lt;T&gt; dl, int k)</code>. The list is non-empty and k is positive and strictly less than the length. Return true if the first k elements going forward from the first element are identical to the k elements going backward from the last.<br>Example: A &harr; B &harr; C &harr; D &harr; B &harr; A with k = 2 gives true; with k = 3 gives false since C &ne; D.`,
  idea:`A single <code>current</code> cannot walk both ends at once, so store the first k elements in an array, then walk back from the last element comparing. Only a DLL lets a user move backwards.`,
  steps:[`Create <code>T[] f = (T[]) new Object[k]</code>.`,`<code>findFirst()</code>; for i = 0..k-1 store <code>retrieve()</code> and step with <code>findNext()</code> (not after the last one you need).`,`Go to the last element: <code>findFirst()</code> then <code>findNext()</code> until <code>last()</code>.`,`For i = 0..k-1 compare with <code>f[i]</code>; step back with <code>findPrevious()</code>.`],
  sol:`public static <T> boolean checkListEndsSymmetry(DoubleLinkedList<T> dl, int k) {
  T[] f = (T[]) new Object[k];
  dl.findFirst();
  for (int i = 0; i < k; i++) {
    f[i] = dl.retrieve();
    if (i < k - 1) dl.findNext();
  }
  dl.findFirst();
  while (!dl.last()) dl.findNext();      // now on the last element
  for (int i = 0; i < k; i++) {
    if (!dl.retrieve().equals(f[i])) return false;
    if (i < k - 1) dl.findPrevious();
  }
  return true;
}`,
  traps:[`Calling <code>findNext()</code> or <code>findPrevious()</code> one time too many on the final step.`]},
 {id:'pp2d5', real:true, src:'Fall 2023 · Q4 (fill-in)', bucket:'list', time:'10 min', title:'Merge two sorted linked lists',
  q:`Write <code>public static Node&lt;Integer&gt; merge(Node&lt;Integer&gt; head1, Node&lt;Integer&gt; head2)</code> that merges two sorted singly linked lists into one sorted list by <b>relinking the existing nodes</b> (no new nodes). Return the head of the merged list.`,
  idea:`Walk both lists with two pointers and append the smaller node to a growing tail. The marked variables in the exam (<code>mergedHead</code>, <code>mergedCurrent</code>) are exactly this tail pointer; a dummy start node removes the special first-node case.`,
  steps:[`Create a dummy node and <code>tail = dummy</code>.`,`While both lists have nodes: link the smaller one after tail, advance that list, advance tail.`,`Attach whatever is left of the other list.`,`Return <code>dummy.next</code>.`],
  sol:`public static Node<Integer> merge(Node<Integer> head1, Node<Integer> head2) {
  Node<Integer> dummy = new Node<Integer>(0);
  Node<Integer> tail = dummy;
  while (head1 != null && head2 != null) {
    if (head1.data <= head2.data) {
      tail.next = head1;
      head1 = head1.next;
    } else {
      tail.next = head2;
      head2 = head2.next;
    }
    tail = tail.next;
  }
  tail.next = (head1 != null) ? head1 : head2;
  return dummy.next;
}`,
  traps:[`Forgetting the leftover nodes after one list runs out.`]}
]});

TOPICS.push({
id:'pp3', mod:'past', title:'Circle-an-answer block (Q3)', odds:'high', time:'20 min', seen:'every paper',
idea:`Question 3 is five or six <b>circle one answer</b> questions (25-30 marks). Most are claims like "as a <i>user</i> of class X, doing Y is O(...)", plus a postfix conversion or evaluation and a stack-state question. The same questions come back almost word for word.`,
points:[
 `<b>Read "as a user" vs "as a member" first.</b> A <i>user</i> pays the cost of every ADT call. A <i>member</i> sees the representation: an array gives O(1) index access; a head-only linked list does not give O(1) access to the last or middle node.`,
 `<b>Cheat sheet:</b> array = index access O(1), insert/delete at the front O(n). Linked = insert at head O(1), position access O(n). Doubly linked = delete current O(1). <code>ArrayQueue</code> needs a circular array to keep both ends O(1). Nobody reaches the middle of a Stack or Queue in O(1) as a user.`,
 `<b>Repeated verbatim:</b> the postfix of <code>((1+2)*4+8-3)</code> is <code>1 2 + 4 * 8 + 3 -</code> (Fall 2024, Fall 2025, Spring 2026). Evaluating <code>7 5 2 * 8 - *</code> gives 14.`,
 `<b>Valid pop sequences:</b> push 1,2,3,4,5 in order, popping whenever you like. A sequence is valid only if each popped value is the current top, or you can push up to it first. After you pop 4 then 3, the next pop can only be 5 or 2, never 1.`,
 `<b>Older papers</b> also asked for sorting facts (stable, in-place, a trace after k iterations). See the sorting topic. Spring 2026 did not.`
],
viz:'postfix',
quiz:[
 {q:`<b>Spring 2026.</b> Which statement is true?`, o:[`As a member of <code>DoubleLinkedList</code>, we can access the middle element in O(1)`,`As a member of <code>LinkedList</code>, we can access the middle element in O(1)`,`As a user of <code>Stack</code>, we can access the middle element in O(1)`,`As a member of <code>ArrayStack</code>, we can access the middle element in O(1)`,`None of the above`], a:3, w:`Only the array representation gives direct access by index. Linked structures must walk, and a user of a stack can reach the middle only by popping.`},
 {q:`<b>Fall 2024 and Spring 2026.</b> Which statement is true?`, o:[`As a member of <code>ArrayList</code>, inserting at the beginning of the array is O(1)`,`As a member of <code>LinkedList</code>, inserting at the beginning of the list is O(n)`,`As a user of <code>ArrayList</code>, inserting at the beginning of the array is O(1)`,`As a user of <code>LinkedList</code>, inserting at the beginning of the list is O(1)`,`None of the above`], a:3, w:`An array list must shift every element (O(n)) however you call it. In a linked list the member relinks the head, and a user calls only <code>findFirst()</code> and <code>insert()</code>, both O(1). This is the option circled in the marked Fall 2024 paper.`},
 {q:`<b>Spring 2026.</b> Which statement is true?`, o:[`In <code>ArrayList</code>, we need to implement a circular array`,`In <code>ArrayStack</code>, we need to implement a circular array`,`In <code>ArrayQueue</code>, we need to implement a circular array`,`In <code>LinkedStack</code>, we need to implement a circular array`,`None of the above`], a:2, w:`Only a queue changes both ends (enqueue at the tail, serve from the head). Wrap-around keeps both O(1) without shifting.`},
 {q:`<b>Three papers.</b> The postfix expression for the infix <code>((1+2)*4+8-3)</code> is:`, o:[`<code>1 2 4 * + 8 - 3 +</code>`,`<code>1 2 + 4 * 8 - 3 +</code>`,`<code>1 2 + 4 * 8 + 3 -</code>`,`<code>1 2 4 + * 8 - 3 +</code>`,`None`], a:2, w:`(1+2) first, times 4, then + 8, then - 3: <code>1 2 + 4 * 8 + 3 -</code>.`},
 {q:`<b>Spring 2026.</b> You must push 1, 2, 3, 4, 5 in this order, and may pop at any time. Which pop sequence <b>cannot</b> occur?`, o:[`4, 5, 3, 2, 1`,`3, 5, 4, 2, 1`,`4, 3, 5, 1, 2`,`5, 4, 3, 2, 1`,`None`], a:2, w:`After popping 4, 3 and 5, the stack holds 1 and 2 with 2 on top, so the next pop must be 2, not 1.`},
 {q:`<b>Spring 2026.</b> Evaluate the postfix expression <code>7 5 2 * 8 - *</code>:`, o:[`14`,`6`,`12`,`24`,`None`], a:0, w:`5 * 2 = 10; 10 - 8 = 2; 7 * 2 = 14.`},
 {q:`<b>Fall 2025.</b> Two sorted lists of lengths m and k: the most efficient algorithm to find their intersection takes:`, o:[`O(m &middot; k)`,`O(m + k)`,`O(n log n)`,`O(n&sup2;)`], a:1, w:`Walk both lists once with two pointers, advancing the smaller side: linear in the combined length.`},
 {q:`<b>Fall 2025.</b> Swapping the last element with the first is O(1) for:`, o:[`a member of a head-only <code>DoubleLinkedList</code>`,`a member of <code>LinkedList</code>`,`a user of <code>Queue</code>`,`a member of <code>ArrayQueue</code>`,`None`], a:3, w:`In the array both elements sit at known indices (head and the slot before tail), so a swap is O(1). The others must walk or cycle: O(n).`},
 {q:`<b>Fall 2024.</b> Time complexity of reversing a linked list as an implementer with the least amount of extra space:`, o:[`O(n) with extra space`,`O(n) without extra space`,`O(n log n) with extra space`,`O(1)`,`None`], a:1, w:`Three-pointer reversal visits each node once and needs only a few variables.`},
 {q:`<b>Fall 2022.</b> A list holds 8, 4, 2, 5, 3 with current on 8. What is the list after <code>m(l, 5)</code>?<pre class="code">public static void m(List&lt;Integer&gt; l, int n) {
  l.findFirst();
  while (!l.last()) {
    Integer x = l.retrieve();
    if (x &lt; n) l.remove();
    else { l.update(x - n); l.findNext(); }
  }
}</pre>`, o:[`3, 0, 3`,`3, 0`,`-1, -3, 3`,`3, 3`,`None`], a:0, w:`8 is not below 5: becomes 3, move on. 4 is below 5: removed (current is now 2). 2: removed (current is now 5). 5 is not below 5: becomes 0, move to the last element 3. The loop stops before touching the last element: 3, 0, 3.`}
],
drills:[
 {id:'pp3d1', real:true, src:'Fall 2021 · Q1 (15)', bucket:'stack', time:'10 min', title:'Trace postfix with relational and logical operators',
  q:`Trace the execution of the postfix expression <code>9 3 1 5 - * 8 4 3 / 1 + - + &lt; 25 5 % 0 &gt; ||</code>. The operation <code>/</code> is integer division. Show the content of the stack after parsing each operation (bottom to top).`,
  idea:`Plain postfix evaluation, with comparison operators that push a boolean (T or F) and a logical operator that combines two booleans. The marks are in showing the stack after every operator.`,
  steps:[`Numbers are pushed. For an operator pop the right operand first, then the left, and push the result.`,`<code>&lt;</code> and <code>&gt;</code> push T or F. <code>||</code> combines two booleans.`,`Integer division truncates: 4 / 3 = 1.`,`Write one line per operator.`],
  lang:'text',
  sol:`token   stack after the token (bottom ... top)
9 3 1 5   9 3 1 5
-         9 3 -4        (1 - 5)
*         9 -12         (3 * -4)
8 4 3     9 -12 8 4 3
/         9 -12 8 1     (4 / 3 = 1)
1         9 -12 8 1 1
+         9 -12 8 2
-         9 -12 6       (8 - 2)
+         9 -6          (-12 + 6)
<         F             (9 < -6 is false)
25 5      F 25 5
%         F 0           (25 mod 5)
0         F 0 0
>         F F           (0 > 0 is false)
||        F             (F or F)`,
  traps:[`Subtracting in the wrong order: for <code>a b -</code> compute a - b.`]},
 {id:'pp3d2', real:true, src:'Spring 2026 · Q3.4', bucket:'stack', time:'6 min', title:'Which pop sequences are possible?',
  q:`Numbers 1, 2, 3, 4, 5 are pushed in this order, and you may pop at any time while the stack is not empty. Decide for each sequence whether it is a valid pop sequence: (a) 4,5,3,2,1 (b) 3,5,4,2,1 (c) 4,3,5,1,2 (d) 5,4,3,2,1.`,
  idea:`Simulate. To pop a value you must first push everything up to it; after that the stack top is the only thing you can pop next. Whenever a requested value is not the top and already pushed, the sequence is impossible.`,
  steps:[`Keep a pointer to the next number to push and the stack.`,`For each requested pop: push numbers until the requested one is on top (if it is already inside but not on top, stop: invalid).`,`Pop it and continue.`],
  lang:'text',
  sol:`(a) 4,5,3,2,1   push 1-4, pop 4; push 5, pop 5; pop 3, 2, 1      valid
(b) 3,5,4,2,1   push 1-3, pop 3; push 4,5, pop 5; pop 4, 2, 1      valid
(c) 4,3,5,1,2   push 1-4, pop 4, pop 3; push 5, pop 5;
                stack is 1,2 with 2 on top; next pop must be 2   INVALID
(d) 5,4,3,2,1   push 1-5, pop all                                valid

Answer: (c)`,
  traps:[]}
]});

TOPICS.push({
id:'pp4', mod:'past', title:'Big-O block (Q1)', odds:'high', time:'18 min', seen:'every paper',
idea:`Question 1 is five circle-one questions worth 15 marks, and it has the <b>same five shapes in every paper</b>: a loop to count, a function to simplify, a log or exponent identity, the "algorithm A calls B and C" composition, and a best-algorithm choice. Spring 2026 added a frequency table on the answer sheet.`,
points:[
 `<b>Loop count:</b> if an inner loop sits behind an <code>if</code> that is true only once, it adds n, not n&sup2;.`,
 `<b>Identities used in the real papers:</b> <code>log(2&#8319;) = n</code>, <code>2^(log n&sup2;) = n&sup2;</code>, <code>log(n^(2n)) = 2n log n</code>, <code>2^(2n) = 4&#8319;</code>, <code>log(n+1)&sup2; = 2 log(n+1)</code>.`,
 `<b>"Algorithm A calls B and C"</b> is a counting trick. A constant number of expensive calls (the first three iterations) costs O(n) overall; an expensive call that can happen for each of the n items costs O(n&sup2;).`,
 `<b>Priority queue worst case:</b> with a sorted linked PQ, items that arrive in strictly <u>descending</u> priority each have the lowest priority so far, so each goes to the tail (O(n) each, O(n&sup2;) total). Items that arrive in ascending priority go to the head in O(1) each.`,
 `<b>Marks:</b> circle answers have no partial credit, so work each one on the side. The frequency table (Spring 2026) gives marks per correct line.`
],
quiz:[
 {q:`<b>Fall 2025.</b> The Big-O of this code:<pre class="code">for (int i = 1; i &lt;= n; i++) {
  for (int j = 0; j &lt; n; j++) {
    if (j == 0)
      for (int k = 0; k &lt; n; k++) sum++;
  }
}</pre>`, o:[`O(n&sup2; log n)`,`O(n)`,`O(n&sup2;)`,`O(n&sup3;)`,`None`], a:2, w:`For each i the j loop runs n times, but the k loop runs only once (when j is 0). That is 2n steps per i, so about 2n&sup2; in total.`},
 {q:`<b>Spring 2026.</b> <code>log(2&#8319;) + 2^(log(n&sup2;))</code> is:`, o:[`O(n)`,`O(n&sup2;)`,`O(2&#8319;)`,`O(n log n)`,`None`], a:1, w:`log(2ⁿ) = n and 2^(log n²) = n². The sum is n + n², so O(n²).`},
 {q:`<b>Spring 2026.</b> <code>2^(2n) + n&#8309;&#8304;</code> is:`, o:[`O(2&#8319;)`,`O(n&#8309;&#8304;)`,`O(4&#8319;)`,`O(8&#8319;)`,`None`], a:2, w:`2^(2n) = 4ⁿ, which beats any polynomial.`},
 {q:`<b>Spring 2026.</b> <code>log(n^(2n)) + n&sup3;</code> is:`, o:[`O(n log n)`,`O(n&sup2;)`,`O(n&sup3;)`,`O(2&#8319;)`,`None`], a:2, w:`log(n^(2n)) = 2n log n, which is smaller than n³.`},
 {q:`<b>Fall 2024.</b> Algorithm A iterates over a list of size n. On the <u>first three iterations</u> it calls B, which is O(n); on the remaining iterations it calls C, which is O(1). Running time of A:`, o:[`O(n)`,`O(n&sup2;)`,`O(2&#8319;)`,`O(1)`,`None`], a:0, w:`3 &middot; O(n) + (n - 3) &middot; O(1) = O(n). A fixed number of expensive calls does not multiply by n.`},
 {q:`<b>Fall 2023.</b> For <u>each item</u> in the list, A calls B (O(n)) <u>when a condition is met</u>, otherwise it calls C (O(1)). Which best describes A?`, o:[`O(n)`,`O(n&sup2;)`,`O(2&#8319;)`,`O(1)`,`None`], a:1, w:`The condition could be true for many items, so B may run up to n times: n &middot; O(n) = O(n²) in the worst case.`},
 {q:`<b>Fall 2024.</b> For the first half of list l (size n) algorithm A runs an O(log n) operation per element; for the second half it runs an O(1) operation. Running time:`, o:[`O(n)`,`O(n log n)`,`O(n + log n)`,`O(n&sup2; log n)`,`None`], a:1, w:`n/2 elements at O(log n) is (n/2) log n; the rest is O(n). The dominant term is n log n.`},
 {q:`<b>Fall 2025.</b> A function processes N numbers: for each element at an even index it sums that element with every number in the array. Total cost:`, o:[`O(n)`,`O(n&sup2;)`,`O(log n)`,`O(n/2 log n)`,`None`], a:1, w:`About n/2 elements, each doing n additions: n&sup2;/2, which is O(n&sup2;).`},
 {q:`<b>Fall 2025.</b> Stock orders are stored in a linked priority queue (highest bid served first). Which arrival order gives the <b>worst</b> total time?`, o:[`Strictly descending bids`,`Strictly ascending bids`,`Semi ascending bids`,`Random order`,`All scenarios are the same`], a:0, w:`Descending arrivals mean each new order has the lowest priority, so every insert walks to the tail: O(n) each. Ascending arrivals insert at the head in O(1).`},
 {q:`<b>Fall 2025 and 2023.</b> To find the top three numbers in a list of size n, the best you can do is:`, o:[`O(n)`,`O(n log n)`,`O(n&sup2;)`,`O(n&sup2; log n)`,`None`], a:0, w:`One pass keeping the three largest seen so far. Three comparisons per element is O(n).`},
 {q:`For <code>f(n) = O(g1(n))</code> and <code>g(n) = O(g2(n))</code>, the best Big-O for <code>f(n) + g(n)</code> is:`, o:[`O(g1(n) + g2(n))`,`O(g1(n))`,`O(g1(n) &middot; g2(n))`,`O(g2(n))`,`None`], a:0, w:`Each part is bounded by its own function, so the sum is bounded by the sum of the bounds (which is the larger of the two in practice).`}
],
drills:[
 {id:'pp4d1', real:true, src:'Spring 2026 · Q1 (15)', bucket:'pa', time:'12 min', title:'The whole Q1: four Big-Oh and a frequency table',
  q:`(a) Find the Big-Oh of: (1) <code>log(2&#8319;) + 2^(log(n&sup2;))</code> (2) <code>log(n^(2n)) + n&sup3;</code> (3) <code>2^(2n) + n&#8309;&#8304;</code>.<br>(b) Give the frequency of every line and the total O:
<pre class="code">1 for (int i = 1; i &lt;= n; i++) {
2   for (int j = 0; j &lt; n; j = j + 2)
3     s = s + 1;
4   for (int j = 1; j &lt;= n; j = j * 2)
5     s = s + 1; }</pre>`,
  idea:`The identities in (a) turn a scary expression into a plain polynomial or exponential. Part (b) is the same frequency method as before: header = iterations + 1, body = iterations, loops inside loops multiply.`,
  steps:[`(a) Rewrite with the identities, then keep the fastest-growing term.`,`(b) Line 1: n + 1. Line 2 runs the whole j-loop once per i: n times (iterations of the j-loop + 1 for the header). Line 3 is its body.`,`The j*2 loop contributes log n iterations per i.`,`Add the lines and keep the dominant term.`],
  lang:'text',
  sol:`(a) (1) n + n^2            -> O(n^2)
    (2) 2n log n + n^3       -> O(n^3)
    (3) 4^n + n^50           -> O(4^n)

(b) Line 1: n + 1
    Line 2: n * (n/2 + 1) = n^2/2 + n
    Line 3: n * (n/2)     = n^2/2
    Line 4: n * (log n + 2)
    Line 5: n * (log n + 1)
    Total:  n^2 + 2 n log n + 5n + 1      -> O(n^2)`,
  traps:[`The j loop with <code>j = j + 2</code> runs n/2 times, not n.`]}
]});

TOPICS.push({
id:'pp5', mod:'past', title:'Sorting quick facts (older papers)', odds:'low', time:'8 min', seen:'Fa25 · Fa24',
idea:`Sorting appeared in the Fall 2024 and Fall 2025 midterms but <b>not</b> in Spring 2026, and your lecture slides barely cover it. Spend a few minutes here only after everything else. The facts are short.`,
points:[
 `<b>Stable</b> = equal keys keep their original order. Insertion, bubble and merge sort are stable. Selection sort and quick sort are <u>not</u> stable.`,
 `<b>In-place</b> = O(1) extra memory. Selection, insertion, bubble (and quick sort) are in-place. Merge sort is <u>not</u> (it needs a second array).`,
 `<b>Bubble sort pass:</b> compare adjacent pairs and swap, so the largest value reaches the end after pass 1, the second largest after pass 2.`,
 `<b>Insertion sort iteration k</b> inserts the next element into the already-sorted prefix, so after two iterations the first three elements are sorted.`
],
quiz:[
 {q:`<b>Fall 2025.</b> Which statement is true?`, o:[`Insertion sort is not a stable sorting algorithm`,`Quick sort is not a stable sorting algorithm`,`Merge sort is not a stable sorting algorithm`,`A and B`,`None`], a:1, w:`Quick sort can reorder equal keys. Insertion and merge sort keep them in order.`},
 {q:`<b>Fall 2024.</b> Which statement is true?`, o:[`Selection sort is not in-place`,`Bubble sort is not in-place`,`Merge sort is not in-place`,`A and B`,`None`], a:2, w:`Merge sort needs an auxiliary array. The other two sort within the array.`},
 {q:`<b>Fall 2024.</b> Bubble sort, ascending, on [10, 8, 6, 9, 2, 15]. After the <b>second</b> iteration:`, o:[`[10, 8, 6, 9, 15, 2]`,`[6, 2, 8, 9, 10, 15]`,`[6, 8, 2, 9, 10, 15]`,`[2, 6, 8, 9, 10, 15]`], a:2, w:`Pass 1: 8 6 9 2 10 15. Pass 2: 6 8 2 9 10 15.`},
 {q:`<b>Fall 2025.</b> Insertion sort on [10, 8, 6, 9, 2, 15]. After <b>two</b> iterations:`, o:[`[6, 8, 10, 9, 2, 15]`,`[10, 8, 6, 9, 15, 2]`,`[6, 2, 8, 9, 10, 15]`,`[2, 6, 10, 9, 8, 15]`], a:0, w:`Iteration 1 inserts 8: 8 10 6 9 2 15. Iteration 2 inserts 6: 6 8 10 9 2 15.`}
],
drills:[]});
