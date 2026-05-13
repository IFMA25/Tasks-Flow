<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
} from "vue";
import {
  useRoute,
  useRouter,
} from "vue-router";

import { useAdminPanelRequests } from "./api/useAdminPanelRequests";
import UserProfileHeader from "./components/UserProfileHeader.vue";
import { formatDate } from "./utils";

import { useProfileStore } from "@/shared/stores/useProfileStore";
import { RouteNames } from "@/shared/types/routeNames";
import VTitle from "@/shared/ui/common/VTitle.vue";

const UserPermissionsForm = defineAsyncComponent(() => import("./components/UserPermissionsForm.vue"));
const UserProfileForm = defineAsyncComponent(() => import("./components/UserProfileForm.vue"));

const route = useRoute();
const router = useRouter();
const profileStore = useProfileStore();
const { permissionsRequest, permissionsRoleRequest, userInfoRequest } = useAdminPanelRequests();

const userId = computed(() => {
  const id = route.query.id;
  return typeof id === "string" ? id : undefined;
});

const isUserManagementMode = computed(() => !!userId.value);

const { loading: permissionsLoad, data: permissionsData }
= permissionsRequest({
  immediate: isUserManagementMode.value,
});

const {
  loading: permissionsRoleLoad,
  data: permissionsRole,
} = permissionsRoleRequest({
  immediate: isUserManagementMode.value,
});

const { execute: fetchUser, loading: loadingInfoUser, data: dataInfoUser }
= userInfoRequest(() => userId.value, {
  immediate: isUserManagementMode.value,
  lazy: isUserManagementMode.value,
  onError: () => {
    router.push({ name: RouteNames.notFound });
  },
});

const isLoadingPage = computed(() =>
  loadingInfoUser.value ||
  permissionsRoleLoad.value ||
  permissionsLoad.value,
);

const userData = computed(() => {
  if (!isUserManagementMode.value) return profileStore.profileData;
  return dataInfoUser.value ? { ...dataInfoUser.value } : null;
});
const isLoading = computed(() => {
  return isUserManagementMode.value ? isLoadingPage.value : profileStore.loading;
});
</script>

<template>
  <UserProfileHeader
    :loading="isLoading"
    :title="userData?.name"
    :subtitle="userData?.email"
    :date="formatDate(userData?.createdAt, { month: 'long', year: 'numeric' })"
  />
  <VTitle
    :text="isUserManagementMode ? $t('userInfo.titleUserAcc') : $t('userInfo.titleOwnAcc')"
    class="mb-6"
  />
  <component
    :is="isUserManagementMode ? UserPermissionsForm : UserProfileForm"
    :user-id="userId"
    :user-data="userData"
    :permissions-role="permissionsRole"
    :permissions="permissionsData"
    :loading="isLoading"
    @update-success="fetchUser"
  />
</template>
