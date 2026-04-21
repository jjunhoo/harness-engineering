import { describe, expect, it } from "vitest";
import type { Todo } from "./api";
import {
  countTodos,
  filterTodos,
  formatAddedAt,
  sortTodosById,
  tabPanelLabelId,
  todoEmptyHint,
} from "./todoView";

const t = (over: Partial<Todo> & Pick<Todo, "id" | "title">): Todo => ({
  id: over.id,
  title: over.title,
  completed: over.completed ?? false,
  createdAt: over.createdAt ?? "2026-01-01T00:00:00.000Z",
});

describe("tabPanelLabelId", () => {
  it("maps filters to tab ids", () => {
    expect(tabPanelLabelId("all")).toBe("tab-all");
    expect(tabPanelLabelId("active")).toBe("tab-active");
    expect(tabPanelLabelId("completed")).toBe("tab-completed");
  });
});

describe("formatAddedAt", () => {
  it("formats valid ISO", () => {
    expect(formatAddedAt("2026-04-21T08:46:21.000Z")).toMatch(/2026/);
  });

  it("returns raw string for invalid date", () => {
    expect(formatAddedAt("not-a-date")).toBe("not-a-date");
  });
});

describe("sortTodosById", () => {
  it("sorts by id ascending", () => {
    const a = [t({ id: 3, title: "c" }), t({ id: 1, title: "a" })];
    expect(sortTodosById(a).map((x) => x.id)).toEqual([1, 3]);
  });
});

describe("countTodos", () => {
  it("counts all states", () => {
    const items = [t({ id: 1, title: "a", completed: false }), t({ id: 2, title: "b", completed: true })];
    expect(countTodos(items)).toEqual({ all: 2, active: 1, completed: 1 });
  });
});

describe("filterTodos", () => {
  const sorted = [
    t({ id: 1, title: "a", completed: false }),
    t({ id: 2, title: "b", completed: true }),
  ];

  it("returns all for all filter", () => {
    expect(filterTodos(sorted, "all")).toHaveLength(2);
  });

  it("returns only active", () => {
    expect(filterTodos(sorted, "active").map((x) => x.id)).toEqual([1]);
  });

  it("returns only completed", () => {
    expect(filterTodos(sorted, "completed").map((x) => x.id)).toEqual([2]);
  });
});

describe("todoEmptyHint", () => {
  it("hints when no todos at all", () => {
    expect(todoEmptyHint([], [], "all")).toBe("첫 할 일을 추가해 보세요.");
  });

  it("hints when no active in filtered", () => {
    const sorted = [t({ id: 1, title: "x", completed: true })];
    expect(todoEmptyHint(sorted, [], "active")).toBe("진행 중인 할 일이 없습니다.");
  });

  it("hints when no completed in filtered", () => {
    const sorted = [t({ id: 1, title: "x", completed: false })];
    expect(todoEmptyHint(sorted, [], "completed")).toBe("완료된 할 일이 없습니다.");
  });

  it("returns null when list has items", () => {
    const sorted = [t({ id: 1, title: "x" })];
    expect(todoEmptyHint(sorted, sorted, "all")).toBeNull();
  });
});
