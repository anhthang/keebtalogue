<template>
  <Panel pt:root:class="!border-0 !bg-transparent">
    <div class="flex flex-col items-center gap-8">
      <NuxtImg class="w-1/3" src="/svg/404.svg" alt="Not Found" />

      <div class="text-2xl">Sorry, the page you visited does not exist.</div>

      <nuxt-link to="/artisan/maker">
        <Button label="Back" icon="pi pi-users" />
      </nuxt-link>
    </div>
  </Panel>
</template>
