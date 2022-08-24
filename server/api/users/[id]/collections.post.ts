import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = serverSupabaseClient(event)

    const body = await useBody(event.req)

    const { data, error } = await client.from('user_collections').insert([body])

    return data
})
