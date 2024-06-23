import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../../languages/en.json';
import de from '../../languages/de.json';
import nl from '../../languages/nl.json';
const resources = {
    en: { translation: en },
    de: { translation: de },
    nl: { translation: nl },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'nl',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
