<template>
  <div>
    <PanelBreadcrumb :breadcrumbs="breadcrumbs" />

    <Panel
      :header="data.name"
      pt:root:class="!border-0 !bg-transparent"
      pt:title:class="flex items-center gap-4 font-medium text-3xl"
    >
      <template #icons>
        <div v-if="$device.isDesktopOrTablet" class="flex gap-2">
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
            @click="toggleEditKeycap"
          />

          <SplitButton
            label="Links"
            icon="pi pi-external-link"
            :model="mobile[2].items"
          />
        </div>
        <Button
          v-else
          aria-haspopup="true"
          aria-controls="overlay_menu"
          icon="pi pi-ellipsis-v"
          @click="toggleActions"
        >
        </Button>
        <Menu id="overlay_menu" ref="menu" :model="mobile" :popup="true" />
      </template>

      <div v-if="data.kits.length" class="grid grid-cols-3 gap-4">
        <div class="col-span-3 lg:col-span-2">
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
                <div
                  v-if="slotProps.data.price"
                  class="mt-0 font-semibold text-xl"
                >
                  ${{ slotProps.data.price }}
                </div>
              </div>
              <div class="mt-4">
                {{ slotProps.data.description }}
              </div>
            </template>
          </Carousel>
        </div>

        <div class="col-span-3 lg:col-span-1">
          <Accordion :value="activeKey" multiple>
            <AccordionPanel v-if="data.description" value="description">
              <AccordionHeader>Description</AccordionHeader>
              <AccordionContent>
                <p
                  v-for="(line, idx) in data.description.split('\n')"
                  :key="idx"
                  class="mb-2 text-justify"
                >
                  {{ line }}
                </p>
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
                    <Tag :severity="keycapStatuses[data.status]">
                      {{ data.status }}
                    </Tag>
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
                    size="small"
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
                illustration purposes only. The final colors may differ
                slightly.
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
        </div>
      </div>

      <Dialog
        v-model:visible="visible"
        modal
        header="Edit Keycap"
        dismissable-mask
        class="w-[36rem]"
      >
        <ModalKeycapForm
          :is-edit="true"
          :metadata="data"
          @on-success="toggleEditKeycap"
        />
      </Dialog>
    </Panel>
  </div>
</template>

<script setup>
import groupBy from 'lodash.groupby'

const userStore = useUserStore()
const { isEditor } = storeToRefs(userStore)

const activeKey = ref(['description', 'specifications', 'kits', 'disclaimers'])

const route = useRoute()

const { profile, keycap } = route.params

const { data, refresh } = await useAsyncData(
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

const breadcrumbs = computed(() => {
  return [
    {
      icon: 'pi pi-home',
      route: '/',
    },
    {
      label: manufacturers[profile],
      route: `/keycap/${profile}`,
    },
  ]
})

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

const menu = ref()
const toggleActions = (event) => {
  menu.value.toggle(event)
}

const mobile = computed(() => {
  return [
    {
      label: 'Editing',
      visible: isEditor.value,
      items: [
        {
          label: 'Manage Kits',
          icon: 'pi pi-folder-plus',
        },
        {
          label: 'Edit',
          icon: 'pi pi-file-edit',
          command: toggleEditKeycap,
        },
      ],
    },
    {
      separator: true,
      visible: isEditor.value,
    },
    {
      label: 'External Links',
      items: [
        {
          label: 'IC/GB Thread',
          icon: 'pi pi-external-link',
          visible: data.value.url,
          url: data.value.url,
          target: '_blank',
        },
        {
          label: 'Order Graph',
          icon: 'pi pi-chart-bar',
          visible: !!data.value.order_graph,
          url: data.value.order_graph,
          target: '_blank',
        },
        {
          label: 'Order History',
          icon: 'pi pi-chart-line',
          visible: !!data.value.order_history,
          url: data.value.order_history,
          target: '_blank',
        },
      ],
    },
  ]
})

const visible = ref(false)
const toggleEditKeycap = (shouldRefresh) => {
  visible.value = !visible.value
  if (shouldRefresh) {
    refresh()
  }
}
</script>
