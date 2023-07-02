import React from 'react';
import { initStore } from '../../src/client/store';

import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import { render } from '@testing-library/react';
import '@testing-library/jest-dom'

import { Application } from '../../src/client/Application';
import { CartApi, ExampleApi } from '../../src/client/api';

const checkPageExists = (route: string, selector: string) => {
  const store = initStore(new ExampleApi("/"), new CartApi());
  const application = (
    <MemoryRouter initialEntries={[route]}>
      <Provider store={store}>
        <Application />
      </Provider>
    </MemoryRouter>
  );

  const { container } = render(application);

  const elementWithClassName = container.querySelector(selector);

  expect(elementWithClassName).toBeInTheDocument();
}

describe('В магазине должны быть страницы: главная, каталог, условия доставки, контакты', () => {
    it('Присутсвует страница "Главная"', () => {
      checkPageExists("/", ".Home")
    });
    it('Присутсвует страница "Каталог"', () => {
      checkPageExists("/catalog", ".Catalog")
    });
    it('Присутсвует страница "Условия доставки"', () => {
      checkPageExists("/delivery", ".Delivery")
    });
    it('Присутсвует страница "Контакты"', () => {
      checkPageExists("/contacts", ".Contacts")
    });
});
