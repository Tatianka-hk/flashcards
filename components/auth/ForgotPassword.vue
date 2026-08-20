<template>
    <label class="flex items-start justify-start gap-3 cursor-pointer mb-3">
        <span
            @click="navigateTo('/reset-password')"
            class="text-text underline hover:opacity-80"
        >
            {{ t('auth.forgot_password') }}
        </span>
    </label>
</template>
<script setup lang="ts">
import { navigateTo } from 'nuxt/app'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
