export default defineNuxtRouteMiddleware((to, from) => {
    const user = useSupabaseUser()

    if (to.path === '/login') {
        if (user.value) {
            return navigateTo(from.path)
        }
    } else if (!user.value && to.fullPath !== from.fullPath) {
        return navigateTo('/login')
    }
})
