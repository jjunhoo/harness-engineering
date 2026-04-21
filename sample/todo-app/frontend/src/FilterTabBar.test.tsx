import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FilterTabBar } from "./FilterTabBar";

describe("FilterTabBar", () => {
  it("calls onFilter with each tab", async () => {
    const user = userEvent.setup();
    const onFilter = vi.fn();
    render(<FilterTabBar filter="all" counts={{ all: 3, active: 2, completed: 1 }} onFilter={onFilter} />);
    await user.click(screen.getByRole("tab", { name: /진행/i }));
    expect(onFilter).toHaveBeenLastCalledWith("active");
    await user.click(screen.getByRole("tab", { name: /완료/i }));
    expect(onFilter).toHaveBeenLastCalledWith("completed");
    await user.click(screen.getByRole("tab", { name: /전체/i }));
    expect(onFilter).toHaveBeenLastCalledWith("all");
  });
});
