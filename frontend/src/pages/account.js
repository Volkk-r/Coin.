import AccountChart from "../components/chart";
import TransactionTable from "../components/transactionTable";
import Transfer from "../components/transfer";
import { el } from "redom";
import formatNumberWithSpaces from "../helpers/format";
export default class AccountDetails {
    _account;
    _balance;
    _dynamicChart;
    _transactionsTable;
    _transfer;
    _balanceContainer;
    _btnBack;
    _clickOnChart;
    _container;

    constructor({ account, chartClick = null, transferSubmit = null, rows }) {
        this._account = account.account;
        this._balance = account.balance;

        // Создаем экземпляры классов для отображения компонентов страницы
        this._transactionsTable = new TransactionTable(account, rows); // Таблица транзакций
        this._transfer = new Transfer(account.account, transferSubmit); // Форма перевода средств
        this._dynamicChart = new AccountChart(account, 'dynamics', 6); // График динамики счета

        this._clickOnChart = chartClick;

        // Кнопка "Вернуться назад"
        this._btnBack = el('a.btn-reset.account__back-btn.btn', {
            href: '/account',
            'data-navigo': '',
        }, 'Вернуться назад');

        // Контейнер страницы просмотра счета
        this._container = el('section.account container', [
            el('.account__header', [
                el('.account__header-top', [
                    el('h1.title.accounts__title', 'Просмотр счёта'),
                    this._btnBack,
                ]),
                el('.account__header-bottom', [
                    el('div.account__id', `№ ${this._account}`),
                    el('div.account__balance', [
                        el('span.account__balance-text', 'Баланс: '),
                        (this._balanceContainer = el('span.account__balance-number', this.balanceFormat + ' ₽')),
                    ]),
                ]),
            ]),
            el('.account__center-container', [
                this._transfer.html, // Вставляем форму перевода средств
                el('.account__charts', [
                    el('.account__dynamic', [this._dynamicChart.html]), // Вставляем график динамики счета
                ]),
            ]),
            el('.account__bottom-container', this._transactionsTable.html), // Вставляем таблицу транзакций
        ]);

        // Обработчик клика по графику динамики счета
        this._dynamicChart.html.addEventListener('click', () => {
            console.log('click!');
            this._clickOnChart();
        });
    }

    // Геттер для получения текущего баланса счета
    get balance() {
        return this._balance;
    }

    // Геттер для получения отформатированного баланса счета с пробелами
    get balanceFormat() {
        return formatNumberWithSpaces(this._balance);
    }

    // Метод для обновления информации о счете
    updateInfo(account) {
        this._account = account.account;
        this._balance = account.balance;
        this._balanceContainer.innerText = this.balanceFormat;
        this._transactionsList = new TransactionTable(account);
        const wrap = this._container.querySelector('.account__bottom-container');
        wrap.replaceChildren(this._transactionsList.html);
    }

    // Метод для сброса формы перевода средств
    resetTransfer() {
        this._transfer.reset();
    }

    // Геттер для получения HTML-кода страницы просмотра счета
    get html() {
        return this._container;
    }
}
