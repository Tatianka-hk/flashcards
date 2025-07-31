<template>
  <label
    class="flex flex-col items-center justify-center w-2/4 h-[350px] border-2 border-dashed border-accent rounded-lg text-text text-center cursor-pointer bg-[#d8e2ec]"
  >
    <input type="file" class="hidden" @change="onFileChange" />
    <span class="text-base text-text">{{ message }}</span>
  </label>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { extractPdfText } from '../utils/files'

const emit = defineEmits<{
  (e: 'file:change', text: string): void
}>()

const message = ref<string>('Додайте сюди pdf файл')

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  try {
    const file = input.files?.[0]

    if (!file) return
    if (file.name?.length > 0) message.value = `Завантажено: ${file.name}`
    const text = await extractPdfText(file)
    emit('file:change', text)
  } catch (error) {
    message.value = 'Помилка при обробці файлу'
    console.error(error)
  }
}
</script>
