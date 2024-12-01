import { createI18n } from 'vue-i18n';

import en from '@/assets/locales/en.json';
import de from '@/assets/locales/de.json';

type Schema = typeof en;
const messages = { de, en };
type AvailableLanguages = keyof typeof messages;

const i18n = createI18n<[Schema], AvailableLanguages, false>({
    legacy: false,
    locale: getLangOrDefault(navigator.language),
    fallbackLocale: 'en',
    messages,
});

document.querySelector('html')?.setAttribute('lang', i18n.global.locale.value);

function getLangShortCode(language: string): string {
    return language.split('-').shift() ?? language;
}

function getLangOrDefault(language: string): AvailableLanguages {
    const shortCode = getLangShortCode(language);
    return Object.keys(messages).includes(shortCode) ? (shortCode as AvailableLanguages) : 'en';
}

window.addEventListener('languagechange', () => {
    i18n.global.locale.value = getLangOrDefault(navigator.language);
    document.querySelector('html')?.setAttribute('lang', i18n.global.locale.value);
});

export default i18n;
