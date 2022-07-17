import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: {},
        collections: [],
        favorites: [],
        social: {},
    }),
    actions: {
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
        addCollection(name, slug) {
            this.collections.push({ name, slug })
        },
        removeCollection(slug) {
            const collections = this.collections.filter((c) => c.slug !== slug)
            this.collections = collections
        },
    },
})
