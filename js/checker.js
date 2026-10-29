/* ============================================================
   checker.js — lecture et correction des réponses de l'élève
   Accepte : virgule/point, fractions équivalentes, pourcentages,
   expressions (développées, canoniques, factorisées), ensembles,
   couples de coordonnées.
   ============================================================ */
(function (G) {
  'use strict';
  const RB = (G.RB = G.RB || {});
  const Q = RB.Q, Qo = RB.Qo;

  /* ---------- normalisation ---------- */
  const SUP = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
  function normalize(s) {
    s = String(s).toLowerCase();
    s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) => '^' + Array.from(m).map((c) => SUP[c]).join(''));
    s = s.replace(/[−‒–—]/g, '-')
      .replace(/[×·⋅∙]/g, '*').replace(/÷/g, '/')
      .replace(/[\s   ]/g, '')
      .replace(/[\[{]/g, '(').replace(/[\]}]/g, ')')
      .replace(/(\d),(\d)/g, '$1.$2');
    return s;
  }
  function decQ(lit) {
    const i = lit.indexOf('.');
    if (i < 0) return Q(parseInt(lit, 10));
    const frac = lit.length - i - 1;
    if (frac > 9) throw new Error('trop de décimales');
    return Q(parseInt(lit.replace('.', ''), 10), Math.pow(10, frac));
  }
  function tokenize(s) {
    const t = [];
    let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/[0-9.]/.test(c)) {
        let j = i;
        while (j < s.length && /[0-9.]/.test(s[j])) j++;
        const lit = s.slice(i, j);
        if (!/^(\d+\.?\d*|\.\d+)$/.test(lit)) throw new Error('nombre illisible');
        t.push({ k: 'n', v: lit }); i = j;
      } else if (c === 'x') { t.push({ k: 'x' }); i++; }
      else if ('+-*/^()%'.indexOf(c) >= 0) { t.push({ k: c }); i++; }
      else throw new Error('caractère inconnu : ' + c);
    }
    return t;
  }

  /* ---------- polynômes à coefficients rationnels ---------- */
  const P = {
    trim(a) { while (a.length > 1 && a[a.length - 1].n === 0) a.pop(); return a; },
    add(a, b) { const r = []; for (let i = 0; i < Math.max(a.length, b.length); i++) r.push(Qo.add(a[i] || Q(0), b[i] || Q(0))); return P.trim(r); },
    neg(a) { return a.map(Qo.neg); },
    sub(a, b) { return P.add(a, P.neg(b)); },
    mul(a, b) {
      const r = []; for (let i = 0; i < a.length + b.length - 1; i++) r.push(Q(0));
      for (let i = 0; i < a.length; i++) for (let j = 0; j < b.length; j++) r[i + j] = Qo.add(r[i + j], Qo.mul(a[i], b[j]));
      return P.trim(r);
    },
    isConst(a) { return a.length === 1; },
    pow(a, e) {
      if (e < 0) { if (!P.isConst(a) || a[0].n === 0) throw new Error('puissance négative'); return [Qo.pow(a[0], e)]; }
      if (e > 30 || (!P.isConst(a) && e > 12)) throw new Error('puissance trop grande');
      let r = [Q(1)];
      for (let i = 0; i < e; i++) r = P.mul(r, a);
      return r;
    },
    eq(a, b) { a = P.trim(a.slice()); b = P.trim(b.slice()); if (a.length !== b.length) return false; return a.every((c, i) => Qo.eq(c, b[i])); },
    deg(a) { return P.trim(a.slice()).length - 1; }
  };

  function parsePolyNorm(str, allowPercent) {
    const toks = tokenize(str);
    let p = 0;
    const peek = () => toks[p];
    const eat = (k) => { if (toks[p] && toks[p].k === k) { p++; return true; } return false; };
    function expr() {
      let v = term();
      while (peek() && (peek().k === '+' || peek().k === '-')) {
        const o = toks[p++].k; const r = term();
        v = o === '+' ? P.add(v, r) : P.sub(v, r);
      }
      return v;
    }
    function term() {
      let v = unary();
      for (;;) {
        const t = peek();
        if (!t) break;
        if (t.k === '*') { p++; v = P.mul(v, unary()); }
        else if (t.k === '/') {
          p++; const d = unary();
          if (!P.isConst(d) || d[0].n === 0) throw new Error('division impossible');
          v = P.mul(v, [Qo.inv(d[0])]);
        } else if (t.k === '(' || t.k === 'x') v = P.mul(v, power());
        else break;
      }
      return v;
    }
    function unary() {
      if (eat('-')) return P.neg(unary());
      if (eat('+')) return unary();
      return power();
    }
    function power() {
      let b = atom();
      if (eat('^')) {
        let sign = 1, paren = false;
        if (eat('(')) paren = true;
        if (eat('-')) sign = -1; else eat('+');
        const t = toks[p];
        if (!t || t.k !== 'n' || !/^\d+$/.test(t.v)) throw new Error('exposant illisible');
        p++;
        if (paren && !eat(')')) throw new Error('parenthèse');
        b = P.pow(b, sign * parseInt(t.v, 10));
      }
      return b;
    }
    function atom() {
      const t = toks[p++];
      if (!t) throw new Error('expression incomplète');
      let v;
      if (t.k === 'n') v = [decQ(t.v)];
      else if (t.k === 'x') return [Q(0), Q(1)];
      else if (t.k === '(') { v = expr(); if (!eat(')')) throw new Error('parenthèse manquante'); }
      else throw new Error('symbole inattendu');
      if (peek() && peek().k === '%') {
        if (!allowPercent || !P.isConst(v)) throw new Error('% non attendu');
        p++; v = [Qo.div(v[0], Q(100))];
      }
      return v;
    }
    const v = expr();
    if (p !== toks.length) throw new Error('fin inattendue');
    return v;
  }
  function lastSide(s) { const parts = String(s).split('='); return parts[parts.length - 1]; }

  /** polynôme depuis une chaîne (après avoir retiré "P(x)=" etc.) ; null si illisible */
  function parsePoly(str, allowPercent) {
    try { return parsePolyNorm(normalize(lastSide(str)), allowPercent); } catch (e) { return null; }
  }
  /** nombre rationnel ; null si illisible */
  function parseNumber(str, allowPercent) {
    const p = parsePoly(str, allowPercent);
    if (!p || !P.isConst(p)) return null;
    return p[0];
  }
  function parseSet(str) {
    let s = String(str).trim().toLowerCase().replace(/^\s*s\s*=/, '');
    s = s.replace(/[{}]/g, '').trim();
    if (s === '' && /\{\s*\}/.test(String(str))) return [];
    if (/^(∅|ø|aucune?(\s+solution)?|vide|pas\s+de\s+solution|ensemble\s+vide|0\s*solution)$/.test(s.replace(/\s+/g, ' '))) return [];
    if (!s) return null;
    const parts = s.split(/;|\bet\b|\bou\b|\|/).map((x) => x.trim()).filter((x) => x !== '');
    const out = [];
    for (let part of parts) {
      part = part.replace(/^\s*[a-z]\w*\s*=/, '');
      const q = parseNumber(part);
      if (!q) return null;
      if (!out.some((o) => Qo.eq(o, q))) out.push(q);
    }
    out.sort(Qo.cmp);
    return out;
  }
  function parsePoint(str) {
    let s = String(str).trim().replace(/^[^=(]*=/, '');
    s = s.replace(/[()]/g, '').trim();
    let parts = s.split(/;/);
    if (parts.length !== 2) {
      const c = s.split(',');
      if (c.length === 2) parts = c; else return null;
    }
    const a = parseNumber(parts[0]), b = parseNumber(parts[1]);
    return a && b ? [a, b] : null;
  }

  /* ---------- vérifications de forme ---------- */
  function splitTop(s) {
    const terms = []; let depth = 0, cur = '';
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (ch === '(') depth++; if (ch === ')') depth--;
      if ((ch === '+' || ch === '-') && depth === 0 && cur !== '' && !/[\^*\/]$/.test(cur)) {
        terms.push(cur); cur = ch === '-' ? '-' : '';
      } else cur += ch;
    }
    if (cur !== '') terms.push(cur);
    return terms;
  }
  const NUM = '[\\d.]+(?:\\/[\\d.]+)?';
  const SQ_RE = new RegExp('^[+-]?(?:' + NUM + '\\*?|\\([+-]?' + NUM + '\\)\\*?)?\\(x(?:[+-]' + NUM + ')?\\)\\^2$');
  function isDevRed(s) {
    if (s.indexOf('(') >= 0) return false;
    const terms = splitTop(s);
    const degs = [];
    for (const t of terms) {
      let p; try { p = parsePolyNorm(t, false); } catch (e) { return false; }
      p = P.trim(p);
      const nz = p.filter((c) => c.n !== 0).length;
      if (nz > 1) return false;
      const d = p.length - 1;
      if (degs.indexOf(d) >= 0) return false;
      degs.push(d);
    }
    return true;
  }
  function isCanon(s) {
    const terms = splitTop(s);
    if (terms.length < 1 || terms.length > 2) return false;
    const sq = terms.filter((t) => SQ_RE.test(t));
    if (sq.length !== 1) return false;
    if (terms.length === 2) {
      const other = terms.find((t) => t !== sq[0]) || terms[1];
      let p; try { p = parsePolyNorm(other, false); } catch (e) { return false; }
      if (!P.isConst(p)) return false;
    }
    return true;
  }
  function isFactored(s) {
    if (splitTop(s).length !== 1) return false;
    const groups = (s.match(/\([^()]*x[^()]*\)/g) || []).length;
    const squared = /\([^()]*x[^()]*\)\^2/.test(s);
    return groups >= 2 || squared;
  }

  /* ---------- comparaison par type de champ ---------- */
  function getText(raw) { return raw && typeof raw === 'object' ? raw.text || '' : String(raw == null ? '' : raw); }
  function getNone(raw) { return !!(raw && typeof raw === 'object' && raw.none); }

  /** renvoie {status:'ok'|'ko'|'format', note?, msg?} */
  function compareOne(spec, raw) {
    const text = getText(raw).trim();
    const type = spec.type;
    if (type === 'choice') {
      if (!text) return { status: 'format', msg: 'Choisis une réponse.' };
      return { status: text === spec.answer ? 'ok' : 'ko' };
    }
    if (type === 'factor' && spec.allowNone) {
      if (getNone(raw)) return { status: spec.noneExpected ? 'ok' : 'ko', trap: 'none' };
      if (!text) return { status: 'format', msg: 'Écris la factorisation, ou coche « Pas factorisable ».' };
      if (spec.noneExpected) return { status: 'ko', trap: 'notnone' };
    }
    if (!text) return { status: 'format', msg: 'Remplis ce champ.' };
    if (type === 'number') {
      const u = parseNumber(text, spec.allowPercent !== false);
      if (!u) return { status: 'format', msg: 'Je ne comprends pas ce nombre. Écris par exemple 3/4 ou 0,75.' };
      const a = parseNumber(spec.answer, true);
      if (Qo.eq(u, a)) return { status: 'ok' };
      const isDecimal = /[.,]/.test(text);
      if (isDecimal && spec.decTol && Math.abs(Qo.num(u) - Qo.num(a)) <= spec.decTol + 1e-9) return { status: 'ok', note: 'Arrondi accepté. Valeur exacte : ' + (spec.show || spec.answer) + '.' };
      return { status: 'ko', value: u };
    }
    if (type === 'set') {
      const u = parseSet(text);
      if (!u) return { status: 'format', msg: 'Écris les solutions séparées par un point-virgule, par exemple 2 ; 5 (ou ∅ s\'il n\'y en a pas).' };
      const a = parseSet(spec.answer);
      return { status: u.length === a.length && u.every((q, i) => Qo.eq(q, a[i])) ? 'ok' : 'ko' };
    }
    if (type === 'point') {
      const u = parsePoint(text);
      if (!u) return { status: 'format', msg: 'Écris un couple de coordonnées, par exemple (2 ; −3).' };
      const a = parsePoint(spec.answer);
      return { status: Qo.eq(u[0], a[0]) && Qo.eq(u[1], a[1]) ? 'ok' : 'ko' };
    }
    if (type === 'devred' || type === 'canon' || type === 'factor') {
      const u = parsePoly(text);
      if (!u) return { status: 'format', msg: 'Je ne comprends pas cette expression. Utilise x, ^ pour les puissances (x^2 ou x²), * ou rien pour multiplier.' };
      const a = parsePoly(spec.answer);
      const same = P.eq(u, a);
      const s = normalize(lastSide(text));
      if (!same) return { status: 'ko', trap: 'value' };
      if (type === 'devred' && !isDevRed(s)) return { status: 'ko', trap: 'form', msg: 'Ton expression est bien égale, mais elle n\'est pas sous forme développée et réduite (sans parenthèses, un seul terme par puissance de x).' };
      if (type === 'canon' && !isCanon(s)) return { status: 'ko', trap: 'form', msg: 'Ton expression est bien égale, mais ce n\'est pas la forme canonique a(x − α)² + β : il faut un seul carré (x − α)² suivi d\'une constante.' };
      if (type === 'factor' && !isFactored(s)) return { status: 'ko', trap: 'form', msg: 'Ton expression est bien égale, mais elle n\'est pas factorisée : on attend un produit de facteurs, par exemple a(x − r₁)(x − r₂).' };
      return { status: 'ok' };
    }
    return { status: 'format', msg: 'Type de champ inconnu' };
  }

  /** corrige un champ, y compris les « pièges » connus */
  function checkField(spec, raw) {
    const r = compareOne(spec, raw);
    if (r.status === 'ko' && !r.msg) {
      if (r.trap === 'none') r.msg = 'Ce polynôme est factorisable : calcule Δ (ou cherche des racines évidentes) avant de conclure.';
      else if (r.trap === 'notnone') r.msg = 'Ici Δ < 0 : il n\'y a pas de racine réelle, donc le polynôme n\'est pas factorisable.';
      else (spec.traps || []).some((t) => {
        const c = compareOne(Object.assign({}, spec, { answer: t.answer, decTol: 0, traps: null }), raw);
        if (c.status === 'ok') { r.msg = t.msg; return true; }
        return false;
      });
    }
    return r;
  }
  RB.check = { normalize, parsePoly, parseNumber, parseSet, parsePoint, checkField, compareOne, isDevRed, isCanon, isFactored, P };

  /* ---------- validation d'une instance (utilisée à la génération) ---------- */
  RB.validate = function (inst) {
    const probs = [];
    if (!inst || !inst.statement) probs.push('énoncé manquant');
    if (!inst.steps || !inst.steps.length) probs.push('méthode manquante');
    if (inst.qcm) {
      const o = inst.qcm.options;
      if (o.length < 3) probs.push('moins de 3 propositions');
      if (o.filter((x) => x.correct).length !== 1) probs.push('il doit y avoir exactement 1 bonne réponse');
      if (new Set(o.map((x) => x.html)).size !== o.length) probs.push('propositions identiques');
      if (o.some((x) => /NaN|undefined|Infinity/.test(x.html))) probs.push('proposition invalide');
    } else if (inst.fields) {
      inst.fields.forEach((f, i) => {
        try {
          if (f.type === 'factor' && f.allowNone && f.noneExpected) {
            if (compareOne(f, { text: '', none: true }).status !== 'ok') probs.push('champ ' + i + ' : réponse « non factorisable » refusée');
          } else if (f.type === 'choice') {
            if (!f.choices || !f.choices.some((c) => c.value === f.answer)) probs.push('champ ' + i + ' : choix invalide');
          } else {
            const r = compareOne(f, f.answer);
            if (r.status !== 'ok') probs.push('champ ' + i + ' : la bonne réponse « ' + f.answer + ' » est refusée (' + r.status + ')');
          }
        } catch (e) { probs.push('champ ' + i + ' : ' + e.message); }
      });
    } else probs.push('ni QCM ni champs');
    if (/NaN|undefined|Infinity/.test(inst.statement || '')) probs.push('énoncé invalide');
    return probs;
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = RB;
})(typeof window !== 'undefined' ? window : globalThis);
