<template>
    <div
        class="flex items-center"
        role="button"
        tabindex="0"
        :aria-label="label"
    >
        <div class="md:w-[110px] md:h-[100px] w-0 h-[50px] bg-blue"></div>
        <div
            class="w-0 h-0 border-t-[50px] border-b-[50px] border-l-[50px] border-t-transparent border-b-transparent border-l-blue"
        ></div>
    </div>
</template>
<script setup lang="ts">
withDefaults(
    defineProps<{
        label?: string
    }>(),
    {
        label: 'Next',
    }
)
</script>
