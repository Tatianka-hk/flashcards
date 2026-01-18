import { createI18n } from 'vue-i18n'
import en from '@/i18n/locales/en.json'
import ua from '@/i18n/locales/ua.json'
import esp from '@/i18n/locales/esp.json'
import cat from '@/i18n/locales/cat.json'
import { STORAGE_KEY } from '~/static'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin((nuxtApp) => {
    const saved = process.client ? localStorage.getItem(STORAGE_KEY) : null

    const i18n = createI18n({
        legacy: false,
        globalInjection: true,
        locale: saved || 'en',
        fallbackLocale: 'en',
        messages: {
            en,
            ua,
            esp,
            cat,
        },
    })

    nuxtApp.vueApp.use(i18n)
})
