<template>
    <Dialog :onClose="closeDialog" :isOpen="isOpen">
        <Field
            type="text"
            v-model="folderName"
            name="folderName"
            label="Folder name"
        />
        <div class="flex justify-center mt-[20px]">
            <VButton extraClass="!bg-blue" :onClick="onCreate">
                {{ 'Create' }}
            </VButton>
        </div>
    </Dialog>
</template>
<script setup lang="ts">
import { Dialog, Field, VButton } from '~/ui'
import { ref } from 'vue'
import { useSnackbar } from '~/composables/useSnackbar'
import { addFolder } from '~/api/folder'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
    isOpen: boolean
    closeDialog: () => void
}>()

const folderName = ref('')
const { showSnackbar } = useSnackbar()
const { t } = useI18n()

const checkFolderName = (): boolean => {
    if (!folderName.value || folderName.value.length < 3) return false
    return true
}
// i18
//message type "success"
const onCreate = () => {
    if (!checkFolderName()) {
        showSnackbar('Folder name must be at least 3 characters', 'error')
        return
    }
    addFolder({ name: folderName.value })
        .then(() => {
            showSnackbar('Folder created successfully', 'success')
            props.closeDialog()
        })
        .catch((err) => {
            showSnackbar(t('auth.errors.something_went_wrong'), 'error')
        })
}
</script>
