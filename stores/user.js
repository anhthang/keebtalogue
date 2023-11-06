import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {},
    authenticated: false,
    isAdmin: false,
    isEditor: false,
    collections: [
      { name: 'Want', id: 'want' },
      { name: 'Have', id: 'have' },
    ],
    favorites: [],
    social: {},
    tradingConfig: {
      have: {
        collection: '',
        title: 'WTT',
      },
      want: {
        collection: '',
        title: 'WTB',
      },
      social: {
        discord: '',
        reddit: '',
        qq: '',
      },
      type: 'oneway',
    },
  }),
  actions: {
    setCurrentUser(authUser) {
      const {
        app_metadata: { providers },
        id: uid,
        user_metadata: { email, email_verified, picture, name },
        identities,
      } = authUser

      this.user = {
        uid,
        email,
        email_verified,
        name,
        picture,
        providers,
      }

      this.authenticated = email_verified

      const discord = identities.find((i) => i.provider === 'discord')
      if (discord) {
        this.social.discord = discord.name
      }

      this.getUserDocument(uid)
    },
    async getUserDocument(uid) {
      const { data } = await $fetch(`/api/users/${uid}`)

      if (data) {
        this.favorites = data.favorite_makers
        this.collections = data.collections
        this.social = {
          discord: data.discord,
          reddit: data.reddit,
          qq: data.qq,
        }
        this.tradingConfig.social = this.social
        this.isAdmin = data.role === 'admin'
        this.isEditor = ['admin', 'editor'].includes(data.role)
      } else {
        // console.error(uid, error)
      }
    },
    addCollection(name, id) {
      this.collections.push({ name, id })
    },
    removeCollection(id) {
      const collections = this.collections.filter((c) => c.id !== id)
      this.collections = collections
    },
    setTradingConfig(config) {
      this.tradingConfig = config
    },
    updateFavoriteMakers(name) {
      if (this.favorites.includes(name)) {
        this.favorites = this.favorites.filter((m) => m !== name)
      } else {
        this.favorites.push(name)
      }

      $fetch(`/api/users/${this.user.uid}`, {
        method: 'post',
        body: {
          favorite_makers: this.favorites,
        },
      })
    },
  },
})
