import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const maker = await readBody(event)

    const { data, error } = await client
        .from('users')
        .update(maker)
        .eq('id', event.context.params.id)

    return data
})
