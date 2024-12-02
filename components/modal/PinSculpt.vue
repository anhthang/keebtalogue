<template>
  <Form
    v-slot="$form"
    :initial-values="initial"
    :resolver
    class="flex flex-col gap-6"
    @submit="onSubmit"
  >
    <Message variant="simple" severity="secondary">
      Pin up to 6 sculpts to the top for easy access.
    </Message>
    <div class="flex flex-col gap-2">
      <MultiSelect
        v-model="initial.pins"
        name="pins"
        :options="sculpts"
        option-label="name"
        option-value="sculpt_id"
        display="chip"
        filter
        class="w-full"
        pt:label:class="flex flex-wrap"
      />
      <Message
        v-if="$form.pins?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.pins.error.message }}
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
  sculpts: {
    type: Array,
    default: () => [],
  },
})

const route = useRoute()
const toast = useToast()
const userStore = useUserStore()
const { favorites, user } = storeToRefs(userStore)

const initial = ref({
  pins: favorites.value[route.params.maker] || [],
})

const resolver = ref(
  zodResolver(
    z.object({
      pins: z.string().array().max(6),
    }),
  ),
)

const onSubmit = ({ valid }) => {
  if (!valid) return

  favorites.value[route.params.maker] = initial.value.pins

  $fetch(`/api/users/${user.value.uid}`, {
    method: 'post',
    body: {
      favorite_makers: favorites.value,
    },
  }).then(() => {
    toast.add({
      severity: 'success',
      summary: 'Your pins have been updated.',
      life: 3000,
    })
    emit('onSuccess', true)
  })
}
</script>
