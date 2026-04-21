import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createTodo, deleteTodo, fetchTodosBetween, fetchTodosForDate, updateTodo } from "./api";

describe("api", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("fetchTodosForDate returns JSON on ok", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify([{ id: 1 }]), { status: 200 }),
    );
    const rows = await fetchTodosForDate("2026-04-21");
    expect(rows).toEqual([{ id: 1 }]);
    expect(fetch).toHaveBeenCalledWith("/api/todos?date=2026-04-21");
  });

  it("fetchTodosForDate throws on error body", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response("nope", { status: 500 }));
    await expect(fetchTodosForDate("2026-04-21")).rejects.toThrow("nope");
  });

  it("fetchTodosBetween uses from and to", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response("[]", { status: 200 }));
    await fetchTodosBetween("2026-04-01", "2026-04-30");
    expect(fetch).toHaveBeenCalledWith("/api/todos?from=2026-04-01&to=2026-04-30");
  });

  it("fetchTodosBetween throws on error", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response("x", { status: 500 }));
    await expect(fetchTodosBetween("2026-04-01", "2026-04-30")).rejects.toThrow("x");
  });

  it("createTodo posts title, scheduledDate, and scheduledAt", async () => {
    const created = {
      id: 2,
      title: "x",
      completed: false,
      createdAt: "t",
      scheduledDate: "2026-04-22",
      scheduledAt: "2026-04-22T01:00:00.000Z",
    };
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(created), { status: 201 }),
    );
    await expect(createTodo("x", "2026-04-22", "2026-04-22T01:00:00.000Z")).resolves.toEqual(created);
    expect(fetch).toHaveBeenCalledWith(
      "/api/todos",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "x",
          scheduledDate: "2026-04-22",
          scheduledAt: "2026-04-22T01:00:00.000Z",
        }),
      }),
    );
  });

  it("createTodo throws when not ok", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response("bad", { status: 400 }));
    await expect(createTodo("a", "2026-04-01", "2026-04-01T00:00:00.000Z")).rejects.toThrow("bad");
  });

  it("updateTodo puts and returns entity", async () => {
    const updated = {
      id: 1,
      title: "y",
      completed: true,
      createdAt: "t",
      scheduledDate: "2026-04-01",
      scheduledAt: "2026-04-01T08:00:00.000Z",
    };
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(updated), { status: 200 }),
    );
    await expect(updateTodo(1, { completed: true })).resolves.toEqual(updated);
  });

  it("updateTodo throws when not ok", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response("err", { status: 400 }));
    await expect(updateTodo(9, { title: "z" })).rejects.toThrow("err");
  });

  it("deleteTodo resolves on ok", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 204 }));
    await expect(deleteTodo(3)).resolves.toBeUndefined();
  });

  it("deleteTodo ignores 404", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 404 }));
    await expect(deleteTodo(3)).resolves.toBeUndefined();
  });

  it("deleteTodo throws on other errors", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response("gone wrong", { status: 500 }));
    await expect(deleteTodo(3)).rejects.toThrow("gone wrong");
  });
});
