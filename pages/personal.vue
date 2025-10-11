<template>
    <div class="flex items-stretch min-h-screen">
        <!-- menu -->
        <div class="flex flex-col w-[460px] h-full min-h-screen">
            <PersonalInfo />
            <Menu />
        </div>
        <!-- end menu -->
    </div>
</template>
<script setup lang="ts">
import { PersonalInfo, Menu } from '~/components/personal'
</script>
