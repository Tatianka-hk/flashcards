<template>
    <Dialog :onClose="closeDialog" :isOpen="isOpen">
        <div class="flex flex-col gap-2">
            <Field
                type="text"
                v-model="folderName"
                name="folderName"
                :label="t('folder.name')"
            />
            <div class="h-full">
                <SelectInput
                    class="!bg-blue w-full h-[40px] border border-text !rounded-none h-full"
                    :value="folderLang"
                    :options="langs20"
                    dialogMode
                    @change="changeLang($event)"
                />
            </div>
        </div>
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
import { useI18n } from 'vue-i18n'
import { useSnackbar } from '~/composables/useSnackbar'
import { addFolder, editFolder } from '~/apis/folder'
import { langs20 } from '~/static'

const props = defineProps<{
    isOpen: boolean
    closeDialog: () => void
    folderName?: string
    folderID: string
    mode: 'Create' | 'Edit'
    lang?: string
}>()

const emit = defineEmits<{
    (e: 'changed'): void
}>()

const { t, locale } = useI18n()
const { showSnackbar } = useSnackbar()

const folderName = ref(props.folderName ?? '')
const folderLang = ref(props.lang ?? 'en')

const changeLang = (val: string) => {
    folderLang.value = val
}

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
        ? addFolder({
              name: folderName.value,
              parentId: props.folderID,
              lang: folderLang.value,
          })
        : editFolder(props.folderID, folderName.value, folderLang.value)
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
