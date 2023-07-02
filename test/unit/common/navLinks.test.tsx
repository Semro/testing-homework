import React from "react";
import { initStore } from "../../../src/client/store";

import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Application } from "../../../src/client/Application";
import { CartApi, ExampleApi } from "../../../src/client/api";

const routes = {
    Каталог: "/catalog",
    "Условия доставки": "/delivery",
    Контакты: "/contacts",
    Корзина: "/cart",
};

describe("В шапке отображаются ссылки на страницы магазина, а также ссылка на корзину", () => {
    const store = initStore(new ExampleApi("/"), new CartApi());
    const application = (
        <MemoryRouter initialEntries={["/"]}>
            <Provider store={store}>
                <Application />
            </Provider>
        </MemoryRouter>
    );

    const { container } = render(application);

    const nav = container.querySelector("nav");

    for (let [routeName, routePath] of Object.entries(routes)) {
        const link = nav.querySelector(`[href="${routePath}"]`);

        it(`Отображается ссылка на страницу "${routeName}"`, () => {
            expect(link.tagName === "A")
        })
    }
});
