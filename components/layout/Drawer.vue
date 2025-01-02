<template>
  <div class="h-max flex flex-col justify-between">
    <PanelMenu
      :model="megaMenu"
      orientation="vertical"
      :pt="{
        root: '!border-0 !bg-transparent !min-w-fit',
        itemContent: 'py-1 hover:dark:!bg-zinc-700 hover:rounded',
      }"
    />
  </div>

  <Dialog
    v-model:visible="visible.feedback"
    modal
    header="Share your thoughts!"
    dismissable-mask
    class="w-[36rem]"
  >
    <ModalFeedbackForm
      @on-success="
        () => {
          visible.feedback = false
        }
      "
    />
  </Dialog>
</template>

<script setup>
const emit = defineEmits(['close'])

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const onChangeMenu = ({ item }) => {
  if (item?.route.startsWith('/')) {
    router.push(item.route)
  }

  emit('close')
}

const visible = ref({
  feedback: false,
})

const megaMenu = computed(() => [
  {
    label: 'Home',
    icon: 'pi pi-home',
    route: '/',
    class: route.path === '/' && activeMenu,
    command: onChangeMenu,
  },
  {
    label: 'Makers',
    icon: 'pi pi-users',
    route: '/artisan/maker',
    class: route.path.startsWith('/artisan/maker') && activeMenu,
    command: onChangeMenu,
  },
  {
    label: 'Marketplace',
    icon: 'pi pi-shop',
    route: '/artisan/marketplace',
    class: route.path === '/artisan/marketplace' && activeMenu,
    command: onChangeMenu,
  },
  {
    label: 'Keycap Tracker',
    icon: 'pi pi-calendar-clock',
    route: '/keycap/tracker',
    class: route.path === '/keycap/tracker' && activeMenu,
    command: onChangeMenu,
  },
  {
    label: 'Keycap Profiles',
    icon: 'pi pi-objects-column',
    class:
      route.path.startsWith('/keycap') &&
      !route.path.includes('tracker') &&
      activeMenu,
    items: Object.entries(keycapProfiles).map(([profile, manufacturers]) => {
      return {
        label: profile,
        items: Object.entries(manufacturers).map(([id, name]) => {
          return {
            label: name,
            class: route.path.includes(`/keycap/${id}`) && activePopMenu,
            route: `/keycap/${id}`,
            command: onChangeMenu,
          }
        }),
      }
    }),
  },
  {
    label: 'My Collections',
    icon: 'pi pi-book',
    route: '/collection',
    class: route.path.startsWith('/collection') && activeMenu,
    command: onChangeMenu,
  },
  {
    label: 'About',
    icon: 'pi pi-info-circle',
    route: '/about',
    class: route.path.startsWith('/about') && activeMenu,
    command: onChangeMenu,
  },
  {
    icon: 'pi pi-comments',
    label: 'Feedback',
    command: () => {
      visible.value.feedback = true
    },
  },
  {
    icon: 'pi pi-paypal',
    label: 'Donate',
    url: config.public.donate,
    target: '_blank',
  },
])
</script>
