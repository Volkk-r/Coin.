import { el, setChildren } from "redom";

export default class UserCurrencies {
    _list; // Список валют
    _currencies = []; // Массив объектов с информацией о валютах пользователя
    _container; // Контейнер списка валют

    constructor() {
        this._list = el('ul.currencies-user__list list-reset');

        // Создаем контейнер списка валют
        this._container = el('.currencies-user', [
            el('h2.currencies-user__title', 'Ваши валюты'),
            this._list,
        ])
    }

    set currencies(array) {
        // Устанавливаем новый массив валют и обновляем контейнер
        this._currencies = array;
        this.updateContainer();
    }

    updateContainer() {
        let currenciesArray = [];

        if (this._currencies) {
            this._currencies.forEach((element) => {
                // Создаем элемент списка для каждой валюты пользователя
                currenciesArray.push(
                    el('li.currencies-user__item', [
                        el('span.currencies-user__item-key', `${element.code}`),
                        el('span.currencies-user__item-value', `${element.amount.toFixed(2)}`),
                    ])
                );
            });
        }
        // Обновляем список валют в контейнере
        setChildren(this._list, currenciesArray);
    }

    get html() {
        // Возвращаем HTML-контейнер списка валют
        return this._container;
    }
}
