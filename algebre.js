/* Chapitre : Algèbre */
(function (G) {
  'use strict';
  const RB = G.RB, Q = RB.Q, Qo = RB.Qo, F = RB.frac, N = RB.num, H = RB.Qhtml;
  const AN = 'Amérique du Nord – Spécialité · 1A-A01-1';
  const TECH = 'Centres Étrangers – Techno · 1A-A01-5';
  const SPE = 'Centres Étrangers – Spécialité · 1A-A01-3';
  const poly = (arr) => RB.polyHTML(arr);
  const mono = (c, k) => { const a = []; for (let i = 0; i < k; i++) a.push(0); a.push(c); return a; };
  const addP = (a, b) => { const r = []; for (let i = 0; i < Math.max(a.length, b.length); i++) r.push((a[i] || 0) + (b[i] || 0)); return r; };
  const key = (arr) => arr.join(',');

  /* ---------- 1. Isoler une variable ---------- */
  RB.register({
    id: 'isolate', chapter: 'algebre', theme: 'Isoler une variable', difficulty: 3,
    title: 'Exprimer x en fonction de y',
    originals: [{
      source: SPE + ' (question 8)',
      statement: 'Soient x et y deux réels strictement positifs tels que : y = ' + F(7, '7 + x') + '.<br>On peut affirmer que :',
      qcm: {
        options: [
          { html: 'x = ' + F(49, '7y − 7'), why: 'Vérifie chaque étape : après avoir multiplié par (7 + x) puis divisé par y, on obtient 7 + x = ' + F(7, 'y') + ' ; il reste à soustraire 7.' },
          { html: 'x = 7 − 7y', why: 'Tu as multiplié par le dénominateur sans diviser ensuite par y.' },
          { html: 'x = ' + F(7, 'y') + ' − 7', correct: true },
          { html: 'x = ' + F(7, '7 + y'), why: 'On ne peut pas « échanger » x et y : il faut isoler x pas à pas.' }
        ]
      },
      steps: ['On multiplie les deux membres par (7 + x) (non nul) : y(7 + x) = 7.', 'On divise par y (non nul) : 7 + x = ' + F(7, 'y') + '.', 'On soustrait 7 : x = ' + F(7, 'y') + ' − 7.'],
      pitfalls: ['Une seule opération à la fois, sur les deux membres.', 'On isole d\'abord le bloc (7 + x), puis x.']
    }],
    generate(r) {
      const a = r.int(2, 9), b = r.int(2, 9);
      return {
        statement: 'Soient x et y deux réels strictement positifs tels que : y = ' + F(a, b + ' + x') + '.<br>On peut affirmer que :',
        qcm: RB.qcm({ html: 'x = ' + F(a, 'y') + ' − ' + b, val: 'c' }, [
          { html: 'x = ' + F(a * a, a + 'y − ' + b), val: 'w1', why: 'Vérifie chaque étape : on obtient d\'abord ' + b + ' + x = ' + F(a, 'y') + '.' },
          { html: 'x = ' + a + ' − ' + b + 'y', val: 'w2', why: 'Tu as multiplié par le dénominateur sans diviser ensuite par y.' },
          { html: 'x = ' + F(a, b + ' + y'), val: 'w3', why: 'On ne peut pas « échanger » x et y : il faut isoler x pas à pas.' },
          { html: 'x = ' + F('y', a) + ' − ' + b, val: 'w4', why: 'Tu as inversé la fraction : y(' + b + ' + x) = ' + a + ', donc ' + b + ' + x = ' + F(a, 'y') + '.' }
        ]),
        steps: ['On multiplie les deux membres par (' + b + ' + x) (non nul) : y(' + b + ' + x) = ' + a + '.', 'On divise par y (non nul) : ' + b + ' + x = ' + F(a, 'y') + '.', 'On soustrait ' + b + ' : x = ' + F(a, 'y') + ' − ' + b + '.'],
        pitfalls: ['Une seule opération à la fois, sur les deux membres.', 'On isole d\'abord le bloc (' + b + ' + x), puis x.']
      };
    }
  });

  /* ---------- 2. Développer (x^k ± c)^2 ---------- */
  RB.register({
    id: 'dev-square', chapter: 'algebre', theme: 'Identités remarquables', difficulty: 2,
    title: 'Développer un carré (a ± b)²',
    originals: [{
      source: SPE + ' (question 5)',
      statement: 'La forme développée et réduite de l\'expression (x<sup>4</sup> − 4)<sup>2</sup> est :',
      qcm: {
        options: [
          { html: 'x<sup>8</sup> + 8x<sup>4</sup> − 16', why: 'Le signe du double produit et celui du dernier terme sont faux : (a − b)² = a² − 2ab + <b>b²</b> (b² est toujours positif).' },
          { html: 'x<sup>7</sup> − 8x<sup>4</sup> + 16', why: '(x<sup>4</sup>)² = x<sup>4×2</sup> = x<sup>8</sup>, on multiplie les exposants.' },
          { html: 'x<sup>8</sup> − 8x<sup>4</sup> + 16', correct: true },
          { html: 'x<sup>8</sup> − 16', why: 'Tu as oublié le double produit : (a − b)² ≠ a² − b².' }
        ]
      },
      steps: ['On utilise (a − b)² = a² − 2ab + b² avec a = x<sup>4</sup> et b = 4.', '(x<sup>4</sup>)² = x<sup>8</sup> ; 2 × x<sup>4</sup> × 4 = 8x<sup>4</sup> ; 4² = 16.', 'Donc (x<sup>4</sup> − 4)² = x<sup>8</sup> − 8x<sup>4</sup> + 16.'],
      pitfalls: ['(a − b)² n\'est pas a² − b² : il y a le double produit −2ab.', '(x<sup>4</sup>)² = x<sup>8</sup> (on multiplie les exposants).']
    }],
    generate(r) {
      const k = r.int(2, 5), c = r.int(2, 9), s = r.pick([1, -1]);
      const A = (cx, cc, e) => { const a = []; for (let i = 0; i <= e; i++) a.push(0); return a; };
      const mk = (c2k, c1k, c0, e2) => { const a = mono(c2k, e2); return addP(addP(a, mono(c1k, k)), [c0]); };
      const good = mk(1, 2 * s * c, c * c, 2 * k);
      const w1 = mk(1, -2 * s * c, -c * c, 2 * k);
      const w2 = mk(1, 2 * s * c, c * c, 2 * k - 1);
      const w3 = mk(1, 0, s === 1 ? c * c : -c * c, 2 * k);
      const w4 = mk(1, 2 * s * c, -c * c, 2 * k);
      const o = (arr, why) => ({ html: poly(arr), val: key(arr), why });
      return {
        statement: 'La forme développée et réduite de l\'expression (x<sup>' + k + '</sup> ' + (s > 0 ? '+' : '−') + ' ' + c + ')<sup>2</sup> est :',
        qcm: RB.qcm(o(good), [
          o(w1, 'Les signes sont faux : le double produit a le signe de ' + (s > 0 ? '+' : '−') + c + ' et le dernier terme b² = ' + (c * c) + ' est toujours positif.'),
          o(w2, '(x<sup>' + k + '</sup>)² = x<sup>' + k + '×2</sup> = x<sup>' + 2 * k + '</sup> : on multiplie les exposants.'),
          o(w3, 'Tu as oublié le double produit : (a ' + (s > 0 ? '+' : '−') + ' b)² ≠ a² ' + (s > 0 ? '+' : '−') + ' b².'),
          o(w4, 'Le dernier terme b² = ' + c * c + ' est toujours <b>positif</b>.')
        ]),
        steps: ['On utilise (a ' + (s > 0 ? '+' : '−') + ' b)² = a² ' + (s > 0 ? '+' : '−') + ' 2ab + b² avec a = x<sup>' + k + '</sup> et b = ' + c + '.',
          '(x<sup>' + k + '</sup>)² = x<sup>' + 2 * k + '</sup> ; 2 × x<sup>' + k + '</sup> × ' + c + ' = ' + 2 * c + 'x<sup>' + k + '</sup> ; ' + c + '² = ' + c * c + '.',
          'Donc (x<sup>' + k + '</sup> ' + (s > 0 ? '+' : '−') + ' ' + c + ')² = ' + poly(good) + '.'],
        pitfalls: ['(a ± b)² n\'est pas a² ± b² : il y a le double produit 2ab.', '(x<sup>n</sup>)² = x<sup>2n</sup> (on multiplie les exposants).']
      };
    }
  });

  /* ---------- 3. Développer une différence de deux carrés ---------- */
  RB.register({
    id: 'dev-diff', chapter: 'algebre', theme: 'Identités remarquables', difficulty: 3,
    title: 'Développer et réduire une différence de carrés',
    originals: [{
      source: AN + ' (question 7)',
      statement: 'La forme développée et réduite de l\'expression (x − 5)<sup>2</sup> − (4 − x)<sup>2</sup> vaut :',
      qcm: {
        options: [
          { html: '−2x + 9', correct: true },
          { html: '−18x + 41', why: 'Vérifie le développement de (4 − x)² = 16 − 8x + x² puis le signe devant la parenthèse : on change <b>tous</b> les signes.' },
          { html: '2x<sup>2</sup> + 9', why: 'Les termes en x² s\'annulent : x² − x² = 0, car on <b>soustrait</b> (4 − x)².' },
          { html: '2x<sup>2</sup> − 18x + 9', why: 'Le signe « − » devant la parenthèse change le signe de tous les termes : −(16 − 8x + x²) = −16 + 8x − x².' }
        ]
      },
      steps: ['(x − 5)² = x² − 10x + 25.', '(4 − x)² = 16 − 8x + x².', 'On soustrait : x² − 10x + 25 − (16 − 8x + x²) = x² − 10x + 25 − 16 + 8x − x².', 'On réduit : x² − x² = 0 ; −10x + 8x = −2x ; 25 − 16 = 9. Résultat : −2x + 9.'],
      pitfalls: ['Un « − » devant une parenthèse change le signe de <b>tous</b> les termes qu\'elle contient.', 'Les termes en x² s\'annulent : le résultat est du premier degré.']
    }],
    generate(r) {
      const a = r.int(2, 9), b = r.int(1, 9);
      if (a === b) throw new Error('a = b');
      const mode = r.int(0, 1);
      let stat, good, w1, w2, w3, s1, s2, s3;
      if (mode === 0) {
        stat = '(x − ' + a + ')<sup>2</sup> − (' + b + ' − x)<sup>2</sup>';
        good = [a * a - b * b, 2 * b - 2 * a];
        w1 = [a * a + b * b, -(2 * a + 2 * b)];
        w2 = [a * a - b * b, -(2 * a + 2 * b), 2];
        w3 = [a * a - b * b, 0, 2];
        s1 = ['(x − ' + a + ')² = x² − ' + 2 * a + 'x + ' + a * a + '.', '(' + b + ' − x)² = ' + b * b + ' − ' + 2 * b + 'x + x².',
          'On soustrait : x² − ' + 2 * a + 'x + ' + a * a + ' − ' + b * b + ' + ' + 2 * b + 'x − x².'];
      } else {
        stat = '(x + ' + a + ')<sup>2</sup> − (x + ' + b + ')<sup>2</sup>';
        good = [a * a - b * b, 2 * a - 2 * b];
        w1 = [a * a + b * b, 2 * a + 2 * b];
        w2 = [a * a - b * b, 2 * a + 2 * b, 2];
        w3 = [a * a - b * b, 0, 2];
        s1 = ['(x + ' + a + ')² = x² + ' + 2 * a + 'x + ' + a * a + '.', '(x + ' + b + ')² = x² + ' + 2 * b + 'x + ' + b * b + '.',
          'On soustrait : x² + ' + 2 * a + 'x + ' + a * a + ' − x² − ' + 2 * b + 'x − ' + b * b + '.'];
      }
      const o = (arr, why) => ({ html: poly(arr), val: key(arr), why });
      return {
        statement: 'La forme développée et réduite de l\'expression ' + stat + ' vaut :',
        qcm: RB.qcm(o(good), [
          o(w1, 'Vérifie le signe devant la deuxième parenthèse : on soustrait, donc on change le signe de <b>tous</b> ses termes (y compris le terme constant).'),
          o(w2, 'Les termes en x² s\'annulent (x² − x² = 0) : le résultat est du premier degré.'),
          o(w3, 'Les termes en x² s\'annulent, il ne peut pas rester 2x².')
        ]),
        steps: s1.concat(['On réduit : x² − x² = 0 ; on regroupe les termes en x et les constantes.', 'Résultat : ' + poly(good) + '.']),
        pitfalls: ['Un « − » devant une parenthèse change le signe de <b>tous</b> les termes qu\'elle contient.', 'Les termes en x² s\'annulent : le résultat est du premier degré.']
      };
    }
  });

  /* ---------- 4. Équations du premier degré (cas particuliers) ---------- */
  RB.register({
    id: 'eq-lin', chapter: 'algebre', theme: 'Équations du premier degré', difficulty: 2,
    title: 'Nombre de solutions d\'une équation du premier degré',
    originals: [{
      source: AN + ' (question 7 bis)',
      statement: 'L\'équation 5(x + 4) − (5x + 1) = 0 admet :',
      qcm: {
        options: [
          { html: 'Deux solutions : −4 et ' + F(1, 5), why: 'Ce n\'est pas un produit de facteurs égal à 0 : il faut d\'abord <b>développer</b> et réduire.' },
          { html: 'Deux solutions : −4 et −' + F(1, 5), why: 'Ce n\'est pas un produit de facteurs égal à 0 : il faut d\'abord <b>développer</b> et réduire.' },
          { html: 'Aucune solution', correct: true },
          { html: 'Une infinité de solutions', why: 'Il y aurait une infinité de solutions si on arrivait à 0 = 0. Ici on arrive à 19 = 0, ce qui est impossible.' }
        ]
      },
      note: 'Cet exercice est numéroté « question 7 bis » car ton texte ne donnait pas son numéro exact.',
      steps: ['On développe : 5(x + 4) = 5x + 20 et −(5x + 1) = −5x − 1.', 'L\'équation devient : 5x + 20 − 5x − 1 = 0, soit 19 = 0.', '19 = 0 est faux quel que soit x : l\'équation n\'a <b>aucune solution</b>.'],
      pitfalls: ['Si les x disparaissent : on obtient soit une égalité fausse (aucune solution), soit une égalité vraie (infinité de solutions).']
    }],
    generate(r) {
      const a = r.int(2, 7), b = r.int(1, 8);
      const mode = r.pick(['none', 'none', 'inf', 'one']);
      const dev = a + 'x + ' + a * b;
      if (mode === 'one') {
        const d = r.int(1, 8), c = r.int(1, 15);
        if (d === a) throw new Error('d = a');
        const v = Q(c - a * b, a - d);
        const bracket = poly([c, d]);
        const W = [
          { v: Qo.neg(v), why: 'Vérifie le signe : quand on passe un terme de l\'autre côté, il change de signe.' },
          { v: Q(c + a * b, a - d), why: 'Vérifie le développement : ' + a + '(x + ' + b + ') = ' + dev + ', et la constante passe de l\'autre côté avec le signe contraire.' },
          { v: Q(c - a * b, a + d), why: 'On regroupe les x en <b>soustrayant</b> : (' + a + ' − ' + d + ')x.' }
        ].filter((w) => !Qo.eq(w.v, v)).map((w) => ({ html: 'Une seule solution : x = ' + H(w.v), val: T(w.v), why: w.why }));
        return {
          statement: 'L\'équation ' + a + '(x + ' + b + ') − (' + bracket + ') = 0 admet :',
          qcm: RB.qcm({ html: 'Une seule solution : x = ' + H(v), val: T(v) }, [
            { html: 'Aucune solution', val: 'none', why: 'Les x ne disparaissent pas (' + a + 'x et ' + d + 'x ne s\'annulent pas) : il y a une solution.' },
            { html: 'Une infinité de solutions', val: 'inf', why: 'Les x ne disparaissent pas : il y a exactement une solution.' }
          ].concat(W)),
          steps: ['On développe : ' + a + '(x + ' + b + ') = ' + dev + ' et −(' + bracket + ') = ' + poly([-c, -d]) + '.',
            'L\'équation devient : ' + poly([a * b - c, a - d]) + ' = 0.', 'Donc ' + poly([0, a - d]) + ' = ' + (c - a * b) + ', soit x = ' + F(c - a * b, a - d) + ' = ' + H(v) + '.'],
          pitfalls: ['On développe d\'abord, puis on regroupe les x d\'un côté et les nombres de l\'autre.']
        };
      }
      let cc = a * b;
      if (mode === 'none') { cc = r.int(1, 15); if (cc === a * b) cc++; }
      const diff = a * b - cc;
      const sol = (neg) => 'Deux solutions : −' + b + ' et ' + (neg ? '−' : '') + H(Q(cc, a));
      const good = mode === 'none'
        ? { html: 'Aucune solution', val: 'none' }
        : { html: 'Une infinité de solutions', val: 'inf' };
      const bad = mode === 'none'
        ? { html: 'Une infinité de solutions', val: 'inf', why: 'Il y aurait une infinité de solutions si on arrivait à 0 = 0. Ici on arrive à ' + diff + ' = 0, ce qui est impossible.' }
        : { html: 'Aucune solution', val: 'none', why: 'Tu arrives à 0 = 0 : cette égalité est toujours vraie, il y a donc une infinité de solutions.' };
      return {
        statement: 'L\'équation ' + a + '(x + ' + b + ') − (' + poly([cc, a]) + ') = 0 admet :',
        qcm: RB.qcm(good, [bad,
          { html: sol(false), val: 'w1', why: 'Ce n\'est pas un produit de facteurs égal à 0 : il faut d\'abord <b>développer</b> et réduire.' },
          { html: sol(true), val: 'w2', why: 'Ce n\'est pas un produit de facteurs égal à 0 : il faut d\'abord <b>développer</b> et réduire.' }]),
        steps: ['On développe : ' + a + '(x + ' + b + ') = ' + dev + ' et −(' + poly([cc, a]) + ') = ' + poly([-cc, -a]) + '.',
          'L\'équation devient : ' + a + 'x + ' + a * b + ' − ' + a + 'x − ' + cc + ' = 0, soit ' + diff + ' = 0.',
          mode === 'inf' ? '0 = 0 est vrai quel que soit x : l\'équation a une <b>infinité de solutions</b>.' : diff + ' = 0 est faux quel que soit x : l\'équation n\'a <b>aucune solution</b>.'],
        pitfalls: ['Si les x disparaissent : on obtient soit une égalité fausse (aucune solution), soit une égalité vraie (infinité de solutions).']
      };
    }
  });
  function T(q) { return RB.Qtxt(q); }

  /* ---------- 5. Équation produit nul ---------- */
  RB.register({
    id: 'prod-zero', chapter: 'algebre', theme: 'Équation produit nul', difficulty: 1,
    title: 'Résoudre une équation produit nul',
    originals: [{
      source: TECH + ' (question 5)',
      statement: 'Les solutions de l\'équation (x − 1)(4x + 3) = 0 sont :',
      qcm: {
        options: [
          { html: '1 et −3', why: 'Pour 4x + 3 = 0 on obtient 4x = −3, donc x = −3 ÷ 4 : il ne faut pas oublier de diviser par 4.' },
          { html: '1 et −' + F(3, 4), correct: true },
          { html: '1 et ' + F(3, 4), why: 'Attention au signe : 4x + 3 = 0 donne 4x = −3 (on soustrait 3).' },
          { html: '−1 et 3', why: 'Attention aux signes : x − 1 = 0 donne x = +1, et pour 4x + 3 = 0 il faut diviser par 4.' }
        ]
      },
      steps: ['Un produit est nul si et seulement si l\'un de ses facteurs est nul.', 'x − 1 = 0 donne x = 1.', '4x + 3 = 0 donne 4x = −3, donc x = −' + F(3, 4) + '.', 'Les solutions sont 1 et −' + F(3, 4) + '.'],
      pitfalls: ['Chaque facteur égal à 0 donne une équation à résoudre séparément.']
    }],
    generate(r) {
      const p = r.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7]);
      const a = r.pick([2, 3, 4, 5]);
      const b = r.pick([-9, -8, -7, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 7, 8, 9]);
      const v = Q(-b, a);
      if (Qo.eq(v, Q(p))) throw new Error('racines égales');
      const f1 = p > 0 ? 'x − ' + p : 'x + ' + (-p);
      const f2 = a + 'x ' + (b > 0 ? '+' : '−') + ' ' + Math.abs(b);
      const fmt = (x, q) => N(x) + ' et ' + H(q);
      const o = (x, q, why, val) => ({ html: N(x) + ' et ' + H(q), val: val, why });
      return {
        statement: 'Les solutions de l\'équation (' + f1 + ')(' + f2 + ') = 0 sont :',
        qcm: RB.qcm(o(p, v, '', 'c'), [
          o(p, Q(-b), 'Pour ' + f2 + ' = 0 on obtient ' + a + 'x = ' + (-b) + ' : il ne faut pas oublier de diviser par ' + a + '.', 'w1'),
          o(p, Qo.neg(v), 'Attention au signe : ' + a + 'x ' + (b > 0 ? '+' : '−') + ' ' + Math.abs(b) + ' = 0 donne ' + a + 'x = ' + (-b) + '.', 'w2'),
          o(-p, Qo.neg(v), 'Attention aux signes : ' + f1 + ' = 0 donne x = ' + p + '.', 'w3'),
          o(-p, v, 'Attention au signe de la première solution : ' + f1 + ' = 0 donne x = ' + p + '.', 'w4')
        ]),
        steps: ['Un produit est nul si et seulement si l\'un de ses facteurs est nul.', f1 + ' = 0 donne x = ' + N(p) + '.',
          f2 + ' = 0 donne ' + a + 'x = ' + N(-b) + ', donc x = ' + H(v) + '.', 'Les solutions sont ' + N(p) + ' et ' + H(v) + '.'],
        pitfalls: ['Chaque facteur égal à 0 donne une équation à résoudre séparément.']
      };
    }
  });

  /* ---------- 6. Tableau de signes ---------- */
  function signTable(label, roots, signs) {
    // roots : [r1] ou [r1,r2] ; signs : liste de '+' / '−' (length = roots.length + 1)
    const row1 = ['<i>x</i>', '−∞'], row2 = [label, ''];
    roots.forEach((rt, i) => {
      row1.push(''); row2.push(signs[i]);
      row1.push(N(rt)); row2.push('0');
    });
    row1.push(''); row2.push(signs[roots.length]);
    row1.push('+∞'); row2.push('');
    return RB.table([row1, row2], { cls: 'signtable', firstCol: true });
  }
  RB.register({
    id: 'sign-table', chapter: 'algebre', theme: 'Tableau de signes', difficulty: 2,
    title: 'Choisir le bon tableau de signes d\'un produit',
    originals: [{
      source: AN + ' (question 4)', note: 'Dans ton énoncé le tableau est étiqueté « f(x) » alors que la fonction s\'appelle A : je garde l\'étiquette d\'origine.',
      statement: 'On considère la fonction A définie pour tout réel x par : A(x) = (x − 2)(8 − x).<br>Le tableau de signes de A(x) sur ℝ est :',
      qcm: {
        options: [
          { html: signTable('f(x)', [2, 8], ['+', '−', '+']), why: 'Les signes sont inversés : A(x) = −x² + … a un coefficient dominant <b>négatif</b>, donc A(x) est négatif à l\'extérieur des racines.' },
          { html: signTable('f(x)', [2, 8], ['−', '+', '−']), correct: true },
          { html: signTable('f(x)', [-8, -2], ['−', '+', '−']), why: 'Les racines sont fausses : (x − 2) = 0 donne x = 2 et (8 − x) = 0 donne x = 8 (pas −2 ni −8).' },
          { html: signTable('f(x)', [2], ['−', '+']), why: 'Il y a <b>deux</b> facteurs, donc deux racines : 2 et 8.' }
        ]
      },
      steps: ['Les racines : x − 2 = 0 donne x = 2 ; 8 − x = 0 donne x = 8.', 'On regarde le signe de chaque facteur : x − 2 est négatif avant 2, positif après ; 8 − x est positif avant 8, négatif après.',
        'Produit : avant 2 : (−)(+) = − ; entre 2 et 8 : (+)(+) = + ; après 8 : (+)(−) = −.', 'Contrôle : A(x) = −x² + 10x − 16 a un coefficient dominant négatif : signe − à l\'extérieur des racines ✔.'],
      pitfalls: ['Le signe de ax² + bx + c est celui de a à l\'extérieur des racines.']
    }],
    generate(r) {
      let p = r.int(-6, 9), q = r.int(-6, 9);
      if (p === q || !p || !q) throw new Error('racines égales ou nulles');
      const form = r.pick(['ab', 'aa']);
      const lead = form === 'ab' ? -1 : 1;
      const f1 = '(x ' + (p >= 0 ? '− ' + p : '+ ' + (-p)) + ')';
      const f2 = form === 'ab' ? '(' + N(q) + ' − x)' : '(x ' + (q >= 0 ? '− ' + q : '+ ' + (-q)) + ')';
      const roots = [p, q].sort((x, y) => x - y);
      const pat = lead > 0 ? ['+', '−', '+'] : ['−', '+', '−'];
      const opp = lead > 0 ? ['−', '+', '−'] : ['+', '−', '+'];
      const neg = [-roots[1], -roots[0]];
      const first = form === 'ab' ? p : p; // racine du premier facteur
      const L = 'A(x)';
      const good = signTable(L, roots, pat);
      return {
        statement: 'On considère la fonction A définie pour tout réel x par : A(x) = ' + f1 + f2 + '.<br>Le tableau de signes de A(x) sur ℝ est :',
        qcm: RB.qcm({ html: good }, [
          { html: signTable(L, roots, opp), why: 'Les signes sont inversés : le coefficient dominant de A est ' + (lead > 0 ? 'positif (+1)' : 'négatif (−1)') + ', donc A(x) est ' + (lead > 0 ? 'positif' : 'négatif') + ' à l\'extérieur des racines.' },
          { html: signTable(L, neg, pat), why: 'Les racines sont fausses : un facteur s\'annule quand il vaut 0 (pour ' + f1 + ' : x = ' + N(p) + ').' },
          { html: signTable(L, [first], lead > 0 ? ['−', '+'] : ['−', '+']), why: 'Il y a <b>deux</b> facteurs, donc deux racines : ' + N(roots[0]) + ' et ' + N(roots[1]) + '.' }
        ]),
        steps: ['Les racines : ' + f1 + ' = 0 donne x = ' + N(p) + ' ; ' + f2 + ' = 0 donne x = ' + N(q) + '. On les range : ' + N(roots[0]) + ' &lt; ' + N(roots[1]) + '.',
          'Le coefficient dominant de A(x) vaut ' + (lead > 0 ? '+1' : '−1') + ' (x × ' + (form === 'ab' ? '(−x)' : 'x') + ').',
          'Un polynôme du second degré a le signe de son coefficient dominant à l\'extérieur des racines, et le signe contraire entre les racines.',
          'Signes : ' + pat.join(' ; ') + ' (avant ' + N(roots[0]) + ', entre ' + N(roots[0]) + ' et ' + N(roots[1]) + ', après ' + N(roots[1]) + ').'],
        pitfalls: ['Le signe de ax² + bx + c est celui de a à l\'extérieur des racines.', 'Une racine s\'obtient en annulant un facteur : x − 5 = 0 donne x = 5 (et non −5).']
      };
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
