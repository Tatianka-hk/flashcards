import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
    const publicRoutes = [
        '/',
        '/login',
        '/signup',
        '/404',
        '/verify-email',
        '/reset-password',
        '/terms',
        '/policy',
        '/change-password',
        '/support',
    ]

    if (publicRoutes.includes(to.path)) {
        return
    }

    const { isAuth, fetchAuth } = useAuth()
    await fetchAuth()

    if (!isAuth.value) {
        return navigateTo('/')
    }
})
