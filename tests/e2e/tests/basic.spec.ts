import { test, expect } from "@playwright/test";
import { createPage } from "../common/cms";
import { heading, richTextRoot, text } from "@fxmk/shared";

test("has title and heading", async ({ page }) => {
  const testPage = await createPage({
    title: "E2E Test Page",
    meta: {
      title: "E2E Test Page",
    },
    hero: {
      richText: richTextRoot(heading("h1", text("E2E Test Page"))),
    },
  });

  await page.goto(testPage.pathname);

  await expect(page).toHaveTitle(/E2E Test Page/);

  await expect(
    page.getByRole("heading", { level: 1, name: "E2E Test Page" }),
  ).toBeVisible();
});
