<template>
  <div
    class="flex flex-col items-center justify-center w-2/4 h-[350px] border-2 border-dashed border-accent rounded-lg text-text text-center cursor-pointer bg-[#d8e2ec]"
  >
    <input type="file" class="hidden" @change="onFileChange" />
    <span class="text-base text-text">Додайте сюди файл</span>
  </div>
</template>

<script setup lang="ts">
function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    console.log('📁 Обрано файл:', file.name)
  }
}
</script>
