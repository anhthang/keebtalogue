import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = serverSupabaseClient(event)
    const body = await useBody(event.req)

    const { data, error } = await client
        .from('sculpts')
        .upsert([body])
        .eq('maker_id', body.maker_id)
        .eq('sculpt_id', body.sculpt_id)

    if (error) {
        return error
    }

    return data
})
