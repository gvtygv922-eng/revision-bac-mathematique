/* Chapitre : Fonctions affines & lecture graphique */
(function (G) {
  'use strict';
  const RB = G.RB, Q = RB.Q, Qo = RB.Qo, F = RB.frac, N = RB.num, H = RB.Qhtml;
  const AN = 'Amérique du Nord – Spécialité · 1A-A01-1';
  const TECH = 'Centres Étrangers – Techno · 1A-A01-5';

  /** m x + p en HTML, m rationnel */
  function lineHTML(m, p, lhs) {
    let s = lhs || '';
    if (Qo.eq(m, Q(1))) s += 'x';
    else if (Qo.eq(m, Q(-1))) s += '−x';
    else if (m.d === 1) s += N(m.n) + 'x';
    else s += (m.n < 0 ? '−' : '') + F(Math.abs(m.n), m.d) + 'x';
    if (p) s += ' ' + (p > 0 ? '+' : '−') + ' ' + Math.abs(p);
    return s;
  }
  const mt = (m) => RB.Qtxt(m);

  /* ---------- 1. Lire l'expression d'une fonction affine ---------- */
  function affineFig(m, p, x0) {
    const pts = [{ x: 0, y: p, r: 4 }];
    if (x0 !== null) pts.push({ x: x0, y: 0, r: 4 });
    const lo = Math.min(0, p, m * 5), hi = Math.max(0, p, m * 5);
    const ymax = Math.max(0, p) + 10, ymin = Math.min(0, p) - 10;
    const span = Math.max(ymax - Math.min(ymin, -10), 20);
    const ys = RB.niceStep(span, 5);
    return RB.plot({
      xmin: -2, xmax: 5, ymin: Math.floor(Math.min(ymin, -10) / ys) * ys, ymax: Math.ceil(ymax / ys) * ys, xstep: 1, ystep: ys,
      curves: [{ f: (x) => m * x + p }], points: pts, label: 'Droite représentant la fonction affine f'
    });
  }

  RB.register({
    id: 'affine-read', chapter: 'fonctions', theme: 'Fonctions affines', difficulty: 2,
    title: 'Lire graphiquement l\'expression d\'une fonction affine',
    originals: [{
      source: AN + ' (question 6)', note: 'Graphique reproduit à partir de ta capture : la droite passe par les points (0 ; 10) et (2 ; 0).',
      statement: 'Soit f une fonction affine dont on a tracé la représentation graphique dans le repère ci-dessous.<br>Une expression algébrique de f est :',
      figure: RB.plot({
        xmin: -2, xmax: 5, ymin: -10, ymax: 40, xstep: 1, ystep: 10,
        curves: [{ f: (x) => -5 * x + 10 }], points: [{ x: 0, y: 10 }, { x: 2, y: 0 }], label: 'Droite passant par (0 ; 10) et (2 ; 0)'
      }),
      qcm: {
        options: [
          { html: 'f(x) = −5x + 10', correct: true },
          { html: 'f(x) = −x + 10', why: 'Calcule le coefficient directeur avec les deux points : m = ' + F('0 − 10', '2 − 0') + ' = −5, pas −1.' },
          { html: 'f(x) = −' + F(1, 5) + 'x + 10', why: 'Tu as inversé le calcul : m = ' + F('Δy', 'Δx') + ' = ' + F('−10', 2) + ' (variation des ordonnées sur variation des abscisses).' },
          { html: 'f(x) = 10x + 2', why: 'Tu as échangé le coefficient directeur et l\'ordonnée à l\'origine : f(0) = 10 donc p = 10.' }
        ]
      },
      steps: ['L\'ordonnée à l\'origine p est l\'ordonnée du point d\'abscisse 0 : la droite coupe l\'axe des ordonnées en (0 ; 10), donc p = 10.',
        'Le coefficient directeur est m = ' + F('y<sub>B</sub> − y<sub>A</sub>', 'x<sub>B</sub> − x<sub>A</sub>') + ' avec A(0 ; 10) et B(2 ; 0) : m = ' + F('0 − 10', '2 − 0') + ' = −5.',
        'Donc f(x) = −5x + 10. Vérification : f(2) = −10 + 10 = 0 ✔.'],
      pitfalls: ['f(x) = mx + p : p se lit en x = 0, m = Δy ÷ Δx.', 'La droite descend : m est négatif.']
    }],
    generate(r) {
      const m = r.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
      const x0 = r.int(1, 4), p = -m * x0;
      const o = (mm, pp, why, val) => ({ html: 'f(x) = ' + lineHTML(mm, pp), val: val, why });
      return {
        statement: 'Soit f une fonction affine dont on a tracé la représentation graphique dans le repère ci-dessous.<br>Une expression algébrique de f est :',
        figure: affineFig(m, p, x0),
        qcm: RB.qcm(o(Q(m), p, '', 'c'), [
          o(Q(-m), p, 'Regarde le sens de la droite : elle ' + (m < 0 ? 'descend' : 'monte') + ', donc m est ' + (m < 0 ? 'négatif' : 'positif') + '.', 'w1'),
          o(Q(1, m), p, 'Tu as inversé le calcul : m = ' + F('Δy', 'Δx') + ' = ' + F(-p, x0) + ' = ' + m + '.', 'w2'),
          o(Q(p), x0, 'Tu as échangé le coefficient directeur et l\'ordonnée à l\'origine : f(0) = ' + p + ' donc p = ' + p + '.', 'w3'),
          o(Q(-m * x0 === 0 ? 1 : m + 1), p, 'Calcule m avec les deux points : m = ' + F(0 - p, x0 - 0) + ' = ' + m + '.', 'w4')
        ]),
        steps: ['L\'ordonnée à l\'origine p est l\'ordonnée du point d\'abscisse 0 : la droite coupe l\'axe des ordonnées en (0 ; ' + N(p) + '), donc p = ' + N(p) + '.',
          'Le coefficient directeur est m = ' + F('y<sub>B</sub> − y<sub>A</sub>', 'x<sub>B</sub> − x<sub>A</sub>') + ' avec A(0 ; ' + N(p) + ') et B(' + x0 + ' ; 0) : m = ' + F('0 − ' + RB.paren(p), x0 + ' − 0') + ' = ' + N(m) + '.',
          'Donc f(x) = ' + lineHTML(Q(m), p) + '. Vérification : f(' + x0 + ') = ' + N(m * x0 + p) + ' ✔.'],
        pitfalls: ['f(x) = mx + p : p se lit en x = 0, m = Δy ÷ Δx.', 'Si la droite descend, m est négatif.']
      };
    }
  });

  /* ---------- 2. Reconnaître la droite d'équation donnée ---------- */
  function miniLine(m, p) {
    return RB.plot({
      xmin: -5, xmax: 5, ymin: -5, ymax: 5, xstep: 1, ystep: 1, width: 230, height: 200,
      curves: [{ f: (x) => Qo.num(m) * x + p, width: 2.5 }], points: [], label: 'Droite'
    });
  }
  RB.register({
    id: 'line-pick', chapter: 'fonctions', theme: 'Fonctions affines', difficulty: 2,
    title: 'Reconnaître la représentation d\'une droite',
    originals: [],
    generate(r) {
      const m = r.pick([Q(-1, 2), Q(1, 2), Q(2), Q(-2), Q(1), Q(-1), Q(3, 2), Q(-3, 2), Q(3), Q(-3)]);
      const p = r.pick([-3, -2, -1, 1, 2, 3]);
      const cand = [
        { m: Qo.neg(m), p, why: 'Regarde le sens de la droite : le signe du coefficient directeur est faux.' },
        { m, p: -p, why: 'L\'ordonnée à l\'origine est fausse : la droite doit couper l\'axe des ordonnées en (0 ; ' + p + ').' },
        { m: Qo.inv(m), p, why: 'Tu as inversé le coefficient directeur (' + F('Δy', 'Δx') + ' devient ' + F('Δx', 'Δy') + ').' },
        { m: Qo.neg(Qo.inv(m)), p, why: 'Le coefficient directeur est faux : pour avancer de ' + m.d + ' vers la droite, on ' + (m.n > 0 ? 'monte' : 'descend') + ' de ' + Math.abs(m.n) + '.' },
        { m: Qo.neg(m), p: -p, why: 'Le signe du coefficient directeur et l\'ordonnée à l\'origine sont faux.' }
      ];
      const good = { html: miniLine(m, p), val: mt(m) + '|' + p };
      const wr = cand.map((c) => ({ html: miniLine(c.m, c.p), val: mt(c.m) + '|' + c.p, why: c.why }));
      const dx = m.d, dy = m.n;
      return {
        statement: 'Dans un repère orthonormé (O ; <i>ı</i>, <i>ȷ</i>), la droite d d\'équation réduite <b>' + lineHTML(m, p, 'y = ') + '</b> est représentée par :',
        qcm: RB.qcm(good, wr),
        steps: ['L\'ordonnée à l\'origine est p = ' + p + ' : la droite coupe l\'axe des ordonnées au point (0 ; ' + p + ').',
          'Le coefficient directeur est m = ' + H(m) + '. En partant de (0 ; ' + p + '), si on avance de ' + dx + ' unité(s) vers la droite, on ' + (dy > 0 ? 'monte' : 'descend') + ' de ' + Math.abs(dy) + ' unité(s).',
          'On choisit le graphique qui vérifie ces deux informations.'],
        pitfalls: ['m &gt; 0 : la droite monte. m &lt; 0 : elle descend.', 'Coefficient directeur m = (déplacement vertical) ÷ (déplacement horizontal).']
      };
    }
  });

  /* ---------- 3. Résoudre graphiquement f(x) ≤ c ---------- */
  RB.register({
    id: 'graph-ineq', chapter: 'fonctions', theme: 'Inéquation graphique', difficulty: 2,
    title: 'Résoudre f(x) ≤ c par lecture graphique',
    originals: [],
    generate(r) {
      const al = r.int(-2, 2), be = r.int(-3, 0), s = r.int(1, 2), c = be + s * s;
      const lo = al - 3, hi = al + 3;
      const f = (x) => (x - al) * (x - al) + be;
      const yMax = f(lo);
      const ys = yMax - be > 8 ? 2 : 1;
      const itv = (a, b) => '[' + N(a) + ' ; ' + N(b) + ']';
      const wr = [
        { a: be, b: c, why: 'Tu as lu des valeurs sur l\'axe des ordonnées : les solutions sont des <b>abscisses</b> x.' },
        { a: -(al + s), b: -(al - s), why: 'Attention au signe des abscisses : relis-les sur l\'axe horizontal.' },
        { a: al - s - 1, b: al + s + 1, why: 'Les bornes sont les abscisses des points d\'intersection de la courbe avec la droite y = ' + N(c) + '.' },
        { a: lo, b: al - s, why: 'Cet intervalle correspond à la partie où la courbe est <b>au-dessus</b> de la droite y = ' + N(c) + '.' },
        { a: al, b: al + s, why: 'Il faut prendre toute la partie de la courbe située en dessous de la droite, des deux côtés du sommet.' }
      ];
      return {
        statement: 'On donne ci-dessous la courbe représentative C<sub>f</sub> d\'une fonction f définie sur l\'intervalle [' + N(lo) + ' ; ' + N(hi) + '], et la droite d\'équation y = ' + N(c) + '.<br>L\'ensemble des solutions de l\'inéquation f(x) ⩽ ' + N(c) + ' est :',
        figure: RB.plot({
          xmin: lo - 1, xmax: hi + 1, ymin: be - 1, ymax: yMax + 1, xstep: 1, ystep: ys,
          curves: [{ f: (x) => (x < lo || x > hi ? NaN : f(x)) }],
          hlines: [{ y: c, color: '#2563eb', label: 'y = ' + N(c) }],
          points: [{ x: al - s, y: c, color: '#2563eb' }, { x: al + s, y: c, color: '#2563eb' }], label: 'Courbe de f et droite horizontale'
        }),
        qcm: RB.qcm({ html: itv(al - s, al + s), val: 'c' }, wr.map((w, i) => ({ html: itv(w.a, w.b), val: w.a + '|' + w.b, why: w.why }))),
        steps: ['On trace (ou on repère) la droite horizontale y = ' + N(c) + '.', 'f(x) ⩽ ' + N(c) + ' signifie : la courbe est <b>sous la droite</b> (ou sur la droite).',
          'Elle coupe la droite aux points d\'abscisses ' + N(al - s) + ' et ' + N(al + s) + '.', 'La courbe est sous la droite pour x entre ces deux valeurs : l\'ensemble des solutions est ' + itv(al - s, al + s) + '.'],
        pitfalls: ['Les solutions sont des valeurs de x (axe horizontal).', 'f(x) ⩽ c : on cherche où la courbe est sous la droite y = c.']
      };
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
