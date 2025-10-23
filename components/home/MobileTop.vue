<template>
    <div class="lg:hidden flex items-center justify-center min-h-[80px]">
        <span
            class="font-julius text-2xl text-text underline [justify-self:center] cursor-pointer"
            @click="handleGenerate"
        >
            GENERATE
        </span>
        <VButton
            class="flex items-center gap-5 [justify-self:end] justify-center absolute right-4"
            @click="handleLogout"
        >
            <IconLogout class="h-[36px] w-[36px]" />
        </VButton>
    </div>
</template>
<script setup lang="ts">
import { IconLogout } from '~/assets/icons'
import { logout } from '~/api/auth'
import { VButton } from '~/ui'

const handleLogout = () => {
    logout()
    window.location.href = '/'
}

const handleGenerate = () => {
    window.location.href = '/'
}
</script>
