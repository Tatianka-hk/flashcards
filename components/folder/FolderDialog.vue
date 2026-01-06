<template>
    <Dialog :onClose="closeDialog" :isOpen="isOpen">
        <Field
            type="text"
            v-model="folderName"
            name="folderName"
            :label="t('folder.name')"
        />
        <div class="flex justify-center mt-[20px]">
            <VButton extraClass="!bg-blue" :onClick="handleClick">
                {{ mode === 'Create' ? t('folder.create') : t('folder.edit') }}
            </VButton>
        </div>
    </Dialog>
</template>
<script setup lang="ts">
import { Dialog, Field, VButton } from '~/ui'
import { ref } from 'vue'
import { useSnackbar } from '~/composables/useSnackbar'
import { useI18n } from 'vue-i18n'
import { addFolder, editFolder } from '~/apis/folder'

const props = defineProps<{
    isOpen: boolean
    closeDialog: () => void
    folderName?: string
    folderID: string
    mode: 'Create' | 'Edit'
}>()

const emit = defineEmits<{
    (e: 'changed'): void
}>()

const { t } = useI18n()
const { showSnackbar } = useSnackbar()

const folderName = ref(props.folderName)

const checkFolderName = (): boolean => {
    if (!folderName.value || folderName.value.length < 3) return false
    return true
}

const handleClick = () => {
    if (!checkFolderName()) {
        showSnackbar(t('folder.nameError'), 'error')
        return
    }
    ;(props.mode === 'Create'
        ? addFolder({ name: folderName.value, parentId: props.folderID })
        : editFolder(props.folderID, folderName.value)
    )
        .then(() => {
            showSnackbar(
                props.mode === 'Create'
                    ? t('folder.createSuccess')
                    : t('folder.editSuccess'),
                'success'
            )
            props.closeDialog()
            emit('changed')
        })
        .catch((err) => {
            showSnackbar(t('auth.errors.something_went_wrong'), 'error')
        })
}
</script>
