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

  const statistics = Object.entries(groupBy(data, 'maker.name')).map(
    ([name, keycaps]) => {
      return {
        name,
        invertible_logo: keycaps[0].maker.invertible_logo,
        id: keycaps[0].maker_id,
        additions: keycaps.length,
      }
    },
  )

  return sortBy(statistics, 'name')
})
