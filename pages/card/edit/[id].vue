<template>
    <div class="p-[40px]">
        <CardForm
            v-if="card"
            :defCard="card"
            @update:front="card.front = $event"
            @update:back="card.back = $event"
        />
        <div class="w-full flex justify-center mt-4">
            <VButton @click="handleEditCard">Edit</VButton>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCard, editCard } from '~/api/cards'
import CardForm from '~/components/CardForm.vue'
import { ICard } from '~/types'
import VButton from '~/ui/VButton.vue'

const router = useRouter()
const route = useRoute()
const card = ref<ICard | null>(null)

const getCardData = async () => {
    const { id } = useRoute().params
    const data = await getCard(id as string)
    card.value = data.card
}

const handleEditCard = () => {
    const { id } = route.params
    console.log('id')
    editCard(id as string, card.value as ICard)
    router.back()
}

onMounted(() => getCardData())
</script>
