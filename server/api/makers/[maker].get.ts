import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = serverSupabaseClient(event)
    const { data, error } = await client
        .from('makers')
        .select()
        .eq('id', event.context.params.maker)
        .single()

    return data
})