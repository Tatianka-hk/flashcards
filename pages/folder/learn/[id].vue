<template>
    <div class="flex p-[40px]">
        <div
            v-if="isLoading"
            class="flex items-center justify-center h-full w-full"
        >
            <Loading />
        </div>
        <div class="w-full" v-else>
            <div
                class="flex items-center justify-center h-full w-full"
                v-if="!cards"
            >
                {{ t('learn.noCards') }}
                <VButton @click="$router.back()">
                    {{ t('button.back') }}
                </VButton>
                <VButton @click="$router.push(`/folder/create/${folderID}`)">
                    {{ t('learn.AllCards') }}
                </VButton>
            </div>
            <div
                class="flex flex-col items-center gap-[40px]"
                v-else-if="currentIndex < cards.length"
            >
                <Card :card="cards[currentIndex]" v-if="cards.length > 0" />

                <input
                    class="bg-blue p-2"
                    v-model="answer"
                    :disabled="isChecked"
                />

                <div v-if="!isCorrect && isChecked" class="text-error">
                    {{ t('learn.wrongAnswer') }}
                </div>

                <div class="flex gap-4">
                    <VButton @click="skipQuestion()" v-if="!isChecked">
                        {{ t('learn.skip') }}
                    </VButton>
                    <VButton
                        @click="setCorrect()"
                        v-if="isChecked && !isCorrect"
                    >
                        {{ t('learn.setCorrect') }}
                    </VButton>
                    <VButton @click="checkAnswer()" v-else> Check </VButton>
                    <VButton @click="nextQuestion()" v-if="isChecked">
                        {{ t('learn.next') }}
                    </VButton>
                </div>
            </div>
            <div class="flex w-full h-full items-center justify-center">
                <TestResult
                    :answers="answers"
                    v-if="currentIndex >= cards.length"
                />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
//don't show front?
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { getAllCard } from '~/api/folder'
import TestResult from '~/components/learn/TestResult.vue'
import { useSnackbar } from '~/composables/useSnackbar'
import { IAnswer, ICard } from '~/types'
import { Loading } from '~/ui'
import Card from '~/ui/Card/Card.vue'
import VButton from '~/ui/VButton.vue'

const route = useRoute()
const { t } = useI18n()
const { showSnackbar } = useSnackbar()

const folderID = route.params.id
const cards = ref<ICard[]>([])
const currentIndex = ref(0)
const answers = ref<IAnswer[]>([])
const answer = ref<string>('')
const isChecked = ref<boolean>(false)
const isCorrect = ref<boolean>(false)
const isLoading = ref<boolean>(false)

const goToNext = () => {
    answer.value = ''
    isCorrect.value = false
    isChecked.value = false
    currentIndex.value++
}

const skipQuestion = () => {
    answers.value.push({
        cardId: cards.value[currentIndex.value]._id ?? '0',
        isCorrect: false,
    })
    goToNext()
}

const setCorrect = () => {
    answers.value.push({
        cardId: cards.value[currentIndex.value]._id ?? '0',
        isCorrect: true,
    })
    goToNext()
}

const checkAnswer = () => {
    isCorrect.value = cards.value[currentIndex.value].back === answer.value
    isChecked.value = true
}

const nextQuestion = () => {
    answers.value.push({
        cardId: cards.value[currentIndex.value]._id ?? '0',
        isCorrect: isCorrect.value,
    })
    goToNext()
}

onMounted(async () => {
    try {
        isLoading.value = true
        getAllCard(route.params.id as string).then((res) => {
            cards.value = res.cards
            isLoading.value = false
        })
    } catch (err) {
        console.error(err)
        showSnackbar(t('auth.errors.something_went_wrong'), 'error')
    }
})
</script>
