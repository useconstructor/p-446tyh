import { db } from "@/lib/db";

export async function GET(req: Request) {
  const projectId = new URL(req.url).searchParams.get("projectId");
  if (!projectId) return Response.json([]);
  const { rows } = await db.execute({ sql: "SELECT * FROM tasks WHERE project_id=? ORDER BY id DESC", args: [projectId] });
  return Response.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.title?.trim() || !body.project_id) return Response.json({ error: "Title and project are required" }, { status: 400 });
  const result = await db.execute({ sql: "INSERT INTO tasks (project_id,title,description,priority,status,assignee) VALUES (?,?,?,?,?,?)", args: [body.project_id, body.title.trim(), body.description?.trim() ?? "", body.priority ?? "medium", body.status ?? "todo", body.assignee?.trim() ?? ""] });
  const { rows } = await db.execute({ sql: "SELECT * FROM tasks WHERE id=?", args: [result.lastInsertRowid!] });
  return Response.json(rows[0], { status: 201 });
}
