<template>
    <div class="p-[40px] border border-r border-text flex gap-2 justify-center">
        <UserCircle />
        <Loading v-if="loading" />

        <h1 class="text-xl font-bold mt-[20px]" v-else>{{ email }}</h1>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getEmail } from '~/apis/auth'
import { UserCircle, Loading } from '~/ui'

const email = ref('')
const error = ref('')
const loading = ref(false)

onMounted(async () => {
    try {
        loading.value = true
        const res = await getEmail()
        if (res?.email) {
            email.value = res.email
        } else {
            error.value = 'Failed to load email'
        }
    } catch (err) {
        console.error('Failed to fetch email:', err)
        error.value = 'Failed to load email'
    } finally {
        loading.value = false
    }
})
</script>
