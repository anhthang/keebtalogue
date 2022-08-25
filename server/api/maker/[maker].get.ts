import keyBy from 'lodash.keyby'
import sample from 'lodash.sample'
import sortBy from 'lodash.sortby'
import slugify from 'slugify'

export default defineEventHandler((event) => {
    const filename =
        event.context.params.maker === 'gaias-creature'
            ? 'gaia%E2%80%99s-creature'
            : event.context.params.maker

    return fetch(
        `https://raw.githubusercontent.com/keycap-archivist/database/master/db/${filename}.json`
    )
        .then((res) => res.json())
        .then((maker) => {
            let sculpts = maker.sculpts.map((sculpt) => {
                const random = sample(sculpt.colorways)

                sculpt.colorways = sculpt.colorways.map((c, idx) => {
                    c.order = idx
                    return c
                })

                return {
                    ...sculpt,
                    slug: slugify(sculpt.name, { lower: true }),
                    preview: random.img,
                }
            })

            sculpts = keyBy(sortBy(sculpts, 'name'), 'slug')

            return {
                ...maker,
                sculpts,
                slug: slugify(maker.name, { lower: true }),
            }
        })
})
