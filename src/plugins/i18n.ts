import {createI18n} from 'vue-i18n'
import frLocale from "~/locales/fr/index";

export default defineNuxtPlugin(({vueApp}) => {
    const i18n = createI18n({
        legacy: false,
        globalInjection: true,
        locale: 'fr',
        messages: {
            fr: frLocale
        },
        flatJson: true,
    })

    vueApp.use(i18n)
})