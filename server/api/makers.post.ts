import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = serverSupabaseClient(event)
    const maker = await readBody(event)

    const { data, error } = await client.from('makers').insert(maker)

    return data
})
