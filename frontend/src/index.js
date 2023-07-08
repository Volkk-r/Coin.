import Api from "./api.js";
import Header from "./components/header.js";
import Login from "./components/login.js";
import AccountList from "./pages/accounts.js";
import AccountDetails from "./pages/account.js";
import HistoryPage from "./pages/history.js";
import Router from "./components/router.js";
import Rate from "./components/rate.js";
import CurrencyPage from "./pages/currencies.js";
import CurrencyRate from "./components/currencyRates.js";
import MapWithPoints from "./pages/map.js";

import './style/style.css'
const api = new Api(); // Создаем экземпляр класса Api для взаимодействия с API
const header = new Header(); // Создаем экземпляр класса Header для работы с заголовком страницы
const currencyRate = new CurrencyRate(); // Создаем экземпляр класса CurrencyRate для отображения курсов валют

async function onLogin(login, field) {
    const response = await api.authorization(field.login, field.password); // Выполняем запрос на авторизацию

    if (response?.error) {
        const error = response.error;
        console.log('ERROR: ', error);
        if (error.includes('user')) login.setInputError('user'); // Если ошибка связана с пользователем, отображаем сообщение об ошибке в поле ввода "user"
        if (error.includes('password')) login.setInputError('password'); // Если ошибка связана с паролем, отображаем сообщение об ошибке в поле ввода "password"
    }

    if (api.hasToken) {
        const delay = 300;
        await new Promise((resolve) => {
            setTimeout(() => {
                login.setInputSuccess('user'); // Устанавливаем статус успешного ввода для поля "user"
                resolve();
            }, delay);
        });
        await new Promise((resolve) => {
            setTimeout(() => {
                login.setInputSuccess('password'); // Устанавливаем статус успешного ввода для поля "password"
                resolve();
            }, delay);
        });
        await new Promise((resolve) => {
            setTimeout(() => {
                router.navigate('account'); // Переходим на страницу "account"
                router.update();
                resolve();
            }, delay * 2);
        });

        header.addNavigation(); // Добавляем навигацию в заголовок страницы
    }
}

if (api.hasToken) {
    header.addNavigation(); // Если имеется токен, добавляем навигацию в заголовок страницы
}

window.document.body.appendChild(header.html); // Добавляем заголовок страницы в тело документа

const main = document.createElement('main'); // Создаем элемент <main> для содержимого страницы
window.document.body.appendChild(main); // Добавляем <main> в тело документа

function loginPageLoader() {
    document.title = 'Авторизация'; // Устанавливаем заголовок страницы "Авторизация"

    const loginPage = new Login(onLogin); // Создаем экземпляр класса Login для страницы авторизации
    main.innerHTML = '';
    main.appendChild(loginPage.html); // Добавляем содержимое страницы авторизации в <main>
}

async function accountPageLoader() {
    document.title = 'Счета'; // Устанавливаем заголовок страницы "Счета"

    const accountsList = new AccountList(async () => {
        const data = await api.createAccount(); // Создаем новый счет

        accountsList.addAccount(data.payload.account, data.payload.balance, data.payload.transactions); // Добавляем информацию о созданном счете в список счетов
    });

    const data = await api.getAccounts(); // Получаем список счетов пользователя
    const accounts = data.payload;

    console.log('accounts: ', accounts);
    if (accounts) {
        accounts.forEach((acc) => {
            accountsList.addAccount(acc.account, acc.balance, acc.transactions); // Добавляем информацию о каждом счете в список счетов
        });
    }

    main.replaceChildren(accountsList.html); // Заменяем содержимое <main> на список счетов

    router.update();
}

async function accountDetailsPageLoader(match) {
    const account = match.data.id;

    document.title = `Просмотр счёта ${account}`; // Устанавливаем заголовок страницы "Просмотр счёта"
    const rows = -10;
    const data = await api.getAccount(account); // Получаем информацию о счете

    const accountInfo = new AccountDetails({
        account: data.payload,
        chartClick: () => router.navigate(`history/${data.payload.account}`),
        transferSubmit: async (transfer, fund) => {
            const response = await api.transferFunds(fund); // Отправляем запрос на перевод средств

            if (response.error === '') {
                accountInfo.updateInfo(response.payload); // Обновляем информацию о счете после перевода
                accountInfo.resetTransfer(); // Сбрасываем форму перевода
            } else {
                switch (response.error) {
                    case `Overdraft prevented`:
                        transfer.setError('amount', 'Недостаточно средств'); // Отображаем сообщение об ошибке в поле "amount" при недостатке средств
                        break;
                    case 'Invalid account to':
                        transfer.setError('account', 'Счёт не найден'); // Отображаем сообщение об ошибке в поле "account" при неверном счете
                        break;
                    case `Invalid amount`:
                        transfer.setError('amount', 'Неверная сумма перевода'); // Отображаем сообщение об ошибке в поле "amount" при неверной сумме перевода
                        break;
                }
            }
        },
        rows
    });

    main.replaceChildren(accountInfo.html); // Заменяем содержимое <main> на информацию о счете

    router.update();
}

