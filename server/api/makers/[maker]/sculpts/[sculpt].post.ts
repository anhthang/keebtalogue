import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = serverSupabaseClient(event)
    const { created_at, ...rest } = await useBody(event.req)

    const { data, error } = await client
        .from('sculpts')
        .upsert([rest])
        .eq('maker_id', rest.maker_id)
        .eq('sculpt_id', rest.sculpt_id)

    if (error) {
        return error
    }

    return data
})
