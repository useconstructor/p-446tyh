import { db } from "@/lib/db";

async function setup() {
  await db.execute(`CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, color TEXT NOT NULL DEFAULT '#0EA5E9', archived INTEGER NOT NULL DEFAULT 0, created_at TEXT DEFAULT (datetime('now')))`);
  await db.execute(`CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, project_id INTEGER NOT NULL, title TEXT NOT NULL, description TEXT, priority TEXT NOT NULL DEFAULT 'medium', status TEXT NOT NULL DEFAULT 'todo', assignee TEXT, created_at TEXT DEFAULT (datetime('now')), FOREIGN KEY(project_id) REFERENCES projects(id))`);
  const count = await db.execute("SELECT COUNT(*) AS count FROM projects");
  if (Number(count.rows[0].count) === 0) {
    await db.execute({ sql: "INSERT INTO projects (name, color) VALUES (?, ?)", args: ["Website launch", "#0EA5E9"] });
    const project = await db.execute("SELECT id FROM projects ORDER BY id DESC LIMIT 1");
    const id = Number(project.rows[0].id);
    const samples = [
      ["Finalize homepage copy", "Review the new positioning with the team.", "high", "todo", "AC"],
      ["Prepare launch checklist", "Collect owners and dates for launch day.", "medium", "todo", "MR"],
      ["Build analytics dashboard", "Connect the key conversion events.", "high", "in-progress", "SK"],
      ["QA mobile layouts", "Check the core flows on small screens.", "low", "in-progress", "AC"],
      ["Approve visual direction", "Final design review completed.", "medium", "done", "MR"],
    ];
    for (const task of samples) await db.execute({ sql: "INSERT INTO tasks (project_id,title,description,priority,status,assignee) VALUES (?,?,?,?,?,?)", args: [id, ...task] });
  }
}

export async function GET() {
  await setup();
  const { rows } = await db.execute("SELECT * FROM projects WHERE archived=0 ORDER BY created_at ASC");
  return Response.json(rows);
}

export async function POST(req: Request) {
  await setup();
  const { name, color = "#0EA5E9" } = await req.json();
  if (!name?.trim()) return Response.json({ error: "Project name is required" }, { status: 400 });
  const result = await db.execute({ sql: "INSERT INTO projects (name,color) VALUES (?,?)", args: [name.trim(), color] });
  const { rows } = await db.execute({ sql: "SELECT * FROM projects WHERE id=?", args: [result.lastInsertRowid!] });
  return Response.json(rows[0], { status: 201 });
}
