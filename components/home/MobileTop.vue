<template>
    <div class="lg:hidden flex items-center justify-center min-h-[80px]">
        <VButton
            class="absolute left-4 w-[42px] h-[42px] flex items-center justify-center !p-0"
            @click="$router.back()"
            v-if="$route.path !== '/home'"
        >
            <IconBack class="h-[24px] w-[24px]" />
        </VButton>
        <span
            class="font-julius text-2xl text-text underline [justify-self:center] cursor-pointer"
            @click="handleGenerate"
        >
            GENERATE
        </span>
        <VButton
            class="absolute right-4 w-[42px] h-[42px] flex items-center justify-center !p-0"
            @click="handleLogout"
        >
            <IconLogout class="h-[24px] w-[24px]" />
        </VButton>
    </div>
</template>
<script setup lang="ts">
import { IconLogout } from '~/assets/icons'
import { logout } from '~/api/auth'
import { VButton } from '~/ui'
import IconBack from '~/assets/icons/IconBack.vue'

const handleLogout = () => {
    logout()
    window.location.href = '/'
}

const handleGenerate = () => {
    window.location.href = '/'
}
</script>
