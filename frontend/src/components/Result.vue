<template>
  <div class="flex gap-4 w-full h-full items-center justify-center">
    <Arrow v-if="currentIndex > 0" @click="onClick(-1)" class="rotate-180" />
    <div><Card :card="giveCard()" /></div>

    <Arrow v-if="currentIndex < cards.length - 1" @click="onClick(1)" />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import Arrow from '@/ui/Arrow.vue'
import Card from '@/ui/Card/Card.vue'
import { cards1 } from '@/test/test.ts'

const cards = ref(cards1)
const currentIndex = ref(0)

const onClick = (step: number) => {
  const next = currentIndex.value + step
  currentIndex.value = next
}

const giveCard = () => {
  return cards.value[currentIndex.value]
}
</script>
