<template>
  <a-menu
    :selected-keys="selectedKeys"
    :style="{ height: '100%', background: token.colorBgLayout }"
    @click="onChangeMenu"
  >
    <a-menu-item key="/"><home-outlined /> <span>Home</span></a-menu-item>
    <a-menu-divider />

    <a-menu-item key="/artisan/maker">
      <team-outlined /> <span>Makers</span>
    </a-menu-item>
    <a-menu-item key="/artisan/collection">
      <book-outlined /> <span>Collections</span>
    </a-menu-item>
    <a-sub-menu key="marketplace" title="Marketplace">
      <template #icon><shopping-cart-outlined /></template>

      <a-menu-item key="/artisan/marketplace">
        <shop-outlined /> <span>Trading Hub</span>
      </a-menu-item>
      <a-menu-item key="/artisan/wishlist">
        <file-image-outlined /> <span>Wishlist Image</span>
      </a-menu-item>
    </a-sub-menu>
    <a-menu-divider />

    <a-menu-item key="/keycap/interest-check">
      <schedule-outlined /> <span>Interest Check</span>
    </a-menu-item>
    <a-menu-item key="/keycap/live">
      <stock-outlined /> <span>Live Group Buys</span>
    </a-menu-item>
    <a-sub-menu key="keycap" title="Keycap">
      <template #icon><appstore-outlined /></template>
      <a-sub-menu
        v-for="[profile, manufacturers] of Object.entries(keycapProfiles)"
        :key="profile"
        :title="profile"
      >
        <a-menu-item
          v-for="[key, value] of Object.entries(manufacturers)"
          :key="`/keycap/${key}`"
        >
          {{ value }}
        </a-menu-item>
      </a-sub-menu>
    </a-sub-menu>
    <a-menu-divider />

    <a-menu-item :key="$config.public.donate">
      <coffee-outlined /> <span>Donate</span>
    </a-menu-item>
    <a-menu-item key="/about">
      <info-circle-outlined /> <span>About</span>
    </a-menu-item>
  </a-menu>
</template>

<script setup>
import { theme } from 'ant-design-vue'
const { token } = theme.useToken()

const route = useRoute()
const router = useRouter()

const selectedKeys = computed(() => {
  const second = route.path.indexOf('/', 1)
  if (second === -1) {
    return [route.path]
  }

  const third = route.path.indexOf('/', second + 1)

  return third === -1 ? [route.path] : [route.path.substring(0, third)]
})

const onChangeMenu = (e) => {
  if (e.key.startsWith('/')) {
    router.push(e.key)
  } else if (e.key.startsWith('https://')) {
    window.open(e.key)
  }
}
</script>
