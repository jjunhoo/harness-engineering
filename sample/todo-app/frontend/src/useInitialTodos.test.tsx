import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "./api";
import { useInitialTodos } from "./useInitialTodos";

describe("useInitialTodos", () => {
  beforeEach(() => {
    vi.spyOn(api, "fetchTodos").mockResolvedValue([]);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads todos on mount", async () => {
    vi.mocked(api.fetchTodos).mockResolvedValueOnce([
      { id: 1, title: "a", completed: false, createdAt: "2026-01-01T00:00:00.000Z" },
    ]);
    const { result } = renderHook(() => useInitialTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.error).toBeNull();
  });

  it("sets error on failure", async () => {
    vi.mocked(api.fetchTodos).mockRejectedValueOnce(new Error("boom"));
    const { result } = renderHook(() => useInitialTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("boom");
  });

  it("sets generic error when throw is not Error", async () => {
    vi.mocked(api.fetchTodos).mockRejectedValueOnce("x");
    const { result } = renderHook(() => useInitialTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("load failed");
  });

  it("does not set state after unmount", async () => {
    let resolveLoad!: (v: api.Todo[]) => void;
    vi.mocked(api.fetchTodos).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveLoad = resolve;
        }),
    );
    const { result, unmount } = renderHook(() => useInitialTodos());
    expect(result.current.loading).toBe(true);
    unmount();
    resolveLoad([]);
    await waitFor(() => Promise.resolve());
  });
});
