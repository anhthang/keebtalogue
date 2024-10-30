import { serverSupabaseClient } from '#supabase/server'
import groupBy from 'lodash.groupby'
import keyBy from 'lodash.keyby'
import sortBy from 'lodash.sortby'
import { omitSensitive } from '~/utils'

export default defineEventHandler(async (event) => {
  const makerId = event.context.params?.maker
  const { sculpt: sculptId } = getQuery(event)

  const client = await serverSupabaseClient(event)
  const { data: profile } = await client
    .from('makers')
    .select('*, sculpts (*, total_colorways:colorways(count))')
    .eq('id', makerId)
    .single()

  const { data: colorways } = await client
    .from('colorways')
    .select()
    // .select('*, keycap:keycaps(*)')
    .eq('maker_id', makerId)
    .eq('sculpt_id', sculptId)

  const colorwayMap = groupBy(colorways?.map(omitSensitive), 'sculpt_id')

  if (!profile) return

  const sculpts = profile.sculpts.map((sculpt: any) => {
    const colorways = colorwayMap[sculpt.sculpt_id] || []

    sculpt.total_colorways = sculpt.total_colorways[0]?.count
    sculpt.colorways = sortBy(colorways, 'order')

    return omitSensitive(sculpt)
  })

  profile.sculpts = keyBy(sortBy(sculpts, 'name'), 'sculpt_id')

  return omitSensitive(profile)
})
