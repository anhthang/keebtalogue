export default defineEventHandler(async (event) => {
    // @ts-ignore
    const { settings, wishlist, tradelist } = await useBody(event.req)

    const body = {
        settings: {
            capsPerLine: 4,
            priority: {
                color: 'DarkGoldenRod',
                font: 'RedRock',
            },
            legends: {
                color: 'Orchid',
                font: 'Roboto',
            },
            title: {
                color: 'Crimson',
                font: 'RedRock',
                text: settings.wish.title,
            },
            tradeTitle: {
                color: 'Orchid',
                font: 'RedRock',
                text: settings.trade.title,
            },
            extraText: {
                color: 'Turquoise',
                font: 'Roboto',
                text: 'Willing to topup if needed',
            },
            background: {
                color: 'Black',
            },
            social: {
                reddit: settings.social.reddit,
                discord: settings.social.discord,
            },
        },
        capsPerLine: null,
        caps: wishlist.map((i) => ({
            id: i.id,
            isPriority: false,
            legendColor: 'Crimson',
        })),
        tradeCaps: tradelist.map((i) => ({
            id: i.id,
            isPriority: false,
            legendColor: 'Crimson',
        })),
    }

    /**
     * TODO: this is working for newly added keycap only
     * Some old caps will fail when generating wishlist
     * even though the image url is still working
     */
    return $fetch('https://api.keycap-archivist.com/wishlist/generate', {
        method: 'post',
        body,
    })
})
