<template>
  <div
    :class="slim ? 'w-auto' : 'w-72'"
    class="rounded-2xl p-4 bg-zinc-200 dark:bg-zinc-800 h-full flex flex-col justify-between"
  >
    <MegaMenu
      :model="megaMenu"
      orientation="vertical"
      pt:root:class="!border-0 !bg-transparent flex flex-col gap-3"
    >
      <template #start>
        <nuxt-link to="/">
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 border border-primary rounded-xl flex items-center justify-center"
            >
              <img
                :alt="$config.public.appName"
                :src="`/logo-filled.png`"
                width="32px"
              />
            </div>
            <div
              :class="slim ? 'hidden' : 'block'"
              class="text-surface-950 dark:text-surface-0 font-medium text-3xl"
            >
              {{ $config.public.appName }}
            </div>
          </div>
        </nuxt-link>
      </template>
    </MegaMenu>

    <TieredMenu
      :model="advanceMenu"
      pt:root:class="!border-0 !bg-transparent flex flex-col gap-3"
    >
      <template #end>
        <MenuSettings :slim="slim" />
      </template>
    </TieredMenu>
  </div>

  <Dialog
    v-model:visible="showFeedback"
    modal
    header="Share your thoughts!"
    dismissable-mask
    class="w-[35rem]"
  >
    <modal-feedback-form />
  </Dialog>
</template>

<script setup>
// const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const slim = ref(false)

const onChangeMenu = ({ item }) => {
  if (item?.route.startsWith('/')) {
    router.push(item.route)
  } else if (item?.route.startsWith('https://')) {
    window.open(item.route)
  }
}

const showFeedback = ref(false)

const megaMenu = ref([
  {
    separator: true,
  },
  {
    label: 'Makers',
    icon: 'pi pi-users',
    route: '/artisan/maker',
    command: onChangeMenu,
  },
  {
    label: 'Collections',
    icon: 'pi pi-book',
    route: '/artisan/collection',
    command: onChangeMenu,
  },
  {
    label: 'Marketplace',
    icon: 'pi pi-shop',
    items: [
      [
        {
          label: 'Marketplace',
          items: [
            {
              label: 'Trading Hub',
              icon: 'pi pi-shopping-bag',
              route: '/artisan/marketplace',
              command: onChangeMenu,
            },
            {
              label: 'Wishlist Image',
              icon: 'pi pi-image',
              route: '/artisan/wishlist',
              command: onChangeMenu,
            },
          ],
        },
      ],
    ],
  },
  {
    separator: true,
  },
  {
    label: 'Interest Check',
    icon: 'pi pi-list-check',
    route: '/keycap/interest-check',
    command: onChangeMenu,
  },
  {
    label: 'Pre-Order',
    icon: 'pi pi-shopping-bag',
    route: '/keycap/pre-order',
    command: onChangeMenu,
  },
  {
    label: 'Keycaps',
    icon: 'pi pi-objects-column',
    items: Object.entries(keycapProfiles).map(([profile, manufacturers]) => {
      return [
        {
          label: profile,
          items: Object.entries(manufacturers).map(([id, name]) => {
            return {
              label: name,
              route: `/keycap/${id}`,
              command: onChangeMenu,
            }
          }),
        },
      ]
    }),
  },
  {
    separator: true,
  },
  {
    label: 'About',
    icon: 'pi pi-info-circle',
    route: '/about',
    command: onChangeMenu,
  },
])

const advanceMenu = computed(() => [
  { icon: 'pi pi-search', label: 'Search', shortcut: '⌘+K' },
  {
    icon: 'pi pi-comments',
    label: 'Feedback',
    command: () => {
      showFeedback.value = true
    },
  },
  {
    icon: slim.value ? 'pi pi-window-maximize' : 'pi pi-window-minimize',
    label: slim.value ? 'Expand Menu' : 'Collapse Menu',
    command: () => {
      slim.value = !slim.value
    },
  },
  // {
  //   icon: 'pi pi-cog',
  //   label: 'Settings',
  //   route: '/account/settings',
  //   command: onChangeMenu,
  // },
  {
    separator: true,
  },
  {
    icon: 'pi pi-paypal',
    label: 'Donate',
    url: config.public.donate,
    target: '_blank',
  },
  {
    separator: true,
  },
])

// const selectedKeys = computed(() => {
//   const second = route.path.indexOf('/', 1)
//   if (second === -1) {
//     return [route.path]
//   }

//   const third = route.path.indexOf('/', second + 1)

//   return third === -1 ? [route.path] : [route.path.substring(0, third)]
// })
</script>
