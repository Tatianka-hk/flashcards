<template>
    <div class="p-[40px] border border-r border-text flex gap-">
        <div class="h-[68px] w-[68px] rounded-full bg-blue" />
        <h1 class="text-2xl font-bold mt-[20px]">{{ email }}</h1>
    </div>
</template>
<script setup lang="ts">
defineProps<{ email: string }>()
</script>
