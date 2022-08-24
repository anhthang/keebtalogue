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
            const { id, user_metadata } = authUser
            this.user = {
                uid: id,
                email: user_metadata.email,
                emailVerified: user_metadata.email_verified,
                displayName: user_metadata.full_name,
                photoURL: user_metadata.picture,
            }
            this.authenticated = user_metadata.email_verified

            this.getUserDocument(id)
        },
        async getUserDocument(uid) {
            const { data, error } = await $fetch(`/api/users/${uid}`)

            this.favorites = data.favorite_makers
            this.social = {
                discord: data.discord,
                reddit: data.reddit,
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
