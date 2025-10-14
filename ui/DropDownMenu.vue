<template>
    <div class="relative inline-block text-left" ref="root">
        <!-- trigger -->
        <button
            type="button"
            class="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-hoverbackground focus:outline-none focus:ring-2 focus:ring-slate-400"
            @click="toggle"
            @keydown.down.prevent="openAndFocus(0)"
            :aria-expanded="open.toString()"
            aria-haspopup="menu"
        >
            <Icon3Points />
        </button>

        <!-- menu -->
        <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
        >
            <div
                v-show="open"
                class="absolute w-fit right-0 z-50 mt-2 w-40 rounded-[10px] bg-blue shadow-lg ring-1 ring-black/5"
                role="menu"
                aria-orientation="vertical"
                tabindex="-1"
                @keydown.esc.stop.prevent="close()"
                @keydown.up.prevent="focusPrev()"
                @keydown.down.prevent="focusNext()"
            >
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
        </transition>
        <FolderDialog
            v-if="isEditOpen"
            :folderID="folderId"
            :folderName="folderName"
            :closeDialog="closeEditDialog"
            :isOpen="isEditOpen"
            mode="Edit"
            :onChanged="() => emit('changed')"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Icon3Points, IconEdit, IconDelete } from '~/assets/icons'
import { useI18n } from 'vue-i18n'
import FolderDialog from '~/components/folder/FolderDialog.vue'
import { useDialog } from '~/composables/useDialog'
import { deleteFolder } from '~/api/folder'

const props = defineProps<{
    folderName: string
    folderId: string
}>()

const emit = defineEmits(['changed'])

const {
    openDialog: openEditDialog,
    closeDialog: closeEditDialog,
    isOpen: isEditOpen,
} = useDialog()
const { t } = useI18n()

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const item0 = ref<HTMLButtonElement | null>(null)
const item1 = ref<HTMLButtonElement | null>(null)
const items = [item0, item1]

const toggle = async () => {
    open.value = !open.value
    if (open.value) await nextTick(() => item0.value?.focus())
}
const close = () => (open.value = false)

const onClickOutside = (e: MouseEvent) => {
    if (!root.value?.contains(e.target as Node)) close()
}
onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))

const focusIndex = (dir: 1 | -1) => {
    const idx = items.findIndex((r) => r.value === document.activeElement)
    const next = (idx + dir + items.length) % items.length
    items[next].value?.focus()
}
const focusNext = () => focusIndex(1)
const focusPrev = () => focusIndex(-1)
const openAndFocus = async (i: number) => {
    open.value = true
    await nextTick(() => items[i].value?.focus())
}

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
