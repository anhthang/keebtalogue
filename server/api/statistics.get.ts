import { serverSupabaseClient } from '#supabase/server'
import dayjs from 'dayjs'
import groupBy from 'lodash.groupby'
import sortBy from 'lodash.sortby'

export default defineEventHandler(async (event) => {
    const client = serverSupabaseClient(event)
    const { data } = await client
        .from('colorways')
        .select('*, maker:makers(name)')
        .gte('created_at', dayjs().startOf('day'))

    return groupBy(sortBy(data, 'maker.name'), 'maker.name')
})
