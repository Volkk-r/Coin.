import { el } from "redom";
import AccountDetails from "./account";
import AccountChart from "../components/chart";

export default class HistoryPage extends AccountDetails {
    _ratioChart;

    constructor({ account, rows }) {
        // Вызов конструктора класса-родителя AccountDetails
        super({ account, rows });

        // Инициализация дополнительных полей класса HistoryPage
        this._dynamicChart = new AccountChart(account, 'dynamics', 12);
        this._ratioChart = new AccountChart(account, 'ratio', 12);
        this._btnBack = el('a.btn-reset.account__back-btn.btn', {
            href: `/account`,
            'data-navigo': '',
        }, 'Вернуться назад');

        // Создание контейнера страницы "Просмотр истории счёта"
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
                        (this._balanceContainer = el('span.account__balance-number', this.balanceFormat)),
                    ]),
                ]),
            ]),
            el('.account__center-container', [
                el('.account__history-charts', [
                    el('.account__dynamic account__chart', [this._dynamicChart.html]),
                    el('.account__ratio account__chart', [this._ratioChart.html]),
                ]),
            ]),
            el('.account__bottom-container', this._transactionsTable.html),
        ]);
    }
}
