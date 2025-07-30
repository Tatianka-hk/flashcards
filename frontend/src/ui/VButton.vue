<template>
  <button
    @click="onClick"
    class="px-4 py-4 bg-primary text-text rounded hover:bg-thirty text-base"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  onClick: () => void
}>()
</script>
