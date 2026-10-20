import { getStore } from "@netlify/blobs";
import { apply, empty } from "../../public/reducer.mjs";

export const config = { path: "/api/g/:id" };

const json = (o, status = 200) =>
  new Response(JSON.stringify(o), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

export default async (req, context) => {
  const id = context.params.id;
  if (!/^[a-z0-9]{6,20}$/.test(id)) return json({ error: "Link inválido" }, 400);
  const store = getStore("grupos");
  const cur = (await store.get(id, { type: "json" })) || empty();

  if (req.method === "GET") return json(cur);
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  const raw = await req.text();
  if (raw.length > 100_000) return json({ error: "Pedido demasiado grande" }, 413);
  try {
    const next = apply(cur, JSON.parse(raw));
    await store.setJSON(id, next);
    return json(next);
  } catch (e) {
    return json({ error: e.message || "Error" }, 400);
  }
};
