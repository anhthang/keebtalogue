<template>
  <a-menu-item-group key="appearance" title="Appearance">
    <a-menu-item key="system">
      <template #icon><desktop-outlined /></template> System
    </a-menu-item>
    <a-menu-item key="light">
      <template #icon><sun-outlined /></template> Light
    </a-menu-item>
    <a-menu-item key="dark">
      <template #icon><moon-outlined /></template> Dark
    </a-menu-item>
  </a-menu-item-group>

  <!-- <a-sub-menu title="Appearance">
    <template #icon>
      <desktop-outlined />
    </template>
    <a-menu-item key="system">
      <template #icon><desktop-outlined /></template> System
    </a-menu-item>
    <a-menu-item key="light">
      <template #icon><sun-outlined /></template> Light
    </a-menu-item>
    <a-menu-item key="dark">
      <template #icon><moon-outlined /></template> Dark
    </a-menu-item>
  </a-sub-menu> -->
</template>
