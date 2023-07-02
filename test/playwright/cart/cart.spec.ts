import { test, expect, Page } from "@playwright/test";

const cartDefault = {
    0: { name: "Incredible Ball", count: 1, price: 100 },
    1: { name: "Refined Soap", count: 2, price: 200 },
    2: { name: "Fantastic Car", count: 3, price: 300 },
    3: { name: "Handmade Keyboard", count: 4, price: 400 },
};
const cartEmpty = {};

const preparePage = async (page: Page, cart: Record<string, object>) => {
    await page.addInitScript((value) => {
        localStorage.setItem("example-store-cart", JSON.stringify(value));
    }, cart);

    await page.goto("cart");
};

test.describe("Корзина", () => {
    test(`В шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней`, async ({
        page,
    }) => {
        await preparePage(page, cartDefault);

        const linkText = await page
            .getByRole("navigation")
            .getByRole("link", { name: "Cart" })
            .innerText();

        const count = linkText.split(" ")[1].slice(1, -1);

        await expect(Number(count)).toEqual(Object.keys(cartDefault).length);
    });
    test("В корзине должна отображаться таблица с добавленными в нее товарами", async ({
        page,
    }) => {
        await preparePage(page, cartDefault);

        const table = await page.getByRole("table");

        await expect(table).toHaveScreenshot();
    });
    test.describe("для каждого товара должны отображаться название, цена, количество , стоимость, а также должна отображаться общая сумма заказа", () => {
        test("Отображается название", async ({ page }) => {
            await preparePage(page, cartDefault);
            const table = await page.getByRole("table");

            for (let item of Object.values(cartDefault)) {
                const element = await table
                    .locator(".Cart-Name")
                    .getByText(item.name);
                await expect(element).toBeVisible();
            }
        });
        test("Отображается цена", async ({ page }) => {
            await preparePage(page, cartDefault);
            const table = await page.getByRole("table");

            for (let item of Object.values(cartDefault)) {
                const element = await table
                    .locator(".Cart-Price")
                    .getByText(`$${item.price}`);
                await expect(element).toBeVisible();
            }
        });
        test("Отображается количество", async ({ page }) => {
            await preparePage(page, cartDefault);
            const table = await page.getByRole("table");

            for (let item of Object.values(cartDefault)) {
                const element = await table
                    .locator(".Cart-Count")
                    .getByText(String(item.count));
                await expect(element).toBeVisible();
            }
        });
        test("Отображается стоимость", async ({ page }) => {
            await preparePage(page, cartDefault);
            const table = await page.getByRole("table");

            for (let item of Object.values(cartDefault)) {
                const cost = item.price * item.count;
                const element = await table
                    .locator(".Cart-Total")
                    .getByText(`$${cost}`);
                await expect(element).toBeVisible();
            }
        });
    });
    test(`В корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться`, async ({
        page,
    }) => {
        await preparePage(page, cartDefault);

        await page.getByRole("button", { name: "Clear shopping cart" }).click();

        const cartLocalStorage = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem("example-store-cart"));
        });

        await expect(cartLocalStorage).toEqual(cartEmpty);
    });
    test(`Если корзина пустая, должна отображаться ссылка на каталог товаров`, async ({
        page,
    }) => {
        await preparePage(page, cartEmpty);

        const link = await page.getByRole("link", {
            name: "catalog",
            exact: true,
        });

        await expect(link).toBeVisible();
    });
});
