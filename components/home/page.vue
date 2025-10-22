<template>
    <div class="flex items-stretch min-h-screen">
        <!-- menu -->
        <div class="flex flex-col w-[460px] h-[100vh] min-h-screen">
            <PersonalInfo />
            <Menu :onChanged="() => updateFolders()" />
        </div>
        <!-- end menu -->
        <div class="flex flex-col w-full">
            <FolderItem
                v-for="folder in folders"
                :key="folder._id"
                :folder="folder"
                @changed="() => updateFolders()"
            />
            <CardItem
                v-for="card in cards"
                :key="card._id"
                :card="card"
                @changed="() => updateCards()"
            />
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { getFolders } from '~/api/folder'
import FolderItem from '../folder/FolderItem.vue'
import PersonalInfo from './PersonalInfo.vue'
import Menu from './Menu.vue'
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { ICard, IFolder } from '~/types'
import { getCards } from '~/api/cards'
import CardItem from '../folder/CardItem.vue'

const route = useRoute()
const folders: IFolder[] = ref([])
const cards: ICard[] = ref([])

const updateFolders = async () => {
    try {
        const res = await getFolders(route.params.id as string)
        folders.value = res?.folders ?? res
    } catch (err) {
        console.error('Failed to load folders:', err)
    }
}

const updateCards = async () => {
    try {
        const res = await getCards(route.params.id as string)
        cards.value = res?.cards ?? res
    } catch (err) {
        console.error('Failed to load cards:', err)
    }
}

watch(
    () => route.params.id,
    async () => {
        updateFolders()
        updateCards()
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
