import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = serverSupabaseClient(event)
    const body = await useBody(event)

    const { data, error } = await client.from('sales').insert([body])

    return data
})
