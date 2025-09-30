<template>
    <div class="w-full flex flex-col items-center justify-center">
        <Logo class="mt-[80px] mb-[40px]" />

        <div class="flex flex-col gap-4 mx-auto w-[700px] mb-[40px]">
            <Field
                type="email"
                name="email"
                :label="t('auth.labels.email')"
                v-model="email"
            />
            <Field
                type="password"
                name="password"
                :label="t('auth.labels.password')"
                v-model="password"
            />
            <Field
                type="password"
                name="сonfirm_password"
                :label="t('auth.labels.confirm_password')"
                v-model="confirmPassword"
            />
        </div>
        <VButton
            :label="t('auth.actions.signup')"
            :disabled="!email || !password || !confirmPassword"
            :onClick="onClick"
        ></VButton>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { registerUser } from '~/api/auth'
import { Field, Logo, VButton } from '~/ui'
import { useSnackbar } from '../utils/useSnackbar'
const { showSnackbar } = useSnackbar()
const { t } = useI18n()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const onClick = () => {
    if (!isValidEmail(email.value)) {
        showSnackbar(t('auth.errors.email_invalid'), 'error')
        return
    }
    if (confirmPassword.value !== password.value) {
        showSnackbar(t('auth.errors.password_mismatch'), 'error')
        return
    }
    registerUser({ email: email.value, password: password.value }).catch(
        (err) => {
            showSnackbar(
                err instanceof Error && err.message === 'User already exists'
                    ? t('auth.errors.user_already_exists')
                    : t('auth.errors.something_went_wrong'),
                'error'
            )
        }
    )
}
</script>
