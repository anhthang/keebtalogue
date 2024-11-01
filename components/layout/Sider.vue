<template>
  <div
    :class="slim ? 'w-auto' : 'w-72'"
    class="rounded-2xl p-4 bg-zinc-200 dark:bg-zinc-800 h-full flex flex-col justify-between"
  >
    <MegaMenu
      :model="megaMenu"
      orientation="vertical"
      :pt="{
        root: '!border-0 !bg-transparent !min-w-fit',
        itemContent: 'py-1 hover:dark:!bg-zinc-700 hover:rounded',
      }"
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
      :pt="{
        root: '!border-0 !bg-transparent !min-w-fit',
        itemContent: 'py-1 hover:dark:!bg-zinc-700 hover:rounded',
      }"
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

  <Dialog
    v-model:visible="visible.command"
    modal
    dismissable-mask
    :closable="false"
    class="w-[36rem]"
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
const route = useRoute()
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

const activeClasses = '!bg-slate-100 dark:!bg-zinc-700 rounded'
const subActiveClasses = '!bg-slate-100 dark:!bg-zinc-800 rounded'

const megaMenu = computed(() => [
  {
    separator: true,
  },
  {
    label: slim.value ? '' : 'Makers',
    icon: 'pi pi-users',
    route: '/artisan/maker',
    class: route.path.startsWith('/artisan/maker') && activeClasses,
    command: onChangeMenu,
  },
  {
    label: slim.value ? '' : 'Collections',
    icon: 'pi pi-book',
    route: '/artisan/collection',
    class: route.path.startsWith('/artisan/collection') && activeClasses,
    command: onChangeMenu,
  },
  {
    label: slim.value ? '' : 'Marketplace',
    icon: 'pi pi-shop',
    class:
      (route.path === '/artisan/marketplace' ||
        route.path === '/artisan/wishlist') &&
      activeClasses,
    items: [
      [
        {
          label: 'Marketplace',
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
      ],
    ],
  },
  {
    separator: true,
  },
  {
    label: slim.value ? '' : 'Keycap Tracker',
    icon: 'pi pi-calendar-clock',
    route: '/keycap/tracker',
    class: route.path === '/keycap/tracker' && activeClasses,
    command: onChangeMenu,
  },
  {
    label: slim.value ? '' : 'Keycap Profiles',
    icon: 'pi pi-objects-column',
    class:
      route.path.startsWith('/keycap') &&
      !route.path.includes('tracker') &&
      activeClasses,
    items: Object.entries(keycapProfiles).map(([profile, manufacturers]) => {
      return [
        {
          label: profile,
          items: Object.entries(manufacturers).map(([id, name]) => {
            return {
              label: name,
              class: route.path.includes(`/keycap/${id}`) && subActiveClasses,
              route: `/keycap/${id}`,
              command: onChangeMenu,
            }
          }),
        },
      ]
    }),
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
    separator: true,
  },
  {
    icon: 'pi pi-comments',
    label: slim.value ? '' : 'Feedback',
    command: () => {
      visible.value.feedback = true
    },
  },
  {
    label: slim.value ? '' : 'About',
    icon: 'pi pi-info-circle',
    route: '/about',
    class: route.path.startsWith('/about') && activeClasses,
    command: onChangeMenu,
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
  {
    icon: slim.value ? 'pi pi-window-maximize' : 'pi pi-window-minimize',
    label: slim.value ? '' : 'Collapse',
    command: () => {
      menuMode.value = slim.value ? 'expanded' : 'collapsed'
      localStorage.setItem('menu-mode', menuMode.value)
    },
  },
  {
    separator: true,
  },
])
</script>
