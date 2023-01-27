import { serverSupabaseClient } from '#supabase/server'
import sortBy from 'lodash.sortby'

export default defineEventHandler(async (event) => {
    const client = serverSupabaseClient(event)
    const { query } = getQuery(event)

    const { data } = await client.from('keycaps').select().like('slug', `%${query}%`)

    return sortBy(data, 'id')
})
