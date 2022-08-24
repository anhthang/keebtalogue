import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = serverSupabaseClient(event)
    const maker = await useBody(event.req)

    const { data, error } = await client
        .from('users')
        .update([maker])
        .eq('id', event.context.params.id)

    return data
})
