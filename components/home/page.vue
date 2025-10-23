<template>
    <div class="flex items-stretch min-h-screen">
        <!-- menu -->
        <div
            class="flex flex-col w-[460px] h-[100vh] min-h-screen hidden lg:block"
        >
            <PersonalInfo />
            <Menu :onChanged="() => updateFolders()" />
        </div>
        <!-- end menu -->
        <div class="flex flex-col w-full">
            <MobileTop />

            <FolderItem
                v-for="folder in folders"
                :key="folder._id"
                :folder="folder"
                @changed="() => updateFolders()"
            />
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { getFolders } from '~/api/folder'
import FolderItem from '../folder/FolderItem.vue'
import { PersonalInfo, MobileTop, Menu } from './'
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { navigateTo } from 'nuxt/app'
import { IFolder } from '~/types'
import VButton from '~/ui/VButton.vue'
import IconLogout from '~/assets/icons/IconLogout.vue'

const route = useRoute()
const folders: IFolder[] = ref([])

const updateFolders = async () => {
    try {
        const res = await getFolders(route.params.id as string)
        folders.value = res?.folders ?? res
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

onMounted(async () => {
    const { isAuth } = useAuth()
    console.log('isAuth', isAuth.value)
    if (!isAuth.value) {
        // navigateTo('/')
    }
})
</script>
