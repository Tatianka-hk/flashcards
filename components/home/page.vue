<template>
    <div class="flex items-stretch min-h-screen">
        <!-- menu -->
        <div class="flex flex-col w-[460px] h-[100vh] min-h-screen">
            <PersonalInfo />
            <Menu :onChanged="() => updateFolders()" />
        </div>
        <div class="flex flex-col w-full">
            <!-- end menu -->
            <FolderItem
                v-for="folder in folders"
                :key="folder.name"
                :folder="folder"
                @changed="() => updateFolders()"
            />
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { getFolders } from '~/api/folder'
import FolderItem from '../folder/FolderItem.vue'
import PersonalInfo from './PersonalInfo.vue'
import Menu from './Menu.vue'
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { navigateTo } from 'nuxt/app'

const { isAuth } = useAuth()

if (!isAuth._value) {
    navigateTo('/')
}

const route = useRoute()
const folders = ref([])

const updateFolders = async () => {
    try {
        const res = await getFolders(route.params.id as string)
        folders.value = res.folders ?? res
    } catch (err) {
        console.error('Failed to load folders:', err)
    }
}

watch(
    () => route.params.id,
    async () => {
        updateFolders()
    },
    { immediate: true }
)
</script>
