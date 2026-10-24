/* ============================ FOUNDATIONS ============================ */
TOPICS.push({
id:'f1', mod:'found', title:'Java generics', odds:'low', time:'6 min',
idea:`Data structures must hold any element type. <b>Casting with <code>Object</code></b> works but errors appear at runtime. <b>Generics</b> (<code>Box&lt;T&gt;</code>) let the compiler enforce the element type, with no casts.`,
points:[
 `<b>Object solution:</b> store <code>Object</code>; retrieving needs a cast. Primitives need wrappers (<code>Integer</code>). Allows mixing types, and a wrong cast throws <code>ClassCastException</code> at <u>run time</u>.`,
 `<b>Generic class:</b> <code>class Box&lt;T&gt; { T data; }</code>. <code>T</code> is a <i>formal type parameter</i>. Use <code>Box&lt;String&gt; b = new Box&lt;String&gt;();</code>.`,
 `<b>Generic method:</b> <code>public static &lt;T&gt; void f(List&lt;T&gt; l)</code>, as in all the exam methods.`,
 `Type arguments must be classes: write <code>Box&lt;Integer&gt;</code>, not <code>Box&lt;int&gt;</code>.`
],
code:`class Box<T> {
  private T data;
  public void set(T d) { data = d; }
  public T get()       { return data; }
}

Box<String> b = new Box<String>();
b.set("hi");
String s = b.get();       // no cast
// b.set(5);              // compile-time error`,
traps:[`Using a primitive as a type argument.`,`Thinking generics are checked at run time; the check is by the compiler.`],
quiz:[
 {q:`Which is a drawback of the <code>Object</code> casting approach?`, o:[`It needs more code per type`,`Casting errors show up at run time`,`It cannot store Strings`,`It is slower to compile`], a:1, w:`The compiler cannot see the real type, so a wrong cast fails when the program runs.`},
 {q:`Which declaration is valid?`, o:[`<code>Box&lt;int&gt; b;</code>`,`<code>Box&lt;Integer&gt; b;</code>`,`<code>Box&lt;&gt; b;</code>`,`<code>Box(Integer) b;</code>`], a:1, w:`Type arguments must be reference types, so wrap the primitive.`},
 {q:`With <code>Box&lt;String&gt; b</code>, the call <code>b.set(5)</code>:`, o:[`Runs and stores 5`,`Fails at compile time`,`Throws ClassCastException at run time`,`Converts 5 to "5"`], a:1, w:`The compiler enforces the type parameter.`}
],
drills:[]});

TOPICS.push({
id:'f2', mod:'found', title:'Recursion', odds:'med', time:'10 min',
idea:`A recursive method needs a <b>base case</b> (stops) and a <b>recursive case</b> that moves toward it. <b>Linear</b> recursion makes at most one recursive call per invocation (depth n). <b>Binary</b> recursion makes two (splits the input in half).`,
points:[
 `<b>Linear sum:</b> <code>Sum(A,n) = A[0]</code> if n = 1, else <code>Sum(A,n-1) + A[n-1]</code>. n calls, depth n.`,
 `<b>Binary sum:</b> <code>BinarySum(A,i,n)</code> returns <code>A[i]</code> if n = 1, else sums the two halves. About <code>2n - 1</code> calls, depth about log n.`,
 `<b>Tracing:</b> write each call on its own line, indented by depth; list the returns on the way back.`,
 `<b>Space:</b> each active call occupies a stack frame, so depth equals extra space.`,
 `Missing or unreachable base case gives <code>StackOverflowError</code>.`
],
code:`int sum(int[] A, int n) {          // linear recursion
  if (n == 1) return A[0];
  return sum(A, n - 1) + A[n - 1];
}

int binarySum(int[] A, int i, int n) {   // binary recursion
  if (n == 1) return A[i];
  return binarySum(A, i, (n + 1) / 2)
       + binarySum(A, i + (n + 1) / 2, n / 2);
}`,
traps:[`Recursing on an input that does not shrink.`,`Doing work after the recursive call and forgetting that it executes on the way back.`],
quiz:[
 {q:`<code>int f(int n){ if(n&lt;=1) return 1; return f(n-1)+f(n-2); }</code> What does <code>f(4)</code> return?`, o:[`3`,`4`,`5`,`8`], a:2, w:`f(2)=2, f(3)=3, f(4)=f(3)+f(2)=5.`},
 {q:`How many calls does that same <code>f(4)</code> make in total (including the first)?`, o:[`4`,`7`,`9`,`16`], a:2, w:`f(4) calls f(3) and f(2). f(3) calls f(2) and f(1). Each f(2) calls f(1) and f(0). Count: 1 + 2 + 4 + 2 = 9 calls.`},
 {q:`What happens if the base case is missing?`, o:[`Returns 0`,`Compile error`,`StackOverflowError at run time`,`Infinite loop with no error`], a:2, w:`Calls pile up on the stack until memory runs out.`},
 {q:`Binary recursion on an array of n elements, depth of recursion is about:`, o:[`n`,`log n`,`n&sup2;`,`1`], a:1, w:`Each call halves the input.`}
],
drills:[
 {id:'f2d1', src:'Lecture 3 · tracing', bucket:'rec', time:'6 min', title:'Trace a recursive call tree',
  q:`Trace <code>f(4)</code> for <code>int f(int n){ if (n &lt;= 1) return 1; return f(n-1) + f(n-2); }</code>. List the calls and the final value.`,
  idea:`Tree recursion: two calls per level. Expect repeated calls of the same argument.`,
  steps:[`Draw f(4) with children f(3) and f(2). Expand until n &le; 1.`,`Fill in returns from the leaves upward.`],
  lang:'text',
  sol:`f(4)
 ├ f(3)
 │  ├ f(2)
 │  │  ├ f(1) = 1
 │  │  └ f(0) = 1      -> f(2) = 2
 │  └ f(1) = 1         -> f(3) = 3
 └ f(2)
    ├ f(1) = 1
    └ f(0) = 1         -> f(2) = 2
f(4) = 3 + 2 = 5          (9 calls in total)`,
  traps:[]}
]});

TOPICS.push({
id:'f3', mod:'found', title:'ADT basics', odds:'low', time:'5 min',
idea:`A <b>data type</b> is a domain of values plus a set of operations on them. An <b>ADT</b> specifies the domain and operations without saying how they are stored. A <b>data structure</b> is the concrete representation that implements it.`,
points:[
 `<b>Simple (atomic)</b> types have no parts (int, char). <b>Structured</b> types have components (object, array).`,
 `<b>Four structure shapes:</b> set, linear, tree, graph.`,
 `<b>User</b> of an ADT sees the specification only. <b>Implementer</b> chooses the representation (array vs linked) and the algorithms, and must satisfy the spec.`,
 `Performance depends on the representation: same ADT, different costs (see the List comparison table).`
],
traps:[`Calling an array an ADT: it is a concrete storage structure, while List is an ADT.`],
quiz:[
 {q:`A data type is:`, o:[`Only a set of values`,`A domain of values together with operations on them`,`A class with fields`,`Memory allocation`], a:1, w:`Both the domain and the operations define a data type.`},
 {q:`Which sees the linked or array representation?`, o:[`The user of the ADT`,`The implementer`,`Both equally`,`Neither`], a:1, w:`Users rely on the specification only.`},
 {q:`Which is a <i>linear</i> structure?`, o:[`Tree`,`Graph`,`Queue`,`Hash set of unordered keys`], a:2, w:`Stacks, queues and lists are linear: elements arranged in a line.`}
],
drills:[]});
