<template>
  <a-dropdown>
    <a-button type="text">
      <icon class="light-dark-icon" name="line-md:light-dark" />
    </a-button>
    <template #overlay>
      <a-menu :selected-keys="[$colorMode.preference]" @click="handleAppearanceChange">
        <a-menu-item key="system">
          <icon class="appearance-icon" name="material-symbols:desktop-mac-outline" /> System
        </a-menu-item>
        <a-menu-item key="light">
          <icon class="appearance-icon" name="material-symbols:light-mode-outline" /> Light
        </a-menu-item>
        <a-menu-item key="dark">
          <icon class="appearance-icon" name="material-symbols:dark-mode-outline" /> Dark
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup>
const colorMode = useColorMode();
const handleAppearanceChange = (e) => {
  colorMode.preference = e.key;
}
</script>

<style>
.appearance-icon {
  font-size: 20px;
}

.light-dark-icon {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.85);
}
</style>