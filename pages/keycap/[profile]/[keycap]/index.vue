<template>
  <Panel
    :header="data.name"
    class="container"
    pt:root:class="!border-0 !bg-transparent"
    pt:title:class="flex items-center gap-4 font-medium text-3xl"
  >
    <template #icons>
      <div class="flex gap-2">
        <nuxt-link
          v-if="isEditor"
          :to="`/keycap/${data.profile_keycap_id}/kit`"
        >
          <Button label="Manage Kits" icon="pi pi-folder-plus" />
        </nuxt-link>

        <Button
          v-if="isEditor"
          label="Edit"
          icon="pi pi-file-edit"
          @click="toggleShowEditKeycap"
        />
        <Button
          v-if="data.order_graph || data.order_history"
          label="Sales Chart"
          icon="pi pi-chart-bar"
          @click="toggleShowChart"
        />
        <Button
          v-if="data.url"
          as="a"
          label="Link"
          icon="pi pi-link"
          :href="data.url"
          target="_blank"
          rel="noopener"
        />
      </div>
    </template>

    <div v-if="data.kits.length" class="grid grid-cols-3 gap-4">
      <div class="col-span-3 md:col-span-2">
        <Carousel
          :value="data.kits"
          :num-visible="1"
          :num-scroll="1"
          circular
          :autoplay-interval="3000"
        >
          <template #item="slotProps">
            <div class="mb-4">
              <div class="relative mx-auto">
                <img
                  :src="slotProps.data.img"
                  :alt="slotProps.data.name"
                  class="w-full rounded"
                />
              </div>
            </div>

            <div class="flex justify-between items-center">
              <div class="mt-0 font-semibold text-xl">
                {{ slotProps.data.name }}
              </div>
              <div class="mt-0 font-semibold text-xl">
                ${{ slotProps.data.price }}
              </div>
            </div>
            <div class="mt-4">
              {{ slotProps.data.description }}
            </div>
          </template>
        </Carousel>
      </div>

      <div class="col-span-3 md:col-span-1">
        <Accordion :value="activeKey" multiple>
          <AccordionPanel v-if="data.description" value="description">
            <AccordionHeader>Description</AccordionHeader>
            <AccordionContent>
              {{ data.description }}
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="specifications">
            <AccordionHeader>Specifications</AccordionHeader>
            <AccordionContent>
              <ul class="list-none p-0 m-0 flex flex-col gap-2">
                <li v-if="data.designer">Designer: {{ data.designer }}</li>
                <li v-if="data.sculpt">Sculpt: {{ data.sculpt }}</li>
                <li v-if="data.status === 'Interest Check'">
                  IC Date: {{ formatDate(data.ic_date) }}
                </li>
                <li v-else>
                  Timeline:
                  {{ formatDateRange(data.start_date, data.end_date) }}
                </li>
                <li v-if="data.status">
                  Status:
                  <Tag>{{ data.status }}</Tag>
                </li>
              </ul>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="kits">
            <AccordionHeader>Kits</AccordionHeader>
            <AccordionContent>
              <div class="flex flex-wrap gap-2">
                <Button
                  v-for="kit in data.kits"
                  :key="kit.id"
                  severity="secondary"
                  :label="kit.name"
                />
              </div>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="disclaimers">
            <AccordionHeader>Disclaimers</AccordionHeader>
            <AccordionContent>
              Kindly note that the images are of 3D renders and are for
              illustration purposes only. The final colors may differ slightly.
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </div>
    </div>

    <Dialog
      v-model:visible="showEditKeycap"
      modal
      header="Edit Keycap"
      dismissable-mask
      class="w-[35rem]"
    >
      <modal-keycap-form :is-edit="true" :metadata="data" />
    </Dialog>
  </Panel>
</template>

<script setup>
import groupBy from 'lodash.groupby'

const userStore = useUserStore()
const { isEditor } = storeToRefs(userStore)

const activeKey = ref(['description', 'specifications', 'kits', 'disclaimers'])

const route = useRoute()

const { profile, keycap } = route.params

const { data } = await useAsyncData(
  `keycap/${profile}/${keycap}`,
  () =>
    $fetch(`/api/keycaps/${profile}/${keycap}`).then((data) => {
      data.artisans = groupBy(data.artisans, 'maker_name')
      return data
    }),
  {
    watch: [() => profile, () => keycap],
  },
)

useSeoMeta({
  title: data.value
    ? `${manufacturers[profile]} ${data.value.name}`
    : manufacturers[profile],
  description: data.value && data.value.description,
  ogDescription: data.value && data.value.description,
  ogImage: data.value && data.value.img,
  twitterDescription: data.value && data.value.description,
  twitterImage: data.value && data.value.img,
})

const visible = ref(false)
const toggleShowChart = () => {
  visible.value = !visible.value
}

const showEditKeycap = ref(false)
const toggleShowEditKeycap = () => {
  showEditKeycap.value = !showEditKeycap.value
}
</script>
