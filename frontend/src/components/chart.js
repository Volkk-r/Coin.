import Chart from 'chart.js/auto'
import { el } from 'redom';

export default class AccountChart {
    _typeChart;
    _account;
    _balance;
    _transactions;
    _columnsCount = 12;
    _chart;
    _data;

    constructor(account, type = 'dynamics', columnsCount = 12) {
        this._account = account.account; // Номер счета
        this._balance = account.balance; // Баланс счета
        this._transactions = account.transactions; // Список транзакций
        this._type = type; // Тип графика ('dynamics' или 'ratio')
        this._container = el('canvas#acquisitions'); // Контейнер для отображения графика
        this._columnsCount = columnsCount; // Количество столбцов графика

        this._data = this.generateChartDataSetFromTransactions(); // Генерация данных для графика

        const canvas = this._container;

        switch (type) {
            case 'dynamics':
                this._chart = this.drawChart(
                    canvas,
                    this.getLastDataItems(this._columnsCount),
                    false
                ); // Отрисовка графика динамики баланса
                break;
            case 'ratio':
                this._chart = this.drawChart(
                    canvas,
                    this.getLastDataItems(this._columnsCount),
                    true
                ); // Отрисовка графика соотношения входящих и исходящих транзакций
                break;
        }
    }

    drawChart(canvas, data, stacked = false) {
        let min, med, max;

        // Вычисление минимального, медианного и максимального значений для оси y
        min = stacked ? 0 : data.reduce((acc, cur) => Math.min(acc, cur.dinamic), 0);
        max = stacked ? data.reduce((acc, cur) => Math.max(acc, cur.in + cur.out), 0) : data.reduce((acc, cur) => Math.max(acc, cur.dinamic), 0);
        med = stacked ? data.reduce((acc, cur) => Math.max(acc, cur.out), 0) : undefined;

        // Настройка шрифта и цвета графика
        Chart.defaults.font.family = "'Work Sans', sans-serif";
        Chart.defaults.font.size = 20;
        Chart.defaults.font.lineHeight = 1.15;
        Chart.defaults.font.weight = 'bold';
        Chart.defaults.color = 'black';

        const chart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: data.map((row) => row.period.split(' ')[0]), // Метки оси x (месяцы)
                datasets: stacked
                    ? [
                        {
                            label: 'Исходящие',
                            backgroundColor: '#FD4E5D',
                            data: data.map((row) => row.out),
                        },
                        {
                            label: 'Входящие',
                            backgroundColor: '#76CA66',
                            data: data.map((row) => row.in),
                        },
                    ]
                    : [
                        {
                            label: 'Динамика баланса',
                            backgroundColor: '#116ACC',
                            data: data.map((row) => row.dinamic),
                        },
                    ],
            },
            options: {
                layout: {
                    padding: 0,
                },
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: { enabled: false },
                    title: {
                        display: true,
                        text: stacked
                            ? 'Соотношение входящих и исходящих транзакций'
                            : 'Динамика баланса',
                        align: 'start',
                        padding: {
                            top: 0,
                            right: 0,
                            bottom: 25,
                        },
                    },
                    legend: { display: false },
                },
                scales: {
                    y: {
                        offset: false,
                        border: {
                            display: false,
                        },
                        grid: {
                            display: true,
                            padding: 0,
                            drawTicks: true,
                        },
                        position: 'right',
                        ticks: {
                            padding: 24,
                            stepSize: max / 300,
                            autoskip: false,
                            font: { weight: '500' },
                        },
                        afterBuildTicks: (axis) => {
                            const ticks = {
                                min,
                                ...(med ? { med } : {}),
                                max,
                            };
                            min = ticks.min;
                            max = ticks.max;
                            const ticksArray = Object.values(ticks);

                            axis.ticks = ticksArray.map((v) => ({ value: Math.round(v) }));
                        },
                        stacked: true,
                    },
                    x: {
                        border: {
                            display: false,
                        },
                        grid: { display: false },
                        stacked: true,
                        ticks: {
                            backdropPadding: {
                                x: 0,
                                y: 0,
                            },
                        },
                    },
                },
            },
        });

        return chart;
    }

    generateChartDataSetFromTransactions() {
        // Преобразование данных транзакций в формат для графика
        const chartData = this._transactions.map((transaction) => {
            const { from, amount, date } = transaction;

            // Если отправитель не равен текущему счету, то это входящая транзакция
            const inAmount = from !== this._account ? amount : 0;

            // Если отправитель равен текущему счету, то это исходящая транзакция
            const outAmount = from === this._account ? amount : 0;

            // Вычисление динамики счета: пополнение - положительное, перевод - отрицательное
            const dynamicAmount = from !== this._account ? amount : -amount;

            // Форматирование даты
            const dateFormatted = new Date(date).toLocaleDateString('ru-Ru', {
                year: 'numeric',
                month: 'long',
            });

            return {
                in: inAmount,
                out: outAmount,
                dinamic: dynamicAmount,
                date: dateFormatted,
            };
        });

        // Группировка данных по дате
        const groupedData = chartData.reduce((acc, data) => {
            const { date, dinamic, in: inAmount, out: outAmount } = data;

            if (acc.hasOwnProperty(date)) {
                acc[date].dinamic += dinamic;
                acc[date].in += inAmount;
                acc[date].out += outAmount;
            } else {
                acc[date] = {
                    dinamic,
                    in: inAmount,
                    out: outAmount,
                };
            }
            return acc;
        }, {});

        // Формирование массива объектов
        const chartItems = Object.entries(groupedData).map(([date, data]) => ({
            period: date.slice(0, 3),
            dinamic: data.dinamic,
            in: data.in,
            out: data.out,
        }));

        return chartItems;
    }

    getLastDataItems() {
        return this._data.slice(-this._columnsCount);
    }

    get html() {
        return this._container;
    }
}
