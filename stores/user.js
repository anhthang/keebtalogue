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
        wishlishConfig: {
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
            const { uid, email, emailVerified, displayName, photoURL } =
                authUser
            this.user = { uid, email, emailVerified, displayName, photoURL }
            this.authenticated = emailVerified
        },
        async getUserDocument(uid) {
            const doc = await $fetch('/api/firestore/query', {
                params: {
                    col: 'users',
                    doc: uid,
                },
            })

            this.collections = doc.collections
            this.favorites = doc.makers
            this.social = doc.social
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
            this.wishlishConfig = config
        },
        updateFavoriteMakers(name) {
            if (this.favorites.includes(name)) {
                this.favorites = this.favorites.filter((m) => m !== name)
            } else {
                this.favorites.push(name)
            }

            // update firestore
            $fetch("/api/firestore/put", {
                method: "post",
                params: {
                    col: 'users',
                    doc: this.user.uid
                },
                body: {
                    favorites: this.favorites
                }
            })
        },
    },
})
