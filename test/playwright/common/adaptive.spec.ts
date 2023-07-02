import { test, expect } from "@playwright/test";

const widthPoints = [1400, 1200, 992, 768, 576];

const HEIGHT = 1080;

const routes = {
    Главная: "",
    Каталог: "catalog",
    "Условия доставки": "delivery",
    Контакты: "contacts",
    Корзина: "cart",
};

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
        name: "Refined Soap",
        price: 400,
    },
];

const cart = {
    0: { name: "Incredible Ball", count: 1, price: 100 },
    1: { name: "Refined Soap", count: 2, price: 200 },
    2: { name: "Fantastic Car", count: 3, price: 300 },
    3: { name: "Refined Soap", count: 4, price: 400 },
};

const checkAdaptive = (width: number, height: number, routePath: string) => {
    test(`Ширина: ${width}px`, async ({ page }) => {
        await page.setViewportSize({
            width: width,
            height: height,
        });

        await page.route("**/api/products", (route) => {
            route.fulfill({ json: products });
        });

        await page.addInitScript((value) => {
            localStorage.setItem("example-store-cart", JSON.stringify(value));
        }, cart);

        await page.goto(routePath);

        await expect(page).toHaveScreenshot({ fullPage: true });
    });
};

test.describe("Вёрстка должна адаптироваться под ширину экрана", () => {
    for (let [routeName, routePath] of Object.entries(routes)) {
        test.describe(`Страница: "${routeName}"`, () => {
            for (let width of widthPoints) {
                checkAdaptive(width, HEIGHT, routePath);
            }
        });
    }
});
