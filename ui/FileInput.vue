<template>
    <label
        class="flex flex-col items-center justify-center w-2/4 h-[350px] border-2 border-dashed border-accent rounded-lg text-text text-center cursor-pointer bg-[#d8e2ec]"
    >
        <input
            type="file"
            :accept="acceptComputed"
            class="hidden"
            @change="onFileChange"
        />
        <span class="text-base text-text">{{ message }}</span>
    </label>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { extractPdfText } from '../utils/files'

type Mode = 'pdf' | 'json'

const props = withDefaults(
    defineProps<{
        accept?: string
        mode?: Mode
    }>(),
    {
        accept: '',
        mode: 'pdf',
    }
)

const emit = defineEmits<{
    (e: 'file:change', text: string): void
}>()

const { t } = useI18n()
const rawFileName = ref<string | null>(null)
const error = ref(false)

const MODE_RULES: Record<
    Mode,
    {
        accept: string
        exts: string[]
        mimes: string[]
        read: (file: File) => Promise<string>
        validate?: (text: string) => void
        errorMsg: string
        noFileMsg: string
    }
> = {
    pdf: {
        accept: '.pdf,application/pdf',
        exts: ['.pdf'],
        mimes: ['application/pdf'],
        read: (file) => extractPdfText(file),
        errorMsg: 'Invalid file type. Expected PDF.',
        noFileMsg: 'noFilePdf',
    },
    json: {
        accept: '.json,application/json',
        exts: ['.json'],
        mimes: ['application/json'],
        read: (file) => file.text(),
        validate: (text) => {
            JSON.parse(text)
        },
        errorMsg: 'Invalid file type. Expected JSON.',
        noFileMsg: 'noFileJson',
    },
}

const acceptComputed = computed(
    () => props.accept || MODE_RULES[props.mode].accept
)

const message = computed(() => {
    if (rawFileName.value) return `${t('file.uploaded')} ${rawFileName.value}`
    if (error.value) return t('file.error')
    return t(`file.${MODE_RULES[props.mode].noFileMsg}`)
})

const matchFileType = (file: File, mode: Mode) => {
    const rule = MODE_RULES[mode]
    const name = file.name.toLowerCase()
    return (
        rule.mimes.includes(file.type) ||
        rule.exts.some((ext) => name.endsWith(ext))
    )
}

async function onFileChange(event: Event) {
    const input = event.target as HTMLInputElement
    error.value = false

    try {
        const file = input.files?.[0]
        if (!file) return

        const rule = MODE_RULES[props.mode]

        if (!matchFileType(file, props.mode)) {
            throw new Error(rule.errorMsg)
        }

        rawFileName.value = file.name || null

        const text = await rule.read(file)
        rule.validate?.(text)

        emit('file:change', text)
    } catch (e) {
        error.value = true
        rawFileName.value = null
        console.error(e)
    } finally {
        input.value = ''
    }
}
</script>
