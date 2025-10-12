<template>
    <div class="flex items-stretch min-h-screen">
        <!-- menu -->
        <div class="flex flex-col w-[460px] h-[100vh] min-h-screen">
            <PersonalInfo />
            <Menu />
        </div>
        <div class="flex flex-col w-full">
            <!-- end menu -->
            <FolderItem
                v-for="folder in folders"
                :key="folder.name"
                :folder="folder"
            />
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getFolders } from '~/api/folder'
import FolderItem from '../folder/FolderItem.vue'
import PersonalInfo from './PersonalInfo.vue'
import Menu from './Menu.vue'

const folders = ref([])

onMounted(() => {
    getFolders().then((res) => {
        folders.value = res.folderss
    })
})
</script>
