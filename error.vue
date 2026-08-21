<template>
    <div
        class="flex flex-col items-center gap-4 text-text w-full h-full justify-center"
    >
        <span class="text-4xl font-julius"> 404 </span>
        <span class="text-2xl font-julius">{{ t('error404.message') }}</span>
        <VButton @click="navigateTo('/')" class="mt-[40px]"
            >{{ t('error404.button') }}
        </VButton>
    </div>
</template>
<script setup lang="ts">
import type { NuxtError } from '#app'
import { VButton } from '~/ui'
import { useI18n } from 'vue-i18n'
import { navigateTo } from 'nuxt/app'
defineProps<{
    error: NuxtError
}>()

const { t } = useI18n()
</script>
