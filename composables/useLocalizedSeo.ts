import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import favicon from '@/assets/favicon.png'

export function useLocalizedSeo() {
    const { t, locale } = useI18n()

    const title = computed(() => t(`seo.title`))
    const description = computed(() => t(`seo.description`))
    const keywords = computed(() => t(`seo.keywords`))

    useHead({
        htmlAttrs: {
            lang: locale,
        },
        link: [
            {
                rel: 'icon',
                type: 'image/png',
                href: favicon,
            },
        ],

        title,

        meta: [
            {
                name: 'description',
                content: description,
            },
            {
                name: 'keywords',
                content: keywords,
            },

            // Open Graph
            {
                property: 'og:title',
                content: title,
            },
            {
                property: 'og:description',
                content: description,
            },
            {
                property: 'og:type',
                content: 'website',
            },

            // Twitter
            {
                name: 'twitter:card',
                content: 'summary_large_image',
            },
            {
                name: 'twitter:title',
                content: title,
            },
            {
                name: 'twitter:description',
                content: description,
            },
        ],
    })
}
