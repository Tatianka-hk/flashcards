<template>
  <div class="w-full h-full flex flex-col items-center justify-center gap-5">
    <div class="flex gap-4 items-center justify-center">
      <Arrow v-if="currentIndex > 0" @click="onClick(-1)" class="rotate-180" />
      <div><Card :card="cards[currentIndex]" /></div>

      <Arrow v-if="currentIndex < cards.length - 1" @click="onClick(1)" />
    </div>
    <div class="flex items-center justify-center mt-4">
      <VButton label="Скачати" @click="downloadJSON(cards)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, Arrow, VButton } from '@/ui'
import type { ICard } from '@/types/card'
import { downloadJSON } from '@/utils/files'

defineProps<{
  cards: ICard[]
}>()

const currentIndex = ref(0)

const onClick = (step: number) => {
  const next = currentIndex.value + step
  currentIndex.value = next
}
</script>
