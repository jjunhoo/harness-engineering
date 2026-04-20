import { useEffect, useMemo, useState } from "react";
import type { Todo } from "./api";
import { createTodo, deleteTodo, fetchTodos, updateTodo } from "./api";

export function App() {
  const [items, setItems] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const sorted = useMemo(
    () => [...items].sort((a, b) => a.id - b.id),
    [items],
  );

  async function reload() {
    setError(null);
    const data = await fetchTodos();
    setItems(data);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        await reload();
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "load failed");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ maxWidth: 560, margin: "2rem auto", fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: "1.5rem" }}>Todo (Harness 샘플)</h1>
      <p style={{ color: "#555", fontSize: "0.9rem" }}>
        백엔드: Spring Boot · UI: React (Vite 프록시 <code>/api</code>)
      </p>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const t = title.trim();
          if (!t) return;
          setError(null);
          try {
            const created = await createTodo(t);
            setTitle("");
            setItems((prev) => [...prev, created]);
          } catch (err) {
            setError(err instanceof Error ? err.message : "create failed");
          }
        }}
        style={{ display: "flex", gap: 8, marginBottom: 16 }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="새 할 일"
          style={{ flex: 1, padding: "0.5rem 0.6rem" }}
        />
        <button type="submit" disabled={!title.trim()}>
          추가
        </button>
      </form>

      {loading && <p>불러오는 중…</p>}
      {error && (
        <p style={{ color: "crimson", whiteSpace: "pre-wrap" }} role="alert">
          {error}
        </p>
      )}

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {sorted.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={async () => {
                setError(null);
                try {
                  const next = await updateTodo(todo.id, {
                    completed: !todo.completed,
                  });
                  setItems((prev) => prev.map((x) => (x.id === next.id ? next : x)));
                } catch (err) {
                  setError(err instanceof Error ? err.message : "update failed");
                }
              }}
            />
            <span
              style={{
                flex: 1,
                textDecoration: todo.completed ? "line-through" : "none",
                color: todo.completed ? "#888" : "#111",
              }}
            >
              {todo.title}
            </span>
            <button
              type="button"
              onClick={async () => {
                setError(null);
                try {
                  await deleteTodo(todo.id);
                  setItems((prev) => prev.filter((x) => x.id !== todo.id));
                } catch (err) {
                  setError(err instanceof Error ? err.message : "delete failed");
                }
              }}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
