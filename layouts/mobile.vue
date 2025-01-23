<template>
  <div class="flex flex-col gap-4">
    <SpeedInsights />
    <Menubar pt:root:class="!rounded-none	!border-x-0 !border-t-0">
      <template #start>
        <div
          class="w-12 h-12 flex items-center justify-center"
          @click="toggleDrawer"
        >
          <NuxtImg
            :alt="$config.public.appName"
            :src="
              $colorMode.value === 'dark'
                ? '/logo-outlined.png'
                : '/logo-filled.png'
            "
          />
        </div>

        <Drawer v-model:visible="visible">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 flex items-center justify-center">
                <NuxtImg
                  :alt="$config.public.appName"
                  :src="
                    $colorMode.value === 'dark'
                      ? '/logo-outlined.png'
                      : '/logo-filled.png'
                  "
                />
              </div>
              <div
                class="text-3xl font-medium bg-gradient-to-r from-blue-400 via-red-500 to-amber-400 dark:via-red-400 dark:to-amber-200 text-transparent bg-clip-text"
              >
                {{ $config.public.appName }}
              </div>
            </div>
          </template>
          <LayoutDrawer @close="toggleDrawer" />

          <template #footer>
            <LayoutFooter />
          </template>
        </Drawer>
      </template>

      <template #end>
        <ProfileMenu :slim="true" />
      </template>
    </Menubar>

    <NuxtPage />
  </div>
</template>

<script setup>
import { SpeedInsights } from '@vercel/speed-insights/nuxt'

const visible = ref(false)
const toggleDrawer = () => {
  visible.value = !visible.value
}
</script>
