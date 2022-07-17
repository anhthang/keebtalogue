import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: {},
        collections: [],
        favorites: [],
        social: {},
    }),
    actions: {
        async getUserDocument(id) {
            const doc = await $fetch(`/api/firestore/query?col=users&doc=${id}`)

            this.collections = doc.collections
            this.favorites = doc.makers
            this.social = doc.social
        }
    },
})
