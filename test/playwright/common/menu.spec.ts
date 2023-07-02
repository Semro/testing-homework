import { test, expect, Page } from "@playwright/test";

const WIDTH = 575;
const HEIGHT = 800;
test.use({
    viewport: {
        width: WIDTH,
        height: HEIGHT,
    },
});

test("При выборе элемента из меню 'гамбургера', меню должно закрываться", async ({
    page,
}) => {
    await page.goto("catalog");

    const navbar = await page.getByRole("navigation");

    await navbar.getByRole("button", { name: "Toggle navigation" }).click();
    await navbar.getByRole("link", { name: "Catalog" }).click();

    await expect(navbar).toHaveScreenshot();
});
