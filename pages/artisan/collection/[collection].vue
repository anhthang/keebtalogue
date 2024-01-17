<template>
  <div class="container artisan-container">
    <a-spin :spinning="false">
      <a-page-header :title="collection.name || 'Colllection'">
        <template #breadcrumb>
          <a-breadcrumb>
            <a-breadcrumb-item> Artisan </a-breadcrumb-item>
            <a-breadcrumb-item>
              <nuxt-link to="/artisan/collection"> Collection </nuxt-link>
            </a-breadcrumb-item>
          </a-breadcrumb>
        </template>

        <template #extra>
          <a-button
            v-if="collection.published"
            type="dashed"
            @click="copyShareUrl"
          >
            <link-outlined /> Copy Link
          </a-button>

          <a-dropdown placement="bottomRight">
            <template #overlay>
              <a-menu @click="onChangeSortType">
                <a-menu-item key="sculpt_name"> Sort by Sculpt </a-menu-item>
                <a-menu-item key="name"> Sort by Colorway </a-menu-item>
              </a-menu>
            </template>
            <a-button><sort-ascending-outlined /> Sort</a-button>
          </a-dropdown>

          <a-button
            v-if="authenticated"
            type="primary"
            ghost
            @click="toggleShowEdit"
          >
            <edit-outlined /> Edit
          </a-button>

          <a-button
            v-if="user.email_verified"
            type="primary"
            danger
            @click="deleteCollection(collection)"
          >
            <delete-outlined /> Delete
          </a-button>
        </template>

        <a-row
          v-if="collection.published && collection.type === 'share'"
          type="flex"
        >
          <a-alert
            class="collection-alert"
            type="warning"
            message="Public access granted. Anyone with the link will be able to see it."
            banner
          />
        </a-row>

        <a-row :gutter="[8, 8]" type="flex">
          <a-col
            v-for="colorway in sortedCollections"
            :key="colorway.id"
            :xs="12"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <a-card
              hoverable
              :title="colorwayTitle(colorway)"
              :head-style="artisanCardHeadStyle"
            >
              <template #cover>
                <img loading="lazy" :alt="colorway.name" :src="colorway.img" />
              </template>
              <template v-if="authenticated" #extra>
                <delete-outlined @click="removeCap(colorway)" />
              </template>
            </a-card>
          </a-col>
        </a-row>

        <a-modal
          v-model:open="visible"
          title="Edit Collection"
          destroy-on-close
          :confirm-loading="confirmLoading"
          @ok="editCollection"
        >
          <modal-collection-form
            ref="collectionForm"
            :metadata="collection"
            :uid="user.uid"
            :is-edit="true"
          />
        </a-modal>
      </a-page-header>
    </a-spin>
  </div>
</template>

<script setup>
import sortBy from 'lodash.sortby'
import copy from 'ant-design-vue/lib/_util/copy-to-clipboard'

const localIds = ['want', 'have']

const config = useRuntimeConfig()

const userStore = useUserStore()
const { authenticated, collections, user } = storeToRefs(userStore)

const route = useRoute()
const router = useRouter()

const sort = ref('sculpt_name')

const collection =
  collections.value.find((c) => c.id === route.params.collection) || {}

useSeoMeta({
  title: collection.name ? `${collection.name} • Collection` : 'Collection',
})

const { data, refresh } = await useAsyncData(() => {
  if (authenticated.value) {
    return $fetch(
      `/api/users/${user.value.uid}/collections/${route.params.collection}/items`,
    )
  } else if (localIds.includes(route.params.collection)) {
    return []
  } else {
    return $fetch(`/api/collections/${route.params.collection}`)
  }
})

onMounted(() => {
  if (localIds.includes(route.params.collection)) {
    data.value = JSON.parse(
      localStorage.getItem(`Keebtalogue_${route.params.collection}`) || '[]',
    )
  }
})

watchEffect(() => route.params.collection, refresh())

const onChangeSortType = (e) => {
  sort.value = e.key
}

const sortedCollections = computed(() => {
  return sortBy(data.value, ['maker_id', sort.value])
})

const removeCap = (clw) => {
  Modal.confirm({
    title: 'Remove Artisan',
    content: `Are you sure you want to remove ${colorwayTitle(clw)}?`,
    okText: 'Delete',
    okType: 'danger',
    onOk() {
      if (authenticated.value) {
        $fetch(
          `/api/users/${user.value.uid}/collections/${route.params.collection}/items/${clw.id}`,
          { method: 'delete' },
        )
          .then(() => {
            refresh()
            message.success(`${colorwayTitle(clw)} was removed.`)
          })
          .catch((error) => {
            message.error(error.message)
          })
      } else {
        sortedCollections.value = sortedCollections.value.filter(
          (c) => c.colorway_id !== clw.colorway_id,
        )
        localStorage.setItem(
          `Keebtalogue_${route.params.collection}`,
          JSON.stringify(sortedCollections.value),
        )

        message.success(`${colorwayTitle(clw)} was removed.`)
      }
    },
  })
}

const deleteCollection = (collection) => {
  Modal.confirm({
    title: 'Delete Collection',
    content: 'Are you sure you want to continue?',
    okText: 'Delete',
    okType: 'danger',
    onOk() {
      $fetch(`/api/users/${collection.uid}/collections/${collection.id}`, {
        method: 'delete',
      })
        .then(() => {
          collections.value = collections.value.filter(
            (c) => c.id !== collection.id,
          )

          userStore.$patch({ collections: collections.value })

          message.success(`Collection [${collection.name}] was deleted.`)

          router.go(-1)
        })
        .catch((error) => {
          message.error(error.message)
        })
    },
  })
}

const copyShareUrl = () => {
  copy(config.public.baseUrl + route.fullPath)
  message.success('Copied to clipboard!')
}

const visible = ref(false)
const toggleShowEdit = () => {
  visible.value = !visible.value
}

const confirmLoading = ref(false)
const collectionForm = ref()
const editCollection = async () => {
  confirmLoading.value = true

  await collectionForm.value
    .addCollection()
    .then(() => {
      confirmLoading.value = false
      toggleShowEdit()
    })
    .catch(() => {
      confirmLoading.value = false
    })
}
</script>

<style>
.anticon-delete:hover svg {
  fill: #f5222d;
}

.artisan-container {
  .ant-card-cover {
    height: 250px;
    overflow: hidden;

    @media (max-width: 480px) {
      height: 150px;
    }
  }

  /* iPad */
  .ant-card-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
