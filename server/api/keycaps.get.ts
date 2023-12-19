import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { query, page = 1, size = 24 } = getQuery(event)

  const from = (page - 1) * size
  const to = page * size - 1

  console.log(query, page, size, from, to)

  const { data, count } = await client
    .from('keycaps')
    .select('*', { count: 'exact' })
    .like('slug', `%${query}%`)
    .order('name')
    .range(from, to)

  return {
    keycaps: data,
    count,
  }
})
