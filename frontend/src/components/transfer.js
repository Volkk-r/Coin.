import { el } from "redom";

export default class Transfer {
    _inputAccount; // Поле ввода номера счета получателя
    _inputAmount; // Поле ввода суммы перевода
    _btnSubmit; // Кнопка отправки перевода
    _form; // Форма перевода
    _container; // Контейнер формы

    _onSubmit; // Обработчик события отправки перевода

    constructor(account, transferSubmit = null) {
        this._account = account;
        this._onSubmit = transferSubmit;

        // Создаем элементы формы (поля ввода и кнопку отправки)
        this._inputAccount = el('input.input form__input', {
            type: 'text',
            placeholder: 'Счёт получателя',
            name: 'account',
        });
        this._inputAmount = el('input.input form__input', {
            type: 'text',
            placeholder: 'Сумма перевода',
            name: 'amount',
        });
        this._btnSubmit = el('button.btn-reset.form__btn.btn', {
            type: 'submit',
            disabled: 'true',
        }, 'Отправить');

        // Создаем контейнер формы
        this._container = el('.account__transfer', [
            el('h2.account__transfer-title', 'Новый перевод'),
            (this._form = el('form.form account__transfer-form', [
                el('.form__wrapper', [
                    el('label.form__label label-account', 'Номер счёта получателя'),
                    this._inputAccount,
                    el('p.input-error-text', '')
                ]),
                el('.form__wrapper', [
                    el('label.form__label label-amount', 'Сумма перевода'),
                    this._inputAmount,
                    el('p.input-error-text', '')
                ]),
                this._btnSubmit,
            ]))
        ]);

        // Добавляем обработчик события отправки формы
        this._form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Вызываем обработчик отправки перевода и передаем данные формы
            this._onSubmit(this, {
                from: this._account,
                to: this._inputAccount.value,
                amount: this._inputAmount.value,
            });
        });

        // Добавляем обработчики событий ввода в полях ввода
        this._inputAccount.addEventListener('input', (e) => {
            this._inputAccount.classList.remove('input-error');
            this._inputAccount.nextElementSibling.textContent = '';
            const inputValue = e.target.value;
            const numericValue = inputValue.replace(/[^0-9]/g, '');

            if (inputValue !== numericValue) {
                e.target.value = numericValue;
            }
            this.checkSubmit();
        });
        this._inputAmount.addEventListener('input', (e) => {
            this._inputAmount.classList.remove('input-error');
            this._inputAmount.nextElementSibling.textContent = '';
            const inputValue = e.target.value;
            const numericValue = inputValue.replace(/[^0-9]/g, '');

            if (inputValue !== numericValue) {
                e.target.value = numericValue;
            }
            this.checkSubmit();
        })
    }

    checkSubmit() {
        // Проверяем, должна ли кнопка отправки быть активной
        this._btnSubmit.disabled = (this._inputAmount.value.length == 0) || (this._inputAccount.value.length == 0);
    }

    setError(input, text) {
        // Устанавливаем ошибку для указанного поля ввода
        if (input === 'amount') {
            this._inputAmount.classList.add('input-error');
            this._inputAmount.nextElementSibling.textContent = text;
        } else if (input === 'account') {
            this._inputAccount.classList.add('input-error');
            this._inputAccount.nextElementSibling.textContent = text;
        }
    }

    reset() {
        // Сбрасываем значения полей ввода
        this._inputAccount.value = '';
        this._inputAmount.value = '';
    }

    get html() {
        // Возвращаем HTML-контейнер формы
        return this._container;
    }
}
