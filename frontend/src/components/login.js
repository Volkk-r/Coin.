import { el } from 'redom';

export default class Login {
  _form; // Форма входа
  _loginInput; // Поле ввода логина
  _passwordInput; // Поле ввода пароля
  _passwordIconContainer; // Контейнер иконки пароля
  _loginIconContainer; // Контейнер иконки логина
  _submitBtn; // Кнопка отправки формы
  _container; // Контейнер компонента

  constructor(onSubmit) {
    // Создание элементов формы входа
    this._loginInput = el('input.input form__input', {
      type: 'text',
      placeholder: 'Введите ваш логин',
      name: 'login',
    });
    this._passwordInput = el('input.input form__input', {
      type: 'password',
      placeholder: 'Введите пароль',
      name: 'password',
    });

    this._loginIconContainer = el('.form__icon');
    this._passwordIconContainer = el('.form__icon');

    this._submitBtn = el('button.btn form__btn-submit btn-reset', 'Войти', {
      type: 'submit',
      disabled: 'true',
    });

    // Создание формы входа
    this._form = el('form.login__form form', [
      el('div.form__wrap', [
        el('label.form__label', 'Логин'),
        this._loginInput,
        this._loginIconContainer,
      ]),
      el('div.form__wrap', [
        el('label.form__label', 'Пароль'),
        this._passwordInput,
        this._passwordIconContainer,
      ]),
      this._submitBtn,
    ]);

    // Создание контейнера компонента
    this._container = el('.login', [
      el('.login__block', [
        el('h1.login__title.title', 'Вход в аккаунт'),
        this._form,
      ])
    ]);

    this.onSubmit = onSubmit;

    // Назначение обработчиков событий
    this._loginInput.addEventListener('input', (e) => {
      this.checkSubmitBtn();
      e.target.classList.remove('input-error');
    });
    this._passwordInput.addEventListener('input', (e) => {
      this.checkSubmitBtn();
      e.target.classList.remove('input-error');
    });

    this._form.addEventListener('submit', (e) => {
      e.preventDefault();
      let hasError = false;

      hasError = !this.checkInputValue(this._loginInput);
      hasError = !this.checkInputValue(this._passwordInput);

      console.log('Errors: ', hasError);

      if (hasError) return;

      this.onSubmit(this, {
        event: e,
        login: this._loginInput.value,
        password: this._passwordInput.value,
      });
    });
  }

  // Проверка значения поля ввода
  checkInputValue(input) {
    const regex = /^(\S){6,}$/;
    const value = input.value;
    console.log(`Test:`, regex.test(value));
    if (!regex.test(value)) {
      input.classList.add('input-error');
      return false;
    }
    return true;
  }

  // Проверка состояния кнопки отправки формы
  checkSubmitBtn() {
    const login = this._loginInput.value;
    const password = this._passwordInput.value;

    const test = !(login.length > 0 && password.length > 0);
    this._submitBtn.disabled = test;
  }

  // Установка состояния успешного ввода для указанного поля
  setInputSuccess(input, enabled = true) {
    if (input === 'user') {
      this._loginInput.classList.add('input-success');
    } else if (input === 'password') {
      this._passwordInput.classList.add('input-success');
    }
  }

  // Установка состояния ошибки для указанного поля
  setInputError(input) {
    if (input === 'user') {
      this._loginInput.classList.add('input-error');
    } else if (input === 'password') {
      this._passwordInput.classList.add('input-error');
    }
  }

  get html() {
    return this._container;
  }
}

