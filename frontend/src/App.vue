<script setup lang="ts">
import SelectInput from './ui/SelectInput.vue'
</script>

<template>
  <SelectInput
    value="en"
    :options="[
      { value: 'en', label: 'English' },
      { value: 'ua', label: 'Українська' },
    ]"
  />
</template>

<style scoped></style>
