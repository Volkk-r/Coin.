export default class Api {
  _token;
  _hasToken;
  _socket;
  constructor() {
    this.loadToken();
  }

  get hasToken() {
    return this._hasToken;
  }

  saveToken() {
    window.localStorage.setItem('user_token', this._token);
  }
  loadToken() {
    this._token = window.localStorage.getItem('user_token');
    if (this._token) this._hasToken = true;
  }
  async authorization(login, password) {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        login: login,
        password: password,
      }),
    });

    const data = await response.json();
    this._token = data.payload?.token;
    if (this._token) {
      this._hasToken = true;
      this.saveToken();
    }
    return data;
  }

  async getAccounts() {
    const response = await fetch('http://localhost:3000/accounts', {
      headers: {
        Authorization: `Basic ${this._token}`,
      },
    });
    const data = await response.json();
    return data;
  }
  async createAccount() {
    const response = await fetch('http://localhost:3000/create-account', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this._token}`,
      },
    });
    const data = await response.json();
    return data;
  }

  async getAccount(id) {
    const response = await fetch('http://localhost:3000/account/' + id, {
      headers: {
        Authorization: `Basic ${this._token}`,
      },
    });
    const data = await response.json();
    return data;
  }

  async createAccount() {
    const response = await fetch('http://localhost:3000/create-account', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this._token}`,
      },
    });
    const data = await response.json();

    return data;
  }

  async transferFunds(fund) {
    const response = await fetch('http://localhost:3000/transfer-funds', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this._token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fund),
    });
    const data = await response.json();
    return data;
  }

  logout() {
    window.localStorage.removeItem('user_token');
    this._token = null;
    this._hasToken = false;
  }

  async getAllCurrencies() {
    const response = await fetch('http://localhost:3000/all-currencies', {
      method: 'GET',
      headers: {
        Authorization: `Basic ${this._token}`,
      },
    });
    const data = await response.json();
    return data;
  }

  async getCurrencies() {
    const response = await fetch('http://localhost:3000/currencies', {
      method: 'GET',
      headers: {
        Authorization: `Basic ${this._token}`,
      },
    });
    const data = await response.json();
    return data;
  }

  async currencyBuy({ from, to, amount }) {
    const response = await fetch('http://localhost:3000/currency-buy', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this._token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        amount,
      }),
    });
    const data = await response.json();
    return data;
  }

  async startCurrencyFeed({ onOpen, onClose, onMessage, onError }) {
    let socketUrl = new URL('http://localhost:3000');
    socketUrl.protocol = 'ws:';

    this._socket = new WebSocket(socketUrl + 'currency-feed', ['soap', 'wamp']);

    this._socket.onopen = onOpen;
    this._socket.onmessage = onMessage;
    this._socket.onclose = onClose;
    this._socket.onerror = onError;
  }

  async stopCurrencyFeed() {
    if (this._socket) this._socket.close();
  }

  async getBanks() {
    const response = await fetch('http://localhost:3000/banks', {
      method: 'GET',
      headers: {
        Authorization: `Basic ${this._token}`,
      },
    });
    const data = await response.json();
    return data.payload;
  }
}
