import { test, expect } from "@playwright/test";

const WIDTH = 576;
const HEIGHT = 1080;

test.describe(`На ширине меньше ${WIDTH}px навигационное меню должно скрываться за "гамбургер"`, () => {
    test(`Гамбургер не отображается при ширине => ${WIDTH}px`, async ({
        page,
    }) => {
        await page.setViewportSize({
            width: WIDTH,
            height: HEIGHT,
        });

        await page.goto("");

        const navbar = await page.getByRole("navigation");

        await expect(navbar).toHaveScreenshot();
    });
    test(`Навигационное меню скрывается за "гамбургер" при ширине < ${WIDTH}px`, async ({
        page,
    }) => {
        await page.setViewportSize({
            width: WIDTH - 1,
            height: HEIGHT,
        });

        await page.goto("");

        const navbar = await page.getByRole("navigation");

        await expect(navbar).toHaveScreenshot();
    });
});
