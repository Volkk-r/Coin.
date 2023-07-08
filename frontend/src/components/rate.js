import { el } from "redom";
//актуальная валюта
export default class Rate {
    _from; // Исходная валюта
    _to; // Целевая валюта
    _rate; // Обменный курс
    _change; // Изменение курса
    _container; // Контейнер элемента курса

    constructor(data) {
        this._from = data.from;
        this._to = data.to;
        this._rate = parseFloat(data.rate).toFixed(5);
        this._change = parseInt(data.change);

        // Создание элемента курса
        this._container = el('li.currencies-rate__item', [
            el('span.currencies-rate__item-key', `${this._from}/${this._to}`),
            el('span.currencies-rate__item-value', `${this._rate}`, {
                'data-change': `${this._change}`,
            }),
        ]);
    }

    // Геттеры для доступа к свойствам
    get from() {
        return this._from;
    }

    get to() {
        return this._to;
    }

    get rate() {
        return this._rate;
    }

    get change() {
        return this._change;
    }

    get html() {
        return this._container;
    }
}
