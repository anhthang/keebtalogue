<template>
  <Panel class="container" pt:root:class="!border-0 !bg-transparent">
    <div class="flex flex-col items-center gap-8">
      <div
        class="text-3xl font-medium text-surface-900 dark:text-surface-0 mb-2"
      >
        Uh oh! Something went wrong.
      </div>

      <nuxt-link to="/artisan/maker">
        <Button label="Back" icon="pi pi-users" />
      </nuxt-link>
    </div>
  </Panel>
</template>
