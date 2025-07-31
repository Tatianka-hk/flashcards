<template>
  <Result v-if="viewResult" :cards="flashcards" />
  <div
    v-else
    class="flex w-full h-full items-center justify-center flex-col gap-4"
  >
    <FileInput @file:change="onChangeFile" />
    <VButton
      label="Зробити"
      @click="onClickButton"
      :disabled="!fileText || loading"
    />
    <Loading v-if="loading" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { FileInput, VButton } from '../ui'
import Result from './Result.vue'
import type { ICard } from '@/types/card'
import Loading from '@/ui/Loading.vue'

const fileText = ref<string | null>(null)
const viewResult = ref<boolean>(false)
const flashcards = ref<ICard[]>([])
const loading = ref<boolean>(false)

const onChangeFile = (text: string) => {
  fileText.value = text
}

const onClickButton = async () => {
  if (!fileText.value) return
  loading.value = true
  const response = await fetch('http://localhost:3001/flashcards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: fileText.value }),
  })

  const data = await response.json()
  loading.value = false
  flashcards.value = data.flashcards
  viewResult.value = true
  console.log(data)
}
</script>
