/* Chapitre : Calcul numérique (fractions, puissances, retrouver un total) */
(function (G) {
  'use strict';
  const RB = G.RB, Q = RB.Q, Qo = RB.Qo, F = RB.frac, H = RB.Qhtml;
  const T = (q) => RB.Qtxt(q);
  const opt = (q, why) => ({ html: H(q), val: T(q), why: why });

  /* ---------- 1. Calculs avec des fractions ---------- */
  const AN = 'Amérique du Nord – Spécialité · 1A-A01-1';
  const TECH = 'Centres Étrangers – Techno · 1A-A01-5';
  const SPE = 'Centres Étrangers – Spécialité · 1A-A01-3';
  const RECON = 'Énoncé reconstitué à partir du texte copié (les fractions étaient illisibles) : compare avec ton énoncé d\'origine.';

  RB.register({
    id: 'frac-expr', chapter: 'calcul', theme: 'Calculs avec des fractions', difficulty: 2,
    title: 'Calculer une expression avec des fractions',
    originals: [
      {
        source: AN + ' (question 1)', note: RECON,
        statement: 'Le nombre ' + F(1, 2) + ' + ' + F(3, 2) + ' × 6 est égal à :',
        qcm: {
          options: [
            { html: F(19, 2), correct: true },
            { html: '12', why: 'Tu as additionné d\'abord ' + F(1, 2) + ' + ' + F(3, 2) + ' = 2 puis multiplié par 6. Or <b>la multiplication est prioritaire sur l\'addition</b>.' },
            { html: '6', why: 'Cette valeur ne vient d\'aucun calcul correct ici : recommence en respectant les priorités.' },
            { html: F(24, 12), why: 'Cette fraction vaut 2 : elle ne correspond pas au calcul demandé.' }
          ]
        },
        steps: ['La multiplication est prioritaire : on calcule d\'abord ' + F(3, 2) + ' × 6 = ' + F(18, 2) + ' = 9.',
          'Puis on additionne : ' + F(1, 2) + ' + 9 = ' + F(1, 2) + ' + ' + F(18, 2) + ' = ' + F(19, 2) + '.'],
        pitfalls: ['Respecte les priorités : × avant +.', 'Pour additionner des fractions, mets-les au même dénominateur.']
      },
      {
        source: TECH + ' (question 1)',
        statement: '4 − ' + F(5, 6) + ' est égal à :',
        qcm: {
          options: [
            { html: '−' + F(19, 6), why: 'Erreur de signe : 4 est plus grand que ' + F(5, 6) + ', le résultat est donc positif.' },
            { html: F(19, 6), correct: true },
            { html: F(3, 2), why: 'Ce n\'est pas le bon calcul : revois la mise au même dénominateur.' },
            { html: '−' + F(1, 6), why: 'Tu as calculé (4 − 5) ÷ 6. Mais 4 n\'est pas divisé par 6 : il faut écrire 4 = ' + F(24, 6) + '.' }
          ]
        },
        steps: ['On écrit 4 avec le dénominateur 6 : 4 = ' + F(24, 6) + '.', 'On soustrait : ' + F(24, 6) + ' − ' + F(5, 6) + ' = ' + F(19, 6) + '.'],
        pitfalls: ['On ne soustrait pas 5 à 4 « avant » de diviser par 6.']
      },
      {
        source: SPE + ' (question 3)',
        statement: 'On considère les nombres A = ' + F(2, 3) + ' et B = ' + F(5, 6) + '.<br>Le nombre ' + F('A', 'B') + ' + 2 est égal à :',
        qcm: {
          options: [
            { html: F(4, 5), why: 'C\'est la valeur de ' + F('A', 'B') + ' : tu as oublié d\'ajouter 2.' },
            { html: F(13, 4), why: 'Vérifie que tu as bien <b>inversé</b> la deuxième fraction avant de multiplier.' },
            { html: F(14, 5), correct: true },
            { html: F(23, 9), why: 'Diviser par une fraction, c\'est multiplier par son inverse : ne divise pas « en croix » les numérateurs et dénominateurs.' }
          ]
        },
        steps: ['Diviser par ' + F(5, 6) + ' revient à multiplier par son inverse ' + F(6, 5) + ' :', F('A', 'B') + ' = ' + F(2, 3) + ' × ' + F(6, 5) + ' = ' + F(12, 15) + ' = ' + F(4, 5) + '.',
          'On ajoute 2 = ' + F(10, 5) + ' : ' + F(4, 5) + ' + ' + F(10, 5) + ' = ' + F(14, 5) + '.'],
        pitfalls: ['Diviser par une fraction = multiplier par son inverse.']
      }
    ],
    generate(r) {
      const mode = r.int(0, 2);
      let statement, v, wrongs, steps, pitfalls;
      if (mode === 0) {
        const d = r.pick([2, 3, 4, 5, 6]), n1 = r.int(1, 5), n2 = r.int(1, 7), k = r.pick([2, 3, 4, 5, 6]);
        v = Qo.add(Q(n1, d), Qo.mul(Q(n2, d), Q(k)));
        statement = 'Le nombre ' + F(n1, d) + ' + ' + F(n2, d) + ' × ' + k + ' est égal à :';
        wrongs = [
          opt(Qo.mul(Qo.add(Q(n1, d), Q(n2, d)), Q(k)), 'Tu as additionné avant de multiplier. <b>La multiplication est prioritaire</b> sur l\'addition.'),
          opt(Qo.add(Q(n1, d), Qo.div(Q(n2, d), Q(k))), 'Tu as divisé par ' + k + ' au lieu de multiplier.'),
          opt(Qo.add(Q(n1, d), Q(n2 * k)), 'Tu as multiplié le numérateur sans garder le dénominateur ' + d + '.'),
          opt(Q(n1 + n2 * k, 2 * d), 'On n\'additionne jamais les dénominateurs.')
        ];
        steps = ['La multiplication est prioritaire : ' + F(n2, d) + ' × ' + k + ' = ' + F(n2 * k, d) + '.',
          'On additionne (même dénominateur) : ' + F(n1, d) + ' + ' + F(n2 * k, d) + ' = ' + F(n1 + n2 * k, d) + '.',
          'On simplifie si possible : ' + H(v) + '.'];
        pitfalls = ['× avant + : respecte les priorités.', 'Pour additionner, il faut le même dénominateur.'];
      } else if (mode === 1) {
        const a = r.int(2, 6), d = r.pick([3, 4, 5, 6, 7, 8]), n = r.int(1, 2 * d - 1);
        v = Qo.sub(Q(a), Q(n, d));
        statement = a + ' − ' + F(n, d) + ' est égal à :';
        wrongs = [
          opt(Q(a - n, d), 'Tu as calculé (' + a + ' − ' + n + ') ÷ ' + d + '. Mais ' + a + ' n\'est pas divisé par ' + d + '.'),
          opt(Qo.neg(v), 'Erreur de signe : ' + a + ' est ' + (Qo.num(v) > 0 ? 'plus grand' : 'plus petit') + ' que ' + F(n, d) + '.'),
          opt(Qo.add(Q(a), Q(n, d)), 'Tu as additionné au lieu de soustraire.'),
          opt(Q(a * d + n, d), 'Tu as additionné au lieu de soustraire.')
        ];
        steps = ['On écrit ' + a + ' avec le dénominateur ' + d + ' : ' + a + ' = ' + F(a * d, d) + '.',
          'On soustrait : ' + F(a * d, d) + ' − ' + F(n, d) + ' = ' + F(a * d - n, d) + '.', 'On simplifie si possible : ' + H(v) + '.'];
        pitfalls = ['On ne soustrait pas directement le numérateur à l\'entier.'];
      } else {
        const fr = [[1, 2], [2, 3], [3, 4], [1, 3], [3, 5], [2, 5], [5, 6], [3, 8], [4, 5], [5, 4], [7, 6]];
        const [p, q] = r.pick(fr); let [s, t] = r.pick(fr);
        const k = r.int(1, 4);
        const A = Q(p, q), B = Q(s, t);
        if (Qo.eq(A, B)) throw new Error('A = B');
        v = Qo.add(Qo.div(A, B), Q(k));
        statement = 'On considère les nombres A = ' + F(p, q) + ' et B = ' + F(s, t) + '.<br>Le nombre ' + F('A', 'B') + ' + ' + k + ' est égal à :';
        wrongs = [
          opt(Qo.div(A, B), 'C\'est la valeur de ' + F('A', 'B') + ' : tu as oublié d\'ajouter ' + k + '.'),
          opt(Qo.add(Qo.mul(A, B), Q(k)), 'Tu as multiplié par B au lieu de multiplier par son <b>inverse</b>.'),
          opt(Qo.add(Qo.div(B, A), Q(k)), 'Tu as calculé ' + F('B', 'A') + ' : A et B sont inversés.'),
          opt(Qo.add(Qo.sub(Q(0), Qo.div(A, B)), Q(k)), 'Attention au signe.')
        ];
        steps = ['Diviser par B, c\'est multiplier par l\'inverse de B : ' + F('A', 'B') + ' = ' + F(p, q) + ' × ' + F(t, s) + ' = ' + H(Qo.div(A, B)) + '.',
          'On ajoute ' + k + ' : ' + H(Qo.div(A, B)) + ' + ' + k + ' = ' + H(v) + '.'];
        pitfalls = ['Diviser par une fraction = multiplier par son inverse.'];
      }
      return { statement, qcm: RB.qcm({ html: H(v), val: T(v) }, wrongs), steps, pitfalls };
    }
  });

  /* ---------- 2. Retrouver un total à partir d'une fraction ---------- */
  RB.register({
    id: 'frac-total', chapter: 'calcul', theme: 'Retrouver un total (fraction)', difficulty: 2,
    title: 'Retrouver l\'effectif total à partir d\'une fraction',
    originals: [{
      source: SPE + ' (question 2)',
      statement: 'Dans un lycée, 150 élèves de première générale suivent la spécialité Mathématiques ce qui représente ' + F(2, 3) + ' de l\'ensemble des élèves de première générale.<br>Le nombre d\'élèves en première générale dans ce lycée est :',
      qcm: {
        options: [
          { html: '175', why: 'Ce nombre ne correspond pas à un calcul correct : écris l\'équation ' + F(2, 3) + ' × N = 150.' },
          { html: '300', why: 'Tu as multiplié 150 par 2 (le numérateur). Il faut multiplier par l\'inverse ' + F(3, 2) + '.' },
          { html: '225', correct: true },
          { html: '100', why: 'Tu as calculé ' + F(2, 3) + ' de 150. Mais 150 est <b>déjà</b> les ' + F(2, 3) + ' du total.' }
        ]
      },
      steps: ['Appelons N le nombre total d\'élèves. L\'énoncé dit : ' + F(2, 3) + ' × N = 150.', 'Donc N = 150 ÷ ' + F(2, 3) + ' = 150 × ' + F(3, 2) + ' = ' + F('150 × 3', 2) + ' = 225.',
        'Vérification : ' + F(2, 3) + ' de 225 = 150 ✔.'],
      pitfalls: ['150 est la <b>partie</b>, pas le total : on ne calcule pas la fraction de 150.']
    }],
    generate(r) {
      const [p, q] = r.pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [3, 8], [5, 6], [1, 4], [5, 8], [3, 7]]);
      const t = r.int(3, 30);
      const K = p * q * t, N = q * q * t;
      const ctx = r.pick([
        ['Dans un lycée, ' + K + ' élèves de première générale suivent la spécialité Mathématiques ce qui représente ' + F(p, q) + ' de l\'ensemble des élèves de première générale.', 'Le nombre d\'élèves en première générale dans ce lycée est :'],
        ['Dans un club, ' + K + ' adhérents pratiquent la natation, ce qui représente ' + F(p, q) + ' de tous les adhérents du club.', 'Le nombre total d\'adhérents du club est :'],
        ['Dans une ville, ' + K + ' habitants possèdent un vélo, ce qui représente ' + F(p, q) + ' de la population de la ville.', 'Le nombre d\'habitants de cette ville est :'],
        ['Un libraire a vendu ' + K + ' livres, ce qui représente ' + F(p, q) + ' de son stock de départ.', 'Le stock de départ était de :']
      ]);
      return {
        statement: ctx[0] + '<br>' + ctx[1],
        qcm: RB.qcm({ html: String(N), val: String(N) }, [
          { html: String((K * p) / q), val: String((K * p) / q), why: 'Tu as calculé ' + F(p, q) + ' de ' + K + '. Mais ' + K + ' est <b>déjà</b> les ' + F(p, q) + ' du total.' },
          { html: String(K * p), val: String(K * p), why: 'Tu as multiplié ' + K + ' par ' + p + ' (le numérateur) au lieu de multiplier par l\'inverse ' + F(q, p) + '.' },
          { html: String(K * q), val: String(K * q), why: 'Tu as multiplié par ' + q + ' sans diviser par ' + p + '.' },
          { html: String(K + (q - p) * t), val: String(K + (q - p) * t), why: 'Ajouter une partie ne donne pas le total : écris ' + F(p, q) + ' × N = ' + K + '.' },
          { html: String(K + p), val: String(K + p), why: 'Il faut résoudre l\'équation ' + F(p, q) + ' × N = ' + K + '.' }
        ]),
        steps: ['Appelons N le nombre total. L\'énoncé dit : ' + F(p, q) + ' × N = ' + K + '.',
          'Donc N = ' + K + ' ÷ ' + F(p, q) + ' = ' + K + ' × ' + F(q, p) + ' = ' + F(K + ' × ' + q, p) + ' = ' + N + '.',
          'Vérification : ' + F(p, q) + ' de ' + N + ' = ' + K + ' ✔.'],
        pitfalls: [K + ' est la <b>partie</b>, pas le total : on ne calcule pas la fraction de ' + K + '.']
      };
    }
  });

  /* ---------- 3. Puissances ---------- */
  const pw = (a, e) => RB.sup(a, e);
  RB.register({
    id: 'powers', chapter: 'calcul', theme: 'Règles sur les puissances', difficulty: 1,
    title: 'Simplifier une puissance',
    originals: [{
      source: TECH + ' (question 2)',
      statement: '(' + pw(5, 3) + ')<sup>3</sup> est égal à :',
      qcm: {
        options: [
          { html: pw(5, 0), why: 'Tu as soustrait les exposants (3 − 3). Pour une puissance de puissance, on <b>multiplie</b> les exposants.' },
          { html: pw(5, 9), correct: true },
          { html: pw(15, 3), why: 'On ne multiplie pas la base par l\'exposant : la base reste 5.' },
          { html: pw(5, 6), why: 'Tu as additionné les exposants (3 + 3). C\'est la règle du <b>produit</b> a<sup>m</sup> × a<sup>n</sup>, pas celle de la puissance de puissance.' }
        ]
      },
      steps: ['Règle : (a<sup>m</sup>)<sup>n</sup> = a<sup>m × n</sup>.', 'Ici : (5<sup>3</sup>)<sup>3</sup> = 5<sup>3 × 3</sup> = 5<sup>9</sup>.'],
      pitfalls: ['a<sup>m</sup> × a<sup>n</sup> = a<sup>m+n</sup> (on additionne)', '(a<sup>m</sup>)<sup>n</sup> = a<sup>m×n</sup> (on multiplie)']
    }],
    generate(r) {
      const a = r.pick([2, 3, 4, 5, 6, 7, 10]);
      const mode = r.int(0, 2);
      const m = r.int(2, 5), n = r.int(2, 5);
      let statement, c, wrongs, steps;
      const P = (e) => ({ html: pw(a, e), val: 'p' + e });
      if (mode === 0) {
        statement = '(' + pw(a, m) + ')<sup>' + n + '</sup> est égal à :';
        c = P(m * n);
        wrongs = [Object.assign(P(m + n), { why: 'Tu as additionné les exposants. Pour une puissance de puissance, on <b>multiplie</b>.' }),
          { html: pw(a * m, n), val: 'x1', why: 'On ne multiplie pas la base par l\'exposant.' },
          Object.assign(P(Math.abs(m - n)), { why: 'Tu as soustrait les exposants.' }),
          Object.assign(P(Math.pow(m, n)), { why: 'Tu as calculé ' + m + '<sup>' + n + '</sup> au lieu de ' + m + ' × ' + n + '.' })];
        steps = ['Règle : (a<sup>m</sup>)<sup>n</sup> = a<sup>m × n</sup>.', 'Ici : (' + pw(a, m) + ')<sup>' + n + '</sup> = ' + a + '<sup>' + m + ' × ' + n + '</sup> = ' + pw(a, m * n) + '.'];
      } else if (mode === 1) {
        statement = pw(a, m) + ' × ' + pw(a, n) + ' est égal à :';
        c = P(m + n);
        wrongs = [Object.assign(P(m * n), { why: 'Tu as multiplié les exposants. Pour un <b>produit</b> de puissances de même base, on additionne.' }),
          { html: pw(a * a, m + n), val: 'x2', why: 'La base ne change pas quand on multiplie des puissances de même base.' },
          Object.assign(P(Math.abs(m - n)), { why: 'Tu as soustrait les exposants.' }),
          { html: pw(a * a, m * n), val: 'x3', why: 'La base ne change pas.' }];
        steps = ['Règle : a<sup>m</sup> × a<sup>n</sup> = a<sup>m + n</sup>.', 'Ici : ' + pw(a, m) + ' × ' + pw(a, n) + ' = ' + a + '<sup>' + m + ' + ' + n + '</sup> = ' + pw(a, m + n) + '.'];
      } else {
        const big = r.int(4, 8), small = r.int(2, big - 1);
        statement = F(pw(a, big), pw(a, small)) + ' est égal à :';
        c = P(big - small);
        wrongs = [Object.assign(P(big + small), { why: 'Tu as additionné les exposants. Pour un <b>quotient</b>, on soustrait.' }),
          { html: pw(1, big - small), val: 'x4', why: 'Diviser deux puissances de même base ne donne pas 1 : on soustrait les exposants.' },
          Object.assign(P(big - small + 1), { why: 'Compte bien : on calcule ' + big + ' − ' + small + ' (sans rien ajouter).' }),
          Object.assign(P(big * small), { why: 'Tu as multiplié les exposants.' })];
        steps = ['Règle : ' + F('a<sup>m</sup>', 'a<sup>n</sup>') + ' = a<sup>m − n</sup>.', 'Ici : ' + F(pw(a, big), pw(a, small)) + ' = ' + a + '<sup>' + big + ' − ' + small + '</sup> = ' + pw(a, big - small) + '.'];
      }
      return { statement, qcm: RB.qcm(c, wrongs), steps, pitfalls: ['Produit : on additionne les exposants. Quotient : on les soustrait. Puissance de puissance : on les multiplie.'] };
    }
  });

  RB.register({
    id: 'powers-frac', chapter: 'calcul', theme: 'Règles sur les puissances', difficulty: 3,
    title: 'Simplifier un quotient de puissances',
    originals: [{
      source: AN + ' (question 8)', note: 'Énoncé reconstitué : E = (2 × 3²) ÷ (27 × 2³). Compare avec ton énoncé d\'origine.',
      statement: 'On considère le nombre réel : E = ' + F('2 × 3<sup>2</sup>', '27 × 2<sup>3</sup>') + '. On peut affirmer que E est égal à :',
      qcm: {
        options: [
          { html: F(1, 12), correct: true },
          { html: F(1, 6), why: 'Vérifie les puissances de 2 : 2 × 3<sup>2</sup> = 18 et 27 × 2<sup>3</sup> = 216.' },
          { html: F(1, 9), why: 'Tu as oublié les facteurs 2 : 2 × 3<sup>2</sup> = 18 et 27 × 2<sup>3</sup> = 216.' },
          { html: '12', why: 'Tu as inversé le quotient : le numérateur (18) est plus petit que le dénominateur (216).' }
        ]
      },
      steps: ['On calcule : 2 × 3<sup>2</sup> = 2 × 9 = 18.', 'Et 27 × 2<sup>3</sup> = 27 × 8 = 216.', 'E = ' + F(18, 216) + ' = ' + F(1, 12) + ' (on divise par 18).',
        'Autre méthode : 27 = 3<sup>3</sup>, donc E = ' + F('2 × 3<sup>2</sup>', '3<sup>3</sup> × 2<sup>3</sup>') + ' = ' + F(1, '3 × 2<sup>2</sup>') + ' = ' + F(1, 12) + '.'],
      pitfalls: ['Calcule d\'abord chaque puissance, puis simplifie la fraction.']
    }],
    generate(r) {
      const [p, q] = r.pick([[2, 3], [3, 2], [2, 5], [3, 5], [5, 2]]);
      const i = r.int(2, 3), j = r.int(2, 3), k = r.int(2, 3);
      const qj = Math.pow(q, j);
      const num = p * Math.pow(q, i), den = qj * Math.pow(p, k);
      const v = Q(num, den);
      if (Qo.eq(v, Q(1)) || v.d === 1 || v.n === 1 && v.d === 1) throw new Error('trivial');
      const wr = [
        { v: Qo.inv(v), why: 'Tu as inversé le quotient : vérifie quel nombre est au numérateur.' },
        { v: Q(p * Math.pow(q, i), qj * p * k), why: 'Attention : ' + p + '<sup>' + k + '</sup> n\'est pas égal à ' + p + ' × ' + k + '.' },
        { v: Q(p * q * i, qj * Math.pow(p, k)), why: 'Attention : ' + q + '<sup>' + i + '</sup> n\'est pas égal à ' + q + ' × ' + i + '.' },
        { v: Q(num, qj * p * Math.pow(p, k - 1) + 1), why: 'Recompte chaque puissance avant de simplifier.' }
      ].map((w) => ({ html: H(w.v), val: T(w.v), why: w.why }));
      return {
        statement: 'On considère le nombre réel : E = ' + F(p + ' × ' + pw(q, i), qj + ' × ' + pw(p, k)) + '. On peut affirmer que E est égal à :',
        qcm: RB.qcm({ html: H(v), val: T(v) }, wr),
        steps: ['On calcule chaque puissance : ' + pw(q, i) + ' = ' + Math.pow(q, i) + ' et ' + pw(p, k) + ' = ' + Math.pow(p, k) + '.',
          'Numérateur : ' + p + ' × ' + Math.pow(q, i) + ' = ' + num + '. Dénominateur : ' + qj + ' × ' + Math.pow(p, k) + ' = ' + den + '.',
          'E = ' + F(num, den) + ' = ' + H(v) + ' (on simplifie en divisant par ' + RB.gcd(num, den) + ').'],
        pitfalls: ['a<sup>n</sup> n\'est pas a × n : ' + pw(q, i) + ' = ' + Math.pow(q, i) + ', pas ' + q * i + '.']
      };
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
