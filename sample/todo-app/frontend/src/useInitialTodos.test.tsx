import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "./api";
import { useInitialTodos } from "./useInitialTodos";

const DAY = "2026-04-21";

describe("useInitialTodos", () => {
  beforeEach(() => {
    vi.spyOn(api, "fetchTodosForDate").mockResolvedValue([]);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads todos on mount", async () => {
    vi.mocked(api.fetchTodosForDate).mockResolvedValueOnce([
      {
        id: 1,
        title: "a",
        completed: false,
        createdAt: "2026-01-01T00:00:00.000Z",
        scheduledDate: DAY,
      },
    ]);
    const { result } = renderHook(() => useInitialTodos(DAY));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.error).toBeNull();
    expect(api.fetchTodosForDate).toHaveBeenCalledWith(DAY);
  });

  it("sets error on failure", async () => {
    vi.mocked(api.fetchTodosForDate).mockRejectedValueOnce(new Error("boom"));
    const { result } = renderHook(() => useInitialTodos(DAY));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("boom");
  });

  it("sets generic error when throw is not Error", async () => {
    vi.mocked(api.fetchTodosForDate).mockRejectedValueOnce("x");
    const { result } = renderHook(() => useInitialTodos(DAY));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("load failed");
  });

  it("does not set state after unmount", async () => {
    let resolveLoad!: (v: api.Todo[]) => void;
    vi.mocked(api.fetchTodosForDate).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveLoad = resolve;
        }),
    );
    const { result, unmount } = renderHook(() => useInitialTodos(DAY));
    expect(result.current.loading).toBe(true);
    unmount();
    resolveLoad([]);
    await waitFor(() => Promise.resolve());
  });

  it("reloads when date key changes", async () => {
    vi.mocked(api.fetchTodosForDate).mockResolvedValue([]);
    const { rerender } = renderHook(({ d }: { d: string }) => useInitialTodos(d), {
      initialProps: { d: "2026-04-01" },
    });
    await waitFor(() => expect(api.fetchTodosForDate).toHaveBeenCalledWith("2026-04-01"));
    rerender({ d: "2026-04-02" });
    await waitFor(() =>
      expect(vi.mocked(api.fetchTodosForDate).mock.calls.some((c) => c[0] === "2026-04-02")).toBe(
        true,
      ),
    );
  });
});
