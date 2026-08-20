<template>
    <div
        class="min-h-screen w-full bg-background flex items-center justify-center px-4"
    >
        <div class="w-full max-w-[620px] bg-background text-text">
            <div class="flex justify-center border-b border-text px-6 py-8">
                <Logo />
            </div>

            <div
                class="flex flex-col items-center text-center px-6 py-10 sm:px-10"
            >
                <h1 class="font-julius text-2xl sm:text-3xl mb-4">
                    {{ title }}
                </h1>

                <p class="text-base leading-7 mb-8 max-w-[480px]">
                    {{ description }}
                </p>

                <VButton
                    v-if="status === 'error'"
                    :onClick="verifyEmail"
                    :disabled="isLoading"
                    class="min-w-[200px]"
                >
                    {{
                        isLoading
                            ? t('auth.verify_email.actions.verifying')
                            : t('auth.verify_email.actions.retry')
                    }}
                </VButton>

                <VButton
                    v-if="status === 'success'"
                    :onClick="() => goToLogin()"
                    class="min-w-[200px]"
                >
                    {{ t('auth.verify_email.actions.login') }}
                </VButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { navigateTo, useRoute } from 'nuxt/app'
import { useI18n } from 'vue-i18n'

import { Logo, VButton } from '~/ui'
import { useSnackbar } from '~/composables/useSnackbar'
import { verifyEmail as verifyEmailApi } from '~/apis/auth'

type VerificationStatus = 'loading' | 'success' | 'error' | 'invalid'

const { t } = useI18n()
const route = useRoute()
const { showSnackbar } = useSnackbar()

const status = ref<VerificationStatus>('loading')
const isLoading = ref(false)

const token = computed(() => {
    const routeToken = route.query.token

    return typeof routeToken === 'string' ? routeToken : ''
})

const title = computed(() => {
    switch (status.value) {
        case 'success':
            return t('auth.verify_email.success.title')

        case 'error':
            return t('auth.verify_email.error.title')

        case 'invalid':
            return t('auth.verify_email.invalid_token.title')

        default:
            return t('auth.verify_email.loading.title')
    }
})

const description = computed(() => {
    switch (status.value) {
        case 'success':
            return t('auth.verify_email.success.description')

        case 'error':
            return t('auth.verify_email.error.description')

        case 'invalid':
            return t('auth.verify_email.invalid_token.description')

        default:
            return t('auth.verify_email.loading.description')
    }
})

async function verifyEmail() {
    if (!token.value) {
        status.value = 'invalid'
        return
    }

    isLoading.value = true
    status.value = 'loading'

    try {
        await verifyEmailApi(token.value)
        status.value = 'success'

        showSnackbar(t('auth.verify_email.success.snackbar'), 'success')
    } catch (error) {
        status.value = 'error'

        showSnackbar(t('auth.verify_email.error.snackbar'), 'error')
    } finally {
        isLoading.value = false
    }
}

function goToLogin() {
    navigateTo('/login')
}

onMounted(() => {
    verifyEmail()
})
</script>
