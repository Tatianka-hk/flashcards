<template>
    <label
        class="flex flex-col items-center justify-center w-2/4 h-[350px] border-2 border-dashed border-accent rounded-lg text-text text-center cursor-pointer bg-[#d8e2ec]"
    >
        <input
            type="file"
            accept=".pdf,application/pdf"
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

async function onFileChange(event: Event) {
    const input = event.target as HTMLInputElement
    error.value = false
    try {
        const file = input.files?.[0]

        if (!file) return
        if (file.name?.length > 0) rawFileName.value = file.name

        const text = await extractPdfText(file)
        emit('file:change', text)
    } catch (e) {
        error.value = true
        console.error(e)
    }
}
</script>
