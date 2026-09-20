import { db } from "@/lib/db";

const allowed = new Set(["title", "description", "priority", "status", "assignee"]);
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const entries = Object.entries(body).filter(([key]) => allowed.has(key));
  if (!entries.length) return Response.json({ error: "No valid fields" }, { status: 400 });
  await db.execute({ sql: `UPDATE tasks SET ${entries.map(([key]) => `${key}=?`).join(",")} WHERE id=?`, args: [...entries.map(([, value]) => String(value ?? "")), id] });
  const { rows } = await db.execute({ sql: "SELECT * FROM tasks WHERE id=?", args: [id] });
  return Response.json(rows[0]);
}
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.execute({ sql: "DELETE FROM tasks WHERE id=?", args: [id] });
  return Response.json({ ok: true });
}
