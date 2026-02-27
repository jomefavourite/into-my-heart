import { expect, test, type Page } from '@playwright/test';

async function expectRedirectToOnboard(path: string, page: Page) {
  await page.goto(path);
  await expect(page).toHaveURL(/\/onboard(?:\?.*)?$/);
  await expect(page.getByText('Sign in or Create an account')).toBeVisible();
  await expect(page.getByText('Something went wrong')).toHaveCount(0);
}

test('redirects unauthenticated /verses deep link', async ({ page }) => {
  await expectRedirectToOnboard('/verses', page);
});

test('redirects unauthenticated /verses/all-verses deep link', async ({
  page,
}) => {
  await expectRedirectToOnboard('/verses/all-verses', page);
});

test('redirects unauthenticated /verses/all-collections deep link', async ({
  page,
}) => {
  await expectRedirectToOnboard('/verses/all-collections', page);
});
