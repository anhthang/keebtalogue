import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const maker = await readBody(event)

  const { data } = await client.from('makers').insert(maker)

  return data
})
