import { expect, test } from "@playwright/test";

test("UI 제목 영역·전체 페이지 캡처", async ({ page }) => {
  const stamp = new Date().toISOString().replaceAll(":", "-").split(".")[0];

  await page.goto("/");
  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toHaveText("일정");

  await heading.screenshot({ path: "screenshots/latest-heading.png" });
  await page.screenshot({
    path: "screenshots/latest-fullpage.png",
    fullPage: true,
  });
  await heading.screenshot({
    path: `screenshots/heading-${stamp}.png`,
  });
});
