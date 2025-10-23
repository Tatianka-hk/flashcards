<template>
    <div class="p-[40px]">
        <div class="w-full flex justify-between items-start mb-[40px]">
            <VButton
                @click="$router.back()"
                class="w-[42px] h-[42px] flex items-center justify-center"
            >
                <IconBack class="w-[24px] h-[24px] min-w-[24px]" />
            </VButton>
        </div>
        <CardForm
            v-if="card || !isLoading"
            :defCard="card"
            @update:front="card.front = $event"
            @update:back="card.back = $event"
            :canDelete="false"
        />
        <Loading v-if="isLoading" />
        <div class="w-full flex justify-center mt-4">
            <VButton @click="handleEditCard">{{ t('card.edit') }}</VButton>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { getCard, editCard } from '~/api/cards'
import CardForm from '~/components/CardForm.vue'
import { useSnackbar } from '~/composables/useSnackbar'
import { ICard } from '~/types'
import VButton from '~/ui/VButton.vue'
import { IconBack } from '~/assets/icons'
import { Loading } from '../../../ui'

const router = useRouter()
const route = useRoute()
const card = ref<ICard | null>(null)
const { t } = useI18n()
const { showSnackbar } = useSnackbar()
const isLoading = ref<boolean>(false)

const getCardData = async () => {
    const { id } = route.params
    if (!id || typeof id !== 'string') {
        router.back()
        return
    }
    isLoading.value = true
    try {
        const data = await getCard(id)
        card.value = data.card
    } catch (e) {
        router.back()
    } finally {
        isLoading.value = false
    }
}

const handleEditCard = async () => {
    const { id } = route.params
    if (!id || typeof id !== 'string' || !card.value) return
    if (!card.value.front.length || !card.value.back.length) {
        showSnackbar(t('card.error.empty'), 'error')
        return
    }
    try {
        await editCard(id, card.value as ICard)
        router.back()
    } catch (e) {}
}

onMounted(() => getCardData())
</script>
