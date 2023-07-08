import { el } from "redom";

export default class ExchangeForm {
    // Регулярное выражение для проверки ввода числа
    static REGEX_FLOAT = /^(\d|[1-9]+\d*|0\.\d+|[1-9]+\d*\.\d+)$/;

    // Классы CSS для элементов формы
    static CSS_CLASSES = {
        FORM: 'form currencies-exchange__form',
        SELECT: 'select currencies-exchange__form-select',
        INPUT: 'input currencies-exchange__form-input',
        BUTTON: 'currencies-exchange__form-submit btn-reset btn',
    };

    _sourceDropdown; // Выпадающий список для выбора отправителя
    _destDropdown; // Выпадающий список для выбора получателя
    _amountInput; // Поле для ввода суммы
    _btnSubmit; // Кнопка отправки формы
    _container; // Контейнер для всего компонента

    constructor() {
        // Создание элементов формы
        this._sourceDropdown = el('select', { className: ExchangeForm.CSS_CLASSES.SELECT, name: 'from' });
        this._destDropdown = el('select', { className: ExchangeForm.CSS_CLASSES.SELECT, name: 'to' });
        this._amountInput = el('input', { className: ExchangeForm.CSS_CLASSES.INPUT, name: 'amount' });
        this._btnSubmit = el('button', { className: ExchangeForm.CSS_CLASSES.BUTTON, type: 'submit', disabled: true }, 'Обменять');

        // Создание формы
        this._form = el('form', { className: ExchangeForm.CSS_CLASSES.FORM }, [
            el('h2.currencies-exchange__title', 'Обмен валюты'),
            el('.currencies-exchange__form-container', [
                el('.currencies-exchange__form-left', [
                    el('.currencies-exchange__form-top', [
                        el('.currencies-exchange__form-wrap', [
                            el('label.currencies-exchange__form-label', 'Из'),
                            this._sourceDropdown,
                            el('label.currencies-exchange__form-label', 'в'),
                            this._destDropdown,
                        ]),
                    ]),
                    el('.currencies-exchange__form-bottom', [
                        el('label.currencies-exchange__form-label', 'Сумма'),
                        el('.currencies-exchange__form-wrap form__wrapper', [
                            el('p.input-error-text', ''),
                            this._amountInput,
                            el('.input-success-icon', ''),

                        ]),
                    ]),
                ]),
                this._btnSubmit,
            ]),
        ]);

        // Создание контейнера
        this._container = el('.currencies-exchange', [this._form]);

        // Назначение обработчиков событий
        this._sourceDropdown.addEventListener('change', this.handleInputChange.bind(this));
        this._destDropdown.addEventListener('change', this.handleInputChange.bind(this));
        this._amountInput.addEventListener('input', this.handleInputChange.bind(this));
    }

    // Обработчик изменения значений полей формы
    handleInputChange() {
        const errorText = this._form.querySelector('.input-error-text')
        this._amountInput.classList.remove('input-error', 'input-success');
        errorText.textContent = '';
        this.checkSubmit();
    }

    // Проверка и установка состояния кнопки отправки формы
    checkSubmit() {
        this._btnSubmit.disabled = (this._amountInput.value.length == 0);
    }

    // Установка доступных валют для выбора отправителя
    set userCurrencies(currencies) {
        this._userCurrencies = currencies;
        currencies.forEach((element) => {
            this._sourceDropdown.append(el('option', element));
        });
    }

    // Установка доступных валют для выбора получателя
    set availableCurrencies(currencies) {
        this._availableCurrencies = currencies;
        currencies.forEach((element) => {
            this._destDropdown.append(el('option', element));
        });
    }

    // Добавление обработчика события отправки формы
    addSubmit(onSubmit) {
        this._form.addEventListener('submit', (e) => {
            e.preventDefault();
            this._amountInput.classList.remove('input-error');
            // this._amountInput.nextElementSibling.textContent = '';

            onSubmit(this, {
                from: this._sourceDropdown.value,
                to: this._destDropdown.value,
                amount: this._amountInput.value,
            });
        });
    }

    setError(input, text) {
        // Устанавливаем ошибку для указанного поля ввода
        if (input === 'amount') {
            console.log(text)
            const errorText = this._form.querySelector('.input-error-text')
            this._amountInput.classList.add('input-error');
            errorText.textContent = text;
        } else {
            return
        }
    }

    setSuccess(input) {
        // Устанавливаем показатель успешной отправки для указанного поля ввода
        if (input === 'amount') {
            this._amountInput.classList.add('input-success');
        } else {
            return
        }
    }
    // Сброс значений полей формы
    reset() {
        this._amountInput.value = '';
        this._amountInput.nextElementSibling.textContent = '';
        const errorText = this._form.querySelector('.input-error-text');
        errorText.textContent = '';
    }

    get html() {
        return this._container;
    }

}



