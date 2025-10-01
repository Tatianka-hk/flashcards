<template>
    <div class="relative text-text text-base bg-primary rounded-lg w-fit">
        <div class="flex gap-1 py-4 px-4 cursor-pointer" @click="onClick">
            {{ findSelectedOption(value) }}
            <IconChevronUp v-if="opened" />
            <IconChevronDown v-else />
        </div>
        <ul
            v-if="opened"
            class="absolute top-full left-0 z-10 mt-1 w-full bg-white border border-text rounded-lg shadow-md"
        >
            <li
                v-for="option in options"
                :key="option.value"
                class="py-2 px-4 cursor-pointer bg-primary hover:bg-thirty"
                @click="onOptionClick(option.value)"
            >
                {{ option.label }}
            </li>
        </ul>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { IconChevronDown, IconChevronUp } from '../assets/icons'

type valueType = string | number
type OptionType = {
    label: string
    value: valueType
}
interface PropsType {
    options: OptionType[]
    value: valueType
}
const emit = defineEmits<{
    (e: 'change', val: valueType): void
}>()

const props = defineProps<PropsType>()

const opened = ref<boolean>(false) //interesting

const onClick = () => {
    opened.value = !opened.value
}

const findSelectedOption = (val: valueType): string => {
    return (
        props?.options?.find((option: OptionType) => option.value === val)
            ?.label || ''
    )
}

const onOptionClick = (val: valueType) => {
    emit('change', val)
    opened.value = false
}
</script>
