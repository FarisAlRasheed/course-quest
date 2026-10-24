/* ============================ STACKS ============================ */
TOPICS.push({
id:'s1', mod:'stacks', title:'Stack ADT and implementations', odds:'high', time:'10 min',
ex:['pp1d5'],
idea:`A stack is <b>LIFO</b>: only the most recently pushed element (the <b>top</b>) can be removed. Four operations: <code>push, pop, empty, full</code>. Linked version: a single <code>top</code> pointer. Array version: an index <code>top</code> starting at -1. All O(1).`,
points:[
 `<b>Linked:</b> <code>push</code> = new node whose <code>next</code> is the old top, then top = new node. <code>pop</code> = save top.data, <code>top = top.next</code>. <code>empty: top == null</code>, <code>full: false</code>.`,
 `<b>Array:</b> <code>top = -1</code> when empty. <code>push: nodes[++top] = e</code>, <code>pop: return nodes[top--]</code>, <code>empty: top == -1</code>, <code>full: top == maxsize - 1</code>.`,
 `<b>The only tools in a "user of the Stack ADT" question</b> are push, pop, empty, full. To look under the top you must pop into a temporary stack and push back.`,
 `<b>Popping everything into a temp stack reverses the order</b>; popping it back restores the original.`
],
fig:[
 {kind:'stack', cap:'push(D) puts D on top', items:['A','B','C'], next:['A','B','C','D']},
 {kind:'stack', cap:'pop() returns D and removes it', items:['A','B','C','D'], next:['A','B','C']}
],
code:`public interface Stack<T> {
  T pop();
  void push(T e);
  boolean empty();
  boolean full();
}

// linked
public void push(T e) {
  Node<T> tmp = new Node<T>(e);
  tmp.next = top;
  top = tmp;
}
public T pop() {
  T e = top.data;
  top = top.next;
  return e;
}

// array
public void push(T e) { nodes[++top] = e; }
public T pop()        { return nodes[top--]; }`,
traps:[
 `Array stack: <code>top</code> starts at -1, not 0. Full is <code>maxsize - 1</code>.`,
 `Popping from an empty stack. In exam methods always check <code>empty()</code> in the loop condition.`
],
quiz:[
 {q:`Array stack, <code>maxsize = 5</code>, top = 2. After <code>push(x)</code> then <code>pop()</code> then <code>pop()</code>, top is:`, o:[`0`,`1`,`2`,`3`], a:1, w:`push: top 3. pop: top 2. pop: top 1.`},
 {q:`Push 1, 2, 3, then pop, push 4, pop, pop. What does the final pop return?`, o:[`1`,`2`,`3`,`4`], a:1, w:`Stack after pushes: 1 2 3. pop (3) leaves 1 2. push 4: 1 2 4. pop (4) leaves 1 2. pop returns 2.`},
 {q:`Moving all elements from stack A to stack B by repeatedly popping A and pushing onto B produces in B:`, o:[`The same order`,`The reverse order`,`A sorted order`,`Nothing`], a:1, w:`The first popped (A's top) ends up at the bottom of B.`},
 {q:`In the linked stack, <code>full()</code> returns:`, o:[`true`,`false`,`top == null`,`size == maxsize`], a:1, w:`Nodes are allocated on demand, so the stack is never full in the course implementation.`}
],
drills:[
 {id:'s1d1', src:'Lecture 15-17 · implementer', bucket:'stack', time:'6 min', title:'Write ArrayStack from memory',
  q:`Write the fields, constructor, <code>empty</code>, <code>full</code>, <code>push</code> and <code>pop</code> of <code>ArrayStack&lt;T&gt;</code>.`,
  idea:`Direct recall question. It checks the three standard details: top = -1 initially, pre-increment on push, post-decrement on pop.`,
  steps:[`Fields: <code>maxsize, top, nodes[]</code>.`,`Constructor allocates <code>(T[]) new Object[n]</code> and sets top to -1.`,`push/pop as one-liners.`],
  sol:`public class ArrayStack<T> implements Stack<T> {
  private int maxsize;
  private int top;
  private T[] nodes;

  public ArrayStack(int n) {
    maxsize = n;
    top = -1;
    nodes = (T[]) new Object[n];
  }
  public boolean empty() { return top == -1; }
  public boolean full()  { return top == maxsize - 1; }
  public void push(T e)  { nodes[++top] = e; }
  public T pop()         { return nodes[top--]; }
}`,
  traps:[]}
]});

