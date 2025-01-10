import { serverSupabaseClient } from '#supabase/server'
import dayjs from 'dayjs'
import groupBy from 'lodash.groupby'
import sortBy from 'lodash.sortby'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { data } = await client
    .from('colorways')
    .select('*, maker:makers(name, invertible_logo)')
    .gte('created_at', dayjs().startOf('day'))

  const makers = Object.entries(groupBy(data, 'maker.name')).map(
    ([name, keycaps]) => {
      return {
        name,
        invertible_logo: keycaps[0].maker.invertible_logo,
        id: keycaps[0].maker_id,
        additions: keycaps.length,
      }
    },
  )

  const { data: keycaps } = await client
    .from('keycaps')
    .select('*, profile:keycap_profiles(name)')
    .eq('status', 'Live')
  // .lte('start_date', dayjs().startOf('day'))
  // .gte('end_date', dayjs().startOf('day'))

  return {
    makers: sortBy(makers, 'name'),
    keycaps: sortBy(keycaps, 'profile_keycap_id'),
  }
})
