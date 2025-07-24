<template>
  <label
    class="flex flex-col items-center justify-center w-2/4 h-[350px] border-2 border-dashed border-accent rounded-lg text-text text-center cursor-pointer bg-[#d8e2ec]"
  >
    <input type="file" class="hidden" @change="onFileChange" />
    <span class="text-base text-text">Додайте сюди файл</span>
  </label>
</template>

<script setup lang="ts">
import { extractPdfText } from '../utils/pdf'
const emit = defineEmits<{
  (e: 'file:change', text: string): void
}>()

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const text = await extractPdfText(file)
  emit('file:change', text)
  console.log('📄 Текст із PDF:', text)
}
</script>
