<template>
    <div class="w-full justify-between flex mb-[20px]">
        <VButton
            @click="$router.back()"
            class="w-[42px] h-[42px] flex items-center justify-center"
        >
            <IconBack class="w-[24px] h-[24px] min-w-[24px]" />
        </VButton>
        <VButton
            @click="logoutHandle()"
            class="w-[42px] h-[42px] flex items-center justify-center"
        >
            <IconLogout class="w-[24px] h-[24px] min-w-[24px]" />
        </VButton>
    </div>
</template>
<script setup lang="ts">
import { IconLogout, IconBack } from '~/assets/icons/'
import { logout } from '~/apis/auth'

const logoutHandle = () => {
    try {
        logout()
    } catch (err) {
        console.log(err)
    }
}
</script>
