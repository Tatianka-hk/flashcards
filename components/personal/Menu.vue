<template>
    <div
        class="border border-rt border-text p-[40px] flex flex-col justify-between h-[100vh]"
    >
        <div class="flex flex-col gap-4">
            <VButton
                v-for="button in buttons"
                :key="button.label"
                @click="button.onClick"
                class="flex items-center gap-5"
            >
                <component :is="button.icon" class="h-[36px] w-[36px]" />
                {{ button.label }}
            </VButton>
        </div>
        <div>
            <VButton class="flex items-center gap-5">
                <IconLogout class="h-[36px] w-[36px]" />
                {{ $t('button.logout') }}
            </VButton>
        </div>
    </div>
</template>
<script setup lang="ts">
import { VueElement } from 'vue'
import { IconAddFolder, IconPlus, IconBase, IconLogout } from '~/assets/icons'
import { useI18n } from 'vue-i18n'
import VButton from '~/ui/VButton.vue'

interface IButton {
    label: string
    icon: VueElement
    onClick: () => void
}

const { t } = useI18n()

const buttons: IButton = [
    {
        label: t('button.addFolder'),
        icon: IconAddFolder,
        onClick: () => {},
    },
    {
        label: t('button.addFlashcard'),
        icon: IconPlus,
        onClick: () => {},
    },
    {
        label: t('button.generate'),
        icon: IconBase,
        onClick: () => {},
    },
]
</script>
