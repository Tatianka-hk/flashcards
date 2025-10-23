<template>
    <div class="flex items-stretch min-h-screen">
        <!-- menu -->
        <div class="flex flex-col w-[460px] min-h-dvh">
            <PersonalInfo />
            <Menu @changed="() => updateFolders()" />
        </div>
        <!-- end menu -->
        <main class="flex flex-col w-full overflow-y-auto">
            <div v-if="isLoading" class="p-4 opacity-70"><Loading /></div>
            <div
                v-else-if="error"
                class="p-4 text-rose-600 w-full h-full flex items-center justify-center"
            >
                {{ t('failedToLoad') }}
            </div>

            <template v-else>
                <FolderItem
                    v-for="folder in folders"
                    :key="folder._id"
                    :folder="folder"
                    @changed="updateFolders"
                />

                <CardItem
                    v-for="card in cards"
                    :key="card._id"
                    :card="card"
                    @changed="updateCards"
                />

                <div
                    v-if="!folders.length && !cards.length"
                    class="p-6 text-slate-500 w-full h-full flex items-center justify-center"
                >
                    {{ t('card.noCards') }}
                </div>
            </template>
        </main>
    </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { getFolders } from '~/api/folder'
import FolderItem from '../folder/FolderItem.vue'
import PersonalInfo from './PersonalInfo.vue'
import Menu from './Menu.vue'
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { ICard, IFolder } from '~/types'
import { getCards } from '~/api/cards'
import CardItem from '../folder/CardItem.vue'
import { Loading } from '../../ui'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const folders = ref<IFolder[]>([])
const cards = ref<ICard[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const { t } = useI18n()
const routeId = computed(() => (route.params.id as string) || '')

const updateFolders = async () => {
    try {
        isLoading.value = true
        error.value = null
        const res = await getFolders(routeId.value)
        folders.value = res?.folders ?? res
    } catch (err) {
        console.error('Failed to load folders:', err)
        error.value = 'folders'
    } finally {
        isLoading.value = false
    }
}

const updateCards = async () => {
    try {
        isLoading.value = true
        error.value = null
        const res = await getCards(route.params.id as string)
        cards.value = res?.cards ?? res
    } catch (err) {
        console.error('Failed to load cards:', err)
        error.value = 'cards'
    } finally {
        isLoading.value = false
    }
}

watch(
    () => routeId.value,
    async () => {
        await Promise.all([updateFolders(), updateCards()])
    },
    { immediate: true }
)

onMounted(async () => {
    const { isAuth } = useAuth()
    console.log('isAuth', isAuth.value)
    if (!isAuth.value) {
        // navigateTo('/')
    }
})
</script>
