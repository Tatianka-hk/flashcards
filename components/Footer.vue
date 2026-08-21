<template>
    <footer class="w-full">
        <div
            class="flex flex-col gap-6 px-6 pt-6 sm:flex-row sm:items-center sm:justify-between lg:px-6"
        >
            <NuxtLink to="/" class="flex items-center">
                <Logo size="small" />
            </NuxtLink>

            <nav
                class="flex flex-wrap items-center gap-4 text-sm text-text/80 sm:gap-0 sm:text-base"
            >
                <span
                    @click="navigateTo('terms')"
                    class="transition-colors hover:text-primary sm:px-6"
                >
                    /terms
                </span>

                <span class="hidden h-8 w-px bg-text/20 sm:block" />

                <span
                    @click="navigateTo('policy')"
                    class="transition-colors hover:text-primary sm:px-6"
                >
                    /policy
                </span>

                <span class="hidden h-8 w-px bg-text/20 sm:block" />

                <span
                    @click="navigateTo('support')"
                    class="transition-colors hover:text-primary sm:px-6"
                >
                    /support
                </span>
            </nav>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { navigateTo } from 'nuxt/app'
import { Logo } from '~/ui'
</script>
