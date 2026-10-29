/* Chapitre : Suites ; Chapitre : Statistiques */
(function (G) {
  'use strict';
  const RB = G.RB, Q = RB.Q, Qo = RB.Qo, F = RB.frac, N = RB.num;
  const L1 = '1AL10-3';
  const rnd = (x, d) => Math.round(x * Math.pow(10, d)) / Math.pow(10, d);
  const un = (n) => 'u<sub>' + n + '</sub>';

  /* ---------- Suite définie explicitement ---------- */
  function explicitStatement(formulaHTML, n) {
    return 'Soit (u<sub>n</sub>) une suite définie pour tout entier n ∈ ℕ par u<sub>n</sub> = ' + formulaHTML + '.<br>Calculer ' + un(n) + '.';
  }
  RB.register({
    id: 'seq-explicit', chapter: 'suites', theme: 'Suite définie explicitement', difficulty: 1,
    title: 'Calculer un terme d\'une suite définie de façon explicite',
    originals: [
      {
        source: L1 + ' (exercice 1)',
        statement: explicitStatement('4n + 1', 12),
        fields: [{ key: 'u12', type: 'number', label: un(12) + ' =', answer: '49', traps: [{ answer: '52', msg: 'Tu as calculé 4 × (12 + 1). Or u<sub>n</sub> = 4n + 1 : on multiplie n par 4 <b>puis</b> on ajoute 1.' }, { answer: '48', msg: 'Tu as oublié d\'ajouter 1.' }] }],
        steps: ['On remplace n par 12 dans la formule : u<sub>12</sub> = 4 × 12 + 1.', '4 × 12 = 48, puis 48 + 1 = 49.', 'u<sub>12</sub> = 49.'],
        pitfalls: ['u<sub>n</sub> = 4n + 1 : on calcule 4 × n d\'abord, puis on ajoute 1.']
      },
      {
        source: L1 + ' (exercice 2)',
        statement: explicitStatement('−n<sup>2</sup> − 9n − 5', 4),
        fields: [{ key: 'u4', type: 'number', label: un(4) + ' =', answer: '-57', traps: [{ answer: '-5', msg: 'Tu as calculé (−4)² = +16 : mais ici c\'est −n² = −(4²) = −16. Le signe − est devant le carré.' }, { answer: '-25', msg: 'Attention : −9n vaut −9 × 4 = −36, pas −9.' }] }],
        steps: ['On remplace n par 4 : u<sub>4</sub> = −4<sup>2</sup> − 9 × 4 − 5.', '4² = 16 donc −4² = −16 (le signe − n\'est <b>pas</b> élevé au carré).', 'u<sub>4</sub> = −16 − 36 − 5 = −57.'],
        pitfalls: ['−n² = −(n²) : on calcule le carré d\'abord, puis on met le signe.']
      }
    ],
    generate(r) {
      const n = r.int(2, 15);
      if (r.chance(0.5)) {
        const a = r.pick([-9, -7, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]), b = r.int(-9, 12);
        if (b === 0) throw new Error('b = 0');
        const v = a * n + b;
        const f = N(a) + 'n ' + (b > 0 ? '+' : '−') + ' ' + Math.abs(b);
        return {
          statement: explicitStatement(f, n),
          fields: [{ key: 'u', type: 'number', label: un(n) + ' =', answer: String(v), traps: [
            { answer: String(a * (n + b)), msg: 'Tu as calculé ' + a + ' × (' + n + ' ' + (b > 0 ? '+' : '−') + ' ' + Math.abs(b) + '). Or u<sub>n</sub> = ' + f + ' : on multiplie n par ' + N(a) + ' <b>puis</b> on ajoute ' + N(b) + '.' },
            { answer: String(a * n), msg: 'Tu as oublié le terme constant ' + N(b) + '.' }] }],
          steps: ['On remplace n par ' + n + ' dans la formule : u<sub>' + n + '</sub> = ' + N(a) + ' × ' + n + ' ' + (b > 0 ? '+' : '−') + ' ' + Math.abs(b) + '.', N(a) + ' × ' + n + ' = ' + N(a * n) + ', puis ' + N(a * n) + ' ' + (b > 0 ? '+' : '−') + ' ' + Math.abs(b) + ' = ' + N(v) + '.'],
          pitfalls: ['On calcule d\'abord le produit, puis on ajoute ou retranche.']
        };
      }
      const s = r.pick([-1, 1]), b = r.int(-9, 9), c = r.int(-9, 9), m = r.int(2, 7);
      if (!b || !c) throw new Error('coef nul');
      const v = s * m * m + b * m + c;
      const f = (s < 0 ? '−' : '') + 'n<sup>2</sup> ' + (b > 0 ? '+' : '−') + ' ' + Math.abs(b) + 'n ' + (c > 0 ? '+' : '−') + ' ' + Math.abs(c);
      const traps = [];
      if (s < 0) traps.push({ answer: String(m * m + b * m + c), msg: 'Le signe − est devant n² : −n² = −(' + m + '²) = −' + m * m + ', et non +' + m * m + '.' });
      traps.push({ answer: String(s * m * m + b + c), msg: 'Attention : ' + N(b) + 'n vaut ' + N(b) + ' × ' + m + ' = ' + N(b * m) + '.' });
      return {
        statement: explicitStatement(f, m),
        fields: [{ key: 'u', type: 'number', label: un(m) + ' =', answer: String(v), traps }],
        steps: ['On remplace n par ' + m + ' : u<sub>' + m + '</sub> = ' + (s < 0 ? '−' : '') + m + '<sup>2</sup> ' + (b > 0 ? '+' : '−') + ' ' + Math.abs(b) + ' × ' + m + ' ' + (c > 0 ? '+' : '−') + ' ' + Math.abs(c) + '.',
          m + '² = ' + m * m + (s < 0 ? ' donc −' + m + '² = −' + m * m + ' (le signe − n\'est pas élevé au carré)' : '') + '.',
          'u<sub>' + m + '</sub> = ' + N(s * m * m) + ' ' + (b * m > 0 ? '+' : '−') + ' ' + Math.abs(b * m) + ' ' + (c > 0 ? '+' : '−') + ' ' + Math.abs(c) + ' = ' + N(v) + '.'],
        pitfalls: ['−n² = −(n²) : on calcule le carré d\'abord, puis on met le signe.']
      };
    }
  });

  /* ---------- Suite définie par récurrence ---------- */
  function recStatement(formula, u0, n) {
    return 'Soit (u<sub>n</sub>) une suite définie par u<sub>0</sub> = ' + N(u0) + ' et pour tout entier n ∈ ℕ par u<sub>n+1</sub> = ' + formula + '.<br>Calculer ' + un(n) + '.';
  }
  function recSteps(terms, rule) {
    return terms.map((t, i) => i === 0 ? un(0) + ' = ' + N(t) + ' (donné).' : un(i) + ' = ' + rule(i, terms[i - 1], t));
  }
  RB.register({
    id: 'seq-rec', chapter: 'suites', theme: 'Suite définie par récurrence', difficulty: 2,
    title: 'Calculer un terme d\'une suite définie par récurrence',
    originals: [
      {
        source: '1AL10-4 (exercice 1)',
        statement: recStatement('−2u<sub>n</sub> + 1', 1, 4),
        fields: [{ key: 'u4', type: 'number', label: un(4) + ' =', answer: '11', traps: [{ answer: '-5', msg: 'Tu t\'es arrêté à u<sub>3</sub> : il faut faire un calcul de plus pour obtenir u<sub>4</sub>.' }, { answer: '-21', msg: 'Tu as calculé u<sub>5</sub> : arrête-toi à u<sub>4</sub>.' }] }],
        steps: ['On calcule les termes un par un, en partant de u<sub>0</sub> = 1.', 'u<sub>1</sub> = −2 × 1 + 1 = −1.', 'u<sub>2</sub> = −2 × (−1) + 1 = 3.', 'u<sub>3</sub> = −2 × 3 + 1 = −5.', 'u<sub>4</sub> = −2 × (−5) + 1 = 11.'],
        pitfalls: ['Pour u<sub>4</sub>, il faut calculer u<sub>1</sub>, u<sub>2</sub> et u<sub>3</sub> d\'abord.', '−2 × (−5) = +10 (moins par moins donne plus).']
      },
      {
        source: '1AL10-4 (exercice 2)', note: 'Énoncé reconstitué : tel que copié, on lit « u<sub>n+1</sub> = −5 + u<sub>n</sub><sup>2</sup> ». Si ton énoncé est différent (par exemple −5 + u<sub>n</sub>/2), dis-le-moi et je le corrige.',
        statement: recStatement('−5 + u<sub>n</sub><sup>2</sup>', 1, 4),
        fields: [{ key: 'u4', type: 'number', label: un(4) + ' =', answer: '13451', traps: [{ answer: '116', msg: 'Tu t\'es arrêté à u<sub>3</sub> : il faut faire un calcul de plus pour obtenir u<sub>4</sub>.' }] }],
        steps: ['u<sub>0</sub> = 1.', 'u<sub>1</sub> = −5 + 1² = −4.', 'u<sub>2</sub> = −5 + (−4)² = −5 + 16 = 11.', 'u<sub>3</sub> = −5 + 11² = −5 + 121 = 116.', 'u<sub>4</sub> = −5 + 116² = −5 + 13456 = 13451.'],
        pitfalls: ['(−4)² = +16 : un carré est toujours positif.']
      }
    ],
    generate(r) {
      if (r.chance(0.6)) {
        const a = r.pick([-3, -2, -2, 2, 3, 1, -1, 4]), b = r.int(-5, 6), u0 = r.int(-3, 4), n = r.int(3, 5);
        const t = [u0];
        for (let i = 1; i <= n + 1; i++) t.push(a * t[i - 1] + b);
        if (Math.abs(t[n + 1]) > 5000 || t[n] === t[n - 1]) throw new Error('trop grand');
        const f = (a === 1 ? '' : a === -1 ? '−' : N(a)) + 'u<sub>n</sub>' + (b ? ' ' + (b > 0 ? '+' : '−') + ' ' + Math.abs(b) : '');
        return {
          statement: recStatement(f, u0, n),
          fields: [{ key: 'u', type: 'number', label: un(n) + ' =', answer: String(t[n]), traps: [{ answer: String(t[n - 1]), msg: 'Tu t\'es arrêté à ' + un(n - 1) + ' : il faut faire un calcul de plus.' }, { answer: String(t[n + 1]), msg: 'Tu as calculé ' + un(n + 1) + ' : arrête-toi à ' + un(n) + '.' }] }],
          steps: ['On calcule les termes un par un, en partant de u<sub>0</sub> = ' + N(u0) + '.'].concat(recSteps(t.slice(0, n + 1), (i, prev, cur) => N(a) + ' × ' + RB.paren(prev) + (b ? ' ' + (b > 0 ? '+' : '−') + ' ' + Math.abs(b) : '') + ' = ' + N(cur) + '.').slice(1)),
          pitfalls: ['Pour ' + un(n) + ', il faut calculer tous les termes précédents.', 'Attention aux signes : (−) × (−) = (+).']
        };
      }
      const c = r.int(-6, -1), u0 = r.pick([0, 1, -1, 2]), n = 3;
      const t = [u0];
      for (let i = 1; i <= n; i++) t.push(c + t[i - 1] * t[i - 1]);
      if (Math.abs(t[n]) > 50000 || Math.abs(t[n]) < 2) throw new Error('trop grand');
      return {
        statement: recStatement(N(c) + ' + u<sub>n</sub><sup>2</sup>', u0, n),
        fields: [{ key: 'u', type: 'number', label: un(n) + ' =', answer: String(t[n]), traps: [{ answer: String(t[n - 1]), msg: 'Tu t\'es arrêté à ' + un(n - 1) + ' : il faut faire un calcul de plus.' }] }],
        steps: ['u<sub>0</sub> = ' + N(u0) + '.'].concat(t.slice(1).map((cur, i) => un(i + 1) + ' = ' + N(c) + ' + ' + RB.paren(t[i]) + '² = ' + N(c) + ' + ' + t[i] * t[i] + ' = ' + N(cur) + '.')),
        pitfalls: ['(−4)² = +16 : un carré est toujours positif.', 'On calcule chaque terme à partir du précédent.']
      };
    }
  });

  /* ---------- Statistiques : médiane ---------- */
  RB.register({
    id: 'median', chapter: 'stats', theme: 'Médiane d\'une série', difficulty: 2,
    title: 'Déterminer la médiane d\'une série donnée par un tableau',
    originals: [{
      source: 'Centres Étrangers – Techno · 1A-A01-5 (question 6)',
      statement: 'Voici les notes obtenues dans une classe lors d\'un contrôle en mathématiques.<br>' + RB.table([['Note', 6, 9, 12, 14], ['Nombre d\'élèves', 8, 7, 3, 4]], { firstCol: true, cls: 'center' }) + 'La note médiane de ce contrôle est :',
      qcm: {
        options: [
          { html: '5', why: 'Ce n\'est pas une note de la série : la médiane est une valeur de la série (ou la moyenne de deux valeurs).' },
          { html: '9,23', why: 'Tu as calculé la <b>moyenne</b> (≈ 9,23), pas la médiane.' },
          { html: '10,5', why: 'Tu as pris la médiane des 4 notes 6 ; 9 ; 12 ; 14 en oubliant les effectifs.' },
          { html: '9', correct: true }
        ]
      },
      steps: ['Effectif total : 8 + 7 + 3 + 4 = 22 élèves.', 'Comme 22 est pair, la médiane est la moyenne de la 11<sup>e</sup> et de la 12<sup>e</sup> note quand on range les notes dans l\'ordre.',
        'Les 8 premières notes valent 6 ; les 7 suivantes (de la 9<sup>e</sup> à la 15<sup>e</sup>) valent 9.', 'La 11<sup>e</sup> et la 12<sup>e</sup> notes valent toutes les deux 9, donc la médiane est 9.'],
      pitfalls: ['Il faut tenir compte des effectifs : on range <b>toutes</b> les notes, pas seulement les valeurs différentes.', 'Médiane ≠ moyenne.']
    }],
    generate(r) {
      const k = r.int(4, 6);
      const vals = [];
      let v = r.int(2, 8);
      for (let i = 0; i < k; i++) { vals.push(v); v += r.int(1, 4); }
      const eff = vals.map(() => r.int(1, 9));
      const tot = eff.reduce((a, b) => a + b, 0);
      const all = [];
      vals.forEach((x, i) => { for (let j = 0; j < eff[i]; j++) all.push(x); });
      const med = tot % 2 ? all[(tot - 1) / 2] : (all[tot / 2 - 1] + all[tot / 2]) / 2;
      const mean = all.reduce((a, b) => a + b, 0) / tot;
      const medVals = vals.length % 2 ? vals[(vals.length - 1) / 2] : (vals[vals.length / 2 - 1] + vals[vals.length / 2]) / 2;
      const o = (x, why, val) => ({ html: N(rnd(x, 2)), val: String(rnd(x, 2)), why });
      const rank = tot % 2 ? 'la ' + (tot + 1) / 2 + '<sup>e</sup> note' : 'la moyenne de la ' + tot / 2 + '<sup>e</sup> et de la ' + (tot / 2 + 1) + '<sup>e</sup> note';
      let cum = 0; const cumTxt = vals.map((x, i) => { const a = cum + 1; cum += eff[i]; return 'valeur ' + x + ' : de la ' + a + '<sup>e</sup> à la ' + cum + '<sup>e</sup> note'; });
      return {
        statement: 'Voici les notes obtenues dans une classe lors d\'un contrôle en mathématiques.<br>' + RB.table([['Note'].concat(vals), ['Nombre d\'élèves'].concat(eff)], { firstCol: true, cls: 'center' }) + 'La note médiane de ce contrôle est :',
        qcm: RB.qcm(o(med), [
          o(mean, 'Tu as calculé la <b>moyenne</b> (≈ ' + N(rnd(mean, 2)) + '), pas la médiane.'),
          o(medVals, 'Tu as pris la médiane des valeurs ' + vals.join(' ; ') + ' en oubliant les effectifs.'),
          o(tot / 2, 'Tu as pris la moitié de l\'effectif total (' + tot + ') : c\'est un <b>rang</b>, pas une note.'),
          o(vals[eff.indexOf(Math.max.apply(null, eff))], 'Cette valeur est celle qui a le plus grand effectif (le mode), pas la médiane.'),
          o(vals[0] + 1, 'Cette valeur ne vient pas d\'un raisonnement sur les rangs.')
        ]),
        steps: ['Effectif total : ' + eff.join(' + ') + ' = ' + tot + ' élèves.', 'La médiane est ' + rank + ' quand on range toutes les notes dans l\'ordre croissant.',
          'On repère où se trouvent les rangs : ' + cumTxt.join(' ; ') + '.', 'La médiane vaut donc ' + N(med) + '.'],
        pitfalls: ['Il faut tenir compte des effectifs : on range <b>toutes</b> les notes, pas seulement les valeurs différentes.', 'Médiane ≠ moyenne.']
      };
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
