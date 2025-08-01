import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ua from './locales/ua.json'
import esp from './locales/esp.json'
import cat from './locales/cat.json'

const i18n = createI18n({
    locale: 'ua',
    fallbackLocale: 'en',
    messages: {
        en,
        ua,
        esp,
        cat,
    },
})

createApp(App).use(i18n).mount('#app')
