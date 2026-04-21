import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { Todo } from "./api";
import { fetchTodosForDate } from "./api";

export function useInitialTodos(scheduledDateKey: string): {
  items: Todo[];
  setItems: Dispatch<SetStateAction<Todo[]>>;
  loading: boolean;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
} {
  const [items, setItems] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTodosForDate(scheduledDateKey);
        if (!cancelled) setItems(data);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "load failed");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return function cleanup() {
      cancelled = true;
    };
  }, [scheduledDateKey]);

  return { items, setItems, loading, error, setError };
}
