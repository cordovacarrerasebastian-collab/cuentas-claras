// Lógica compartida: la usan el navegador (modo local) y el servidor (modo grupo).
export const empty = () => ({ people: [], exp: [], next: 1, rev: 0 });
const clean = (s, n = 40) => String(s ?? "").trim().slice(0, n);
const MAX_PEOPLE = 30, MAX_EXP = 500;

function sanitize(st) {
  const out = empty();
  for (const p of (st?.people || []).slice(0, MAX_PEOPLE)) {
    const n = clean(p.n); if (!n) continue;
    const id = out.next++; out.people.push({ id, n }); p._new = id;
  }
  const map = {}; (st?.people || []).forEach(p => { if (p._new) map[p.id] = p._new; });
  for (const e of (st?.exp || []).slice(0, MAX_EXP)) {
    const a = Math.round(Number(e.a) * 100) / 100, p = map[e.p];
    const w = (e.w || []).map(i => map[i]).filter(Boolean);
    if (!(a > 0 && a < 1e12) || !p || !w.length) continue;
    out.exp.push({ id: out.next++, d: clean(e.d, 60) || "Gasto", a, p, w });
  }
  return out;
}

export function apply(S, op) {
  S = structuredClone(S);
  const has = id => S.people.some(p => p.id === id);
  switch (op?.t) {
    case "init":
      if (S.rev !== 0 || S.people.length) throw new Error("El grupo ya existe");
      S = sanitize(op.state); break;
    case "addPerson": {
      const n = clean(op.n);
      if (!n) throw new Error("Escribí un nombre");
      if (S.people.length >= MAX_PEOPLE) throw new Error("Máximo 30 personas");
      S.people.push({ id: S.next++, n }); break;
    }
    case "removePerson": {
      const id = Number(op.id);
      S.people = S.people.filter(p => p.id !== id);
      S.exp = S.exp.filter(e => e.p !== id).map(e => ({ ...e, w: e.w.filter(i => i !== id) })).filter(e => e.w.length);
      break;
    }
    case "addExpense": {
      const a = Math.round(Number(op.a) * 100) / 100, p = Number(op.p);
      const w = [...new Set((op.w || []).map(Number))].filter(has);
      if (!(a > 0 && a < 1e12)) throw new Error("Ingresá un monto mayor a cero");
      if (!has(p)) throw new Error("Elegí quién pagó");
      if (!w.length) throw new Error("Elegí entre quiénes se divide");
      if (S.exp.length >= MAX_EXP) throw new Error("Máximo 500 gastos");
      S.exp.push({ id: S.next++, d: clean(op.d, 60) || "Gasto", a, p, w }); break;
    }
    case "removeExpense":
      S.exp = S.exp.filter(e => e.id !== Number(op.id)); break;
    case "reset":
      S = empty(); S.rev = 1; break;
    default: throw new Error("Operación inválida");
  }
  S.rev = (S.rev || 0) + 1;
  return S;
}
