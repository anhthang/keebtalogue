import { serverSupabaseClient } from '#supabase/server'
import keyBy from 'lodash.keyby'
import sortBy from 'lodash.sortby'
import sample from 'lodash.sample'
import slugify from 'slugify'

export default defineEventHandler(async (event) => {
    const makerId = event.context.params.maker

    const client = serverSupabaseClient(event)
    const { data: profile, error } = await client
        .from('makers')
        .select('*, sculpts (*)')
        .eq('id', makerId)
        .single()

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
})
