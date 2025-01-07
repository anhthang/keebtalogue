import { serverSupabaseClient } from '#supabase/server'
import { crc32 } from 'crc'
import slugify from 'slugify'

const selfMakers = ['alpha-keycaps', 'gooey-keys']

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { keycap, sculpt, ...rest } = await readBody(event)

  if (selfMakers.includes(rest.maker_id)) {
    const slug = slugify(rest.name, { lower: true })
    rest.colorway_id = crc32(
      `${rest.maker_id}-${rest.sculpt_id}-${slug}-${rest.order}`,
    ).toString(16)
  }

  const sqlQuery = rest.id
    ? client.from('colorways').update(rest).eq('id', rest.id)
    : client
        .from('colorways')
        .upsert(rest)
        .eq('colorway_id', rest.colorway_id)
        .eq('maker_id', rest.maker_id)
        .eq('sculpt_id', rest.sculpt_id)

  const { data, error } = await sqlQuery

  if (error) {
    throw error
  }

  return data
})
