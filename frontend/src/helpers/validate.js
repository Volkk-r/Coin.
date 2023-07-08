export default class Validate {
    static REGEX_FLOAT = /^(\d|[1-9]+\d*|0\.\d+|[1-9]+\d*\.\d+)$/;
    static validateInput(input) {
        const value = input.value;
        const minLength = value.length > 0;
        const floatTest = Validate.REGEX_FLOAT.test(value);
        if (!minLength || !floatTest) {
            const errorText = !minLength ? '' : 'Некорректное число';
            Validate.setError(input, errorText);
            return true;
        }

        Validate.setError(input, '');
        return false;
    }

    static setError(input, text) {
        input.parentElement.firstElementChild.innerHTML = text;
        input.classList.toggle('input--error', text !== '' || null);
    }
}