import sortBy from 'lodash.sortby'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: {},
        authenticated: false,
        collections: [
            { name: 'Wish', id: 'wish' },
            { name: 'Trade', id: 'trade' },
        ],
        favorites: [],
        social: {},
        wishlistConfig: {
            trade: {
                collection: '',
                title: 'WTT',
            },
            wish: {
                collection: '',
                title: 'WTB',
            },
            social: {
                discord: '',
                reddit: '',
                qq: '',
            },
            want_to: 'buy',
        },
    }),
    actions: {
        setCurrentUser(authUser) {
            const {
                id: uid,
                user_metadata: { email, email_verified, full_name, picture },
            } = authUser

            this.user = {
                uid,
                email,
                email_verified,
                full_name,
                picture,
            }

            this.authenticated = email_verified

            this.getUserDocument(uid)
        },
        async getUserDocument(uid) {
            const { data, error } = await $fetch(`/api/users/${uid}`)

            this.favorites = data.favorite_makers
            this.social = {
                discord: data.discord,
                reddit: data.reddit,
                qq: data.qq,
            }
            this.wishlistConfig.social = this.social

            const collections = await $fetch(`/api/users/${uid}/collections`)
            this.collections = collections
        },
        addCollection(name, id) {
            this.collections.push({ name, id })
        },
        removeCollection(id) {
            const collections = this.collections.filter((c) => c.id !== id)
            this.collections = collections
        },
        setWishlistConfig(config) {
            this.wishlistConfig = config
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
