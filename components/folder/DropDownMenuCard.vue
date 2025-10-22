<template>
    <DropDownMenu :menuClass="'right-0 '">
        <template #trigger="{ toggle }">
            <button
                type="button"
                class="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-hoverbackground focus:outline-none focus:ring-2 focus:ring-slate-400"
                @click="toggle"
                aria-haspopup="menu"
            >
                <Icon3Points />
            </button>
        </template>

        <div class="overflow-hidden rounded-[10px]" role="none">
            <button
                data-menu-item
                class="flex w-full gap-2 items-center justify-between px-4 py-2 border-b border-text hover:text-slate-900 hover:bg-hoverblue focus:outline-none rounded-t-[10px]"
                role="menuitem"
                @click="onEdit"
            >
                <IconEdit class="w-[24px] h-[24px] min-w-[24px]" />
                <span class="text-2xl">{{ t('dropdown.edit') }}</span>
            </button>

            <button
                data-menu-item
                class="flex w-full gap-2 items-center text-rose-600 hover:text-rose-700 px-4 py-2 hover:bg-hoverblue focus:outline-none rounded-b-[10px]"
                role="menuitem"
                @click="onDelete"
            >
                <IconDelete class="text-rose-600 w-[24px] h-[24px]" />
                <span class="text-2xl">{{ t('dropdown.delete') }}</span>
            </button>
        </div>
    </DropDownMenu>
</template>

<script setup lang="ts">
import DropDownMenu from '~/ui/DropDownMenu.vue'
import { Icon3Points, IconEdit, IconDelete } from '~/assets/icons'
import { useI18n } from 'vue-i18n'
import { deleteCard } from '~/api/cards'
import { navigateTo } from 'nuxt/app'

const props = defineProps<{
    cardId: string
}>()
const emit = defineEmits(['changed'])
const { t } = useI18n()

const onEdit = () => {
    navigateTo(`/card/edit/${props.cardId}`)
}

const onDelete = async () => {
    try {
        await deleteCard(props.cardId)
        emit('changed')
    } catch (e) {
        console.error(e)
    }
}
</script>
