export default defineEventHandler(async (event) => {
  // @ts-ignore
  const { settings, wishlist, tradelist } = await readBody(event)

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
    caps: wishlist.map((i: any) => ({
      id: i.colorway_id,
      isPriority: false,
      legendColor: 'Crimson',
    })),
    tradeCaps: tradelist.map((i: any) => ({
      id: i.colorway_id,
      isPriority: false,
      legendColor: 'Crimson',
    })),
  }

  const check: any = await $fetch(
    'https://api.keycap-archivist.com/wishlist/check',
    {
      method: 'post',
      body,
    },
  )

  if (check.hasError) {
    // just want it return same format as /generate
    return {
      StatusCode: 200,
      IsError: true,
      ErrorItems: check.errors,
    }
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
