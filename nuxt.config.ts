import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    components: [{ path: '~/components' }, { path: '~/ui', pathPrefix: false }],
    css: ['~/assets/main.css'],
    modules: ['@nuxtjs/i18n', '@nuxtjs/tailwindcss', '@nuxtjs/google-fonts'],
    i18n: {
        locales: [
            { code: 'en', file: 'en.json' },
            { code: 'ua', file: 'ua.json' },
            { code: 'esp', file: 'esp.json' },
            { code: 'cat', file: 'cat.json' },
        ],
        defaultLocale: 'ua',
        langDir: 'locales/',
    },
    googleFonts: {
        families: {
            'Julius+Sans+One': true,
        },
        display: 'swap',
    },
})
