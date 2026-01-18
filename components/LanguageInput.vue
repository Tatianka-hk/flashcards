<template>
    <SelectInput
        :value="locale"
        :options="langs"
        @change="changeLang($event)"
    />
</template>
<script setup lang="ts">
import { langs } from '~/static'
import { useI18n } from 'vue-i18n'
import { STORAGE_KEY } from '~/utils/static'

const { locale } = useI18n()
const changeLang = (val: string) => {
    locale.value = val
    localStorage.setItem(STORAGE_KEY, val)
}
</script>
