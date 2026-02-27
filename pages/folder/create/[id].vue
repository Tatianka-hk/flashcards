<template>
    <div class="p-[40px] relative">
        <div class="w-full sticky left-[40px] top-[40px] right-[40px] z-20">
            <HeaderUserAuthed />
        </div>

        <Loading v-if="isLoading" />
        <div class="flex flex-col gap-[40px] w-full items-center" v-else>
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
                class="bg-blue rounded-full w-[68px] h-[68px] flex items-center justify-center cursor-pointer"
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
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import CardForm from '~/components/CardForm.vue'
import { ICard } from '~/types'
import { IconPlus } from '../../../assets/icons'
import VButton from '~/ui/VButton.vue'
import { addCards } from '~/apis/cards'
import { useSnackbar } from '~/composables/useSnackbar'
import { Loading, HeaderUserAuthed } from '~/ui'

const createEmptyCard = (): ICard => ({
    front: '',
    back: '',
    id: crypto?.randomUUID(),
})

const cards = ref<ICard[]>([createEmptyCard()])
const isLoading = ref(false)
const { showSnackbar } = useSnackbar()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const handleAddClick = () => {
    cards.value.push(createEmptyCard())
}

const deleteHandler = (index: number) => {
    cards.value = cards.value.filter((_, i) => i !== index)
}

const save = async () => {
    try {
        const res = await addCards({
            folderId: route.params.id as string,
            cards: cards.value,
        })
        if (res?.success) {
            showSnackbar(t('card.saveSuccess'))
            await router.replace(`/folder/${route.params.id}`)
        }
    } catch (err) {
        showSnackbar(t('auth.errors.something_went_wrong'), 'error')
    }
}
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
