import { serverSupabaseClient } from '#supabase/server'
import { omitSensitive } from '~/utils'

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
          .order('ic_date', { ascending: false })
          .range(from, to)
      : client
          .from('keycaps')
          .select('*', { count: 'exact' })
          .eq('profile_id', profile_id)
          .neq('status', 'Interest Check')
          .order('profile_keycap_id')
          .range(from, to)

  const { data, count } = await query

  const { data: profile } = await client
    .from('keycap_profiles')
    .select()
    .eq('id', profile_id)
    .single()

  return {
    keycaps: data?.map(omitSensitive),
    profile,
    count,
  }
})
