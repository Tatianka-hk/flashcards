<template>
    <div class="flex items-stretch min-h-screen">
        <!-- menu -->
        <div class="flex flex-col w-[460px] min-h-dvh lg:block hidden h-full">
            <PersonalInfo />
            <Menu
                @changed="() => updateFolders()"
                :hasCards="cards?.length > 0"
            />
        </div>
        <!-- end menu -->
        <main class="flex flex-col w-full overflow-y-auto">
            <MobileTop />
            <div v-if="isLoading" class="p-4 opacity-70"><Loading /></div>
            <div
                v-else-if="error"
                class="p-4 text-rose-600 w-full h-full flex items-center justify-center"
            >
                {{ t('failedToLoad') }}
            </div>

            <template v-else>
                <!-- BULK ACTION BAR -->
                <div
                    v-if="selectedCardIds.length"
                    class="sticky top-0 z-10 backdrop-blur border-b border-slate-200 px-4 py-3 flex items-center justify-between"
                >
                    <div class="text-sm text-slate-700">
                        {{ t('folder.selected') }}:
                        <b>{{ selectedCardIds.length }}</b>
                    </div>

                    <div class="flex items-center gap-2">
                        <button
                            class="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-sm"
                            @click="clearSelection"
                        >
                            {{ t('folder.cancel') }}
                        </button>

                        <IconCopy
                            class="cursor-pointer text-read hover:text-slate-600"
                            @click="onCopyOrMode(SaveMode.ADD)"
                        />
                        <IconSend
                            class="cursor-pointer text-read hover:text-slate-600"
                            @click="onCopyOrMode(SaveMode.MOVE)"
                        />
                        <IconDelete
                            class="cursor-pointer text-rose-600 hover:text-rose-700"
                            @click="onDelete"
                        />
                    </div>
                    <SelectFolderDialog
                        :closeDialog="closeDialog"
                        v-if="isOpen"
                        :cards="selectedCards"
                        @changed="onCopiedFolder"
                        :lang="lang"
                        :onClose="closeDialog"
                        :isOpen="isOpen"
                        :oldFolderID="routeId"
                        :mode="mode"
                    />
                </div>
                <FolderItem
                    v-for="folder in folders"
                    :key="folder._id"
                    :folder="folder"
                    @changed="updateFolders"
                />

                <CardItem
                    v-for="card in cards"
                    :key="card._id"
                    :card="card"
                    @changed="updateCards"
                    :lang="lang"
                    :selected="selectedCardIds.includes(card._id)"
                    @toggleSelect="toggleSelect(card._id, $event)"
                />

                <div
                    v-if="!folders.length && !cards.length"
                    class="p-6 text-slate-500 w-full h-full flex items-center justify-center"
                >
                    {{ t('card.noCards') }}
                </div>
            </template>
            <MobileAddButtons :folderId="routeId" />
        </main>
    </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { getFolders, getLang } from '~/apis/folder'
import FolderItem from '../folder/FolderItem.vue'
import { PersonalInfo, Menu, MobileTop, MobileAddButtons } from './'
import { useRoute } from 'vue-router'
import { ICard, IFolder, SaveMode } from '~/types'
import { deleteManyCards, getCards } from '~/apis/cards'
import CardItem from '../folder/CardItem.vue'
import { Loading } from '../../ui'
import { useI18n } from 'vue-i18n'
import { useDialog } from '~/composables/useDialog'
import { useSnackbar } from '~/composables/useSnackbar'
import { IconCopy, IconDelete, IconSend } from '~/assets/icons'

const folders = ref<IFolder[]>([])
const cards = ref<ICard[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const selectedCardIds = ref<string[]>([])
const lang = ref<string>('en')
const mode = ref<SaveMode>(SaveMode.ADD)

const { isOpen, openDialog, closeDialog } = useDialog()
const { showSnackbar } = useSnackbar()
const { t } = useI18n()
const route = useRoute()

const routeId = computed(() => (route.params.id as string) || '')
const selectedCards = computed(() => {
    return cards.value.filter((x) => selectedCardIds.value.includes(x._id))
})

const toggleSelect = (id: string, checked: boolean) => {
    if (checked) {
        if (!selectedCardIds.value.includes(id)) selectedCardIds.value.push(id)
    } else {
        selectedCardIds.value = selectedCardIds.value.filter((x) => x !== id)
    }
}
const clearSelection = () => (selectedCardIds.value = [])

const updateFolders = async () => {
    try {
        isLoading.value = true
        error.value = null
        const res = await getFolders(routeId.value)
        folders.value = res?.folders ?? res
    } catch (err) {
        console.error('Failed to load folders:', err)
        error.value = 'folders'
    } finally {
        isLoading.value = false
    }
}

const updateCards = async () => {
    try {
        isLoading.value = true
        error.value = null
        const res = await getCards(route.params.id as string)
        cards.value = res?.cards ?? res
    } catch (err) {
        console.error('Failed to load cards:', err)
        error.value = 'cards'
    } finally {
        isLoading.value = false
    }
}

const updateLang = async () => {
    try {
        if (!route.params.id) return
        const res = await getLang(route.params.id as string)
        lang.value = res.lang
    } catch (err) {
        console.error('Failed to load lang:', err)
        error.value = 'lang'
    } finally {
        isLoading.value = false
    }
}

const onCopiedFolder = async () => {
    clearSelection()
    showSnackbar(t('folder.copySuccess'), 'success')
    await updateCards()
}

const onCopyOrMode = (selectedMode: SaveMode) => {
    mode.value = selectedMode
    openDialog()
}

const onDelete = async () => {
    try {
        await deleteManyCards(selectedCardIds.value)
        clearSelection()
        showSnackbar(t('folder.deleteSuccess'), 'success')
        await updateCards()
    } catch (e) {
        showSnackbar(t('auth.errors.something_went_wrong'), 'error')
    }
}
watch(
    () => routeId.value,
    async () => {
        await Promise.all([updateFolders(), updateCards(), updateLang()])
    },
    { immediate: true }
)
</script>
