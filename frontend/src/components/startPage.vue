<template>
    <div class="flex w-full items-center justify-end mb-[80px]">
        <SelectInput
            :value="locale"
            :options="langs"
            @change="changeLang($event)"
        />
    </div>
    <Result v-if="viewResult" :cards="flashcards" @close="viewResult = false" />
    <div v-else class="flex w-full items-center justify-center">
        <div v-if="!isBlocked" class="flex w-full flex-col items-center gap-4">
            <span class="text-text flex justify-end w-2/4">
                {{ usageCount }} / 3</span
            >
            <FileInput @file:change="onChangeFile" />
            <VButton
                :label="$t('button.generate')"
                @click="onClickButton"
                :disabled="!fileText || loading"
            />
            <Loading v-if="loading" />
        </div>
        <div v-else class="flex flex-col items-center gap-4">
            <MessageItem :message="$t('message.limitReached')" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { FileInput, VButton, MessageItem } from '../ui'
import Result from './Result.vue'
import type { ICard } from '@/types/card'
import Loading from '@/ui/Loading.vue'
import SelectInput from '@/ui/SelectInput.vue'
import { MAX_USES, langs } from '@/static'
import { useI18n } from 'vue-i18n'

const fileText = ref<string | null>(null)
const viewResult = ref<boolean>(false)
const flashcards = ref<ICard[]>([])
const loading = ref<boolean>(false)
const usageKey = import.meta.env.VITE_USAGE_KEY
const usageCount = ref<number>(Number(localStorage.getItem(usageKey)) || 0)
const isBlocked = computed(() => usageCount.value >= MAX_USES)
const { locale } = useI18n()

const onChangeFile = (text: string) => {
    fileText.value = text
}

const changeLang = (val: string) => {
    locale.value = val
}

const onClickButton = async () => {
    if (!fileText.value) return
    loading.value = true
    try {
        const response = await fetch(`/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: fileText.value }),
        })
        if (response.ok) {
            usageCount.value++
            localStorage.setItem(usageKey, usageCount.value.toString())
        }
        const data = await response.json()
        loading.value = false
        flashcards.value = data.flashcards
        viewResult.value = true
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}
</script>
