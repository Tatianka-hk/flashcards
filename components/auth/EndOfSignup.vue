<template>
    <div
        class="min-h-screen bg-background flex items-center justify-center px-4 py-10"
    >
        <div
            class="w-full max-w-[620px] border border-text bg-background text-text"
        >
            <div class="px-6 py-8 sm:px-10 text-center">
                <Logo class="mx-auto mb-6" />

                <h1 class="font-julius text-2xl sm:text-3xl">
                    {{ t('auth.verify_email.sent.title') }}
                </h1>
            </div>

            <div class="px-6 py-8 sm:px-10 sm:py-10">
                <div class="text-center">
                    <p class="text-base leading-7 mb-3">
                        {{ t('auth.verify_email.sent.description') }}
                    </p>

                    <div
                        v-if="email"
                        class="bg-blue border border-text px-4 py-3 mb-8 break-all"
                    >
                        <p class="font-semibold">
                            {{ email }}
                        </p>
                    </div>
                </div>

                <div class="flex justify-center">
                    <VButton
                        :disabled="isSending || secondsLeft > 0"
                        :onClick="resendVerificationEmail"
                        class="min-w-[220px]"
                    >
                        <span v-if="isSending">
                            {{ t('auth.verify_email.resend.sending') }}
                        </span>

                        <span v-else-if="secondsLeft > 0">
                            {{
                                t('auth.verify_email.resend.available_in', {
                                    seconds: secondsLeft,
                                })
                            }}
                        </span>

                        <span v-else>
                            {{ t('auth.verify_email.resend.button') }}
                        </span>
                    </VButton>
                </div>

                <div
                    v-if="successMessage"
                    class="mt-6 border border-mint bg-accent/20 px-4 py-3 text-sm text-center"
                >
                    {{ successMessage }}
                </div>

                <div
                    v-if="errorMessage"
                    class="mt-6 border border-danger bg-primary px-4 py-3 text-sm text-center text-danger"
                >
                    {{ errorMessage }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { resendVerification } from '~/apis/auth'
import { VButton, Logo } from '~/ui'

const RESEND_DELAY_SECONDS = 60
const RESEND_STORAGE_KEY = 'verification-email-resend-at'

const { t, locale } = useI18n()

const props = defineProps<{
    email?: string
}>()

const isSending = ref(false)
const secondsLeft = ref(0)
const successMessage = ref('')
const errorMessage = ref('')

let timer: ReturnType<typeof setInterval> | null = null

function updateSecondsLeft() {
    const resendAt = Number(localStorage.getItem(RESEND_STORAGE_KEY))

    if (!resendAt) {
        secondsLeft.value = 0
        stopTimer()
        return
    }

    const difference = resendAt - Date.now()

    if (difference <= 0) {
        secondsLeft.value = 0
        localStorage.removeItem(RESEND_STORAGE_KEY)
        stopTimer()
        return
    }

    secondsLeft.value = Math.ceil(difference / 1000)
}

function startTimer() {
    stopTimer()
    updateSecondsLeft()

    if (secondsLeft.value <= 0) {
        return
    }

    timer = setInterval(updateSecondsLeft, 1000)
}

function stopTimer() {
    if (!timer) {
        return
    }

    clearInterval(timer)
    timer = null
}

function startCooldown() {
    const resendAt = Date.now() + RESEND_DELAY_SECONDS * 1000

    localStorage.setItem(RESEND_STORAGE_KEY, resendAt.toString())

    startTimer()
}

async function resendVerificationEmail() {
    if (isSending.value || secondsLeft.value > 0 || !props.email) {
        return
    }

    try {
        isSending.value = true
        successMessage.value = ''
        errorMessage.value = ''

        await resendVerification({
            email: props.email,
            locale: locale.value,
        })

        successMessage.value = t('auth.verify_email.resend.success')

        startCooldown()
    } catch (error) {
        console.error('Resend verification email error:', error)

        errorMessage.value = t('auth.verify_email.resend.error')
    } finally {
        isSending.value = false
    }
}

onMounted(() => {
    startTimer()
})

onBeforeUnmount(() => {
    stopTimer()
})
</script>
