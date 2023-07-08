import { el } from "redom";

export default class CurrencyRate {
    _pairs = []; // Массив пар валют
    _list; // Список для отображения курсов валют
    _container; // Контейнер для всего компонента

    constructor() {
        this._list = el('ul.currencies-rate__list list-reset'); // Создание HTML-элемента списка
        this._container = el('.currencies-rate', [ // Создание контейнера для всего компонента
            el('h2.currencies-rate__title', 'Изменение курсов в реальном времени'), // Заголовок компонента
            this._list, // Добавление списка в контейнер
        ]);
    }

    // Метод для добавления нового курса валюты или обновления существующего
    addNewRate(newRate) {
        const index = this._pairs.findIndex(
            (element) => element.from === newRate.from && element.to === newRate.to
        );
        if (index !== -1) {
            // Если пара валют уже существует, заменяем элемент списка на новый
            this._list.replaceChild(newRate.html, this._pairs[index].html);
            this._pairs[index] = newRate; // Обновляем пару валют в массиве
        } else {
            // Если пары валюты нет, добавляем новую пару в массив и в список
            this._pairs.push(newRate);
            this._list.appendChild(newRate.html);
        }
    }

    get html() {
        return this._container;
    }
}
