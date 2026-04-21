import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderTodoRows, TodoRow } from "./TodoRow";

afterEach(() => cleanup());

const todo = {
  id: 1,
  title: "buy milk",
  completed: false,
  createdAt: "2026-04-21T08:46:21.000Z",
  scheduledDate: "2026-04-21",
  scheduledAt: "2026-04-21T08:46:21.000Z",
};

describe("TodoRow", () => {
  it("calls onToggle when checkbox changes", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    render(<TodoRow todo={todo} onToggle={onToggle} onDelete={onDelete} />);
    await user.click(screen.getByRole("checkbox", { name: /buy milk/i }));
    expect(onToggle).toHaveBeenCalledWith(todo);
  });

  it("calls onDelete when delete clicked", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    render(<TodoRow todo={todo} onToggle={onToggle} onDelete={onDelete} />);
    await user.click(screen.getAllByRole("button", { name: /buy milk 삭제/i })[0]);
    expect(onDelete).toHaveBeenCalledWith(todo);
  });

  it("shows schedule label and time under title", () => {
    render(<TodoRow todo={todo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("buy milk")).toBeInTheDocument();
    expect(screen.getByText("일정")).toBeInTheDocument();
    const timeEl = document.querySelector("time[datetime]");
    expect(timeEl).toBeTruthy();
    expect(timeEl?.getAttribute("datetime")).toBe(todo.scheduledAt);
    expect(screen.getByLabelText(/^일정 시각 /)).toBeInTheDocument();
  });
});

describe("renderTodoRows", () => {
  it("renders one row per todo", () => {
    const rows = renderTodoRows(
      [
        todo,
        {
          id: 2,
          title: "b",
          completed: true,
          createdAt: todo.createdAt,
          scheduledDate: "2026-04-21",
          scheduledAt: todo.scheduledAt,
        },
      ],
      vi.fn(),
      vi.fn(),
    );
    expect(rows).toHaveLength(2);
  });
});
