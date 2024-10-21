<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <label for="collection_name">Name</label>
      <InputText
        id="collection_name"
        v-model.trim="collection.name"
        type="text"
      />
    </div>
    <div class="flex flex-col gap-2">
      <label for="collection_visibility">Visibility</label>
      <SelectButton
        v-model="collection.published"
        option-label="label"
        option-value="value"
        :options="[
          { label: 'Private', value: false },
          { label: 'Public', value: true },
        ]"
      />
      <span v-if="collection.published" id="visibility-help">
        Anyone can now discover the treasures you've assembled in this public
        collection.
      </span>
      <span v-else id="visibility-help">
        Choosing private keeps this collection under lock and key, hidden from
        prying eyes.
      </span>
    </div>
    <div v-if="collection.published" class="flex flex-col gap-2">
      <SelectButton
        v-model="collection.type"
        option-label="label"
        option-value="value"
        :options="[
          { label: 'Sharing Only', value: 'share' },
          { label: 'Buying', value: 'buy' },
          { label: 'Selling', value: 'sell' },
        ]"
      />
      <span v-if="collection.type === 'share'" id="visibility-help">
        Not listed in the marketplace, just for your eyes (and your friends')
        with link.
      </span>
      <span v-if="collection.type === 'buy'" id="visibility-help">
        On the hunt! Any leads appreciated!
      </span>
      <span v-if="collection.type === 'sell'" id="visibility-help">
        Up for grabs!
      </span>
    </div>
    <div
      v-if="collection.published && collection.type !== 'share'"
      class="flex flex-col gap-2"
    >
      <label for="collection_message">Message</label>
      <InputText
        id="collection_message"
        v-model.trim="collection.message"
        type="text"
      />
      <span id="message-help">
        Describe what you're offering and/or help others understand what types
        of offers you are looking for. Your message should be applicable to many
        people using the marketplace, not just a specific person.
      </span>
    </div>
    <div
      v-if="collection.published && collection.type !== 'share'"
      class="flex flex-col gap-2"
    >
      <label for="collection_contact">Contact</label>
      <InputText
        id="collection_contact"
        v-model.trim="collection.contact"
        type="text"
      />
      <span id="contact-help" severity="warn">
        Please enter your Discord username so that buyer/seller can reach you
        directly.
      </span>
    </div>
    <div class="flex flex-col gap-2">
      <Button label="Save" @click="addCollection" />
    </div>

    <Toast />
  </div>
</template>

<script setup>
const { metadata, uid, isEdit } = defineProps({
  metadata: {
    type: Object,
    default: () => ({}),
  },
  isEdit: Boolean,
  // eslint-disable-next-line vue/require-default-prop
  uid: String,
})

const userStore = useUserStore()
const toast = useToast()

const collection = ref({
  name: '',
  published: false,
  type: 'share',
  uid,
})

onBeforeMount(() => {
  Object.assign(collection.value, metadata)
})

// const formRules = ref({
//   name: [{ required: true, type: 'string', trigger: ['change', 'blur'] }],
//   type: [
//     {
//       required: true,
//       type: 'enum',
//       enum: ['share', 'buy', 'sell'],
//       trigger: ['change', 'blur'],
//     },
//   ],
//   message: [
//     { required: false, type: 'string', max: 100, trigger: ['change', 'blur'] },
//   ],
//   contact: [{ required: false, type: 'string', trigger: ['change', 'blur'] }],
// })

const addCollection = async () => {
  const { items, ...rest } = collection.value

  const url = isEdit
    ? `/api/users/${uid}/collections/${rest.id}`
    : `/api/users/${uid}/collections`

  await $fetch(url, {
    method: 'post',
    body: rest,
  })
    .then(() => {
      if (isEdit) {
        toast.add({
          severity: 'success',
          summary: `Collection [${rest.name}] updated successfully!`,
          life: 3000,
        })
      } else {
        toast.add({
          severity: 'success',
          summary: `Collection [${rest.name}] added successfully!`,
          life: 3000,
        })
      }
    })
    .catch((error) => {
      toast.add({ severity: 'error', summary: error.message, life: 3000 })
    })

  await userStore.getUserDocument(uid)
}
</script>
