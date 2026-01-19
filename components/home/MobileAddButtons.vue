<template>
    <div class="w-full relative mt-5 block lg:hidden">
        <div class="flex items-center justify-center w-full">
            <div
                class="bg-blue rounded-full w-[68px] h-[68px] flex items-center justify-center"
                @click="openDialog"
            >
                <IconPlus class="h-[36px] w-[36px]" />
            </div>
        </div>
        <div>
            <button
                @click="addCard"
                class="flex items-center justify-center bg-blue rounded-lg p-4 gap-2 left-2 absolute"
            >
                <IconPlus />
                {{ $t('button.addCards') }}
            </button>
        </div>
        <FolderDialog
            v-if="isOpen"
            :closeDialog="closeDialog"
            :isOpen="isOpen"
            mode="Create"
            :folderID="folderId"
            :onChanged="() => emit('changed')"
        />
    </div>
</template>
<script setup lang="ts">
import { navigateTo } from 'nuxt/app'
import IconPlus from '~/assets/icons/IconPlus.vue'
import { useDialog } from '~/composables/useDialog'

const props = defineProps<{ folderId: string }>()
const emit = defineEmits(['changed'])
const { isOpen, openDialog, closeDialog } = useDialog()

const addCard = () => {
    navigateTo(`/folder/create/${props.folderId}`)
}
</script>
