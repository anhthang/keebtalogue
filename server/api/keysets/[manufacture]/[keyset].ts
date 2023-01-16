import { serverSupabaseClient } from '#supabase/server'
import keyBy from 'lodash.keyby'

export default defineEventHandler(async (event) => {
    const client = serverSupabaseClient(event)
    const { manufacture, keyset } = event.context.params

    const { data } = await client
        .from('keysets')
        .select('*, artisans:colorways(*), kits:keyset_kits(*)')
        .eq('slug', `${manufacture}/${keyset}`)
        .single()

    // get unique maker_id
    const makerIds = [...new Set(data.artisans.map((a) => a.maker_id))]

    const { data: makers } = await client
        .from('makers')
        .select()
        .in('id', makerIds)

    const { data: sculpts } = await client
        .from('sculpts')
        .select()
        .in('maker_id', makerIds)

    const makerMap = keyBy(makers, 'id')
    const sculptMap = keyBy(sculpts, (s) => `${s.maker_id}/${s.sculpt_id}`)

    data.artisans.forEach((cap) => {
        cap.maker_name = makerMap[cap.maker_id].name
        cap.sculpt_name = sculptMap[`${cap.maker_id}/${cap.sculpt_id}`].name
    })

    return data
})
