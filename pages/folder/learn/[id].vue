<template>
    <div class="flex p-[40px]">
        <div
            v-if="isLoading"
            class="flex items-center justify-center h-full w-full"
        >
            <Loading />
        </div>
        <div class="w-full" v-else>
            <VButton
                class="absolute left-4 top-4 w-[42px] h-[42px] flex items-center justify-center !p-0 block lg:hidden"
                @click="$router.back()"
            >
                <IconBack class="h-[24px] w-[24px]" />
            </VButton>
            <div
                class="flex items-center justify-center h-full w-full"
                v-if="(cards?.length ?? 0) === 0"
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
                <Card
                    :card="cards[currentIndex]"
                    v-if="cards.length > 0"
                    :canListen="true"
                    :lang="lang"
                    :canSeeBack="false"
                />

                <input
                    class="bg-blue p-2"
                    v-model="answer"
                    :disabled="isChecked"
                    @keyup.enter="isChecked ? nextQuestion() : checkAnswer"
                />

                <div v-if="!isCorrect && isChecked" class="text-error">
                    {{ t('learn.wrongAnswer') }}
                </div>

                <div class="flex gap-4">
                    <VButton v-if="!isChecked" @click="skipQuestion">
                        {{ t('learn.skip') }}
                    </VButton>

                    <VButton v-if="!isChecked" @click="checkAnswer">
                        Check
                    </VButton>

                    <VButton v-if="isChecked && !isCorrect" @click="setCorrect">
                        {{ t('learn.setCorrect') }}
                    </VButton>

                    <VButton v-if="isChecked" @click="nextQuestion">
                        {{ t('learn.next') }}
                    </VButton>
                </div>
            </div>
            <div
                class="flex w-full h-full items-center justify-center"
                v-if="currentIndex >= cards.length"
            >
                <TestResult :answers="answers" />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { getAllCard, getLang } from '~/apis/folder'
import TestResult from '~/components/learn/TestResult.vue'
import { useSnackbar } from '~/composables/useSnackbar'
import { IAnswer, ICard } from '~/types'
import { Loading } from '~/ui'
import Card from '~/ui/Card/Card.vue'
import VButton from '~/ui/VButton.vue'
import { IconBack } from '~/assets/icons'

const route = useRoute()
const { t } = useI18n()
const { showSnackbar } = useSnackbar()

const folderID = computed(() => route.params.id as string)
const cards = ref<ICard[]>([])
const currentIndex = ref(0)
const answers = ref<IAnswer[]>([])
const answer = ref<string>('')
const isChecked = ref<boolean>(false)
const isCorrect = ref<boolean>(false)
const isLoading = ref<boolean>(true)
const lang = ref<string>('en')

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
    const normalize = (s: string) =>
        s.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase()
    isCorrect.value =
        normalize(cards.value[currentIndex.value].back) ===
        normalize(answer.value)
    if (isCorrect.value) showSnackbar(t('learn.correct'))
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
        })
        const res = getLang(route.params.id as string)
        lang.value = res.lang
    } catch (err) {
        console.error(err)
        showSnackbar(t('auth.errors.something_went_wrong'), 'error')
    } finally {
        isLoading.value = false
    }
})
</script>
