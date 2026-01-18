import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('should allow a user to log in', async ({ page }) => {
        // Visit login page
        await page.goto('/login');

        // Fill in credentials
        await page.fill('input[type="email"]', 'admin@example.com');
        await page.fill('input[type="password"]', 'password123');

        // Submit form
        await page.click('button[type="submit"]');

        // Wait for success message to confirm login processed
        await expect(page.getByText('Login Successful')).toBeVisible();

        // Verify redirection and Admin access
        await expect(page).not.toHaveURL('/login');
        await expect(page.getByText('Admin').first()).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
        await page.goto('/login');
        // Intentionally wrong credentials
        await page.fill('input[type="email"]', 'wrong@example.com');
        await page.fill('input[type="password"]', 'wrongpassword');
        await page.click('button[type="submit"]');

        // Check for error message (toast)
        await expect(page.getByText('Invalid email or password')).toBeVisible();
    });
});