async function historyPageLoader(params) {
    const account = params.data.id;
    const rows = -25;
    document.title = `История баланса счёта ${account}`; // Устанавливаем заголовок страницы "История баланса"

    const data = await api.getAccount(account); // Получаем информацию о счете

    const accountHistory = new HistoryPage({
        account: data.payload, rows
    });

    main.replaceChildren(accountHistory.html); // Заменяем содержимое <main> на историю баланса счета

    router.update();
}

async function currencyPageLoader() {
    document.title = 'Валютный обмен'; // Устанавливаем заголовок страницы "Валютный обмен"

    const currencyPage = new CurrencyPage();
    const data = await api.getCurrencies(); // Получаем список валют
    const currencies = Object.values(data.payload);

    currencyPage.currencies = currencies; // Устанавливаем список валют в CurrencyPage
    currencyPage._exchangeForm.userCurrencies = currencies.map((el) => el.code); // Устанавливаем список валют в форме обмена валюты
    currencyPage._exchangeForm.addSubmit(async (ExchangeForm, data) => {
        const response = await api.currencyBuy(data); // Выполняем запрос на покупку валюты

        if (response.error === '') {
            ExchangeForm.setSuccess('amount');
            currencyPage._userCurrencies.currencies = Object.values(response.payload); // Обновляем список валют пользователя после покупки
            ExchangeForm.reset(); // Сбрасываем форму обмена валюты
        } else {
            console.log('ERROR', response);

            switch (response.error) {
                case `Not enough currency`:
                    ExchangeForm.setError('amount', 'На счете списания нет средств');
                    break
                case `Overdraft prevented`:
                    ExchangeForm.setError('amount', 'Недостаточно средств');
                    break
                case `Invalid amount`:
                    ExchangeForm.setError('amount', 'Введите корректное число');
                    break
            }
        }
    });

    currencyPage.setNewCurrencyRate(currencyRate);

    const currenciesData = await api.getAllCurrencies(); // Получаем информацию о всех доступных валютах
    currencyPage._exchangeForm.availableCurrencies = currenciesData.payload; // Устанавливаем список доступных валют в форму обмена валюты

    main.replaceChildren(currencyPage.html); // Заменяем содержимое <main> на страницу валютного обмена

    router.update();
}

const websocketHandlers = {
    onOpen: () => console.log('[websocket: open]'),
    onClose: () => console.log('[websocket: close]'),
    onMessage: (event) => {
        const message = JSON.parse(event.data);

        const rate = new Rate({
            from: message.from,
            to: message.to,
            rate: message.rate,
            change: message.change,
        });

        currencyRate.addNewRate(rate); // Добавляем новый курс валюты
    },
    onError: (error) => console.log(error.message),
};

async function MapPageLoader() {
    document.title = 'Банкоматы'; // Устанавливаем заголовок страницы "Банкоматы"

    main.replaceChildren();

    const response = await api.getBanks(); // Получаем информацию о банкоматах

    const mapContainerId = 'map';
    const map = new MapWithPoints(mapContainerId, response); // Создаем экземпляр класса MapWithPoints для отображения карты с банкоматами

    main.replaceChildren(map.html); // Заменяем содержимое <main> на карту с банкоматами

    await map.initialize();

}

function onLogout() {
    header.removeNavigation(); // Удаляем навигацию из заголовка страницы
    api.logout(); // Выполняем выход пользователя
}

const router = new Router({
    tokenCheck: () => api.hasToken,
    MapPageLoader,
    loginPageLoader,
    accountPageLoader,
    accountDetailsPageLoader,
    historyPageLoader,
    currencyPageLoader,
    currencyPageReady: () => {
        if (api.hasToken) {
            api.startCurrencyFeed(websocketHandlers); // Запускаем получение обновлений курсов валют
        }
    },
    currencyPageLeave: () => {
        api.stopCurrencyFeed(); // Останавливаем получение обновлений курсов валют
    },
    logoutPageLoader: () => onLogout(),
});

router.resolve(); // Выполняем маршрутизацию страницы
