describe('Перевод средств', () => {
  beforeEach(() => {
    // Переход на страницу авторизации перед каждым тестом
    cy.visit('http://localhost:8080/login');
    cy.get('input[name="login"]').type('developer');
    cy.get('input[name="password"]').type('skillbox');
    cy.get('.form__btn-submit').click();
    cy.get('.accounts__item').first().find('.accounts__btn-open').click();
  });

  it('Переход на детали счета при нажатии на кнопку', () => {
    cy.url().should('include', '/account');
    cy.get('.account').should('exist');
    cy.get('.account__transfer').should('exist');
  });

  it('Проводим проверку полей формы', () => {
    // Первый тест - провальный вариант
    cy.get('input[name="account"]').type('50310');
    cy.get('input[name="amount"]').type('1111');
    cy.get('.form__btn').click();
    cy.get('input[name="account"]').should('have.class', 'input-error');

    // // Второй тест - провальный вариант
    cy.get('input[name="account"]').clear().type('80628115738344270568085771');
    cy.get('input[name="amount"]').clear().type('40000000');
    cy.get('.form__btn').click();
    cy.get('input[name="amount"]').should('have.class', 'input-error');

    //Третий тест - успешный вариант
    cy.get('input[name="account"]').clear().type('80628115738344270568085771');
    cy.get('input[name="amount"]').clear().type('40');
    cy.get('.form__btn').click();
    cy.contains('.--negative', '- 40').should('exist');
  });
});
