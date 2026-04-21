import { expect, test } from "@playwright/test";

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function addDays(isoDate: string, delta: number): string {
  const d = new Date(`${isoDate}T12:00:00`);
  d.setDate(d.getDate() + delta);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

test("README용 화면 캡처(캘린더·일별·필터)", async ({ page }) => {
  await page.route("**/api/todos**", async (route) => {
    if (route.request().method() !== "GET") {
      return route.continue();
    }
    const url = new URL(route.request().url());
    const date = url.searchParams.get("date");
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");

    if (from && to) {
      const t1 = from;
      const t2 = addDays(from, 7);
      const t3 = addDays(from, 14);
      const body = [
        {
          id: 1,
          title: "주간 회의",
          completed: false,
          createdAt: `${t1}T09:00:00.000Z`,
          scheduledDate: t1,
        },
        {
          id: 2,
          title: "문서 정리",
          completed: false,
          createdAt: `${t2}T10:00:00.000Z`,
          scheduledDate: t2,
        },
        {
          id: 3,
          title: "보고 완료",
          completed: true,
          createdAt: `${t3}T11:00:00.000Z`,
          scheduledDate: t3,
        },
      ];
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    }

    if (date) {
      const body = [
        {
          id: 10,
          title: "미팅 준비",
          completed: false,
          createdAt: `${date}T09:00:00.000Z`,
          scheduledDate: date,
        },
        {
          id: 11,
          title: "이메일 확인",
          completed: true,
          createdAt: `${date}T10:30:00.000Z`,
          scheduledDate: date,
        },
      ];
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    }

    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: "[]",
    });
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "일정" })).toBeVisible();
  await expect(page.getByRole("grid")).toBeVisible();
  await page.locator(".app-card.cal-card").screenshot({
    path: "screenshots/readme-01-calendar.png",
  });

  const anyDayLink = page.locator('a.cal-day-link[href^="/day/"]').first();
  await expect(anyDayLink).toBeVisible();
  const href = await anyDayLink.getAttribute("href");
  expect(href).toMatch(/^\/day\/\d{4}-\d{2}-\d{2}$/);
  await anyDayLink.click();

  await expect(page.getByRole("heading", { name: "할 일" })).toBeVisible();
  await expect(page.getByText("미팅 준비")).toBeVisible();
  await page.locator(".app-card").first().screenshot({
    path: "screenshots/readme-02-day-todos.png",
  });

  await page.getByRole("tab", { name: /진행/i }).click();
  await expect(page.getByText("미팅 준비")).toBeVisible();
  await expect(page.getByText("이메일 확인")).toHaveCount(0);
  await page.locator(".app-card").first().screenshot({
    path: "screenshots/readme-03-day-filter-active.png",
  });
});
