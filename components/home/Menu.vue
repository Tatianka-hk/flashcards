<template>
    <div
        class="border border-rt border-text p-[40px] flex flex-col justify-between h-[100%]"
    >
        <div class="flex flex-col gap-4">
            <VButton
                v-for="button in buttons"
                :key="button.label"
                :onClick="button.onClick"
                class="flex items-center gap-5"
            >
                <component :is="button.icon" class="h-[36px] w-[36px]" />
                {{ t(button.label) }}
            </VButton>
        </div>
        <div>
            <VButton class="flex items-center gap-5" @click="handleLogout">
                <IconLogout class="h-[36px] w-[36px]" />
                {{ t('menu.buttons.logout') }}
            </VButton>
        </div>
        <FolderDialog
            v-if="isOpen"
            :closeDialog="closeDialog"
            :isOpen="isOpen"
            mode="Create"
            :folderID="folderID"
            :onChanged="() => emit('changed')"
        />
    </div>
</template>
<script setup lang="ts">
import { VueElement } from 'vue'
import { IconAddFolder, IconPlus, IconBase, IconLogout } from '~/assets/icons'
import { useI18n } from 'vue-i18n'
import VButton from '~/ui/VButton.vue'
import FolderDialog from '../folder/FolderDialog.vue'
import { useDialog } from '~/composables/useDialog'
import { useRoute } from 'vue-router'
import { logout } from '~/api/auth'

interface IButton {
    label: string
    icon: VueElement
    onClick: () => void
}
const emit = defineEmits(['changed'])

const { t } = useI18n()
const { isOpen, openDialog, closeDialog } = useDialog()
const route = useRoute()
const folderID: string = route.params.id ?? ''

const buttons: IButton[] = [
    {
        label: 'menu.buttons.addFolder',
        icon: IconAddFolder,
        onClick: openDialog,
    },
    {
        label: 'menu.buttons.addFlashcard',
        icon: IconPlus,
        onClick: () => {},
    },
    {
        label: 'menu.buttons.generate',
        icon: IconBase,
        onClick: () => {
            window.location.href = '/'
        },
    },
]

const handleLogout = () => {
    logout()
    window.location.href = '/'
}
</script>
