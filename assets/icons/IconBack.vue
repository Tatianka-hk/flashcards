<template>
    <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        :class="extraClass"
    >
        <path
            d="M13.5 22.5L4.5 13.5M4.5 13.5L13.5 4.5M4.5 13.5H22.5C24.8869 13.5 27.1761 14.4482 28.864 16.136C30.5518 17.8239 31.5 20.1131 31.5 22.5C31.5 24.8869 30.5518 27.1761 28.864 28.864C27.1761 30.5518 24.8869 31.5 22.5 31.5H18"
            stroke="black"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
</template>
<script setup lang="ts">
defineProps<{ extraClass?: string }>()
</script>