TOPICS.push({
id:'s2', mod:'stacks', title:'Balanced symbols and other applications', odds:'high', time:'12 min',
idea:`Push every opening delimiter. On a closing delimiter, pop and check it matches. The text is balanced only if no mismatch occurs <u>and</u> the stack is empty at the end. HTML tag matching and the JVM method stack follow the same LIFO idea.`,
points:[
 `<b>Algorithm:</b> for each character: opening -> push; closing -> if the stack is empty return false, pop, if it does not match return false. At the end return <code>stack.empty()</code>.`,
 `<b>Three failure modes:</b> a closing symbol with nothing to match (empty stack), a wrong pair such as <code>(]</code>, and leftover openers at the end.`,
 `<b>Only one kind of parenthesis?</b> You do not need a stack. A counter works: add 1 on <code>(</code>, subtract 1 on <code>)</code>, fail if it goes negative, and require 0 at the end.`,
 `<b>Max stack depth</b> questions: count the maximum number of unmatched openers at any moment, not the total.`,
 `<b>Other uses:</b> reversing a list, HTML tag matching (push the opening tag name, pop and compare on a closing tag), and the JVM <i>call stack</i>: each method call pushes a frame; a method returns to the frame below it.`
],
code:`public static boolean balanced(String s) {
  Stack<Character> st = new LinkedStack<Character>();
  for (int i = 0; i < s.length(); i++) {
    char c = s.charAt(i);
    if (c == '(' || c == '[' || c == '{') {
      st.push(c);
    } else if (c == ')' || c == ']' || c == '}') {
      if (st.empty()) return false;
      char o = st.pop();
      if ((c == ')' && o != '(') ||
          (c == ']' && o != '[') ||
          (c == '}' && o != '{')) return false;
    }
  }
  return st.empty();
}`,
traps:[
 `Returning true without checking that the stack is empty at the end: <code>((a)</code> would pass.`,
 `Popping without checking <code>empty()</code> first: <code>a)</code> would crash.`
],
quiz:[
 {q:`Maximum number of symbols on the stack at any one time while checking <code>((a)+(b*(c+(d))))</code>:`, o:[`2`,`3`,`4`,`6`], a:2, w:`Track depth: ( ( ) ( ( ( ) ) ) ) peaks at 4 when you reach the innermost <code>(d</code>.`},
 {q:`Max stack depth for <code>((a+b)*(c-(d/e)))</code>:`, o:[`2`,`3`,`4`,`5`], a:1, w:`( ( ) ( ( ) ) ) reaches depth 3 at <code>(d/e</code>.`},
 {q:`Which string does the algorithm reject for the reason "stack not empty at the end"?`, o:[`<code>(a)]</code>`,`<code>((a)</code>`,`<code>a)(</code>`,`<code>{[()]}</code>`], a:1, w:`<code>((a)</code> leaves one opener unmatched. <code>(a)]</code> fails at the extra closer; <code>a)(</code> fails at the first closer on an empty stack.`},
 {q:`Methods: main calls f1 and f2; f1 calls f2 and f3; f2 calls f3. Which call stack (bottom to top) can <b>never</b> occur?`, o:[`main, f1, f3`,`main, f2, f1`,`main, f1, f2, f3`,`main, f2`], a:1, w:`f1 is never called by f2, so f1 cannot sit on top of f2.`}
],
drills:[
 {id:'s2d1', src:'Lecture 15-17 · balancing symbols', bucket:'stack', time:'8 min', title:'Balanced symbols',
  q:`Write a method <code>boolean balanced(String s)</code> that checks that <code>()</code>, <code>[]</code> and <code>{}</code> are balanced and properly nested. Other characters are ignored. Examples: <code>{a*(b+c)}</code> is balanced, <code>{a*(b+c]}</code> is not.`,
  idea:`The textbook stack application. Marks are for the three failure cases and the final empty check.`,
  steps:[`Create a stack of chars.`,`Opening: push.`,`Closing: stack empty -> false; pop; compare pair -> false on mismatch.`,`After the loop return whether the stack is empty.`],
  sol:`public static boolean balanced(String s) {
  Stack<Character> st = new LinkedStack<Character>();
  for (int i = 0; i < s.length(); i++) {
    char c = s.charAt(i);
    if (c == '(' || c == '[' || c == '{') {
      st.push(c);
    } else if (c == ')' || c == ']' || c == '}') {
      if (st.empty()) return false;
      char o = st.pop();
      if ((c == ')' && o != '(') ||
          (c == ']' && o != '[') ||
          (c == '}' && o != '{')) return false;
    }
  }
  return st.empty();
}`,
  traps:[]},
 {id:'s2d2', src:'Problem set 4.5.2', bucket:'stack', time:'4 min', title:'One kind of parenthesis: do you need a stack?',
  q:`You must check balance for expressions with a single type of parenthesis, <code>(</code> and <code>)</code>. Do you need a stack? Give a pseudo-code solution.`,
  idea:`A trick question about understanding. A stack only matters when you must remember <i>which</i> opener is waiting. With one type, a counter is enough.`,
  steps:[`State the answer clearly: no stack needed.`,`count = 0. On <code>(</code> increment. On <code>)</code>: if count == 0 return false, else decrement.`,`Return <code>count == 0</code>.`],
  lang:'text',
  sol:`No, a counter is enough.

count = 0
for each character c in the expression:
    if c == '(':   count = count + 1
    else if c == ')':
        if count == 0: return false      // closer with no opener
        count = count - 1
return (count == 0)                       // no leftover openers`,
  traps:[]}
]});

