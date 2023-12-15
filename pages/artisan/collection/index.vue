<template>
  <div class="container artisan-container">
    <a-page-header title="Collection">
      <template #extra>
        <a-button v-if="user.email_verified" type="primary" @click="showModal">
          <file-add-outlined /> Add
        </a-button>
      </template>
      <a-modal
        v-model:open="visible"
        title="New Collection"
        :confirm-loading="loading"
        @ok="addCollection"
      >
        <a-form :ref="formRef" :model="formModel" :rules="formRules">
          <a-form-item ref="name" name="name" v-bind="validateInfos.name">
            <a-input
              v-model:value="formModel.name"
              placeholder="Collection Name"
            />
          </a-form-item>
        </a-form>
      </a-modal>

      <a-row v-if="!user.email_verified" type="flex">
        <a-alert
          class="collection-alert"
          message="You must log in to use this feature and sync the collections across your devices."
          banner
        />
      </a-row>

      <a-row :gutter="[8, 8]" type="flex">
        <a-col
          v-for="collection in collections"
          :key="collection.id"
          :xs="12"
          :sm="12"
          :md="8"
          :lg="6"
          :xl="4"
        >
          <nuxt-link :to="`/artisan/collection/${collection.id}`">
            <a-card
              hoverable
              :title="collection.name"
              :head-style="artisanCardHeadStyle"
            />
          </nuxt-link>
        </a-col>
      </a-row>
    </a-page-header>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Collection',
})

import { Form } from 'ant-design-vue'

const formRef = ref()
const formModel = ref({
  name: '',
})
const formRules = {
  name: [{ required: true, type: 'string', trigger: ['change', 'blur'] }],
}

const userStore = useUserStore()
const { user, collections } = storeToRefs(userStore)

const visible = ref(false)
const showModal = () => {
  visible.value = !visible.value
}

const loading = ref(false)

const { useForm } = Form
const { validate, validateInfos } = useForm(formModel, formRules)

const addCollection = async () => {
  loading.value = true

  await validate()
    .then(async () => {
      const { name } = formModel.value

      await $fetch(`/api/users/${user.value.uid}/collections`, {
        method: 'post',
        body: {
          name,
          uid: user.value.uid,
        },
      })
        .then(() => {
          message.success(`Collection [${name}] added successfully!`)
          userStore.getUserDocument(user.value.uid)
          showModal()
        })
        .catch((error) => {
          message.error(error.message)
        })
    })
    .catch(() => {
      // ignore
    })

  loading.value = false
}
</script>

<style>
.collection-alert {
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1rem;
}
</style>
