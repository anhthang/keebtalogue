import { serverSupabaseClient } from '#supabase/server'
import sortBy from 'lodash.sortby'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { data } = await client
    .from('user_collections')
    .select()
    .eq('uid', event.context.params?.id)

  return sortBy(data, 'name')
})
