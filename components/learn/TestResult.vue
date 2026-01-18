<template>
    <div
        class="bg-blue p-4 flex flex-col gap-[30px] rounded-[10px] min-w-[200px]"
    >
        <div class="grid grid-cols-[1fr_30px] gap-y-4 gap-x-5">
            <span
                class="text-base font-julius text-text after:content-[''] after:flex-1 after:border-b after:border-dotted after:border-text after:mx-2 after:translate-y-[2px]"
            >
                {{ t('learn.all') }}
            </span>
            <span class="text-base font-julius text-text">
                {{ result.all }}
            </span>
            <span
                class="text-base font-julius flex-1 relative text-mint after:content-[''] after:flex-1 after:border-b after:border-dotted after:border-text after:mx-2 after:translate-y-[2px]"
            >
                {{ t('learn.correct') }}</span
            >
            <span class="text-base font-julius text-mint">
                {{ result.correctCount }}
            </span>
            <span
                class="text-base font-julius after:content-[''] after:flex-1 after:border-b after:border-dotted after:border-text after:mx-2 after:translate-y-[2px] text-error"
            >
                {{ t('learn.incorrect') }}
            </span>
            <span class="text-base font-julius text-error">
                {{ result.inCorrectCount }}
            </span>
        </div>
        <div class="flex gap-4">
            <VButton @click="$router.back()" extraClass="!w-full">{{
                t('button.back')
            }}</VButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { IAnswer } from '~/types'
import VButton from '~/ui/VButton.vue'

const props = defineProps<{ answers: IAnswer[] }>()
const { t } = useI18n()

const result = computed(() => {
    return {
        all: props.answers.length,
        correctCount: props.answers.filter((answer) => answer.isCorrect).length,
        inCorrectCount: props.answers.filter((answer) => !answer.isCorrect)
            .length,
    }
})
</script>
