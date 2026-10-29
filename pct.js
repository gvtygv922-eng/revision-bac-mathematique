/* Chapitre : Pourcentages */
(function (G) {
  'use strict';
  const RB = G.RB, F = RB.frac, N = RB.num;
  const AN = 'Amérique du Nord – Spécialité · 1A-A01-1';
  const TECH = 'Centres Étrangers – Techno · 1A-A01-5';
  const SPE = 'Centres Étrangers – Spécialité · 1A-A01-3';
  const rnd = (x, d) => Math.round(x * Math.pow(10, d)) / Math.pow(10, d);
  const P = (x) => N(x) + '&nbsp;%';

  /* ---------- 1. Coefficient multiplicateur -> évolution ---------- */
  RB.register({
    id: 'pct-cm', chapter: 'pct', theme: 'Coefficient multiplicateur', difficulty: 1,
    title: 'Interpréter un coefficient multiplicateur',
    originals: [{
      source: AN + ' (question 3)',
      statement: 'Le prix d\'un article est multiplié par 0,925. Cela signifie que le prix de cet article a :',
      qcm: {
        options: [
          { html: 'baissé de 7,5&nbsp;%', correct: true },
          { html: 'augmenté de 7,5&nbsp;%', why: 'Le coefficient 0,925 est inférieur à 1 : le prix <b>baisse</b>.' },
          { html: 'augmenté de 92,5&nbsp;%', why: '0,925 = 92,5&nbsp;% du prix initial, ce n\'est pas le taux d\'évolution. Le taux est 0,925 − 1.' },
          { html: 'baissé de 0,75&nbsp;%', why: 'Attention à la virgule : 1 − 0,925 = 0,075 soit 7,5&nbsp;% (et non 0,75&nbsp;%).' }
        ]
      },
      steps: ['Le coefficient multiplicateur est CM = 0,925.', 'Le taux d\'évolution est t = CM − 1 = 0,925 − 1 = −0,075.', 'Comme 0,925 < 1, c\'est une <b>baisse</b> ; −0,075 = −7,5&nbsp;%.'],
      pitfalls: ['CM &lt; 1 : baisse. CM &gt; 1 : hausse.', 'Taux = CM − 1, puis on multiplie par 100.']
    }],
    generate(r) {
      const cm = r.pick([0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.88, 0.9, 0.925, 0.95, 0.975, 1.02, 1.04, 1.05, 1.075, 1.08, 1.1, 1.15, 1.2, 1.25, 1.3, 1.5]);
      const th = r.pick([['Le prix d\'un article', 'le prix de cet article'], ['Le loyer d\'un appartement', 'le loyer de cet appartement'], ['Le nombre d\'abonnés d\'une chaîne', 'le nombre d\'abonnés de cette chaîne'], ['Le prix d\'un abonnement', 'le prix de cet abonnement']]);
      const up = cm > 1;
      const t = rnd(Math.abs(cm - 1) * 100, 2);
      const same = up ? 'augmenté' : 'baissé', opp = up ? 'baissé' : 'augmenté';
      const k = rnd(cm * 100, 2), small = rnd(t / 10, 3);
      return {
        statement: th[0] + ' est multiplié par ' + N(cm) + '. Cela signifie que ' + th[1] + ' a :',
        qcm: RB.qcm({ html: same + ' de ' + P(t), val: 'c' }, [
          { html: opp + ' de ' + P(t), val: 'w1', why: 'Regarde le coefficient : ' + N(cm) + (up ? ' &gt; 1 donc c\'est une <b>hausse</b>.' : ' &lt; 1 donc c\'est une <b>baisse</b>.') },
          { html: 'augmenté de ' + P(k), val: 'w2', why: N(cm) + ' = ' + P(k) + ' de la valeur initiale : ce n\'est pas le taux d\'évolution. Le taux est CM − 1.' },
          { html: same + ' de ' + P(small), val: 'w3', why: 'Attention à la virgule : |' + N(cm) + ' − 1| = ' + N(rnd(Math.abs(cm - 1), 4)) + ' soit ' + P(t) + '.' },
          { html: opp + ' de ' + P(k), val: 'w4', why: 'Le taux n\'est pas CM × 100.' }
        ]),
        steps: ['Le coefficient multiplicateur est CM = ' + N(cm) + '.', 'Le taux d\'évolution est t = CM − 1 = ' + N(cm) + ' − 1 = ' + N(rnd(cm - 1, 4)) + '.',
          'Comme ' + N(cm) + (up ? ' > 1' : ' < 1') + ', c\'est une <b>' + (up ? 'hausse' : 'baisse') + '</b> de ' + P(t) + '.'],
        pitfalls: ['CM &lt; 1 : baisse. CM &gt; 1 : hausse.', 'Taux = CM − 1, puis on multiplie par 100.']
      };
    }
  });

  /* ---------- 2. Retrouver le total ---------- */
  RB.register({
    id: 'pct-total', chapter: 'pct', theme: 'Retrouver une valeur initiale', difficulty: 2,
    title: 'Retrouver le total à partir d\'un pourcentage',
    originals: [{
      source: AN + ' (question 2)',
      statement: 'Le volume de la partie visible d\'un iceberg est d\'environ 5&nbsp;% de son volume total.<br>Si la partie visible d\'un iceberg est de 200&nbsp;km<sup>3</sup>, quel sera le volume total de cet iceberg ?',
      qcm: {
        options: [
          { html: '4000&nbsp;km<sup>3</sup>', correct: true },
          { html: '3800&nbsp;km<sup>3</sup>', why: 'Tu as calculé 4000 − 200 : c\'est le volume <b>caché</b>, pas le volume total.' },
          { html: '190&nbsp;km<sup>3</sup>', why: 'Tu as calculé 200 × 0,95 (on enlève 5&nbsp;%). Mais 200 <b>est déjà</b> les 5&nbsp;% du total.' },
          { html: '10&nbsp;km<sup>3</sup>', why: 'Tu as calculé 5&nbsp;% de 200. Or 200 est la partie, pas le total.' }
        ]
      },
      steps: ['Soit V le volume total. 200 représente 5&nbsp;% de V : ' + F(5, 100) + ' × V = 200.', 'Donc V = 200 ÷ ' + F(5, 100) + ' = 200 × ' + F(100, 5) + ' = 4000.',
        'Vérification : 5&nbsp;% de 4000 = 200 ✔.'],
      pitfalls: ['La valeur donnée (200) est la <b>partie</b> : il faut diviser par le pourcentage, pas le calculer.']
    }],
    generate(r) {
      const p = r.pick([4, 5, 8, 10, 12, 15, 20, 25, 30, 40, 60]);
      const t = r.int(2, 60);
      const T = 100 * t, part = p * t;
      const c = r.pick([
        { s: 'Le volume de la partie visible d\'un iceberg est d\'environ ' + P(p) + ' de son volume total.<br>Si la partie visible d\'un iceberg est de ' + part + '&nbsp;km<sup>3</sup>, quel sera le volume total de cet iceberg ?', u: '&nbsp;km<sup>3</sup>' },
        { s: 'Dans une entreprise, ' + part + ' salariés télétravaillent, ce qui représente ' + P(p) + ' de l\'effectif.<br>Quel est l\'effectif total de l\'entreprise ?', u: ' salariés' },
        { s: 'Léa a déjà économisé ' + part + '&nbsp;€, ce qui représente ' + P(p) + ' du prix d\'un vélo.<br>Quel est le prix du vélo ?', u: '&nbsp;€' },
        { s: 'Dans un lycée, ' + part + ' élèves sont internes, soit ' + P(p) + ' des élèves du lycée.<br>Combien d\'élèves compte le lycée ?', u: ' élèves' }
      ]);
      const o = (v, why) => ({ html: N(v) + c.u, val: String(v), why });
      return {
        statement: c.s,
        qcm: RB.qcm(o(T), [
          o(T - part, 'Tu as calculé ' + T + ' − ' + part + ' : c\'est ce qui <b>reste</b>, pas le total.'),
          o(rnd(part * (1 - p / 100), 2), 'Tu as enlevé ' + P(p) + ' à ' + part + '. Mais ' + part + ' <b>est déjà</b> les ' + P(p) + ' du total.'),
          o(rnd(part * p / 100, 2), 'Tu as calculé ' + P(p) + ' de ' + part + '. Or ' + part + ' est la partie, pas le total.'),
          o(part + p, 'On n\'additionne pas un pourcentage à une quantité.')
        ]),
        steps: ['Soit T le total. ' + part + ' représente ' + P(p) + ' de T : ' + F(p, 100) + ' × T = ' + part + '.',
          'Donc T = ' + part + ' ÷ ' + F(p, 100) + ' = ' + part + ' × ' + F(100, p) + ' = ' + T + '.', 'Vérification : ' + P(p) + ' de ' + T + ' = ' + part + ' ✔.'],
        pitfalls: ['La valeur donnée est la <b>partie</b> : il faut diviser par le pourcentage (ou résoudre p&nbsp;% × T = partie).']
      };
    }
  });


  /* ---------- 2 bis. Calculer un pourcentage (proportion) ---------- */
  RB.register({
    id: 'pct-part', chapter: 'pct', theme: 'Calculer une proportion', difficulty: 1,
    title: 'Calculer le pourcentage que représente une partie',
    originals: [{
      source: TECH + ' (question 8)',
      statement: 'Dans le lycée Alpha, il y a 500 élèves.<br>280 lycéens pratiquent un sport.<br>Le pourcentage d\'élèves pratiquant un sport dans ce lycée est égal à :',
      qcm: {
        options: [
          { html: '39&nbsp;%', why: 'Ce n\'est pas 280 ÷ 500. Calcule d\'abord la proportion : 280 ÷ 500 = 0,56.' },
          { html: '28&nbsp;%', why: 'Tu as peut-être divisé 280 par 10. La proportion est 280 ÷ <b>500</b>.' },
          { html: '56&nbsp;%', correct: true },
          { html: '61&nbsp;%', why: 'Ce pourcentage ne correspond pas à 280 ÷ 500 (= 0,56).' }
        ]
      },
      steps: ['La proportion est ' + F('partie', 'total') + ' = ' + F(280, 500) + ' = 0,56.', 'On la convertit en pourcentage : 0,56 × 100 = 56&nbsp;%.', 'Vérification : 56&nbsp;% de 500 = 0,56 × 500 = 280 ✔.'],
      pitfalls: ['Pourcentage = partie ÷ total × 100 (et non total ÷ partie).', 'Ne pas oublier de multiplier par 100 à la fin : 0,56 = 56&nbsp;%.']
    }],
    generate(r) {
      const T = r.pick([200, 250, 400, 500, 600, 800, 1000, 1200, 1500, 2000]);
      let p, part;
      for (let k = 0; k < 60; k++) { p = r.int(5, 95); part = (p * T) / 100; if (Number.isInteger(part) && p % 5 === 0 || (Number.isInteger(part) && r.chance(0.3))) break; }
      if (!Number.isInteger(part)) throw new Error('partie non entière');
      const c = r.pick([
        { s: 'Dans le lycée Beta, il y a ' + T + ' élèves.<br>' + part + ' lycéens pratiquent un sport.<br>Le pourcentage d\'élèves pratiquant un sport dans ce lycée est égal à :' },
        { s: 'Une entreprise compte ' + T + ' salariés.<br>' + part + ' d\'entre eux viennent au travail à vélo.<br>Le pourcentage de salariés venant à vélo est égal à :' },
        { s: 'Sur ' + T + ' clients interrogés, ' + part + ' se déclarent satisfaits.<br>Le pourcentage de clients satisfaits est égal à :' },
        { s: 'Une bibliothèque possède ' + T + ' livres.<br>' + part + ' de ces livres sont des romans.<br>Le pourcentage de romans dans la bibliothèque est égal à :' }
      ]);
      const o = (v, why) => ({ html: N(v) + '&nbsp;%', val: String(v), why });
      return {
        statement: c.s,
        qcm: RB.qcm(o(p), [
          o(100 - p, 'Tu as calculé le pourcentage de la partie <b>restante</b> (100 − ' + p + '), pas celui de la partie demandée.'),
          o(rnd(p / 10, 2), 'Attention à la conversion : ' + N(rnd(part / T, 4)) + ' = ' + P(p) + ' (on multiplie par 100).'),
          o(rnd((100 * T) / (T + part), 1), 'Le total est ' + T + ' (et non ' + (T + part) + ').'),
          o(rnd(part / T, 4), 'Tu as oublié de multiplier par 100 : ' + N(rnd(part / T, 4)) + ' = ' + P(p) + '.')
        ]),
        steps: ['La proportion est ' + F('partie', 'total') + ' = ' + F(part, T) + ' = ' + N(rnd(part / T, 4)) + '.', 'On la convertit en pourcentage : ' + N(rnd(part / T, 4)) + ' × 100 = ' + P(p) + '.', 'Vérification : ' + P(p) + ' de ' + T + ' = ' + N(rnd(p / 100, 4)) + ' × ' + T + ' = ' + part + ' ✔.'],
        pitfalls: ['Pourcentage = partie ÷ total × 100 (et non total ÷ partie).', 'Ne pas oublier de multiplier par 100 à la fin.']
      };
    }
  });

  /* ---------- 3. Écrire un calcul d'évolution ---------- */
  RB.register({
    id: 'pct-price', chapter: 'pct', theme: 'Appliquer un pourcentage d\'évolution', difficulty: 1,
    title: 'Écrire le calcul d\'un nouveau prix',
    originals: [{
      source: TECH + ' (question 3)',
      statement: 'Un téléphone coûte 870 euros. Le prix baisse de 40&nbsp;%.<br>Son nouveau prix est :',
      qcm: {
        options: [
          { html: '870 × (1 + ' + F(40, 100) + ')', why: 'Le signe + correspond à une <b>hausse</b>. Ici le prix baisse : 1 − ' + F(40, 100) + '.' },
          { html: '870 − ' + F(40, 100), why: 'Tu as retiré ' + F(40, 100) + ' = 0,4 € seulement : il faut retirer 40&nbsp;% <b>de 870</b>.' },
          { html: '870 × (1 − ' + F(40, 100) + ')', correct: true },
          { html: '870 × ' + F(40, 100), why: 'C\'est le montant de la baisse (40&nbsp;% de 870), pas le nouveau prix.' }
        ]
      },
      steps: ['Une baisse de 40&nbsp;% a pour coefficient multiplicateur CM = 1 − ' + F(40, 100) + ' = 0,6.', 'Nouveau prix = 870 × (1 − ' + F(40, 100) + ') = 870 × 0,6 = 522 €.'],
      pitfalls: ['Hausse de t&nbsp;% : × (1 + t/100). Baisse de t&nbsp;% : × (1 − t/100).']
    }],
    generate(r) {
      const price = r.pick([120, 250, 340, 480, 560, 870, 920, 1200, 45, 64, 75, 150]);
      const t = r.pick([5, 8, 10, 12, 15, 20, 25, 30, 35, 40, 50]);
      const up = r.chance(0.4);
      const obj = r.pick(['Un téléphone', 'Un ordinateur', 'Une paire de baskets', 'Un vélo']);
      const verb = up ? 'augmente' : 'baisse';
      const fr = F(t, 100), sg = up ? '+' : '−', og = up ? '−' : '+';
      const cm = rnd(1 + (up ? 1 : -1) * t / 100, 4), newP = rnd(price * cm, 2);
      return {
        statement: obj + ' coûte ' + price + ' euros. Le prix ' + verb + ' de ' + P(t) + '.<br>Son nouveau prix est :',
        qcm: RB.qcm({ html: price + ' × (1 ' + sg + ' ' + fr + ')', val: 'c' }, [
          { html: price + ' × (1 ' + og + ' ' + fr + ')', val: 'w1', why: 'Mauvais signe : pour une ' + (up ? 'hausse' : 'baisse') + ', on utilise 1 ' + sg + ' ' + fr + '.' },
          { html: price + ' ' + sg + ' ' + fr, val: 'w2', why: 'Tu ' + (up ? 'ajoutes' : 'retires') + ' seulement ' + N(t / 100) + ' : il faut ' + (up ? 'ajouter' : 'retirer') + ' ' + P(t) + ' <b>de ' + price + '</b>.' },
          { html: price + ' × ' + fr, val: 'w3', why: 'C\'est le montant de ' + (up ? 'la hausse' : 'la baisse') + ', pas le nouveau prix.' }
        ]),
        steps: ['Une ' + (up ? 'hausse' : 'baisse') + ' de ' + P(t) + ' a pour coefficient multiplicateur CM = 1 ' + sg + ' ' + fr + ' = ' + N(cm) + '.', 'Nouveau prix = ' + price + ' × (1 ' + sg + ' ' + fr + ') = ' + price + ' × ' + N(cm) + ' = ' + N(newP) + ' €.'],
        pitfalls: ['Hausse de t&nbsp;% : × (1 + t/100). Baisse de t&nbsp;% : × (1 − t/100).']
      };
    }
  });

  /* ---------- 4. Évolutions successives ---------- */
  RB.register({
    id: 'pct-succ', chapter: 'pct', theme: 'Évolutions successives', difficulty: 2,
    title: 'Évolution globale de deux évolutions successives',
    originals: [{
      source: SPE + ' (question 6)',
      statement: 'L\'évolution globale correspondant à une hausse de 60&nbsp;% puis une baisse de 50&nbsp;%, est une baisse de :',
      qcm: {
        options: [
          { html: '30&nbsp;%', why: 'Ce n\'est pas 60 − 50 ni un autre calcul direct : passe par les coefficients multiplicateurs.' },
          { html: '80&nbsp;%', why: '0,8 est le <b>coefficient</b> global, pas le taux : le taux est 0,8 − 1 = −0,2.' },
          { html: '20&nbsp;%', correct: true },
          { html: '10&nbsp;%', why: 'Tu as additionné les taux (+60 − 50 = +10). <b>Les pourcentages successifs ne s\'additionnent pas.</b>' }
        ]
      },
      steps: ['Hausse de 60&nbsp;% : CM<sub>1</sub> = 1 + 0,6 = 1,6.', 'Baisse de 50&nbsp;% : CM<sub>2</sub> = 1 − 0,5 = 0,5.', 'CM global = 1,6 × 0,5 = 0,8.', 'Taux global = 0,8 − 1 = −0,2 : c\'est une baisse de 20&nbsp;%.'],
      pitfalls: ['On <b>multiplie</b> les coefficients multiplicateurs, on n\'additionne pas les taux.']
    }],
    generate(r) {
      const rates = [-50, -40, -30, -25, -20, -10, 10, 20, 25, 30, 40, 50, 60, 80, 100];
      const t1 = r.pick(rates), t2 = r.pick(rates);
      const c1 = rnd(1 + t1 / 100, 4), c2 = rnd(1 + t2 / 100, 4);
      const cm = rnd(c1 * c2, 6), tg = rnd((cm - 1) * 100, 4), sum = t1 + t2;
      if (Math.abs(tg) < 1e-9 || Math.abs(tg - sum) < 1e-9 || Math.abs(Math.abs(tg) - Math.abs(sum)) < 1e-9) throw new Error('trop proche');
      const word = (t) => (t >= 0 ? 'une hausse' : 'une baisse') + ' de ' + P(Math.abs(t));
      const ph = (t) => word(t);
      const o = (t, val, why) => ({ html: word(t), val: val, why: why });
      return {
        statement: 'L\'évolution globale correspondant à ' + ph(t1) + ' puis ' + ph(t2) + ', est :',
        qcm: RB.qcm(o(tg, 'c'), [
          o(sum, 's' + sum, 'Tu as additionné les taux (' + RB.sgn(t1) + Math.abs(t1) + ' ' + RB.sgn(t2) + ' ' + Math.abs(t2) + '). <b>Les pourcentages successifs ne s\'additionnent pas.</b>'),
          o(rnd(cm * 100, 4), 'm', N(cm) + ' est le <b>coefficient</b> global, pas le taux : taux = CM − 1.'),
          o(-tg, 'o', 'Vérifie le signe : le taux global est CM − 1 = ' + N(cm) + ' − 1.'),
          o(-sum, 'os', 'Les pourcentages successifs ne s\'additionnent pas.')
        ]),
        steps: [ph(t1) + ' : CM<sub>1</sub> = 1 ' + (t1 >= 0 ? '+' : '−') + ' ' + N(Math.abs(t1) / 100) + ' = ' + N(c1) + '.',
          ph(t2) + ' : CM<sub>2</sub> = 1 ' + (t2 >= 0 ? '+' : '−') + ' ' + N(Math.abs(t2) / 100) + ' = ' + N(c2) + '.',
          'CM global = ' + N(c1) + ' × ' + N(c2) + ' = ' + N(cm) + '.',
          'Taux global = ' + N(cm) + ' − 1 = ' + N(rnd(cm - 1, 6)) + ' : c\'est ' + word(tg) + '.'],
        pitfalls: ['On <b>multiplie</b> les coefficients multiplicateurs, on n\'additionne pas les taux.']
      };
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
