import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createTodo, deleteTodo, fetchTodos, updateTodo } from "./api";

describe("api", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("fetchTodos returns JSON on ok", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify([{ id: 1 }]), { status: 200 }),
    );
    const rows = await fetchTodos();
    expect(rows).toEqual([{ id: 1 }]);
    expect(fetch).toHaveBeenCalledWith("/api/todos");
  });

  it("fetchTodos throws on error body", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response("nope", { status: 500 }));
    await expect(fetchTodos()).rejects.toThrow("nope");
  });

  it("createTodo posts and returns entity", async () => {
    const created = { id: 2, title: "x", completed: false, createdAt: "t" };
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(created), { status: 201 }),
    );
    await expect(createTodo("x")).resolves.toEqual(created);
    expect(fetch).toHaveBeenCalledWith(
      "/api/todos",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "x" }),
      }),
    );
  });

  it("createTodo throws when not ok", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response("bad", { status: 400 }));
    await expect(createTodo("a")).rejects.toThrow("bad");
  });

  it("updateTodo puts and returns entity", async () => {
    const updated = { id: 1, title: "y", completed: true, createdAt: "t" };
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
