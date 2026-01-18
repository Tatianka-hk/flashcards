<template>
    <IconSound @click="playSound" class="cursor-pointer" />
</template>

<script setup lang="ts">
import { IconSound } from '~/assets/icons'
const props = defineProps<{
    value: string
    lang: string
}>()

const playSound = () => {
    try {
        if (!props.value) return

        const utterance = new SpeechSynthesisUtterance(props.value)

        utterance.lang = normalizeLang(props.lang)
        utterance.rate = 1
        utterance.pitch = 1

        window.speechSynthesis.cancel()
        window.speechSynthesis.speak(utterance)
    } catch (err) {
        console.error(err)
    }
}

const normalizeLang = (lang: string): string => {
    const map: Record<string, string> = {
        en: 'en-US',
        es: 'es-ES',
        fr: 'fr-FR',
        de: 'de-DE',
        it: 'it-IT',
        pt: 'pt-PT',
        ru: 'ru-RU',
        uk: 'uk-UA',
        zh: 'zh-CN',
        ja: 'ja-JP',
        ko: 'ko-KR',
        ar: 'ar-SA',
        hi: 'hi-IN',
    }

    return map[lang] ?? lang
}
</script>
