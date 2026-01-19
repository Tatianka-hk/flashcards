<template>
    <Dialog
        :onClose="
            () => {
                console.log('close')
                closeDialog()
            }
        "
        :isOpen="isOpen"
        mode="error"
        classString="min-w-[200px] !px-[20px]"
    >
        <div v-if="isAuth" class="flex flex-col w-full">
            <div v-if="!isBase" :class="CLASS_UNIT" @click="goToBack">
                <Icon3PointsHorizontal />
            </div>
            <div
                v-for="folder in folders"
                @click="getNextFolders(folder._id)"
                :class="CLASS_UNIT"
            >
                <span>{{ folder.name }}</span>
            </div>
            <div :class="CLASS_UNIT" @click="openCreateDialog">
                {{ t('folder.create') }}
            </div>
            <FolderDialog
                v-if="isCreateOpen"
                :closeDialog="closeCreateDialog"
                :isOpen="isCreateOpen"
                mode="Create"
                @changed="fetchFolders"
                :folderID="currentFolderID"
            />
            <VButton @click="save" class="mt-4">
                {{ t('button.saveInFolder') }}
            </VButton>
        </div>
        <div v-else class="flex flex-col gap-2">
            <div>{{ t('message.userIsntAuth') }}</div>
            <div class="flex gap-2">
                <button
                    @click="$router.push('/login')"
                    class="bg-primary cursor-pointer py-1 px-2 text-base rounded-[8px] font-julius"
                >
                    {{ t('auth.actions.login') }}
                </button>
                <button
                    @click="$router.push('/signup')"
                    class="bg-blue cursor-pointer py-1 px-2 text-base rounded-[8px] font-julius"
                >
                    {{ t('auth.actions.signup') }}
                </button>
            </div>
        </div>
    </Dialog>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { getFolders, getParentFolder } from '~/apis/folder'
import { useAuth } from '~/composables/useAuth'
import { ICard, IFolder } from '~/types'
import { Dialog } from '~/ui'
import { Icon3PointsHorizontal } from '~/assets/icons'
import { saveCards } from '~/apis/cards'
import { useDialog } from '~/composables/useDialog'
import { useSnackbar } from '~/composables/useSnackbar'

const CLASS_UNIT =
    'py-2 px-2 border border-text cursor-pointer flex items-start w-full gap-2 min-w-[120px]'
const props = defineProps<{
    isOpen: boolean
    closeDialog: () => void
    cards: ICard[]
}>()

const { isAuth, fetchAuth } = useAuth()
const { t } = useI18n()
const folders = ref<IFolder[]>([])
const currentFolderID = ref<string | null>(null)
const folderStack = ref<string[]>([])
const { showSnackbar } = useSnackbar()
const isBase = computed(() => folderStack.value.length === 0)
const {
    isOpen: isCreateOpen,
    openDialog: openCreateDialog,
    closeDialog: closeCreateDialog,
} = useDialog()

const getNextFolders = async (nextFolderID: string) => {
    folderStack.value.push(nextFolderID)
    currentFolderID.value = nextFolderID

    const res = await getFolders(nextFolderID)
    folders.value = res.folders
}

const fetchFolders = async () => {
    const res = await getFolders(currentFolderID.value)
    folders.value = res.folders
}

const goToBack = async () => {
    folderStack.value.pop()
    currentFolderID.value =
        folderStack.value[folderStack.value.length - 1] ?? null
    const res = await getFolders(currentFolderID.value ?? null)
    folders.value = res.folders
}
const save = async () => {
    try {
        await saveCards({
            cards: props.cards,
            folderId: currentFolderID.value as string,
        })
        showSnackbar(t('card.saveSuccess'), 'success')
        closeDialog()
    } catch (err) {
        showSnackbar(t('auth.errors.something_went_wrong'), 'error')
    }
}

onMounted(async () => {
    await fetchAuth()
    if (!isAuth.value) return
    const res = await getFolders()
    folders.value = res.folders
})
</script>
