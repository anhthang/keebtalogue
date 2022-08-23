import { serverSupabaseClient } from '#supabase/server'
import sortBy from 'lodash.sortby'

export default defineEventHandler(async (event) => {
    const client = serverSupabaseClient(event)
    const { slug, ...rest} = await useBody(event.req)

    const { data, error } = await client
        .from('makers')
        .update([rest])
        .eq('id', event.context.params.maker)

    if (error) {
        return error
    }

    return data
})
