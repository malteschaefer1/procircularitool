import { expect, test } from '@playwright/test';

test('sample washing machine flow', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('load-sample-wash').click();
  await page.getByTestId('upload-next').click();
  await page.getByTestId('mapping-apply').click();
  await page.getByTestId('calculate-pci').click();
  await expect(page.getByText(/Overall PCI|Gesamt-PCI/)).toBeVisible();
  await page.getByTestId('results-next').click();
  await expect(page.getByText(/Top improvement levers|Top-Hebel/)).toBeVisible();
});
