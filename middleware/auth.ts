export default defineNuxtRouteMiddleware((to, _from) => {
    const user = useSupabaseUser()

    if (!user.value && to.fullPath !== _from.fullPath) {
        return navigateTo('/login')
    }
})
