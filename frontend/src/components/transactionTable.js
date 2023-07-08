import { el, setChildren } from "redom";

export default class TransactionTable {
    _transactions = []; // Массив транзакций
    _account; // Информация о текущем аккаунте
    _container; // Контейнер таблицы
    _tableRows;
    constructor(account, rows) {
        this._transactions = account.transactions;
        this._account = account.account;
        this._tableRows = rows;
        // Создаем контейнер таблицы с заголовком
        this._container = el('.transactions', [
            el('h2.transactions__title', 'История переводов'),
            el('table.transactions__table', [
                el('thead', [
                    el('tr.transactions__table-row', [
                        el('th.transactions__table-head', 'Счёт отправителя'),
                        el('th.transactions__table-head', 'Счёт получателя'),
                        el('th.transactions__table-head', 'Сумма'),
                        el('th.transactions__table-head', 'Дата'),
                    ]),
                ]),
                el('tbody', []),
            ]),
        ]);

        // Заполняем таблицу данными
        this.createTableRowsWithData();
    }

    createTableRowsWithData() {
        const tableBody = this._container.querySelector('tbody');
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        };

        // Разворачиваем список транзакций и выводим последние 25 транзакций
        const rows = this._transactions.slice(this._tableRows).reverse().map((element) => {
            const isPositive = element.to === this._account;

            // Создаем ячейку суммы транзакции и форматируем ее значение
            const amount = document.createElement('td');
            const formattedAmount = `${isPositive ? '+' : '-'} ${element.amount.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}`;
            amount.textContent = formattedAmount;
            amount.classList.add(isPositive ? '--positive' : '--negative');

            // Создаем строку таблицы с данными транзакции
            return el('tr.transactions__table-row', [
                el('td.transactions__table-cell', element.from),
                el('td.transactions__table-cell', element.to),
                amount,
                el('td.transactions__table-cell', new Date(element.date).toLocaleDateString('ru-RU', options))
            ]);
        });

        // Добавляем строки в тело таблицы
        setChildren(tableBody, rows);
    }

    get html() {
        return this._container;
    }
}
