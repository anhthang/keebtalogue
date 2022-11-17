import { serverSupabaseClient } from '#supabase/server'
import { crc32 } from 'crc'
import slugify from 'slugify'

export default defineEventHandler(async (event) => {
    const client = serverSupabaseClient(event)
    const body = await readBody(event)

    const slug = slugify(body.name, { lower: true })
    body.colorway_id = crc32(
        `${body.maker_id}-${body.sculpt_id}-${slug}-${body.order}`
    ).toString(16)

    delete body.keyset

    const sqlQuery = body.id
        ? client.from('colorways').update(body).eq('id', body.id)
        : client
              .from('colorways')
              .upsert(body)
              .eq('colorway_id', body.colorway_id)
              .eq('maker_id', body.maker_id)
              .eq('sculpt_id', body.sculpt_id)

    const { data, error } = await sqlQuery

    if (error) {
        return error
    }

    return data
})
