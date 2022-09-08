import { serverSupabaseClient } from '#supabase/server'
import sortBy from 'lodash.sortby'

export default defineEventHandler(async (event) => {
    const client = serverSupabaseClient(event)

    const { start, end } = useQuery(event.req)

    const { data } = await client
        .from('sales')
        .select('*, maker:makers(*)')
        .gte('date', start)
        .lte('date', end)

    return data
})
