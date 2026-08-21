<template>
    <div
        class="flex w-full items-center justify-end mb-[40px] gap-[20px] pr-[40px] pt-[40px]"
    >
        <LanguageInput />
        <UserCircle v-if="isAuth" />
        <AuthButtons v-else />
    </div>
    <Result v-if="viewResult" :cards="flashcards" @close="viewResult = false" />
    <div v-else class="flex w-full items-center justify-center">
        <div v-if="!isBlocked" class="flex w-full flex-col items-center gap-4">
            <span class="text-text flex justify-end w-2/4 gap-2">
                {{ usageCount }} / 3
                <Tooltip>
                    <template #trigger> ? </template>
                    <template #content>
                        {{ t('attemptsTooltip') }}
                    </template>
                </Tooltip>
            </span>

            <FileInput @file:change="onChangeFile" />
            <p
                v-if="errorMessage"
                data-testid="error-message"
                role="alert"
                class="text-red-600"
            >
                {{ errorMessage }}
            </p>
            <VButton
                data-testid="generate-button"
                @click="onClickButton"
                :disabled="!fileText || loading"
                :ariaLabel="t('button.generate')"
            >
                {{ t('button.generate') }}
            </VButton>
            <Loading v-if="loading" />
        </div>
        <div v-else class="flex flex-col items-center gap-4">
            <MessageItem :message="$t('message.limitReached', { count: 3 })" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import AuthButtons from '~/components/auth/authButtons.vue'
import { useAuth } from '~/composables/useAuth'
import LanguageInput from '~/components/LanguageInput.vue'
import { FileInput, VButton, MessageItem, UserCircle, Tooltip } from '../ui'
import Result from '../components/Result.vue'
import type { ICard } from '../types/card'
import Loading from '../ui/Loading.vue'
import { MAX_USES } from '../static'

const { t } = useI18n()
const { isAuth } = useAuth()
const fileText = ref<string | null>(null)
const viewResult = ref<boolean>(false)
const flashcards = ref<ICard[]>([])
const errorMessage = ref<string | null>(null)
const loading = ref<boolean>(false)
const usageKey = 'asdasd'
const usageCount = ref<number>(
    Number(process.client && localStorage.getItem(usageKey)) || 0
)
const isBlocked = computed(() => usageCount.value >= MAX_USES)

const onChangeFile = (text: string) => {
    fileText.value = text
}

function getGenerateErrorMessage(status?: number) {
    switch (status) {
        case 400:
            return t('errors.generate.invalidInput')
        case 401:
            return t('errors.generate.authorization')
        case 429:
            return t('errors.generate.tooManyRequests')
        case 500:
            return t('errors.generate.server')
        default:
            return t('errors.generate.network')
    }
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

        if (!response.ok) {
            errorMessage.value = getGenerateErrorMessage(response.status)
            return
        }
        usageCount.value++
        if (process.client) {
            localStorage.setItem(usageKey, usageCount.value.toString())
        }
        const data = await response.json()
        flashcards.value = data.flashcards
        viewResult.value = true
    } catch (err) {
        console.error(err)
        errorMessage.value = getGenerateErrorMessage()
    } finally {
        loading.value = false
    }
}
</script>
