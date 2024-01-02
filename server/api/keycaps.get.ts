import { serverSupabaseClient } from '#supabase/server'
import dayjs from 'dayjs'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { query, page, size } = getQuery(event)

  const from = (page - 1) * size
  const to = page * size - 1

  const { data, count } = await client
    .from('keycaps')
    .select('*', { count: 'exact' })
    .like('profile_keycap_id', `${query}%`)
    .order('name')
    .range(from, to)

  data.forEach((keycap) => {
    const from = dayjs(keycap.start, 'YYYY-MM-DD')
    const to = dayjs(keycap.end, 'YYYY-MM-DD')

    if (from.isValid() && to.isValid()) {
      keycap.timeline =
        from.get('year') === to.get('year')
          ? `${from.format('DD MMM')} - ${to.format('DD MMM YYYY')}`
          : `${from.format('DD MMM YYYY')} - ${to.format('DD MMM YYYY')}`
    }
  })

  return {
    keycaps: data,
    count,
  }
})
