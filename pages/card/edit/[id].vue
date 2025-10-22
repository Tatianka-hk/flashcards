<template>
    <div class="p-[40px]">
        <CardForm
            v-if="card"
            :defCard="card"
            @update:front="card.front = $event"
            @update:back="card.back = $event"
        />
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
import { ICard } from '~/types'
import VButton from '~/ui/VButton.vue'

const router = useRouter()
const route = useRoute()
const card = ref<ICard | null>(null)
const { t } = useI18n()

const getCardData = async () => {
    const { id } = route.params
    if (!id || typeof id !== 'string') {
        router.back()
        return
    }
    try {
        const data = await getCard(id)
        card.value = data.card
    } catch (e) {
        router.back()
    }
}

const handleEditCard = async () => {
    const { id } = route.params
    if (!id || typeof id !== 'string' || !card.value) return
    try {
        await editCard(id, card.value as ICard)
        router.back()
    } catch (e) {}
}

onMounted(() => getCardData())
</script>
