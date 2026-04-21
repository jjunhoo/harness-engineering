export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  scheduledDate: string;
};

const base = "";

export async function fetchTodosForDate(scheduledDate: string): Promise<Todo[]> {
  const q = new URLSearchParams({ date: scheduledDate });
  const r = await fetch(`${base}/api/todos?${q}`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function fetchTodosBetween(from: string, to: string): Promise<Todo[]> {
  const q = new URLSearchParams({ from, to });
  const r = await fetch(`${base}/api/todos?${q}`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function createTodo(title: string, scheduledDate: string): Promise<Todo> {
  const r = await fetch(`${base}/api/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, scheduledDate }),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function updateTodo(
  id: number,
  patch: { title?: string; completed?: boolean; scheduledDate?: string },
): Promise<Todo> {
  const r = await fetch(`${base}/api/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function deleteTodo(id: number): Promise<void> {
  const r = await fetch(`${base}/api/todos/${id}`, { method: "DELETE" });
  if (!r.ok && r.status !== 404) throw new Error(await r.text());
}
