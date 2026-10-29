/* ============================================================
   store.js — progression (localStorage) et choix de l'exercice suivant
   Règle de répétition : exercice raté -> 3 exercices de remplacement
   du même modèle -> l'exercice raté revient. Raté encore -> nouveau cycle.
   ============================================================ */
(function (G) {
  'use strict';
  const RB = G.RB;
  const KEY = 'bacrev.v1';
  const CYCLE = 3;
  const S = (RB.store = {});

  const blank = () => ({ v: 1, stats: {}, history: [], pending: [], doneOrig: {}, seq: 0, current: null, settings: { chapter: 'all', difficulty: 'all' } });
  let memoryOnly = false;
  function load() {
    try {
      const raw = G.localStorage.getItem(KEY);
      if (!raw) return blank();
      const d = JSON.parse(raw);
      return Object.assign(blank(), d);
    } catch (e) { memoryOnly = true; return blank(); }
  }
  let data = load();
  function save() { try { G.localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { memoryOnly = true; } }
  S.isMemoryOnly = () => memoryOnly;
  S.data = () => data;
  S.save = save;
  S.settings = () => data.settings;
  S.setSettings = (s) => { Object.assign(data.settings, s); save(); };

  /* ---------- filtres ---------- */
  S.eligible = function (settings) {
    settings = settings || data.settings;
    return RB.templates.filter((t) =>
      (settings.chapter === 'all' || t.chapter === settings.chapter) &&
      (settings.difficulty === 'all' || t.difficulty === +settings.difficulty));
  };
  const origKey = (tplId, ref) => tplId + ':' + ref;
  const chapterOrder = (t) => RB.chapters.findIndex((c) => c.id === t.chapter);

  S.pendingInScope = function () {
    const ids = new Set(S.eligible().map((t) => t.id));
    return data.pending.filter((p) => ids.has(p.tplId));
  };

  function freshSeed() { data.seq++; return (Date.now() % 100000) * 100 + data.seq; }

  /** choisit le prochain exercice : {tplId, ref, kind} */
  S.next = function () {
    const tpls = S.eligible();
    if (!tpls.length) return null;
    const pend = S.pendingInScope()[0];
    if (pend) {
      if (pend.left > 0) return { tplId: pend.tplId, ref: 'g' + freshSeed(), kind: 'replace' };
      return { tplId: pend.tplId, ref: pend.ref, kind: 'retest' };
    }
    const ordered = tpls.slice().sort((a, b) => chapterOrder(a) - chapterOrder(b));
    for (const t of ordered) {
      for (let i = 0; i < (t.originals || []).length; i++) {
        const ref = 'o' + i;
        if (!data.doneOrig[origKey(t.id, ref)]) return { tplId: t.id, ref: ref, kind: 'original' };
      }
    }
    // exercices générés : on favorise les modèles jamais vus ou mal réussis
    const last = data.current && data.current.tplId;
    const pool = tpls.length > 1 ? tpls.filter((t) => t.id !== last) : tpls;
    const weights = pool.map((t) => {
      const st = data.stats[t.id] || { ok: 0, ko: 0 };
      const n = st.ok + st.ko;
      return n === 0 ? 3 : 1 + 3 * (st.ko / n);
    });
    let x = Math.random() * weights.reduce((a, b) => a + b, 0), pick = pool[0];
    for (let i = 0; i < pool.length; i++) { x -= weights[i]; if (x <= 0) { pick = pool[i]; break; } }
    return { tplId: pick.id, ref: 'g' + freshSeed(), kind: 'free' };
  };

  S.current = () => data.current;
  S.setCurrent = (c) => { data.current = c; save(); };

  /** enregistre le résultat de l'exercice courant */
  S.record = function (cur, ok) {
    const tpl = RB.getTemplate(cur.tplId);
    const st = (data.stats[cur.tplId] = data.stats[cur.tplId] || { ok: 0, ko: 0 });
    if (ok) st.ok++; else st.ko++;
    data.history.push({ t: Date.now(), tplId: cur.tplId, ch: tpl.chapter, ref: cur.ref, kind: cur.kind, ok: !!ok });
    if (data.history.length > 300) data.history.splice(0, data.history.length - 300);
    if (cur.kind === 'original') data.doneOrig[origKey(cur.tplId, cur.ref)] = ok ? 'ok' : 'ko';
    const idx = data.pending.findIndex((p) => p.tplId === cur.tplId && (cur.kind === 'replace' || p.ref === cur.ref));
    if (cur.kind === 'retest') {
      if (ok) data.pending.splice(idx, 1);
      else if (idx >= 0) data.pending[idx].left = CYCLE;
    } else if (cur.kind === 'replace') {
      if (idx >= 0) data.pending[idx].left = Math.max(0, data.pending[idx].left - 1);
    } else if (!ok) {
      if (!data.pending.some((p) => p.tplId === cur.tplId && p.ref === cur.ref)) data.pending.push({ tplId: cur.tplId, ref: cur.ref, left: CYCLE });
    }
    save();
  };

  /* ---------- statistiques ---------- */
  S.totals = function () {
    let ok = 0, ko = 0;
    Object.keys(data.stats).forEach((k) => { ok += data.stats[k].ok; ko += data.stats[k].ko; });
    return { ok: ok, ko: ko, n: ok + ko, rate: ok + ko ? Math.round((100 * ok) / (ok + ko)) : null };
  };
  S.chapterStats = function (chId) {
    let ok = 0, ko = 0, origTotal = 0, origOk = 0;
    RB.templates.filter((t) => chId === 'all' || t.chapter === chId).forEach((t) => {
      const st = data.stats[t.id] || { ok: 0, ko: 0 };
      ok += st.ok; ko += st.ko;
      (t.originals || []).forEach((_, i) => { origTotal++; if (data.doneOrig[origKey(t.id, 'o' + i)] === 'ok') origOk++; });
    });
    return { ok: ok, ko: ko, n: ok + ko, rate: ok + ko ? Math.round((100 * ok) / (ok + ko)) : null, origTotal: origTotal, origOk: origOk };
  };
  S.templateStats = (id) => data.stats[id] || { ok: 0, ko: 0 };
  S.isPending = (id) => data.pending.some((p) => p.tplId === id);

  /* ---------- remises à zéro ---------- */
  S.restartSeries = function () {
    const ids = new Set(S.eligible().map((t) => t.id));
    Object.keys(data.doneOrig).forEach((k) => { if (ids.has(k.split(':')[0])) delete data.doneOrig[k]; });
    data.pending = data.pending.filter((p) => !ids.has(p.tplId));
    data.current = null;
    save();
  };
  S.resetAll = function () { const s = data.settings; data = blank(); data.settings = s; save(); };
  S.exportJSON = () => JSON.stringify(data);
  S.importJSON = function (txt) {
    const d = JSON.parse(txt);
    if (!d || d.v !== 1 || typeof d.stats !== 'object') throw new Error('fichier non reconnu');
    data = Object.assign(blank(), d); save();
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = S;
})(typeof window !== 'undefined' ? window : globalThis);
