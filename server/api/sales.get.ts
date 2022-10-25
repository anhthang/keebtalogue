import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = serverSupabaseClient(event)

    const { start, end } = useQuery(event)

    const { data } = await client
        .from('sales')
        .select('*, maker:makers(*)')
        .gte('date', start)
        .lte('date', end)

    return data
})
