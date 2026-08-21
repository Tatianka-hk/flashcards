<template>
    <span :class="['font-julius text-center text-text', sizeClass]">
        FLASH CARDS</span
    >
</template>
<script setup lang="ts">
const props = withDefaults(defineProps<{ size?: 'small' | 'large' }>(), {
    size: 'large',
})

const sizeClass =
    props.size === 'small'
        ? ' lg:text-[48px] text-[36px] '
        : ' lg:text-[96px] text-[64px] '
</script>
