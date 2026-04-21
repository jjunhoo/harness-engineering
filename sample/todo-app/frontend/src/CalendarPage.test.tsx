import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "./api";
import { CalendarPage } from "./CalendarPage";

describe("CalendarPage", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date(2026, 3, 15, 12, 0, 0));
    vi.spyOn(api, "fetchTodosBetween").mockResolvedValue([]);
  });
  afterEach(() => {
    vi.useRealTimers();
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders month and loads range", async () => {
    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: "일정" })).toBeInTheDocument();
    await waitFor(() => expect(api.fetchTodosBetween).toHaveBeenCalledWith("2026-04-01", "2026-04-30"));
  });

  it("links a day to todo route", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/day/:date" element={<div>Todo route</div>} />
        </Routes>
      </MemoryRouter>,
    );
    const link = await screen.findByLabelText(/2026-04-01 할 일/i);
    expect(link.getAttribute("href")).toContain("/day/2026-04-01");
  });

  it("refetches when changing month", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>,
    );
    await waitFor(() => expect(api.fetchTodosBetween).toHaveBeenCalled());
    const before = vi.mocked(api.fetchTodosBetween).mock.calls.length;
    await user.click(screen.getByRole("button", { name: "다음 달" }));
    await waitFor(() => expect(api.fetchTodosBetween.mock.calls.length).toBeGreaterThan(before));
    expect(vi.mocked(api.fetchTodosBetween).mock.calls.some((c) => c[0] === "2026-05-01")).toBe(
      true,
    );
  });

  it("previous month from April loads March", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>,
    );
    await waitFor(() => expect(api.fetchTodosBetween).toHaveBeenCalledWith("2026-04-01", "2026-04-30"));
    await user.click(screen.getByRole("button", { name: "이전 달" }));
    await waitFor(() =>
      expect(api.fetchTodosBetween).toHaveBeenCalledWith("2026-03-01", "2026-03-31"),
    );
  });

  it("previous month crosses year boundary from January", async () => {
    vi.setSystemTime(new Date(2026, 0, 8, 12, 0, 0));
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>,
    );
    await waitFor(() => expect(api.fetchTodosBetween).toHaveBeenCalledWith("2026-01-01", "2026-01-31"));
    await user.click(screen.getByRole("button", { name: "이전 달" }));
    await waitFor(() =>
      expect(api.fetchTodosBetween).toHaveBeenCalledWith("2025-12-01", "2025-12-31"),
    );
  });

  it("next month crosses year boundary from December", async () => {
    vi.setSystemTime(new Date(2026, 11, 5, 12, 0, 0));
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>,
    );
    await waitFor(() => expect(api.fetchTodosBetween).toHaveBeenCalledWith("2026-12-01", "2026-12-31"));
    await user.click(screen.getByRole("button", { name: "다음 달" }));
    await waitFor(() =>
      expect(api.fetchTodosBetween).toHaveBeenCalledWith("2027-01-01", "2027-01-31"),
    );
  });

  it("shows range load error", async () => {
    vi.mocked(api.fetchTodosBetween).mockRejectedValueOnce(new Error("range down"));
    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("range down"));
  });

  it("shows generic range load error", async () => {
    vi.mocked(api.fetchTodosBetween).mockRejectedValueOnce("x");
    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("load failed"));
  });

  it("does not set state after unmount during range load", async () => {
    let resolveLoad!: (v: Awaited<ReturnType<typeof api.fetchTodosBetween>>) => void;
    vi.mocked(api.fetchTodosBetween).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveLoad = resolve;
        }),
    );
    const { unmount } = render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>,
    );
    unmount();
    resolveLoad([]);
    await Promise.resolve();
  });

  it("highlights today and shows active count badge", async () => {
    vi.setSystemTime(new Date(2026, 3, 15, 12, 0, 0));
    vi.mocked(api.fetchTodosBetween).mockResolvedValue([
      {
        id: 1,
        title: "t",
        completed: false,
        createdAt: "2026-04-15T00:00:00Z",
        scheduledDate: "2026-04-15",
      },
      {
        id: 2,
        title: "done",
        completed: true,
        createdAt: "2026-04-15T00:00:00Z",
        scheduledDate: "2026-04-15",
      },
    ]);
    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>,
    );
    const todayLink = await screen.findByLabelText(/2026-04-15 할 일 1건/);
    expect(todayLink.className).toContain("cal-day-link--today");
    expect(within(todayLink).getByText("1")).toBeInTheDocument();
  });
});
