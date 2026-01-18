<template>
    <div
        class="border border-rt border-text p-[40px] flex flex-col justify-between h-[calc(100vh-138px)]"
    >
        <div class="flex flex-col gap-4">
            <VButton
                v-for="button in buttons"
                :key="button.label"
                @click="button.onClick"
                class="flex items-center gap-5"
            >
                <component :is="button.icon" class="h-[36px] w-[36px]" />
                {{ t(button.label) }}
            </VButton>
            <LanguageInput />
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
import { VueElement, computed } from 'vue'
import { IconAddFolder, IconPlus, IconBase, IconLogout } from '~/assets/icons'
import { useI18n } from 'vue-i18n'
import VButton from '~/ui/VButton.vue'
import FolderDialog from '../folder/FolderDialog.vue'
import { useDialog } from '~/composables/useDialog'
import { useRoute } from 'vue-router'
import { logout } from '~/apis/auth'
import LanguageInput from '../LanguageInput.vue'
import IconPlay from '~/assets/icons/IconPlay.vue'

interface IButton {
    label: string
    icon: VueElement
    onClick: () => void
    disabled: boolean
}

interface IProps {
    hasCards: boolean
}

const emit = defineEmits(['changed'])

const { t } = useI18n()
const { isOpen, openDialog, closeDialog } = useDialog()
const route = useRoute()
const folderID: string = route.params.id ?? ''

const props = defineProps<IProps>()

const buttons = computed<IButton[]>(() => {
    const baseButtons: IButton[] = [
        {
            label: 'menu.buttons.addFolder',
            icon: IconAddFolder,
            onClick: openDialog,
            disabled: false,
        },
        {
            label: 'menu.buttons.generate',
            icon: IconBase,
            onClick: () => {
                window.location.href = '/'
            },
            disabled: false,
        },
    ]

    if (route.path !== '/home') {
        baseButtons.splice(
            1,
            0,
            ...[
                {
                    label: 'menu.buttons.addFlashcard',
                    icon: IconPlus,
                    onClick: () => {
                        window.location.href = `/folder/create/${folderID}`
                    },
                    disabled: false,
                },
                {
                    label: 'menu.buttons.studyFlashcards',
                    icon: IconPlay,
                    onClick: () => {
                        window.location.href = `/folder/learn/${folderID}`
                    },
                    disabled: !props.hasCards,
                },
            ]
        )
    }

    return baseButtons
})

const handleLogout = () => {
    logout()
    window.location.href = '/'
}
</script>
