<script setup lang="ts">
import { IconUser } from '@/assets/icons'
</script>

<template>
    <div
        class="bg-blue text-text rounded-full flex items-center justify-center h-[56px] w-[56px]"
        @click="
            () => {
                console.log('here')
                $router.push('/home')
            }
        "
    >
        <IconUser class="size-9" />
    </div>
</template>
