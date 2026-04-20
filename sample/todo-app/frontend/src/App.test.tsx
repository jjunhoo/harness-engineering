import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";
import * as api from "./api";

vi.mock("./api", async (importOriginal) => {
  const mod = await importOriginal<typeof import("./api")>();
  return { ...mod, fetchTodos: vi.fn(), createTodo: vi.fn(), updateTodo: vi.fn(), deleteTodo: vi.fn() };
});

const baseTodo = {
  id: 1,
  title: "one",
  completed: false,
  createdAt: "2026-04-21T08:46:21.000Z",
};

describe("App", () => {
  beforeEach(() => {
    vi.mocked(api.fetchTodos).mockResolvedValue([]);
  });
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders heading and loads todos", async () => {
    vi.mocked(api.fetchTodos).mockResolvedValueOnce([baseTodo]);
    render(<App />);
    expect(screen.getByRole("heading", { name: /Todo Application/i })).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/불러오는 중/)).not.toBeInTheDocument());
    expect(screen.getByText("one")).toBeInTheDocument();
    const stamp = screen.getByLabelText(/추가 시각/i);
    expect(stamp.textContent).not.toMatch(/^추가:/);
    expect(stamp.textContent?.length).toBeGreaterThan(0);
  });

  it("shows invalid createdAt as raw string", async () => {
    vi.mocked(api.fetchTodos).mockResolvedValueOnce([
      { ...baseTodo, createdAt: "not-a-date" },
    ]);
    render(<App />);
    await waitFor(() => expect(screen.getByText("not-a-date")).toBeInTheDocument());
  });

  it("shows load error message", async () => {
    vi.mocked(api.fetchTodos).mockRejectedValueOnce(new Error("net down"));
    render(<App />);
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("net down"));
  });

  it("shows generic load failure when throw is not Error", async () => {
    vi.mocked(api.fetchTodos).mockRejectedValueOnce("x");
    render(<App />);
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("load failed"));
  });

  it("does not update state after unmount while loading", async () => {
    let resolveLoad!: (v: api.Todo[]) => void;
    vi.mocked(api.fetchTodos).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveLoad = resolve;
        }),
    );
    const { unmount } = render(<App />);
    unmount();
    resolveLoad([]);
    await Promise.resolve();
  });

  it("submits empty title without calling create", async () => {
    render(<App />);
    await waitFor(() => expect(api.fetchTodos).toHaveBeenCalled());
    const form = screen.getByPlaceholderText("새 할 일").closest("form")!;
    fireEvent.submit(form);
    expect(api.createTodo).not.toHaveBeenCalled();
  });

  it("creates a todo and clears input", async () => {
    const user = userEvent.setup();
    const created = { id: 9, title: "new", completed: false, createdAt: "2026-01-01T00:00:00.000Z" };
    vi.mocked(api.createTodo).mockResolvedValueOnce(created);
    render(<App />);
    await waitFor(() => expect(screen.queryByText(/불러오는 중/)).not.toBeInTheDocument());
    await user.type(screen.getByPlaceholderText("새 할 일"), "new");
    await user.click(screen.getByRole("button", { name: "추가" }));
    expect(api.createTodo).toHaveBeenCalledWith("new");
    await waitFor(() => expect(screen.getByText("new")).toBeInTheDocument());
  });

  it("shows create error", async () => {
    const user = userEvent.setup();
    vi.mocked(api.createTodo).mockRejectedValueOnce(new Error("no create"));
    render(<App />);
    await waitFor(() => expect(screen.queryByText(/불러오는 중/)).not.toBeInTheDocument());
    await user.type(screen.getByPlaceholderText("새 할 일"), "x");
    await user.click(screen.getByRole("button", { name: "추가" }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("no create"));
  });

  it("shows generic create error", async () => {
    const user = userEvent.setup();
    vi.mocked(api.createTodo).mockRejectedValueOnce(1);
    render(<App />);
    await waitFor(() => expect(screen.queryByText(/불러오는 중/)).not.toBeInTheDocument());
    await user.type(screen.getByPlaceholderText("새 할 일"), "x");
    await user.click(screen.getByRole("button", { name: "추가" }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("create failed"));
  });

  it("toggles completed", async () => {
    const user = userEvent.setup();
    vi.mocked(api.fetchTodos).mockResolvedValueOnce([baseTodo]);
    vi.mocked(api.updateTodo).mockResolvedValueOnce({ ...baseTodo, completed: true });
    render(<App />);
    await waitFor(() => expect(screen.getByText("one")).toBeInTheDocument());
    await user.click(screen.getByRole("checkbox"));
    expect(api.updateTodo).toHaveBeenCalledWith(1, { completed: true });
  });

  it("updates only matching id when several todos exist", async () => {
    const user = userEvent.setup();
    const second = { id: 2, title: "two", completed: false, createdAt: baseTodo.createdAt };
    vi.mocked(api.fetchTodos).mockResolvedValueOnce([baseTodo, second]);
    vi.mocked(api.updateTodo).mockResolvedValueOnce({ ...baseTodo, completed: true });
    render(<App />);
    await waitFor(() => expect(screen.getByText("two")).toBeInTheDocument());
    const boxes = screen.getAllByRole("checkbox");
    await user.click(boxes[0]);
    await waitFor(() => expect(boxes[0]).toBeChecked());
    expect(boxes[1]).not.toBeChecked();
    expect(screen.getByText("two")).toBeInTheDocument();
  });

  it("shows update error", async () => {
    const user = userEvent.setup();
    vi.mocked(api.fetchTodos).mockResolvedValueOnce([baseTodo]);
    vi.mocked(api.updateTodo).mockRejectedValueOnce(new Error("put fail"));
    render(<App />);
    await waitFor(() => expect(screen.getByText("one")).toBeInTheDocument());
    await user.click(screen.getByRole("checkbox"));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("put fail"));
  });

  it("shows generic update error", async () => {
    const user = userEvent.setup();
    vi.mocked(api.fetchTodos).mockResolvedValueOnce([baseTodo]);
    vi.mocked(api.updateTodo).mockRejectedValueOnce(null);
    render(<App />);
    await waitFor(() => expect(screen.getByText("one")).toBeInTheDocument());
    await user.click(screen.getByRole("checkbox"));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("update failed"));
  });

  it("deletes a todo", async () => {
    const user = userEvent.setup();
    vi.mocked(api.fetchTodos).mockResolvedValueOnce([baseTodo]);
    vi.mocked(api.deleteTodo).mockResolvedValueOnce(undefined);
    render(<App />);
    await waitFor(() => expect(screen.getByText("one")).toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: "삭제" }));
    await waitFor(() => expect(screen.queryByText("one")).not.toBeInTheDocument());
  });

  it("shows delete error", async () => {
    const user = userEvent.setup();
    vi.mocked(api.fetchTodos).mockResolvedValueOnce([baseTodo]);
    vi.mocked(api.deleteTodo).mockRejectedValueOnce(new Error("del"));
    render(<App />);
    await waitFor(() => expect(screen.getByText("one")).toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: "삭제" }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("del"));
  });

  it("shows generic delete error", async () => {
    const user = userEvent.setup();
    vi.mocked(api.fetchTodos).mockResolvedValueOnce([baseTodo]);
    vi.mocked(api.deleteTodo).mockRejectedValueOnce(Symbol("e"));
    render(<App />);
    await waitFor(() => expect(screen.getByText("one")).toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: "삭제" }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("delete failed"));
  });
});
