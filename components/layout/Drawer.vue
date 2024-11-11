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
  } else if (item?.route.startsWith('https://')) {
    window.open(item.route)
  }

  emit('close')
}

const visible = ref({
  feedback: false,
})

const activeClasses = '!bg-slate-100 dark:!bg-zinc-700 rounded'
const subActiveClasses = '!bg-slate-100 dark:!bg-zinc-800 rounded'

const megaMenu = computed(() => [
  {
    label: 'Makers',
    icon: 'pi pi-users',
    route: '/artisan/maker',
    class: route.path.startsWith('/artisan/maker') && activeClasses,
    command: onChangeMenu,
  },
  {
    label: 'Collections',
    icon: 'pi pi-book',
    route: '/artisan/collection',
    class: route.path.startsWith('/artisan/collection') && activeClasses,
    command: onChangeMenu,
  },
  {
    label: 'Marketplace',
    icon: 'pi pi-shop',
    class:
      (route.path === '/artisan/marketplace' ||
        route.path === '/artisan/wishlist') &&
      activeClasses,
    items: [
      {
        label: 'Trading Hub',
        icon: 'pi pi-shopping-bag',
        route: '/artisan/marketplace',
        class: route.path === '/artisan/marketplace' && subActiveClasses,
        command: onChangeMenu,
      },
      {
        label: 'Wishlist Image',
        icon: 'pi pi-image',
        route: '/artisan/wishlist',
        class: route.path === '/artisan/wishlist' && subActiveClasses,
        command: onChangeMenu,
      },
    ],
  },
  {
    label: 'Keycap Tracker',
    icon: 'pi pi-calendar-clock',
    route: '/keycap/tracker',
    class: route.path === '/keycap/tracker' && activeClasses,
    command: onChangeMenu,
  },
  {
    label: 'Keycap Profiles',
    icon: 'pi pi-objects-column',
    class:
      route.path.startsWith('/keycap') &&
      !route.path.includes('tracker') &&
      activeClasses,
    items: Object.entries(keycapProfiles).map(([profile, manufacturers]) => {
      return {
        label: profile,
        items: Object.entries(manufacturers).map(([id, name]) => {
          return {
            label: name,
            class: route.path.includes(`/keycap/${id}`) && subActiveClasses,
            route: `/keycap/${id}`,
            command: onChangeMenu,
          }
        }),
      }
    }),
  },
  {
    label: 'About',
    icon: 'pi pi-info-circle',
    route: '/about',
    class: route.path.startsWith('/about') && activeClasses,
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
