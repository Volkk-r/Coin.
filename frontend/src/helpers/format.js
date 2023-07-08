export default function formatNumberWithSpaces(number) {
    const str = String(number);
    let formattedNumber = '';
    let count = 0;
    let decimalPart = '';

    // Разделяем число на целую и десятичную части (если есть)
    const parts = str.split('.');
    const integerPart = parts[0];

    // Форматируем целую часть числа
    for (let i = integerPart.length - 1; i >= 0; i--) {
        formattedNumber = integerPart[i] + formattedNumber;
        count++;

        if (count === 3 && i !== 0) {
            formattedNumber = ' ' + formattedNumber;
            count = 0;
        }
    }

    // Форматируем десятичную часть числа (если есть)
    if (parts.length > 1) {
        decimalPart = ',' + parts[1];
    }

    return formattedNumber + decimalPart;
}