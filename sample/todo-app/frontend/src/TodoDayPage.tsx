import { type FormEvent, type ChangeEvent, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import type { Todo } from "./api";
import { createTodo, deleteTodo, updateTodo } from "./api";
import "./App.css";
import { dayRouteParam, formatDayHeading, isValidDateKey } from "./calendarMonth";
import { FilterTabBar } from "./FilterTabBar";
import { renderTodoRows } from "./TodoRow";
import {
  countTodos,
  filterTodos,
  sortTodosById,
  tabPanelLabelId,
  todoEmptyHint,
  type TodoFilter,
} from "./todoView";
import { useInitialTodos } from "./useInitialTodos";

export type { TodoFilter } from "./todoView";

export function TodoDayPage() {
  const { date } = useParams<{ date: string }>();
  const dateKey = dayRouteParam(date);

  if (!isValidDateKey(dateKey)) {
    return <Navigate to="/" replace />;
  }

  const { items, setItems, loading, error, setError } = useInitialTodos(dateKey);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState<TodoFilter>("all");

  const sorted = useMemo(() => sortTodosById(items), [items]);
  const counts = useMemo(() => countTodos(items), [items]);
  const filtered = useMemo(() => filterTodos(sorted, filter), [sorted, filter]);
  const emptyMessage = useMemo(
    () => todoEmptyHint(sorted, filtered, filter),
    [sorted, filtered, filter],
  );

  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    setError(null);
    try {
      const created = await createTodo(t, dateKey);
      setTitle("");
      setItems((prev) => [...prev, created]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "create failed");
    }
  }

  async function handleToggle(todo: Todo) {
    setError(null);
    try {
      const next = await updateTodo(todo.id, {
        completed: !todo.completed,
      });
      setItems((prev) => prev.map((x) => (x.id === next.id ? next : x)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "update failed");
    }
  }

  async function handleDelete(todo: Todo) {
    setError(null);
    try {
      await deleteTodo(todo.id);
      setItems((prev) => prev.filter((x) => x.id !== todo.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "delete failed");
    }
  }

  return (
    <div className="app-page">
      <div className="app-card">
        <Link className="cal-back" to="/">
          ← 캘린더
        </Link>
        <header className="app-header">
          <p className="cal-day-title">{formatDayHeading(dateKey)}</p>
          <h1 className="app-title">할 일</h1>
          <p className="app-subtitle">
            Spring Boot API · Vite 프록시 <code>/api</code>
          </p>
        </header>

        <form className="app-form" onSubmit={handleCreate}>
          <input
            className="app-input"
            value={title}
            onChange={handleTitleChange}
            placeholder="무엇을 해야 하나요?"
            aria-label="새 할 일"
          />
          <button className="app-btn-primary" type="submit" disabled={!title.trim()}>
            추가
          </button>
        </form>

        {loading && (
          <p className="app-loading" aria-live="polite">
            불러오는 중…
          </p>
        )}
        {error && (
          <p className="app-alert" role="alert">
            {error}
          </p>
        )}

        <FilterTabBar filter={filter} counts={counts} onFilter={setFilter} />

        <div
          className="app-panel"
          role="tabpanel"
          id="todo-panel"
          aria-labelledby={tabPanelLabelId(filter)}
        >
          {emptyMessage ? (
            <p className="app-empty">{emptyMessage}</p>
          ) : (
            <ul className="app-list">{renderTodoRows(filtered, handleToggle, handleDelete)}</ul>
          )}
        </div>
      </div>
    </div>
  );
}
