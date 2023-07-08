import { el } from 'redom';

export default class Header {
    _navigation; // Элемент навигации
    _logo; // Логотип
    _activeNav; // Флаг активности навигации
    _container; // Контейнер компонента
    _headerContainer; // Контейнер заголовка

    constructor() {
        // Создание элементов навигации
        this._navigation = el(
            'ul.header__list list-reset', [
            el(
                'li.header__item',
                el('a.header__link', 'Банкоматы', {
                    href: '/map',
                    'data-navigo': '',
                })
            ),
            el(
                'li.header__item',
                el('a.header__link', 'Счета', {
                    href: '/account',
                    'data-navigo': '',
                })
            ),
            el(
                'li.header__item',
                el('a.header__link', 'Валюта', {
                    href: '/currency',
                    'data-navigo': '',
                })
            ),
            el(
                'li.header__item',
                el('a.header__link', 'Выйти', {
                    href: '/logout',
                    'data-navigo': '',
                })
            ),
        ]);

        this._logo = el('h1.header__logo', 'Coin.'); // Создание логотипа

        this._headerContainer = el('div.header__container container', [
            this._logo
        ]); // Создание контейнера заголовка

        this._container = el('header.header', this._headerContainer); // Создание контейнера компонента
    }

    // Добавление элемента навигации
    addNavigation() {
        if (!this._activeNav) {
            this._headerContainer.append(this._navigation);
        }
        this._activeNav = !this._activeNav;
    }

    // Удаление элемента навигации
    removeNavigation() {
        if (this._activeNav) {
            this._navigation.remove();
        }
        this._activeNav = !this._activeNav;
    }

    get html() {
        return this._container;
    }
}