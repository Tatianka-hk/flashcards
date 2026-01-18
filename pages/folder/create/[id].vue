<template>
    <div class="p-[40px]">
        <div class="w-full justify-between flex mb-[20px]">
            <VButton
                @click="$router.back()"
                class="w-[42px] h-[42px] flex items-center justify-center"
            >
                <IconBack class="w-[24px] h-[24px] min-w-[24px]" />
            </VButton>
            <VButton
                @click="logoutHandle()"
                class="w-[42px] h-[42px] flex items-center justify-center"
            >
                <IconLogout class="w-[24px] h-[24px] min-w-[24px]" />
            </VButton>
        </div>
        <div class="flex flex-col gap-[40px] w-full items-center">
            <TransitionGroup
                name="card"
                tag="div"
                class="flex flex-col gap-[40px] w-full items-center"
            >
                <CardForm
                    v-for="(card, index) in cards"
                    @delete="deleteHandler(index)"
                    :key="card.id"
                    :defCard="card"
                    @update:front="cards[index].front = $event"
                    @update:back="cards[index].back = $event"
                />
            </TransitionGroup>
            <div
                @click="handleAddClick"
                class="bg-blue rounded-full w-[68px] h-[68px] flex items-center justify-center"
            >
                <IconPlus class="h-[36px] w-[36px]" />
            </div>
            <VButton extraClass="!bg-blue" @click="save">{{
                t('card.save')
            }}</VButton>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CardForm from '~/components/CardForm.vue'
import { ICard, IDbCard } from '~/types'
import { IconPlus } from '../../../assets/icons'
import VButton from '~/ui/VButton.vue'
import { getCards, saveCards } from '~/apis/cards'
import { useRoute } from 'vue-router'
import { useSnackbar } from '~/composables/useSnackbar'
import { IconLogout, IconBack } from '~/assets/icons/'
import { useI18n } from 'vue-i18n'
import { logout } from '~/apis/auth'

const createEmptyCard = (): ICard => ({
    front: '',
    back: '',
    id: crypto?.randomUUID(),
})

const route = useRoute()
const cards = ref<ICard[]>([createEmptyCard()])
const { showSnackbar } = useSnackbar()
const { t } = useI18n()

const handleAddClick = () => {
    cards.value.push(createEmptyCard())
}

const deleteHandler = (index: number) => {
    cards.value = cards.value.filter((_, i) => i !== index)
}

const save = async () => {
    saveCards({
        folderId: route.params.id as string,
        cards: cards.value,
    })
        .then(() => {
            showSnackbar(t('card.saveSuccess'), 'success')
        })
        .catch((err) => {
            showSnackbar(t('auth.errors.something_went_wrong'), 'error')
        })
}

const logoutHandle = () => {
    try {
        logout()
    } catch (err) {
        console.log(err)
    }
}

onMounted(async () => {
    try {
        const { cards: cardsFromDB } = await getCards(route.params.id as string)
        cards.value =
            cardsFromDB && cardsFromDB?.length > 0
                ? [...cardsFromDB]
                : [createEmptyCard()]
    } catch (err) {
        console.error(err)
        showSnackbar(t('auth.errors.something_went_wrong'), 'error')
    }
})
</script>
<style scoped>
.card-enter-from {
    opacity: 0;
    transform: scale(0.96) translateY(8px);
}
.card-enter-active {
    transition: all 0.22s ease;
}

.card-leave-to {
    opacity: 0;
    transform: scale(0.94) translateY(-8px);
}
.card-leave-active {
    transition: all 0.18s ease;
    position: absolute;
    width: 100%;
}

.card-move {
    transition: transform 0.22s ease;
}
</style>
