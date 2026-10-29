/* ============================================================
   app.js — interface : accueil, exercice, progression
   ============================================================ */
(function (G) {
  'use strict';
  const RB = G.RB, S = RB.store, D = G.document;
  const app = D.getElementById('app');
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const DIFF = { 1: 'Facile', 2: 'Moyen', 3: 'Difficile' };
  const KIND = { original: ['Exercice original', 'orig'], free: ['Exercice généré', 'gen'], replace: ['Exercice de remplacement (généré)', 'gen'], retest: ['On reprend l\'exercice raté', 'retest'] };
  let view = 'home', exState = null, justFinished = false;

  const chapterTitle = (id) => (RB.chapters.find((c) => c.id === id) || {}).title || id;
  function go(v) { view = v; D.querySelectorAll('.navbtn').forEach((b) => b.classList.toggle('on', b.dataset.go === v || (v === 'ex' && b.dataset.go === 'home'))); render(); G.scrollTo(0, 0); }
  D.querySelectorAll('.navbtn').forEach((b) => b.addEventListener('click', () => go(b.dataset.go)));
  D.getElementById('brand').addEventListener('click', (e) => { e.preventDefault(); go('home'); });

  function render() {
    if (view === 'home') return renderHome();
    if (view === 'progress') return renderProgress();
    if (view === 'ex') return renderExercise();
  }

  /* ================= ACCUEIL ================= */
  function renderHome() {
    const st = S.settings(), cur = S.current();
    let h = '<section class="hero"><h1>Entraîne-toi pour le bac</h1><p>Choisis un chapitre et une difficulté, puis réponds un exercice à la fois. Si tu te trompes, tu vois la méthode, tu fais 3 exercices du même type, puis l\'exercice raté revient pour vérifier que tu as compris.</p></section>';
    h += '<div class="chapters">';
    const all = S.chapterStats('all');
    h += chapCard('all', '🎯', 'Tous les chapitres', 'Mélange de tout', all, st.chapter === 'all');
    RB.chapters.forEach((c) => { h += chapCard(c.id, c.icon, c.title, c.desc, S.chapterStats(c.id), st.chapter === c.id); });
    h += '</div>';
    h += '<div class="card"><div class="settings"><label>Difficulté<select id="diff"><option value="all">Toutes</option>' +
      [1, 2, 3].map((d) => '<option value="' + d + '"' + (String(st.difficulty) === String(d) ? ' selected' : '') + '>' + DIFF[d] + '</option>').join('') +
      '</select></label><div class="grow"></div>';
    const n = S.eligible().length;
    h += '<button class="btn primary" id="start"' + (n ? '' : ' disabled') + '>' + (cur ? 'Continuer' : 'Commencer') + ' →</button>';
    h += '<button class="btn" id="restart" title="Remet à zéro les exercices originaux et les exercices à revoir de cette sélection">Recommencer la série</button></div>';
    h += '<p class="small-txt" style="margin:10px 0 0">' + (n ? n + ' type(s) d\'exercice dans cette sélection.' : 'Aucun exercice pour cette combinaison : change la difficulté.') +
      (S.isMemoryOnly() ? ' ⚠ Ton navigateur bloque l\'enregistrement : la progression sera perdue en fermant la page.' : '') + '</p></div>';
    app.innerHTML = h;
    app.querySelectorAll('.chap').forEach((b) => b.addEventListener('click', () => { S.setSettings({ chapter: b.dataset.id }); S.setCurrent(null); renderHome(); }));
    D.getElementById('diff').addEventListener('change', (e) => { S.setSettings({ difficulty: e.target.value }); S.setCurrent(null); renderHome(); });
    D.getElementById('start').addEventListener('click', () => { exState = null; go('ex'); });
    D.getElementById('restart').addEventListener('click', () => {
      if (G.confirm('Recommencer la série ? Les exercices originaux de cette sélection seront reproposés et la liste « à revoir » vidée. Tes statistiques sont conservées.')) { S.restartSeries(); renderHome(); }
    });
  }
  function chapCard(id, icon, title, desc, cs, sel) {
    const pct = cs.origTotal ? Math.round((100 * cs.origOk) / cs.origTotal) : 0;
    return '<button class="chap' + (sel ? ' sel' : '') + '" data-id="' + id + '"><span class="ic">' + icon + '</span><b>' + esc(title) + '</b><span class="d">' + esc(desc) + '</span>' +
      '<span class="small-txt">' + (cs.n ? cs.ok + ' réussi(s) / ' + cs.n + ' · ' + cs.rate + ' %' : 'Pas encore commencé') + '</span>' +
      '<span class="meter" title="Exercices originaux réussis"><i style="width:' + pct + '%"></i></span><span class="small-txt">Originaux réussis : ' + cs.origOk + '/' + cs.origTotal + '</span></button>';
  }

  /* ================= EXERCICE ================= */
  function loadCurrent() {
    let cur = S.current();
    const okTpl = cur && RB.getTemplate(cur.tplId) && S.eligible().some((t) => t.id === cur.tplId);
    if (!okTpl) { cur = S.next(); if (cur) S.setCurrent(cur); }
    return cur;
  }
  function renderExercise() {
    const cur = loadCurrent();
    if (!cur) { app.innerHTML = '<div class="card"><p>Aucun exercice disponible pour cette sélection.</p><button class="btn primary" id="back">Retour</button></div>'; D.getElementById('back').addEventListener('click', () => go('home')); return; }
    let inst, tpl = RB.getTemplate(cur.tplId);
    try { inst = RB.getInstance(tpl, cur.ref); } catch (e) { S.setCurrent(null); if (!exState || exState.retries++ < 5) { exState = { retries: (exState ? exState.retries : 0) }; return renderExercise(); } app.innerHTML = '<div class="card"><p class="bad">Erreur : ' + esc(e.message) + '</p></div>'; return; }
    exState = { cur: cur, inst: inst, tpl: tpl, answered: false, retries: 0 };
    const pend = S.pendingInScope();
    let h = '<div class="sessionbar"><span>' + esc(chapterTitle(tpl.chapter)) + ' · ' + esc(tpl.theme) + '</span><span class="queue">' +
      (pend.length ? '🔁 À revoir : ' + pend.length + (pend[0].left > 0 ? ' (retour dans ' + pend[0].left + ' exercice' + (pend[0].left > 1 ? 's' : '') + ')' : ' (maintenant)') : '') + '</span></div>';
    h += '<article class="card"><div class="exhead"><span class="tag ' + KIND[cur.kind][1] + '">' + KIND[cur.kind][0] + '</span>';
    if (inst.isOriginal && inst.source) h += '<span class="tag orig">' + esc(inst.source) + '</span>';
    h += '<span class="tag">' + DIFF[tpl.difficulty] + '</span></div>';
    if (inst.isOriginal && inst.note) h += '<div class="notice">ℹ️ ' + inst.note + '</div>';
    h += '<div class="stmt">' + inst.statement + '</div>';
    if (inst.figure) h += '<div class="figure">' + inst.figure + '</div>';
    h += '<form id="form" autocomplete="off" novalidate>' + answerArea(inst) + '<div class="actions"><button type="submit" class="btn primary" id="verify">Vérifier ma réponse</button><button type="button" class="btn" id="idk">Je ne sais pas</button></div></form>';
    h += '<div id="feedback"></div></article>';
    app.innerHTML = h;
    D.getElementById('form').addEventListener('submit', (e) => { e.preventDefault(); verify(false); });
    D.getElementById('idk').addEventListener('click', () => verify(true));
    app.querySelectorAll('.opt input').forEach((r) => r.addEventListener('change', () => app.querySelectorAll('.opt').forEach((o) => o.classList.toggle('picked', o.querySelector('input').checked))));
    const first = app.querySelector('input[type=text]'); if (first) first.focus();
  }

  function answerArea(inst) {
    if (inst.qcm) {
      const opts = RB.rng(Math.floor(Math.random() * 1e9)).shuffle(inst.qcm.options.map((o, i) => ({ o: o, i: i })));
      exState.order = opts.map((x) => x.i);
      return '<div class="choices" role="radiogroup">' + opts.map((x, k) => '<label class="opt"><input type="radio" name="qcm" value="' + x.i + '"><span>' + x.o.html + '</span></label>').join('') + '</div>';
    }
    return '<div class="fields">' + inst.fields.map((f, i) => {
      if (f.type === 'choice') return '<div class="field" data-i="' + i + '"><div class="choices inline" role="radiogroup">' + f.choices.map((c) => '<label class="opt"><input type="radio" name="f' + i + '" value="' + esc(c.value) + '"><span>' + c.label + '</span></label>').join('') + '</div></div>';
      return '<div class="field" data-i="' + i + '"><label for="f' + i + '">' + (f.label || '') + '</label><input type="text" id="f' + i + '" name="f' + i + '" inputmode="text" spellcheck="false" placeholder="' + esc(f.placeholder || '') + '">' +
        (f.allowNone ? '<label class="none"><input type="checkbox" name="none' + i + '"> Pas factorisable</label>' : '') + '</div>';
    }).join('') + '</div>';
  }

  function readRaw(i, f) {
    if (f.type === 'choice') { const c = app.querySelector('input[name=f' + i + ']:checked'); return { text: c ? c.value : '' }; }
    const t = app.querySelector('#f' + i).value;
    const n = app.querySelector('input[name=none' + i + ']');
    return { text: t, none: !!(n && n.checked) };
  }

  function verify(giveUp) {
    if (!exState || exState.answered) return;
    const inst = exState.inst, fb = D.getElementById('feedback');
    let ok = false, details = [], notes = [], chosenWhy = '';
    if (inst.qcm) {
      const c = app.querySelector('input[name=qcm]:checked');
      if (!c && !giveUp) { fb.innerHTML = '<div class="msg">Choisis une proposition avant de vérifier.</div>'; return; }
      const idx = c ? +c.value : -1;
      ok = !giveUp && idx >= 0 && inst.qcm.options[idx].correct;
      if (idx >= 0 && !ok) chosenWhy = inst.qcm.options[idx].why || '';
      app.querySelectorAll('.opt').forEach((o) => {
        const i = +o.querySelector('input').value;
        o.classList.remove('picked');
        if (inst.qcm.options[i].correct) o.classList.add('right'); else if (i === idx) o.classList.add('wrong');
      });
    } else {
      const res = inst.fields.map((f, i) => RB.check.checkField(f, readRaw(i, f)));
      if (!giveUp) {
        const bad = res.map((r, i) => (r.status === 'format' ? r.msg : null)).filter(Boolean);
        if (bad.length) { fb.innerHTML = bad.map((m) => '<div class="msg">' + esc(m) + '</div>').join(''); return; }
      }
      ok = !giveUp && res.every((r) => r.status === 'ok');
      res.forEach((r, i) => {
        const el = app.querySelector('.field[data-i="' + i + '"]');
        if (!giveUp && el) el.classList.add(r.status === 'ok' ? 'ok' : 'ko');
        if (r.note) notes.push(r.note);
        if (!giveUp && r.status === 'ko' && r.msg) details.push(r.msg);
      });
    }
    exState.answered = true;
    app.querySelectorAll('input').forEach((x) => { x.disabled = true; });
    D.getElementById('verify').style.display = 'none'; D.getElementById('idk').style.display = 'none';
    S.record(exState.cur, ok);
    fb.innerHTML = feedbackHTML(inst, ok, giveUp, details, notes, chosenWhy);
    D.getElementById('next').addEventListener('click', () => { S.setCurrent(null); exState = null; renderExercise(); G.scrollTo(0, 0); });
    D.getElementById('next').focus();
  }

  function expectedHTML(inst) {
    if (inst.qcm) return inst.qcm.options.filter((o) => o.correct).map((o) => o.html).join('');
    return inst.fields.map((f) => (f.label ? f.label + ' ' : '') + '<b>' + (f.show || esc(f.answer)) + '</b>').join('<br>');
  }
  function feedbackHTML(inst, ok, giveUp, details, notes, why) {
    const cur = exState.cur;
    let h = '';
    if (ok) {
      h += '<div class="result ok"><h3>✔ Bravo, c\'est juste !</h3>' + notes.map((n) => '<p>' + n + '</p>').join('') +
        (cur.kind === 'retest' ? '<p>Tu as réussi l\'exercice qui t\'avait posé problème : il sort de ta liste « à revoir ». 🎉</p>' : '') + '</div>';
      h += '<details class="expl"><summary>Revoir la méthode</summary>' + stepsHTML(inst, false) + '</details>';
    } else {
      h += '<div class="result ko"><h3>' + (giveUp ? 'Voici la correction' : '✘ Ce n\'est pas ça') + '</h3><p>Réponse attendue :<br>' + expectedHTML(inst) + '</p>';
      if (why) h += '<p><span class="bad">Erreur probable :</span> ' + why + '</p>';
      details.forEach((d) => { h += '<p><span class="bad">Erreur probable :</span> ' + esc(d) + '</p>'; });
      h += '</div><div class="expl">' + stepsHTML(inst, true) + '</div>';
      const p = S.pendingInScope().find((x) => x.tplId === cur.tplId);
      h += '<p class="small-txt">' + (cur.kind === 'retest' ? 'On refait un cycle : 3 exercices du même type, puis celui-ci revient.' :
        cur.kind === 'replace' ? '' : 'Je te propose 3 exercices du même type, puis cet exercice reviendra pour vérifier que c\'est acquis.') + (p && p.left === 0 ? '' : '') + '</p>';
    }
    h += '<div class="actions"><button class="btn primary" id="next">Exercice suivant →</button></div>';
    return h;
  }
  function stepsHTML(inst, withPit) {
    let h = '<h3>Méthode pas à pas</h3><ol>' + inst.steps.map((s) => '<li>' + s + '</li>').join('') + '</ol>';
    if (withPit && inst.pitfalls && inst.pitfalls.length) h += '<div class="box"><b>Erreurs fréquentes</b><ul>' + inst.pitfalls.map((s) => '<li>' + s + '</li>').join('') + '</ul></div>';
    return h;
  }

  /* ================= PROGRESSION ================= */
  function renderProgress() {
    const t = S.totals(), d = S.data();
    let h = '<h1>Ma progression</h1><div class="stats">' +
      '<div class="stat"><b>' + t.n + '</b><span>exercices faits</span></div><div class="stat"><b class="good">' + t.ok + '</b><span>réussis</span></div>' +
      '<div class="stat"><b class="bad">' + t.ko + '</b><span>erreurs</span></div><div class="stat"><b>' + (t.rate === null ? '–' : t.rate + ' %') + '</b><span>taux de réussite</span></div></div>';
    const weak = RB.templates.filter((x) => { const s = S.templateStats(x.id); return S.isPending(x.id) || (s.ko > 0 && s.ok / (s.ok + s.ko) < 0.7); });
    h += '<div class="card"><h2>À retravailler</h2>';
    h += weak.length ? '<ul>' + weak.map((x) => { const s = S.templateStats(x.id); return '<li><b>' + esc(x.title) + '</b> <span class="muted">(' + esc(chapterTitle(x.chapter)) + ') — ' + s.ok + ' réussi(s), ' + s.ko + ' erreur(s)' + (S.isPending(x.id) ? ' · <span class="pill ko">en cours de révision</span>' : '') + '</span></li>'; }).join('') + '</ul>' : '<p class="muted">Rien à signaler pour l\'instant.</p>';
    h += '</div><div class="card"><h2>Par chapitre</h2><table class="prog"><tr><th>Chapitre</th><th>Réussis</th><th>Erreurs</th><th>Taux</th><th>Originaux</th></tr>';
    RB.chapters.forEach((c) => { const s = S.chapterStats(c.id); h += '<tr><td>' + c.icon + ' ' + esc(c.title) + '</td><td>' + s.ok + '</td><td>' + s.ko + '</td><td>' + (s.rate === null ? '–' : '<span class="pill ' + (s.rate >= 75 ? 'ok' : s.rate >= 50 ? 'mid' : 'ko') + '">' + s.rate + ' %</span>') + '</td><td>' + s.origOk + '/' + s.origTotal + '</td></tr>'; });
    h += '</table></div>';
    h += '<div class="card"><h2>Derniers exercices</h2><div class="hist">' + (d.history.slice(-40).map((x) => '<i class="' + (x.ok ? '' : 'ko') + '" title="' + esc(x.tplId) + '"></i>').join('') || '<span class="muted">Aucun exercice pour l\'instant.</span>') + '</div></div>';
    h += '<div class="card"><h2>Sauvegarde</h2><p class="small-txt">La progression vit dans ce navigateur. Pour la garder ou la changer d\'appareil, exporte-la dans un fichier.</p><div class="row">' +
      '<button class="btn small" id="exp">Exporter</button><label class="btn small" for="imp">Importer</label><input type="file" id="imp" accept=".json" hidden><button class="btn small danger" id="wipe">Tout effacer</button></div></div>';
    app.innerHTML = h;
    D.getElementById('exp').addEventListener('click', () => {
      const a = D.createElement('a'); a.href = URL.createObjectURL(new Blob([S.exportJSON()], { type: 'application/json' })); a.download = 'progression-bac.json'; a.click();
    });
    D.getElementById('imp').addEventListener('change', (e) => {
      const f = e.target.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = () => { try { S.importJSON(r.result); renderProgress(); } catch (err) { G.alert('Import impossible : ' + err.message); } };
      r.readAsText(f);
    });
    D.getElementById('wipe').addEventListener('click', () => { if (G.confirm('Effacer toute ta progression ? C\'est définitif.')) { S.resetAll(); renderProgress(); } });
  }

  go('home');
  G.RB_app = { go: go };
})(window);
