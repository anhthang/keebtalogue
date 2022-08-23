import sortBy from 'lodash.sortby'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: {},
        authenticated: false,
        collections: [
            { name: 'Wish', slug: 'wish' },
            { name: 'Trade', slug: 'trade' },
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

            // this.collections = sortBy(doc.collections, 'name')
            this.favorites = data.favorite_makers
            this.social = {
                discord: data.discord,
                reddit: data.reddit,
            }
            this.wishlistConfig.social = this.social
        },
        updateUserCollections() {
            $fetch('/api/firestore/put', {
                method: 'post',
                params: {
                    col: 'users',
                    doc: this.user.uid,
                },
                body: {
                    collections: this.collections,
                },
            })
        },
        addCollection(name, slug) {
            this.collections.push({ name, slug })
            this.updateUserCollections()
        },
        removeCollection(slug) {
            const collections = this.collections.filter((c) => c.slug !== slug)
            this.collections = collections
            this.updateUserCollections()
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

            // update firestore
            $fetch('/api/firestore/put', {
                method: 'post',
                params: {
                    col: 'users',
                    doc: this.user.uid,
                },
                body: {
                    makers: this.favorites,
                },
            })
        },
    },
})
