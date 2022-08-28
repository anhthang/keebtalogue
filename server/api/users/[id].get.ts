import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = serverSupabaseClient(event)
    return await client
        .from('users')
        .select('*, collections:user_collections(*)')
        .eq('id', event.context.params.id)
        .single()
})
