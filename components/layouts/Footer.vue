<template>
  <div class="global-footer">
    <div class="footer-links">
      <a
        v-for="link in links"
        :key="link.title"
        :Ltitle="link.title"
        :href="link.link"
        target="_blank"
      >
        <github-outlined
          v-if="link.icon === 'github'"
          style="font-size: 24px"
        />
        {{ link.title }}
      </a>
    </div>
    <div class="global-footer-copyright">©2021 Made with ☕️ in Hanoi</div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();

const links = [
  {
    title: config.public.appName,
    link: config.public.baseUrl,
  },
  {
    title: "",
    icon: "github",
    link: "https://github.com/anhthang/archivist",
  },
  {
    title: "Anh Thang",
    link: "https://anhthang.org",
  },
];
</script>

<style lang="postcss" scoped>
.global-footer {
  @apply flex flex-col items-center
}

.footer-links {
  @apply flex text-center mb-2
}

.footer-links a:not(:last-child) {
  @apply mr-10
}
</style>
