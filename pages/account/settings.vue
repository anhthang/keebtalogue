<template>
  <Panel
    header="Account Settings"
    pt:root:class="!border-0 !bg-transparent"
    pt:title:class="flex items-center gap-4 font-medium text-3xl"
  >
    <Tabs value="profile">
      <TabList>
        <Tab value="profile" as="div" class="flex items-center gap-2">
          <Avatar :image="user.picture" shape="circle" />
          Profile
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="profile">
          <account-profile />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </Panel>
</template>

<script setup>
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

useSeoMeta({
  title: 'Account Settings',
})

definePageMeta({
  middleware: 'auth',
})
</script>
