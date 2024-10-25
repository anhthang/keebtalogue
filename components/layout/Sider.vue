<template>
  <div
    :class="slim ? 'w-auto' : 'w-72'"
    class="rounded-2xl p-4 bg-zinc-200 dark:bg-zinc-800 h-full flex flex-col justify-between"
  >
    <MegaMenu
      :model="megaMenu"
      orientation="vertical"
      pt:root:class="!border-0 !bg-transparent !min-w-fit"
    >
      <template #start>
        <nuxt-link to="/">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 flex items-center justify-center">
              <img
                :alt="$config.public.appName"
                :src="
                  $colorMode.value === 'dark'
                    ? `/logo-outlined.png`
                    : `/logo-filled.png`
                "
              />
            </div>
            <div v-if="!slim" class="text-3xl font-medium">
              {{ $config.public.appName }}
            </div>
          </div>
        </nuxt-link>
      </template>
    </MegaMenu>

    <TieredMenu
      :model="advanceMenu"
      pt:root:class="!border-0 !bg-transparent flex flex-col gap-3 !min-w-fit"
    >
      <template #end>
        <MenuSettings :slim="slim" />
      </template>
    </TieredMenu>
  </div>

  <Dialog
    v-model:visible="visible.feedback"
    modal
    header="Share your thoughts!"
    dismissable-mask
    class="w-[35rem]"
  >
    <ModalFeedbackForm
      @on-success="
        () => {
          visible.feedback = false
        }
      "
    />
  </Dialog>

  <Dialog
    v-model:visible="visible.command"
    modal
    dismissable-mask
    :closable="false"
    class="w-[35rem]"
  >
    <CommandPalette
      @on-success="
        () => {
          visible.command = false
        }
      "
    />
  </Dialog>
</template>

<script setup>
// const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const menuMode = ref('collapsed')
const slim = computed(() => menuMode.value === 'collapsed')

onMounted(() => {
  menuMode.value = localStorage.getItem('menu-mode') || 'collapsed'
})

const onChangeMenu = ({ item }) => {
  if (item?.route.startsWith('/')) {
    router.push(item.route)
  } else if (item?.route.startsWith('https://')) {
    window.open(item.route)
  }
}

const visible = ref({
  feedback: false,
  command: false,
})

const megaMenu = computed(() => [
  {
    separator: true,
  },
  {
    label: slim.value ? '' : 'Makers',
    icon: 'pi pi-users',
    route: '/artisan/maker',
    command: onChangeMenu,
  },
  {
    label: slim.value ? '' : 'Collections',
    icon: 'pi pi-book',
    route: '/artisan/collection',
    command: onChangeMenu,
  },
  {
    label: slim.value ? '' : 'Marketplace',
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
    label: slim.value ? '' : 'Interest Check',
    icon: 'pi pi-list-check',
    route: '/keycap/interest-check',
    command: onChangeMenu,
  },
  {
    label: slim.value ? '' : 'Pre-Order',
    icon: 'pi pi-shopping-bag',
    route: '/keycap/pre-order',
    command: onChangeMenu,
  },
  {
    label: slim.value ? '' : 'Keycaps',
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
    label: slim.value ? '' : 'About',
    icon: 'pi pi-info-circle',
    route: '/about',
    command: onChangeMenu,
  },
])

const advanceMenu = computed(() => [
  {
    icon: 'pi pi-search',
    label: slim.value ? '' : 'Search',
    shortcut: '⌘+K',
    command: () => {
      visible.value.command = true
    },
  },
  {
    icon: 'pi pi-comments',
    label: slim.value ? '' : 'Feedback',
    command: () => {
      visible.value.feedback = true
    },
  },
  {
    separator: true,
  },
  {
    icon: slim.value ? 'pi pi-window-maximize' : 'pi pi-window-minimize',
    label: slim.value ? '' : slim.value ? 'Expand Menu' : 'Collapse Menu',
    command: () => {
      menuMode.value = slim.value ? 'expanded' : 'collapsed'
      localStorage.setItem('menu-mode', menuMode.value)
    },
  },
  {
    icon: 'pi pi-paypal',
    label: slim.value ? '' : 'Donate',
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
