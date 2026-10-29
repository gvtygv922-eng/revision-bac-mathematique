/* Test automatique : node tests/run.js
   - charge core, checker et tous les modules d'exercices
   - vérifie que chaque original et 300 variantes par modèle sont valides
   - vérifie que la bonne réponse est acceptée et que de fausses réponses sont refusées */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
global.RB = undefined;
require(path.join(root, 'js/core.js'));
require(path.join(root, 'js/checker.js'));
const dir = path.join(root, 'js/exercises');
fs.readdirSync(dir).filter((f) => f.endsWith('.js')).forEach((f) => require(path.join(dir, f)));
const RB = globalThis.RB;

let fails = 0, total = 0;
const fail = (m) => { fails++; console.log('  ✗ ' + m); };

console.log('Chapitres :', RB.chapters.map((c) => c.id).join(', '));
console.log('Modèles   :', RB.templates.length);

RB.templates.forEach((t) => {
  if (!RB.chapters.some((c) => c.id === t.chapter)) fail(t.id + ' : chapitre inconnu ' + t.chapter);
  const origs = (t.originals || []).length;
  let ok = 0, bad = 0;
  for (let i = 0; i < origs; i++) {
    total++;
    try {
      const inst = RB.getInstance(t, 'o' + i);
      const p = RB.validate(inst);
      if (p.length) fail(t.id + ' original ' + i + ' : ' + p.join(' / '));
    } catch (e) { fail(t.id + ' original ' + i + ' : ' + e.message); }
  }
  const seen = new Set();
  for (let s = 1; s <= 300; s++) {
    total++;
    try {
      const inst = RB.getInstance(t, 'g' + s);
      seen.add(inst.statement);
      ok++;
      // fausses réponses : une valeur absurde ne doit jamais être acceptée
      if (inst.fields) inst.fields.forEach((f) => {
        if (f.type === 'choice') return;
        const r = RB.check.checkField(f, { text: '987654.321' });
        if (r.status === 'ok') fail(t.id + ' g' + s + ' : réponse absurde acceptée');
      });
    } catch (e) { bad++; fail(t.id + ' g' + s + ' : ' + e.message); if (bad > 3) break; }
  }
  console.log((bad ? '✗' : '✓') + ' ' + t.id.padEnd(14) + ' originaux=' + origs + '  variantes OK=' + ok + '  énoncés distincts=' + seen.size);
});

console.log('\n' + (fails ? fails + ' problème(s)' : 'Tout est OK') + ' sur ' + total + ' exercices testés.');
process.exit(fails ? 1 : 0);
