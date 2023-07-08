import { el } from "redom";

export default class DropdownBtn {
    _dropdown; // HTML-элемент для отображения выбранного значения
    _options; // HTML-элемент для отображения списка опций
    _sortCallback; // Функция обратного вызова для обработки выбора опции

    constructor() {
        this._dropdown = el('button.btn-reset.dropdown-selected', 'Сортировка'); // Кнопка для отображения выбранного значения
        this._options = el( // Список опций
            'ul.list-reset.dropdown-options',
            el('li.dropdown-option', { 'data-type': 'number' }, 'По номеру'),
            el('li.dropdown-option', { 'data-type': 'balance' }, 'По балансу'),
            el('li.dropdown-option', { 'data-type': 'transaction' }, 'По последней транзакции')
        );
        this._container = el('div.dropdown.accounts__dropdown', this._dropdown, this._options); // Контейнер для всего компонента
        this.initDropdown();
    }

    // Метод для установки функции обратного вызова
    setSortCallback(callback) {
        this._sortCallback = callback;
    }

    initDropdown() {
        const buttonDropdown = this._container.querySelector('.dropdown-selected');
        const listDropdown = this._container.querySelector('.dropdown-options');
        const itemsDropdown = listDropdown.querySelectorAll('.dropdown-option');

        // Обработчик клика по кнопке
        buttonDropdown.addEventListener('click', (event) => {
            event.preventDefault();
            listDropdown.classList.toggle('menu-active');
            buttonDropdown.classList.toggle('active');
        });

        // Обработчики клика по опциям
        itemsDropdown.forEach((item) => {
            item.addEventListener('click', (event) => {
                event.stopPropagation();
                buttonDropdown.textContent = item.innerText;
                buttonDropdown.focus();
                listDropdown.classList.remove('menu-active');
                buttonDropdown.classList.remove('active');

                // Вызов функции обратного вызова при выборе опции
                if (this._sortCallback) {
                    const selectedOption = item.getAttribute('data-type');
                    this._sortCallback(selectedOption);
                }
            });
        });

        // Обработчик клика вне выпадающего списка
        document.addEventListener('click', (event) => {
            if (event.target !== buttonDropdown) {
                listDropdown.classList.remove('menu-active');
                buttonDropdown.classList.remove('active');
            }
        });
    }

    get html() {
        return this._container;
    }
}

