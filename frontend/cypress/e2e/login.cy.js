describe('Авторизация', () => {
  beforeEach(() => {
    // Переход на страницу авторизации перед каждым тестом
    cy.visit('http://localhost:8080/login');
  });

  it('Отображение формы авторизации', () => {
    // Проверка отображения блока авторизации
    cy.get('.login').should('be.visible');
  });

  it('Подсвечивание поле логина при некорректном логине', () => {
    // Ввод некорректного логина
    cy.get('input[name="login"]').type('qwerty');
    cy.get('input[name="password"]').type('123456789');
    cy.get('.form__btn-submit').click();

    // Проверка добавления класса "input-error" к полю "login"
    cy.get('input[name="login"]').should('have.class', 'input-error');
  });

  it('Подсвечивание поле пароля при некорректном пароле', () => {
    // Ввод некорректного пароля
    cy.get('input[name="login"]').type('developer');
    cy.get('input[name="password"]').type('123456789');
    cy.get('.form__btn-submit').click();

    // Проверка добавления класса "input-error" к полю "password"
    cy.get('input[name="password"]').should('have.class', 'input-error');
  });

  it('Подсвечивание обоих успешно  введенных данных и переход на страницу с счетами', () => {
    // Ввод корректных учетных данных
    cy.get('input[name="login"]').type('developer');
    cy.get('input[name="password"]').type('skillbox');
    cy.get('.form__btn-submit').click();

    // Проверка добавления класса "input-success" к обоим полям
    cy.get('input[name="login"]').should('have.class', 'input-success');
    cy.get('input[name="password"]').should('have.class', 'input-success');
    // Проверка отображения секции "accounts"
    cy.get('section.accounts').should('be.visible');
  });
});
