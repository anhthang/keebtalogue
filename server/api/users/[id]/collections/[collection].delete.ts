import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = serverSupabaseClient(event)

    const { data, error } = await client
        .from('user_collections')
        .delete()
        .eq('id', event.context.params.collection)
        .eq('uid', event.context.params.id)

    return data
})
