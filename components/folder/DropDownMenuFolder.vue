<template>
    <DropDownMenu>
        <div>
            <button
                ref="item0"
                class="flex w-full gap-2 items-center rounded-t-[10px] justify-between w-full px-4 py-2 border-b border-text hover:text-slate-900 hover:bg-hoverblue"
                role="menuitem"
                @click="onEdit"
            >
                <IconEdit class="w-[24px] h-[24px]" />
                <span class="text-2xl">{{ t('dropdown.edit') }}</span>
            </button>

            <button
                ref="item1"
                class="flex w-full gap-2 items-center rounded-b-[10px] text-rose-600 hover:text-rose-700 px-4 py-2 hover:bg-hoverblue"
                role="menuitem"
                @click="onDelete"
            >
                <IconDelete class="text-rose-600 w-[24px] h-[24px]" />
                <span class="text-2xl">{{ t('dropdown.delete') }}</span>
            </button>
        </div>
    </DropDownMenu>
    <FolderDialog
        v-if="isEditOpen"
        :folderID="folderId"
        :folderName="folderName"
        :closeDialog="closeEditDialog"
        :isOpen="isEditOpen"
        mode="Edit"
        :onChanged="() => emit('changed')"
    />
</template>
<script setup lang="ts">
import { DropDownMenu } from '../../ui'
import { useDialog } from '~/composables/useDialog'
import { useI18n } from 'vue-i18n'
import FolderDialog from '~/components/folder/FolderDialog.vue'
import { IconEdit, IconDelete } from '~/assets/icons'
import { ref } from 'vue'
import { deleteFolder } from '~/api/folder'

const {
    openDialog: openEditDialog,
    closeDialog: closeEditDialog,
    isOpen: isEditOpen,
} = useDialog()
const { t } = useI18n()
const emit = defineEmits(['changed'])

const item0 = ref<HTMLButtonElement | null>(null)
const item1 = ref<HTMLButtonElement | null>(null)
const items = [item0, item1]

const props = defineProps<{
    folderName: string
    folderId: string
}>()

const onEdit = () => {
    openEditDialog()
    close()
}

const onDelete = async () => {
    try {
        await deleteFolder(props.folderId)
        emit('changed')
    } catch (e) {
        console.error(e)
    } finally {
        close()
    }
}
</script>
