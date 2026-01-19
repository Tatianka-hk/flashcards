<template>
    <div
        class="border border-b border-text p-[30px] text-text flex justify-between w-full"
    >
        <div class="flex items-center gap-2">
            <label class="relative flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    class="peer sr-only"
                    :checked="selected"
                    @change="
                        $emit(
                            'toggleSelect',
                            ($event.target as HTMLInputElement).checked
                        )
                    "
                />

                <span
                    class="w-5 h-5 min-w-[20px] min-h-[20px] border-2 border-text flex items-center justify-center transition bg-background peer-checked:bg-black peer-checked:border-black"
                >
                    <!-- check icon -->
                    <svg
                        class="w-3 h-3 text-background opacity-0 transition peer-checked:opacity-100"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </span>
            </label>

            <span class="text-2xl font-julius">
                {{ card.front }}
            </span>
        </div>
        <span class="flex gap-5 items-center">
            <SoundButton :value="card.front" :lang="lang" />
            <DropDownMenuCard
                :cardId="card._id"
                :onChanged="() => $emit('changed')"
            />
        </span>
    </div>
</template>
<script setup lang="ts">
import { ICard } from '~/types'
import DropDownMenuCard from './DropDownMenuCard.vue'

defineProps<{
    card: ICard
    lang: string
    selectable?: boolean
    selected?: boolean
}>()
defineEmits(['changed'])
</script>
