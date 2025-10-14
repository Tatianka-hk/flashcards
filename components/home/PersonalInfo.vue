<template>
    <div class="p-[40px] border border-r border-text flex gap-2 justify-center">
        <UserCircle />
        <h1 class="text-xl font-bold mt-[20px]">{{ email }}</h1>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getEmail } from '~/api/auth'
import UserCircle from '~/ui/UserCircle.vue'

const email = ref('')
onMounted(async () => {
    const res: { email: string } = await getEmail()
    email.value = res.email
})
</script>
