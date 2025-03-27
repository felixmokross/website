import test, { expect } from "@playwright/test";
import { createPage } from "../common/cms";

test("redirects to path without trailing slash", async ({ page, baseURL }) => {
  const testPage = await createPage();

  await page.goto(testPage.pathname + "/");

  await expect(page.url().endsWith(testPage.pathname)).toBeTruthy();
});
