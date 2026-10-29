/* Chapitre : Second degré */
(function (G) {
  'use strict';
  const RB = G.RB, Q = RB.Q, Qo = RB.Qo, F = RB.frac, N = RB.num;
  const poly = (c) => RB.polyHTML(c);
  const ptxt = (c) => RB.polyTxt(c);

  /* coefficients [c, b, a] de a(x−α)² + β */
  const fromCanon = (a, al, be) => [a * al * al + be, -2 * a * al, a];
  const fromRoots = (a, r1, r2) => [a * r1 * r2, -a * (r1 + r2), a];
  const sq = (x) => (x < 0 ? '(' + N(x) + ')' : N(x)) + '²';

  /* ---------- 1. Forme canonique ---------- */
  function canonItem(a, al, be, src) {
    const c = fromCanon(a, al, be);
    const [cc, b, aa] = c;
    return {
      source: src,
      statement: 'Déterminer la forme canonique du polynôme P défini pour tout x ∈ ℝ par :<br><b>P(x) = ' + poly(c) + '</b>',
      fields: [{
        key: 'P', type: 'canon', label: 'P(x) =', answer: RB.canonTxt(a, al, be), placeholder: 'ex : −2(x − 3)^2 + 5',
        show: RB.canonHTML(a, al, be),
        traps: [
          { answer: RB.canonTxt(a, -al, be), msg: 'Le signe de α est faux : la forme canonique est a(x − α)² + β avec α = −b ÷ (2a). Ici α = ' + N(al) + ', donc on écrit (x ' + (al > 0 ? '−' : '+') + ' ' + Math.abs(al) + ')².' },
          { answer: RB.canonTxt(a, al, -be), msg: 'Le signe de β est faux : β = P(α), calcule-le en remplaçant x par α dans P.' },
          { answer: RB.canonTxt(1, al, be), msg: 'N\'oublie pas le coefficient a devant la parenthèse : a = ' + N(a) + '.' }
        ]
      }],
      steps: ['Pour P(x) = ax² + bx + c, la forme canonique est a(x − α)² + β avec α = ' + F('−b', '2a') + ' et β = P(α).',
        'Ici a = ' + N(aa) + ', b = ' + N(b) + ' : α = ' + F('−' + RB.paren(b), '2 × ' + RB.paren(aa)) + ' = ' + N(al) + '.',
        'β = P(' + N(al) + ') = ' + N(aa) + ' × ' + sq(al) + ' ' + (b >= 0 ? '+' : '−') + ' ' + Math.abs(b) + ' × ' + RB.paren(al) + ' ' + (cc >= 0 ? '+' : '−') + ' ' + Math.abs(cc) + ' = ' + N(be) + '.',
        'Donc P(x) = ' + RB.canonHTML(a, al, be) + '.'],
      pitfalls: ['α = −b ÷ (2a) : attention au signe dans (x − α)².', 'β = P(α) (on remplace x par α, pas par −α).', 'Vérifie en développant ton résultat.']
    };
  }
  RB.register({
    id: 'canon', chapter: 'second', theme: 'Forme canonique', difficulty: 3,
    title: 'Déterminer la forme canonique d\'un polynôme du second degré',
    originals: [
      canonItem(-1, 1, 4, '1AL23-1 (a)'), canonItem(1, -1, 4, '1AL23-1 (b)'), canonItem(-4, 4, 1, '1AL23-1 (c)'), canonItem(-1, 5, 5, '1AL23-1 (d)')
    ],
    generate(r) {
      const a = r.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
      let al = r.int(-6, 7); if (!al) al = r.pick([-2, 3]);
      let be = r.int(-9, 9); if (!be) be = r.pick([2, -3]);
      const it = canonItem(a, al, be, '');
      delete it.source;
      return it;
    }
  });

  /* ---------- 2. Factorisation ---------- */
  function factorItem(c, src) {
    const [cc, b, a] = c;
    const D = b * b - 4 * a * cc;
    let field, steps;
    if (D < 0) {
      field = { key: 'P', type: 'factor', allowNone: true, noneExpected: true, label: 'P(x) =', answer: '', show: 'Pas factorisable' };
      steps = ['On calcule le discriminant : Δ = b² − 4ac = ' + RB.paren(b) + '² − 4 × ' + RB.paren(a) + ' × ' + RB.paren(cc) + ' = ' + N(D) + '.',
        'Δ &lt; 0 : le polynôme n\'a pas de racine réelle, donc il n\'est <b>pas factorisable</b> dans ℝ.'];
    } else {
      const sd = Math.round(Math.sqrt(D));
      const r1 = Q(-b - sd, 2 * a), r2 = Q(-b + sd, 2 * a);
      const rr = [Qo.num(r1), Qo.num(r2)].sort((x, y) => x - y);
      const ans = D === 0
        ? RB.canonTxt(a, rr[0], 0).replace('(x', '(x')
        : (a === 1 ? '' : a === -1 ? '-' : String(a)) + '(' + RB.linTxt(rr[0]) + ')(' + RB.linTxt(rr[1]) + ')';
      const html = D === 0
        ? (a === 1 ? '' : a === -1 ? '−' : N(a)) + '(' + RB.lin(rr[0]) + ')<sup>2</sup>'
        : (a === 1 ? '' : a === -1 ? '−' : N(a)) + '(' + RB.lin(rr[0]) + ')(' + RB.lin(rr[1]) + ')';
      field = { key: 'P', type: 'factor', allowNone: true, noneExpected: false, label: 'P(x) =', answer: ans, show: html, placeholder: 'ex : 2(x − 1)(x + 4)' };
      steps = ['On calcule le discriminant : Δ = b² − 4ac = ' + RB.paren(b) + '² − 4 × ' + RB.paren(a) + ' × ' + RB.paren(cc) + ' = ' + N(D) + '.'];
      if (D === 0) steps.push('Δ = 0 : une racine double x<sub>0</sub> = ' + F('−b', '2a') + ' = ' + N(rr[0]) + '.', 'Donc P(x) = a(x − x<sub>0</sub>)² = ' + html + '.');
      else steps.push('Δ &gt; 0 : deux racines x<sub>1</sub> = ' + F('−b − √Δ', '2a') + ' = ' + N(rr[0]) + ' et x<sub>2</sub> = ' + F('−b + √Δ', '2a') + ' = ' + N(rr[1]) + '.', 'Donc P(x) = a(x − x<sub>1</sub>)(x − x<sub>2</sub>) = ' + html + '.', 'Vérification : ' + html + ' redonne bien P(x) en développant.');
    }
    return {
      source: src,
      statement: 'Factoriser, si cela est possible, le polynôme P défini pour tout x de ℝ par :<br><b>P(x) = ' + poly(c) + '</b>',
      fields: [field],
      steps: steps,
      pitfalls: ['N\'oublie pas le coefficient a devant les parenthèses.', 'Si Δ &lt; 0, il n\'y a pas de factorisation dans ℝ.', 'Une racine r donne le facteur (x − r) : racine −2 donne (x + 2).']
    };
  }
  RB.register({
    id: 'factor', chapter: 'second', theme: 'Factorisation', difficulty: 2,
    title: 'Factoriser un polynôme du second degré',
    originals: [
      factorItem([-10, 10, -5], '1AL21-41 (a)'), factorItem([-4, -4, -1], '1AL21-41 (b)'), factorItem([-30, -9, 3], '1AL21-41 (c)'), factorItem([-40, 28, -4], '1AL21-41 (d)')
    ],
    generate(r) {
      const mode = r.pick(['two', 'two', 'two', 'double', 'none']);
      const a = r.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
      let c;
      if (mode === 'two') {
        let r1 = r.int(-7, 7), r2 = r.int(-7, 7);
        if (!r1 || !r2 || r1 === r2) throw new Error('racines');
        c = fromRoots(a, r1, r2);
      } else if (mode === 'double') {
        const r1 = r.int(-6, 6); if (!r1) throw new Error('racine nulle');
        c = fromRoots(a, r1, r1);
      } else {
        const h = r.int(-4, 4), t = r.pick([1, 2, 3, 5]);
        c = [a * (h * h + t), -2 * a * h, a];
        if (!c[1] || !c[0]) throw new Error('coef nul');
      }
      const it = factorItem(c, '');
      delete it.source;
      return it;
    }
  });

  /* ---------- 3. Résoudre une équation du second degré ---------- */
  function solveItem(c, src) {
    const [cc, b, a] = c;
    const D = b * b - 4 * a * cc;
    let ans, show, steps = ['On calcule le discriminant : Δ = b² − 4ac = ' + RB.paren(b) + '² − 4 × ' + RB.paren(a) + ' × ' + RB.paren(cc) + ' = ' + N(D) + '.'];
    if (D < 0) {
      ans = '∅'; show = '∅ (aucune solution)';
      steps.push('Δ &lt; 0 : l\'équation n\'a <b>aucune solution réelle</b>. S = ∅.');
    } else {
      const sd = Math.round(Math.sqrt(D));
      const r1 = Q(-b - sd, 2 * a), r2 = Q(-b + sd, 2 * a);
      const rr = [Qo.num(r1), Qo.num(r2)].sort((x, y) => x - y);
      if (D === 0) {
        ans = String(rr[0]); show = '{' + N(rr[0]) + '}';
        steps.push('Δ = 0 : une seule solution x<sub>0</sub> = ' + F('−b', '2a') + ' = ' + F('−' + RB.paren(b), 2 * a) + ' = ' + N(rr[0]) + '. S = {' + N(rr[0]) + '}.');
      } else {
        ans = rr[0] + ';' + rr[1]; show = '{' + N(rr[0]) + ' ; ' + N(rr[1]) + '}';
        steps.push('Δ &gt; 0 : deux solutions x<sub>1</sub> = ' + F('−b − √Δ', '2a') + ' = ' + F('−' + RB.paren(b) + ' − ' + sd, 2 * a) + ' = ' + N(rr[0]) + ' et x<sub>2</sub> = ' + F('−b + √Δ', '2a') + ' = ' + F('−' + RB.paren(b) + ' + ' + sd, 2 * a) + ' = ' + N(rr[1]) + '.', 'S = {' + N(rr[0]) + ' ; ' + N(rr[1]) + '}.');
      }
    }
    const checkTip = D >= 0 ? 'On peut vérifier une solution en la remplaçant dans l\'équation.' : 'Δ &lt; 0 : on écrit S = ∅.';
    return {
      source: src,
      statement: 'Résoudre, dans ℝ, l\'équation suivante.<br><b>' + poly(c) + ' = 0</b>',
      fields: [{ key: 'S', type: 'set', label: 'S =', answer: ans, show: show, placeholder: 'ex : 2 ; 5   (ou ∅)', empty: true,
        traps: D > 0 ? [{ answer: String(-b / a), msg: 'Tu as peut-être oublié la deuxième solution ou utilisé la mauvaise formule : x = (−b ± √Δ) ÷ (2a).' }] : null }],
      steps: steps,
      pitfalls: ['Δ = b² − 4ac : attention aux signes de b et c.', 'x = (−b ± √Δ) ÷ (2a) : le dénominateur est 2a, pas 2.', checkTip]
    };
  }
  RB.register({
    id: 'solve-quad', chapter: 'second', theme: 'Résolution d\'équations', difficulty: 2,
    title: 'Résoudre une équation du second degré',
    originals: [solveItem([30, -21, 3], '1AL23-21 (a)'), solveItem([-18, -12, -2], '1AL23-21 (b)'), solveItem([4, 4, 2], '1AL23-21 (c)')],
    generate(r) {
      const mode = r.pick(['two', 'two', 'double', 'none']);
      const a = r.pick([-3, -2, -1, 1, 2, 3, 4, 5]);
      let c;
      if (mode === 'two') {
        const r1 = r.int(-6, 7), r2 = r.int(-6, 7);
        if (r1 === r2) throw new Error('racines égales');
        c = fromRoots(a, r1, r2);
        if (!c[0] || !c[1]) throw new Error('coef nul');
      } else if (mode === 'double') {
        const r1 = r.int(-6, 6); if (!r1) throw new Error('racine nulle');
        c = fromRoots(a, r1, r1);
      } else {
        const h = r.int(-3, 3), t = r.pick([1, 2, 3, 4]);
        c = [a * (h * h + t), -2 * a * h, a];
        if (!c[1]) throw new Error('b nul');
      }
      const it = solveItem(c, '');
      delete it.source;
      return it;
    }
  });

  /* ---------- 4. Lire une parabole ---------- */
  function parabola(a, al, be, opt) {
    opt = opt || {};
    const f = (x) => a * (x - al) * (x - al) + be;
    let xmin, xmax;
    if (opt.xmin !== undefined) { xmin = opt.xmin; xmax = opt.xmax; }
    else {
      const pts = [al];
      const dd = -be / a;
      if (dd >= 0) { const s = Math.sqrt(dd); pts.push(al - s, al + s); }
      xmin = Math.floor(Math.min.apply(null, pts)) - 2; xmax = Math.ceil(Math.max.apply(null, pts)) + 2;
      if (xmax - xmin < 8) { const m = Math.round((xmin + xmax) / 2); xmin = m - 4; xmax = m + 4; }
    }
    let ymin = Math.min(f(xmin), f(xmax), be, 0), ymax = Math.max(f(xmin), f(xmax), be, 0);
    if (opt.ymin !== undefined) { ymin = opt.ymin; ymax = opt.ymax; }
    const ys = opt.ystep || RB.niceStep(ymax - ymin, 6);
    if (opt.ymin === undefined) { ymin = Math.floor(ymin / ys) * ys - ys; ymax = Math.ceil(ymax / ys) * ys + ys; }
    return RB.plot({ xmin, xmax, ymin, ymax, xstep: 1, ystep: ys, xlabelStep: xmax - xmin > 12 ? 2 : 1, curves: [{ f }], points: opt.points || [], label: 'Parabole représentant un polynôme du second degré' });
  }

  RB.register({
    id: 'graph-roots', chapter: 'second', theme: 'Lecture graphique', difficulty: 1,
    title: 'Lire les racines d\'une parabole',
    originals: [],
    generate(r) {
      const a = r.pick([-2, -1, 1, 2]);
      const r1 = r.int(-6, 4), r2 = r1 + r.int(1, 6);
      const al2 = (r1 + r2) / 2, be = -a * ((r2 - r1) / 2) * ((r2 - r1) / 2);
      if (!Number.isInteger(al2 * 2)) throw new Error('x');
      return {
        statement: 'Quelles sont les racines de la fonction polynomiale f du second degré représentée ci-dessous ?<br><small>(Sépare les racines par un point-virgule.)</small>',
        figure: parabola(a, al2, be),
        fields: [{ key: 'roots', type: 'set', label: 'Les racines sont :', answer: r1 + ';' + r2, show: N(r1) + ' ; ' + N(r2), placeholder: 'ex : −3 ; 2', traps: [{ answer: String(be), msg: 'Les racines sont des <b>abscisses</b> (valeurs de x) : on lit où la courbe coupe l\'axe horizontal.' }] }],
        steps: ['Les racines de f sont les solutions de f(x) = 0.', 'Graphiquement, ce sont les abscisses des points où la courbe coupe l\'axe des abscisses (axe horizontal).', 'On lit : x = ' + N(r1) + ' et x = ' + N(r2) + '.'],
        pitfalls: ['Une racine est une valeur de x (axe horizontal), pas de y.', 'Le sommet n\'est pas une racine (sauf s\'il est sur l\'axe).']
      };
    }
  });

  RB.register({
    id: 'graph-sign', chapter: 'second', theme: 'Lecture graphique', difficulty: 1,
    title: 'Signe du coefficient dominant d\'une parabole',
    originals: [],
    generate(r) {
      const a = r.pick([-3, -2, -1, 1, 2, 3]);
      const al = r.int(-3, 4), be = r.int(-8, 8);
      return {
        statement: 'Quel est le signe du coefficient dominant de la fonction polynomiale g du second degré représentée ci-dessous ?',
        figure: parabola(a, al, be, {}),
        fields: [{ key: 'sign', type: 'choice', label: '', answer: a > 0 ? 'positif' : 'négatif', choices: [{ value: 'négatif', label: 'négatif' }, { value: 'positif', label: 'positif' }],
          traps: [] }],
        steps: ['Le coefficient dominant est le nombre a dans g(x) = ax² + bx + c.', 'Si la parabole est « tournée vers le haut » (forme de U), alors a &gt; 0. Si elle est « tournée vers le bas » (forme de ∩), alors a &lt; 0.',
          'Ici la parabole est tournée vers le ' + (a > 0 ? 'haut' : 'bas') + ' : le coefficient dominant est <b>' + (a > 0 ? 'positif' : 'négatif') + '</b>.'],
        pitfalls: ['La position de la parabole par rapport à l\'axe des abscisses ne change pas le signe de a : seule l\'orientation compte.']
      };
    }
  });

  RB.register({
    id: 'graph-vertex', chapter: 'second', theme: 'Lecture graphique', difficulty: 2,
    title: 'Lire les coordonnées du sommet d\'une parabole',
    originals: [],
    generate(r) {
      const a = r.pick([-1, 1]);
      const al = r.int(-3, 3), be = r.int(-3, 3);
      return {
        statement: 'Quelles sont les coordonnées du sommet de la fonction polynomiale h du second degré représentée ci-dessous ?',
        figure: parabola(a, al, be, { xmin: -4, xmax: 4, ymin: -4, ymax: 4, ystep: 1 }),
        fields: [{ key: 'S', type: 'point', label: 'Les coordonnées du point recherché sont :', answer: '(' + al + ';' + be + ')', show: '(' + N(al) + ' ; ' + N(be) + ')', placeholder: 'ex : (2 ; −1)',
          traps: [{ answer: '(' + be + ';' + al + ')', msg: 'Tu as échangé abscisse et ordonnée : on écrit toujours (abscisse ; ordonnée).' }] }],
        steps: ['Le sommet est le point le plus ' + (a > 0 ? 'bas' : 'haut') + ' de la parabole.', 'On lit son abscisse sur l\'axe horizontal : x = ' + N(al) + '.', 'On lit son ordonnée sur l\'axe vertical : y = ' + N(be) + '.', 'Le sommet est le point (' + N(al) + ' ; ' + N(be) + ').'],
        pitfalls: ['Coordonnées = (abscisse ; ordonnée) : x d\'abord, y ensuite.']
      };
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
