<template>
    <div
        class="border border-b border-text p-[30px] text-text flex justify-between w-full"
    >
        <span class="text-2xl font-julius">
            {{ card.front }}
        </span>
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

defineProps<{ card: ICard; lang: string }>()
defineEmits(['changed'])
</script>
