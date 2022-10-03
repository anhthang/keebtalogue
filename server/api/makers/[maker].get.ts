import { serverSupabaseClient } from '#supabase/server'
import keyBy from 'lodash.keyby'
import sortBy from 'lodash.sortby'
import sample from 'lodash.sample'
import slugify from 'slugify'

export default defineEventHandler(async (event) => {
    const makerId = event.context.params.maker
    const { sculpt: sculptId } = await useQuery(event.req)

    const client = serverSupabaseClient(event)
    const { data: profile } = await client
        .from('makers')
        .select('*, sculpts (*)')
        .eq('id', makerId)
        .single()

    const { data: colorways } = await client
        .from('colorways')
        .select()
        .eq('maker_id', makerId)
        .eq('sculpt_id', sculptId)

    const colorwayMap = keyBy(colorways, 'colorway_id')

    const filename =
        makerId === 'gaias-creature' ? 'gaia%E2%80%99s-creature' : makerId

    // fetch database from github
    return fetch(
        `https://raw.githubusercontent.com/keycap-archivist/database/master/db/${filename}.json`
    )
        .then((res) => res.json())
        .then((maker) => {
            const sculptMap = keyBy(profile.sculpts, 'sculpt_id')

            let sculpts = maker.sculpts.map((sculpt) => {
                const random = sample(sculpt.colorways)

                sculpt.colorways = sculpt.colorways.map((c, idx) => {
                    c.order = idx

                    // FIXME: to use same property name with our database
                    c.qty = c.totalCount
                    c.release = c.releaseDate

                    if (colorwayMap[c.id]) {
                        // append data from the database
                        Object.assign(c, colorwayMap[c.id])
                    }

                    delete c.totalCount
                    delete c.releaseDate

                    return c
                })

                const slug = slugify(sculpt.name, { lower: true })

                // append data from our database
                const story = sculptMap[slug] && sculptMap[slug].story
                const href = sculptMap[slug] && sculptMap[slug].href

                return {
                    ...sculpt,
                    slug,
                    story,
                    href,
                    preview: random.img,
                }
            })

            sculpts = keyBy(sortBy(sculpts, 'name'), 'slug')

            return {
                ...profile,
                sculpts,
            }
        })
        .catch(() => {
            return
        })
})
