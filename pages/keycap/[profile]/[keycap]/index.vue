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
            v-if="editable"
            :to="`/keycap/${data.profile_keycap_id}/kit`"
          >
            <Button
              icon="pi pi-folder-plus"
              label="Manage Kits"
              severity="secondary"
            />
          </nuxt-link>

          <Button
            v-if="editable"
            icon="pi pi-file-edit"
            label="Edit"
            severity="secondary"
            @click="toggleEditKeycap"
          />

          <SplitButton
            icon="pi pi-external-link"
            label="Links"
            severity="secondary"
            :model="mobile[2].items"
          />
        </div>
        <Button
          v-else
          aria-haspopup="true"
          aria-controls="overlay_menu"
          icon="pi pi-ellipsis-v"
          severity="secondary"
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
            <template #item="{ data: kit }">
              <div class="mb-4">
                <div class="relative mx-auto">
                  <img :src="kit.img" :alt="kit.name" class="w-full rounded" />
                </div>
              </div>

              <div class="flex justify-between items-center">
                <div class="mt-0 font-semibold text-xl">
                  {{ kit.name }}
                </div>
                <div v-if="kit.price" class="mt-0 font-semibold text-xl">
                  ${{ kit.price }}
                </div>
              </div>
              <div class="mt-4">
                {{ kit.description }}
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
                <Message variant="simple" severity="warn">
                  Kindly note that the images are of 3D renders and are for
                  illustration purposes only. The final colors may differ
                  slightly.
                </Message>
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

const route = useRoute()
const userStore = useUserStore()

const { profile, keycap } = route.params
const editable = computed(() => userStore.isEditable(`${profile}/${keycap}`))

const activeKey = ref(['description', 'specifications', 'kits', 'disclaimers'])

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
  description: data.value?.description,
  ogDescription: data.value?.description,
  twitterDescription: data.value?.description,
})

defineOgImageComponent('Keycap', {
  manufacturerId: profile,
})

const menu = ref()
const toggleActions = (event) => {
  menu.value.toggle(event)
}

const mobile = computed(() => {
  return [
    {
      label: 'Editing',
      visible: editable.value,
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
      visible: editable.value,
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
