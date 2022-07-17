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

<script>
export default {
  data() {
    return {
      links: [
        {
          title: "Keeb Archivist",
          link: "https://keeb-catalogue.web.app",
        },
        {
          title: "",
          icon: "github",
          link: "https://github.com/anhthang/keeb-catalogue",
        },
        {
          title: "Anh Thang",
          link: "https://anhthang.org",
        },
      ],
    };
  },
};
</script>

<style lang="less">
.global-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer-links {
  display: flex;
  text-align: center;
  margin-bottom: 8px;

  a:not(:last-child) {
    margin-right: 40px;
  }
}
</style>
