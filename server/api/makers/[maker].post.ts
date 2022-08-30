import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = serverSupabaseClient(event)
    const body = await useBody(event.req)

    const { data, error } = await client
        .from('makers')
        .update([body])
        .eq('id', event.context.params.maker)

    if (error) {
        return error
    }

    return data
})
