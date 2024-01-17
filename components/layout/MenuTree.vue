<template>
  <a-menu
    :theme="$device.isMobile && $colorMode.value === 'light' ? 'light' : 'dark'"
    :mode="mode"
    :style="{ lineHeight: '64px' }"
  >
    <!-- <a-menu-item key="1">
      <nuxt-link to="/"><calendar-outlined /> Calendar </nuxt-link>
    </a-menu-item> -->

    <!-- <a-sub-menu key="2">
      <template #title> <insert-row-above-outlined /> Keebs </template>
      <a-menu-item key="3">
        <nuxt-link to="/keebs"> <forward-outlined /> Live GBs </nuxt-link>
      </a-menu-item>
      <a-menu-item key="4">
        <nuxt-link to="/keebs?status=ic">
          <question-circle-outlined /> Interest Check
        </nuxt-link>
      </a-menu-item>
      <a-menu-item key="5">
        <nuxt-link to="/keebs?status=closed">
          <backward-outlined /> Previous GBs
        </nuxt-link>
      </a-menu-item>
      <a-menu-divider />
      <a-menu-item key="2.1">
        <nuxt-link to="/keebs/maker"> <user-add-outlined /> Makers </nuxt-link>
      </a-menu-item>
    </a-sub-menu> -->

    <a-sub-menu key="artisan" title="Artisan">
      <a-menu-item key="artisan.maker">
        <nuxt-link to="/artisan/maker">
          <user-add-outlined /> Makers
        </nuxt-link>
      </a-menu-item>
      <a-menu-item key="artisan.collection">
        <nuxt-link to="/artisan/collection">
          <book-outlined /> Collection
        </nuxt-link>
      </a-menu-item>
      <a-menu-item key="artisan.trading">
        <nuxt-link to="/artisan/trading">
          <shopping-outlined /> Trading
        </nuxt-link>
      </a-menu-item>
      <a-menu-item key="artisan.marketplace">
        <nuxt-link to="/artisan/marketplace">
          <shop-outlined /> Marketplace
        </nuxt-link>
      </a-menu-item>
    </a-sub-menu>

    <a-sub-menu key="keycap" title="Keycap">
      <a-menu-item key="interest-check">
        <nuxt-link to="/keycap/interest-check">
          <schedule-outlined /> Interest Check
        </nuxt-link>
      </a-menu-item>
      <a-menu-divider />

      <a-sub-menu
        v-for="[profile, manufacturers] of Object.entries(keycapProfiles)"
        :key="profile"
        :title="profile"
      >
        <a-menu-item
          v-for="[key, value] of Object.entries(manufacturers)"
          :key="`keycap.${key}`"
        >
          <nuxt-link :to="`/keycap/${key}`"> {{ value }} </nuxt-link>
        </a-menu-item>
      </a-sub-menu>
    </a-sub-menu>

    <a-menu-item key="about">
      <nuxt-link to="/about"> About </nuxt-link>
    </a-menu-item>
  </a-menu>
</template>

<script setup>
defineProps({
  mode: {
    type: String,
    required: true,
  },
})
</script>
