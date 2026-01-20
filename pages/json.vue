<template>
    <div
        class="flex w-full items-center justify-end mb-[40px] gap-[20px] pr-[40px] pt-[40px]"
    >
        <UserCircle />
    </div>
    <Result v-if="viewResult" :cards="flashcards" @close="viewResult = false" />
    <div v-else class="flex w-full items-center justify-cente mt-[10vh]r">
        <div class="flex w-full flex-col items-center gap-4">
            <FileInput
                @file:change="onChangeFile"
                accept=".json,application/json"
                mode="json"
            />
            <VButton @click="onClickButton" :disabled="!fileText || loading">
                {{ t('button.generate') }}
            </VButton>
            <Loading v-if="loading" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { FileInput, VButton, UserCircle } from '../ui'
import Result from '../components/Result.vue'
import type { ICard } from '../types/card'
import Loading from '../ui/Loading.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const fileText = ref<string | null>(null)
const viewResult = ref<boolean>(false)
const flashcards = ref<ICard[]>([])
const loading = ref<boolean>(false)

const onChangeFile = (text: string) => {
    fileText.value = text
}
const isValidFlashcardsArray = (data: unknown): data is ICard[] => {
    if (!Array.isArray(data)) return false

    return data.every((item) => {
        if (typeof item !== 'object' || item === null) return false

        const keys = Object.keys(item)

        if (keys.length !== 2) return false
        if (!keys.includes('front') || !keys.includes('back')) return false

        return (
            typeof (item as any).front === 'string' &&
            typeof (item as any).back === 'string'
        )
    })
}

const onClickButton = async () => {
    if (!fileText.value) return
    loading.value = true

    try {
        const parsed = JSON.parse(fileText.value)

        if (!isValidFlashcardsArray(parsed)) {
            throw new Error('Invalid flashcards format')
            //showSnackbar
        }

        flashcards.value = parsed
        viewResult.value = true
    } catch (error) {
        console.error('Error parsing or validating flashcards:', error)
    } finally {
        loading.value = false
    }
}
</script>
