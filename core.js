/* ============================================================
   core.js — outils communs : hasard, fractions, mise en forme,
   graphiques SVG, constructeur de QCM, génération d'exercices
   ============================================================ */
(function (G) {
  'use strict';
  const RB = (G.RB = G.RB || {});
  RB.templates = RB.templates || [];

  RB.chapters = [
    { id: 'calcul',    title: 'Calcul numérique',        icon: '🧮', desc: 'Fractions, puissances, retrouver un total' },
    { id: 'pct',       title: 'Pourcentages',            icon: '％', desc: 'Coefficient multiplicateur, évolutions successives' },
    { id: 'algebre',   title: 'Algèbre',                 icon: '✖️', desc: 'Développer, équations, tableaux de signes' },
    { id: 'fonctions', title: 'Fonctions & graphiques',  icon: '📈', desc: 'Droites, lecture graphique' },
    { id: 'suites',    title: 'Suites',                  icon: '🔢', desc: 'Termes explicites et par récurrence' },
    { id: 'second',    title: 'Second degré',            icon: '📐', desc: 'Forme canonique, factorisation, équations, paraboles' },
    { id: 'proba',     title: 'Probabilités',            icon: '🎲', desc: 'Conditionnelles, arbres, tableaux' },
    { id: 'stats',     title: 'Statistiques',            icon: '📊', desc: 'Médiane' }
  ];

  RB.register = function (t) { RB.templates.push(t); };

  /* ---------- Hasard reproductible (mulberry32) ---------- */
  RB.rng = function (seed) {
    let s = (seed >>> 0) || 1;
    const f = function () {
      s = (s + 0x6D2B79F5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    f.int = (a, b) => a + Math.floor(f() * (b - a + 1));
    f.pick = (arr) => arr[Math.floor(f() * arr.length)];
    f.chance = (p) => f() < p;
    f.shuffle = (arr) => {
      const r = arr.slice();
      for (let i = r.length - 1; i > 0; i--) {
        const j = Math.floor(f() * (i + 1));
        [r[i], r[j]] = [r[j], r[i]];
      }
      return r;
    };
    return f;
  };
  RB.hash = function (str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  };

  /* ---------- Nombres rationnels exacts ---------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a; }
  function Q(n, d) {
    if (d === undefined) d = 1;
    if (d === 0) throw new Error('division par zéro');
    if (d < 0) { n = -n; d = -d; }
    const g = gcd(n, d) || 1;
    n = n / g; d = d / g;
    if (!Number.isSafeInteger(n) || !Number.isSafeInteger(d)) throw new Error('trop grand');
    return { n: n, d: d };
  }
  const Qo = {
    add: (a, b) => Q(a.n * b.d + b.n * a.d, a.d * b.d),
    sub: (a, b) => Q(a.n * b.d - b.n * a.d, a.d * b.d),
    mul: (a, b) => Q(a.n * b.n, a.d * b.d),
    div: (a, b) => Q(a.n * b.d, a.d * b.n),
    neg: (a) => Q(-a.n, a.d),
    inv: (a) => Q(a.d, a.n),
    eq: (a, b) => a.n === b.n && a.d === b.d,
    num: (a) => a.n / a.d,
    cmp: (a, b) => Math.sign(a.n * b.d - b.n * a.d),
    pow: (a, e) => { let r = Q(1); const base = e < 0 ? Qo.inv(a) : a; for (let i = 0; i < Math.abs(e); i++) r = Qo.mul(r, base); return r; },
    isInt: (a) => a.d === 1,
    str: (a) => (a.d === 1 ? String(a.n) : a.n + '/' + a.d)
  };
  RB.Q = Q; RB.Qo = Qo; RB.gcd = gcd;
  /** décimal JS (ex. 0.925) -> rationnel exact */
  RB.Qd = function (x) {
    const s = x.toFixed(9).replace(/0+$/, '').replace(/\.$/, '');
    const i = s.indexOf('.');
    if (i < 0) return Q(+s);
    const dec = s.length - i - 1;
    return Q(Math.round(+s * Math.pow(10, dec)), Math.pow(10, dec));
  };

  /* ---------- Mise en forme (HTML) ---------- */
  RB.num = function (x) {
    let s = String(+Number(x).toFixed(9));
    if (s.indexOf('e') >= 0) s = Number(x).toFixed(0);
    return s.replace('.', ',').replace(/^-/, '−');
  };
  RB.frac = (n, d) => '<span class="frac"><span class="num">' + n + '</span><span class="den">' + d + '</span></span>';
  RB.Qhtml = (q) => (q.d === 1 ? RB.num(q.n) : (q.n < 0 ? '−' : '') + RB.frac(Math.abs(q.n), q.d));
  RB.Qtxt = Qo.str;
  RB.sup = (b, e) => b + '<sup>' + e + '</sup>';
  RB.sub = (b, e) => b + '<sub>' + e + '</sub>';
  RB.bar = (s) => '<span class="ov">' + s + '</span>';
  RB.pct = (x) => RB.num(x) + '&nbsp;%';
  RB.sgn = (x) => (x < 0 ? '−' : '+');
  RB.paren = (x) => (x < 0 ? '(' + RB.num(x) + ')' : RB.num(x));
  /** P_B(A) en HTML, avec barres possibles : RB.pc('M','D',true) -> P_M(D̄) */
  RB.pc = (given, ev, evBar, givenBar) => 'P<sub>' + (givenBar ? RB.bar(given) : given) + '</sub>(' + (evBar ? RB.bar(ev) : ev) + ')';
  RB.pinter = (a, aBar, b, bBar) => 'P(' + (aBar ? RB.bar(a) : a) + ' ∩ ' + (bBar ? RB.bar(b) : b) + ')';

  /** coefficients [c0,c1,c2,…] -> HTML */
  RB.polyHTML = function (c, v) {
    v = v || 'x';
    let out = '';
    for (let k = c.length - 1; k >= 0; k--) {
      const a = c[k];
      if (!a) continue;
      const abs = Math.abs(a);
      let body;
      if (k === 0) body = RB.num(abs);
      else body = (abs === 1 ? '' : RB.num(abs)) + v + (k > 1 ? '<sup>' + k + '</sup>' : '');
      if (!out) out = (a < 0 ? '−' : '') + body;
      else out += (a < 0 ? ' − ' : ' + ') + body;
    }
    return out || '0';
  };
  /** même chose en texte brut (utilisé comme réponse attendue : x^2) */
  RB.polyTxt = function (c, v) {
    v = v || 'x';
    let out = '';
    for (let k = c.length - 1; k >= 0; k--) {
      const a = c[k];
      if (!a) continue;
      const abs = Math.abs(a);
      let body;
      if (k === 0) body = String(abs);
      else body = (abs === 1 ? '' : String(abs)) + v + (k > 1 ? '^' + k : '');
      if (!out) out = (a < 0 ? '-' : '') + body;
      else out += (a < 0 ? '-' : '+') + body;
    }
    return out || '0';
  };
  /** a(x−α)²+β en HTML / texte */
  RB.canonHTML = function (a, al, be) {
    const inner = al === 0 ? 'x' : 'x ' + (al > 0 ? '−' : '+') + ' ' + RB.num(Math.abs(al));
    const co = a === 1 ? '' : a === -1 ? '−' : RB.num(a);
    let s = co + '(' + inner + ')<sup>2</sup>';
    if (be) s += ' ' + (be > 0 ? '+' : '−') + ' ' + RB.num(Math.abs(be));
    return s;
  };
  RB.canonTxt = function (a, al, be) {
    const inner = al === 0 ? 'x' : 'x' + (al > 0 ? '-' : '+') + Math.abs(al);
    const co = a === 1 ? '' : a === -1 ? '-' : String(a);
    return co + '(' + inner + ')^2' + (be ? (be > 0 ? '+' : '-') + Math.abs(be) : '');
  };
  /** (x−r) en HTML / texte */
  RB.lin = (r) => (r === 0 ? 'x' : 'x ' + (r > 0 ? '−' : '+') + ' ' + Math.abs(r));
  RB.linTxt = (r) => (r === 0 ? 'x' : 'x' + (r > 0 ? '-' : '+') + Math.abs(r));

  RB.table = function (rows, opt) {
    opt = opt || {};
    let h = '<table class="tbl' + (opt.cls ? ' ' + opt.cls : '') + '">';
    rows.forEach((row, i) => {
      h += '<tr>';
      row.forEach((cell, j) => {
        const th = (opt.header && i === 0) || (opt.firstCol && j === 0);
        h += th ? '<th>' + cell + '</th>' : '<td>' + cell + '</td>';
      });
      h += '</tr>';
    });
    return h + '</table>';
  };

  /* ---------- Constructeur de QCM ---------- */
  /** correct, wrongs : {html, why?, val?} — élimine les doublons (par val puis par html) */
  RB.qcm = function (correct, wrongs, nWrong) {
    nWrong = nWrong || 3;
    const vals = new Set(), htmls = new Set();
    const out = [];
    function add(o, isC) {
      if (htmls.has(o.html)) return;
      if (o.val !== undefined && vals.has(o.val)) return;
      htmls.add(o.html); if (o.val !== undefined) vals.add(o.val);
      out.push(Object.assign({}, o, { correct: isC }));
    }
    add(correct, true);
    for (const w of wrongs) { if (out.length >= 1 + nWrong) break; add(w, false); }
    if (out.length < 1 + nWrong) throw new Error('pas assez de propositions distinctes');
    return { options: out };
  };

  /* ---------- Graphiques SVG ---------- */
  let plotId = 0;
  RB.niceStep = function (range, target) {
    const raw = range / (target || 6);
    const p = Math.pow(10, Math.floor(Math.log10(raw)));
    const m = raw / p;
    return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p;
  };
  RB.plot = function (o) {
    const W = o.width || 460, H = o.height || 330, m = { l: 14, r: 22, t: 18, b: 14 };
    const x0 = o.xmin, x1 = o.xmax, y0 = o.ymin, y1 = o.ymax;
    const xs = o.xstep || 1, ys = o.ystep || 1;
    const lx = o.xlabelStep || xs, ly = o.ylabelStep || ys;
    const sx = (x) => m.l + ((x - x0) / (x1 - x0)) * (W - m.l - m.r);
    const sy = (y) => H - m.b - ((y - y0) / (y1 - y0)) * (H - m.t - m.b);
    const id = 'clip' + (++plotId);
    const axX = sy(Math.min(Math.max(0, y0), y1));
    const axY = sx(Math.min(Math.max(0, x0), x1));
    const f1 = (v) => (Math.round(v * 100) / 100);
    let s = '<svg class="plot" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + (o.label || 'Graphique') + '">';
    s += '<defs><clipPath id="' + id + '"><rect x="' + m.l + '" y="' + m.t + '" width="' + (W - m.l - m.r) + '" height="' + (H - m.t - m.b) + '"/></clipPath></defs>';
    s += '<rect x="0" y="0" width="' + W + '" height="' + H + '" class="plot-bg"/>';
    // grille
    for (let x = Math.ceil(x0 / xs - 1e-9) * xs; x <= x1 + 1e-9; x += xs)
      s += '<line x1="' + f1(sx(x)) + '" y1="' + m.t + '" x2="' + f1(sx(x)) + '" y2="' + (H - m.b) + '" class="grid"/>';
    for (let y = Math.ceil(y0 / ys - 1e-9) * ys; y <= y1 + 1e-9; y += ys)
      s += '<line x1="' + m.l + '" y1="' + f1(sy(y)) + '" x2="' + (W - m.r) + '" y2="' + f1(sy(y)) + '" class="grid"/>';
    // lignes horizontales / verticales supplémentaires
    (o.hlines || []).forEach((h) => {
      s += '<line x1="' + m.l + '" y1="' + f1(sy(h.y)) + '" x2="' + (W - m.r) + '" y2="' + f1(sy(h.y)) + '" stroke="' + (h.color || '#2563eb') + '" stroke-width="2" stroke-dasharray="' + (h.dash || '6 4') + '"/>';
      if (h.label) s += '<text x="' + (W - m.r - 4) + '" y="' + (f1(sy(h.y)) - 5) + '" text-anchor="end" class="tick" fill="' + (h.color || '#2563eb') + '">' + h.label + '</text>';
    });
    // axes
    s += '<line x1="' + m.l + '" y1="' + f1(axX) + '" x2="' + (W - m.r + 8) + '" y2="' + f1(axX) + '" class="axis"/>';
    s += '<line x1="' + f1(axY) + '" y1="' + (H - m.b) + '" x2="' + f1(axY) + '" y2="' + (m.t - 8) + '" class="axis"/>';
    s += '<polygon points="' + (W - m.r + 10) + ',' + f1(axX) + ' ' + (W - m.r + 2) + ',' + f1(axX - 4) + ' ' + (W - m.r + 2) + ',' + f1(axX + 4) + '" class="arrow"/>';
    s += '<polygon points="' + f1(axY) + ',' + (m.t - 10) + ' ' + f1(axY - 4) + ',' + (m.t - 2) + ' ' + f1(axY + 4) + ',' + (m.t - 2) + '" class="arrow"/>';
    // graduations
    for (let x = Math.ceil(x0 / lx - 1e-9) * lx; x <= x1 + 1e-9; x += lx) {
      if (Math.abs(x) < 1e-9) continue;
      s += '<line x1="' + f1(sx(x)) + '" y1="' + f1(axX - 4) + '" x2="' + f1(sx(x)) + '" y2="' + f1(axX + 4) + '" class="axis"/>';
      s += '<text x="' + f1(sx(x)) + '" y="' + f1(axX + 17) + '" text-anchor="middle" class="tick">' + RB.num(x) + '</text>';
    }
    for (let y = Math.ceil(y0 / ly - 1e-9) * ly; y <= y1 + 1e-9; y += ly) {
      if (Math.abs(y) < 1e-9) continue;
      s += '<line x1="' + f1(axY - 4) + '" y1="' + f1(sy(y)) + '" x2="' + f1(axY + 4) + '" y2="' + f1(sy(y)) + '" class="axis"/>';
      s += '<text x="' + f1(axY - 8) + '" y="' + f1(sy(y) + 4) + '" text-anchor="end" class="tick">' + RB.num(y) + '</text>';
    }
    if (y0 <= 0 && y1 >= 0 && x0 <= 0 && x1 >= 0) s += '<text x="' + f1(axY - 8) + '" y="' + f1(axX + 17) + '" text-anchor="end" class="tick">0</text>';
    // courbes
    (o.curves || []).forEach((c) => {
      let d = '', pen = false;
      const N = 400;
      for (let i = 0; i <= N; i++) {
        const x = x0 + ((x1 - x0) * i) / N;
        const y = c.f(x);
        if (!isFinite(y) || y > y1 + (y1 - y0) || y < y0 - (y1 - y0)) { pen = false; continue; }
        d += (pen ? 'L' : 'M') + f1(sx(x)) + ' ' + f1(sy(y)) + ' ';
        pen = true;
      }
      s += '<path d="' + d + '" fill="none" stroke="' + (c.color || '#d62828') + '" stroke-width="' + (c.width || 3) + '" stroke-linejoin="round" clip-path="url(#' + id + ')"/>';
    });
    // points
    (o.points || []).forEach((p) => {
      const cx = f1(sx(p.x)), cy = f1(sy(p.y)), r = p.r || 4;
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + (p.color || '#111') + '"/>';
      if (p.label) s += '<text x="' + (cx + 8) + '" y="' + (cy - 8) + '" class="tick">' + p.label + '</text>';
    });
    return s + '</svg>';
  };

  /** arbre pondéré à 2 niveaux.
      nodes = [{t:'A',bar:false,p:'0,2',kids:[{t:'B',bar:false,p:'0,6'},{t:'B',bar:true,p:'0,4'}]}, {...}] */
  RB.tree = function (nodes) {
    const W = 460, H = 280;
    const xr = 36, x1 = 190, x2 = 380;
    const nKids = nodes.reduce((a, n) => a + n.kids.length, 0);
    const slot = H / (nKids + 1);
    let k = 0, s = '<svg class="plot tree" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Arbre de probabilités">';
    s += '<rect width="' + W + '" height="' + H + '" class="plot-bg"/>';
    const yr = H / 2;
    function lbl(x, y, n, anchor) {
      let o = '<text x="' + x + '" y="' + y + '" class="treelbl" text-anchor="' + (anchor || 'start') + '">' + n.t + '</text>';
      if (n.bar) { const w = 9; const bx = anchor === 'middle' ? x - w / 2 : x; o += '<line x1="' + (bx + 1) + '" y1="' + (y - 15) + '" x2="' + (bx + w + 1) + '" y2="' + (y - 15) + '" class="treebar"/>'; }
      return o;
    }
    nodes.forEach((n) => {
      const ys = [];
      n.kids.forEach(() => { k++; ys.push(slot * k); });
      n.y = (ys[0] + ys[ys.length - 1]) / 2;
      n.kids.forEach((kid, i) => {
        kid.y = ys[i];
        s += '<line x1="' + x1 + '" y1="' + n.y + '" x2="' + x2 + '" y2="' + kid.y + '" class="branch"/>';
        const mx = (x1 + x2) / 2, my = (n.y + kid.y) / 2;
        s += '<text x="' + mx + '" y="' + (my - 7) + '" class="treep" text-anchor="middle">' + kid.p + '</text>';
        s += lbl(x2 + 10, kid.y + 6, kid);
      });
      s += '<line x1="' + xr + '" y1="' + yr + '" x2="' + x1 + '" y2="' + n.y + '" class="branch"/>';
      s += '<text x="' + ((xr + x1) / 2) + '" y="' + ((yr + n.y) / 2 - 7) + '" class="treep" text-anchor="middle">' + n.p + '</text>';
      s += lbl(x1 + 10, n.y + 6, n);
    });
    return s + '</svg>';
  };

  /** remplace le trait d'union ASCII devant un nombre par le vrai signe moins « − » (hors balises HTML) */
  RB.fixMinus = (html) => String(html).replace(/(<[^>]*>)|([^<]+)/g, (m, tag, txt) => (tag ? tag : txt.replace(/(^|[\s(=;:,|])-(?=\d)/g, '$1−')));

  /* ---------- Génération d'une instance d'exercice ---------- */
  RB.getTemplate = (id) => RB.templates.find((t) => t.id === id);

  RB.getInstance = function (tpl, ref) {
    function fin(inst) {
      const o = Object.assign({}, inst, { tplId: tpl.id, ref: ref, isOriginal: ref[0] === 'o' });
      ['statement', 'note'].forEach((k) => { if (o[k]) o[k] = RB.fixMinus(o[k]); });
      ['steps', 'pitfalls'].forEach((k) => { if (o[k]) o[k] = o[k].map(RB.fixMinus); });
      if (o.qcm) o.qcm = { options: o.qcm.options.map((x) => Object.assign({}, x, { html: RB.fixMinus(x.html), why: x.why ? RB.fixMinus(x.why) : x.why })) };
      if (o.fields) o.fields = o.fields.map((f) => Object.assign({}, f, f.show ? { show: RB.fixMinus(f.show) } : {}));
      return o;
    }
    if (ref[0] === 'o') {
      const o = tpl.originals[+ref.slice(1)];
      if (!o) throw new Error('original introuvable ' + ref);
      return fin(typeof o === 'function' ? o() : o);
    }
    const seed = +ref.slice(1);
    let lastErr;
    for (let a = 0; a < 120; a++) {
      try {
        const inst = tpl.generate(RB.rng(seed + a * 7919));
        const probs = RB.validate ? RB.validate(inst) : [];
        if (!probs.length) return fin(inst);
        lastErr = new Error(probs.join(' / '));
      } catch (e) { lastErr = e; }
    }
    throw new Error('Génération impossible pour ' + tpl.id + ' : ' + (lastErr && lastErr.message));
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = RB;
})(typeof window !== 'undefined' ? window : globalThis);
