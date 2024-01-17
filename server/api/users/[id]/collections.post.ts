import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const body = await readBody(event)

  const { data } = await client.from('user_collections').insert(body)

  if (body.published && body.type === 'share') {
    await client.from('user_shared_collections').insert(body)
  }

  return data
})
