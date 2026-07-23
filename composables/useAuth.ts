import { useState, onMounted } from '#imports'
import { useRequestHeaders } from 'nuxt/app'

export function useAuth() {
    const isAuth = useState<boolean>('isAuth', () => false)
    const userId = useState<string | null>('userId', () => null)

    async function fetchAuth() {
        const headers = import.meta.server
            ? useRequestHeaders(['cookie'])
            : undefined
        try {
            const res = await $fetch<{ isAuth: boolean; userId?: string }>(
                '/api/me',
                { headers }
            )
            isAuth.value = res.isAuth
            userId.value = res.userId || null
        } catch {
            isAuth.value = false
            userId.value = null
        }
    }

    onMounted(fetchAuth)

    return { isAuth, userId, fetchAuth }
}
