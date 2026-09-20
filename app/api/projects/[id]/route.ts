import { db } from "@/lib/db";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { name, archived } = await req.json();
  if (typeof name === "string") await db.execute({ sql: "UPDATE projects SET name=? WHERE id=?", args: [name.trim(), id] });
  if (typeof archived === "boolean") await db.execute({ sql: "UPDATE projects SET archived=? WHERE id=?", args: [archived ? 1 : 0, id] });
  return Response.json({ ok: true });
}
