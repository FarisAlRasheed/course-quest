/* ============================ PERFORMANCE ============================ */
TOPICS.push({
id:'p1', mod:'perf', title:'Big-O rules and simplification', odds:'high', time:'10 min',
ex:['pp4d1'],
idea:`<code>f(n)</code> is <code>O(g(n))</code> if there are constants <code>c &gt; 0</code> and <code>n0</code> such that <code>f(n) &le; c&middot;g(n)</code> for all <code>n &ge; n0</code>. In practice: <b>keep the fastest-growing term, drop its constant</b>.`,
points:[
 `<b>Growth order (slow to fast):</b> <code>1 &lt; log n &lt; n &lt; n log n &lt; n&sup2; &lt; n&sup3; &lt; 2&#8319; &lt; n! &lt; n&#8319;</code>.`,
 `<b>Constants and lower terms vanish:</b> <code>5n&sup2; + 2n + 1</code> is <code>O(n&sup2;)</code>. <b>Log base does not matter:</b> <code>log&#8330; n</code> and <code>log&#8337; n</code> differ by a constant.`,
 `<b>Log rules to simplify:</b> <code>log(n&#7503;) = k&middot;log n</code>, <code>log(ab) = log a + log b</code>, <code>2^(log&#8322; n) = n</code>, <code>log(n!)</code> is <code>O(n log n)</code>.`,
 `<b>Exponent base matters:</b> <code>2&#8319;&#8314;&sup1;</code> is <code>O(2&#8319;)</code> (constant factor) but <code>4&#8319;</code> is <u>not</u> <code>O(2&#8319;)</code>.`,
 `<b>Sums and products:</b> sequential code adds (take the max), nested loops multiply.`,
 `<b>Worst case</b> is what we report: it bounds every input. Best/average cases are used to compare but the worst case is easier to prove.`,
 `<b>Experimental analysis</b> (timing runs) depends on hardware, language and chosen inputs; <b>theoretical analysis</b> is independent of them.`
],
codeLang:'text',
code:`Growth ladder:
  1  <  log n  <  n  <  n log n  <  n^2  <  n^3  <  2^n  <  n!  <  n^n

Proof template (show f is O(g)):
  1. State f(n) and g(n).
  2. Bound every term by a multiple of g(n) for n >= n0.
  3. Add the multiples to get c. Quote c and n0.`,
traps:[
 `Keeping lower terms: "O(n² + n)" is not simplified.`,
 `Believing all exponentials are equivalent: <code>a^n</code> is not <code>O(b^n)</code> when a &gt; b.`,
 `Forgetting that <code>n log n</code> is bigger than <code>n</code> but smaller than <code>n²</code>.`
],
quiz:[
 {q:`<code>3n log n + 2n&sup2; + 100</code> is:`, o:[`O(n log n)`,`O(n&sup2;)`,`O(n&sup3;)`,`O(100)`], a:1, w:`n² grows faster than n log n, and constants vanish.`},
 {q:`<code>5&middot;2&#8319; + n&sup1;&#8304;</code> is:`, o:[`O(n&sup1;&#8304;)`,`O(2&#8319;)`,`O(5)`,`O(n)`], a:1, w:`Exponentials beat polynomials, however large the power.`},
 {q:`<code>log(n&sup3;) + 7</code> is:`, o:[`O(n&sup3;)`,`O(3)`,`O(log n)`,`O(1)`], a:2, w:`log(n³) = 3 log n; the constants disappear.`},
 {q:`Which statement is <b>false</b>?`, o:[`2&#8319;&#8314;&sup1; is O(2&#8319;)`,`4&#8319; is O(2&#8319;)`,`log&#8322; n is O(log&#8321;&#8320; n)`,`n log n is O(n&sup2;)`], a:1, w:`4ⁿ/2ⁿ = 2ⁿ is unbounded, so 4ⁿ is not O(2ⁿ).`},
 {q:`An algorithm picks log n elements of an n-element array and does an O(n) calculation for each. Worst-case time?`, o:[`O(n)`,`O(log n)`,`O(n log n)`,`O(n&sup2;)`], a:2, w:`log n repetitions of O(n) work: n log n.`},
 {q:`Algorithm C does an O(n) task for each even number and an O(log n) task for each odd number in an n-element array. Best and worst case?`, o:[`O(n log n) and O(n&sup2;)`,`O(n) and O(n&sup2;)`,`O(log n) and O(n)`,`O(n log n) and O(n log n)`], a:0, w:`Best: all odd, n × log n. Worst: all even, n × n.`}
],
drills:[
 {id:'p1d1', src:'Problem set 2.2.1', bucket:'pa', time:'9 min', title:'Find g(n), c and n0',
  q:`Find the simplest <code>g(n)</code>, and constants <code>c</code>, <code>n0</code> such that <code>f(n) &le; c&middot;g(n)</code> for all n &ge; n0:<br>(a) <code>6n&sup2; + n - 4</code> (b) <code>4 log n + 2</code> (c) <code>3n&sup3; - 20n&sup2; + 10 log n</code>`,
  idea:`Straight application of the definition. Choose n0 so each term can be replaced by a multiple of g(n), then add the multiples.`,
  steps:[`Identify the dominant term: that is g(n).`,`Choose n0 (often 1 or 2; for logs use 2 so that log n &ge; 1).`,`Bound each term, add the coefficients, quote c.`],
  lang:'text',
  sol:`(a) g = n^2.  For n >= 1:  n - 4 <= n <= n^2, so 6n^2 + n - 4 <= 7n^2.      c = 7, n0 = 1
(b) g = log n. For n >= 2 (log n >= 1): 2 <= 2 log n, so f <= 6 log n.          c = 6, n0 = 2
(c) g = n^3.  Drop -20n^2 (negative); for n >= 1: 10 log n <= 20 n^2,
    so 3n^3 - 20n^2 + 10 log n <= 3n^3.                                          c = 3, n0 = 1`,
  traps:[`For logs, check n0 &ge; 2 so that log n is not 0.`]},
 {id:'p1d2', src:'Problem set 2.1', bucket:'pa', time:'8 min', title:'Prove O(...) and not O(...)',
  q:`(a) Show that <code>5n&sup2; + 2n + 1</code> is <code>O(n&sup2;)</code>. (b) Show that <code>2n&sup3;</code> is <b>not</b> <code>O(n&sup2;)</code>.`,
  idea:`Two standard proof shapes: bound each term (positive proof) and proof by contradiction (negative proof).`,
  steps:[`(a) For n &ge; 1: 2n &le; 2n&sup2; and 1 &le; n&sup2;. Add.`,`(b) Assume constants c, n0 exist. Divide both sides by n&sup2; to get 2n &le; c, which fails for large n.`],
  lang:'text',
  sol:`(a) For n >= 1:  5n^2 + 2n + 1 <= 5n^2 + 2n^2 + n^2 = 8n^2.   So c = 8, n0 = 1.

(b) Suppose 2n^3 <= c n^2 for all n >= n0.
    Dividing by n^2:  2n <= c, i.e. n <= c/2 for all n >= n0.
    Take n = max(n0, floor(c/2) + 1): contradiction.  Hence 2n^3 is not O(n^2).`,
  traps:[]},
 {id:'p1d3', src:'Practice exam Q1(a) · style', bucket:'pa', time:'6 min', title:'Worst-case complexity of expressions',
  q:`Give the worst-case complexity: (1) <code>3n&sup2; log n + 5n&sup2; + 100n</code> (2) <code>2&#8319;&#8314;&sup3; + n&#8309;</code> (3) <code>(n&sup2; + n)/n + log(n&#8308;)</code> (4) <code>n log n + n&sup1;&#8901;&#8309;</code>`,
  idea:`The Q1(a) style: simplify with algebra first, then keep the dominant term.`,
  steps:[`Simplify fractions and logs.`,`Rank the remaining terms with the growth ladder.`,`Write only the dominant term without constants.`],
  lang:'text',
  sol:`(1) n^2 log n dominates n^2 and n            -> O(n^2 log n)
(2) 2^(n+3) = 8 * 2^n; exponential wins        -> O(2^n)
(3) (n^2+n)/n = n + 1; log(n^4) = 4 log n      -> O(n)
(4) n^1.5 = n * sqrt(n) grows faster than n log n -> O(n^1.5)`,
  traps:[]}
]});

