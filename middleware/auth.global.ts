import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
    const publicRoutes = ['/', '/login', '/signup', '/404']

    if (publicRoutes.includes(to.path)) {
        return
    }

    const { isAuth, fetchAuth } = useAuth()
    fetchAuth()
        .then(() => {
            if (!isAuth.value) {
                return navigateTo('/login')
            }
        })
        .catch(() => {
            return navigateTo('/login')
        }) // fix it (delete it)
})
