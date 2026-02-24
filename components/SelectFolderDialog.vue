<template>
    <Dialog
        :onClose="closeDialog"
        :isOpen="isOpen"
        mode="error"
        classString="min-w-[200px] !px-[20px]"
    >
        <div v-if="isAuth" class="flex flex-col w-full">
            <div class="flex items-center flex-col justify-between mb-4 gap-1">
                <span class="text-xl font-bold">{{
                    t('folder.selectFolder')
                }}</span>
                <span v-if="currentFolderName" class="text-lg"
                    >{{ currentFolderName }}
                </span>
            </div>
            <div v-if="!isBase" :class="CLASS_UNIT" @click="goToBack">
                <Icon3PointsHorizontal />
            </div>
            <Loading v-if="isLoading" />
            <div v-else class="max-h-[250px] overflow-y-scroll">
                <div
                    v-for="folder in folders"
                    @click="getNextFolders(folder._id)"
                    :class="CLASS_UNIT"
                >
                    <span>{{ folder.name }}</span>
                </div>
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
            <VButton @click="save" class="mt-4" :disabled="!currentFolderID">
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
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getFolders } from '~/apis/folder'
import { useAuth } from '~/composables/useAuth'
import { ICard, IFolder, SaveMode } from '~/types'
import { Dialog } from '~/ui'
import { Icon3PointsHorizontal } from '~/assets/icons'
import { addCards, moveCards } from '~/apis/cards'
import { useDialog } from '~/composables/useDialog'
import { useSnackbar } from '~/composables/useSnackbar'

const CLASS_UNIT =
    'py-2 px-2 border border-text cursor-pointer flex items-start w-full gap-2 min-w-[120px]'
const props = withDefaults(
    defineProps<{
        isOpen: boolean
        closeDialog: () => void
        cards: ICard[]
        mode: SaveMode
        oldFolderID?: string
    }>(),
    {
        mode: SaveMode.ADD,
    }
)

const { isAuth, fetchAuth } = useAuth()
const { t } = useI18n()
const folders = ref<IFolder[]>([])
const currentFolderID = ref<string | null>(null)
const folderStack = ref<string[]>([])
const currentFolderName = ref<string | null>(null)
const isLoading = ref(false)
const { showSnackbar } = useSnackbar()
const isBase = computed(() => folderStack.value.length === 0)
const {
    isOpen: isCreateOpen,
    openDialog: openCreateDialog,
    closeDialog: closeCreateDialog,
} = useDialog()

const emit = defineEmits<{
    (e: 'changed'): void
}>()

const loadFolders = async (folderId: string | null) => {
    isLoading.value = true
    try {
        const res = await getFolders(folderId)
        folders.value = res.folders
        currentFolderName.value = res.name ?? null
        currentFolderID.value = folderId
    } finally {
        isLoading.value = false
    }
}
const getNextFolders = async (nextFolderID: string) => {
    folderStack.value.push(nextFolderID)
    await loadFolders(nextFolderID)
}

const goToBack = async () => {
    if (folderStack.value.length === 0) return
    folderStack.value.pop()
    await loadFolders(folderStack.value[folderStack.value.length - 1] ?? null)
}

const fetchFolders = async () => await loadFolders(currentFolderID.value)

const save = async () => {
    if (!currentFolderID.value) {
        showSnackbar(t('folder.selectFolderError'), 'error')
        return
    }
    try {
        if (props.mode === SaveMode.MOVE) {
            if (!props.oldFolderID) {
                showSnackbar(t('auth.errors.something_went_wrong'), 'error')
                return
            }
            await moveCards({
                cards: props.cards,
                folderId: currentFolderID.value as string,
            })
        } else {
            await addCards({
                cards: props.cards,
                folderId: currentFolderID.value as string,
            })
        }
        emit('changed')
        showSnackbar(t('card.saveSuccess'), 'success')
        props.closeDialog()
    } catch (err) {
        showSnackbar(t('auth.errors.something_went_wrong'), 'error')
    }
}

onMounted(async () => {
    isLoading.value = true
    try {
        await fetchAuth()
        if (!isAuth.value) return
        const res = await getFolders()
        folders.value = res.folders
    } finally {
        isLoading.value = false
    }
})
</script>
