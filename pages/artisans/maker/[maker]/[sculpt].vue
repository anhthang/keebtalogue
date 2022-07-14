<template>
  <div class="container artisan-container">
    <a-page-header :title="sculpt.name">
      <template #extra>
        <a-button key="1" disabled icon="file-add" type="primary">
          Submit new Colorway
        </a-button>
        <a-dropdown placement="bottomRight">
          <!-- <a-menu slot="overlay" @click="onChangeSortType">
            <a-menu-item key="name">
              <a-icon type="sort-ascending" /> Sort by Name
            </a-menu-item>
            <a-menu-item key="date">
              <a-icon type="clock-circle" /> Sort by Date
            </a-menu-item>
          </a-menu> -->
          <a-button :icon="sortIcon"> Sort By </a-button>
        </a-dropdown>
      </template>

      <a-spin :spinning="loading">
        <a-row :gutter="[8, 8]" type="flex">
          <a-col
            v-for="colorway in colorways"
            :key="colorway.id"
            :xs="12"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <a-card hoverable :title="colorway.name || '-'" :size="size">
              <!-- <a-icon
                v-if="colorway.commissioned"
                slot="extra"
                type="bg-colors"
                class="favorite-maker"
              />
              <img
                slot="cover"
                loading="lazy"
                :alt="colorway.name"
                :src="colorway.img"
              /> -->

              <template #actions>
                <a-dropdown :trigger="['click']" placement="topCenter">
                  <div><a-icon type="save" /> Add to Collection</div>
                  <!-- <a-menu slot="overlay">
                    <a-menu-item
                      v-for="collection in collections"
                      :key="collection.slug"
                      :disabled="!collections.length"
                      @click="addToCollection(collection, colorway)"
                    >
                      {{ collection.name }}
                    </a-menu-item>
                  </a-menu> -->
                </a-dropdown>
              </template>
              <a-card-meta v-if="colorway.releaseDate">
                <template #description>
                  {{ colorway.releaseDate }}
                </template>
              </a-card-meta>
            </a-card>
          </a-col>
        </a-row>
      </a-spin>

      <conflict-sync-modal />
    </a-page-header>
  </div>
</template>

<script>
// import { mapState } from 'vuex'
// import { isEmpty, sortBy } from 'lodash'
// import ConflictSyncModal from '~/components/modals/ConflictSyncModal.vue'

// export default {
//   components: { ConflictSyncModal },
//   asyncData({ params }) {
//     return {
//       makerId: params.maker,
//       sculptId: params.sculpt,
//     }
//   },
//   data() {
//     return {
//       size: this.$device.isMobile ? 'small' : 'default',
//       sort: 'date',
//       sortIcon: 'clock-circle',
//       sculpt: {},
//       loading: true,
//     }
//   },
//   async fetch() {
//     if (!this.makers[this.makerId]) {
//       await this.$store.dispatch('artisans/getMaker', this.makerId)
//     }

//     if (isEmpty(this.makers[this.makerId].sculpts)) {
//       await this.$store
//         .dispatch('artisans/fetchMakerDatabase', this.makerId)
//         .then(() => (this.loading = false))
//     } else {
//       this.loading = false
//     }
//   },
//   head() {
//     return {
//       title: `${this.sculpt.name} • ${this.maker.name} - ${process.env.appName}`,
//     }
//   },
//   computed: {
//     ...mapState('artisans', ['makers', 'collections']),
//     ...mapState(['user']),
//     colorways() {
//       return this.sort === 'name'
//         ? sortBy(this.sculpt.colorways, 'name')
//         : this.sculpt.colorways
//     },
//     maker() {
//       return this.makers[this.makerId] || {}
//     },
//   },
//   watch: {
//     sort() {
//       this.sortIcon = this.sort === 'name' ? 'sort-ascending' : 'clock-circle'
//     },
//     loading() {
//       this.sculpt = this.makers[this.makerId].sculpts[this.sculptId]
//     },
//   },
//   methods: {
//     addToCollection(collection, clw) {
//       const colorway = {
//         id: clw.id,
//         name: clw.name,
//         img: clw.img,
//         sculpt_name: this.sculpt.name,
//         maker_name: this.maker.name,
//       }

//       if (this.user.emailVerified) {
//         this.$fire.firestore
//           .collection(`users/${this.user.uid}/collections`)
//           .doc(collection.slug)
//           .update({
//             [clw.id]: colorway,
//           })
//           .then(() => {
//             this.$message.success(`Added ${clw.name} to ${collection.name}`)
//           })
//           .catch((e) => {
//             this.$message.error('Adding sculpt to collection err: ', e.message)
//           })
//       } else {
//         const collectionMap =
//           JSON.parse(
//             localStorage.getItem(`KeebCatalogue_${collection.slug}`)
//           ) || {}

//         collectionMap[clw.id] = colorway

//         localStorage.setItem(
//           `KeebCatalogue_${collection.slug}`,
//           JSON.stringify(collectionMap)
//         )

//         this.$message.success(`Added ${clw.name} to ${collection.name}`)
//       }
//     },
//     onChangeSortType(e) {
//       this.sort = e.key
//     },
//   },
// }
</script>
