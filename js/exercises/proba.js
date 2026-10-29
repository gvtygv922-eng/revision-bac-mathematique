/* Chapitre : Probabilités */
(function (G) {
  'use strict';
  const RB = G.RB, Q = RB.Q, Qo = RB.Qo, F = RB.frac, N = RB.num, H = RB.Qhtml;
  const AN = 'Amérique du Nord – Spécialité · 1A-A01-1';
  const TECH = 'Centres Étrangers – Techno · 1A-A01-5';
  const SPE = 'Centres Étrangers – Spécialité · 1A-A01-3';
  const rnd = (x, d) => Math.round(x * Math.pow(10, d)) / Math.pow(10, d);
  const T = RB.Qtxt;
  const B = RB.bar;
  const pct1 = (v) => N(rnd(v * 100, 1)) + '&nbsp;%';

  /* ---------- 1. Écrire une probabilité à partir d'un énoncé ---------- */
  const KINDS = {
    S1: { f: (c) => 'P<sub>M</sub>(' + B('D') + ')', t: (c, p) => p + ' des clients qui ' + c.M + ' ' + c.notD + ' ;' },
    S2: { f: () => 'P(D)', t: (c, p) => p + ' des clients ' + c.D + ' ;' },
    S3: { f: () => 'P<sub>D</sub>(M)', t: (c, p) => 'Parmi les clients qui ' + c.D2 + ', ' + p + ' ' + c.M + ' ;' },
    S4: { f: () => 'P(D ∩ M)', t: (c, p) => p + ' des clients sont des clients qui ' + c.M + ' et qui ' + c.D + ' ;' },
    S5: { f: () => 'P<sub>' + B('D') + '</sub>(M)', t: (c, p) => p + ' des clients qui ' + c.notD + ' ' + c.M + ' ;' },
    S6: { f: () => 'P(M)', t: (c, p) => p + ' des clients ' + c.M + '.' }
  };
  const CTX = [
    { intro: 'Suite à l\'envoi de bons de réduction par internet, le service marketing d\'un magasin de prêt-à-porter effectue une enquête sur les clients du magasin. Cette enquête a montré que :',
      D: 'avaient un bon de réduction', D2: 'ont un bon de réduction', notD: 'n\'avaient pas un bon de réduction', M: 'ont acheté un vêtement',
      dDef: 'Le client avait un bon de réduction', mDef: 'Le client a acheté un vêtement', where: 'sortant du magasin' },
    { intro: 'Une librairie en ligne a envoyé une newsletter à une partie de ses clients. Le service marketing a réalisé une enquête qui a montré que :',
      D: 'avaient reçu la newsletter', D2: 'ont reçu la newsletter', notD: 'n\'avaient pas reçu la newsletter', M: 'ont acheté un livre',
      dDef: 'Le client avait reçu la newsletter', mDef: 'Le client a acheté un livre', where: 'de la librairie' },
    { intro: 'Pour la fête de la musique, un magasin d\'instruments a distribué des flyers. Une enquête auprès de ses clients a montré que :',
      D: 'avaient reçu un flyer', D2: 'ont reçu un flyer', notD: 'n\'avaient pas reçu de flyer', M: 'ont acheté un instrument',
      dDef: 'Le client avait reçu un flyer', mDef: 'Le client a acheté un instrument', where: 'du magasin' }
  ];
  function notationItem(ctx, vals, order, asked, src, note) {
    const items = order.map((k) => '<li>' + KINDS[k].t(ctx, pct1(vals[k])).replace(/^./, (c) => c) + '</li>');
    const fields = asked.map((k) => ({
      key: k, type: 'number', label: KINDS[k].f() + ' =', answer: String(rnd(vals[k], 3)), placeholder: 'ex : 0,25', show: N(rnd(vals[k], 3)),
      traps: Object.keys(KINDS).filter((o) => o !== k).map((o) => ({ answer: String(rnd(vals[o], 3)), msg: 'Cette valeur est celle de ' + KINDS[o].f() + '. Regarde bien <b>quelle</b> probabilité est demandée (qui est « sachant que »).' }))
    }));
    return {
      source: src, note: note,
      statement: ctx.intro + '<ul class="data">' + items.join('') + '</ul>On note :<br>• D : « ' + ctx.dDef + ' » ;<br>• M : « ' + ctx.mDef + ' ».<br>On interroge au hasard un client ' + ctx.where + ' et on note P la probabilité associée à cette expérience aléatoire.<br>En utilisant les données de l\'énoncé, compléter :',
      fields: fields,
      steps: ['Un pourcentage se traduit par une probabilité : 40,7&nbsp;% = 0,407.',
        'Phrase « <b>X&nbsp;% des A qui sont B</b> » (ou « parmi les A, X&nbsp;% sont B ») : c\'est une probabilité <b>conditionnelle</b> P<sub>A</sub>(B) (on se limite aux A).',
        'Phrase « <b>X&nbsp;% des clients sont A et B</b> » : c\'est une probabilité d\'<b>intersection</b> P(A ∩ B).',
        'Phrase « <b>X&nbsp;% des clients sont A</b> » : c\'est P(A).',
        'On associe chaque phrase du champ demandé : ' + asked.map((k) => KINDS[k].f() + ' = ' + N(rnd(vals[k], 3))).join(' ; ') + '.'],
      pitfalls: ['« Parmi ... » ou « des clients qui ... » indique un « sachant que » : probabilité conditionnelle.', 'P(D ∩ M) n\'est pas P<sub>D</sub>(M) : la première porte sur <b>tous</b> les clients.']
    };
  }
  RB.register({
    id: 'proba-notation', chapter: 'proba', theme: 'Écrire une probabilité', difficulty: 2,
    title: 'Traduire un énoncé en probabilités (conditionnelle, intersection)',
    originals: [notationItem(CTX[0], { S1: 0.407, S2: 0.47, S3: 0.92, S4: 0.432, S5: 0.56, S6: 0.729 }, ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'], ['S1', 'S4', 'S2'], '1P10-1',
      'Dans le texte copié, les barres (événements contraires) avaient disparu : j\'ai déduit les trois probabilités à compléter de tes données — P<sub>M</sub>(D̄), P(D ∩ M) et P(D). Compare avec ton énoncé d\'origine.')],
    generate(r) {
      const ctx = r.pick(CTX);
      const d = r.int(30, 70) / 100, a = r.int(70, 95) / 100, b = r.int(30, 70) / 100;
      const pDM = d * a, pM = pDM + (1 - d) * b, pNotDgivenM = ((1 - d) * b) / pM;
      const vals = { S1: pNotDgivenM, S2: d, S3: a, S4: pDM, S5: b, S6: pM };
      Object.keys(vals).forEach((k) => { vals[k] = rnd(vals[k], 3); if (rnd(vals[k] * 1000, 0) % 1 !== 0) throw new Error('arrondi'); });
      // valeurs affichées à 0,1 % près : on les arrondit à 3 décimales
      const order = r.shuffle(Object.keys(KINDS));
      const cond = ['S1', 'S3', 'S5'], other = ['S2', 'S4', 'S6'];
      const asked = r.shuffle([r.pick(cond), r.pick(other)].concat([r.pick(Object.keys(KINDS))])).filter((x, i, arr) => arr.indexOf(x) === i);
      while (asked.length < 3) { const k = r.pick(Object.keys(KINDS)); if (asked.indexOf(k) < 0) asked.push(k); }
      return notationItem(ctx, vals, order, asked.slice(0, 3), '', null);
    }
  });

  /* ---------- 2. Probabilité conditionnelle : P(A ∩ B) = P(A) × P_A(B) ---------- */
  function condItem(pA, pBA, src) {
    const v = rnd(pA * pBA, 6);
    return {
      source: src,
      statement: 'Le jour d\'une grande journée de promotion, ' + N(rnd(pA * 100, 2)) + '&nbsp;% des clients qui entrent dans un magasin ont été contactés lors d\'une campagne publicitaire. Une étude statistique montre que la probabilité qu\'un client effectue un achat sachant qu\'il a été contacté au cours de la campagne publicitaire est de ' + N(pBA) + '.<br>On choisit au hasard un client du magasin lors de cette grande journée de promotion. On définit les évènements suivants :<br>• A : « le client choisi a été contacté lors de la campagne publicitaire » ;<br>• B : « le client choisi a effectué un achat ».<br>Calculer la valeur décimale de P(A ∩ B).',
      fields: [{ key: 'p', type: 'number', label: 'P(A ∩ B) =', answer: String(v), show: N(v), placeholder: 'ex : 0,39',
        traps: [{ answer: String(pBA), msg: 'Tu as donné P<sub>A</sub>(B). Mais P(A ∩ B) = P(A) × P<sub>A</sub>(B).' }, { answer: String(pA), msg: 'Tu as donné P(A). Il faut multiplier par P<sub>A</sub>(B).' },
          { answer: String(rnd(pA + pBA, 6)), msg: 'On <b>multiplie</b> : P(A ∩ B) = P(A) × P<sub>A</sub>(B) (on n\'additionne pas).' }] }],
      steps: ['Données : P(A) = ' + N(pA) + ' et P<sub>A</sub>(B) = ' + N(pBA) + ' (« sachant qu\'il a été contacté »).', 'Formule : P(A ∩ B) = P(A) × P<sub>A</sub>(B).', 'P(A ∩ B) = ' + N(pA) + ' × ' + N(pBA) + ' = ' + N(v) + '.'],
      pitfalls: ['« Sachant que A » signifie P<sub>A</sub>(…) : conditionnelle.', 'P(A ∩ B) = P(A) × P<sub>A</sub>(B) : on multiplie.']
    };
  }
  RB.register({
    id: 'proba-cond', chapter: 'proba', theme: 'Probabilité conditionnelle', difficulty: 1,
    title: 'Calculer P(A ∩ B) avec une probabilité conditionnelle',
    originals: [condItem(0.5, 0.78, '1P10-2')],
    generate(r) {
      const pA = r.pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75, 0.8]);
      const q = r.pick([0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.72, 0.75, 0.78, 0.8, 0.85, 0.9]);
      if (rnd(pA * q, 6) >= 1) throw new Error('x');
      const it = condItem(pA, q, ''); delete it.source; return it;
    }
  });

  /* ---------- 3. Arbre pondéré ---------- */
  function treeFig(X, a, b, c, Y) {
    // X : événement du 1er niveau ; a = P(X) ; b = P_X(Y) ; c = P_barX(Y)
    return RB.tree([
      { t: X, bar: false, p: N(a), kids: [{ t: Y, bar: false, p: N(b) }, { t: Y, bar: true, p: N(rnd(1 - b, 6)) }] },
      { t: X, bar: true, p: N(rnd(1 - a, 6)), kids: [{ t: Y, bar: false, p: N(c) }, { t: Y, bar: true, p: N(rnd(1 - c, 6)) }] }
    ]);
  }
  const ev = (t, bar) => (bar ? B(t) : t);
  function treeAnswer(X, a, b, c, Y, xb, yb) {
    const pa = xb ? rnd(1 - a, 6) : a;
    const cond = xb ? (yb ? rnd(1 - c, 6) : c) : (yb ? rnd(1 - b, 6) : b);
    return { pa: pa, cond: cond, v: rnd(pa * cond, 6) };
  }
  RB.register({
    id: 'tree', chapter: 'proba', theme: 'Arbre pondéré', difficulty: 1,
    title: 'Calculer une probabilité avec un arbre',
    originals: [
      {
        source: SPE + ' (question 1)',
        statement: 'Soient A et B deux événements. On donne l\'arbre de probabilités ci-dessous :<br>On peut alors affirmer que P(A ∩ ' + B('B') + ') est égale à :',
        figure: treeFig('A', 0.2, 0.6, 0.4, 'B'),
        qcm: {
          options: [
            { html: '0,12', why: 'Tu as multiplié par la mauvaise branche (0,2 × 0,6 donne P(A ∩ B)). Pour ' + B('B') + ' après A, la branche porte 0,4.' },
            { html: '0,4', why: 'C\'est P<sub>A</sub>(' + B('B') + ') : il faut encore multiplier par P(A) = 0,2.' },
            { html: '0,08', correct: true },
            { html: '0,6', why: 'C\'est P<sub>A</sub>(B) : mauvaise branche, et il faut multiplier par P(A).' }
          ]
        },
        steps: ['P(A ∩ ' + B('B') + ') correspond au chemin A puis ' + B('B') + '.', 'On multiplie les probabilités le long du chemin : P(A ∩ ' + B('B') + ') = P(A) × P<sub>A</sub>(' + B('B') + ') = 0,2 × 0,4 = 0,08.'],
        pitfalls: ['Le long d\'un chemin, on <b>multiplie</b> les probabilités des branches.']
      },
      {
        source: '1P10-3', note: 'Dans le texte copié les barres avaient disparu : j\'ai lu les branches comme K (0,3) puis L (0,3) / L̄ (0,7), et K̄ (0,7) puis L (0,5) / L̄ (0,5). Compare avec ton énoncé d\'origine.',
        statement: 'On donne l\'arbre de probabilités :<br>Calculer P(K ∩ L).',
        figure: treeFig('K', 0.3, 0.3, 0.5, 'L'),
        fields: [{ key: 'p', type: 'number', label: 'P(K ∩ L) =', answer: '0.09', show: '0,09', placeholder: 'ex : 0,15', traps: [{ answer: '0.15', msg: 'Tu as pris la branche L partant de K̄ (0,7 × ... ) ou une mauvaise branche : le chemin K ∩ L utilise 0,3 puis 0,3.' }, { answer: '0.3', msg: 'C\'est une seule branche : il faut multiplier les deux branches du chemin.' }, { answer: '0.6', msg: 'On <b>multiplie</b> les probabilités du chemin, on ne les additionne pas.' }] }],
        steps: ['P(K ∩ L) correspond au chemin K puis L.', 'P(K ∩ L) = P(K) × P<sub>K</sub>(L) = 0,3 × 0,3 = 0,09.'],
        pitfalls: ['Le long d\'un chemin, on <b>multiplie</b> les probabilités des branches.']
      }
    ],
    generate(r) {
      const names = r.pick([['A', 'B'], ['K', 'L'], ['R', 'S'], ['E', 'F'], ['M', 'N']]);
      const [X, Y] = names;
      const a = r.pick([0.1, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8]);
      const b = r.pick([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]);
      let c = r.pick([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]);
      const xb = r.chance(0.5), yb = r.chance(0.5);
      const ans = treeAnswer(X, a, b, c, Y, xb, yb);
      const label = 'P(' + ev(X, xb) + ' ∩ ' + ev(Y, yb) + ')';
      const path = (xb ? 'chemin ' + B(X) : 'chemin ' + X) + ' puis ' + ev(Y, yb);
      const steps = ['' + label + ' correspond au ' + path + '.', 'On multiplie les probabilités le long du chemin : ' + label + ' = P(' + ev(X, xb) + ') × P<sub>' + ev(X, xb) + '</sub>(' + ev(Y, yb) + ') = ' + N(ans.pa) + ' × ' + N(ans.cond) + ' = ' + N(ans.v) + '.'];
      const pitfalls = ['Le long d\'un chemin, on <b>multiplie</b> les probabilités des branches.'];
      const figure = treeFig(X, a, b, c, Y);
      const stat = 'Soient ' + X + ' et ' + Y + ' deux événements. On donne l\'arbre de probabilités ci-dessous :<br>';
      if (r.chance(0.5)) {
        const wrongs = [
          { v: ans.cond, why: 'C\'est une probabilité conditionnelle (une seule branche) : il faut multiplier par la probabilité du premier niveau.' },
          { v: rnd(ans.pa * (1 - ans.cond), 6), why: 'Tu as pris la mauvaise branche au deuxième niveau (' + ev(Y, !yb) + ' au lieu de ' + ev(Y, yb) + ').' },
          { v: rnd(1 - ans.cond, 6), why: 'Une seule branche ne suffit pas : on multiplie les deux branches du chemin.' },
          { v: rnd(ans.pa + ans.cond, 6), why: 'On multiplie les probabilités du chemin, on ne les additionne pas.' }
        ].map((w) => ({ html: N(w.v), val: String(w.v), why: w.why }));
        return { statement: stat + 'On peut alors affirmer que ' + label + ' est égale à :', figure, qcm: RB.qcm({ html: N(ans.v), val: String(ans.v) }, wrongs), steps, pitfalls };
      }
      return {
        statement: stat + 'Calculer ' + label + '.', figure,
        fields: [{ key: 'p', type: 'number', label: label + ' =', answer: String(ans.v), show: N(ans.v), placeholder: 'ex : 0,15',
          traps: [{ answer: String(ans.cond), msg: 'C\'est une seule branche : il faut multiplier par la probabilité du premier niveau.' }, { answer: String(rnd(ans.pa + ans.cond, 6)), msg: 'On <b>multiplie</b> les probabilités du chemin, on ne les additionne pas.' }] }],
        steps, pitfalls
      };
    }
  });

  /* ---------- 4. Tableau d'effectifs ---------- */
  const tblHTML = (n11, n12, n21, n22, R, U) => RB.table([
    ['', R, B(R), 'Total'], [U, n11, n12, n11 + n12], [B(U), n21, n22, n21 + n22], ['Total', n11 + n21, n12 + n22, n11 + n12 + n21 + n22]
  ], { header: true, firstCol: true, cls: 'center' });
  function tableFields(n11, n12, n21, n22, askedKeys, R, U, src) {
    const tot = n11 + n12 + n21 + n22, rowU = n11 + n12, rowNU = n21 + n22, colR = n11 + n21, colNR = n12 + n22;
    const defs = {
      cR_U: { f: RB.pc(R, U, false), n: n11, d: colR, why: 'On se restreint à la colonne ' + R + ' (total ' + colR + ').', exp: 'effectif de (' + R + ' ∩ ' + U + ') = ' + n11 + ', effectif de ' + R + ' = ' + colR },
      cR_nU: { f: RB.pc(R, U, true), n: n21, d: colR, exp: 'effectif de (' + R + ' ∩ ' + B(U) + ') = ' + n21 + ', effectif de ' + R + ' = ' + colR },
      cU_R: { f: RB.pc(U, R, false), n: n11, d: rowU, exp: 'effectif de (' + R + ' ∩ ' + U + ') = ' + n11 + ', effectif de ' + U + ' = ' + rowU },
      cnU_nR: { f: RB.pc(B(U) ? U : U, R, true), n: 0, d: 1 },
      pU: { f: 'P(' + U + ')', n: rowU, d: tot, exp: 'effectif de ' + U + ' = ' + rowU + ', effectif total = ' + tot },
      pnU: { f: 'P(' + B(U) + ')', n: rowNU, d: tot, exp: 'effectif de ' + B(U) + ' = ' + rowNU + ', effectif total = ' + tot },
      pR: { f: 'P(' + R + ')', n: colR, d: tot, exp: 'effectif de ' + R + ' = ' + colR + ', effectif total = ' + tot },
      iRU: { f: 'P(' + R + ' ∩ ' + U + ')', n: n11, d: tot, exp: 'effectif de (' + R + ' ∩ ' + U + ') = ' + n11 + ', effectif total = ' + tot },
      iRnU: { f: 'P(' + R + ' ∩ ' + B(U) + ')', n: n21, d: tot, exp: 'effectif de (' + R + ' ∩ ' + B(U) + ') = ' + n21 + ', effectif total = ' + tot },
      cnR_U: { f: RB.pc(B(R), U, false), n: n12, d: colNR, exp: 'effectif de (' + B(R) + ' ∩ ' + U + ') = ' + n12 + ', effectif de ' + B(R) + ' = ' + colNR }
    };
    const fields = askedKeys.map((k) => {
      const d = defs[k]; const q = Q(d.n, d.d);
      return { key: k, type: 'number', label: d.f + ' =', answer: d.n + '/' + d.d, show: F(d.n, d.d) + (q.d !== d.d ? ' = ' + H(q) : ''), decTol: 0.0051, placeholder: 'fraction ou décimal',
        traps: [{ answer: d.d + '/' + d.n, msg: 'Tu as inversé la fraction : numérateur = effectif de l\'événement demandé, dénominateur = effectif de la population de référence.' }] };
    });
    return fields.concat([]) && {
      fields,
      steps: ['On lit les effectifs dans le tableau (total général = ' + tot + ').', 'Probabilité = effectif favorable ÷ effectif de la population considérée.'].concat(askedKeys.map((k) => defs[k].f + ' = ' + F(defs[k].n, defs[k].d) + ' (' + defs[k].exp + ').')),
      pitfalls: ['Pour P<sub>A</sub>(B), le dénominateur est l\'effectif de A (« sachant que A »), pas le total.', 'Pour P(A) ou P(A ∩ B), le dénominateur est l\'effectif total.']
    };
  }
  RB.register({
    id: 'table-fields', chapter: 'proba', theme: 'Tableau d\'effectifs', difficulty: 2,
    title: 'Calculer des probabilités avec un tableau d\'effectifs',
    originals: [(() => {
      const t = tableFields(13, 55, 57, 40, ['cR_nU', 'pnU', 'iRU'], 'R', 'U');
      return Object.assign({ source: '1P10-4', note: 'Les barres étaient perdues dans le texte copié : j\'ai lu P<sub>R</sub>(Ū), P(Ū) et P(R ∩ U). Les décimaux arrondis à 0,01 près sont acceptés.',
        statement: 'On donne le tableau d\'effectifs suivant :' + tblHTML(13, 55, 57, 40, 'R', 'U') + 'Calculer ' + RB.pc('R', 'U', true) + ', P(' + B('U') + ') et P(R ∩ U).' }, t);
    })()],
    generate(r) {
      const n11 = r.int(5, 60), n12 = r.int(5, 60), n21 = r.int(5, 60), n22 = r.int(5, 60);
      const [R, U] = r.pick([['R', 'U'], ['A', 'B'], ['F', 'G'], ['S', 'T']]);
      const cond = r.pick(['cR_U', 'cR_nU', 'cU_R', 'cnR_U']);
      const marg = r.pick(['pU', 'pnU', 'pR']);
      const inter = r.pick(['iRU', 'iRnU']);
      const t = tableFields(n11, n12, n21, n22, [cond, marg, inter], R, U);
      return Object.assign({ statement: 'On donne le tableau d\'effectifs suivant :' + tblHTML(n11, n12, n21, n22, R, U) + 'Calculer ' + t.fields.map((f) => f.label.replace(/ =$/, '')).join(', ') + '.<br><small>Réponds avec une fraction ou un décimal arrondi à 0,01.</small>' }, t);
    }
  });

  /* tableau partiel (28 élèves ...) */
  RB.register({
    id: 'table-cond', chapter: 'proba', theme: 'Tableau d\'effectifs', difficulty: 2,
    title: 'Probabilité conditionnelle à partir d\'un tableau à compléter',
    originals: [{
      source: SPE + ' (question 7)',
      statement: 'Ce tableau donne les résultats partiels d\'un sondage dans une classe de première comptant 29 élèves :' +
        RB.table([['', '16 ans ou moins', 'Plus de 16 ans'], ['Suivent la spé Mathématiques', 7, ''], ['Ne suivent pas la spé Mathématiques', 7, 3]], { header: true, firstCol: true, cls: 'center' }) +
        'On interroge un élève de cette classe au hasard.<br>La probabilité que ce soit un élève qui suive la spécialité Mathématiques sachant qu\'il est âgé de plus de 16 ans est :',
      qcm: {
        options: [
          { html: F(12, 29), why: 'Tu as divisé par 29 (tous les élèves). Mais « sachant qu\'il a plus de 16 ans » : on ne garde que les élèves de plus de 16 ans.' },
          { html: F(12, 19), why: '19 est le nombre d\'élèves qui suivent la spécialité : tu as inversé « sachant que » (c\'est P<sub>spé</sub>(plus de 16 ans)).' },
          { html: '12', why: '12 est un effectif, une probabilité est comprise entre 0 et 1.' },
          { html: F(4, 5), correct: true }
        ]
      },
      steps: ['On complète le tableau : plus de 16 ans = 29 − 7 − 7 − 3... d\'abord le total des plus de 16 ans : la case manquante vaut 29 − 7 − 7 − 3 = 12.', 'Les élèves de plus de 16 ans sont 12 + 3 = 15 ; parmi eux, 12 suivent la spécialité.', 'P<sub>plus de 16 ans</sub>(spé) = ' + F(12, 15) + ' = ' + F(4, 5) + '.'],
      pitfalls: ['« Sachant que » : on se limite à la population de la condition (ici les plus de 16 ans).']
    }],
    generate(r) {
      const a = r.int(4, 12), b = r.int(6, 16), c = r.int(3, 12), d = r.int(2, 10);
      const n = a + b + c + d;
      const sub = r.pick(['age', 'spe']);
      const hdr = ['', '16 ans ou moins', 'Plus de 16 ans'];
      const tbl = RB.table([hdr, ['Suivent la spé Mathématiques', a, ''], ['Ne suivent pas la spé Mathématiques', c, d]], { header: true, firstCol: true, cls: 'center' });
      let ans, w, q, steps;
      if (sub === 'age') {
        ans = Q(b, b + d); q = 'sachant qu\'il est âgé de plus de 16 ans';
        w = [[Q(b, n), 'Tu as divisé par ' + n + ' (tous les élèves). « Sachant qu\'il a plus de 16 ans » : on ne garde que les ' + (b + d) + ' élèves de plus de 16 ans.'],
          [Q(b, a + b), 'Tu as pris pour référence les élèves qui suivent la spécialité (' + (a + b) + ') : tu as inversé « sachant que ».'],
          [Q(b), 'Un effectif n\'est pas une probabilité.']];
        steps = ['On complète le tableau : la case manquante vaut ' + n + ' − ' + a + ' − ' + c + ' − ' + d + ' = ' + b + '.', 'Il y a ' + b + ' + ' + d + ' = ' + (b + d) + ' élèves de plus de 16 ans ; ' + b + ' d\'entre eux suivent la spécialité.', 'P = ' + F(b, b + d) + (ans.d !== b + d ? ' = ' + H(ans) : '') + '.'];
      } else {
        ans = Q(b, a + b); q = 'sachant qu\'il suit la spécialité Mathématiques';
        w = [[Q(b, n), 'Tu as divisé par ' + n + ' (tous les élèves) : « sachant que » restreint la population.'],
          [Q(b, b + d), 'Tu as pris pour référence les élèves de plus de 16 ans : tu as inversé « sachant que ».'],
          [Q(b), 'Un effectif n\'est pas une probabilité.']];
        steps = ['On complète le tableau : la case manquante vaut ' + n + ' − ' + a + ' − ' + c + ' − ' + d + ' = ' + b + '.', 'Il y a ' + a + ' + ' + b + ' = ' + (a + b) + ' élèves qui suivent la spécialité ; ' + b + ' d\'entre eux ont plus de 16 ans.', 'P = ' + F(b, a + b) + (ans.d !== a + b ? ' = ' + H(ans) : '') + '.'];
      }
      const stat = 'Ce tableau donne les résultats partiels d\'un sondage dans une classe de première comptant ' + n + ' élèves :' + tbl + 'On interroge un élève de cette classe au hasard.<br>La probabilité que ce soit un élève ' + (sub === 'age' ? 'qui suive la spécialité Mathématiques ' : 'âgé de plus de 16 ans ') + q + ' est :';
      const statFix = sub === 'age' ? stat : stat.replace('La probabilité que ce soit un élève âgé de plus de 16 ans sachant qu\'il suit la spécialité Mathématiques est :', 'La probabilité que ce soit un élève de plus de 16 ans sachant qu\'il suit la spécialité Mathématiques est :');
      return {
        statement: statFix,
        qcm: RB.qcm({ html: H(ans), val: T(ans) }, w.map(([v, why]) => ({ html: v.d === 1 ? N(v.n) : F(v.n, v.d), val: T(v), why }))),
        steps, pitfalls: ['« Sachant que » : on se limite à la population de la condition.']
      };
    }
  });

  /* ---------- 5. Lettres et mots (Amérique du Nord, question 5) ---------- */
  const WORDS = [['SINGE', 'SINGE', 2], ['PLAGE', 'PLAGE', 2], ['CHIEN', 'CHIEN', 2], ['OUTIL', 'OUTIL', 3], ['ROUGE', 'ROUGE', 3], ['TRAIN', 'TRAIN', 2], ['MAISON', 'MAISON', 3], ['CLAVIER', 'CLAVIER', 3]];
  function lettersItem(word, ask, src) {
    const VOW = 'AEIOUY';
    const letters = Array.from(new Set(word.split('')));
    const m = letters.length, k = letters.filter((l) => VOW.indexOf(l) >= 0).length;
    const fr = (n, d) => ({ html: F(n, d), val: T(Q(n, d)) });
    let c, wr, steps, label;
    if (ask === 'VM') {
      label = RB.pc('V', 'M');
      c = fr(k, 6);
      wr = [Object.assign(fr(m, 26), { why: 'C\'est P(M) : tu n\'as pas tenu compte de « sachant qu\'il a choisi une voyelle ».' }),
        Object.assign(fr(m, 6), { why: 'Il y a 6 voyelles, mais tous les ' + m + ' lettres de ' + word + ' ne sont pas des voyelles : compte seulement les voyelles de ' + word + '.' }),
        Object.assign(fr(k, m), { why: 'Tu as calculé P<sub>M</sub>(V) : tu as inversé « sachant que ». Ici on se limite aux voyelles (6 lettres).' }),
        Object.assign(fr(k, 26), { why: 'C\'est P(V ∩ M) : pour une probabilité conditionnelle, on divise par le nombre de voyelles (6), pas par 26.' })];
      steps = ['Les voyelles de l\'alphabet sont A, E, I, O, U, Y : il y en a 6.', 'Les lettres de ' + word + ' sont : ' + letters.join(', ') + ' (' + m + ' lettres).', 'Parmi les voyelles, celles qui sont dans ' + word + ' : ' + letters.filter((l) => VOW.indexOf(l) >= 0).join(', ') + ' (' + k + ' voyelles).',
        'P<sub>V</sub>(M) = ' + F(k, 6) + (Q(k, 6).d !== 6 ? ' = ' + H(Q(k, 6)) : '') + ' (on ne garde que les 6 voyelles).'];
    } else {
      label = RB.pc('M', 'V');
      c = fr(k, m);
      wr = [Object.assign(fr(k, 6), { why: 'Tu as calculé P<sub>V</sub>(M) : tu as inversé « sachant que ». Ici on se limite aux ' + m + ' lettres de ' + word + '.' }),
        Object.assign(fr(k, 26), { why: 'C\'est P(V ∩ M) : pour une probabilité conditionnelle, on divise par le nombre de lettres de ' + word + ' (' + m + '), pas par 26.' }),
        Object.assign(fr(6, 26), { why: 'C\'est P(V) : tu n\'as pas tenu compte de « sachant que ».' }),
        Object.assign(fr(m, 26), { why: 'C\'est P(M) : tu n\'as pas tenu compte de « sachant que ».' })];
      steps = ['Les lettres de ' + word + ' sont : ' + letters.join(', ') + ' (' + m + ' lettres).', 'Parmi elles, les voyelles : ' + letters.filter((l) => VOW.indexOf(l) >= 0).join(', ') + ' (' + k + ' voyelles).',
        'P<sub>M</sub>(V) = ' + F(k, m) + ' (on ne garde que les ' + m + ' lettres de ' + word + ').'];
    }
    return {
      source: src,
      statement: 'Un singe choisit une lettre au hasard parmi les lettres de l\'alphabet.<br>On note les évènements :<br>• V : « Le singe choisit une voyelle. »<br>• M : « Le singe choisit une des lettres du mot ' + word + '. »<br><i>Rappel : l\'alphabet est constitué de 26 lettres dont les voyelles sont : A, E, I, O, U, Y.</i><br>On note ' + label + ' la probabilité que ' + (ask === 'VM' ? 'le singe ait choisi une lettre du mot ' + word + ' sachant qu\'il a choisi une voyelle' : 'le singe ait choisi une voyelle sachant qu\'il a choisi une lettre du mot ' + word) + '.<br>On peut alors affirmer que ' + label + ' vaut :',
      qcm: RB.qcm(c, wr), steps, pitfalls: ['P<sub>A</sub>(B) : le dénominateur est le nombre d\'éléments de A (la condition).', 'Les barres de fraction ne se simplifient pas toujours : 2/6 = 1/3.']
    };
  }
  RB.register({
    id: 'letters', chapter: 'proba', theme: 'Probabilité conditionnelle', difficulty: 2,
    title: 'Probabilité conditionnelle avec des lettres',
    originals: [lettersItem('SINGE', 'VM', AN + ' (question 5)')],
    generate(r) {
      const w = r.pick(WORDS)[0];
      const it = lettersItem(w, r.pick(['VM', 'MV']), ''); delete it.source; return it;
    }
  });

  /* ---------- 6. Dé truqué ---------- */
  RB.register({
    id: 'die', chapter: 'proba', theme: 'Loi de probabilité', difficulty: 1,
    title: 'Probabilité d\'un événement avec un dé truqué',
    originals: [{
      source: TECH + ' (question 4)',
      statement: 'On considère un dé truqué tel que la probabilité d\'obtenir un 5 et celle d\'obtenir un 6 sont chacune égales à 0,2.<br>On lance le dé. La probabilité d\'obtenir un nombre supérieur ou égal à 5 est :',
      qcm: {
        options: [
          { html: F(1, 6), why: 'Le dé est truqué : on ne peut pas utiliser 1/6 (cas d\'un dé équilibré).' },
          { html: '0,2', why: 'C\'est la probabilité d\'obtenir 5 <b>ou</b> 6 séparément : « supérieur ou égal à 5 » signifie 5 <b>ou</b> 6.' },
          { html: '0,4', correct: true },
          { html: F(2, 6), why: 'Le dé est truqué : on ne peut pas utiliser « 2 cas sur 6 » (cas d\'un dé équilibré).' }
        ]
      },
      steps: ['« Supérieur ou égal à 5 » signifie obtenir 5 ou 6.', 'Ces deux événements sont incompatibles : on additionne leurs probabilités.', 'P = P(5) + P(6) = 0,2 + 0,2 = 0,4.'],
      pitfalls: ['Avec un dé truqué, on utilise les probabilités données, pas 1/6.', '« ou » entre deux événements incompatibles : on additionne.']
    }],
    generate(r) {
      const x = r.pick([0.05, 0.1, 0.15, 0.2, 0.25, 0.3]), y = r.pick([0.05, 0.1, 0.15, 0.2, 0.25, 0.3]);
      const s = rnd(x + y, 4);
      const same = x === y;
      const o = (v, why, val) => ({ html: N(v), val: val, why });
      return {
        statement: 'On considère un dé truqué tel que la probabilité d\'obtenir un 5 ' + (same ? 'et celle d\'obtenir un 6 sont chacune égales à ' + N(x) : 'est égale à ' + N(x) + ' et celle d\'obtenir un 6 est égale à ' + N(y)) + '.<br>On lance le dé. La probabilité d\'obtenir un nombre supérieur ou égal à 5 est :',
        qcm: RB.qcm(o(s, '', 'c'), [
          { html: F(2, 6), val: 'f2', why: 'Le dé est truqué : on ne peut pas utiliser « 2 cas sur 6 » (cas d\'un dé équilibré).' },
          o(x, 'C\'est seulement la probabilité d\'obtenir 5 : « supérieur ou égal à 5 » signifie 5 <b>ou</b> 6.', 'x'),
          o(rnd(x * y, 4), 'On <b>additionne</b> les probabilités de deux événements incompatibles (5 ou 6), on ne les multiplie pas.', 'xy'),
          { html: F(1, 6), val: 'f1', why: 'Le dé est truqué : on ne peut pas utiliser 1/6 (cas d\'un dé équilibré).' },
          o(y, 'C\'est seulement la probabilité d\'obtenir 6 : « supérieur ou égal à 5 » signifie 5 <b>ou</b> 6.', 'y')
        ]),
        steps: ['« Supérieur ou égal à 5 » signifie obtenir 5 ou 6.', 'Ces deux événements sont incompatibles : on additionne leurs probabilités.', 'P = P(5) + P(6) = ' + N(x) + ' + ' + N(y) + ' = ' + N(s) + '.'],
        pitfalls: ['Avec un dé truqué, on utilise les probabilités données, pas 1/6.', '« ou » entre deux événements incompatibles : on additionne.']
      };
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
