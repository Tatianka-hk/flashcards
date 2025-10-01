<template>
  <div
    class="bg-blue text-text rounded-lg p-4 text-center flex items-center justify-center h-[366px] w-[222px]"
  >
    {{ text }}
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  text: string
}>()
</script>
