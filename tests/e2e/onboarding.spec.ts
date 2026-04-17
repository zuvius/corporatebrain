import { test, expect } from "@playwright/test";

test.describe("Onboarding Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/onboarding");
  });

  test.describe("Step 1: Welcome", () => {
    test("displays welcome step", async ({ page }) => {
      await expect(page.getByText(/Welcome to Corporate Brain/i)).toBeVisible();
      await expect(
        page.getByText(/Your AI-powered knowledge assistant/i),
      ).toBeVisible();
    });

    test("has continue button", async ({ page }) => {
      await expect(
        page.getByRole("button", { name: /Get Started/i }),
      ).toBeVisible();
    });

    test("proceeds to step 2 on continue", async ({ page }) => {
      await page.getByRole("button", { name: /Get Started/i }).click();

      await expect(page.getByText(/Create your workspace/i)).toBeVisible();
    });
  });

  test.describe("Step 2: Workspace", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/onboarding");
      await page.getByRole("button", { name: /Get Started/i }).click();
    });

    test("displays workspace creation form", async ({ page }) => {
      await expect(page.getByText(/Create your workspace/i)).toBeVisible();
      await expect(page.getByLabel(/Workspace Name/i)).toBeVisible();
    });

    test("validates workspace name is required", async ({ page }) => {
      await page.getByRole("button", { name: /Continue/i }).click();

      await expect(page.getByText(/Workspace name is required/i)).toBeVisible();
    });

    test("accepts valid workspace name", async ({ page }) => {
      await page.getByLabel(/Workspace Name/i).fill("My Company");
      await page.getByRole("button", { name: /Continue/i }).click();

      await expect(
        page.getByText(/Connect your knowledge sources/i),
      ).toBeVisible();
    });

    test("allows going back to previous step", async ({ page }) => {
      await page.getByRole("button", { name: /Back/i }).click();

      await expect(page.getByText(/Welcome to Corporate Brain/i)).toBeVisible();
    });
  });

  test.describe("Step 3: Connect", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/onboarding");
      await page.getByRole("button", { name: /Get Started/i }).click();
      await page.getByLabel(/Workspace Name/i).fill("My Company");
      await page.getByRole("button", { name: /Continue/i }).click();
    });

    test("displays integration options", async ({ page }) => {
      await expect(
        page.getByText(/Connect your knowledge sources/i),
      ).toBeVisible();
      await expect(page.getByText(/Slack/i)).toBeVisible();
      await expect(page.getByText(/Google Drive/i)).toBeVisible();
      await expect(page.getByText(/Notion/i)).toBeVisible();
    });

    test("allows skipping integrations", async ({ page }) => {
      await page.getByRole("button", { name: /Skip for now/i }).click();

      await expect(page.getByText(/You're all set!/i)).toBeVisible();
    });

    test("has connect buttons for each integration", async ({ page }) => {
      await expect(
        page.getByRole("button", { name: /Connect Slack/i }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: /Connect Drive/i }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: /Connect Notion/i }),
      ).toBeVisible();
    });
  });

  test.describe("Step 4: Complete", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/onboarding");
      // Navigate through all steps
      await page.getByRole("button", { name: /Get Started/i }).click();
      await page.getByLabel(/Workspace Name/i).fill("My Company");
      await page.getByRole("button", { name: /Continue/i }).click();
      await page.getByRole("button", { name: /Skip for now/i }).click();
    });

    test("displays completion message", async ({ page }) => {
      await expect(page.getByText(/You're all set!/i)).toBeVisible();
      await expect(
        page.getByText(/Start using Corporate Brain/i),
      ).toBeVisible();
    });

    test("has button to go to dashboard", async ({ page }) => {
      await expect(
        page.getByRole("button", { name: /Go to Dashboard/i }),
      ).toBeVisible();
    });

    test("navigates to app on complete", async ({ page }) => {
      await page.getByRole("button", { name: /Go to Dashboard/i }).click();

      await expect(page).toHaveURL("/app");
    });
  });

  test.describe("Progress Indicator", () => {
    test("shows current step number", async ({ page }) => {
      await expect(page.getByText(/Step 1 of 4/i)).toBeVisible();

      await page.getByRole("button", { name: /Get Started/i }).click();
      await expect(page.getByText(/Step 2 of 4/i)).toBeVisible();
    });

    test("has visual progress bar", async ({ page }) => {
      const progressBar = page
        .locator('[role="progressbar"], .progress-bar, [class*="progress"]')
        .first();
      await expect(progressBar).toBeVisible();
    });
  });
});
