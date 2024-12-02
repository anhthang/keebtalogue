<template>
  <Form
    v-slot="$form"
    :initial-values="initial"
    :resolver
    class="flex flex-col gap-6"
    @submit="onSubmit"
  >
    <Message variant="simple" severity="secondary">
      Pin up to 6 makers to the top for easy access.
    </Message>
    <div class="flex flex-col gap-2">
      <MultiSelect
        v-model="initial.makers"
        name="makers"
        :options="makers"
        option-label="name"
        option-value="id"
        display="chip"
        filter
        class="w-full"
        pt:label:class="flex flex-wrap"
      />
      <Message
        v-if="$form.makers?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.makers.error.message }}
      </Message>
    </div>

    <div class="flex flex-col gap-2">
      <Button label="Save" type="submit" :disabled="!$form.valid" />
    </div>
  </Form>
</template>

<script setup>
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'

const emit = defineEmits(['onSuccess'])

defineProps({
  makers: {
    type: Array,
    default: () => [],
  },
})

const toast = useToast()
const userStore = useUserStore()
const { favorites, user } = storeToRefs(userStore)

const initial = ref({
  makers: Object.keys(favorites.value) || [],
})

const resolver = ref(
  zodResolver(
    z.object({
      makers: z.string().array().max(6),
    }),
  ),
)

const onSubmit = ({ valid }) => {
  if (!valid) return

  const data = initial.value.makers.reduce((out, id) => {
    out[id] = favorites.value[id] || []

    return out
  }, {})

  $fetch(`/api/users/${user.value.uid}`, {
    method: 'post',
    body: {
      favorite_makers: data,
    },
  }).then(() => {
    toast.add({
      severity: 'success',
      summary: 'Your pins have been updated.',
      life: 3000,
    })

    userStore.$patch({ favorites: data })
    emit('onSuccess', true)
  })
}
</script>
