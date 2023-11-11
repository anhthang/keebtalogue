import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { query } = getQuery(event)

  const fts = query?.toString().split(' ').join(' | ')

  const { data: makers } = await client
    .from('makers')
    .select()
    .textSearch('name', `${fts}`)
    .limit(10)

  const { data: sculpts } = await client
    .from('sculpts')
    .select('*, maker:makers(name)')
    .textSearch('name', `${fts}`)
    .limit(10)

  const { data: colorways } = await client
    .from('colorways')
    .select('*, maker:makers(name), sculpt:sculpts(name)')
    .textSearch('name', `${fts}`)
    .limit(10)

  return {
    data: [
      {
        name: 'Makers',
        options: makers?.map((m: any) => ({ name: m.name, value: m.id })),
      },
      {
        name: 'Sculpts',
        options: sculpts?.map((s: any) => ({
          name: `${s.maker.name} > ${s.name}`,
          value: `${s.maker_id}/${s.sculpt_id}`,
        })),
      },
      {
        name: 'Colorways',
        options: colorways?.map((s: any) => ({
          name: `${s.maker.name} > ${s.sculpt.name} > ${s.name}`,
          value: `${s.maker_id}/${s.sculpt_id}?cid=${s.colorway_id}`,
        })),
      },
    ].filter((c) => c.options?.length),
  }
})
