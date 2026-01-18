import { test, expect } from '@playwright/test';

test.describe('Cart Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Go to products page where product cards exist
        await page.goto('/products');
    });

    test('should allow adding a product to cart', async ({ page }) => {
        // Wait for products to load
        await page.waitForSelector('.product-card', { timeout: 10000 });

        // Click on the first product
        const firstProduct = page.locator('.product-card').first();
        const productName = await firstProduct.locator('h3').innerText();
        await firstProduct.click();

        // Verify we are on details page
        await expect(page).toHaveURL(/\/product\//);

        // Select a size (required)
        await page.click('button.size-btn:first-child');

        // Handle Alert
        page.on('dialog', dialog => dialog.accept());

        // Add to Bag
        await page.click('button:has-text("ADD TO BAG")');

        // Go to Cart manually (since app doesn't redirect)
        await page.goto('/cart');

        // Verify item is in cart
        const cartItem = page.locator('.cart-item').first();
        await expect(cartItem).toBeVisible();
        await expect(cartItem).toContainText(productName);
    });
});
