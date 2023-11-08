import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {},
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
  getters: {
    authenticated: (state) => state.user && state.user.email_verified,
  },
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
  },
})
