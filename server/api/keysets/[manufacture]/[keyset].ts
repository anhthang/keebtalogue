import { serverSupabaseClient } from '#supabase/server'
import groupBy from 'lodash.groupby'
import sortBy from 'lodash.sortby'

export default defineEventHandler(async (event) => {
    const client = serverSupabaseClient(event)
    const { manufacture, keyset } = event.context.params

    const { data } = await client
        .from('colorways')
        .select('*, maker:makers(name)')
        .eq('keyset', `${manufacture}/${keyset}`)

    return groupBy(sortBy(data, 'maker.name'), 'maker.name')
})
