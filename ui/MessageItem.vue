<template>
    <div
        class="bg-blue text-xl p-4 rounded-lg w-fit md:w-[545px] h-[180px] text-error flex items-center justify-center mb-[20px]"
    >
        {{ message }}
    </div>
</template>
<script setup lang="ts">
defineProps<{ message: string }>()
</script>
