/* ISC Mathematics (860) — Class XI & XII */
window.SM = window.SM || {subjects:{}};
window.SM.subjects.maths = {
  id:'maths', name:'Mathematics', code:'860', icon:'📐', colour:'#8b5cf6',
  pattern:'Paper Theory 80 marks (3 hrs) + Project Work 20 marks. Section A (65, compulsory) + Section B OR Section C (15)',
  classes:{
  12:{ groups:[{marks:65,label:'Section A (compulsory)',units:[1,2,3,4]},{marks:15,label:'Section B — Vectors, 3-D, Applications of Integrals',units:[5]},{marks:15,label:'Section C — Commerce Applications (choose B or C)',units:[6]}],
  chapters:[
  { id:'m12-1', unit:1, name:'Relations and Functions', marks:'Section A',
    topics:['Types of relations: reflexive, symmetric, transitive, equivalence relations','Types of functions: one-one, onto, bijective; composite functions; inverse of a function','Binary operations','Inverse trigonometric functions: definition, range, domain, principal value branch; elementary properties'],
    concepts:[
      {t:'Equivalence relation', d:'A relation that is reflexive, symmetric and transitive. It partitions the set into disjoint equivalence classes.'},
      {t:'Bijection', d:'A function that is both injective (one-one: distinct inputs give distinct outputs) and surjective (onto: range = codomain). Only a bijection has an inverse.'},
      {t:'Principal value branch', d:'The restricted range chosen so that an inverse trigonometric function is single valued. sin⁻¹: [−π/2, π/2]; cos⁻¹: [0, π]; tan⁻¹: (−π/2, π/2).'}
    ],
    formulas:[
      {f:'sin⁻¹x + cos⁻¹x = π/2 ; tan⁻¹x + cot⁻¹x = π/2 ; sec⁻¹x + cosec⁻¹x = π/2', m:'Complementary identities'},
      {f:'tan⁻¹x + tan⁻¹y = tan⁻¹((x+y)/(1−xy)), xy < 1', m:'Addition formula'},
      {f:'tan⁻¹x − tan⁻¹y = tan⁻¹((x−y)/(1+xy))', m:'Subtraction'},
      {f:'2tan⁻¹x = tan⁻¹(2x/(1−x²)) = sin⁻¹(2x/(1+x²)) = cos⁻¹((1−x²)/(1+x²))', m:'Double angle'},
      {f:'sin⁻¹(−x) = −sin⁻¹x ; cos⁻¹(−x) = π − cos⁻¹x ; tan⁻¹(−x) = −tan⁻¹x', m:'Negative arguments'},
      {f:'Number of one-one functions from A(m) to B(n) = nP_m if n ≥ m, else 0', m:'Counting functions'}
    ],
    mistakes:['Forgetting the condition xy < 1 in the tan⁻¹ addition formula.','Writing cos⁻¹(−x) = −cos⁻¹x — it is π − cos⁻¹x.','Assuming every function has an inverse; only bijections do.'],
    questions:[
      {marks:4, q:'Show that the relation R on the set Z of integers defined by R = {(a,b) : 2 divides (a − b)} is an equivalence relation.', a:'Reflexive: for any a ∈ Z, a − a = 0 which is divisible by 2, so (a,a) ∈ R. Symmetric: if (a,b) ∈ R then 2 | (a − b), so a − b = 2k; then b − a = −2k which is also divisible by 2, so (b,a) ∈ R. Transitive: if (a,b) and (b,c) ∈ R then a − b = 2k and b − c = 2m; adding, a − c = 2(k + m), divisible by 2, so (a,c) ∈ R. Being reflexive, symmetric and transitive, R is an equivalence relation. It partitions Z into two classes — the even and the odd integers.'},
      {marks:4, q:'Prove that tan⁻¹(1/2) + tan⁻¹(1/5) + tan⁻¹(1/8) = π/4.', a:'First combine the first two: tan⁻¹(1/2) + tan⁻¹(1/5) = tan⁻¹[(1/2 + 1/5)/(1 − 1/10)] = tan⁻¹[(7/10)/(9/10)] = tan⁻¹(7/9). The condition xy = 1/10 < 1 is satisfied. Now add the third: tan⁻¹(7/9) + tan⁻¹(1/8) = tan⁻¹[(7/9 + 1/8)/(1 − 7/72)] = tan⁻¹[(65/72)/(65/72)] = tan⁻¹(1) = π/4. Hence proved.'},
      {marks:4, q:'Show that f : R → R defined by f(x) = 3x + 2 is bijective and find f⁻¹.', a:'One-one: let f(x₁) = f(x₂). Then 3x₁ + 2 = 3x₂ + 2, giving x₁ = x₂. Hence f is injective. Onto: let y ∈ R be arbitrary. Set y = 3x + 2, so x = (y − 2)/3 which is a real number, and f((y−2)/3) = y. Hence every y has a pre-image and f is surjective. Being both, f is bijective. Its inverse is f⁻¹(y) = (y − 2)/3, or f⁻¹(x) = (x − 2)/3.'}
    ]},
  { id:'m12-2', unit:2, name:'Algebra — Matrices and Determinants', marks:'Section A',
    topics:['Types of matrices; equality; operations — addition, scalar multiplication, multiplication','Transpose; symmetric and skew symmetric matrices','Elementary row and column operations; invertible matrices','Determinant of a square matrix up to 3×3; properties of determinants','Minors and cofactors; adjoint and inverse of a matrix','Area of a triangle; consistency of a system of linear equations; solution by matrix method'],
    concepts:[
      {t:'Singular matrix', d:'A square matrix with |A| = 0. It has no inverse. If |A| ≠ 0 the matrix is non-singular and invertible.'},
      {t:'Symmetric and skew symmetric', d:'A is symmetric if A\' = A, skew symmetric if A\' = −A. Every square matrix can be written uniquely as the sum of a symmetric matrix ½(A + A\') and a skew symmetric one ½(A − A\'). Diagonal entries of a skew symmetric matrix are all zero.'},
      {t:'Consistency', d:'For AX = B: if |A| ≠ 0, a unique solution exists (consistent). If |A| = 0 and (adj A)B ≠ O, no solution (inconsistent). If |A| = 0 and (adj A)B = O, either infinitely many solutions or none.'}
    ],
    formulas:[
      {f:'(AB)\' = B\'A\' ; (AB)⁻¹ = B⁻¹A⁻¹', m:'Reversal law'},
      {f:'A⁻¹ = (1/|A|)·adj A , |A| ≠ 0', m:'Inverse'},
      {f:'A(adj A) = (adj A)A = |A|·I', m:'Key identity'},
      {f:'|adj A| = |A|^{n−1} ; |kA| = kⁿ|A| ; |A⁻¹| = 1/|A|', m:'For an n×n matrix'},
      {f:'|AB| = |A||B| ; |A\'| = |A|', m:'Determinant properties'},
      {f:'Area = ½|x₁(y₂−y₃) + x₂(y₃−y₁) + x₃(y₁−y₂)|', m:'Area of a triangle by determinant'},
      {f:'X = A⁻¹B', m:'Matrix method for solving AX = B'}
    ],
    mistakes:['Writing (AB)⁻¹ = A⁻¹B⁻¹ — the order reverses.','Assuming AB = BA — matrix multiplication is not commutative.','Forgetting the modulus (absolute value) when computing area.','Cancelling matrices: AB = AC does not imply B = C unless A is invertible.'],
    questions:[
      {marks:4, q:'If A = [[1,2],[3,4]], verify that A(adj A) = |A|I and hence find A⁻¹.', a:'|A| = 1×4 − 2×3 = −2. Cofactors: C₁₁ = 4, C₁₂ = −3, C₂₁ = −2, C₂₂ = 1. adj A = transpose of the cofactor matrix = [[4,−2],[−3,1]]. Now A(adj A) = [[1,2],[3,4]]·[[4,−2],[−3,1]] = [[4−6, −2+2],[12−12, −6+4]] = [[−2,0],[0,−2]] = −2·I = |A|I. Verified. Hence A⁻¹ = (1/|A|)adj A = (−1/2)[[4,−2],[−3,1]] = [[−2,1],[3/2,−1/2]].'},
      {marks:6, q:'Solve by the matrix method: x + y + z = 6, y + 3z = 11, x + z = 2y (i.e. x − 2y + z = 0).', a:'Write AX = B with A = [[1,1,1],[0,1,3],[1,−2,1]], X = [x,y,z]\', B = [6,11,0]\'. |A| = 1(1+6) − 1(0−3) + 1(0−1) = 7 + 3 − 1 = 9 ≠ 0, so a unique solution exists. Cofactors give adj A = [[7,−3,2],[3,0,−3],[−1,3,1]]. Then A⁻¹ = (1/9)·adj A and X = A⁻¹B = (1/9)[[7,−3,2],[3,0,−3],[−1,3,1]]·[6,11,0]\' = (1/9)[42−33+0, 18+0−0, −6+33+0]\' = (1/9)[9,18,27]\' = [1,2,3]\'. Hence x = 1, y = 2, z = 3.'},
      {marks:4, q:'Prove that the determinant |[1,a,a²],[1,b,b²],[1,c,c²]| = (a−b)(b−c)(c−a).', a:'Apply R₁ → R₁ − R₂ and R₂ → R₂ − R₃. The determinant becomes |[0, a−b, a²−b²],[0, b−c, b²−c²],[1, c, c²]|. Take (a−b) common from R₁ and (b−c) from R₂: (a−b)(b−c)|[0,1,a+b],[0,1,b+c],[1,c,c²]|. Now R₁ → R₁ − R₂ gives (a−b)(b−c)|[0,0,a−c],[0,1,b+c],[1,c,c²]|. Expanding along the first column, this equals (a−b)(b−c)(a−c)·(0·... ) — expanding gives (a−b)(b−c)(a−c)×(−1)... Carefully: expanding along C₁, only the entry 1 in row 3 contributes, with sign (+): 1·|[0, a−c],[1, b+c]| = 0(b+c) − (a−c)(1) = −(a−c) = (c−a). Hence the value is (a−b)(b−c)(c−a).'}
    ]},
  { id:'m12-3', unit:3, name:'Calculus', marks:'Section A — the largest block',
    topics:['Continuity and differentiability; derivative of composite, implicit and inverse trigonometric functions','Logarithmic differentiation; derivatives of exponential and logarithmic functions','Derivatives of functions in parametric form; second order derivatives','Rolle\'s and Lagrange\'s Mean Value Theorems','Applications of derivatives: rate of change, increasing and decreasing functions, tangents and normals, maxima and minima','Integrals: integration as inverse of differentiation, by substitution, by parts, by partial fractions','Definite integrals as a limit of a sum; fundamental theorem of calculus; properties of definite integrals','Differential equations: order and degree, variables separable, homogeneous, linear differential equations'],
    concepts:[
      {t:'Continuity', d:'f is continuous at x = a if lim_{x→a⁻}f(x) = lim_{x→a⁺}f(x) = f(a). All three must exist and be equal.'},
      {t:'Rolle\'s theorem', d:'If f is continuous on [a,b], differentiable on (a,b) and f(a) = f(b), then there exists c ∈ (a,b) with f\'(c) = 0.'},
      {t:'Lagrange\'s MVT', d:'If f is continuous on [a,b] and differentiable on (a,b), there exists c ∈ (a,b) with f\'(c) = [f(b) − f(a)]/(b − a).'},
      {t:'First derivative test', d:'If f\'(x) changes from + to − at c, then c is a point of local maximum; from − to +, a local minimum; no change, a point of inflection.'},
      {t:'Linear differential equation', d:'dy/dx + Py = Q where P, Q are functions of x. Solved by multiplying by the integrating factor e^{∫P dx}.'}
    ],
    formulas:[
      {f:'d/dx(sin⁻¹x) = 1/√(1−x²) ; d/dx(tan⁻¹x) = 1/(1+x²) ; d/dx(sec⁻¹x) = 1/(|x|√(x²−1))', m:'Inverse trig derivatives'},
      {f:'d/dx(aˣ) = aˣ ln a ; d/dx(log_a x) = 1/(x ln a)', m:'Exponential and log'},
      {f:'Parametric: dy/dx = (dy/dt)/(dx/dt)', m:'Parametric differentiation'},
      {f:'Increasing if f\'(x) > 0 ; decreasing if f\'(x) < 0', m:'Monotonicity'},
      {f:'Tangent: y − y₁ = m(x − x₁), m = dy/dx ; Normal slope = −1/m', m:'Tangent and normal'},
      {f:'∫u v dx = u∫v dx − ∫(du/dx · ∫v dx)dx  [ILATE]', m:'Integration by parts'},
      {f:'∫eˣ[f(x) + f\'(x)]dx = eˣf(x) + C', m:'Special form'},
      {f:'∫dx/(x²+a²) = (1/a)tan⁻¹(x/a) ; ∫dx/(x²−a²) = (1/2a)log|(x−a)/(x+a)|', m:'Standard integrals'},
      {f:'∫dx/√(a²−x²) = sin⁻¹(x/a) ; ∫dx/√(x²+a²) = log|x + √(x²+a²)|', m:'Standard integrals'},
      {f:'∫√(a²−x²)dx = (x/2)√(a²−x²) + (a²/2)sin⁻¹(x/a)', m:'Standard integrals'},
      {f:'∫₀ᵃf(x)dx = ∫₀ᵃf(a−x)dx ; ∫₋ₐᵃf(x)dx = 2∫₀ᵃf(x)dx if f is even, 0 if odd', m:'Properties of definite integrals'},
      {f:'∫₀^{2a}f(x)dx = 2∫₀ᵃf(x)dx if f(2a−x) = f(x), else 0', m:'Property'},
      {f:'IF = e^{∫P dx} ; y·IF = ∫Q·IF dx + C', m:'Linear differential equation'},
      {f:'Homogeneous: put y = vx, then dy/dx = v + x dv/dx', m:'Substitution'}
    ],
    mistakes:['Forgetting +C in indefinite integrals.','Choosing u and v wrongly in integration by parts — follow ILATE.','Not checking all three conditions of Rolle\'s theorem before applying it.','Confusing order (highest derivative) with degree (power of the highest derivative) of a differential equation.','Forgetting the modulus in ∫dx/x = log|x| + C.'],
    questions:[
      {marks:4, q:'Find the intervals in which f(x) = 2x³ − 9x² + 12x + 15 is increasing or decreasing.', a:'f\'(x) = 6x² − 18x + 12 = 6(x² − 3x + 2) = 6(x − 1)(x − 2). The critical points are x = 1 and x = 2. For x < 1 both factors are negative, so f\'(x) > 0 — increasing. For 1 < x < 2, (x−1) > 0 and (x−2) < 0, so f\'(x) < 0 — decreasing. For x > 2 both factors are positive, so f\'(x) > 0 — increasing. Hence f is increasing on (−∞, 1) ∪ (2, ∞) and decreasing on (1, 2).'},
      {marks:6, q:'A window is in the form of a rectangle surmounted by a semicircle. If the perimeter is 30 m, find the dimensions for maximum area.', a:'Let the rectangle have width 2r (so the semicircle has radius r) and height h. Perimeter = 2r + 2h + πr = 30, so h = (30 − 2r − πr)/2. Area A = 2rh + ½πr² = 2r(30 − 2r − πr)/2 + ½πr² = r(30 − 2r − πr) + ½πr² = 30r − 2r² − πr² + ½πr² = 30r − 2r² − ½πr². Then dA/dr = 30 − 4r − πr = 0, giving r = 30/(4 + π). d²A/dr² = −4 − π < 0, so this is a maximum. Hence radius = 30/(π + 4) m, width = 60/(π + 4) m, and height h = (30 − (2 + π)·30/(4+π))/2 = 30/(π + 4) m. So the height equals the radius.'},
      {marks:4, q:'Evaluate ∫ x·eˣ dx and ∫₀^{π/2} log(sin x)dx.', a:'(i) By parts with u = x, v = eˣ (ILATE: algebraic before exponential): ∫x eˣ dx = x eˣ − ∫1·eˣ dx = x eˣ − eˣ + C = eˣ(x − 1) + C. (ii) Let I = ∫₀^{π/2}log(sin x)dx. Using ∫₀ᵃf(x)dx = ∫₀ᵃf(a−x)dx, I = ∫₀^{π/2}log(cos x)dx. Adding: 2I = ∫₀^{π/2}log(sin x cos x)dx = ∫₀^{π/2}log(sin 2x /2)dx = ∫₀^{π/2}log(sin2x)dx − (π/2)log2. Substituting 2x = t in the first integral gives ∫₀^{π/2}log(sin t)dt = I. So 2I = I − (π/2)log2, giving I = −(π/2)log2.'},
      {marks:4, q:'Solve the differential equation dy/dx + y·cot x = 2cos x.', a:'This is linear with P = cot x and Q = 2cos x. IF = e^{∫cot x dx} = e^{log sin x} = sin x. Multiplying through: y·sin x = ∫2cos x·sin x dx = ∫sin 2x dx = −(1/2)cos 2x + C. Hence the solution is y sin x + (1/2)cos 2x = C.'},
      {marks:4, q:'Verify Rolle\'s theorem for f(x) = x² − 4x + 3 on [1, 3].', a:'f is a polynomial, so it is continuous on [1,3] and differentiable on (1,3). f(1) = 1 − 4 + 3 = 0 and f(3) = 9 − 12 + 3 = 0, so f(1) = f(3). All three conditions hold, so Rolle\'s theorem applies. f\'(x) = 2x − 4 = 0 gives x = 2, which lies in the open interval (1,3). Hence c = 2 and the theorem is verified.'}
    ]},
  { id:'m12-4', unit:4, name:'Probability', marks:'Section A',
    topics:['Conditional probability; multiplication theorem','Independent events','Total probability; Bayes\' theorem','Random variables and their probability distributions','Mean and variance of a random variable','Binomial distribution'],
    concepts:[
      {t:'Conditional probability', d:'P(A|B) = P(A∩B)/P(B), P(B) ≠ 0 — the probability of A given that B has already occurred.'},
      {t:'Independence', d:'A and B are independent if P(A∩B) = P(A)·P(B). Independence is different from mutual exclusivity — mutually exclusive events with non-zero probability are never independent.'},
      {t:'Bayes\' theorem', d:'Lets you reverse the conditioning: given the effect, find the probability of a particular cause. The E_i must be mutually exclusive and exhaustive.'},
      {t:'Binomial distribution', d:'Applies to n independent Bernoulli trials, each with the same probability p of success. Mean np, variance npq — variance is always less than the mean.'}
    ],
    formulas:[
      {f:'P(A|B) = P(A∩B)/P(B)', m:'Conditional probability'},
      {f:'P(A∩B) = P(A)·P(B|A) = P(B)·P(A|B)', m:'Multiplication theorem'},
      {f:'P(A) = ΣP(E_i)·P(A|E_i)', m:'Total probability'},
      {f:'P(E_i|A) = P(E_i)P(A|E_i) / ΣP(E_j)P(A|E_j)', m:'Bayes\' theorem'},
      {f:'Mean μ = Σx_i p_i ; Variance σ² = Σx_i²p_i − μ²', m:'Random variable'},
      {f:'P(X = r) = ⁿC_r p^r q^{n−r}', m:'Binomial probability'},
      {f:'Binomial: mean = np, variance = npq, SD = √(npq)', m:'Binomial parameters'}
    ],
    mistakes:['Confusing independent with mutually exclusive events.','Forgetting to check that the events in Bayes\' theorem are exhaustive.','Using variance = np instead of npq.'],
    questions:[
      {marks:6, q:'Bag A contains 3 red and 5 black balls; bag B contains 4 red and 4 black balls. One bag is chosen at random and a ball drawn is found to be red. Find the probability that it came from bag B.', a:'Let E₁ = bag A chosen, E₂ = bag B chosen, A = red ball drawn. P(E₁) = P(E₂) = 1/2. P(A|E₁) = 3/8, P(A|E₂) = 4/8 = 1/2. By Bayes\' theorem, P(E₂|A) = P(E₂)P(A|E₂) / [P(E₁)P(A|E₁) + P(E₂)P(A|E₂)] = (1/2 × 1/2) / (1/2 × 3/8 + 1/2 × 1/2) = (1/4)/(3/16 + 1/4) = (1/4)/(7/16) = 4/7.'},
      {marks:4, q:'A die is thrown 6 times. If getting an odd number is a success, find the probability of (i) exactly 5 successes, (ii) at least 5 successes.', a:'p = 3/6 = 1/2, q = 1/2, n = 6. (i) P(X = 5) = ⁶C₅(1/2)⁵(1/2)¹ = 6 × (1/64) = 6/64 = 3/32. (ii) P(X ≥ 5) = P(X = 5) + P(X = 6) = 6/64 + ⁶C₆(1/2)⁶ = 6/64 + 1/64 = 7/64.'},
      {marks:4, q:'Two cards are drawn without replacement from a well-shuffled pack. Find the probability distribution of the number of kings, and its mean.', a:'Let X = number of kings, X = 0, 1, 2. P(X=0) = (48×47)/(52×51) = 2256/2652 = 188/221. P(X=1) = 2×(4×48)/(52×51) = 384/2652 = 32/221. P(X=2) = (4×3)/(52×51) = 12/2652 = 1/221. Check: 188 + 32 + 1 = 221. ✓ Mean = Σx_ip_i = 0(188/221) + 1(32/221) + 2(1/221) = 34/221 = 2/13.'}
    ]},
  { id:'m12-5', unit:5, name:'Section B — Vectors, 3-D Geometry, Applications of Integrals', marks:'15 (choose B or C)',
    topics:['Vectors: magnitude and direction, direction cosines and ratios, types of vectors','Addition of vectors; multiplication by a scalar; position vector; section formula','Scalar (dot) product; projection of a vector','Vector (cross) product; scalar triple product','Three-dimensional geometry: direction cosines and ratios of a line','Equations of a line in space; angle between two lines; shortest distance between two lines','Equation of a plane; angle between two planes, a line and a plane; distance of a point from a plane','Applications of integrals: area under simple curves, area between two curves'],
    concepts:[
      {t:'Dot vs cross product', d:'Dot product gives a scalar and is used for angles, projections and work. Cross product gives a vector perpendicular to both, used for areas, torque and normals.'},
      {t:'Coplanarity', d:'Three vectors are coplanar if their scalar triple product [a b c] = 0.'},
      {t:'Skew lines', d:'Lines in space that are neither parallel nor intersecting. The shortest distance between them is measured along their common perpendicular.'}
    ],
    formulas:[
      {f:'a⃗·b⃗ = |a||b|cosθ ; cosθ = (a⃗·b⃗)/(|a||b|)', m:'Dot product'},
      {f:'Projection of a⃗ on b⃗ = (a⃗·b⃗)/|b⃗|', m:'Projection'},
      {f:'|a⃗ × b⃗| = |a||b|sinθ ; area of triangle = ½|a⃗ × b⃗|', m:'Cross product'},
      {f:'[a⃗ b⃗ c⃗] = a⃗·(b⃗ × c⃗) ; volume of parallelepiped', m:'Scalar triple product'},
      {f:'r⃗ = a⃗ + λb⃗ ; (x−x₁)/a = (y−y₁)/b = (z−z₁)/c', m:'Line in space'},
      {f:'SD = |(a⃗₂ − a⃗₁)·(b⃗₁ × b⃗₂)| / |b⃗₁ × b⃗₂|', m:'Shortest distance between skew lines'},
      {f:'r⃗·n⃗ = d ; ax + by + cz = d', m:'Plane'},
      {f:'Distance of (x₁,y₁,z₁) from ax+by+cz+d = 0 is |ax₁+by₁+cz₁+d|/√(a²+b²+c²)', m:'Point to plane'},
      {f:'Area = ∫ₐᵇ y dx or ∫ₐᵇ x dy', m:'Area under a curve'},
      {f:'Area between curves = ∫ₐᵇ (y_upper − y_lower)dx', m:'Area between two curves'}
    ],
    mistakes:['Taking a⃗ × b⃗ = b⃗ × a⃗ — the cross product is anti-commutative.','Forgetting the modulus in the shortest distance formula.','Not sketching the region before computing area — the limits and which curve is upper depend on it.'],
    questions:[
      {marks:4, q:'Find the shortest distance between the lines r⃗ = (î + ĵ) + λ(2î − ĵ + k̂) and r⃗ = (2î + ĵ − k̂) + μ(3î − 5ĵ + 2k̂).', a:'a⃗₁ = î + ĵ, b⃗₁ = 2î − ĵ + k̂; a⃗₂ = 2î + ĵ − k̂, b⃗₂ = 3î − 5ĵ + 2k̂. a⃗₂ − a⃗₁ = î + 0ĵ − k̂. b⃗₁ × b⃗₂ = |î ĵ k̂; 2 −1 1; 3 −5 2| = î(−2 + 5) − ĵ(4 − 3) + k̂(−10 + 3) = 3î − ĵ − 7k̂. |b⃗₁ × b⃗₂| = √(9 + 1 + 49) = √59. (a⃗₂ − a⃗₁)·(b⃗₁ × b⃗₂) = 3 − 0 + 7 = 10. Hence SD = 10/√59 units.'},
      {marks:4, q:'Find the area enclosed between the parabola y² = 4x and the line y = 2x.', a:'Solve for intersections: (2x)² = 4x gives 4x² = 4x, so x = 0 or x = 1; the points are (0,0) and (1,2). Between x = 0 and x = 1, the parabola y = 2√x lies above the line y = 2x. Area = ∫₀¹(2√x − 2x)dx = [2·(2/3)x^{3/2} − x²]₀¹ = 4/3 − 1 = 1/3 square units.'},
      {marks:4, q:'Find the angle between the planes 2x − y + z = 6 and x + y + 2z = 7.', a:'The normals are n⃗₁ = 2î − ĵ + k̂ and n⃗₂ = î + ĵ + 2k̂. cosθ = (n⃗₁·n⃗₂)/(|n⃗₁||n⃗₂|) = (2 − 1 + 2)/(√6·√6) = 3/6 = 1/2. Hence θ = 60° (π/3).'}
    ]},
  { id:'m12-6', unit:6, name:'Section C — Applications in Commerce and Economics', marks:'15 (choose B or C)',
    topics:['Application of calculus in commerce and economics: cost function, average cost, marginal cost, revenue, marginal revenue, profit, break-even point','Linear regression: lines of regression of x on y and y on x; coefficient of correlation','Linear programming: mathematical formulation, graphical method, feasible and infeasible regions, optimal solution'],
    concepts:[
      {t:'Marginal cost', d:'The instantaneous rate of change of total cost with respect to output: MC = dC/dx. Similarly marginal revenue MR = dR/dx.'},
      {t:'Break-even point', d:'The output at which total revenue equals total cost, so profit is zero.'},
      {t:'Regression lines', d:'Two lines: y on x (used to estimate y from x) and x on y. They intersect at the mean point (x̄, ȳ). The correlation coefficient r = ±√(b_yx · b_xy), taking the sign of the regression coefficients.'},
      {t:'Feasible region', d:'The region satisfying all the constraints of a linear programming problem. If bounded, the optimum occurs at a corner point; if unbounded, the optimum may not exist.'}
    ],
    formulas:[
      {f:'AC = C(x)/x ; MC = dC/dx ; MR = dR/dx ; P(x) = R(x) − C(x)', m:'Cost and revenue'},
      {f:'Profit is maximum when MR = MC and d(MR)/dx < d(MC)/dx', m:'Optimisation'},
      {f:'b_yx = r·(σ_y/σ_x) ; b_xy = r·(σ_x/σ_y) ; r = ±√(b_yx·b_xy)', m:'Regression coefficients'},
      {f:'y − ȳ = b_yx(x − x̄) ; x − x̄ = b_xy(y − ȳ)', m:'Lines of regression'},
      {f:'r = Σ(x−x̄)(y−ȳ) / √[Σ(x−x̄)²·Σ(y−ȳ)²]', m:'Karl Pearson correlation coefficient'},
      {f:'Corner point method: evaluate Z = ax + by at every vertex of the feasible region', m:'Linear programming'}
    ],
    mistakes:['Confusing the two regression lines — check which variable is being estimated.','Taking r positive when the regression coefficients are negative.','Forgetting the non-negativity constraints x ≥ 0, y ≥ 0 in LPP.'],
    questions:[
      {marks:4, q:'The total cost function is C(x) = 0.005x³ − 0.02x² + 30x + 5000. Find the marginal cost when 3 units are produced.', a:'MC = dC/dx = 0.015x² − 0.04x + 30. At x = 3: MC = 0.015(9) − 0.04(3) + 30 = 0.135 − 0.12 + 30 = 30.015. So the marginal cost is ₹30.015, i.e. producing the fourth unit costs approximately ₹30.02.'},
      {marks:6, q:'Solve graphically: Maximise Z = 4x + y subject to x + y ≤ 50, 3x + y ≤ 90, x ≥ 0, y ≥ 0.', a:'Plot the lines x + y = 50 (through (50,0) and (0,50)) and 3x + y = 90 (through (30,0) and (0,90)). The feasible region is bounded by O(0,0), A(30,0), B and C(0,50), where B is the intersection of the two lines: subtracting, 2x = 40, so x = 20 and y = 30, giving B(20,30). Evaluate Z = 4x + y at each corner: O(0,0) → 0; A(30,0) → 120; B(20,30) → 80 + 30 = 110; C(0,50) → 50. The maximum value of Z is 120 at x = 30, y = 0.'}
    ]}
  ]},
  11:{ groups:[], chapters:[
  { id:'m11-1', unit:1, name:'Sets and Functions', marks:'—',
    topics:['Sets and their representations; types of sets; Venn diagrams; operations on sets','Complement of a set; practical problems on union and intersection','Relations: ordered pairs, Cartesian product, domain, codomain and range','Functions: real valued functions, domain and range of constant, identity, polynomial, rational, modulus, signum, exponential, logarithmic and greatest integer functions','Trigonometric functions: measuring angles in radians and degrees, general solutions, identities, sine and cosine rules'],
    concepts:[
      {t:'Cardinality formula', d:'n(A∪B) = n(A) + n(B) − n(A∩B). For three sets, add the singles, subtract the pairs, add back the triple.'},
      {t:'General solution', d:'sin θ = sin α ⟹ θ = nπ + (−1)ⁿα; cos θ = cos α ⟹ θ = 2nπ ± α; tan θ = tan α ⟹ θ = nπ + α, n ∈ Z.'}
    ],
    formulas:[
      {f:'n(A∪B∪C) = n(A)+n(B)+n(C) −n(A∩B) −n(B∩C) −n(A∩C) +n(A∩B∩C)', m:'Inclusion–exclusion'},
      {f:'Number of subsets of a set with n elements = 2ⁿ', m:'Power set'},
      {f:'sin(A±B) = sinA cosB ± cosA sinB ; cos(A±B) = cosA cosB ∓ sinA sinB', m:'Compound angles'},
      {f:'sin2A = 2sinA cosA ; cos2A = 2cos²A − 1 = 1 − 2sin²A ; tan2A = 2tanA/(1−tan²A)', m:'Double angles'},
      {f:'a/sinA = b/sinB = c/sinC = 2R ; a² = b² + c² − 2bc cosA', m:'Sine and cosine rules'}
    ],
    mistakes:['Forgetting the (−1)ⁿ in the general solution of sine.','Confusing codomain with range.'],
    questions:[
      {marks:4, q:'In a class of 60 students, 30 study Mathematics, 25 study Physics and 12 study both. How many study neither?', a:'n(M∪P) = n(M) + n(P) − n(M∩P) = 30 + 25 − 12 = 43. Students studying neither = 60 − 43 = 17.'}
    ]},
  { id:'m11-2', unit:2, name:'Algebra', marks:'—',
    topics:['Complex numbers: algebra, modulus and argument, argand plane, quadratic equations with complex roots','Quadratic equations: nature of roots, relation between roots and coefficients','Finite and infinite sequences and series; arithmetic and geometric progressions; AM and GM','Permutations and combinations; fundamental principle of counting','Binomial theorem for a positive integral index; general and middle terms','Mathematical induction'],
    concepts:[
      {t:'Modulus and argument', d:'For z = a + ib, |z| = √(a² + b²) and arg z = tan⁻¹(b/a), adjusted for the quadrant. Polar form: z = r(cosθ + i sinθ).'},
      {t:'Nature of roots', d:'For ax² + bx + c = 0, the discriminant D = b² − 4ac. D > 0 gives real distinct roots, D = 0 real equal, D < 0 complex conjugate.'},
      {t:'AM ≥ GM', d:'For positive numbers, the arithmetic mean is always greater than or equal to the geometric mean, with equality only when all numbers are equal.'}
    ],
    formulas:[
      {f:'i² = −1 ; |z₁z₂| = |z₁||z₂| ; z·z̄ = |z|²', m:'Complex numbers'},
      {f:'Sum of roots = −b/a ; Product = c/a', m:'Quadratic'},
      {f:'AP: aₙ = a + (n−1)d ; Sₙ = (n/2)[2a + (n−1)d]', m:'Arithmetic progression'},
      {f:'GP: aₙ = ar^{n−1} ; Sₙ = a(rⁿ−1)/(r−1) ; S∞ = a/(1−r), |r| < 1', m:'Geometric progression'},
      {f:'ⁿP_r = n!/(n−r)! ; ⁿC_r = n!/[r!(n−r)!]', m:'Permutations and combinations'},
      {f:'(a+b)ⁿ = Σ ⁿC_r a^{n−r}b^r ; T_{r+1} = ⁿC_r a^{n−r}b^r', m:'Binomial theorem'},
      {f:'Middle term: ((n/2)+1)th if n even; ((n+1)/2)th and ((n+3)/2)th if n odd', m:'Binomial expansion'}
    ],
    mistakes:['Using T_r instead of T_{r+1} for the general term.','Forgetting |r| < 1 for the sum of an infinite GP.'],
    questions:[
      {marks:4, q:'Find the term independent of x in the expansion of (x² − 1/x)⁹.', a:'T_{r+1} = ⁹C_r (x²)^{9−r}(−1/x)^r = ⁹C_r (−1)^r x^{18−2r−r} = ⁹C_r(−1)^r x^{18−3r}. For the term independent of x, 18 − 3r = 0, so r = 6. Hence the term is ⁹C₆(−1)⁶ = 84.'}
    ]},
  { id:'m11-3', unit:3, name:'Coordinate Geometry', marks:'—',
    topics:['Straight lines: slope, various forms of the equation of a line, distance of a point from a line','Circles: standard equation, general equation, equation of a circle when the end points of a diameter are given','Conic sections: parabola, ellipse and hyperbola — standard equations and simple properties'],
    concepts:[
      {t:'Slope', d:'m = tanθ = (y₂ − y₁)/(x₂ − x₁). Parallel lines have equal slopes; perpendicular lines have m₁m₂ = −1.'},
      {t:'Eccentricity', d:'Parabola e = 1; ellipse 0 < e < 1; hyperbola e > 1; circle e = 0.'}
    ],
    formulas:[
      {f:'y − y₁ = m(x − x₁) ; y = mx + c ; x/a + y/b = 1', m:'Forms of a line'},
      {f:'d = |ax₁ + by₁ + c|/√(a²+b²)', m:'Distance of a point from a line'},
      {f:'(x−h)² + (y−k)² = r² ; x² + y² + 2gx + 2fy + c = 0, centre (−g,−f), r = √(g²+f²−c)', m:'Circle'},
      {f:'y² = 4ax (parabola) ; x²/a² + y²/b² = 1 (ellipse) ; x²/a² − y²/b² = 1 (hyperbola)', m:'Standard conics'},
      {f:'Ellipse: b² = a²(1−e²) ; Hyperbola: b² = a²(e²−1)', m:'Eccentricity relations'}
    ],
    mistakes:['Forgetting the modulus in the distance formula.','Mixing up the sign in b² for ellipse and hyperbola.'],
    questions:[
      {marks:4, q:'Find the equation of the circle with centre (2,−3) passing through (5,1).', a:'Radius = distance between centre and the point = √[(5−2)² + (1+3)²] = √(9 + 16) = 5. Equation: (x − 2)² + (y + 3)² = 25, i.e. x² + y² − 4x + 6y − 12 = 0.'}
    ]},
  { id:'m11-4', unit:4, name:'Calculus (Limits and Derivatives)', marks:'—',
    topics:['Intuitive idea of limits; limits of polynomial and rational functions','Limits of trigonometric functions','Derivative: definition as the limit of a difference quotient; geometrical meaning','Derivatives of polynomial and trigonometric functions; algebra of derivatives'],
    concepts:[
      {t:'First principle', d:'f\'(x) = lim_{h→0}[f(x+h) − f(x)]/h — the definition of the derivative as the slope of the tangent.'}
    ],
    formulas:[
      {f:'lim_{x→0}(sin x)/x = 1 ; lim_{x→0}(1 − cos x)/x² = 1/2', m:'Standard trigonometric limits'},
      {f:'lim_{x→a}(xⁿ − aⁿ)/(x − a) = naⁿ⁻¹', m:'Standard algebraic limit'},
      {f:'(uv)\' = u\'v + uv\' ; (u/v)\' = (u\'v − uv\')/v²', m:'Product and quotient rules'}
    ],
    mistakes:['Applying lim(sin x)/x = 1 when x is in degrees — it holds only in radians.'],
    questions:[
      {marks:4, q:'Find the derivative of sin x from first principles.', a:'f\'(x) = lim_{h→0}[sin(x+h) − sin x]/h. Using sin C − sin D = 2cos((C+D)/2)·sin((C−D)/2): = lim_{h→0}[2cos(x + h/2)·sin(h/2)]/h = lim_{h→0}cos(x + h/2)·[sin(h/2)/(h/2)]. As h → 0 the bracket tends to 1 and cos(x + h/2) → cos x. Hence f\'(x) = cos x.'}
    ]},
  { id:'m11-5', unit:5, name:'Statistics and Probability', marks:'—',
    topics:['Measures of dispersion: range, mean deviation, variance and standard deviation','Analysis of frequency distributions with equal means but different variances','Random experiments, sample space, events; axiomatic approach to probability','Probability of an event; addition rule; mutually exclusive and exhaustive events'],
    concepts:[
      {t:'Coefficient of variation', d:'CV = (σ/x̄) × 100. Used to compare the variability of two distributions with different means — the smaller the CV, the more consistent the data.'}
    ],
    formulas:[
      {f:'σ² = Σ(x_i − x̄)²/n = Σx_i²/n − x̄²', m:'Variance'},
      {f:'CV = (σ/x̄) × 100', m:'Coefficient of variation'},
      {f:'P(A∪B) = P(A) + P(B) − P(A∩B)', m:'Addition theorem'},
      {f:'P(A\') = 1 − P(A)', m:'Complement'}
    ],
    mistakes:['Dividing by n − 1 instead of n for population variance in the ISC syllabus.'],
    questions:[
      {marks:4, q:'The mean of 5 observations is 4.4 and their variance is 8.24. If three of the observations are 1, 2 and 6, find the other two.', a:'Let the other two be x and y. Mean: (1+2+6+x+y)/5 = 4.4, so x + y = 22 − 9 = 13. Variance: Σx_i²/5 − (4.4)² = 8.24, so Σx_i² = 5(8.24 + 19.36) = 138. Now 1 + 4 + 36 + x² + y² = 138, so x² + y² = 97. From x + y = 13, (x+y)² = 169 = x² + y² + 2xy = 97 + 2xy, so xy = 36. Solving t² − 13t + 36 = 0 gives t = 4 or 9. The observations are 4 and 9.'}
    ]}
  ]}
  }
};
