<template>
    <label
        class="flex flex-col items-center justify-center w-2/4 h-[350px] border-2 border-dashed border-accent rounded-lg text-text text-center cursor-pointer bg-[#d8e2ec]"
    >
        <input
            type="file"
            :accept="accept"
            class="hidden"
            @change="onFileChange"
        />
        <span class="text-base text-text">{{ message }}</span>
    </label>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { extractPdfText } from '../utils/files'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
    defineProps<{
        accept?: string
        mode?: 'pdf' | 'json'
    }>(),
    {
        accept: '.pdf,application/pdf',
        mode: 'pdf',
    }
)

const emit = defineEmits<{
    (e: 'file:change', text: string): void
}>()

const { t } = useI18n()
const rawFileName = ref<string | null>(null)
const error = ref<boolean>(false)

const message = computed(() => {
    if (rawFileName.value) return `${t('file.uploaded')} ${rawFileName.value}`
    if (error.value) return t('file.error')
    return t('file.noFile')
})

async function pdfHandler(event: Event) {
    const input = event.target as HTMLInputElement
    error.value = false

    try {
        const file = input.files?.[0]
        if (!file) return

        const isPdf =
            file.type === 'application/pdf' ||
            file.name.toLowerCase().endsWith('.pdf')
        if (!isPdf) throw new Error('Invalid file type. Expected PDF.')

        rawFileName.value = file.name || null

        const text = await extractPdfText(file)
        emit('file:change', text)
    } catch (e) {
        error.value = true
        rawFileName.value = null
        console.error(e)
    } finally {
        input.value = ''
    }
}

async function jsonHandler(event: Event) {
    const input = event.target as HTMLInputElement
    error.value = false

    try {
        const file = input.files?.[0]
        if (!file) return

        const isJson =
            file.type === 'application/json' ||
            file.name.toLowerCase().endsWith('.json')
        if (!isJson) throw new Error('Invalid file type. Expected JSON.')

        rawFileName.value = file.name || null

        const text = await file.text()
        JSON.parse(text)

        emit('file:change', text)
    } catch (e) {
        error.value = true
        rawFileName.value = null
        console.error(e)
    } finally {
        input.value = ''
    }
}

async function onFileChange(event: Event) {
    if (props.mode === 'json') {
        await jsonHandler(event)
    } else if (props.mode === 'pdf') {
        await pdfHandler(event)
    }
}
</script>
