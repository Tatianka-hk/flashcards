<template>
    <button
        @click="ifClicked"
        :class="[
            'px-4 py-4 text-text rounded text-base rounded-lg',
            disabled
                ? 'bg-[#d8c3c2] cursor-not-allowed'
                : 'bg-primary hover:bg-thirty/60 cursor-pointer',
            extraClass,
        ]"
    >
        {{ label }}
    </button>
</template>

<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        label: string
        onClick: () => void
        disabled?: boolean
        extraClass?: string
    }>(),
    {
        disabled: false,
    }
)

const ifClicked = (): void => {
    if (!props.disabled) {
        props.onClick()
    }
}
</script>
