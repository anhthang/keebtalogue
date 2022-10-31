import { serverSupabaseClient } from '#supabase/server'
import sortBy from 'lodash.sortby'

export default defineEventHandler(async (event) => {
    const client = serverSupabaseClient(event)
    const { query } = useQuery(event)

    const { data } = await client.from('keysets').select().like('slug', `%${query}%`)

    return sortBy(data, 'id')
})
