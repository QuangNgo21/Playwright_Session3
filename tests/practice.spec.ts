import { test, expect } from '@playwright/test';
import path from 'path';


test('TC001 - Verify Checkboxes ', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/');
  await page.getByRole('link').filter({ hasText: "checkboxes" }).click();
  expect(page.getByRole('heading')).toHaveText("Checkboxes")
  let firstCheckbox = page.getByRole('checkbox').first();
  await firstCheckbox.check();
  await expect(firstCheckbox).toBeChecked();
  let lastCheckbox = page.getByRole('checkbox').last();
  await lastCheckbox.uncheck();
  await expect(lastCheckbox).not.toBeChecked();
});

test('TC002 - Verify Drag and Drop', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/');
  await page.getByRole('link').filter({ hasText: "Drag and Drop" }).click();
  expect(page.getByRole('heading')).toHaveText("Drag and Drop")
  let firstColumn = page.locator('.column').first();
  let secondColumn = page.locator('.column').last();
  await firstColumn.dragTo(secondColumn);
  await expect(firstColumn).toHaveText('B');
});

test('TC003 - Verify Dropdown', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/');
  await page.getByRole('link').filter({ hasText: "Dropdown" }).click();
  expect(page.getByRole('heading')).toHaveText("Dropdown List")
  await page.selectOption('#dropdown', 'Option 2');
  await expect.soft(page.locator('#dropdown')).toHaveValue('2')
  await page.locator('#dropdown').selectOption({ value: '1' });
  await expect(page.locator('#dropdown')).toHaveValue('1')
});

test('TC004 - Verify Frame ', async ({ page }) => {
  await page.goto('https://www.globalsqa.com/demo-site/frames-and-windows');
  await page.getByRole('tab').filter({ hasText: "IFRAME" }).click();
  let frame = page.frameLocator('iframe[name="globalSqa"]')
  await frame.getByRole('textbox').fill('Playwright');
  await expect(frame.getByRole('textbox')).toHaveValue('Playwright');
  await frame.locator('.button_search').click();
  await expect(frame.locator('.search_res')).toHaveText('Sorry, no posts matched your criteria.');
});

test('TC005 - Upload File', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/');
  await page.getByRole('link').filter({ hasText: "File Upload" }).click();
  await page.waitForLoadState('domcontentloaded');
  await expect(page.getByRole('heading')).toHaveText("File Uploader")
  await page.locator('#file-upload').setInputFiles(path.join(__dirname, 'tmp.txt'));
  await page.getByRole('button', { name: "Upload" }).click();
  await expect(page.getByRole('heading')).toHaveText('File Uploaded!');
  await expect(page.locator('#uploaded-files')).toHaveText('tmp.txt')
});

test('TC006 - Verify Dynamically Loaded Page Elements', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/');
  await page.getByRole('link').filter({ hasText: "Dynamic Loading" }).click();
  await expect(page.getByRole('heading')).toHaveText('Dynamically Loaded Page Elements')
  await page.getByText('Example 1').click();
  await expect(page.getByRole('heading').filter({ hasText: "Dynamically Loaded" })).toHaveText('Dynamically Loaded Page Elements');
  await page.getByRole('button').click();
  await expect(page.locator('#finish')).toHaveText("Hello World!");
});

test('TC007 - Verify Input', async ({ page }) => {
  await page.goto('https://testautomationpractice.blogspot.com/');
  let nameInput = page.locator('#name');
  nameInput.fill("Nguyen Van A");
  await expect(nameInput).toHaveValue("Nguyen Van A");
  let addressInput = page.locator('#textarea');
  addressInput.fill("2 Tan Vien, Tan Binh, HCMC");
  await expect(addressInput).toHaveValue("2 Tan Vien, Tan Binh, HCMC");

  nameInput.fill("");
  await expect(nameInput).toHaveValue("");
  addressInput.fill("");
  await expect(addressInput).toHaveValue("");
});

test('TC008 - Handle dialog', async ({ page }) => {
  await page.goto('https://testautomationpractice.blogspot.com/');
  await expect(page.getByRole('heading', { name: 'Automation Testing Practice' })).toBeVisible();

  page.on('dialog', async dialog => {
    expect(dialog.message()).toContain('Please enter your name:');
    expect(dialog.defaultValue()).toBe('Harry Potter');
    await dialog.accept('KMSer');
  });

  await page.getByRole('button', { name: "Prompt" }).click();
  let displayedText = page.locator('#demo');
  await expect(displayedText).toHaveText('Hello KMSer! How are you today?');
});