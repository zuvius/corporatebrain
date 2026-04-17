import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test.describe("Sign In Page", () => {
    test("displays sign in form", async ({ page }) => {
      await page.goto("/auth/signin");

      await expect(
        page.getByRole("heading", { name: /Sign In/i }),
      ).toBeVisible();
      await expect(page.getByLabel(/Email/i)).toBeVisible();
      await expect(
        page.getByRole("button", { name: /Sign in with Email/i }),
      ).toBeVisible();
    });

    test("validates email format", async ({ page }) => {
      await page.goto("/auth/signin");

      const emailInput = page.getByLabel(/Email/i);
      await emailInput.fill("invalid-email");
      await page.getByRole("button", { name: /Sign in with Email/i }).click();

      await expect(page.getByText(/Please enter a valid email/i)).toBeVisible();
    });

    test("shows loading state on submit", async ({ page }) => {
      await page.goto("/auth/signin");

      await page.getByLabel(/Email/i).fill("test@example.com");
      await page.getByRole("button", { name: /Sign in with Email/i }).click();

      await expect(page.getByText(/Sending magic link/i)).toBeVisible();
    });

    test("displays Google sign in button", async ({ page }) => {
      await page.goto("/auth/signin");

      await expect(
        page.getByRole("button", { name: /Sign in with Google/i }),
      ).toBeVisible();
    });

    test("has link to home page", async ({ page }) => {
      await page.goto("/auth/signin");

      const homeLink = page.getByRole("link", { name: /Corporate Brain/i });
      await expect(homeLink).toBeVisible();

      await homeLink.click();
      await expect(page).toHaveURL("/");
    });
  });

  test.describe("Protected Routes", () => {
    test("redirects to signin when accessing /app without auth", async ({
      page,
    }) => {
      await page.goto("/app");

      await expect(page).toHaveURL(/auth/);
    });

    test("redirects to signin when accessing /admin without auth", async ({
      page,
    }) => {
      await page.goto("/admin");

      await expect(page).toHaveURL(/auth/);
    });

    test("redirects to signin when accessing /integrations without auth", async ({
      page,
    }) => {
      await page.goto("/integrations");

      await expect(page).toHaveURL(/auth/);
    });
  });

  test.describe("Magic Link Flow", () => {
    test("shows confirmation after submitting email", async ({ page }) => {
      await page.goto("/auth/signin");

      await page.getByLabel(/Email/i).fill("user@company.com");
      await page.getByRole("button", { name: /Sign in with Email/i }).click();

      await expect(page.getByText(/Check your email/i)).toBeVisible();
      await expect(page.getByText(/user@company.com/i)).toBeVisible();
    });
  });
});
