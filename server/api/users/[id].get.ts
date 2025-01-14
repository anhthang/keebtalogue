import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { data } = await client
    .from('users')
    .select()
    .eq('id', event.context.params?.id)
    .single()

  return { data }
})
