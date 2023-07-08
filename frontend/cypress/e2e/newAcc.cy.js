describe('Новый счет и его работоспособность', () => {
  beforeEach(() => {
    // Переход на страницу авторизации перед каждым тестом
    cy.visit('http://localhost:8080/login');
    cy.get('input[name="login"]').type('developer');
    cy.get('input[name="password"]').type('skillbox');
    cy.get('.form__btn-submit').click();
  });

  it('Происходит добавление нового счета', () => {
    cy.get('.accounts__item').then(($items) => {
      const initialItemCount = $items.length;

      cy.get('.accounts__btn-add').click();

      cy.get('.accounts__item').should('have.length', initialItemCount + 1);
    });
  });

  it('Открытие данных но ныне созданному счету', () => {
    cy.get('.accounts__item')
      .last()
      .find('.accounts__btn-open')
      .click();

    cy.get('section.account').should('exist');
  });
});