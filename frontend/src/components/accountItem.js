import { el } from 'redom';
import formatNumberWithSpaces from '../helpers/format';

export default class AccountItem {
    constructor(account, balance, transactions) {
        this.account = account; // Номер счета
        this.balance = balance; // Баланс счета
        this.transactions = transactions; // Список транзакций
        this._container = this.renderItem(); // HTML-контейнер элемента счета
    }

    renderItem() {
        // Создание HTML-элементов для отображения информации о счете
        const itemLeft = el('div', { class: 'accounts__item-left' }, [
            el('h3', { class: 'accounts__subtitle' }, this.account), // Заголовок с номером счета
            el('span', { class: 'accounts__price' }, this.format(this.balance) + ' ₽'), // Баланс счета
            el('div', { class: 'accounts__transaction' }, [
                el('span', { class: 'accounts__transaction-text' }, 'Последняя транзакция:'), // Текст "Последняя транзакция:"
                el('span', { class: 'accounts__transaction-date' }, this.getLastTransactionDate()) // Дата последней транзакции
            ])
        ]);

        const itemRight = el('div', { class: 'accounts__item-right' }, [
            el('a.btn accounts__btn-open', 'Открыть', {
                href: `/account/${this.account}`,
                'data-navigo': '',
            }), // Ссылка для открытия подробной страницы счета
        ]);

        // Создание контейнера элемента счета
        return el('div', { class: 'accounts__item' }, [itemLeft, itemRight]);
    }

    getLastTransactionDate() {
        if (this.transactions.length > 0) {
            const lastTransaction = this.transactions[this.transactions.length - 1];
            const date = new Date(lastTransaction.date);
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            return date.toLocaleDateString('ru-RU', options); // Форматирование даты последней транзакции
        }
        return '-'; // Если нет транзакций, возвращается дефис
    }

    format(number) {
        return formatNumberWithSpaces(number); // Форматирование числа с разделителями
    }

    get html() {
        return this._container; // Получение HTML-контейнера элемента счета
    }
}

