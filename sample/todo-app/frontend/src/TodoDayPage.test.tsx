import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "./api";
import { CalendarPage } from "./CalendarPage";
import { TodoDayPage } from "./TodoDayPage";

vi.mock("./api", async (importOriginal) => {
  const mod = await importOriginal<typeof import("./api")>();
  return {
    ...mod,
    fetchTodosForDate: vi.fn(),
    fetchTodosBetween: vi.fn(),
    createTodo: vi.fn(),
    updateTodo: vi.fn(),
    deleteTodo: vi.fn(),
  };
});

const DAY = "2026-04-21";

const baseTodo = {
  id: 1,
  title: "one",
  completed: false,
  createdAt: "2026-04-21T08:46:21.000Z",
  scheduledDate: DAY,
  scheduledAt: "2026-04-21T08:46:21.000Z",
};

function tablist() {
  return screen.getByRole("tablist", { name: /할 일 보기 필터/i });
}

function renderDay() {
  return render(
    <MemoryRouter initialEntries={[`/day/${DAY}`]}>
      <Routes>
        <Route path="/day/:date" element={<TodoDayPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("TodoDayPage", () => {
  beforeEach(() => {
    vi.mocked(api.fetchTodosForDate).mockResolvedValue([]);
    vi.mocked(api.fetchTodosBetween).mockResolvedValue([]);
  });
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("redirects invalid date to calendar", async () => {
    render(
      <MemoryRouter initialEntries={["/day/not-a-date"]}>
        <Routes>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/day/:date" element={<TodoDayPage />} />
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByRole("heading", { name: "일정" })).toBeInTheDocument());
  });

  it("renders heading and loads todos", async () => {
    vi.mocked(api.fetchTodosForDate).mockResolvedValueOnce([baseTodo]);
    renderDay();
    expect(screen.getByRole("heading", { name: "할 일" })).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/불러오는 중/)).not.toBeInTheDocument());
    expect(document.getElementById("todo-panel")).toHaveAttribute("aria-labelledby", "tab-all");
    expect(screen.getByText("one")).toBeInTheDocument();
    const row = screen.getByRole("listitem");
    const stamp = within(row).getByLabelText(/^일정 시각 /);
    expect(stamp.textContent?.length).toBeGreaterThan(0);
  });

  it("shows empty hint when there are no todos", async () => {
    renderDay();
    await waitFor(() => expect(screen.queryByText(/불러오는 중/)).not.toBeInTheDocument());
    expect(screen.getByText("첫 할 일을 추가해 보세요.")).toBeInTheDocument();
  });

  it("filters to active only", async () => {
    const user = userEvent.setup();
    const done = {
      id: 2,
      title: "done-item",
      completed: true,
      createdAt: baseTodo.createdAt,
      scheduledDate: DAY,
      scheduledAt: "2026-04-21T10:00:00.000Z",
    };
    vi.mocked(api.fetchTodosForDate).mockResolvedValueOnce([baseTodo, done]);
    renderDay();
    await waitFor(() => expect(screen.getByText("one")).toBeInTheDocument());
    await user.click(within(tablist()).getByRole("tab", { name: /진행/i }));
    expect(screen.getByText("one")).toBeInTheDocument();
    expect(screen.queryByText("done-item")).not.toBeInTheDocument();
    expect(document.getElementById("todo-panel")).toHaveAttribute("aria-labelledby", "tab-active");
  });

  it("filters to completed only", async () => {
    const user = userEvent.setup();
    const done = {
      id: 2,
      title: "done-item",
      completed: true,
      createdAt: baseTodo.createdAt,
      scheduledDate: DAY,
      scheduledAt: "2026-04-21T10:00:00.000Z",
    };
    vi.mocked(api.fetchTodosForDate).mockResolvedValueOnce([baseTodo, done]);
    renderDay();
    await waitFor(() => expect(screen.getByText("one")).toBeInTheDocument());
    await user.click(within(tablist()).getByRole("tab", { name: /완료/i }));
    expect(screen.getByText("done-item")).toBeInTheDocument();
    expect(screen.queryByText("one")).not.toBeInTheDocument();
    expect(document.getElementById("todo-panel")).toHaveAttribute(
      "aria-labelledby",
      "tab-completed",
    );
  });

  it("shows message when no active todos in 진행 tab", async () => {
    const user = userEvent.setup();
    const done = {
      id: 2,
      title: "only-done",
      completed: true,
      createdAt: baseTodo.createdAt,
      scheduledDate: DAY,
      scheduledAt: "2026-04-21T11:00:00.000Z",
    };
    vi.mocked(api.fetchTodosForDate).mockResolvedValueOnce([done]);
    renderDay();
    await waitFor(() => expect(screen.getByText("only-done")).toBeInTheDocument());
    await user.click(within(tablist()).getByRole("tab", { name: /진행/i }));
    expect(screen.getByText("진행 중인 할 일이 없습니다.")).toBeInTheDocument();
  });

  it("shows message when no completed todos in 완료 tab", async () => {
    const user = userEvent.setup();
    vi.mocked(api.fetchTodosForDate).mockResolvedValueOnce([baseTodo]);
    renderDay();
    await waitFor(() => expect(screen.getByText("one")).toBeInTheDocument());
    await user.click(within(tablist()).getByRole("tab", { name: /완료/i }));
    expect(screen.getByText("완료된 할 일이 없습니다.")).toBeInTheDocument();
  });

  it("shows invalid scheduledAt as raw string", async () => {
    vi.mocked(api.fetchTodosForDate).mockResolvedValueOnce([
      { ...baseTodo, scheduledAt: "not-a-date" },
    ]);
    renderDay();
    await waitFor(() => expect(screen.getByText("not-a-date")).toBeInTheDocument());
  });

  it("shows load error message", async () => {
    vi.mocked(api.fetchTodosForDate).mockRejectedValueOnce(new Error("net down"));
    renderDay();
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("net down"));
  });

  it("shows generic load failure when throw is not Error", async () => {
    vi.mocked(api.fetchTodosForDate).mockRejectedValueOnce("x");
    renderDay();
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("load failed"));
  });

  it("submits empty title without calling create", async () => {
    renderDay();
    await waitFor(() => expect(api.fetchTodosForDate).toHaveBeenCalled());
    const form = screen.getByLabelText("새 할 일").closest("form")!;
    fireEvent.submit(form);
    expect(api.createTodo).not.toHaveBeenCalled();
  });

  it("creates a todo after 추가 then 등록, and shows title and time in list", async () => {
    const user = userEvent.setup();
    const created = {
      id: 9,
      title: "new",
      completed: false,
      createdAt: "2026-01-01T00:00:00.000Z",
      scheduledDate: DAY,
      scheduledAt: "2026-04-21T09:00:00.000Z",
    };
    vi.mocked(api.createTodo).mockResolvedValueOnce(created);
    renderDay();
    await waitFor(() => expect(screen.queryByText(/불러오는 중/)).not.toBeInTheDocument());
    await user.type(screen.getByLabelText("새 할 일"), "new");
    await user.click(screen.getByRole("button", { name: "추가" }));
    expect(api.createTodo).not.toHaveBeenCalled();
    expect(screen.getByText(/「new」/)).toBeInTheDocument();
    expect(screen.getByLabelText("일정 시")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "등록" }));
    expect(api.createTodo).toHaveBeenCalledWith("new", DAY, expect.stringMatching(/^2026-04-21T/));
    await waitFor(() => expect(screen.getByText("new")).toBeInTheDocument());
    const row = screen.getByRole("listitem");
    expect(within(row).getByLabelText(/^일정 시각 /)).toBeInTheDocument();
  });

  it("restores title when 취소 after 추가", async () => {
    const user = userEvent.setup();
    renderDay();
    await waitFor(() => expect(screen.queryByText(/불러오는 중/)).not.toBeInTheDocument());
    await user.type(screen.getByLabelText("새 할 일"), "draft-only");
    await user.click(screen.getByRole("button", { name: "추가" }));
    expect(api.createTodo).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "취소" }));
    expect(screen.getByLabelText("새 할 일")).toHaveValue("draft-only");
    expect(api.createTodo).not.toHaveBeenCalled();
  });

  it("uses selected hour and minute in create payload", async () => {
    const user = userEvent.setup();
    const created = {
      id: 9,
      title: "task",
      completed: false,
      createdAt: "2026-01-01T00:00:00.000Z",
      scheduledDate: DAY,
      scheduledAt: "2026-04-21T10:15:00.000Z",
    };
    vi.mocked(api.createTodo).mockResolvedValueOnce(created);
    renderDay();
    await waitFor(() => expect(screen.queryByText(/불러오는 중/)).not.toBeInTheDocument());
    await user.type(screen.getByLabelText("새 할 일"), "task");
    await user.click(screen.getByRole("button", { name: "추가" }));
    await user.selectOptions(screen.getByLabelText("일정 시"), "10");
    await user.selectOptions(screen.getByLabelText("일정 분"), "15");
    await user.click(screen.getByRole("button", { name: "등록" }));
    const iso = vi.mocked(api.createTodo).mock.calls[0][2] as string;
    const parsed = new Date(iso);
    expect(parsed.getHours()).toBe(10);
    expect(parsed.getMinutes()).toBe(15);
  });

  it("shows create error", async () => {
    const user = userEvent.setup();
    vi.mocked(api.createTodo).mockRejectedValueOnce(new Error("no create"));
    renderDay();
    await waitFor(() => expect(screen.queryByText(/불러오는 중/)).not.toBeInTheDocument());
    await user.type(screen.getByLabelText("새 할 일"), "x");
    await user.click(screen.getByRole("button", { name: "추가" }));
    await user.click(screen.getByRole("button", { name: "등록" }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("no create"));
  });

  it("shows generic create error", async () => {
    const user = userEvent.setup();
    vi.mocked(api.createTodo).mockRejectedValueOnce(1);
    renderDay();
    await waitFor(() => expect(screen.queryByText(/불러오는 중/)).not.toBeInTheDocument());
    await user.type(screen.getByLabelText("새 할 일"), "x");
    await user.click(screen.getByRole("button", { name: "추가" }));
    await user.click(screen.getByRole("button", { name: "등록" }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("create failed"));
  });

  it("toggles completed", async () => {
    const user = userEvent.setup();
    vi.mocked(api.fetchTodosForDate).mockResolvedValueOnce([baseTodo]);
    vi.mocked(api.updateTodo).mockResolvedValueOnce({ ...baseTodo, completed: true });
    renderDay();
    await waitFor(() => expect(screen.getByText("one")).toBeInTheDocument());
    await user.click(screen.getByRole("checkbox", { name: /완료: one/i }));
    expect(api.updateTodo).toHaveBeenCalledWith(1, { completed: true });
  });

  it("updates only matching id when several todos exist", async () => {
    const user = userEvent.setup();
    const second = {
      id: 2,
      title: "two",
      completed: false,
      createdAt: baseTodo.createdAt,
      scheduledDate: DAY,
      scheduledAt: "2026-04-21T12:00:00.000Z",
    };
    vi.mocked(api.fetchTodosForDate).mockResolvedValueOnce([baseTodo, second]);
    vi.mocked(api.updateTodo).mockResolvedValueOnce({ ...baseTodo, completed: true });
    renderDay();
    await waitFor(() => expect(screen.getByText("two")).toBeInTheDocument());
    const boxes = screen.getAllByRole("checkbox");
    await user.click(boxes[0]);
    await waitFor(() => expect(boxes[0]).toBeChecked());
    expect(boxes[1]).not.toBeChecked();
    expect(screen.getByText("two")).toBeInTheDocument();
  });

  it("shows update error", async () => {
    const user = userEvent.setup();
    vi.mocked(api.fetchTodosForDate).mockResolvedValueOnce([baseTodo]);
    vi.mocked(api.updateTodo).mockRejectedValueOnce(new Error("put fail"));
    renderDay();
    await waitFor(() => expect(screen.getByText("one")).toBeInTheDocument());
    await user.click(screen.getByRole("checkbox", { name: /완료: one/i }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("put fail"));
  });

  it("shows generic update error", async () => {
    const user = userEvent.setup();
    vi.mocked(api.fetchTodosForDate).mockResolvedValueOnce([baseTodo]);
    vi.mocked(api.updateTodo).mockRejectedValueOnce(null);
    renderDay();
    await waitFor(() => expect(screen.getByText("one")).toBeInTheDocument());
    await user.click(screen.getByRole("checkbox", { name: /완료: one/i }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("update failed"));
  });

  it("deletes a todo", async () => {
    const user = userEvent.setup();
    vi.mocked(api.fetchTodosForDate).mockResolvedValueOnce([baseTodo]);
    vi.mocked(api.deleteTodo).mockResolvedValueOnce(undefined);
    renderDay();
    await waitFor(() => expect(screen.getByText("one")).toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: /one 삭제/i }));
    await waitFor(() => expect(screen.queryByText("one")).not.toBeInTheDocument());
  });

  it("shows delete error", async () => {
    const user = userEvent.setup();
    vi.mocked(api.fetchTodosForDate).mockResolvedValueOnce([baseTodo]);
    vi.mocked(api.deleteTodo).mockRejectedValueOnce(new Error("del"));
    renderDay();
    await waitFor(() => expect(screen.getByText("one")).toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: /one 삭제/i }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("del"));
  });

  it("shows generic delete error", async () => {
    const user = userEvent.setup();
    vi.mocked(api.fetchTodosForDate).mockResolvedValueOnce([baseTodo]);
    vi.mocked(api.deleteTodo).mockRejectedValueOnce(Symbol("e"));
    renderDay();
    await waitFor(() => expect(screen.getByText("one")).toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: /one 삭제/i }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("delete failed"));
  });
});
