import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { query } = getQuery(event)

  const fts = query
    ?.toString()
    .trim()
    .split(/[\s,\t,\n]+/) // split and remove more than 1 space
    .join(' | ')

  const makerSearch = client
    .from('makers')
    .select()
    .textSearch('fts', `${fts}`)
    .limit(10)

  const sculptSearch = client
    .from('sculpts')
    .select('*, maker:makers(name)')
    .textSearch('fts', `${fts}`)
    .limit(10)

  const colorwaySearch = client
    .from('colorways')
    .select('*, maker:makers(name), sculpt:sculpts(name)')
    .textSearch('fts', `${fts}`)
    .limit(10)

  const keycapSearch = client
    .from('keycaps')
    .select('*, profile:keycap_profiles(name)')
    .textSearch('fts', `${fts}`)
    .order('profile_keycap_id')
    .limit(10)

  const [makers, sculpts, colorways, keycaps] = await Promise.all([
    makerSearch,
    sculptSearch,
    colorwaySearch,
    keycapSearch,
  ])

  return {
    data: [
      {
        title: 'Makers',
        options: makers.data?.map((m: any) => ({
          title: m.name,
          value: `/artisan/maker/${m.id}`,
          maker_id: m.id,
          maker_name: m.name,
        })),
      },
      {
        title: 'Sculpts',
        options: sculpts.data?.map((s: any) => ({
          title: `${s.maker.name} > ${s.name}`,
          value: `/artisan/maker/${s.maker_id}/${s.sculpt_id}`,
          maker_id: s.maker_id,
          maker_name: s.maker.name,
          sculpt_id: s.sculpt_id,
          sculpt_name: s.name,
        })),
      },
      {
        title: 'Colorways',
        options: colorways.data?.map((c: any) => ({
          title: `${c.maker.name} > ${c.sculpt.name} > ${c.name}`,
          value: `/artisan/maker/${c.maker_id}/${c.sculpt_id}?cid=${c.colorway_id}`,
          maker_id: c.maker_id,
          maker_name: c.maker.name,
          sculpt_id: c.sculpt_id,
          sculpt_name: c.sculpt.name,
          colorway_id: c.colorway_id,
          colorway_name: c.name,
        })),
      },
      {
        title: 'Keycaps',
        options: keycaps.data?.map((kc: any) => ({
          title: `${kc.profile.name} ${kc.name}`,
          value: `/keycap/${kc.profile_keycap_id}`,
        })),
      },
    ].filter((c) => c.options?.length),
  }
})
