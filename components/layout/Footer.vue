<template>
  <div class="global-footer">
    <!-- <div class="credits">
      <strong>Thanks</strong>
      <a href="https://keycap-archivist.com" target="_blank">
        <img
          src="https://keycap-archivist.com/static/ka-logo-9ff13f494b24649d580620571cc9e040.svg"
          height="36"
        />
        Keycap Archivist
      </a>
      for the open source database and
      <a href="https://artisancollector.com" target="_blank">
        <img
          src="https://artisancollector.com/wp-content/uploads/ac_logo_320.png"
          height="36"
        />
      </a>
      for news, guides, maker profiles and more.
    </div> -->
    <div class="global-footer-copyright">
      <a :href="config.public.baseUrl" target="_blank">
        {{ config.public.appName }}
      </a>
      ©{{ new Date().getFullYear() }} - Made with ☕️ in Hanoi
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
</script>

<style>
.global-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.credits {
  margin-bottom: 1rem;
}
</style>