TOPICS.push({
id:'p2', mod:'perf', title:'Counting frequencies line by line', odds:'high', time:'14 min',
ex:['pp4d1'],
idea:`The exam asks for the frequency of <b>each line</b> as a formula in n, then the total and its O. The rule: a <code>for</code> header runs <b>iterations + 1</b> times (the last check fails), and the body runs <b>iterations</b> times. When the inner loop depends on <code>i</code>, sum over i.`,
points:[
 `<b>Header vs body.</b> <code>for (i=1; i&lt;=n; i++)</code>: header n + 1, body n.`,
 `<b>Dependent inner loop.</b> <code>for (j=i; j&lt;=n; j++)</code> runs n - i + 1 times for each i. Header total: <code>&Sigma;(n - i + 2)</code>; body total: <code>&Sigma;(n - i + 1) = n(n+1)/2</code>.`,
 `<b>Useful sums:</b> <code>&Sigma;&#8321;&#8319; 1 = n</code>, <code>&Sigma;&#8321;&#8319; i = n(n+1)/2</code>, <code>&Sigma;&#8320;&#8319;&#8315;&sup1; i = n(n-1)/2</code>.`,
 `<b>Halving/doubling loops.</b> <code>i *= 2</code> from 1 to n runs <code>&lfloor;log&#8322; n&rfloor; + 1</code> times (body) and one more for the header.`,
 `<b>Statements outside loops</b> run once. A constant-bound inner loop (<code>j &lt; 6</code>) only multiplies by a constant.`,
 `<b>Total</b> = sum of all line frequencies. Then give O(...) of the total.`
],
table:{head:['Loop header','Header runs','Body runs'],rows:[
 ['for(i=1;i<=n;i++)','n + 1','n'],
 ['for(i=0;i<n;i++)','n + 1','n'],
 ['for(i=0;i<n;i+=2)','n/2 + 1','n/2'],
 ['for(i=1;i<=n;i*=2)','log n + 2','log n + 1'],
 ['for(j=i;j<=n;j++) inside i=1..n','(n² + 3n)/2','(n² + n)/2']
]},
traps:[
 `Giving the header the same count as the body (it is one more).`,
 `Writing n² for a triangular loop: the exact count is <code>n(n+1)/2</code>; only the final O is n².`,
 `Forgetting the lines outside the loops (they add 1 each).`
],
quiz:[
 {q:`<code>for (int i = 0; i &lt; n; i++)</code>: how many times does the header line execute?`, o:[`n`,`n + 1`,`n - 1`,`2n`], a:1, w:`The body runs n times; the header is evaluated one extra time for the final failing check, so n + 1 (the course convention).`},
 {q:`<code>for(i=1;i&lt;=n;i++) for(j=1;j&lt;=i;j++) sum++;</code> How many times does <code>sum++</code> run?`, o:[`n&sup2;`,`n(n+1)/2`,`n log n`,`n`], a:1, w:`1 + 2 + ... + n = n(n+1)/2.`},
 {q:`<code>for (i = 1; i &lt;= n; i *= 2)</code> body runs about:`, o:[`n`,`n/2`,`log&#8322; n + 1`,`n&sup2;`], a:2, w:`i takes values 1, 2, 4, ... up to n, which is floor(log₂ n) + 1 values.`},
 {q:`<code>for(i=0;i&lt;n;i++) for(j=n;j&gt;=1;j=j/2) sum++;</code> is:`, o:[`O(n)`,`O(n log n)`,`O(n&sup2;)`,`O(log n)`], a:1, w:`The inner loop halves j: log n iterations, repeated n times.`}
],
drills:[
 {id:'p2d1', src:'Practice exam Q1(b)', bucket:'pa', time:'8 min', title:'Frequency of every line (dependent inner loop)',
  q:`Find the frequency of every line and the total O:
<pre class="code">1 for (int i = 1; i &lt;= n; i++)
2   for (int j = i; j &lt;= n; j++)
3     System.out.println("i*j=" + (i * j));
4 System.out.println("DONE");</pre>`,
  idea:`The signature exam question: an inner loop whose bound depends on i. You must produce exact formulas with sums.`,
  steps:[`Line 1 is a plain loop: n + 1.`,`For fixed i the inner loop body runs n - i + 1 times; its header one more.`,`Sum over i = 1..n using <code>&Sigma; i = n(n+1)/2</code>.`,`Add everything: dominant term n²/2 + n²/2.`],
  lang:'text',
  sol:`Line 1:  n + 1
Line 2:  sum_{i=1..n} (n - i + 2) = n(n+1)/2 + n = (n^2 + 3n)/2
Line 3:  sum_{i=1..n} (n - i + 1) = n(n+1)/2       = (n^2 + n)/2
Line 4:  1
Total:   (n+1) + (n^2+3n)/2 + (n^2+n)/2 + 1 = n^2 + 3n + 2
O(n^2)`,
  traps:[`Line 2's count is the header of the inner loop: body count plus one extra per outer iteration (+n).`]},
 {id:'p2d2', src:'Tutorial 2', bucket:'pa', time:'8 min', title:'Triangular loop and a better algorithm',
  q:`Analyse (frequency of each line, total, O) and suggest a faster way:
<pre class="code">1 int sum = 0;
2 for (int i = 1; i &lt;= n; i++)
3   for (int j = 1; j &lt;= i; j++)
4     sum = sum + 1;
5 System.out.println(sum);</pre>`,
  idea:`Same triangular shape with the inner bound j &le; i. The "faster way" part tests whether you recognise the closed form.`,
  steps:[`Inner header for given i: i + 1. Inner body: i.`,`Sum both over i = 1..n.`,`Replace the double loop by the arithmetic sum formula.`],
  lang:'text',
  sol:`Line 1: 1
Line 2: n + 1
Line 3: sum (i + 1) = n(n+1)/2 + n = (n^2 + 3n)/2
Line 4: sum i       = (n^2 + n)/2
Line 5: 1
Total:  n^2 + 3n + 3         -> O(n^2)

Faster: sum equals 1 + 2 + ... + n, so compute  sum = n * (n + 1) / 2;  in O(1).`,
  traps:[]},
 {id:'p2d3', src:'Tutorial 2', bucket:'pa', time:'8 min', title:'Halving inner loop',
  q:`Analyse:
<pre class="code">1 int sum = 0;
2 for (int i = 0; i &lt; n; i++)
3   for (int j = n; j &gt;= 1; j = j / 2)
4     sum += 1;
5 return sum;</pre>`,
  idea:`A halving loop contributes a log factor. The outer loop multiplies it by n.`,
  steps:[`Inner loop values: n, n/2, ..., 1: about log n + 1 iterations; header log n + 2.`,`Multiply by n for the outer loop.`,`Total is dominated by 2 n log n.`],
  lang:'text',
  sol:`Line 1: 1
Line 2: n + 1
Line 3: n (log n + 2)
Line 4: n (log n + 1)
Line 5: 1
Total:  2 n log n + 4n + 3        -> O(n log n)`,
  traps:[]}
]});

