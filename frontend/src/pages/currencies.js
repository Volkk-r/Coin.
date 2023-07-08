
import ExchangeForm from "../components/exchange";
import CurrencyRate from "../components/currencyRates";
import UserCurrencies from "../components/userCurrencies";

import { el } from 'redom';

export default class CurrencyPage {
    _userCurrencies;
    _exchangeForm;
    _currencyRate;
    _currencyBlock;

    constructor() {
        // Создание контейнера страницы "Валютный обмен"
        this._container = el('section.currencies.container', [
            el('h1.title.currencies__title', 'Валютный обмен'),
            (this._currencyBlock = el('.currencies__block')),
        ]);

        // Инициализация компонентов страницы "Валютный обмен"
        this._userCurrencies = new UserCurrencies();
        this._currencyRate = new CurrencyRate();
        this._exchangeForm = new ExchangeForm();

        // Добавление компонентов в блок "currencies__block"
        this._currencyBlock.append(
            this._userCurrencies.html,
            this._currencyRate.html,
            this._exchangeForm.html
        );
    }

    // Установка списка валют пользователя
    set currencies(currencies) {
        const currenciesArray = Array.isArray(currencies) ? currencies : [];
        this._userCurrencies.currencies = currenciesArray;
    }

    // Установка нового курса валюты
    setNewCurrencyRate(rate) {
        const block = this._currencyBlock;
        if (block && rate && rate.html) {
            // Замена текущего курса валюты на новый
            block.replaceChild(rate.html, this._currencyRate.html);
            this._currencyRate = rate;
        }
    }

    // Получение HTML-кода страницы "Валютный обмен"
    get html() {
        return this._container;
    }
}
