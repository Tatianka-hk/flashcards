<template>
  <div class="text-text text-base bg-primary rounded-lg">
    <div class="flex gap-1 py-4 px-4" @click="onClick">
      {{ findSelectedOption(value) }}
      <!-- зробити реверс -->
      <ChevronUpIcon v-if="opened" />
      <ChevronDownIcon v-else />
    </div>
    <div v-if="opened">
      <ul>
        <li
          v-for="option in options"
          :key="option.value"
          class="py-2 px-4 cursor-pointer hover:bg-thirty border border-text rounded-lg"
          @click="onOptionClick(option.value)"
        >
          {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDownIcon, ChevronUpIcon } from '../assets/icons'

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
  (e: 'value:change', val: valueType): void
}>()

const props = defineProps<PropsType>()

const opened = ref<boolean>(false) //interesting

const onClick = () => {
  opened.value = !opened.value
}

const findSelectedOption = (val: valueType): string => {
  return props.options.find((option) => option.value === val).label
}

const onOptionClick = (val: valueType) => {
  emit('value:change', val)
  opened.value = false
}
</script>
