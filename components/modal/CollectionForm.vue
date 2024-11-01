<template>
  <Form
    v-slot="$form"
    :initial-values="collection"
    :resolver
    class="flex flex-col gap-6"
    @submit="onSubmit"
  >
    <div class="flex flex-col gap-2">
      <label for="collection_name">Name</label>
      <IconField>
        <InputIcon class="pi pi-pencil" />
        <InputText id="collection_name" name="name" type="text" fluid />
      </IconField>
      <Message
        v-if="$form.name?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.name.error.message }}
      </Message>
    </div>
    <div class="flex flex-col gap-2">
      <label for="collection_visibility">Visibility</label>
      <SelectButton
        v-model="collection.published"
        name="published"
        option-label="label"
        option-value="value"
        :options="[
          { label: 'Private', value: false },
          { label: 'Public', value: true },
        ]"
      />
      <Message
        v-if="collection.published"
        severity="warn"
        size="small"
        variant="simple"
      >
        Anyone can now discover the treasures you've assembled in this public
        collection.
      </Message>
      <Message v-else severity="secondary" size="small" variant="simple">
        Choosing private keeps this collection under lock and key, hidden from
        prying eyes.
      </Message>
    </div>
    <div v-if="collection.published" class="flex flex-col gap-2">
      <SelectButton
        v-model="collection.type"
        name="type"
        option-label="label"
        option-value="value"
        :options="[
          { label: 'Sharing Only', value: 'share' },
          { label: 'Buying', value: 'buy' },
          { label: 'Selling', value: 'sell' },
        ]"
      />
      <Message
        v-if="collection.type === 'share'"
        severity="secondary"
        size="small"
        variant="simple"
      >
        Not listed in the marketplace, just for your eyes (and your friends')
        with link.
      </Message>
      <Message
        v-if="collection.type === 'buy'"
        severity="secondary"
        size="small"
        variant="simple"
      >
        On the hunt! Any leads appreciated!
      </Message>
      <Message
        v-if="collection.type === 'sell'"
        severity="secondary"
        size="small"
        variant="simple"
      >
        Up for grabs!
      </Message>
    </div>
    <div
      v-if="collection.published && collection.type !== 'share'"
      class="flex flex-col gap-2"
    >
      <label for="collection_message">Message</label>
      <IconField>
        <InputIcon class="pi pi-comments" />
        <InputText id="collection_message" name="message" type="text" fluid />
      </IconField>
      <Message severity="secondary" size="small" variant="simple">
        Describe what you're offering and/or help others understand what types
        of offers you are looking for. Your message should be applicable to many
        people using the marketplace, not just a specific person.
      </Message>
    </div>
    <div
      v-if="collection.published && collection.type !== 'share'"
      class="flex flex-col gap-2"
    >
      <label for="collection_contact">Contact</label>
      <IconField>
        <InputIcon class="pi pi-discord" />
        <InputText id="collection_contact" name="contact" type="text" fluid />
      </IconField>
      <Message severity="secondary" size="small" variant="simple">
        Please enter your Discord username so that buyer/seller can reach you
        directly.
      </Message>
    </div>
    <div class="flex flex-col gap-2">
      <Button label="Save" type="submit" />
    </div>

    <Toast />
  </Form>
</template>

<script setup>
import { zodResolver } from '@primevue/forms/resolvers'
import { z } from 'zod'

const emit = defineEmits(['onSuccess'])

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

const resolver = ref(
  zodResolver(
    z.object({
      name: z.string().min(1),
      published: z.boolean().default(false),
      type: z.string(),
      message: z.string().optional(),
      contact: z.string().optional(),
    }),
  ),
)

const onSubmit = async ({ valid }) => {
  if (valid) {
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
          emit('onSuccess', true)
        } else {
          toast.add({
            severity: 'success',
            summary: `Collection [${rest.name}] added successfully!`,
            life: 3000,
          })
          emit('onSuccess', true)
        }
      })
      .catch((error) => {
        toast.add({ severity: 'error', summary: error.message, life: 3000 })
      })
    await userStore.getUserDocument(uid)
  }
}
</script>
