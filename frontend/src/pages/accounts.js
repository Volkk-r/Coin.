import { el, svg } from 'redom'

import AccountItem from '../components/accountItem'
import DropdownBtn from '../components/dropBtn';

export default class AccountList {
    _accountList;
    _accountListArray = [];
    _btnAdd;
    _dropdown;
    _container;
    onAddAccount;
    _acs = true;

    constructor(onAddAccount = null) {
        // Инициализация компонента выпадающего списка
        this._dropdown = new DropdownBtn();
        this._dropdown.setSortCallback((selectedOption) => {
            this.sortArray(selectedOption, this._acs);
        });

        // Создание контейнера для списка счетов
        this._container = el('section.accounts.container', [
            el('.accounts__header', [
                el('div.accounts__header-left', [
                    el('h2.title.accounts__title', 'Ваши счета'),
                    this._dropdown.html
                ]),
                el('button.btn-reset.accounts__btn-add.btn', 'Создать новый счёт')
            ]),
            el('div.accounts__list'),
        ]);
        this._accountList = this._container.querySelector('.accounts__list');
        this._btnAdd = this._container.querySelector('.accounts__btn-add');

        if (onAddAccount) {
            // Обработчик клика на кнопке "Создать новый счёт"
            this._btnAdd.addEventListener('click', onAddAccount);
        }
    }

    // Метод для добавления нового счета в список
    addAccount(account, balance, transactions) {
        this._accountListArray.push(
            new AccountItem(account, balance, transactions)
        );
        this.updateContainer();
    }

    // Метод для обновления контейнера со списком счетов
    updateContainer() {
        const children = [];
        this._accountListArray.forEach((account) => {
            children.push(account.html);
        });
        this._accountList.replaceChildren(...children);
    }

    // Метод для сортировки списка счетов по заданному критерию
    sortArray(type, asc) {
        const invert = asc ? 1 : -1;

        switch (type) {
            case 'number':
                // Сортировка по номеру счета
                this._accountListArray.sort((a, b) => (a.account - b.account) * invert);
                this._acs = !this._acs;
                break;
            case 'balance':
                // Сортировка по балансу счета
                this._accountListArray.sort((a, b) => (a.balance - b.balance) * invert);
                this._acs = !this._acs;
                break;
            case 'transaction':
                // Сортировка по дате последней транзакции
                this._accountListArray.sort((a, b) => {
                    const date1 = a.transactions.length > 0 ? new Date(a.transactions[0].date) : null;
                    const date2 = b.transactions.length > 0 ? new Date(b.transactions[0].date) : null;

                    if (date1 && date2) {
                        return (date1 < date2 ? -1 : date1 > date2 ? 1 : 0) * invert;
                    } else if (date1 && !date2) {
                        return invert;
                    } else if (!date1 && date2) {
                        return -invert;
                    } else {
                        return 0;
                    }
                });
                this._acs = !this._acs;
                break;
        }

        this.updateContainer();
    }

    // Геттер для получения HTML-кода списка счетов
    get html() {
        return this._container;
    }
}
