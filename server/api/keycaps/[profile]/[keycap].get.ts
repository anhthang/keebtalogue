import { serverSupabaseClient } from '#supabase/server'
import dayjs from 'dayjs'
import sortBy from 'lodash.sortby'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { profile, keycap } = event.context.params

  const { data } = await client
    .from('keycaps')
    .select('*, kits:keycap_kits(*)')
    // .select('*, artisans:colorways(*), kits:keycap_kits(*)')
    .eq('profile_keycap_id', `${profile}/${keycap}`)
    .single()

  if (data && Array.isArray(data.kits)) {
    data.kits = sortBy(data.kits, 'id')
  }

  const from = dayjs(data.start, 'YYYY-MM-DD')
  const to = dayjs(data.end, 'YYYY-MM-DD')

  if (from.isValid() && to.isValid()) {
    data.timeline =
      from.get('year') === to.get('year')
        ? `${from.format('DD MMM')} - ${to.format('DD MMM YYYY')}`
        : `${from.format('DD MMM YYYY')} - ${to.format('DD MMM YYYY')}`
  }

  // // get unique maker_id
  // const makerIds = [...new Set(data.artisans.map((a) => a.maker_id))]

  // const { data: makers } = await client
  //     .from('makers')
  //     .select()
  //     .in('id', makerIds)

  // const { data: sculpts } = await client
  //     .from('sculpts')
  //     .select()
  //     .in('maker_id', makerIds)

  // const makerMap = keyBy(makers, 'id')
  // const sculptMap = keyBy(sculpts, (s) => `${s.maker_id}/${s.sculpt_id}`)

  // data.artisans.forEach((cap) => {
  //     cap.maker_name = makerMap[cap.maker_id].name
  //     cap.sculpt_name = sculptMap[`${cap.maker_id}/${cap.sculpt_id}`].name
  // })

  return data
})
