<template>
    <div
        class="border border-b border-text p-[30px] text-text flex justify-between w-full"
    >
        <span
            class="text-2xl font-julius decoration-underline"
            @click="$router.push(`/folder/${folder._id}`)"
        >
            {{ folder.name }}
        </span>
        <span class="flex gap-5 items-center">
            <IconPlay @click="PassCards" />
            <DropDownMenuFolder
                :folderName="folder.name"
                :folderId="folder._id"
                :onChanged="() => $emit('changed')"
            />
        </span>
    </div>
</template>
<script setup lang="ts">
import { IFolder } from '~/types'
import { IconPlay } from '~/assets/icons'
import DropDownMenuFolder from '~/components/folder/DropDownMenuFolder.vue'
import { navigateTo } from 'nuxt/app'

const props = defineProps<{ folder: IFolder }>()
defineEmits(['changed'])

const PassCards = () => {
    navigateTo(`/folder/learn/${props.folder?._id}`)
}
</script>
