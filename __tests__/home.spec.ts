// tests/home.spec.js
import { expect, test } from "@playwright/test";

test("drag the box and verify final position by name", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.waitForFunction(() => window.currentScene !== undefined);

  const canvas = await page.$("canvas");
  const box = await canvas?.boundingBox();

  if (!box) {
    throw new Error("Canvas bounding box not found");
  }

  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 100, startY, { steps: 10 });
  await page.mouse.up();

  const finalPos = await page.evaluate(() => {
    const scene = window.currentScene;

    return scene?.getObjectByName("MyBox")?.position.toArray();
  });

  expect(finalPos).not.toBeNull();
  expect(finalPos?.[0]).toBeCloseTo(1, 1);
  expect(finalPos?.[1]).toBeCloseTo(0, 1);
  expect(finalPos?.[2]).toBe(0);
});
