import { serverSupabaseClient } from '#supabase/server'

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

  return {
    keycaps: data,
    count,
  }
})