TOPICS.push({
id:'s3', mod:'stacks', title:'Postfix evaluation and infix to postfix', odds:'high', time:'20 min',
ex:['pp3d1','pp3d2'],
idea:`<b>Evaluate postfix:</b> read left to right; a number is pushed; an operator pops two operands (the first popped is the <u>right</u> operand), computes, pushes the result. <b>Infix to postfix:</b> operands go straight to the output; operators wait on a stack and are popped when an operator of <u>higher or equal precedence</u> is on top.`,
points:[
 `<b>Operand order:</b> for <code>a b -</code>, pop gives <code>b</code> first, then <code>a</code>; compute <code>a - b</code>. The same for <code>/</code> and <code>%</code>.`,
 `<b>Infix to postfix rules.</b> Operand: output. <code>(</code>: push. <code>)</code>: pop to output until <code>(</code>, discard it. Operator: pop to output while the top is an operator with precedence &ge; the new one, then push. End: pop everything.`,
 `Precedence: <code>* / %</code> above <code>+ -</code>. Same level is evaluated left to right (left associativity), which is why "equal" pops.`,
 `<b>Impossible stack state questions:</b> list the stack after each token. A state is possible only if it appears in that list.`,
 `<b>Postfix reading tip:</b> the operator always comes after its two operands, so <code>7 2 3 * +</code> means <code>7 + (2 * 3)</code>.`
],
fig:[
 {kind:'stacks', cap:'Evaluating  7 2 3 * + 4 5 + -   (stack after each token, bottom to top)', steps:[{t:'7',s:['7']},{t:'2',s:['7','2']},{t:'3',s:['7','2','3']},{t:'*',s:['7','6']},{t:'+',s:['13']},{t:'4',s:['13','4']},{t:'5',s:['13','4','5']},{t:'+',s:['13','9']},{t:'-',s:['4']}]}
],
traps:[
 `Reversing the operands of <code>-</code> and <code>/</code>.`,
 `Popping only <i>greater</i> precedence instead of greater <u>or equal</u>: <code>a - b - c</code> would come out wrong.`,
 `Forgetting to empty the operator stack at the end.`
],
quiz:[
 {q:`Value of the postfix expression <code>5 1 2 + 4 * + 3 -</code>:`, o:[`10`,`14`,`17`,`20`], a:1, w:`1 2 + = 3; 3 4 * = 12; 5 12 + = 17; 17 3 - = 14.`},
 {q:`Postfix of <code>a + b * c - d</code>:`, o:[`<code>a b + c * d -</code>`,`<code>a b c * + d -</code>`,`<code>a b c d * + -</code>`,`<code>a b * c + d -</code>`], a:1, w:`b*c first, then a + that, then minus d.`},
 {q:`While evaluating <code>7 2 3 * + 4 5 + -</code>, which stack (top first) can <b>not</b> occur?`, o:[`3 2 7`,`6 7`,`9 13`,`4 6 7`], a:3, w:`Valid states include 7 / 2 7 / 3 2 7 / 6 7 / 13 / 4 13 / 5 4 13 / 9 13 / 4. The state "4 6 7" never appears.`},
 {q:`Postfix of <code>(a + b) * c / d</code>:`, o:[`<code>a b + c * d /</code>`,`<code>a b + c d / *</code>`,`<code>a b c * + d /</code>`,`<code>a b + * c d /</code>`], a:0, w:`* and / have equal precedence and are left associative, so (a+b)*c happens before dividing by d.`},
 {q:`Converting <code>a - b - c</code>. When the second <code>-</code> arrives with the first <code>-</code> on the stack, you:`, o:[`Push it above`,`Pop the first to output, then push the second`,`Discard it`,`Output it immediately`], a:1, w:`Equal precedence pops first, giving <code>a b - c -</code>.`}
],
drills:[
 {id:'s3d1', src:'Problem set 4.5.6', bucket:'stack', time:'12 min', title:'Convert to postfix with a trace table',
  q:`Convert to postfix, showing the operator stack and output after each token:<br><code>4 + (9 - (3 * 2)) % 3 + 5 * (2 + (6 / 3)) - 1</code>`,
  idea:`The mechanical conversion algorithm, executed carefully. Graders look for the evolving stack, so show it.`,
  steps:[`Write columns: token | operator stack | output.`,`Apply the rules strictly. Pop on equal or higher precedence before pushing an operator.`,`Close a <code>)</code> by popping to the matching <code>(</code>.`,`At the end pop the remaining operators.`,`Sanity check: evaluate your postfix; it must give the same value as the infix (here 23).`],
  lang:'text',
  sol:`token  op-stack           output
4                         4
+      +                  4
(      + (                4
9      + (                4 9
-      + ( -              4 9
(      + ( - (            4 9
3      + ( - (            4 9 3
*      + ( - ( *          4 9 3
2      + ( - ( *          4 9 3 2
)      + ( -              4 9 3 2 *
)      +                  4 9 3 2 * -
%      + %                4 9 3 2 * -
3      + %                4 9 3 2 * - 3
+      +                  4 9 3 2 * - 3 % +     (pop %, pop +, push +)
5      +                  ... 5
*      + *                ... 5
(      + * (              ... 5
2      + * (              ... 5 2
+      + * ( +            ... 5 2
(      + * ( + (          ... 5 2
6      + * ( + (          ... 5 2 6
/      + * ( + ( /        ... 5 2 6
3      + * ( + ( /        ... 5 2 6 3
)      + * ( +            ... 5 2 6 3 /
)      + *                ... 5 2 6 3 / +
-      -                  ... + * +   (pop *, pop +, push -)
1      -                  ... 1
end                       ... 1 -

Result: 4 9 3 2 * - 3 % + 5 2 6 3 / + * + 1 -
Check: 4 + (9-6)%3 + 5*(2+2) - 1 = 4 + 0 + 20 - 1 = 23`,
  traps:[`At the second <code>+</code> the stack top is <code>%</code>: pop it, then the old <code>+</code> is equal precedence, pop it too.`]},
 {id:'s3d2', src:'Practice exam Q2(a)', bucket:'stack', time:'6 min', title:'Postfix form of an infix expression',
  q:`The postfix form of <code>a + (b - c) - d * ((e - f) / g + h)</code> is:<br>A) <code>a b c - + d e f - g / h + * -</code><br>B) <code>a b c - + d e f - g h + / * -</code><br>C) <code>a b c - d e f - g / h + - +</code><br>D) <code>a b c - + d * e f - g / h + -</code>`,
  idea:`Same algorithm as above, done under time pressure. Check candidate answers by structure: where do the operators land, and does each operator have two operands before it?`,
  steps:[`Inner brackets first: (b - c) gives <code>b c -</code>; (e - f) gives <code>e f -</code>.`,`<code>(e - f) / g + h</code> gives <code>e f - g / h +</code>.`,`Multiplication by d: <code>d (...) *</code>.`,`Assemble left to right: a + (b-c) first, then subtract the product.`],
  lang:'text',
  sol:`Answer: A   a b c - + d e f - g / h + * -

 a + (b - c)                      -> a b c - +
 d * ((e - f)/g + h)              -> d e f - g / h + *
 (a + (b-c)) - (d * (...))        -> a b c - +  d e f - g / h + *  -`,
  traps:[`Option B divides by <code>g h +</code>, which would mean g + h under the division. Check where the parentheses end.`]}
]});

