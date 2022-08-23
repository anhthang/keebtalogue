import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = serverSupabaseClient(event)
    const { data: makers, error } = await client
        .from('makers')
        .select()
        .eq('id', event.context.params.maker)

    return makers[0]
})
