import { test, expect } from '@playwright/test';

test.describe('Chat Interface', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to chat page
    await page.goto('/app');
    
    // If redirected to signin, we'll need to handle auth
    // For now, this assumes we're testing the UI structure
  });

  test.describe('Layout', () => {
    test('displays main chat layout', async ({ page }) => {
      await page.goto('/app');

      // Check main structural elements
      await expect(page.getByText('Corporate Brain')).toBeVisible();
      await expect(page.getByPlaceholder(/Ask anything/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /Send/i })).toBeVisible();
    });

    test('has context sidebar', async ({ page }) => {
      await page.goto('/app');

      await expect(page.getByText('Context')).toBeVisible();
      await expect(page.getByText('Conversations')).toBeVisible();
      await expect(page.getByText('Sources')).toBeVisible();
    });

    test('has model switcher', async ({ page }) => {
      await page.goto('/app');

      await expect(page.getByText(/Fast|Deep/i)).toBeVisible();
    });

    test('has action buttons', async ({ page }) => {
      await page.goto('/app');

      await expect(page.getByText(/Draft|Create|Schedule/i)).toBeVisible();
    });
  });

  test.describe('Input Functionality', () => {
    test('allows typing in message input', async ({ page }) => {
      await page.goto('/app');

      const input = page.getByPlaceholder(/Ask anything/i);
      await input.fill('Test message');
      
      await expect(input).toHaveValue('Test message');
    });

    test('clears input on send', async ({ page }) => {
      await page.goto('/app');

      const input = page.getByPlaceholder(/Ask anything/i);
      await input.fill('Message to send');
      await page.getByRole('button', { name: /Send/i }).click();

      // After sending, input should be cleared
      await expect(input).toHaveValue('');
    });

    test('shows welcome message when no conversation', async ({ page }) => {
      await page.goto('/app');

      await expect(page.getByText('Welcome to Corporate Brain')).toBeVisible();
      await expect(page.getByText('Ask anything about your company knowledge')).toBeVisible();
    });
  });

  test.describe('Omnibox', () => {
    test('opens command palette with keyboard shortcut', async ({ page }) => {
      await page.goto('/app');

      await page.keyboard.press('Control+k');
      
      await expect(page.getByPlaceholder(/Search commands/i)).toBeVisible();
    });

    test('closes command palette on Escape', async ({ page }) => {
      await page.goto('/app');

      await page.keyboard.press('Control+k');
      await expect(page.getByPlaceholder(/Search commands/i)).toBeVisible();
      
      await page.keyboard.press('Escape');
      await expect(page.getByPlaceholder(/Search commands/i)).not.toBeVisible();
    });
  });

  test.describe('Context Map', () => {
    test('toggles context map visibility', async ({ page }) => {
      await page.goto('/app');

      const toggleButton = page.getByText('Show Context Map');
      await toggleButton.click();

      await expect(page.getByText('Hide Context Map')).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('adapts to mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/app');

      // On mobile, sidebar might be hidden or collapsed
      await expect(page.getByPlaceholder(/Ask anything/i)).toBeVisible();
    });

    test('adapts to tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/app');

      await expect(page.getByPlaceholder(/Ask anything/i)).toBeVisible();
      await expect(page.getByText('Corporate Brain')).toBeVisible();
    });
  });
});
