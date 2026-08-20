<template>
    <label class="flex items-start gap-3 cursor-pointer mb-3">
        <input
            :checked="modelValue"
            type="checkbox"
            class="mt-1 h-4 w-4 cursor-pointer"
            @change="onChange"
        />

        <span class="text-sm text-text/70">
            {{ t('auth.policy.prefix') }}

            <span
                class="text-text underline hover:opacity-80"
                @click="goToRoute('terms')"
            >
                {{ t('auth.policy.terms') }}
            </span>

            {{ t('auth.policy.and') }}

            <span
                @click="goToRoute('terms')"
                class="text-text underline hover:opacity-80"
            >
                {{ t('auth.policy.privacy') }} </span
            >.
        </span>
    </label>
</template>
<script setup lang="ts">
import { navigateTo } from 'nuxt/app'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()

const onChange = (event: Event) => {
    const target = event.target as any

    emit('update:modelValue', target.checked)
}

const goToRoute = (route: string) => {
    navigateTo(`/${route}`)
}
</script>
