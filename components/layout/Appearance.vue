<template>
  <a-button type="text" @click="handleAppearanceChange">
    <icon class="light-dark-icon" :name="iconName" />
  </a-button>
</template>

<script setup>
const colorMode = useColorMode()

const handleAppearanceChange = () => {
  if (colorMode.preference === 'system') {
    colorMode.preference = 'light'
  } else if (colorMode.preference === 'light') {
    colorMode.preference = 'dark'
  } else {
    colorMode.preference = 'system'
  }
}

const iconName = computed(() => {
  switch (colorMode.preference) {
    case 'dark':
      return 'material-symbols:dark-mode-outline'
    case 'light':
      return 'material-symbols:light-mode-outline'
    default:
      return 'material-symbols:desktop-mac-outline'
  }
})
</script>

<style>
.light-dark-icon {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.85);
}
</style>
