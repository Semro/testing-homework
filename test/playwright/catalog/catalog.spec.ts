import { test, expect, Page, webkit } from "@playwright/test";

const HEIGHT = 1080;
const WIDTH = 1920;

const products = [
    {
        id: 0,
        name: "Incredible Ball",
        price: 100,
    },
    {
        id: 1,
        name: "Refined Soap",
        price: 200,
    },
    {
        id: 2,
        name: "Fantastic Car",
        price: 300,
    },
    {
        id: 3,
        name: "Handmade Keyboard",
        price: 400,
    },
];

const productDetails = {
    id: 0,
    name: "Incredible Ball",
    description:
        "Carbonite web goalkeeper gloves are ergonomically designed to give easy fit",
    price: 783,
    color: "orange",
    material: "Rubber",
};

const cart = {
    0: { name: "Incredible Ball", count: 1, price: 100 },
    1: { name: "Refined Soap", count: 2, price: 200 },
    2: { name: "Fantastic Car", count: 3, price: 300 },
    3: { name: "Handmade Keyboard", count: 4, price: 400 },
};

const preparePage = async (page: Page) => {
    await page.setViewportSize({
        width: WIDTH,
        height: HEIGHT,
    });

    await page.route("**/api/products", (route) => {
        route.fulfill({ json: products });
    });

    await page.goto("catalog");
};

const prepareDetailsPage = async (page: Page) => {
    await page.route("**/api/products/0", (route) => {
        route.fulfill({ json: productDetails });
    });

    await page.goto("catalog/0");
};

const addItemToCart = async (page: Page) => {
    await page.goto("catalog/1");
    const addButton = await page.getByRole("button", {
        name: "Add to Cart",
    });
    await addButton.click();
    await page.goto("cart");
};

const getItemCount = async (page: Page) => {
    const itemRow = await page.getByTestId("1");
    return await itemRow.getByRole("cell").nth(2).innerText;
};

test.describe("Каталог", () => {
    test("В каталоге должны отображаться товары, список которых приходит с сервера", async ({
        page,
    }) => {
        await preparePage(page);

        await expect(page).toHaveScreenshot({ fullPage: true });
    });

    test.describe("Для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре", () => {
        test("Отображаются названия", async ({ page }) => {
            await preparePage(page);

            for (let product of products) {
                await expect(
                    page.getByRole("heading", { name: product.name })
                ).toBeVisible();
            }
        });
        test("Отображаются цены", async ({ page }) => {
            await preparePage(page);

            for (let product of products) {
                await expect(page.getByText(`$${product.price}`)).toBeVisible();
            }
        });
        test("Отображаются ссылки", async ({ page }) => {
            await preparePage(page);

            for (let product of products) {
                const card = page.getByTestId(String(product.id)).first();
                const link = card.getByRole("link", { name: "Details" });
                await expect(link).toBeVisible();
            }
        });
    });
    test.describe(`На странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка "добавить в корзину"`, () => {
        test("Отображается название", async ({ page }) => {
            await prepareDetailsPage(page);

            const element = await page.getByRole("heading", {
                name: productDetails.name,
            });

            await expect(element).toBeVisible();
        });
        test("Отображается описание", async ({ page }) => {
            await prepareDetailsPage(page);

            const element = await page.getByText(productDetails.description);

            await expect(element).toBeVisible();
        });
        test("Отображается цена", async ({ page }) => {
            await prepareDetailsPage(page);

            const element = await page.getByText(`$${productDetails.price}`);

            await expect(element).toBeVisible();
        });
        test("Отображается цвет", async ({ page }) => {
            await prepareDetailsPage(page);

            const element = await page.getByText(productDetails.color);

            await expect(element).toBeVisible();
        });
        test("Отображается материал", async ({ page }) => {
            await prepareDetailsPage(page);

            const element = await page.getByText(productDetails.material);

            await expect(element).toBeVisible();
        });
        test("Отображается кнопка", async ({ page }) => {
            await prepareDetailsPage(page);

            const element = await page.getByRole("button", {
                name: "Add to Cart",
            });

            await expect(element).toHaveScreenshot();
        });
    });

    test("Если товар уже добавлен в корзину, в каталоге и на странице товара должно отображаться сообщение об этом", async ({
        page,
    }) => {
        await page.goto("catalog/1");
        const addButton = await page.getByRole("button", {
            name: "Add to Cart",
        });
        await addButton.click();
        const message = await page.getByText("Item in cart");
        await expect(message).toBeVisible();

        await page.goto("catalog");
        const itemCard = await page.getByTestId("1").first();
        const messageInCatalog = await itemCard.getByText("Item in cart");

        await expect(messageInCatalog).toBeVisible();
    });

    test(`Если товар уже добавлен в корзину, повторное нажатие кнопки "добавить в корзину" должно увеличивать его количество`, async ({
        page,
    }) => {
        await addItemToCart(page);

        const firstCount = await getItemCount(page);

        await addItemToCart(page);

        const secondCount = await getItemCount(page);

        await expect(Number(firstCount) + 1).toBe(Number(secondCount));
    });

    test(`Содержимое корзины должно сохраняться между перезагрузками страницы`, async ({
        page,
    }) => {
        await page.goto("cart");

        await page.addInitScript((value) => {
            localStorage.setItem("example-store-cart", JSON.stringify(value));
        }, cart);

        await page.reload();

        for (let item of Object.values(cart)) {
            const itemElement = await page.getByText(item.name);
            await expect(itemElement).toBeVisible();
        }
    });
});
