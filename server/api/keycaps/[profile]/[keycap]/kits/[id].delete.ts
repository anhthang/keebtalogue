import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { profile, keycap, id } = event.context.params

  const { data } = await client
    .from('keycap_kits')
    .delete()
    .eq('id', id)
    .eq('profile_keycap_id', `${profile}/${keycap}`)

  return data
})
