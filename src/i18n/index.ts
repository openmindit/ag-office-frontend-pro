import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import frCommon from './locales/fr/common.json';
import frMenu from './locales/fr/menu.json';
import enCommon from './locales/en/common.json';
import enMenu from './locales/en/menu.json';
import nlCommon from './locales/nl/common.json';
import nlMenu from './locales/nl/menu.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        lng: 'fr',
        fallbackLng: 'fr',
        supportedLngs: ['fr', 'en', 'nl'],
        debug: import.meta.env.DEV,

        resources: {
            fr: {
                common: frCommon,
                menu: frMenu,
            },
            en: {
                common: enCommon,
                menu: enMenu,
            },
            nl: {
                common: nlCommon,
                menu: nlMenu,
            },
        },

        ns: ['common', 'menu'],
        defaultNS: 'common',

        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
