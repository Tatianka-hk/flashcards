<template>
  <FileInput @file:change="onChangeFile" />
  <VButton label="Зробити" @click="onClickButton" />
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { FileInput, VButton } from '../ui'
const fileText = ref<File | null>(null)
const onChangeFile = (text: string) => {
  fileText.value = text
}

const onClickButton = async () => {
  if (!fileText.value) return

  const response = await fetch('http://localhost:3001/flashcards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: fileText.value }),
  })

  const data = await response.json()
  console.log('📄 Flashcards:', data.flashcards)
}
</script>
