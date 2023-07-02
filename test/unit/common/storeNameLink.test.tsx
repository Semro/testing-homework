import React from "react";
import { initStore } from "../../../src/client/store";

import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Application } from "../../../src/client/Application";
import { CartApi, ExampleApi } from "../../../src/client/api";

const STORE_NAME = "Example store";
const MAIN_LINK_HREF = "/";

describe("Название магазина в шапке должно быть ссылкой на главную страницу", () => {
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
    const navElements = nav.querySelectorAll("*");
    const mainLink = [...navElements].find((el) => el.innerHTML === STORE_NAME);

    it("Название магазина является ссылкой", () => {
        expect(mainLink.tagName === "A");
    });

    it("Ссылка ведёт на главную страницу", () => {
        expect(mainLink).toHaveAttribute("href", MAIN_LINK_HREF);
    });
});
