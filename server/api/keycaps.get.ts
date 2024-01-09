import { serverSupabaseClient } from '#supabase/server'
import dayjs from 'dayjs'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { profile_id, page, size, ic } = getQuery(event)

  const from = (page - 1) * size
  const to = page * size - 1

  const query =
    ic === 'true'
      ? client
          .from('keycaps')
          .select('*', { count: 'exact' })
          .eq('status', 'Interest Check')
          .order('name')
          .range(from, to)
      : client
          .from('keycaps')
          .select('*', { count: 'exact' })
          .eq('profile_id', profile_id)
          .neq('status', 'Interest Check')
          .order('name')
          .range(from, to)

  const { data, count } = await query

  data.forEach((keycap) => {
    const from = dayjs(keycap.start_date, 'YYYY-MM-DD')
    const to = dayjs(keycap.end_date, 'YYYY-MM-DD')

    if (from.isValid() && to.isValid()) {
      keycap.timeline =
        from.get('year') === to.get('year')
          ? `${from.format('DD MMM')} - ${to.format('DD MMM YYYY')}`
          : `${from.format('DD MMM YYYY')} - ${to.format('DD MMM YYYY')}`
    }
  })

  const { data: profile } = await client
    .from('keycap_profiles')
    .select()
    .eq('id', profile_id)
    .single()

  return {
    keycaps: data,
    profile,
    count,
  }
})