TOPICS.push({
id:'s4', mod:'stacks', title:'Stack coding: temp stack and recursion', odds:'high', time:'20 min',
ex:['pp1d1','pp1d5'],
idea:`Stack questions are solved with two tools. <b>A temporary stack</b> (pop out, push back, reversing twice restores the order) or <b>recursion</b> (the call stack remembers each popped element; you push it back <u>after</u> the recursive call returns).`,
points:[
 `<b>Temp stack template:</b> pop everything into <code>tmp</code>, process while moving, then pop <code>tmp</code> back into the original. The order is restored because reversal happens twice.`,
 `<b>Recursion template:</b> <code>if (st.empty()) return base; T x = st.pop(); ... recurse ...; st.push(x);</code>. Always push x back <u>before returning</u>.`,
 `<b>"Without changing the stack"</b> means every pop needs a matching push by the end. <b>"No auxiliary data structure"</b> usually means recursion.`,
 `<b>Positions:</b> "top is position 1" or "top has index 0": read the question for the counting rule and test on the given example.`,
 `<b>The practice exam's <code>spliceStack</code></b> counts from the bottom, so it first moves everything to a temp stack where the bottom becomes the top.`
],
code:`// Template A: temp stack
Stack<T> tmp = new LinkedStack<T>();
while (!st.empty()) tmp.push(st.pop());      // reversed
// ... use tmp ...
while (!tmp.empty()) st.push(tmp.pop());     // restored

// Template B: recursion
T x = st.pop();
/* recurse on the smaller stack */
st.push(x);                                  // restore on the way back`,
traps:[
 `Returning from a recursive call before pushing the popped element back.`,
 `Temp stack versions that forget the second transfer (stack left reversed).`,
 `Using a Java collection when the question says "user of the Stack ADT".`
],
quiz:[
 {q:`Stack st has A on top, then B, then C. You pop all three into <code>tmp</code>, then pop all of tmp into <code>out</code>. What is out's top?`, o:[`A`,`B`,`C`,`Empty`], a:0, w:`Two reversals restore the order, so A is on top again.`},
 {q:`In a recursive method that inspects a stack without changing it, where does <code>st.push(x)</code> go?`, o:[`Before the recursive call`,`After the recursive call, before returning`,`Never`,`In the base case only`], a:1, w:`The recursion needs the smaller stack. Restore x after the deeper calls have finished.`},
 {q:`<code>boolean found = x.equals(t) || search(st, t); st.push(x); return found;</code> Why is this version correct?`, o:[`It stops early so x is lost`,`x is pushed back even when the search short-circuits`,`It never pushes`,`It returns before pushing`], a:1, w:`The push occurs after the boolean is computed, on both paths.`},
 {q:`To access the <i>bottom</i> element of a stack using only ADT operations you:`, o:[`Call <code>bottom()</code>`,`Move all elements to a temp stack; the bottom ends up on top there`,`Peek at index 0`,`Pop once`], a:1, w:`Reversal brings the bottom to the top of the temp stack.`}
],
drills:[
 {id:'s4d1', src:'Tutorial 5 · P3', bucket:'stack', time:'7 min', title:'Recursive search without changing the stack',
  q:`Write the recursive static method <code>search(Stack&lt;T&gt; st, T target)</code> that returns true if target is in the stack. The stack must not change and you may not use auxiliary data structures. Example: st (top to bottom) 5, 7, 5, 3, 2: <code>search(st,3)</code> is true, <code>search(st,1)</code> is false.`,
  idea:`Recursion as storage: the call stack holds the elements you popped. Restore each one after the recursive call.`,
  steps:[`Base: empty stack -> false.`,`Pop x.`,`found = x equals target, or search the rest.`,`Push x back, then return found.`],
  sol:`public static <T> boolean search(Stack<T> st, T target) {
  if (st.empty()) return false;
  T x = st.pop();
  boolean found = x.equals(target) || search(st, target);
  st.push(x);
  return found;
}`,
  traps:[`Do not write <code>return x.equals(target) || search(...)</code> before pushing x back.`]},
 {id:'s4d2', src:'Tutorial 5 · P2', bucket:'stack', time:'8 min', title:'Recursive copy of a stack, same order',
  q:`Write the recursive static method <code>copy(Stack&lt;T&gt; st1, Stack&lt;T&gt; st2)</code> that copies all elements of st1 into st2 in the same order, preserving st1. No auxiliary data structures. Example: st1 (top to bottom) 4, 7, 1, 5, 2 and empty st2 gives st2 = 4, 7, 1, 5, 2.`,
  idea:`To keep the order in st2 the <u>deepest</u> element must be pushed first. Recursion reaches the bottom first, so push into st2 <i>after</i> the recursive call.`,
  steps:[`Base: empty -> return.`,`Pop x from st1.`,`Recurse on the rest.`,`On return: <code>st2.push(x)</code> (bottom elements already there) and <code>st1.push(x)</code> (restore).`],
  sol:`public static <T> void copy(Stack<T> st1, Stack<T> st2) {
  if (st1.empty()) return;
  T x = st1.pop();
  copy(st1, st2);
  st2.push(x);
  st1.push(x);
}`,
  traps:[`Pushing into st2 <u>before</u> the recursive call would reverse the order.`]},
 {id:'s4d3', src:'Tutorial 5 · P1', bucket:'stack', time:'6 min', title:'replace(st, e1, e2)',
  q:`Write <code>public static &lt;T&gt; void replace(Stack&lt;T&gt; st, T e1, T e2)</code>, a user of the Stack ADT, replacing every occurrence of e1 with e2. Example: st (top to bottom) 5, 7, 5, 3, 2 with <code>replace(st,5,0)</code> gives 0, 7, 0, 3, 2.`,
  idea:`Temp stack template with a transformation in the middle.`,
  steps:[`Pop all into tmp, replacing as you go.`,`Pop all back from tmp into st: order restored.`],
  sol:`public static <T> void replace(Stack<T> st, T e1, T e2) {
  Stack<T> tmp = new LinkedStack<T>();
  while (!st.empty()) {
    T x = st.pop();
    tmp.push(x.equals(e1) ? e2 : x);
  }
  while (!tmp.empty()) st.push(tmp.pop());
}`,
  traps:[]},
 {id:'s4d4', src:'Practice exam Q2(b)', bucket:'stack', time:'12 min', title:'spliceStack(s, i, j)',
  q:`Write <code>public static Stack&lt;Integer&gt; spliceStack(Stack&lt;Integer&gt; s, int i, int j)</code> that removes from s the elements at positions i up to (not including) j, counting from the bottom (position 0 is the bottom), and returns them in a new stack, with the order preserved in both. Assume i &lt; j and both valid. Example: s (bottom to top) {1,4,7,1,8}, <code>spliceStack(s,1,3)</code> returns {4,7} and leaves s as {1,1,8}.`,
  idea:`Bottom-based positions mean you must reverse first. Make the bottom the top of a temp stack, then walk positions 0, 1, 2... while sending each element to either the result or back to s.`,
  steps:[`Move all of s into <code>tmp</code>; count the elements. Now the bottom is on top of tmp.`,`For k = 0..size-1: pop from tmp. If i &le; k &lt; j push to <code>slice</code>, else push back to s.`,`Because tmp yields bottom-first, both s and slice are rebuilt bottom-first, so their order is correct.`],
  sol:`public static Stack<Integer> spliceStack(Stack<Integer> s, int i, int j) {
  Stack<Integer> tmp = new LinkedStack<Integer>();
  Stack<Integer> slice = new LinkedStack<Integer>();
  int size = 0;
  while (!s.empty()) {
    tmp.push(s.pop());
    size++;
  }
  for (int k = 0; k < size; k++) {
    if (k >= i && k < j) slice.push(tmp.pop());
    else                 s.push(tmp.pop());
  }
  return slice;
}`,
  traps:[`Off-by-one at j: the range is <code>k &lt; j</code>, not <code>k &lt;= j</code>.`]},
 {id:'s4d5', src:'Problem set 4.6.8', bucket:'stack', time:'9 min', title:'pullUpBottom(st)',
  q:`Write <code>public static &lt;T&gt; void pullUpBottom(Stack&lt;T&gt; st)</code>, a user of the Stack ADT, that moves the bottom element to the top without changing the order of the others. Example: st (top to bottom) A, B, E, C becomes C, A, B, E.`,
  idea:`The bottom is the last element you pop. Pop everything into tmp, take the bottom (now on top of tmp), restore the rest, then push the bottom on top.`,
  steps:[`Move all of st into tmp.`,`Pop <code>bottom</code> from tmp.`,`Move the rest of tmp back to st (order restored).`,`Push <code>bottom</code>.`],
  sol:`public static <T> void pullUpBottom(Stack<T> st) {
  Stack<T> tmp = new LinkedStack<T>();
  while (!st.empty()) tmp.push(st.pop());
  T bottom = tmp.pop();
  while (!tmp.empty()) st.push(tmp.pop());
  st.push(bottom);
}`,
  traps:[`Assumes a non-empty stack, as the question does.`]},
 {id:'s4d6', src:'Problem set 4.6.3', bucket:'stack', time:'9 min', title:'checkTotalTop: top equals sum of the rest',
  q:`Write <code>public boolean checkTotalTop(Stack&lt;Integer&gt; st)</code>, a user of the ADT, which returns true if the top element equals the sum of all the lower elements. The stack must be unchanged afterwards.`,
  idea:`Accumulate while transferring, then restore. Keep the top separately so it is not part of the sum.`,
  steps:[`Pop the top, remember it, and push it into tmp first.`,`Pop the remaining elements: add to sum, push into tmp.`,`Pop tmp back into st (restores original order).`,`Return <code>top == sum</code>.`],
  sol:`public boolean checkTotalTop(Stack<Integer> st) {
  Stack<Integer> tmp = new LinkedStack<Integer>();
  int top = st.pop();
  tmp.push(top);
  int sum = 0;
  while (!st.empty()) {
    int x = st.pop();
    sum += x;
    tmp.push(x);
  }
  while (!tmp.empty()) st.push(tmp.pop());
  return top == sum;
}`,
  traps:[`Restoring before computing is fine; restoring never skipped.`]}
]});