TOPICS.push({
id:'p3', mod:'perf', title:'Loop patterns, best and worst case, space', odds:'med', time:'12 min',
ex:['pp4d1'],
idea:`Most exam loops reduce to a few shapes. Recognise the shape and write the answer without summing from scratch. Also be ready to give <b>best and worst case inputs</b> and the <b>space</b> used beyond the input.`,
points:[
 `<b>Space complexity</b> = maximum extra memory used at any time, ignoring the input. A function with a few variables is O(1) space; one that allocates an array of size n is O(n).`,
 `<b>Best vs worst case:</b> give a concrete input for each (for example "all elements equal" vs "all distinct"), then count the work for each.`,
 `<b>Matrix operations:</b> vector + vector O(n); dot product O(n); matrix&times;vector O(mn); matrix + matrix O(mn); (m&times;k)&times;(k&times;n) matrix product O(mkn).`,
 `<b>Sorting by experiment:</b> repeat each run (for example 100 times), time with <code>System.nanoTime()</code>, average, and plot against input size.`
],
table:{head:['Pattern','Total work'],rows:[
 ['single loop, i++ or i += c','O(n)'],
 ['i *= 2 or i /= 2','O(log n)'],
 ['two independent nested loops 0..n','O(n²)'],
 ['inner j = 1..i inside i = 1..n','O(n²)'],
 ['outer n, inner halving','O(n log n)'],
 ['outer i *= 2, inner j = 1..i','O(n) — geometric 1+2+4+...+n ≈ 2n'],
 ['outer i *= 2, inner j = 1..log(i)','O(log² n)'],
 ['i < n·n·n with inner loop to n','O(n⁴)'],
 ['inner loop with constant bound (j < 6)','only a constant factor']
]},
traps:[
 `Assuming every nested loop is O(n²). The doubling-outer pattern is O(n).`,
 `Counting a constant-bound inner loop as a factor of n.`
],
quiz:[
 {q:`<code>for(i=1;i&lt;=n;i*=2) for(j=1;j&lt;=i;j++) sum++;</code> is:`, o:[`O(n log n)`,`O(n&sup2;)`,`O(n)`,`O(log n)`], a:2, w:`Inner counts are 1, 2, 4, ..., ~n. Their sum is about 2n.`},
 {q:`<code>for(i=0;i&lt;n*n*n;i++){ for(j=2;j&lt;n;j++) ... }</code> is:`, o:[`O(n&sup3;)`,`O(n&#8308;)`,`O(n&#8309;)`,`O(n log n)`], a:1, w:`n³ outer iterations times n inner.`},
 {q:`<code>for(i=0;i&lt;n;i++) for(j=1;j&lt;=100;j++) ...</code> is:`, o:[`O(n&sup2;)`,`O(100)`,`O(n)`,`O(n log n)`], a:2, w:`The inner loop has a constant bound: factor 100, so O(n).`},
 {q:`<code>int[] B = new int[i + 1];</code> allocated inside <code>for(i&lt;n)</code>, with only one B alive at a time. Space complexity (ignoring input)?`, o:[`O(1)`,`O(n)`,`O(n&sup2;)`,`O(log n)`], a:1, w:`The largest array alive at once has size n. Space is the maximum, not the sum over iterations.`},
 {q:`Multiplying an m&times;n matrix by a vector of size n costs:`, o:[`O(m + n)`,`O(mn)`,`O(n&sup2;)`,`O(m&sup2;n)`], a:1, w:`Each of the m output entries is a dot product of length n.`}
],
drills:[
 {id:'p3d1', src:'Problem set 2.9', bucket:'pa', time:'10 min', title:'Best and worst case of a run-counting function',
  q:`For the function below give (1) an input that gives the best running time and one that gives the worst, (2) the cost in each case.
<pre class="code">int func(int A[], int n) {
  int maxr = 0, maxi = 0, i = 0;
  while (i &lt; n) {
    int j = i + 1, nbr = 1;
    while (j &lt; n &amp;&amp; A[i] == A[j]) { nbr++; j++; }
    if (nbr &gt; maxr) { maxr = nbr; maxi = i; }
    i = j;
  }
  return maxi;
}</pre>`,
  idea:`The inner loop jumps <code>i</code> to <code>j</code>, so each element is looked at about once in every case. Look for what makes the algorithm skip work.`,
  steps:[`Describe what one outer iteration does: scans a run of equal values and then jumps past it.`,`Best/worst depends on how runs look, but total pointer movement is bounded by n.`,`Conclude with the complexity for each input family.`],
  lang:'text',
  sol:`The outer loop sets i = j after scanning a run of equal values, so every
element is visited a constant number of times.

All elements equal  (e.g. 5 5 5 5):  one outer iteration scans n elements -> O(n)
All distinct        (e.g. 1 2 3 4):  n outer iterations, inner loop stops at once -> O(n)

Both best and worst case are Theta(n). Contrast with a version that does i++ instead of
i = j: with all elements equal that one costs O(n^2).`,
  traps:[`Do not assume nested while loops mean O(n²). Check how the indices move.`]}
]});
