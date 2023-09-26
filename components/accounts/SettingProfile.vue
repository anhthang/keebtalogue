<template>
  <a-card title="Public profile" :bordered="false" size="small">
    <a-row>
      <a-col :xs="24" :sm="16">
        <a-form :layout="layout">
          <a-form-item label="Name">
            <a-input v-model:value="user.name" disabled>
              <template #prefix><user-outlined /></template>
            </a-input>
          </a-form-item>
          <a-form-item label="Email">
            <a-input v-model:value="user.email" disabled>
              <template #prefix><mail-outlined /></template>
              <template #suffix>
                <check-circle-outlined v-if="user.email_verified" class="email-verified" />
              </template>
            </a-input>
          </a-form-item>
        </a-form>
      </a-col>
      <a-col :xs="0" :sm="8">
        <img class="avatar" :src="user.picture" />
      </a-col>
    </a-row>

    <a-row>
      <a-col :xs="24" :sm="16">
        <a-form :layout="layout">
          <a-form-item label="Reddit">
            <a-input v-model:value="social.reddit" placeholder="u/username">
              <template #prefix><reddit-outlined /></template>
            </a-input>
          </a-form-item>
          <a-form-item label="Discord">
            <a-input v-model:value="social.discord" placeholder="Discord#0000" :disabled="discordVerified">
              <template #prefix>
                <icon name="la:discord" />
              </template>
              <template v-if="discordVerified" #suffix>
                <check-circle-outlined v-if="user.email_verified" class="email-verified" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item label="QQ">
            <a-input v-model:value="social.qq" placeholder="00000000">
              <template #prefix><qq-outlined /></template>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" :loading="loading" @click="saveSettings('social')">
              <save-outlined /> Save
            </a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </a-card>
</template>

<script setup>
import { useUserStore } from "~~/stores/user";
import { message } from "ant-design-vue";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { user, social } = storeToRefs(userStore);

const layout = "vertical";

const loading = ref(false);
const saveSettings = (key) => {
  loading.value = true;
  $fetch(`/api/users/${user.value.uid}`, {
    method: "post",
    body: social.value,
  })
    .then(() => {
      message.success("Setting updated sucessfully");
      loading.value = false;
    })
    .catch((error) => {
      message.error(error.message);
      loading.value = false;
    });
};

const discordVerified = computed(() => {
  return user.value && user.value.providers?.includes("discord");
});
</script>

<style>
.avatar {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 0;
  margin-bottom: 0;
  border-radius: 9999px;
}

.email-verified {
  color: #50d71e;
}
</style>