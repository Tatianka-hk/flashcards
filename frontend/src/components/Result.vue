<template>
  <div class="w-full h-full flex flex-col items-center justify-center gap-5">
    <div v-if="cards.length">
      <div class="flex gap-4 items-center justify-center">
        <div class="w-[110px] h-[100px]">
          <Arrow
            label="Previous"
            v-show="currentIndex > 0"
            @click="onClick(-1)"
            class="rotate-180"
          />
        </div>
        <div><Card :card="cards[currentIndex]" /></div>

        <Arrow v-show="currentIndex < cards.length - 1" @click="onClick(1)" />
      </div>
      <div class="flex items-center justify-center mt-4">
        <VButton label="Скачати" @click="downloadJSON(cards)" />
      </div>
    </div>
    <div v-else class="flex flex-col items-center justify-center">
      <div
        class="bg-blue text-xl p-4 rounded-lg w-[545px] h-[180px] text-error flex items-center justify-center mb-[20px]"
      >
        Не вдалося створити картки
      </div>
      <VButton label="Назад" @click="$emit('close')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Card, Arrow, VButton } from '@/ui'
import type { ICard } from '@/types/card'
import { downloadJSON } from '@/utils/files'
import { cards2 } from '@/test/test'

const props = defineProps<{
  cards: ICard[]
}>()

const cards = []

const currentIndex = ref(0)

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

const onClick = (step: number) => {
  const next = currentIndex.value + step
  if (next >= 0 && next < cards.length) {
    currentIndex.value = next
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') onClick(-1)
  if (event.key === 'ArrowRight') onClick(1)
}
</script>
