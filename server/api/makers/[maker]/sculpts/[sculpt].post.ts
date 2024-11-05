import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { created_at, maker_name, total_colorways, ...rest } =
    await readBody(event)

  const { data, error } = await client
    .from('sculpts')
    .upsert(rest)
    .eq('maker_id', rest.maker_id)
    .eq('sculpt_id', rest.sculpt_id)

  if (error) {
    return error
  }

  return data
})
