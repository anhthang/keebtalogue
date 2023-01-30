import { serverSupabaseClient } from '#supabase/server'
import groupBy from 'lodash.groupby'
import keyBy from 'lodash.keyby'
import sortBy from 'lodash.sortby'

export default defineEventHandler(async (event) => {
    const makerId = event.context.params.maker
    const { sculpt: sculptId } = getQuery(event)

    const client = serverSupabaseClient(event)
    const { data: profile } = await client
        .from('makers')
        .select('*, sculpts (*)')
        .eq('id', makerId)
        .single()

    const { data: colorways } = await client
        .from('colorways')
        .select()
        // .select('*, keycap:keycaps(*)')
        .eq('maker_id', makerId)
        .eq('sculpt_id', sculptId)

    const colorwayMap = groupBy(colorways, 'sculpt_id')

    const sculpts = profile.sculpts.map((sculpt) => {
        const colorways = colorwayMap[sculpt.sculpt_id] || []

        sculpt.colorways = sortBy(colorways, 'order')

        return sculpt
    })

    profile.sculpts = keyBy(sortBy(sculpts, 'name'), 'sculpt_id')

    return profile
})
