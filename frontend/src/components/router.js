import Navigo from 'navigo';

export default class Router {
    _router; // Объект маршрутизатора Navigo
    _tokenCheck; // Функция для проверки наличия токена
    _loadMap; // Функция загрузки страницы с картой
    _loadLogin; // Функция загрузки страницы входа
    _loadAccount; // Функция загрузки страницы аккаунта
    _loadAccountDetails; // Функция загрузки страницы деталей аккаунта
    _loadAccountHistory; // Функция загрузки страницы истории аккаунта
    _loadCurrency; // Функция загрузки страницы валюты
    _currencyReady; // Функция выполнения перед покиданием страницы валюты
    _currencyLeave; // Функция выполнения при покидании страницы валюты
    _logout; // Функция выхода из аккаунта

    constructor(handlers) {
        this._tokenCheck = handlers.tokenCheck;
        this._loadMap = handlers.MapPageLoader;
        this._loadLogin = handlers.loginPageLoader;
        this._loadAccount = handlers.accountPageLoader;
        this._loadAccountDetails = handlers.accountDetailsPageLoader;
        this._loadAccountHistory = handlers.historyPageLoader;
        this._loadCurrency = handlers.currencyPageLoader;
        this._currencyReady = handlers.currencyPageReady;
        this._currencyLeave = handlers.currencyPageLeave;
        this._logout = handlers.logoutPageLoader;

        // Создание экземпляра маршрутизатора Navigo
        this._router = new Navigo('/');

        // Функция перед выполнением маршрута
        const before = (done) => {
            const hasToken = this._tokenCheck();
            if (!hasToken) {
                done(false);
                this._router.navigate('login');
            } else {
                done();
            }
        };

        // Определение маршрутов и связанных с ними функций
        this._router.on({
            '/': {
                uses: () => this._router.navigate('account'),
                hooks: { before },
            },
            '/login': () => {
                this._tokenCheck() ? this._router.navigate('account') : this._loadLogin();
            },
            '/account/:id': {
                uses: this._loadAccountDetails,
                hooks: { before },
            },
            '/history/:id': {
                uses: this._loadAccountHistory,
                hooks: { before },
            },
            '/account': {
                uses: this._loadAccount,
                hooks: { before },
            },
            '/currency': {
                uses: this._loadCurrency,
                hooks: {
                    before,
                    after: this._currencyReady,
                    leave: (done) => {
                        this._currencyLeave();
                        done();
                    },
                },
            },
            '/map': {
                uses: this._loadMap,
                hooks: { before },
            },
            '/logout': {
                uses: () => {
                    this._logout();
                    this._router.navigate('login');
                },
            },
        });
    }

    resolve() {
        this._router.resolve();
    }

    update() {
        this._router.updatePageLinks();
    }

    navigate(url) {
        this._router.navigate(url);
    }
}
