import {useI18n} from "vue-i18n";

export const useTranslate = () => {
    const {t} = useI18n()

    const translateDate = (date: string, format: string) => {
        const dateObj = new Date(date);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        };

        const formattedDate = new Intl.DateTimeFormat('fr-FR', options).format(dateObj);

        return t(format, {date: formattedDate});
    }

    const translateNumber = (number: number, format: string) => {
        const options: Intl.NumberFormatOptions = {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        };

        const formattedNumber = new Intl.NumberFormat('fr-FR', options).format(number);

        return t(format, {number: formattedNumber});
    }

    const translate = (key: string, params: Record<string, unknown> = {}) => {
        const translated = t(key, params);
        if (translated === key) {
            console.warn(`Translation key "${key}" not found`);
        }
        return translated;
    }

    return {
        translateDate,
        translateNumber,
        translate
    }
};