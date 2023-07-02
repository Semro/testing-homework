import { test, expect, Page, request } from "@playwright/test";

const cartDefault = {
    0: { name: "Incredible Ball", count: 1, price: 100 },
    1: { name: "Refined Soap", count: 2, price: 200 },
    2: { name: "Fantastic Car", count: 3, price: 300 },
    3: { name: "Handmade Keyboard", count: 4, price: 400 },
};

const checkoutResponse = { id: 1 };

test.describe("Форма покупки", () => {
    test("Должно появится уведомление об успешном оформлении заказа", async ({
        page,
    }) => {
        await page.route("**/api/checkout", (route) => {
            route.fulfill({ json: checkoutResponse });
        });

        await page.addInitScript((value) => {
            localStorage.setItem("example-store-cart", JSON.stringify(value));
        }, cartDefault);

        await page.goto("cart");

        await page.getByLabel("Name").fill("TestName");
        await page.getByLabel("Phone").fill("81234567890");
        await page.getByLabel("Address").fill("TestAddress");
        await page.getByRole("button", { name: "Checkout" }).click();

        await expect(page).toHaveScreenshot();
    });

    test("Введены корректные данные в форму", async ({ page }) => {
        await page.addInitScript((value) => {
            localStorage.setItem("example-store-cart", JSON.stringify(value));
        }, cartDefault);

        await page.route("**/api/checkout", (route) => {
            route.abort();
        });

        await page.goto("cart");

        await page.getByLabel("Name").fill("TestName");
        await page.getByLabel("Phone").fill("8901234567");
        await page.getByLabel("Address").fill("TestAddress");

        await page.getByRole("button", { name: "Checkout" }).click();

        const errorName = await page.getByText("Please provide your name");
        const errorPhone = await page.getByText("Please provide a valid phone");
        const errorAddress = await page.getByText(
            "Please provide a valid address"
        );

        await expect(errorName).not.toBeVisible();
        await expect(errorPhone).not.toBeVisible();
        await expect(errorAddress).not.toBeVisible();
    });
});
