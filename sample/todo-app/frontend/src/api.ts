export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
};

const base = "";

export async function fetchTodos(): Promise<Todo[]> {
  const r = await fetch(`${base}/api/todos`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function createTodo(title: string): Promise<Todo> {
  const r = await fetch(`${base}/api/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function updateTodo(
  id: number,
  patch: { title?: string; completed?: boolean },
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
